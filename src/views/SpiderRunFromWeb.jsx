import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import Select from "react-select";
import Button from "../components/CustomButton/CustomButton.jsx";

import { Card } from "../components/Card/Card.jsx";
import { validate } from "../validations/commons";
import { runSpider, getConfigs } from "../api/clients";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Logger from "./Logger";
import {
  getSpidersConfigParams,
  getAllSpiderConfigs,
  getAllDataOrigin,
  getColumnsName
} from "../api/spiders";

import BootstrapSwitchButton from "bootstrap-switch-button-react";
import MiddleWareSpider from "./MiddleWareSpider";

class SpiderRunFromWeb extends Component {
  state = {
    data_origin: {
      value: "",
      isValid: null
    },
    final_schema: { value: "", isValid: null },
    log_name: { value: "", isValid: null },
    configs: [],
    loading: false,
    showLogger: false,
    content: "",
    status_spider: "",
    selectedConfig: null,
    optionsConfig: [],
    optionsDataOrigin: [],
    selectDataOrigin: null,
    optionsColumnOrigin: [],
    selectedColumnOrigin: null,
    default_data_origin_table: null,
    default_data_origin_field: null,
    concurrent_request: { value: "32", isValid: null },
    download_delay: { value: null, isValid: null },
    enabledProxy: false,
    AUTOTHROTTLE_ENABLED: true,
    RANDOM_UA_PER_PROXY: true,
    PROXYMESH_TIMEOUT: { value: "60", isValid: null },
    AUTOTHROTTLE_DEBUG: false,
    ROBOTSTXT_OBEY: false,
    DEPTH_PRIORITY: { value: "", isValid: null },
    AUTOTHROTTLE_TARGET_CONCURRENCY: { value: "32.0", isValid: null },
    AUTOTHROTTLE_START_DELAY: { value: "", isValid: null },
    middlewareList: []
  };

