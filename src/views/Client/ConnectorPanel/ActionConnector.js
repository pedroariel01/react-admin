import React, { Component } from "react";
import { Link } from "react-router-dom";

class ActionConnector extends Component {
  render() {
    const {
      connectorClient,
      client,
      handleAssociation,
      deleteAssociation
    } = this.props;

    return (
      <>
        <Link
          title="Detail Connector"
          to={{
            pathname: "/admin/connector/" + connectorClient.connector.id,
            state: {
              client: client,
              connector: connectorClient.connector,
              typeNavigation: "client_detail_connector"
            }
          }}
        >
          <i className="pe-7s-search action-icon" />
        </Link>

        <span
          title="Edit filter"
          className="link"
          onClick={_ => handleAssociation(connectorClient)}
        >
          <i className="pe-7s-filter action-icon filter-icon" />
        </span>

        <Link
          title="Schedulers"
          to={{
            pathname: "/admin/schedulers/" + connectorClient.connector.id,
            state: {
              client: client,
              connector: connectorClient.connector,
              typeNavigation: "client_detail"
            }
          }}
        >
          <i className="pe-7s-note mr-5 pe-7s-clock action-icon clock-icon-green" />
        </Link>

        <span
          title="Delete association"
          className="link"
          onClick={_ => deleteAssociation(connectorClient)}
        >
          <i className="pe-7s-trash trash-icon action-icon" />
        </span>
      </>
    );
  }
}

export default ActionConnector;
