import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavClientConnectorDetail extends Component {
  render() {
    const { client, connector, active } = this.props;

    return (
      <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/clients">Client List</Link>
        </li>
        <li>
          <Link
            title="Detail client"
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

        <li>
          <Link
            title="Detail Connector"
            to={{
              pathname: "/admin/connector/" + connector.id,
              state: {
                client: client,
                connector: connector
              }
            }}
          >
            Detail connector {connector.name}
          </Link>
        </li>

        {active && <li className="active">{active}</li>}
      </ol>
    );
  }
}

export default NavClientConnectorDetail;
