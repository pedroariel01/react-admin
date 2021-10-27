import React, {Component} from "react";
import {
    clientsAssessor,
    getCounties,
    getDataOrigins, getSchemas,
    getStates,
    newConsolidationSchema
} from "../../api/clientsAssessor";
import {validate} from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import {style} from "../../variables/Variables";
import {Col, ControlLabel, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import Button from "../../components/CustomButton/CustomButton.jsx";
import Loader from "react-loader-spinner";
import {Card} from "../../components/Card/Card";
import Select from "react-select";
import filterSort from "../utils_csv";


class ConsSchemaCreate extends Component{
    state = {
        countyList:[],
        statesList:[],
        dataOriginList: [],
        completeDataOriginList: [],
        dataOriginFieldList:[],
        schemaList:[],
        completeSchemas:[],
        clientsList:[],

        currentDataOrigin:"",
        currentDataOriginField:"",
        currentSchema_1:"",
        currentSchema_2:"",
        currentCounty:"",
        currentState:"",

        inputConsolidationName:{ value: "", isValid: null },

        inputDatOriginValue:"",
        inputState:"",
        inputCounty:"",

        isLoadingDataOrigin: true,
        isLoadingFields : true,
        schemaLoading:true,
        loading : false
    };

    componentDidMount() {
        getDataOrigins().then(result => {

            const optionsDat = result.map(dat => {
                return {value: dat.name, label: dat.name};
            });
            this.setState({
                    dataOriginList: optionsDat,
                    completeDataOriginList:result
                },
                () => {
                    this.setState(
                        {isLoadingDataOrigin: false}
                    );
                });
        });
        getStates().then(result =>
        {
            const optionsState = result.map(dat => {
            return { value: dat, label:dat };
            });
            this.setState({statesList : optionsState
               },
                ()=>{
                this.setState(
                    {isLoadingState : false}
                );
                });

        });
        getSchemas().then(result => {
            this.setState({completeSchemas:result},
                ()=>{
                this.setState(
                    {schemaLoading : false})
                } );
        });
        clientsAssessor()
            .then(response => {
            this.setState({clientsList: response})
            });

    }

    handleState = selectedState => {
        this.setState({currentState:selectedState, isLoadingCounty:true,currentCounty:""},
            ()=>
            {getCounties(selectedState.label).then(
                response =>{
                const optionsField = response.map(field => {
                    return {value: field, label: field};
                });
                this.setState({countyList : optionsField
                },
                ()=>{
                this.setState(
                    {isLoadingCounty : false}
                );
                });

            }
            );


            });
    };

    handleInputChangeDataOrigin = inputDatOriginValue => {
        this.setState({ inputDatOriginValue });
     };

    handleInputState = inputState => {
        this.setState({ inputState });
     };

    handleInputCounty = inputCounty => {
        this.setState({ inputCounty });
     };



    handleCounty = selectedCounty => {
        const {currentState} = this.state;
        this.setState({currentCounty:selectedCounty, schemaLoading:true},
            ()=>
            {

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

    handleSchema_1 = selectedSchema => {
        this.setState({currentSchema_1:selectedSchema});
    };

    handleSchema_2 = selectedSchema => {
        this.setState({currentSchema_2:selectedSchema});
    };

    handleDataOrigin = selectedDataOrign => {
        this.setState({ currentDataOrigin:selectedDataOrign,isLoadingFields:true },
            ()=>{
                const{completeDataOriginList}=this.state;
                const data_origin = completeDataOriginList.filter( data_or =>
                    data_or.name === selectedDataOrign.label
                )[0];
                this.setState({dataOriginFieldList:[{value:data_origin.field,label:data_origin.field}]
                    },
                        ()=>{
                        this.setState(
                            {isLoadingFields : false}
                        );

                    });

            });
     };

    addNotification = _ => {
        const { currentDataOrigin } = this.state;
        const notification = this.notificationSystem.current;
        notification.addNotification({
          message: (
            <div>
              Schema Consolidation  <b>{currentDataOrigin.value}</b> successfully Created.
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
            currentSchema_1,currentSchema_2,inputConsolidationName} = this.state;
        // console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
        newConsolidationSchema(currentDataOrigin.label,currentDataOriginField.value,
            currentSchema_1.label,currentSchema_2.label,inputConsolidationName.value).then(res => {
            // console.log(res);
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
                inputConsolidationName:{ value: "", isValid: null },
                currentDataOrigin: { value: "", isValid: null },
                currentDataOriginField: { value: "", isValid: null },
                currentSchema_1:{ value: "", isValid: null },
                currentSchema_2: { value: "", isValid: null }
          });

        });
   };

    filterSchemaClients(schemas) {

        const{currentState,currentCounty, clientsList} = this.state;
        const clientFilter = clientsList.filter(cli => {

            if(currentState!==''&& cli.state!==currentState.label){
                return false;
            }
            if(currentCounty!==''&& cli.county!==currentCounty.label){
                return false;
            }

            return true;
        });

        const schemasFiltered =  schemas.filter( schem => clientFilter.some( clien => {
                return clien.url===schem.client;
            }
        ));

        return   schemasFiltered.map(dat => {
            return { value: dat.name, label:dat.name };
            });


    }


    notificationSystem = React.createRef();


    render() {
        const {
            dataOriginList,
            dataOriginFieldList,
            countyList,
            completeSchemas,
            statesList,
            currentSchema_2,
            currentSchema_1,
            currentCounty,currentDataOrigin,
            currentDataOriginField,
            currentState,
            loading,
            isLoadingDataOrigin,isLoadingFields,schemaLoading,inputConsolidationName,
            inputDatOriginValue,
            inputState,
            inputCounty
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
                    title="Schema Consolidation"
                    content={
                      <>

                        <form  onSubmit={this.onSubmit}>
                          <Col md={6}>

                             <FormGroup
                                  controlId="formValidationSuccess1"
                                  validationState={inputConsolidationName.isValid}
                                >
                                  <ControlLabel>Consolidation Schema Name</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="inputConsolidationName"
                                    value={inputConsolidationName.value}
                                    onChange={this.handleChange}
                                  />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>State</ControlLabel>
                              <Select
                                placeholder={"Select State"}
                                options={filterSort(statesList, inputState)}
                                onChange={this.handleState}
                                value={currentState}
                                onInputChange={this.handleInputState}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Data County</ControlLabel>
                              <Select
                                placeholder={"Select County"}
                                options={filterSort(countyList,inputCounty)}
                                onChange={this.handleCounty}
                                value={currentCounty}
                                onInputChange={this.handleInputCounty}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Data Origin</ControlLabel>
                              <Select
                                placeholder={"Select Data Origin"}
                                options={filterSort(dataOriginList, inputDatOriginValue)}
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
                                options={dataOriginFieldList}
                                onChange={this.handleDataOriginFields}
                                value={currentDataOriginField}
                                isLoading={isLoadingFields}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Schema 1</ControlLabel>
                              <Select
                                placeholder={"Select First Schema"}
                                options={this.filterSchemaClients(completeSchemas)}
                                onChange={this.handleSchema_1}
                                value={currentSchema_1}
                                isLoading={schemaLoading}

                              />
                            </FormGroup>

                              <FormGroup>
                              <ControlLabel>Schema 2</ControlLabel>
                              <Select
                                placeholder={"Select Second Schema"}
                                options={this.filterSchemaClients(completeSchemas)}
                                onChange={this.handleSchema_2}
                                value={currentSchema_2}
                                isLoading={schemaLoading}

                              />
                            </FormGroup>



                          <Button bsStyle="success" pullLeft fill type="submit">
                            Create Consolidation Schema
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



} export default ConsSchemaCreate