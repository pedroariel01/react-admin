import React, {Component} from "react";
import {getDataOriginFields, getDataOrigins, newAssessorDataOrigin, newAssessorTask} from "../../api/clientsAssessor";
import Button from "../../components/CustomButton/CustomButton.jsx";
import {Col, ControlLabel, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import {Card} from "../../components/Card/Card";
import Select from "react-select";
import filterSort from "../utils_csv";
import {validate} from "../../validations/commons";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import {clientsAssessor} from "../../api/clientsAssessor";
import NotificationSystem from "react-notification-system";
import {style} from "../../variables/Variables";
import Loader from "react-loader-spinner";



class DataOriginAssessor extends Component{
    state = {
        dataOriginList: [],
        completeDataOriginList :[],
        dataOriginFieldList:[],
        clientsList:[],
        layerText :{value:"",isValid:null},

        currentDataOrigin:"",
        currentDataOriginField:"",
        currentClient:"",

        inputDatOriginValue :"",
        inputFieldValue:"",

        isLoadingDataOrigin: true,
        isLoadingFields : true,
        clientLoading:true,
        extract:false,
        loading : false
    };


    componentDidMount() {
        getDataOrigins().then( result =>
        {

            if(result.length){
                this.setState({completeDataOriginList:result});
                const optionsDat = result.map(dat => {
                    return {value: dat.name, label: dat.name};
                });
                this.setState({
                        dataOriginList: optionsDat
                    },
                    () => {
                        this.setState(
                            {isLoadingDataOrigin: false}
                        );
                    });
            }
        });

        clientsAssessor().then(data => {

            const optionsField = data.map(field => {
                    return {value: field.url, label: field.name};
                });
            this.setState({clientsList: optionsField, clientLoading: false});
        });

    };

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

    handleDataOriginFields = selectedField => {
        this.setState({currentDataOriginField:selectedField});
    };

    handleClient = selectedClient => {
        this.setState({currentClient:selectedClient});
    };


     handleInputChangeDataOrigin = inputDatOriginValue => {
        this.setState({ inputDatOriginValue });
     };

     handleInputChangeField = inputFieldValue => {
        this.setState({ inputFieldValue });
     };

     handleDataOrigin = selectedDataOrign => {
        this.setState({ currentDataOrigin:selectedDataOrign,isLoadingFields:true },
            ()=>{

            const{completeDataOriginList}=this.state;
            const data_origin = completeDataOriginList.filter( data_or =>
                data_or.name === selectedDataOrign.label
            );
            if(data_origin.length){
                this.setState({dataOriginFieldList:[{value:data_origin[0].field,label:data_origin[0].field}]
            },
                ()=>{
                this.setState(
                    {isLoadingFields : false}
                );

            });
            }

            //  getDataOriginFields(selectedDataOrign.label).then(response =>{
            //     const optionsField = response.map(field => {
            //         return {value: field, label: field};
            //     });
            //     this.setState({dataOriginFieldList : optionsField
            //     },
            //     ()=>{
            //     this.setState(
            //         {isLoadingFields : false}
            //     );
            //     });
            //
            // })
            });
     };

   createOption = label => ({
        label:label,
        value: label
    });

   handleKeyDown = event => {
        const { inputDatOriginValue, dataOriginList } = this.state;
        if (!inputDatOriginValue) return;
        switch (event.key) {
          case "Enter":
          case "Tab":
            this.setState({
              inputDatOriginValue: "",
              dataOriginList: [...dataOriginList, this.createOption(inputDatOriginValue)]
            });
            event.preventDefault();
        }
   };

   handleFieldKeyDown = event => {
        const { inputFieldValue, dataOriginFieldList } = this.state;
        if (!inputFieldValue) return;
        switch (event.key) {
          case "Enter":
          case "Tab":
            this.setState({
              inputFieldValue: "",
              dataOriginFieldList: [...dataOriginFieldList, this.createOption(inputFieldValue)]
            });
            event.preventDefault();
        }
   };

   addNotification = _ => {
        const { currentDataOrigin } = this.state;
        const notification = this.notificationSystem.current;
        notification.addNotification({
          message: (
            <div>
              Data Origin Client <b>{currentDataOrigin.value}</b> successfully saved.
            </div>
          ),
          level: "info"
        });
   };

    addErrorNotification = err => {

        const notification = this.notificationSystem.current;
        notification.addNotification({
          message: (
            <div>
               <b>{err}</b>
            </div>
          ),
          level: "error"
        });
    };

   onSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });

        const {currentDataOrigin,currentDataOriginField,
            currentClient,layerText,extract} = this.state;
        // console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
        newAssessorDataOrigin(currentDataOrigin.label,currentDataOriginField.value,
            currentClient.value,layerText.value,extract).then(res => {
            console.log(res);
            if(res.data.hasOwnProperty('errors') && res.data.errors)
            {
               Object.values(res.data.errors).forEach( err =>
                {
                    this.addErrorNotification(err);

                });
            }
            else {
                this.addNotification();
            }
            this.setState({
            currentDataOrigin: { value: "", isValid: null },
            inputDatOriginValue:"",
            currentDataOriginField:"",
            currentClient:"",
            layerText: { value: "", isValid: null },
            extract:false,
            loading: false
          });

        });
   };

  notificationSystem = React.createRef();


    render() {
        const {
            dataOriginList,
            currentDataOrigin,
            isLoadingDataOrigin,
            inputDatOriginValue,
            inputFieldValue,
            dataOriginFieldList,
            currentDataOriginField,
            isLoadingFields,
            layerText,
            clientLoading,
            currentClient,
            clientsList,
            extract,
            loading
        } = this.state;
        return(
            <>
            <div className="content">
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
                    title="Client Data Origins"
                    content={
                      <>

                        <form  onSubmit={this.onSubmit}>
                          <Col md={6}>
                            <FormGroup>
                              <ControlLabel>Data Origin</ControlLabel>
                              <div className="helpField">
                                    For creating a new data origin table
                                    write the name and press
                                    enter or tab twice
                              </div>
                              <Select
                                placeholder={"Select Data Origin"}
                                options={filterSort(dataOriginList, inputDatOriginValue)}
                                onKeyDown={this.handleKeyDown}
                                onChange={this.handleDataOrigin}
                                value={currentDataOrigin}
                                isLoading={isLoadingDataOrigin}
                                onInputChange={this.handleInputChangeDataOrigin}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Data Origin Fields</ControlLabel>
                              <Select
                                placeholder={"Select Data Origin Fields"}
                                options={filterSort(dataOriginFieldList, inputFieldValue)}
                                onKeyDown={this.handleFieldKeyDown}
                                onChange={this.handleDataOriginFields}
                                value={currentDataOriginField}
                                isLoading={isLoadingFields}
                                onInputChange={this.handleInputChangeField}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Clients</ControlLabel>
                              <Select
                                placeholder={"Select Client"}
                                options={clientsList}
                                onChange={this.handleClient}
                                value={currentClient}
                                isLoading={clientLoading}

                              />
                            </FormGroup>

                            <FormGroup
                                  controlId="formValidationSuccess1"
                                  validationState={layerText.isValid}
                                >
                                  <ControlLabel>Layer</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="layerText"
                                    value={layerText.value}
                                    onChange={this.handleChange}
                                  />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Extract</ControlLabel>
                              <br />
                              <BootstrapSwitchButton
                                checked={extract}
                                onstyle="danger"
                                onChange={checked =>
                                  this.setState({ extract: checked })
                                }
                              />
                          </FormGroup>

                          <Button bsStyle="success" pullRight fill type="submit">
                            Create Client Data Origin
                          </Button>

                          </Col>

                          <div className="clearfix" />
                        </form>
                      </>
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

export default DataOriginAssessor