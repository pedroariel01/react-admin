import React, { Component } from "react";

import { Panel, Alert, ControlLabel} from "react-bootstrap";

class PanelAssessor extends Component {

    mapIntervalId = intervall =>{
        if(intervall) {
            // console.log('interval');
            // console.log(intervall);
            //
            // return "each " + intervall.every + " " + intervall.period;
            let interval = '';
            const {intervalList} = this.props;
            intervalList.forEach(inter => {
                if (inter.url === intervall) {
                    // console.log(inter.id);
                    interval = "each " + inter.every + " " + inter.period;
                }
            });
            return interval
        }
        else{ return ""}
    };

  render() {
    const {
      schemas,
        data_origins,
        tasks,
      loading
    } = this.props;




    const schemasMarkup = schemas.map(sch => {
      return (
        <Panel key={sch.id}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{sch.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>

            <div>
              <b>Last Update</b> <i>{new Date(sch.last_update).toDateString()}</i>
            </div>
          </Panel.Body>
        </Panel>
      );
    });

    const dtMarkup = data_origins.map(dt => {
      return (
        <Panel key={dt.id}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{dt.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <b>Reference field</b> <i>{dt.field}</i>
            </div>
          </Panel.Body>
        </Panel>
      );
    });

    const tasksMarkup = tasks.map(tsk => {
      return (
        <Panel key={tsk.id}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              <b>
                <i>{tsk.name}</i>
              </b>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            {tsk.interval &&(
            <div>
              <b>Interval</b> <i>{this.mapIntervalId(tsk.interval)}</i>
            </div>)}
          </Panel.Body>
        </Panel>
      );
    });

    return (
      <>
        <div className={'assessorPanel'}>
         <ControlLabel>Data Schemas</ControlLabel>
        {!loading &&
        (
            <div className="panelConnector">{schemasMarkup}</div>)
        }
        </div>

        <div className={'assessorPanel'}>
        <ControlLabel>Data Origins</ControlLabel>
        {!loading &&
        (
            <div className="panelConnector">{dtMarkup}</div>)
        }
        </div>

        <div className={'assessorPanel'}>
        <ControlLabel>Current Tasks</ControlLabel>
        {!loading &&
        (
            <div className="panelConnector">{tasksMarkup}</div>)
        }
        </div>
      </>
    );
  }
}

export default PanelAssessor;
