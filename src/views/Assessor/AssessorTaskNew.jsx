import React, { Component } from "react";
import {
    clientsAssessor,
    getIntervals,
    getTaskType,
    newAssessorClient,
    newAssessorTask
} from "../../api/clientsAssessor";
import {requireDisabledButton, validate} from "../../validations/commons";
import {Link} from "react-router-dom";
import NotificationSystem from "react-notification-system";
import {style} from "../../variables/Variables";
import Button from "../../components/CustomButton/CustomButton.jsx";
import {Col, ControlLabel, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {Card} from "../../components/Card/Card";
import Select from "react-select";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

class AssessorTaskNew extends Component{
    state= {
        intervalList:[],
        clientList:[],
        taskTypeList:[],
        clientLoading: true,
        intervalLoading : true,
        taskTypeLoading : false,
        currentClient:"",
        currentInterval:"",
        // taskTypeList : [{value :0,label : 'daily_stand_up' },{value :1,label : 'delete_old_schemas' },{value :2,label : 'extract_layer' },{value :3,label : 'extract_layer_extension' }
        // ,{value :4,label : 'finish_scrape' },{value :5,label : 'full_scrape' },{value :6,label : 'mapping_assessor' },{value :7,label : 'notify_results' },{value :8,label : 'scrape_parcels' },{value :9,label : 'scrape_parcels_sub' }],
        currentTaskType:"",
        taskName: { value: "", isValid: null },
        enabled__:true,
        one_off:false,
         loading: false
    };

    componentDidMount() {
        clientsAssessor().then(data => {
            // console.log(data);

            const optionsField = data.map(field => {
                    return {value: field.url, label: field.name};
                });
            this.setState({clientList: optionsField, clientLoading: false});
        });

        getIntervals().then(data => {
            const optionsInter = data.data.map(inter => {
                    return {value: inter.url, label:  "each "+inter.every + " " + inter.period};
                });
            this.setState({intervalList: optionsInter, intervalLoading: false});
        });

        getTaskType().then(data => {
            const optionsInter = data.map(inter => {
                    return {value: inter, label:  inter};
                });

            this.setState({taskTypeList: optionsInter, taskTypeLoading: false});
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

     handleInterval = selectedInterval => {
        this.setState({currentInterval:selectedInterval});
    };

     handleTask = selectedTask => {
        this.setState({currentTaskType:selectedTask});
    };

    handleClient = selectedClient => {
        this.setState({currentClient:selectedClient});
    };

    addNotification = _ => {
    const { taskName } = this.state;
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: (
        <div>
          Task <b>{taskName.value}</b> successfully saved.
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

    const {taskName,currentInterval,currentClient,enabled__,one_off, currentTaskType} = this.state;
    console.log(currentTaskType);
    newAssessorTask(taskName.value,currentInterval.value,currentClient.value,enabled__,one_off, currentTaskType.label).then(res => {
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
        taskName: { value: "", isValid: null },
        currentInterval:"",
        currentClient:"",
        currentTaskType:"",
        enabled__:true,
        one_off:false,
        loading: false
      });

    });
  };

  notificationSystem = React.createRef();

    render(){
        const{
            intervalList,
            taskTypeList,
            clientList,
            currentClient,
            currentInterval,
            currentTaskType,
            taskName,
            clientLoading,
            intervalLoading,
            taskTypeLoading,
            enabled__,
            one_off, loading
        } =this.state;

        return (
      <>
        <h3 className="title-page">New Task</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/assessortask">Task List</Link>
            </li>
            <li className="active">
              <span>Task new</span>
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
                          validationState={taskName.isValid}
                        >
                          <ControlLabel>Task name</ControlLabel>
                          <FormControl
                            type="text"
                            name="taskName"
                            value={taskName.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup>
                              <ControlLabel>Available Clients</ControlLabel>
                              <Select
                                placeholder={"Select Client"}
                                options={clientList}
                                onChange={this.handleClient}
                                value={currentClient}
                                isLoading={clientLoading}
                              />
                            </FormGroup>


                             <FormGroup>
                              <ControlLabel>Available Intervals</ControlLabel>
                              <Select
                                placeholder={"Select Interval"}
                                options={intervalList}
                                onChange={this.handleInterval}
                                value={currentInterval}
                                isLoading={intervalLoading}
                              />
                            </FormGroup>

                          <FormGroup>
                              <ControlLabel>Task Types</ControlLabel>
                              <Select
                                placeholder={"Select Task Type"}
                                options={taskTypeList}
                                onChange={this.handleTask}
                                value={currentTaskType}
                                isLoading={taskTypeLoading}
                              />
                            </FormGroup>

                            <FormGroup>
                              <ControlLabel>Enabled</ControlLabel>
                              <br />
                              <BootstrapSwitchButton
                                checked={enabled__}
                                onstyle="danger"
                                onChange={checked =>
                                  this.setState({ enabled__: checked })
                                }
                              />
                          </FormGroup>

                          <FormGroup>
                              <ControlLabel>One Off</ControlLabel>
                              <br />
                              <BootstrapSwitchButton
                                checked={one_off}
                                onstyle="danger"
                                offstyle="primary"
                                onChange={checked =>
                                  this.setState({ one_off: checked })
                                }
                              />
                          </FormGroup>

                        <Button
                          bsStyle="success"
                          pullRight
                          fill
                          type="submit"
                          disabled={requireDisabledButton(this.state, ["taskName"])}
                        >
                          Create Task
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

    };

}
export default AssessorTaskNew