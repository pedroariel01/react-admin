import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import { newClient } from "../../api/clients";
import { validate, requireDisabledButton } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";
import Select from "react-select";
import {getConfigsAssesor, getCounties, getCountries, getStates, newAssessorClient} from "../../api/clientsAssessor";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import filterSort from "../utils_csv";

class ClientAssessorNew extends Component {
  state = {
        countryList:[],
        countyList:[],
        statesList:[],
        configList:[],
        currentCounty:"",
        currentState:"",
        currentConfig:"",
        currentCountry:"",

      inputCountyValue :"",
        inputStateValue:"",

        isLoadingCounty:true,
        isLoadingState:true,
        isLoadingConfig:true,
      is_scraping :false,
    name: { value: "", isValid: null },
    loading: false
  };

  componentDidMount() {
      getCountries().then(result => {
                const optionsState = result.map(dat => {
                    return {value: dat, label: dat};
                });
                this.setState({
                        countryList: optionsState
                    });
      });



  }

  handleChange = e => {
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

  addNotification = _ => {
    const { name } = this.state;
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: (
        <div>
          Client <b>{name.value}</b> successfully saved.
        </div>
      ),
      level: "info"
    });
  };

  handleCounties = selectedCounty => {
        this.setState({currentCounty:selectedCounty, isLoadingConfig:true},
            ()=>
            {
              const {currentState} = this.state
              getConfigsAssesor(currentState.label,selectedCounty.label).then(
                  response =>{

                          const optionsField = response.map(field => {
                              return {value: field, label: field};
                          });
                          this.setState({
                                  configList: optionsField
                              },
                              () => {
                                  this.setState(
                                      {isLoadingConfig: false}
                                  );
                              });


               })
            }
            );
    };

  handleConfigs = selectedConfig => {
        this.setState({currentConfig:selectedConfig});
    };


  handleState = selectedState => {
        this.setState({currentState:selectedState, isLoadingCounty:true},
            ()=>
            {getCounties(selectedState.label).then(
                response =>{
                    if(response.is_array){
                        const optionsField = response.data.map(field => {
                              return {value: field, label: field};
                          });
                          this.setState({
                                  configList: optionsField
                              },
                              () => {
                                  this.setState(
                                      {isLoadingConfig: false}
                                  );
                              });

                    }
                    else {
                        const optionsField = response.data.map(field => {
                            return {value: field, label: field};
                        });
                        this.setState({
                                countyList: optionsField
                            },
                            () => {
                                this.setState(
                                    {isLoadingCounty: false}
                                );
                            });
                    }
            }
            )
            });

    };

  handleCountry = selectedCountry => {
        this.setState({currentCountry:selectedCountry, isLoadingState:true},
            ()=>
            {
                getStates(selectedCountry.value).then(result =>
                {
                    if(result.is_array){
                        const optionsField = result.data.map(field => {
                                      return {value: field, label: field};
                                  });
                                  this.setState({
                                          configList: optionsField
                                      },
                                      () => {
                                          this.setState(
                                              {isLoadingConfig: false}
                                          );
                                      });
                    }
                    else {

                        const optionsState = result.data.map(dat => {
                            return {value: dat, label: dat};
                        });
                        this.setState({
                                statesList: optionsState
                            },
                            () => {
                                this.setState(
                                    {isLoadingState: false}
                                );
                            });
                    }

        });
            });

    };

  handleInputChangeCounty = inputCountyValue => {
        this.setState({ inputCountyValue });
     };

  handleInputChangeState = inputStateValue => {
        this.setState({ inputStateValue });
     };

  handleCountyKeyDown = event => {
        const { inputCountyValue, countyList } = this.state;
        if (!inputCountyValue) return;
        switch (event.key) {
          case "Enter":
          case "Tab":
            this.setState({
              inputCountyValue: "",
              countyList: [...countyList, this.createOption(inputCountyValue)]
            });
            event.preventDefault();
        }
   };

  handleStateKeyDown = event => {
        const { inputStateValue, statesList } = this.state;
        if (!inputStateValue) return;
        switch (event.key) {
          case "Enter":
          case "Tab":
            this.setState({
              inputStateValue: "",
              statesList: [...statesList, this.createOption(inputStateValue)]
            });
            event.preventDefault();
        }
   };

  createOption = label => ({
        label:label,
        value: label
    });

  onSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    const {name,currentState,currentCounty,currentConfig,is_scraping, currentCountry} = this.state;
    newAssessorClient(name.value,currentCountry.value,currentState.label,currentCounty.label,currentConfig.label,is_scraping).then(res => {
      this.setState({
        name: { value: "", isValid: null },
        configList:[],
        currentCounty:"",
          currentState:"",
        currentConfig:"",
          inputCountyValue:"",
          inputStateValue:"",
        isLoadingCounty:true,
        isLoadingConfig:true,
        loading: false,
          is_scraping: false
      });

      this.addNotification();
    });
  };

  notificationSystem = React.createRef();

  render() {
    const { loading, name, countyList, countryList,currentCountry,
      currentCounty,isLoadingCounty,statesList,isLoadingState,currentState,is_scraping,
        configList,currentConfig, isLoadingConfig, inputStateValue, inputCountyValue
    } = this.state;

    return (
      <>
        <h3 className="title-page">Client new</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/clientAssessor">Client List</Link>
            </li>
            <li className="active">
              <span>Client new</span>
            </li>
          </ol>

          <NotificationSystem ref={this.notificationSystem} style={style} />
          <Grid fluid>
            <Row>
              {loading && (
                <Loader
                  type="Circles"
                  color="rgb(161, 232, 44)"
                  height={100}
                  width={100}
                  className="loader"
                />
              )}

              <Col md={12}>
                {!loading && (
                  <Card
                    content={
                      <form onSubmit={this.onSubmit}>
                        <FormGroup
                          controlId="formValidationSuccess1"
                          validationState={name.isValid}
                        >
                          <ControlLabel>Client name</ControlLabel>
                          <FormControl
                            type="text"
                            name="name"
                            value={name.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                          <FormGroup>
                              <ControlLabel>Available Countries</ControlLabel>
                              <Select
                                placeholder={"Select Country"}
                                options={countryList}
                                onChange={this.handleCountry}
                                value={currentCountry}

                              />
                            </FormGroup>

                        <FormGroup>
                              <ControlLabel>Available States</ControlLabel>
                              <Select
                                placeholder={"Select State"}
                                options={filterSort(statesList,inputStateValue)}
                                onKeyDown={this.handleStateKeyDown}
                                onChange={this.handleState}
                                value={currentState}
                                isLoading={isLoadingState}
                                onInputChange={this.handleInputChangeState}
                              />
                            </FormGroup>


                             <FormGroup>
                              <ControlLabel>Available Counties</ControlLabel>
                              <Select
                                placeholder={"Select County"}
                                options={filterSort(countyList,inputCountyValue)}
                                onKeyDown={this.handleCountyKeyDown}
                                onChange={this.handleCounties}
                                value={currentCounty}
                                isLoading={isLoadingCounty}
                                onInputChange={this.handleInputChangeCounty}

                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Available Configs</ControlLabel>
                              <Select
                                placeholder={"Select Available Config"}
                                options={configList}
                                onChange={this.handleConfigs}
                                value={currentConfig}
                                isLoading={isLoadingConfig}
                              />
                            </FormGroup>

                              <FormGroup>
                                  <ControlLabel>Scraping</ControlLabel>
                                  <br />
                                  <BootstrapSwitchButton
                                    checked={is_scraping}
                                    onstyle="danger"
                                    offstyle="primary"
                                    onChange={checked =>
                                      this.setState({ is_scraping: checked })
                                    }
                                  />
                              </FormGroup>

                        <Button
                          bsStyle="success"
                          pullRight
                          fill
                          type="submit"
                          disabled={requireDisabledButton(this.state, ["name"])}
                        >
                          Create client
                        </Button>
                        <div className="clearfix" />
                      </form>
                    }
                  />
                )}
              </Col>
            </Row>
          </Grid>
        </div>
      </>
    );
  }
}

export default ClientAssessorNew;
