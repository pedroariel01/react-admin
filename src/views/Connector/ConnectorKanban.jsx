import React, { Component } from "react";
import { getConnectors } from "../../api/clients";
import {
  getStatusConnector,
  updateStatusConnector,
  filterConnectors
} from "../../api/connectors";

import KanbanView from "components/Kanban/KanbanView.jsx";
import buildConnectorKanban from "../../api/buildData";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  ButtonToolbar,
  Button
} from "react-bootstrap";

class ConnectorKanban extends Component {
  state = {
    clientName: "",
    statusFilter: "",
    connectors: [],
    statusConnectors: []
  };

  updateConnectorStatus(cardId, sourceLaneId, targetLaneId) {
    updateStatusConnector(cardId, targetLaneId);
  }

  componentDidMount() {
    Promise.all([getConnectors(), getStatusConnector()]).then(responses => {
      this.setState({
        connectors: buildConnectorKanban(
          responses[0].data,
          responses[1].data,
          true
        ),
        statusConnectors: responses[1].data
      });
    });
  }

  onSubmitSearch = e => {
    e.preventDefault();

    filterConnectors(this.state.clientName, this.state.statusFilter).then(
      res => {
        this.setState({
          connectors: buildConnectorKanban(
            res.data,
            this.state.statusConnectors,
            true
          )
        });
      }
    );
  };

  onChangeValue = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="content">
        <form onSubmit={this.onSubmitSearch}>
          <Row>
            <Col md={4}>
              <FormGroup controlId="formValidationSuccess1">
                <ControlLabel>Client Name</ControlLabel>
                <FormControl
                  type="text"
                  name="clientName"
                  value={this.state.clientName}
                  onChange={this.onChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Status</ControlLabel>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  name="statusFilter"
                  onChange={this.onChangeValue}
                >
                  <option value="">---Select Status---</option>
                  {this.state.statusConnectors.map(status => {
                    return (
                      <option key={status.pk} value={status.pk}>
                        {status.name}
                      </option>
                    );
                  })}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <ButtonToolbar>
                <ControlLabel>Final Status</ControlLabel>
                <br></br>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                  <ToggleButton value={1}>DEV</ToggleButton>
                  <ToggleButton value={2}>PROD</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup role="form">
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">
                    Search
                  </Button>
                </ButtonToolbar>
              </FormGroup>
            </Col>
          </Row>
        </form>
        <div className="clearfix"></div>
        <KanbanView
          data={this.state.connectors}
          handleDragEnd={this.updateConnectorStatus}
        />
      </div>
    );
  }
}

export default ConnectorKanban;
