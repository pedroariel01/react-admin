import React, {Component} from "react";
import {clientsAssessor, getIntervals, getTasks} from "../../api/clientsAssessor";
import {Button, Col, Grid, Row, Table} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Loader from "react-loader-spinner";
import Card from "../../components/Card/Card";
import {getClient} from "../../api/clientsAssessor";

class AssessorTaskList extends Component {
    state = {
        taskList:[],
        clientList :[],
        intervalList:[],
        loading: true
    };

    componentDidMount() {
        clientsAssessor()
            .then(response => {
            this.setState({clientList: response})
            });

        // clientsAssessor()
        //     .then(response => {
        //     this.setState({clientList: response},
        //         ()=>
        //         {
        //             const {clientList} = this.state;
        //             // console.log(clientList);
        //             clientList.forEach(client =>
        //             {
        //                 getClient(client.id).then( res =>
        //                 {
        //
        //                     const {taskList} = this.state;
        //                     this.setState(
        //                     {taskList: taskList.concat(res.tasks)  })}
        //                 )
        //             });
        //             this.setState({loading:false})
        //         });
        //
        // });

        getTasks().then(resp =>{


            this.setState({taskList:resp.data})
        });

        getIntervals().then(response =>{
            // console.log(response);
            this.setState({intervalList:response.data},
                ()=>{
                this.setState({loading:false})
                })

        });

    }

    mapClientName = client =>
    {
        // console.log(client);
        if(client){
            let clientName = '';
            const {clientList} = this.state;
            clientList.forEach(clientt =>{
                if (clientt.url === client)
                {
                    // console.log(client);
                    clientName = clientt.name;
                }
            });
            return clientName
        }
        else{
            return "";
        }

    };

    mapIntervalId = intervall =>{
        if(intervall) {
            // console.log('interval');
            // console.log(intervall);
            //
            // return "each " + intervall.every + " " + intervall.period;
            let interval = '';
            const {intervalList} = this.state;
            intervalList.forEach(inter => {
                if (inter.url === intervall) {
                    // console.log(inter.id);
                    interval = "each " + inter.every + " " + inter.period;
                }
            });
            return interval
        }
        else{ return ""}
    };



    render() {
        const {taskList, loading} = this.state;
        // console.log(taskList);
        const taskMarkup = taskList.map(task => {
            // console.log(task);
            return (
                <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.task}</td>
                    <td>{this.mapClientName(task.client)}</td>
                    <td>
                        {this.mapIntervalId(task.interval)}
                    </td>
                </tr>
            );
        });

        return (
            <>
                <h3 className="title-page">Task List</h3>
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <Col md ={4}>
                                   <NavLink to="/admin/assessor_tasks/new" className="nav-link">
                                        <Button className={"btn-fill"} bsStyle="success">
                                            New Task
                                        </Button>
                                    </NavLink>
                                </Col>

                                <Col md ={5}>
                                   <NavLink to="/admin/assessor_tasks/next_run" className="nav-link">
                                        <Button pullRight style={{float:'right'}} className={"btn-fill"} bsStyle="info">
                                            Schedules
                                        </Button>
                                    </NavLink>
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
                                {taskList.length > 0 && !loading && (
                                    <Card
                                        ctTableFullWidth
                                        ctTableResponsive
                                        content={
                                            <Table striped hover >
                                                <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Task Type</td>
                                                    <td>Client</td>
                                                    <td>Interval</td>
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
            </>
        );
    }


}
export default AssessorTaskList