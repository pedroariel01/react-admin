import React, { Component } from "react";

import {
  Row,
  Col,
  Table,
  Badge,
  Tab,
  NavItem,
  Nav,
  Button
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { getSchedulersByConnector, deleteScheduler } from "../../api/manager";

class ConnectorDetail extends Component {
  state = {
    connector: null,
    loading: false,
    schedulers: []
  };

  componentDidMount() {
    this.setState({
      connector: this.props.location.state.connector
    });

    getSchedulersByConnector(this.props.match.params.id).then(res => {
      this.setState({
        schedulers: res.data.results,
        loading: false
      });
    });
  }

  delete = scheduler => {
    const { schedulers } = this.state;

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this scheduler.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.setState({ loading: true });
            deleteScheduler(scheduler).then(res => {
              const schedulerNewList = schedulers.filter(
                item => item.id !== scheduler.id
              );

              this.setState({ loading: false, schedulers: schedulerNewList });
            });
          }
        },
        { label: "No" }
      ]
    });
  };

  render() {
    const { client, connector, typeNavigation } = this.props.location.state;
    const { schedulers, loading } = this.state;

    return (
      <>
        <h3 className="title-page">Detail connector {connector.name}</h3>
        <div className="content">
          {client && (
            <ol
              role="navigation"
              aria-label="breadcrumbs"
              className="breadcrumb"
            >
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/clients">Client List</Link>
              </li>
              <li>
                <Link
                  key={client.id}
                  to={{
                    pathname: "/admin/clientconnectors/" + client.id,
                    state: {
                      client: client
                    }
                  }}
                >
                  Detail {client.name}
                </Link>
              </li>
              <li className="active">Detail Connector</li>
            </ol>
          )}

          {!client && (
            <ol
              role="navigation"
              aria-label="breadcrumbs"
              className="breadcrumb"
            >
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/connectors">Connectors</Link>
              </li>
              <li className="active">Detail Connector</li>
            </ol>
          )}

          <Tab.Container id="left-tabs-example" defaultActiveKey="general">
            <Row className="clearfix">
              <Col sm={3}>
                <Nav bsStyle="pills" stacked>
                  <NavItem eventKey="general">General</NavItem>
                  <NavItem eventKey="region">Region</NavItem>
                  <NavItem eventKey="source">Source</NavItem>
                  <NavItem eventKey="schema_tables">Schema tables</NavItem>
                  <NavItem eventKey="params">Params</NavItem>
                </Nav>
              </Col>
              <Col sm={8} mdOffset={1}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="region">
                    {connector && (
                      <>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">State</Badge>
                          </Col>
                          <Col md={10}>{connector.state}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">County</Badge>
                          </Col>
                          <Col md={10}>{connector.county}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Area</Badge>
                          </Col>
                          <Col md={10}>{connector.area}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Subarea</Badge>
                          </Col>
                          <Col md={10}>{connector.subarea}</Col>
                        </Row>
                      </>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="general">
                    {connector && (
                      <>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Name</Badge>
                          </Col>
                          <Col md={10}>{connector.name}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Description</Badge>
                          </Col>
                          <Col md={10}>{connector.description}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Updated by</Badge>
                          </Col>
                          <Col md={10}>{connector.updated_by}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Created by</Badge>
                          </Col>
                          <Col md={10}>{connector.created_by}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Data Type</Badge>
                          </Col>
                          <Col md={10}>{connector.data_type.name}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Item Type</Badge>
                          </Col>
                          <Col md={10}>{connector.item_type.name}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Log file</Badge>
                          </Col>
                          <Col md={10}>{connector.log_file}</Col>
                        </Row>
                      </>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="source">
                    {connector && (
                      <>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Spider name</Badge>
                          </Col>
                          <Col md={10}>{connector.spider_name}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Source</Badge>
                          </Col>
                          <Col md={10}>{connector.source}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Source url</Badge>
                          </Col>
                          <Col md={10}>{connector.source_url}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Set id</Badge>
                          </Col>
                          <Col md={10}>{connector.set_id}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Sample url</Badge>
                          </Col>
                          <Col md={10}>{connector.sample_urls}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={2}>
                            <Badge className="badgeLabel">Api url</Badge>
                          </Col>
                          <Col md={10}>{connector.api_url}</Col>
                        </Row>
                      </>
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="schema_tables">
                    {connector && (
                      <>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Data origin table
                            </Badge>
                          </Col>
                          <Col md={8}>
                            {connector.default_data_origin_table}
                          </Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Data origin schema
                            </Badge>
                          </Col>
                          <Col md={8}>
                            {connector.default_data_origin_schema}
                          </Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Standardized data schema
                            </Badge>
                          </Col>
                          <Col md={8}>
                            {connector.default_standardized_data_schema}
                          </Col>
                        </Row>

                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Standardized data table
                            </Badge>
                          </Col>
                          <Col md={8}>
                            {connector.default_standardized_data_table}
                          </Col>
                        </Row>

                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Standardized data schema
                            </Badge>
                          </Col>
                          <Col md={8}>{connector.standardized_data_schema}</Col>
                        </Row>

                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Standardized data table
                            </Badge>
                          </Col>
                          <Col md={8}>{connector.standardized_data_table}</Col>
                        </Row>
                      </>
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="params">
                    {connector && (
                      <>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">Query param</Badge>
                          </Col>
                          <Col md={8}>{connector.query_param}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">Query Filter</Badge>
                          </Col>
                          <Col md={8}>{connector.query_filter}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Name Status_field
                            </Badge>
                          </Col>
                          <Col md={8}>{connector.name_of_status_field}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Name status field
                            </Badge>
                          </Col>
                          <Col md={8}>{connector.name_of_status_field}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Name type field
                            </Badge>
                          </Col>
                          <Col md={8}>{connector.name_of_type_field}</Col>
                        </Row>
                        <Row className="panelRow">
                          <Col md={4}>
                            <Badge className="badgeLabel">
                              Fields build set_id
                            </Badge>
                          </Col>
                          <Col md={8}>
                            {connector.fields_to_build_set_id_value}
                          </Col>
                        </Row>
                      </>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>

          <br></br>

          {loading && (
            <Loader
              type="Circles"
              color="rgb(161, 232, 44)"
              height={100}
              width={100}
              className="loader"
            />
          )}
          <br></br>

          {!loading && (
            <>
              <Link
                to={{
                  pathname: "/admin/scheduler/" + connector.id,
                  state: {
                    connector: connector,
                    client: client,
                    typeNavigation: typeNavigation
                  }
                }}
                className="nav-link"
              >
                <Button className={"btn-fill"} bsStyle="success">
                  New Scheduler
                </Button>
              </Link>
              <Card
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td>Run asap</td>
                        <td>Enabled</td>
                        <td>Status</td>
                        <td>Last runtime</td>
                        <td>Params</td>
                        <td>Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {schedulers.map(scheduler => {
                        return (
                          <tr key={scheduler.id}>
                            <td>
                              {scheduler.run_asap ? (
                                <Badge className="badgeOn">On</Badge>
                              ) : (
                                <Badge className="badgeOff">Off</Badge>
                              )}
                            </td>

                            <td>
                              {scheduler.enabled ? (
                                <Badge className="badgeOn">On</Badge>
                              ) : (
                                <Badge className="badgeOff">Off</Badge>
                              )}
                            </td>

                            <td>{scheduler.status[1]}</td>
                            <td>{scheduler.last_run_time}</td>
                            <td>{scheduler.params}</td>
                            <td>
                              <Link
                                to={{
                                  pathname:
                                    "/admin/scheduler/edit/" + scheduler.id,
                                  state: {
                                    connector: connector,
                                    scheduler: scheduler,
                                    client: client,
                                    typeNavigation: typeNavigation
                                  }
                                }}
                              >
                                <i className="pe-7s-note mr-5 edit-icon action-icon" />
                              </Link>

                              <span onClick={_ => this.delete(scheduler)}>
                                <i className="pe-7s-trash trash-icon action-icon" />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </>
          )}
        </div>
      </>
    );
  }
}

export default ConnectorDetail;
