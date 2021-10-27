import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  ProgressBar
} from "react-bootstrap";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Logger from "./Logger";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { Card } from "../components/Card/Card.jsx";
import Button from "../components/CustomButton/CustomButton.jsx";
import NotificationSystem from "react-notification-system";
import { style } from "../variables/Variables.jsx";
import axios from "axios";
import { validate, requireDisabledButton } from "../validations/commons";
import {
  databaseCredentialList,
  databasesFromHost,
  schemasByDatabase,
  tablesBySchema
} from "../api/databases";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import filterSort from "./utils_csv";

class UploadCSV extends Component {
  state = {
    loaded: 0,
    selectedFile: null,
    finishedProcessFile: "stop",
    database: { value: "scrape", isValid: "success" },
    // schema: { value: "", isValid: null },
    schemas: [],
    selectedSchema: null,
    tables: [],
    selectedTable: null,
    inputSchemaValue: "",
    inputTableValue: "",
    inputDatabaseValue: "",
    hosts: [],
    databases: [],
    selectedHost: null,
    selectedDatabase: null,
    table: { value: "", isValid: null },
    delimiter: { value: ",", isValid: "success" },
    selectedOption: null,
    inputValue: "",
    file: "",
    showLog: false,
    isLoadingDatabases: false,
    isLoadingSchemas: false,
    isLoadingTables: false,
    errorForm: "",
    emptyTable: true
  };

  componentDidMount() {
    databaseCredentialList().then(res => {
      const { databasecredentials } = res;

      const optionsHost = databasecredentials.map(credential => {
        return { value: credential.id, label: credential.host };
      });

      this.setState(
        {
          hosts: optionsHost,
          selectedHost: optionsHost[0],
          isLoadingDatabases: true
        },
        () => {
          databasesFromHost(optionsHost[0].value).then(res => {
            const optionsDatabases = res.databases.map(name => {
              return { value: name.datname, label: name.datname };
            });

            this.setState({
              databases: optionsDatabases,
              isLoadingDatabases: false
            });
          });
        }
      );
    });
  }

  onChangeValue = e => {
    const state = {
      ...this.state,
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value,
        isValid: validate(e.target.value)
      }
    };

    this.setState(state);
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  onSubmitHandler = e => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", this.state.selectedFile);

    const {
      selectedDatabase,
      selectedTable,
      delimiter,
      selectedHost,
      selectedSchema,
      emptyTable
    } = this.state;

