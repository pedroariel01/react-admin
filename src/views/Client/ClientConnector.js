import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import { Card as CardTable } from "../../components/Card/Card.jsx";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { getAssociationClient, buildAssociation } from "../../api/connectors";

import { deleteAssociation } from "../../api/manager";
import PanelConnector from "./ConnectorPanel/PanelConnector";
import PanelNotes from "./ConnectorPanel/PanelNotes";

class ClientConnector extends Component {
  state = {
    connectors: [],
    loading: true,
    show: false,
    currentClientConnector: null,
    currentFilter: null,
    completedConections: false
  };

  componentDidMount() {
    const { client } = this.props.location.state;

    this.setState({ loading: true });

    getAssociationClient(client.id).then(res => {
      const { data } = res;
      const { client_association, count_connectors } = data;

      this.setState({
        connectors: client_association,
        loading: false,
        completedConections: client_association.length === count_connectors
      });
    });
  }

  deleteAssociation = connectorClient => {
    confirmAlert({
      title: "Confirm to delete",
      message: `Are you sure to delete the association`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.setState({ loading: true });
            deleteAssociation(connectorClient).then(res => {
              const { connectors } = this.state;
              const newConnectors = connectors.filter(
                item => item.id !== connectorClient.id
              );

              this.setState({
                loading: false,
                connectors: newConnectors,
                completedConections: false
              });
            });
          }
        },
        { label: "No" }
      ]
    });
  };

  handleClose = _ => {
    this.setState({ show: false });
  };

  handleAssociation = clientConnector => {
    const { filter } = clientConnector;

    this.setState({
      show: true,
      currentClientConnector: clientConnector,
      currentFilter: filter
    });
  };

  handleSaveAssociation = _ => {
    const { currentClientConnector, currentFilter } = this.state;

    const { client } = this.props.location.state;

    buildAssociation(
      client.id,
      currentClientConnector.connector.id,
      currentFilter
    ).then(res => {
      this.setState({ show: false });
    });

    currentClientConnector.filter = currentFilter;
  };

  handleChange = e => {
    this.setState({ currentFilter: e.target.value });
  };

  render() {
    const {
      connectors,
      show,
      currentConnector,
      currentFilter,
      completedConections,
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
              <Link to="/admin/clients">Client List</Link>
            </li>
            <li className="active">Detail client</li>
          </ol>
          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                Update filter for connector{" "}
                <b>{currentConnector ? currentConnector.connector.name : ""}</b>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <ControlLabel>
                  <b>Filter</b>
                </ControlLabel>
                <FormControl
                  rows="5"
                  componentClass="textarea"
                  bsClass="form-control"
                  name="filter"
                  onChange={this.handleChange}
                  value={currentFilter}
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleSaveAssociation}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <CardTable
                  title={
                    <>
                      <span>Detail</span>
                      <Link to={"/admin/client/" + client.id}>
                        <i className="pe-7s-note mr-5 edit-icon action-icon client-edit" />
                      </Link>
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

                        {client.description && (
                          <Row className="panelRow">
                            <Col md={4}>
                              <b>Description</b>
                            </Col>
                            <Col md={8}>{client.description}</Col>
                          </Row>
                        )}

                        {client.confluence_pages_urls && (
                          <Row className="panelRow">
                            <Col md={4}>
                              <b>Confluence pages urls</b>
                            </Col>
                            <Col md={8}>{client.confluence_pages_urls}</Col>
                          </Row>
                        )}
                      </Col>

                      <div className="clearfix"></div>
                    </>
                  }
                />

                <PanelNotes client={client} />
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
                <PanelConnector
                  client={client}
                  loading={loading}
                  connectors={connectors}
                  completedConections={completedConections}
                  handleAssociation={this.handleAssociation}
                  deleteAssociation={this.deleteAssociation}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </>
    );
  }
}

export default ClientConnector;
