import React, {Component} from "react";
import { getTaskResult} from "../../api/clientsAssessor";
import {
    ProgressBar,
    Col,
    Grid,
    Row,
    Table,
    Pagination,
    FormGroup,
    ControlLabel,
    FormControl,
    Button
} from "react-bootstrap";
import {Link, NavLink} from "react-router-dom";
import Loader from "react-loader-spinner";
import Card from "../../components/Card/Card";
import {validate} from "../../validations/commons";

function showStatus(sub_state,status){
            var color ='';
            if (status === 'FAILS'){
                color ='rgb(252,114,122)';
            }
            else if(status === 'SUCCESS' || status.includes('COMPLETE')){
                color = 'rgb(161, 232, 44)';
            }
            else if(status === 'SCRAPING' ){
                color = 'rgb(99,216,241)';
            }
            else if(status === 'FAILURE' ){
                color = '#777777';
            }
            else{
                color = 'rgb(255, 188, 103)';
            }


            return <div style={{'margin':'15px','backgroundColor': color,
                                    'textAlign': 'center','borderRadius': '10px','color':'white'}}>
                {
                    sub_state!== null&&sub_state!==undefined ? sub_state.concat(': ' ,status) : status
                }
             </div>
        }


function taskProgress(task){
    if(task && 'details' in task && task['details'] && 'total' in task['details'] ){
        const det = task['details'];
        const total = det['total'];
        let found = 0;
        let found_act = 0;
        let not_fond_act = 0;
        let not_found = 0;
        if('found' in det){
            found_act = det['found'];
            found =Math.min(Math.floor((det['found']*100)/total),100)
        }
        if('success' in det){
            found_act = det['success'];
            found =Math.floor((det['success']*100)/total)
        }
        if('not_found' in det){
            not_fond_act = det['not_found'];
           not_found =(det['not_found']*100)/total
        }
        if('errors' in det){
            not_fond_act = det['errors'];
           not_found =(det['errors']*100)/total
        }

        return {'found':found , 'found_act':found_act, 'not_found':not_found,'not_fond_act':not_fond_act};
    }

    return {'found':0 ,'found_act':0,  'not_found':0, 'not_fond_act':0};

    }

class AssessorTaskResult extends Component {
    state = {
        taskResultList:[],
        nameFilter : { value: "", isValid: null },
        statusFilter : { value: "", isValid: null },
        activePage : "1",
        itemsPerPAge:25,
        loading: true,
        interval: null,
    };

    componentWillUnmount() {
        clearInterval(this.state.interval);
      }

    componentDidMount() {
        this.startResults()
    }

    updateResults = _ => {
        if('taskResultList' in this.props){
            this.setState({taskResultList: this.props['taskResultList']},
                ()=>{
                this.setState({loading:false})
                })

        }
        else {


            getTaskResult()
                .then(response => {
                    this.setState({taskResultList: response},
                        () => {
                            this.setState({loading: false})
                        })
                });
        }
    };

    startResults = _ => {
        this.updateResults();
        let t = setInterval(this.updateResults, 60000);
        this.setState({ interval: t });
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

    paginationClicked = e =>{

        if(e.target.text){
            this.setState({activePage:e.target.text})
        }
    };


    render() {
        const {taskResultList, loading, activePage,nameFilter,statusFilter,itemsPerPAge} = this.state;


        const taskResultFilter = taskResultList.filter( tsk =>{

            if (!tsk.name || (nameFilter.value  && !tsk.name.includes(nameFilter.value))) {

                return false;
            }
            if (!tsk.status || (statusFilter.value && !tsk.status.toLowerCase().includes(statusFilter.value)  && !tsk.step.toLowerCase().includes(statusFilter.value)) ) {
                return false;
            }
            return true;
        });

        const taskMarkup = taskResultFilter.filter((tsk,idx) => {
            if((activePage-1)*itemsPerPAge>idx || idx >= activePage*itemsPerPAge){
                return false;
            }
            return true;
        }).map(task => {
            // console.log(task);
            const prog = taskProgress(task);
            return (
                <tr key={task.task_id}>
                    <td style={{'width':'300px'}}>{task.name}</td>
                    <td style={{'width':'300px'}}>
                        <ProgressBar style={{'marginBottom':'0px'}}>
                          <ProgressBar active bsStyle="success" now={prog['found']} label={`${prog['found']}%`}key={1} />
                          <ProgressBar active bsStyle="danger" now={prog['not_found']} key={2} />
                        </ProgressBar>

                    </td>
                    <td style={{'width':'150px'}}>
                        {showStatus(task.step,task.status)}
                    </td>
                    <td style={{'width':'100px'}} className="table-action-client">
                        <NavLink to={ "/admin/task_result/" + task.url.match('/([0-9]+)/$')[1]} className="nav-link"
                        >
                            <i className="mr-5 pe-7s-search action-icon"/>
                        </NavLink>
                    </td>
                </tr>
            );
        });

        let taskResultTotal=taskResultFilter.length;
        let items = [];

        for (let number = 1; number <= taskResultTotal/itemsPerPAge+(taskResultTotal%itemsPerPAge>0?1:0); number++) {

          items.push(
            <Pagination.Item key={number} active={String(number)=== activePage } onClick={(event) => this.paginationClicked(event)}>
              {number}
            </Pagination.Item>,
          );
        }

        return (
            <>
                <h3 className="title-page">Task List</h3>
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

                                {loading && (
                                    <Loader
                                        type="Circles"
                                        color="rgb(161, 232, 44)"
                                        height={100}
                                        width={100}
                                        className="loader"
                                    />
                                )}
                                {taskResultList.length > 0 && !loading && (
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
                                                <tfoot>{
                                                        <Pagination>{items}</Pagination>
                                                }</tfoot>
                                            </Table>
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
export { AssessorTaskResult , showStatus, taskProgress}