    let formValid = true;
    if (selectedHost == null) {
      this.setState({ errorForm: "Host is required" });
      formValid = false;
    } else if (selectedDatabase == null) {
      this.setState({ errorForm: "Database is required" });
      formValid = false;
    } else if (selectedSchema == null) {
      this.setState({ errorForm: "Schema is required" });
      formValid = false;
    } else if (selectedTable == null) {
      this.setState({ errorForm: "Table name is required" });
      formValid = false;
    } else if (
      this.state.selectedFile == null ||
      typeof this.state.selectedFile === "undefined"
    ) {
      this.setState({ errorForm: "Please select a csv file" });
      formValid = false;
    }
    if (formValid) {
      this.setState({ errorForm: "" });
      data.append("database", selectedDatabase.value);
      data.append("host", selectedHost.value);
      data.append("schema", selectedSchema.value);
      data.append("table", selectedTable.value);
      data.append("delimiter", delimiter.value);
      data.append("emptyTable", emptyTable);

      this.setState({ finishedProcessFile: "progress", showLog: false });

      axios
        .post("/connectors/upload", data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: Math.round(
                (ProgressEvent.loaded / ProgressEvent.total) * 100,
                2
              )
            });
          }
        })
        .then(res => {
          const {
            data: { file }
          } = res;

          this.setState({
            finishedProcessFile: "finished",
            file,
            showLog: true
          });
        });
    }
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleInputChange = inputSchemaValue => {
    this.setState({ inputSchemaValue });
  };

  handleInputChangeTable = inputTableValue => {
    this.setState({ inputTableValue });
  };

  handleInputChangeDatabase = inputDatabaseValue => {
    this.setState({ inputDatabaseValue });
  };

  createOption = label => ({
    label,
    value: label
  });

  handleKeyDown = event => {
    const { inputSchemaValue, schemas } = this.state;
    if (!inputSchemaValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        this.setState({
          inputSchemaValue: "",
          schemas: [...schemas, this.createOption(inputSchemaValue)]
        });
        event.preventDefault();
    }
  };

  handleKeyDownTable = event => {
    const { inputTableValue, tables } = this.state;
    if (!inputTableValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        this.setState({
          inputTableValue: "",
          tables: [...tables, this.createOption(inputTableValue)]
        });
        event.preventDefault();
    }
  };

  handleDatabase = selectedDatabase => {
    this.setState({ selectedDatabase, isLoadingSchemas: true }, () => {
      schemasByDatabase(
        this.state.selectedHost.value,
        selectedDatabase.value
      ).then(res => {
        const {
          data: { schema_list }
        } = res;

        const optionsSchema = schema_list.map(schema => {
          return { value: schema.schema_name, label: schema.schema_name };
        });

        this.setState({ schemas: optionsSchema, isLoadingSchemas: false });
      });
    });
  };

  handleChangeTable = selectedTable => {
    this.setState({ selectedTable: selectedTable });
  };

  handleChangeSchema = selectedSchema => {
    const { selectedHost, selectedDatabase } = this.state;

    this.setState({ selectedSchema, isLoadingTables: true }, () =>
      tablesBySchema(
        selectedHost.value,
        selectedDatabase.value,
        selectedSchema.value
      ).then(res => {
        const {
          data: { table_list }
        } = res;

        const optionsTable = table_list.map(table => {
          return { value: table.table_name, label: table.table_name };
        });

        this.setState({ tables: optionsTable, isLoadingTables: false });
      })
    );
  };

  handleChangeHost = selectedHost => {
    this.setState({ selectedHost }, () => {
      this.setState({ isLoadingDatabases: true });
      databasesFromHost(selectedHost.value).then(res => {
        const optionsDatabases = res.databases.map(name => {
          return { value: name.datname, label: name.datname };
        });

        this.setState({
          databases: optionsDatabases,
          isLoadingDatabases: false
        });
      });
    });
  };

  render() {
    const {
      databases,
      hosts,
      selectedHost,
      selectedDatabase,
      schemas,
      tables,
      delimiter,
      file,
      showLog,
      isLoadingDatabases,
      isLoadingSchemas,
      selectedSchema,
      errorForm,
      isLoadingTables,
      selectedTable,
      emptyTable,
      inputSchemaValue,
      inputTableValue,
      inputDatabaseValue
    } = this.state;
    return (
      <div className="content">
        <NotificationSystem ref={this.notificationSystem} style={style} />
        <Grid fluid>
          <Row>
            {this.state.finishedProcessFile === "progress" && (
              <Loader
                type="Circles"
                color="rgb(161, 232, 44)"
                height={100}
                width={100}
                className="loader"
              />
            )}

            {this.state.loaded > 0 &&
              this.state.finishedProcessFile === "progress" && (
                <>
                  <div>Progress file load</div>
                  <ProgressBar
                    now={this.state.loaded}
                    label={`${this.state.loaded}%`}
                  />
                </>
              )}

            <Col md={12}>
              <Card
                title="CSV to Database"
                content={
                  <>
                    <Col md={12}>
                      <div className="errorForm">{errorForm}</div>
                    </Col>
                    <form onSubmit={this.onSubmitHandler}>
                      <Col md={6}>
                        <FormGroup>
                          <ControlLabel>Host</ControlLabel>
                          <Select
                            placeholder={"Select host"}
                            options={hosts}
                            onChange={this.handleChangeHost}
                            value={selectedHost}
                          />
                        </FormGroup>

                        <FormGroup>
                          <ControlLabel>Database</ControlLabel>
                          <Select
                            placeholder={"Select database"}
                            options={filterSort(databases, inputDatabaseValue)}
                            onChange={this.handleDatabase}
                            value={selectedDatabase}
                            isLoading={isLoadingDatabases}
                            onInputChange={this.handleInputChangeDatabase}
                          />
                        </FormGroup>

                        <FormGroup>
                          <ControlLabel>Schema</ControlLabel>
                          <div className="helpField">
                            For create a new schema write the name and press
                            enter or tab twice
                          </div>
                          <CreatableSelect
                            placeholder={"Select or Create Schema"}
                            value={selectedSchema}
                            onChange={this.handleChangeSchema}
                            options={filterSort(schemas, inputSchemaValue)}
                            onKeyDown={this.handleKeyDown}
                            onInputChange={this.handleInputChange}
                            isLoading={isLoadingSchemas}
                          />
                        </FormGroup>

                        <FormGroup>
                          <ControlLabel>Table</ControlLabel>
                          <div className="helpField">
                            For create a new table write the name and press
                            enter or tab twice
                          </div>
                          <CreatableSelect
                            placeholder={"Select or Create Table"}
                            options={filterSort(tables, inputTableValue)}
                            value={selectedTable}
                            onChange={this.handleChangeTable}
                            isLoading={isLoadingTables}
                            onKeyDown={this.handleKeyDownTable}
                            onInputChange={this.handleInputChangeTable}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup validationState={delimiter.isValid}>
                          <ControlLabel>Delimiter</ControlLabel>
                          <FormControl
                            type="text"
                            name="delimiter"
                            onChange={this.onChangeValue}
                            value={delimiter.value}
                          />
                        </FormGroup>

                        <FormGroup>
                          <ControlLabel>Empty table</ControlLabel>
                          <br />
                          <BootstrapSwitchButton
                            checked={emptyTable}
                            onstyle="danger"
                            onChange={checked =>
                              this.setState({ emptyTable: checked })
                            }
                          />
                        </FormGroup>

                        <FormGroup controlId="formValidationSuccess1">
                          <ControlLabel>CSV File</ControlLabel>
                          <input
                            type="file"
                            name="name"
                            onChange={this.onChangeHandler}
                          />
                        </FormGroup>
                      </Col>

                      <Button bsStyle="success" pullRight fill type="submit">
                        CSV to Database
                      </Button>
                      <div className="clearfix" />
                    </form>
                    <div className="clearfix"></div>
                    {showLog && (
                      <Logger
                        type_logger="log_file"
                        logger={{ file, name_logger: "" }}
                      />
                    )}
                  </>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UploadCSV;
