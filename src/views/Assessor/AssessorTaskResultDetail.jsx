import React, { Component } from "react";
import {Grid, Row, Col, ProgressBar, FormGroup, ControlLabel, FormControl, Table, Pagination} from "react-bootstrap";

import { Card as CardTable } from "../../components/Card/Card.jsx";
import {Link, NavLink} from "react-router-dom";
import Loader from "react-loader-spinner";

import "react-confirm-alert/src/react-confirm-alert.css";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import {
    getAllClientData,
    getClient,
    getSchema, getTaskResult,
    getTaskResultData,
    getTaskResultDataFamily
} from "../../api/clientsAssessor";
import PanelAssessor from "../ClientAssessor/AssessorPanel/PanelAssessor";
import TaskPanel from "./TaskPanel";
import {AssessorTaskResult, showStatus, taskProgress} from "./AssessorTaskResult";
import Card from "../../components/Card/Card";
import {validate} from "../../validations/commons";



class AssessorTaskResultDetail extends Component {
  state = {
    taskResult : null,
    client: null,
    schema:null,
    family:[],
      previous : null,
    loading_client: true,
      loading_schema:true,
    loading_family:true,
    loading: true,
      nameFilter : { value: "", isValid: null },
        statusFilter : { value: "", isValid: null },
      interval:null

  };

  componentWillUnmount() {
        clearInterval(this.state.interval);
      }

   componentDidMount() {
       this.startResults()
  }

  startResults = _ => {
        this.updateResults();
        let t = setInterval(this.updateResultsMinor, 60000);
        this.setState({ interval: t });
      };



  updateResults = _ => {
       this.setState({loading: true});
          let taskResult;

          if(this.props.location.state && 'previous' in this.props.location.state ){
              this.setState({previous:this.props.location.state['previous']});
              console.log(this.props.location.state['previous'])
          }

          const task = this.props.location.pathname;

          getTaskResultData(task.match('/([0-9]+)$')[1]).then( data => {

          taskResult = data.data;

          this.setState({taskResult: taskResult},
              () => {

                  this.setState({loading: false});
              });


          if (taskResult.client) {
              getClient(taskResult.client.match('/([0-9]+)/$')[1]).then(cli => {
                  this.setState({
                      client: cli,
                      loading_client: false
                  });
              });
          }

          if (taskResult.schema) {
              getSchema(taskResult.schema.match('/([0-9]+)/$')[1]).then(cli => {
                  this.setState({
                      schema: cli.data,
                      loading_schema: false,
                  });

              });
          }
          getTaskResultDataFamily(taskResult.url.match('/([0-9]+)/$')[1]).then(cli => {
              console.log(cli);
              this.setState({

                  family: cli.data.results,
                  loading_family: false,
              });

          });
      })

    };


