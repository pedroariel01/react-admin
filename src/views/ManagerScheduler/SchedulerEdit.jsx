import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import { style } from "../../variables/Variables.jsx";

import NotificationSystem from "react-notification-system";

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { validate } from "../../validations/schedulers";
import {
  getScheduler,
  updateScheduler,
  getSchedulerStatus
} from "../../api/manager";

import NavClientDetail from "./SchedulerNavigation/NavClientDetail";
import NavClientConnectorDetail from "./SchedulerNavigation/NavClientConnectorDetail";
import NavConnectorAll from "./SchedulerNavigation/NavConnectorAll";
import NavConnectorAllDetail from "./SchedulerNavigation/NavConnectorAllDetail";

class SchedulerEdit extends Component {
  state = {
    status: { value: "", isValid: null },
    params: { value: "", isValid: null },
    statusOptions: [],
    crontab_string: { value: "", isValid: null },
    run_asap: false,
    enabled: false,
    connector: null,
    loading: true
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

  addNotification = _ => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: <div>Scheduler successfully apply.</div>,
      level: "info"
    });
  };

  onSubmit = e => {
    this.setState({ loading: true });

    e.preventDefault();

    const {
      status,
      params,
      crontab_string,
      run_asap,
      enabled,
      connector
    } = this.state;

    const shedulerData = {
      status: status.value,
      params: params.value,
      crontab_string: crontab_string.value,
      run_asap,
      enabled,
      connector: connector.id
    };

    updateScheduler(this.props.match.params.id, shedulerData).then(res => {
      this.addNotification();
      this.setState({
        loading: false
      });

      const { connector, client, typeNavigation } = this.props.location.state;

      if (typeNavigation === "client_detail") {
        this.props.history.push("/admin/schedulers/" + connector.id, {
          client: client,
          connector: connector,
          typeNavigation: typeNavigation
        });
      } else if (typeNavigation === "client_detail_connector") {
        this.props.history.push("/admin/connector/" + connector.id, {
          client: client,
          connector: connector
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

  componentDidMount() {
    getSchedulerStatus().then(res => {
      const { data } = res;

      this.setState({ statusOptions: data.scheduler_status });
    });

    getScheduler(this.props.match.params.id).then(res => {
      const { run_asap, enabled, crontab_string, status, params } = res.data;

      this.setState({
        run_asap,
        enabled,
        crontab_string: { value: crontab_string, isValid: null },
        status: { value: status[0], isValid: null },
        params: { value: params, isValid: null },
        connector: this.props.location.state.connector,
        loading: false
      });
    });
  }

  notificationSystem = React.createRef();

  render() {
    const {
      status,
      params,
      crontab_string,
      loading,
      statusOptions
    } = this.state;

    const { connector, typeNavigation, client } = this.props.location.state;

    return (
      <>
        <h3 className="title-page">
          Update Scheduler <b>{connector.name}</b>
        </h3>
        <div className="content">
          {typeNavigation === "client_detail" && (
            <NavClientDetail
              client={client}
              connector={connector}
              active={"Scheduler edit"}
            />
          )}

          {typeNavigation === "client_detail_connector" && (
            <NavClientConnectorDetail
              client={client}
              connector={connector}
              active={"Scheduler edit"}
            />
          )}

          {typeNavigation === "all_connector" && (
            <NavConnectorAll connector={connector} active={"Scheduler edit"} />
          )}

          {typeNavigation === "all_connector_detail" && (
            <NavConnectorAllDetail
              connector={connector}
              active={"Scheduler edit"}
            />
          )}

          <NotificationSystem ref={this.notificationSystem} style={style} />

          <Grid fluid>
            {loading && (
              <Loader
                type="Circles"
                color="rgb(161, 232, 44)"
                height={100}
                width={100}
                className="loader"
              />
            )}
            <Row>
              <Col md={12}>
                {!loading && (
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
                                  >
                                    {statusOptions.map(item => {
                                      if (item.value === status.value) {
                                        return (
                                          <option
                                            value={item.value}
                                            selected
                                            key={item.value}
                                          >
                                            {item.label}
                                          </option>
                                        );
                                      } else {
                                        return (
                                          <option value={item.value}>
                                            {item.label}
                                          </option>
                                        );
                                      }
                                    })}
                                  </FormControl>
                                </FormGroup>

                                <FormGroup>
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
                          disabled={
                            params.isValid === "error" ||
                            crontab_string.isValid === "error"
                          }
                        >
                          Edit scheduler
                        </Button>
                      </form>
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

export default SchedulerEdit;