  componentDidMount() {
    getAllDataOrigin().then(res => {
      const {
        data: { data_origin }
      } = res;

      if (data_origin.length > 0) {
        const optionsDataOrigin = data_origin.map(data_origin => {
          return {
            value: data_origin.table_name,
            label: data_origin.table_name
          };
        });

        this.setState({ optionsDataOrigin });
      }
    });

    getAllSpiderConfigs().then(res => {
      const {
        data: { configs }
      } = res;

      const optionsConfig = configs.map(config => {
        return { value: config, label: config };
      });

      this.setState({ optionsConfig });
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

  handleMiddlewares = middlewareList => {
    this.setState({ middlewareList });
  };

  onSubmitHandler = _ => {
    const {
      selectDataOrigin,
      selectedColumnOrigin,
      final_schema,
      log_name,
      selectedConfig,
      concurrent_request,
      download_delay,
      enabledProxy,
      AUTOTHROTTLE_ENABLED,
      RANDOM_UA_PER_PROXY,
      AUTOTHROTTLE_DEBUG,
      ROBOTSTXT_OBEY,
      PROXYMESH_TIMEOUT,
      DEPTH_PRIORITY,
      AUTOTHROTTLE_TARGET_CONCURRENCY,
      AUTOTHROTTLE_START_DELAY,
      middlewareList
    } = this.state;

    let validationsSuccess = true;

    if (selectedConfig === null) {
      this.setState({ status_spider: "Spider config is required" });
      validationsSuccess = false;
    } else if (selectDataOrigin === null) {
      this.setState({ status_spider: "Data origin is required" });
      validationsSuccess = false;
    } else if (selectedColumnOrigin === null) {
      this.setState({ status_spider: "Data column origin is required" });
      validationsSuccess = false;
    } else if (final_schema.value === "") {
      this.setState({ status_spider: "Final Schema is required" });
      validationsSuccess = false;
    } else if (log_name.value === "") {
      this.setState({ status_spider: "Log name is required" });
      validationsSuccess = false; //download_delay
    } else if (concurrent_request.value === "") {
      this.setState({ status_spider: "Concurrent request is required" });
      validationsSuccess = false;
    }

    if (validationsSuccess) {
      this.setState({
        status_spider: "Spider is running",
        loading: true,
        showLogger: true
      });

      runSpider(
        selectDataOrigin.value,
        final_schema.value,
        selectedConfig.value,
        selectedColumnOrigin.value,
        log_name.value,
        concurrent_request.value,
        download_delay.value,
        enabledProxy,
        AUTOTHROTTLE_ENABLED,
        RANDOM_UA_PER_PROXY,
        AUTOTHROTTLE_DEBUG,
        ROBOTSTXT_OBEY,
        PROXYMESH_TIMEOUT.value,
        DEPTH_PRIORITY.value,
        AUTOTHROTTLE_TARGET_CONCURRENCY.value,
        AUTOTHROTTLE_START_DELAY.value,
        middlewareList
      ).then(res => {
        const {
          data: { success, origin_table, origin_column }
        } = res;
        this.setState({ loading: false });

        if (success == false) {
          this.setState({
            status_spider: "Fail to run spider"
          });
          // if (origin_table == "error") {
          //   this.setState({
          //     status_spider: "Fail to run spider due to invalid data origin",
          //     data_origin: { isValid: "error" }
          //   });
          // } else if (origin_column == "error") {
          //   this.setState({
          //     status_spider: "Fail to run spider due to invalid origin column",
          //     column_origin: { isValid: "error" }
          //   });
          // }
        }
      });
    }
  };

  findConfigs = _ => {
    const {
      config_name: { value }
    } = this.state;

    getConfigs(value).then(res => {
      const {
        data: { configs }
      } = res;

      this.setState({ configs });
    });
  };

  handleChange = selectedConfig => {
    this.setState({ selectedConfig }, () => {
      getSpidersConfigParams(selectedConfig.value).then(res => {
        const {
          data: {
            default_data_origin_table,
            default_data_origin_field,
            concurrent_request,
            download_delay,
            depth_priority,
            auto_target_concurrence,
            start_delay,
            proxy_mesh_timeout
          }
        } = res;

        this.setState({
          default_data_origin_table,
          default_data_origin_field,
          concurrent_request: { value: concurrent_request },
          download_delay: { value: download_delay },
          DEPTH_PRIORITY: { value: depth_priority },
          AUTOTHROTTLE_TARGET_CONCURRENCY: { value: auto_target_concurrence },
          AUTOTHROTTLE_START_DELAY: { value: start_delay },
          PROXYMESH_TIMEOUT: { value: proxy_mesh_timeout }
        });

        this.handleChangeDataOrigin({
          value: default_data_origin_table,
          label: default_data_origin_table
        });
      });
    });
  };

  handleChangeDataOrigin = selectDataOrigin => {
    this.setState({ selectDataOrigin }, () => {
      getColumnsName(selectDataOrigin.value).then(res => {
        const {
          data: { columns_origin }
        } = res;

        const optionsColumnOrigin = columns_origin.map(col => {
          return { value: col.column_name, label: col.column_name };
        });

        const { default_data_origin_field } = this.state;

        this.setState({ optionsColumnOrigin }, () => {
          this.handleChangeColumnOrigin({
            value: default_data_origin_field,
            label: default_data_origin_field
          });
        });
      });
    });
  };

  handleChangeColumnOrigin = selectedColumnOrigin => {
    this.setState({ selectedColumnOrigin });
  };

  render() {
    const {
      final_schema,
      configs,
      loading,
      showLogger,
      log_name,
      status_spider,
      optionsConfig,
      selectedConfig,
      optionsDataOrigin,
      selectDataOrigin,
      optionsColumnOrigin,
      selectedColumnOrigin,
      concurrent_request,
      download_delay,
      enabledProxy,
      AUTOTHROTTLE_ENABLED,
      RANDOM_UA_PER_PROXY,
      AUTOTHROTTLE_DEBUG,
      ROBOTSTXT_OBEY,
      PROXYMESH_TIMEOUT,
      DEPTH_PRIORITY,
      AUTOTHROTTLE_TARGET_CONCURRENCY,
      AUTOTHROTTLE_START_DELAY
    } = this.state;

    return (
      <>
        <div className="content">
          <Col md={12}>
            <Card
              title="Config data to run Spider from web"
              content={
                <form>
                  <h2>{status_spider}</h2>
                  {loading && (
                    <>
                      <Loader
                        type="Circles"
                        color="rgb(161, 232, 44)"
                        height={100}
                        width={100}
                        className="loader"
                      />
                    </>
                  )}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <ControlLabel>Spider Config</ControlLabel>
                        <Select
                          value={selectedConfig}
                          onChange={this.handleChange}
                          options={optionsConfig}
                          placeholder={"Select config"}
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel>Data Origin</ControlLabel>
                        <Select
                          onChange={this.handleChangeDataOrigin}
                          value={selectDataOrigin}
                          options={optionsDataOrigin}
                          placeholder={"Select data origin"}
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel>Column Origin</ControlLabel>
                        <Select
                          onChange={this.handleChangeColumnOrigin}
                          value={selectedColumnOrigin}
                          options={optionsColumnOrigin}
                          placeholder={"Select column origin"}
                        />
                      </FormGroup>

                      <FormGroup validationState={final_schema.isValid}>
                        <ControlLabel>Final Schema</ControlLabel>
                        <FormControl
                          type="text"
                          name="final_schema"
                          value={final_schema.value}
                          onChange={this.onChangeValue}
                        />
                      </FormGroup>

                      <FormGroup validationState={log_name.isValid}>
                        <ControlLabel>Log name</ControlLabel>
                        <div className="helpField">
                          Log name is used to named logs files for track
                          individual spider execution
                        </div>
                        <FormControl
                          type="text"
                          name="log_name"
                          value={log_name.value}
                          onChange={this.onChangeValue}
                        />
                      </FormGroup>

                      <Button
                        bsStyle="success"
                        pullLeft
                        fill
                        onClick={this.onSubmitHandler}
                      >
                        Run Spider
                      </Button>
                    </Col>

                    <Col md={6}>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <ControlLabel>Concurrent request</ControlLabel>
                            <FormControl
                              type="text"
                              name="concurrent_request"
                              value={concurrent_request.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <ControlLabel>Download delay</ControlLabel>
                            <FormControl
                              type="text"
                              name="download_delay"
                              value={download_delay.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>AUTOTHROTTLE_DEBUG</ControlLabel>
                            <br />
                            <BootstrapSwitchButton
                              checked={AUTOTHROTTLE_DEBUG}
                              onstyle="danger"
                              onChange={checked =>
                                this.setState({ AUTOTHROTTLE_DEBUG: checked })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>AUTOTHROTTLE_ENABLED</ControlLabel>
                            <br />
                            <BootstrapSwitchButton
                              checked={AUTOTHROTTLE_ENABLED}
                              onstyle="danger"
                              onChange={checked =>
                                this.setState({ AUTOTHROTTLE_ENABLED: checked })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>ROBOTSTXT_OBEY</ControlLabel>
                            <br />
                            <BootstrapSwitchButton
                              checked={ROBOTSTXT_OBEY}
                              onstyle="danger"
                              onChange={checked =>
                                this.setState({ ROBOTSTXT_OBEY: checked })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>Enabled PROXYMESH</ControlLabel>
                            <br />
                            <BootstrapSwitchButton
                              checked={enabledProxy}
                              onstyle="danger"
                              onChange={checked =>
                                this.setState({ enabledProxy: checked })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>RANDOM_UA_PER_PROXY</ControlLabel>
                            <br />
                            <BootstrapSwitchButton
                              checked={RANDOM_UA_PER_PROXY}
                              onstyle="danger"
                              onChange={checked =>
                                this.setState({ RANDOM_UA_PER_PROXY: checked })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>PROXYMESH_TIMEOUT</ControlLabel>
                            <FormControl
                              type="text"
                              name="PROXYMESH_TIMEOUT"
                              value={PROXYMESH_TIMEOUT.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>DEPTH_PRIORITY</ControlLabel>
                            <FormControl
                              type="text"
                              name="DEPTH_PRIORITY"
                              value={DEPTH_PRIORITY.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>AUTOTHROT_TARGET_CONCUR</ControlLabel>
                            <FormControl
                              type="text"
                              name="AUTOTHROTTLE_TARGET_CONCURRENCY"
                              value={AUTOTHROTTLE_TARGET_CONCURRENCY.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>AUTOTHROT_START_DELAY</ControlLabel>
                            <FormControl
                              type="text"
                              name="AUTOTHROTTLE_START_DELAY"
                              value={AUTOTHROTTLE_START_DELAY.value}
                              onChange={this.onChangeValue}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <MiddleWareSpider
                        handleMiddlewares={this.handleMiddlewares}
                      />
                    </Col>
                  </Row>
                </form>
              }
            />
          </Col>

          <Col md={12}>
            {showLogger && (
              <Logger
                type_logger="log_file"
                logger={{ name_logger: log_name.value }}
              />
            )}
          </Col>
        </div>
      </>
    );
  }
}
export default SpiderRunFromWeb;