  updateResultsMinor = _ => {



          let taskResult;

          if(this.props.location.state && 'previous' in this.props.location.state ){
              this.setState({previous:this.props.location.state['previous']});
              console.log(this.props.location.state['previous'])
          }

          const task = this.props.location.pathname;

          getTaskResultData(task.match('/([0-9]+)$')[1]).then( data => {

          taskResult = data.data;


          this.setState({taskResult: taskResult}
            );


          getTaskResultDataFamily(taskResult.url.match('/([0-9]+)/$')[1]).then(cli => {

              this.setState({

                  family: cli.data.results,
                  loading_family: false,
              });

          });
      })

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




  render() {

    const {
        client,
        schema,
      loading_client,
        family,
        loading_schema,
        loading_family,
        loading,
        taskResult,
        statusFilter,
        nameFilter,
        previous

    } = this.state;

     const taskResultFilter = family.filter( tsk =>{

            if (!tsk.name || (nameFilter.value  && !tsk.name.includes(nameFilter.value))) {

                return false;
            }
            if (!tsk.status || (statusFilter.value && !tsk.status.toLowerCase().includes(statusFilter.value)  && !tsk.step.toLowerCase().includes(statusFilter.value)) ) {
                return false;
            }
            return true;
        });

        const taskMarkup = taskResultFilter.map(task => {
            // console.log(task);
            const progg = taskProgress(task);
            return (
                <tr key={task.task_id}>
                    <td style={{'width':'300px'}}>{task.name}</td>
                    <td style={{'width':'300px'}}>
                        <ProgressBar style={{'marginBottom':'0px'}}>
                          <ProgressBar active bsStyle="success" now={progg['found']} label={`${progg['found']}%`}key={1} />
                          <ProgressBar active bsStyle="danger" now={progg['not_found']} key={2} />
                        </ProgressBar>

                    </td>
                    <td style={{'width':'150px'}}>
                        {showStatus(task.step,task.status)}
                    </td>
                    <td style={{'width':'100px'}} className="table-action-client">
                        <Link
                            title="Detail Task"
                            key={taskResult.url}
                            to={{
                                pathname:  "/admin/task_result_int/" + task.url.match('/([0-9]+)/$')[1],
                                state: {
                                    prev: taskResult.url
                                }
                            }}
                        >
                            <i className="mr-5 pe-7s-search action-icon"/>
                        </Link>

                    </td>
                </tr>
            );
        });


    let prog = {}
    if(taskResult) {
        prog = taskProgress(taskResult);
    }
    return (
      <>
        <h3 className="title-page">Detail Task Result</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/taskResult">Task Results List</Link>
            </li>
              {previous && (
                   <li>
                  <Link to={"/admin/task_result_int/"+previous}>Previous</Link>
                   </li>
              )}
            <li className="active">Detail Task Results</li>
          </ol>

          <Grid fluid>
            <Row>
              <Col md={6}>
                <CardTable
                  title={
                    <>
                      <span>Detail</span>
                    </>
                  }
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <>
                      <Col md={12}>
                        <Row className="panelRow">
                          <Col md={4}>
                            <b>Task name</b>
                          </Col>
                          <Col md={4} style={{'width':'300px'}}>
                              <p style={{'overflow-wrap':'break-word'}}>
                                  {!loading && taskResult.name}
                              </p>
                              </Col>
                        </Row>

                        <Row className="panelRow">
                          <Col md={4}>
                            <b>Date Created</b>
                          </Col>
                          <Col md={8}>{ !loading && new Date(taskResult.date_created).toDateString()}</Col>
                        </Row>

                          {taskResult && 'details' in taskResult && taskResult['details'] && (<Row className="panelRow">
                          <Col md={4}>
                            <b>Parcels Found</b>
                          </Col>
                          <Col md={8}>{prog['found_act']}</Col>
                        </Row>)}

                        {taskResult && 'details' in taskResult && taskResult['details'] && (<Row className="panelRow">
                          <Col md={4}>
                            <b>Parcels Not Found</b>
                          </Col>
                          <Col md={8}>{prog['not_fond_act']}</Col>
                        </Row>)}

                        {taskResult && 'details' in taskResult && taskResult['details'] && (<Row className="panelRow">
                          <Col md={4}>
                            <b>Total Parcels</b>
                          </Col>
                          <Col md={8}>{taskResult['details']['total']}</Col>
                        </Row>)}

                        <Row className="panelRow">
                          <Col md={4}>
                            <b>Progress</b>
                          </Col>
                          <Col md={8}>
                              <ProgressBar style={{'marginBottom':'0px'}}>
                                  <ProgressBar active bsStyle="success" now={prog['found']} label={`${prog['found']}%`}key={1} />
                                  <ProgressBar active bsStyle="danger" now={prog['not_found']} key={2} />
                              </ProgressBar>

                          </Col>
                        </Row>

                        <Row className="panelRow">
                          <Col md={4}>
                            <b>Status</b>
                          </Col>
                          <Col md={8}>{!loading && showStatus(taskResult.step,taskResult.status)}</Col>
                        </Row>

                      </Col>
                        <div className="clearfix"></div>
                    </>
                  }
                />
              </Col>

              <Col md={6}>
                {loading_client && loading_schema  && (
                  <Loader
                    type="Circles"
                    color="rgb(161, 232, 44)"
                    height={100}
                    width={100}
                    className="loader"
                  />
                )}

                {!loading_client && !loading_schema  &&(
                  <TaskPanel
                  loading={loading_client && loading_schema}
                  schema={schema}
                  client ={client}
                />
                )}



              </Col>
            </Row>
          </Grid>

            {!loading_family   &&(
                  <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col md={12}>

                                <Col md={4}>

                                    <FormGroup
                                      controlId="formValidationSuccess1"
                                      validationState={nameFilter.isValid}
                                    >
                                    <ControlLabel>Filter by Name</ControlLabel>
                                      <FormControl
                                        type="text"
                                        name="nameFilter"
                                        value={nameFilter.value}
                                        onChange={this.handleChange}
                                      />
                                    </FormGroup>

                                </Col>
                                <Col md={2}>



                                </Col>

                                <Col md={4}>

                                    <FormGroup
                                      controlId="formValidationSuccess1"
                                      validationState={statusFilter.isValid}
                                    >
                                    <ControlLabel>Filter by Status</ControlLabel>
                                      <FormControl
                                        type="text"
                                        name="statusFilter"
                                        value={statusFilter.value}
                                        onChange={this.handleChange}
                                      />
                                    </FormGroup>

                                </Col>


                                {family.length > 0 && !loading && (
                                    <Card
                                        ctTableFullWidth
                                        ctTableResponsive
                                        content={
                                            <Table striped hover condensed>
                                                <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Progress</td>
                                                    <td>Status</td>
                                                    <td>Actions</td>
                                                </tr>
                                                </thead>
                                                <tbody>{taskMarkup}</tbody>

                                            </Table>
                                        }
                                    />
                                )}
                            </Col>
                        </Row>
                    </Grid>
                </div>
                )}
        </div>
      </>
    );
  }
}

export default AssessorTaskResultDetail;
