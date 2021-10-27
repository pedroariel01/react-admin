import React, { Component } from "react";
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Row, Table} from "react-bootstrap";
import Loader from "react-loader-spinner";
import Card from "../../components/Card/Card";
import Select from "react-select";
import {validate} from "../../validations/commons";
import {getNextRunList} from "../../api/clientsAssessor";
import {Link} from "react-router-dom";

class AssessorTaskNextRun extends Component{
    state ={
        taskList : [],
        nameFilter : { value: "", isValid: null },
        daysFilter : { value: "", isValid: null },
        operands : [{value :0,label : '<' },{value :1,label : '>' },{value :2,label : '=' },{value :3,label : '>=' },{value :4,label : '<=' }],
        selectedOperand :{value :0,label : '<' },
        orderState : 0,
        loading:true
    };

    componentDidMount() {
        getNextRunList().then(res =>
        {
            console.log(res);
            this.setState({taskList:res,loading:false})
        })
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

    handleDays = e => {
        let val = e.target.value;
        const{daysFilter} =this.state;
        if(val.match('^\\d*$')){
            this.setState( { daysFilter:{value: val, isValid: true} })
        }
        else{
            this.setState( { daysFilter:{value: daysFilter.value, isValid: true} })
        }
      };

    handleChangeOperand = selectedOp => {
           this.setState({ selectedOperand: selectedOp });
      };

    handleOrder = _ =>
    {
        const {orderState} = this.state;
        if(orderState===2){
            this.setState({orderState: 0});
        }
        else{
             this.setState({orderState: orderState+1});
        }

    };

    render() {
        const {taskList, loading,daysFilter,nameFilter,operands,selectedOperand,orderState} = this.state;
        // console.log(taskList);

        const taskFilter = taskList.filter( tsk =>{
            if (nameFilter.value && !tsk.name.includes(nameFilter.value)) {
                return false;
            }
            if(daysFilter.value){
                switch (selectedOperand.label) {
                    case "<":
                        if(parseInt(daysFilter.value)>=parseInt(tsk.next_run_remaining_days)){
                            return false;
                        }
                        break;
                    case ">":
                        if(parseInt(daysFilter.value)<=parseInt(tsk.next_run_remaining_days)){
                            return false;
                        }
                        break;
                    case "<=":
                        if(parseInt(daysFilter.value)>parseInt(tsk.next_run_remaining_days)){
                            return false;
                        }
                        break;
                    case ">=":
                        if(parseInt(daysFilter.value)<parseInt(tsk.next_run_remaining_days)){
                            return false;
                        }
                        break;
                    case "=":
                        if(parseInt(daysFilter.value)!==parseInt(tsk.next_run_remaining_days)){
                            return false;
                        }
                        break;
                }
            }
            return true;
        });

        switch (orderState) {
            case 0:
                taskFilter.sort((a,b)=>a.id-b.id);
                break;
            case 1:
                taskFilter.sort((a,b)=>parseInt(a.next_run_remaining_days)-parseInt(b.next_run_remaining_days));
                break;
            case 2:
                 taskFilter.sort((a,b)=>parseInt(b.next_run_remaining_days)-parseInt(a.next_run_remaining_days));
                break;
        }
        const taskMarkup = taskFilter.map(task => {
            // console.log(task);
            return (
                <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{new Date(task.next_run).toDateString()}</td>
                    <td>{task.next_run_remaining_days}</td>
                </tr>
            );
        });


        let orderButton = '';
            switch(orderState){
                case 0:
                   orderButton= <Button className={"btn-fill"} bsStyle="info" onClick={this.handleOrder}>
                                            Order By Days Asc
                                        </Button>;
                break;
                case 1:
                   orderButton= <Button className={"btn-fill"} bsStyle="success" onClick={this.handleOrder}>
                                            Order By Days Desc
                                        </Button>;
                break;
                case 2:
                    orderButton = <Button className={"btn-fill"} bsStyle="error" onClick={this.handleOrder}>
                                            Unordered
                                        </Button>;
                break;
                default:
                    orderButton = '';


        };

        return (
            <>
                <h3 className="title-page">Task List</h3>
                <div className="content">
                    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
                        <li>
                          <Link to="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li>
                          <Link to="/admin/assessortask">Task List</Link>
                        </li>
                        <li className="active">
                          <span>Task Schedule</span>
                        </li>
                     </ol>
                    <Grid fluid>
                        <Row>
                            <Col md={16}>

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
                                <Col md={8}>
                                    <ControlLabel>Remaining Days</ControlLabel>
                                <Row>
                                    <Col  md={2}>
                                        <FormGroup >

                                          <Select
                                            options={operands}
                                            onChange={this.handleChangeOperand}
                                            value={selectedOperand}
                                          />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>

                                        <FormGroup
                                          controlId="formValidationSuccess1"
                                          validationState={daysFilter.isValid}
                                        >
                                          <FormControl
                                            type="text"
                                            name="daysFilter"
                                            value={daysFilter.value}
                                            onChange={this.handleDays}
                                          />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        {orderButton}
                                </Col>
                                </Row>
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
                                            <Table striped hover>
                                                <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Next Run</td>
                                                    <td>Remaining Days</td>
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
export default AssessorTaskNextRun