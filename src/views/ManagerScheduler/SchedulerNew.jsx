import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { style } from "../../variables/Variables.jsx";
import NotificationSystem from "react-notification-system";

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { validate, disabledButton } from "../../validations/schedulers";
import { newScheduler, getSchedulerStatus } from "../../api/manager";
import NavClientDetail from "./SchedulerNavigation/NavClientDetail";
import NavClientConnectorDetail from "./SchedulerNavigation/NavClientConnectorDetail";
import NavConnectorAll from "./SchedulerNavigation/NavConnectorAll";
import NavConnectorAllDetail from "./SchedulerNavigation/NavConnectorAllDetail";

class SchedulerNew extends Component {
  state = {
    status: { value: "", isValid: null },
    statusOptions: [],
    params: { value: "", isValid: null },
    crontab_string: { value: "", isValid: null },
    run_asap: false,
    enabled: false
  };

  componentDidMount() {
    getSchedulerStatus().then(res => {
      const { data } = res;

      this.setState({
        statusOptions: data.scheduler_status,
        status: { value: data.scheduler_status[0].value }
      });
    });
  }

  addNotification = _ => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: <div>Scheduler successfully apply.</div>,
      level: "info"
    });
  };

  handleChange = e => {
    const state = {
      ...this.state,
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value,
        isValid: validate(e.target.name, e.target.value)
      }
    };

    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { status, params, crontab_string, run_asap, enabled } = this.state;
    const { connector } = this.props.location.state;

    const shedulerData = {
      status: status.value,
      params: params.value,
      crontab_string: crontab_string.value,
      connector_id: connector.id,
      run_asap,
      enabled
    };

    newScheduler(shedulerData).then(res => {
      this.addNotification();
      this.setState({
        status: { value: "", isValid: null },
        crontab_string: { value: "", isValid: null },
        params: { value: "", isValid: null }
      });

      const { connector, typeNavigation, client } = this.props.location.state;

      if (typeNavigation === "client_detail") {
        this.props.history.push("/admin/schedulers/" + connector.id, {
          client: client,
          connector: connector,
          typeNavigation: typeNavigation
        });
      } else if (typeNavigation === "client_detail_connector") {
        this.props.history.push("/admin/connector/" + connector.id, {
          client: client,
          connector: connector,
          typeNavigation: typeNavigation
        });
      } else if (typeNavigation === "all_connector") {
        this.props.history.push("/admin/schedulers/" + connector.id, {
          connector: connector,
          typeNavigation: typeNavigation
        });
      } else if (typeNavigation === "all_connector_detail") {
        this.props.history.push("/admin/connector/" + connector.id, {
          connector: connector,
          typeNavigation: typeNavigation
        });
      }
    });
  };

  notificationSystem = React.createRef();

  render() {
    const { params, crontab_string, statusOptions, status } = this.state;

    const { connector, typeNavigation, client } = this.props.location.state;

    return (
      <>
        <h3 className="title-page">
          Added Scheduler connector {connector.name}
        </h3>
        <div className="content">
          {typeNavigation === "client_detail" && (
            <NavClientDetail
              client={client}
              connector={connector}
              active={"Scheduler new"}
            />
          )}

          {typeNavigation === "client_detail_connector" && (
            <NavClientConnectorDetail
              client={client}
              connector={connector}
              active={"Scheduler new"}
            />
          )}

          {typeNavigation === "all_connector" && (
            <NavConnectorAll connector={connector} active={"Scheduler new"} />
          )}

          {typeNavigation === "all_connector_detail" && (
            <NavConnectorAllDetail
              connector={connector}
              active={"Scheduler new"}
            />
          )}

          <NotificationSystem ref={this.notificationSystem} style={style} />

          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  content={
                    <form onSubmit={this.onSubmit}>
                      <Row>
                        <Col md={6}>
                          <FormGroup validationState={crontab_string.isValid}>
                            <ControlLabel>Crontab string</ControlLabel>
                            <FormControl
                              type="text"
                              name="crontab_string"
                              value={crontab_string.value}
                              onChange={this.handleChange}
                            />
                          </FormGroup>

                          <Row>
                            <Col md={12}>
                              <FormGroup>
                                <ControlLabel>Status</ControlLabel>

                                <FormControl
                                  componentClass="select"
                                  name="status"
                                  onChange={this.handleChange}
                                  value={status.value}
                                >
                                  {statusOptions.map(item => {
                                    return (
                                      <option
                                        value={item.value}
                                        key={item.value}
                                      >
                                        {item.label}
                                      </option>
                                    );
                                  })}
                                </FormControl>
                              </FormGroup>

                              <FormGroup
                                validationState={
                                  this.state.clientNotesValidation
                                }
                              >
                                <ControlLabel>Enable</ControlLabel>
                                <br />
                                <BootstrapSwitchButton
                                  checked={this.state.enabled}
                                  onstyle="danger"
                                  onChange={checked =>
                                    this.setState({ enabled: checked })
                                  }
                                />
                              </FormGroup>

                              <FormGroup
                                validationState={
                                  this.state.clientNotesValidation
                                }
                              >
                                <ControlLabel>Run asap</ControlLabel>
                                <br />
                                <BootstrapSwitchButton
                                  checked={this.state.run_asap}
                                  onstyle="danger"
                                  onChange={checked =>
                                    this.setState({ run_asap: checked })
                                  }
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>

                        <Col md={6}>
                          <FormGroup validationState={params.isValid}>
                            <ControlLabel>Params</ControlLabel>
                            <FormControl
                              rows="5"
                              componentClass="textarea"
                              bsClass="form-control"
                              name="params"
                              value={params.value}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Button
                        bsStyle="success"
                        fill
                        type="submit"
                        disabled={disabledButton(this.state)}
                      >
                        Create scheduler
                      </Button>
                    </form>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </>
    );
  }
}

export default SchedulerNew;
