import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import { Card as CardTable } from "../../components/Card/Card.jsx";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

import "react-confirm-alert/src/react-confirm-alert.css";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import {getAllClientData, getClient, getIntervals} from "../../api/clientsAssessor";
import PanelAssessor from "./AssessorPanel/PanelAssessor";

class ClientAssessor extends Component {
  state = {
    client : null,
    data_originList: [],
    intervalList:[],
    schemasList:[],
      tasksList:[],
    loading: true,

  };

  componentDidMount() {
    this.setState({ loading: true });

    console.log(this.props.match.params.id)

    getIntervals().then(response =>{
            // console.log(response);
            this.setState({intervalList:response.data})
        });
    getAllClientData(this.props.match.params.id).then(res => {

      // console.log(res)

      this.setState({
          client:res.client,
          schemasList:res.schemas,
          data_originList:res.data_origins,
          tasksList : res.tasks,
          loading:false
      });
    });


  }


  render() {
    const {
      schemasList,
        data_originList,
        tasksList,
        intervalList,
      loading
    } = this.state;


    const { client } = this.props.location.state;

    return (
      <>
        <h3 className="title-page">Detail client {client.name}</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/clientAssessor">Client List</Link>
            </li>
            <li className="active">Detail client</li>
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
                            <b>Client name</b>
                          </Col>
                          <Col md={8}>{client.name}</Col>
                        </Row>

                        {client.assessor_config && (
                          <Row className="panelRow">
                            <Col md={4}>
                              <b>Associated Config</b>
                            </Col>
                            <Col md={8}>{client.assessor_config}</Col>
                          </Row>
                        )}

                        {
                          <Row className="panelRow">
                            <Col md={4}>
                              <b>Location</b>
                            </Col>
                            <Col md={8}>{client.county.toUpperCase() + ','+ client.state.toUpperCase() + '.'+ client.country.toUpperCase()}</Col>
                          </Row>
                        }
                      </Col>
                        <div className="clearfix"></div>
                    </>
                  }
                />
              </Col>

              <Col md={6}>
                {loading && (
                  <Loader
                    type="Circles"
                    color="rgb(161, 232, 44)"
                    height={100}
                    width={100}
                    className="loader"
                  />
                )}

                {!loading && (
                <PanelAssessor
                  loading={loading}
                  schemas={schemasList}
                  data_origins={ data_originList}
                  tasks ={tasksList}
                  intervalList ={intervalList}
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

export default ClientAssessor;
