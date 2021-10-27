import React, { Component } from "react";
import ActionConnector from "./ActionConnector";
import { Link } from "react-router-dom";
import { Button, Panel, Alert } from "react-bootstrap";

class PanelConnector extends Component {
  render() {
    const {
      connectors,
      client,
      completedConections,
      handleAssociation,
      deleteAssociation,
      loading
    } = this.props;

    const connectorMarkup = connectors.map(con => {
      return (
        <Panel key={con.id}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{con.connector.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            {con.filter && (
              <div>
                <b>Filter</b> <i>{con.filter}</i>
              </div>
            )}
            <div>
              <b>Source</b> <i>{con.connector.source}</i>
            </div>
            <div>
              <b>Schedulers count</b> <i>{con.connector.schedulers}</i>
            </div>
          </Panel.Body>
          <Panel.Footer>
            <div className="actionConnector">
              <ActionConnector
                connectorClient={con}
                client={client}
                handleAssociation={handleAssociation}
                deleteAssociation={deleteAssociation}
              />
            </div>
            <div className="clearfix"></div>
          </Panel.Footer>
        </Panel>
      );
    });

    return (
      <>
        {!completedConections && (
          <>
            {connectors.length > 0 && (
              <Link
                to={{
                  pathname: "/admin/connectors/",
                  state: {
                    client: client
                  }
                }}
              >
                <Button className={"btn-fill"} bsStyle="success">
                  Add connector
                </Button>
              </Link>
            )}

            {!loading && connectors.length === 0 && (
              <Alert bsStyle="danger">
                <span>
                  Actually there is not any conexion with {client.name} you can
                  add a new conexion with the following link{" "}
                  <Link
                    to={{
                      pathname: "/admin/connectors/",
                      state: {
                        client: client
                      }
                    }}
                  >
                    Add connector
                  </Link>
                </span>
              </Alert>
            )}
          </>
        )}

        {completedConections && (
          <>
            <Alert bsStyle="danger">
              <span>
                Client is connected with all the available connectors.
              </span>
            </Alert>
          </>
        )}
        <div className="panelConnector">{connectorMarkup}</div>
      </>
    );
  }
}

export default PanelConnector;
