import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavConnectorAll extends Component {
  render() {
    const { connector, active } = this.props;

    return (
      <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/connectors">Connectors</Link>
        </li>
        {!active && <li className="active">Scheduler List</li>}

        {active && (
          <li>
            <Link
              title="Schedulers"
              to={{
                pathname: "/admin/schedulers/" + connector.id,
                state: {
                  connector: connector,
                  typeNavigation: "all_connector"
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

export default NavConnectorAll;
