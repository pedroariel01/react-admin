import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavClientDetail extends Component {
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
        {!active && <li className="active">Scheduler List</li>}
        {active && (
          <li>
            <Link
              title="Schedulers"
              to={{
                pathname: "/admin/schedulers/" + connector.id,
                state: {
                  client: client,
                  connector: connector,
                  typeNavigation: "client_detail"
                }
              }}
            >
              Scheduler List
            </Link>
          </li>
        )}
        {active && <li className="active">{active}</li>}
      </ol>
    );
  }
}

export default NavClientDetail;
