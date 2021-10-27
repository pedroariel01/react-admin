import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "../../components/Card/Card.jsx";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { databaseCredentialList, deleteCredential } from "../../api/databases";

class DatabaseCredential extends Component {
  state = {
    databaseCredentials: [],
    loading: true
  };

  componentDidMount() {
    databaseCredentialList().then(res => {
      const { databasecredentials } = res;

      this.setState({
        databaseCredentials: databasecredentials,
        loading: false
      });
    });
  }

  delete = (databaseCredential, id) => {
    const { host } = databaseCredential;

    confirmAlert({
      title: "Confirm to delete",
      message: `Are you sure to delete the credential for ${host}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.setState({ loading: true });

            deleteCredential(id).then(res => {
              const {
                data: { databaseCredentials }
              } = res;

              this.setState({ databaseCredentials, loading: false });
            });
          }
        },
        { label: "No" }
      ]
    });
  };

  render() {
    const { databaseCredentials, loading } = this.state;

    const databaseMarkup = databaseCredentials.map(database => {
      return (
        <tr key={database.id}>
          <td>{database.host}</td>
          <td>{database.username}</td>
          <td className="table-action-client">
            <Link
              title="Edit database"
              to={{
                pathname: "/admin/databases/credential/edit/" + database.id,
                state: {
                  databaseCredential: database
                }
              }}
            >
              <i className="pe-7s-note mr-5 edit-icon action-icon" />
            </Link>

            <span
              onClick={_ => this.delete(database, database.id)}
              title="Delete database"
            >
              <i className="pe-7s-trash trash-icon action-icon" />
            </span>
          </td>
        </tr>
      );
    });

    return (
      <>
        <h3 className="title-page">Database List</h3>
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <NavLink to="/admin/databases/new" className="nav-link">
                  <Button className={"btn-fill"} bsStyle="success">
                    Database Credential New
                  </Button>
                </NavLink>
                {loading && (
                  <Loader
                    type="Circles"
                    color="rgb(161, 232, 44)"
                    height={100}
                    width={100}
                    className="loader"
                  />
                )}
                {databaseCredentials.length > 0 && !loading && (
                  <Card
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table striped hover>
                        <thead>
                          <tr>
                            <td>Host</td>
                            <td>Username</td>
                            <td>Action</td>
                          </tr>
                        </thead>
                        <tbody>{databaseMarkup}</tbody>
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

export default DatabaseCredential;
