import React, { Component } from "react";
import { getConnectors, buildAssociation } from "../../api/connectors";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import {
  Grid,
  Row,
  Col,
  Table,
  Modal,
  FormControl,
  Button,
  ControlLabel,
  FormGroup
} from "react-bootstrap";
import Pager from "react-bootstrap/lib/Pager";
import Loader from "react-loader-spinner";

class ConnectorAll extends Component {
  state = {
    connectors: [],
    next_page : '',
    prev_page : '',
    total:0,
    currentConnector: null,
    currentFilter: null,
    show: false,
    loading:true

  };

  handleClose = _ => {
    this.setState({ show: false });
  };

  handleShow = _ => {
    this.setState({ show: true });
  };

  handleAssociation = connector => {
    this.setState({ show: true, currentConnector: connector });
  };

  handleSaveAssociation = _ => {
    const { currentConnector, currentFilter } = this.state;
    const { client } = this.props.location.state;

    buildAssociation(client.id, currentConnector.id, currentFilter).then(
      res => {
        this.setState({ show: false });
      }
    );

    const { connectors } = this.state;

    const newConnectors = connectors.filter(
      item => item.id !== currentConnector.id
    );

    this.setState({ connectors: newConnectors });
  };

  componentDidMount() {
    this.loadConnectors()
  }

  loadConnectors =(page=0) =>{

    const { state } = this.props.location;
    let clientId = "";

    if (state && state.client) {
      clientId = state.client.id;

      getConnectors(clientId,page).then(res => {
        const { data } = res;
        const resultConnector = data.results.filter(item => {
          return item.association === false;
        });

        this.setState({
          connectors: resultConnector,
          loading: false,
            total:data.count, next_page:data.next, prev_page:data.previous
        });
      });
    } else {
      getConnectors(page).then(res => {

        this.setState({
          connectors: res.data.results,
          loading: false,
            total:res.data.count, next_page:res.data.next, prev_page:res.data.previous
        });
      });
    }
  }

  handleAssociation = connector => {
    this.setState({ show: true, currentConnector: connector });
  };

  handleChange = e => {
    this.setState({ currentFilter: e.target.value });
  };

  render() {
    const { connectors, currentFilter,loading } = this.state;
    const { state } = this.props.location;
    let client = null;

    if (state) {
      client = state.client;
    }

    const conMarkup = connectors.map(con => {
      return (
        <tr key={con.id}>
          <td>{con.name}</td>
          <td>{con.source}</td>
          <td>{con.state}</td>
          <td>{con.county}</td>
          <td>{con.area}</td>
          <td>{con.subarea}</td>
          <td>{con.schedulers}</td>
          <td className="table-action">
            <Link
              title="Detail Connector"
              to={{
                pathname: "/admin/connector/" + con.id,
                state: {
                  connector: con,
                  typeNavigation: "all_connector_detail"
                }
              }}
            >
              <i className="pe-7s-search mr-5 action-icon" />
            </Link>

            {client && (
              <span
                onClick={_ => {
                  this.handleAssociation(con);
                }}
              >
                <i className="pe-7s-filter action-icon filter-icon" />
              </span>
            )}

            <Link
              title="Schedulers"
              to={{
                pathname: "/admin/schedulers/" + con.id,
                state: {
                  client: client,
                  connector: con,
                  typeNavigation: "all_connector"
                }
              }}
            >
              <i className="clock-icon-green mr-5 pe-7s-clock action-icon" />
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <>
        {client && <h3 className="title-page">Connectors {client.name}</h3>}
        {!client && <h3 className="title-page">Connectors </h3>}
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="active">Operations</li>
          </ol>
        </div>
        {client && (
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
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
        )}
        {loading && (
                                    <Loader
                                        type="Circles"
                                        color="rgb(161, 232, 44)"
                                        height={100}
                                        width={100}
                                        className="loader"
                                    />
                                )}
        {connectors.length > 0 && !loading && (
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  title="Connectors"
                  category="Connectors"
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>Source</td>
                          <td>State</td>
                          <td>County</td>
                          <td>Area</td>
                          <td>Subarea</td>
                          <td>Schedulers number</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>{conMarkup}</tbody>
                      <tfoot>
                        <Pager>
                              <Pager.Item previous onClick={(event) => this.pagePrev(event)}>
                                &larr; Previous Page
                              </Pager.Item>
                              <Pager.Item next onClick={(event) => this.pageNext(event)}>
                                Next Page &rarr;
                              </Pager.Item>
                            </Pager>
                        </tfoot>
                    </Table>
                  }
                />
              </Col>
            </Row>
          </Grid>
        )}
      </>
    );
  }

  pageNext = e => {
        const {next_page} = this.state;
        if(next_page){
            this.loadConnectors(next_page)
        }

    };

    pagePrev = e => {
        const {prev_page} = this.state;
        if(prev_page){
           this.loadConnectors(prev_page)
        }

    };
}

export default ConnectorAll;
