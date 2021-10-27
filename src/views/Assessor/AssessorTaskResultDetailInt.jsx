import React, {Component} from "react";
import {clientsAssessor, getIntervals, getTasks} from "../../api/clientsAssessor";
import {Button, Col, Grid, Row, Table} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Loader from "react-loader-spinner";
import Card from "../../components/Card/Card";
import {getClient} from "../../api/clientsAssessor";

class AssessorTaskListDetailInt extends Component {


    componentDidMount() {
        const task = this.props.location.pathname;
        const url = task.match('/([0-9]+)$')[1];
        if (this.props.location.state  && 'prev' in this.props.location.state) {
            const {prev} = this.props.location.state;
            this.props.history.push("/admin/task_result/" + url, {previous: prev.match('/([0-9]+)/$')[1]});
        }
        else{
            this.props.history.push("/admin/task_result/" + url);
        }

    }



    render() {

        return (
            <div>

            </div>

        );
    }


}
export default AssessorTaskListDetailInt