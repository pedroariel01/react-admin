import React, { Component } from "react";

import { Panel, Alert, ControlLabel} from "react-bootstrap";

class TaskPanel extends Component {
  render() {
    const {
      schema,
      client,
      loading
    } = this.props;


    const schemaMarkup =
        <Panel key={schema.url}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{schema.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <b>Last Update</b> <i>{new Date(schema.last_update).toDateString()}</i>
            </div>
              {schema.summary &&(
                  <div>
              <b>Summary</b> <i>{schema.summary}</i>
            </div>
              )}
          </Panel.Body>
        </Panel>;

    const clientMarkup =
        <Panel key={client.id}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{client.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <b>State</b> <i>{client.state}</i>
            </div>
            <div>
              <b>County</b> <i>{client.county}</i>
            </div>
            <div>
              <b>Config</b> <i>{client.assessor_config}</i>
            </div>
            <div>
              <b>Is Scraping</b> <i>{client.scraping?'YES':'NO'}</i>
            </div>
          </Panel.Body>
        </Panel>
     ;

    return (
      <>
        <div className={'assessorPanel'}>
         <ControlLabel>Data Schema</ControlLabel>
        {!loading &&
        (
            <div className="panelConnector">{schemaMarkup}</div>)
        }
        </div>


        <div className={'assessorPanel'}>
        <ControlLabel>Client</ControlLabel>
        {!loading &&
        (
            <div className="panelConnector">{clientMarkup}</div>)
        }
        </div>
      </>
    );
  }
}

export default TaskPanel;
