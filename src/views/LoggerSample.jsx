import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table,
  Badge,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import Button from "../components/CustomButton/CustomButton.jsx";
import Card from "../components/Card/Card.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {
  getLogger,
  stopSpider,
  restartSpider,
  startMapping
} from "../api/spiders";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { validate } from "../validations/commons";

class Logger extends Component {
  state = {
    loggerList: [],
    loading: false,
    interval: null,
    showModal: false,
    loggerToRun: null,
    finalSchemaToRun: { value: "", isValid: null },
    loggerName: { value: "", isValid: null }
  };

  onChangeValue = e => {
    const state = {
      ...this.state,
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value,
        isValid: validate(e.target.value)
      }
    };

    this.setState(state);
  };

  updateLogs = _ => {
    this.setState({ loading: true });

    getLogger().then(res => {
      const { data } = res;

      this.setState({ loggerList: data });
      this.setState({ loading: false });
    });
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentDidMount() {
    this.updateLogs();

    let t = setInterval(this.updateLogs, 9100);

    this.setState({ interval: t });
  }

  handleSpiderStop = spider_pid => {
    confirmAlert({
      title: "Confirm to stop spider",
      message: "Are you sure to stop spider",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            stopSpider(spider_pid);
          }
        },
        { label: "No" }
      ]
    });
  };

  handleClose = _ => {
    this.setState({ showModal: false });
  };

  handleShow = logger => {
    this.setState({
      showModal: true,
      loggerToRun: logger,
      finalSchemaToRun: {
        value: logger.final_schema_name,
        isValid: "success"
      }
    });
  };

  handleRestartSpider = _ => {
    const { loggerToRun, finalSchemaToRun, loggerName } = this.state;

    restartSpider(
      loggerToRun.id,
      finalSchemaToRun.value,
      loggerName.value
    ).then(_ => {
      this.setState({ showModal: false });
    });
  };

  handleStartMappin = logger => {
    startMapping(logger.id).then(_ => {
      this.props.history.push("/admin/detail/logger/" + logger.id, {
        logger: {
          name_logger: logger.name_logger,
          file: logger.log_mapping_file
        },
        type_logger: "log_file"
      });
    });
  };

  render() {
    const {
      loggerList,
      loading,
      showModal,
      loggerToRun,
      finalSchemaToRun,
      loggerName
    } = this.state;

    const loggerListMarkup = loggerList.map(logger => {
      return (
        <tr key={logger.id}>
          <td>{logger.name_logger}</td>
          <td>{logger.data_origin_table}</td>
          <td>{logger.data_origin_field}</td>
          <td>{logger.final_schema_name}</td>
          <td>
            {logger.spider_running ? (
              <Badge className="badgeOn">On</Badge>
            ) : (
                <Badge className="badgeOff">Off</Badge>
              )}
          </td>
          <td className="table-action-logger">
            <>
              <span
                className="spanLink"
                onClick={_ => this.handleStartMappin(logger)}
              >
                Start mapping
              </span>
              |
            </>
            {logger.log_mapping_file && (
              <>
                <Link
                  className="actionLogger"
                  title="Detail map"
                  key={logger.id}
                  to={{
                    pathname: "/admin/detail/logger/" + logger.id,
                    state: {
                      logger: {
                        name_logger: logger.name_logger,
                        file: logger.log_mapping_file
                      },
                      type_logger: "log_file"
                    }
                  }}
                >
                  Map file
                </Link>
                |
              </>
            )}
            <>
              <span className="spanLink" onClick={_ => this.handleShow(logger)}>
                Restart spider
              </span>
              |
            </>
            <span
              className="spanLink"
              onClick={_ => this.handleSpiderStop(logger.id)}
            >
              Stop spider
            </span>
            |
            <Link
              className="actionLogger"
              title="Detail log"
              key={logger.id}
              to={{
                pathname: "/admin/detail/logger/" + logger.id,
                state: {
                  logger: {
                    name_logger: logger.name_logger,
                    file: logger.spider_log_config
                  },
                  type_logger: "log_file"
                }
              }}
            >
              Log config file
            </Link>
            |
            <Link
              className="actionLogger"
              title="Detail log"
              key={logger.id}
              to={{
                pathname: "/admin/detail/logger/" + logger.id,
                state: {
                  logger: {
                    name_logger: logger.name_logger,
                    file: logger.file_path
                  },
                  type_logger: "log_file"
                }
              }}
            >
              Log file
            </Link>
            |
            <Link
              className="actionLogger"
              title="Detail log"
              key={logger.id}
              to={{
                pathname: "/admin/detail/logger/" + logger.id,
                state: {
                  logger: logger,
                  type_logger: "parser_log"
                }
              }}
            >
              Parser log
            </Link>
            {/* |
            <Link
              className="actionLogger"
              title="Detail log"
              key={logger.id}
              to={{
                pathname: "/admin/detail/logger/" + logger.id,
                state: {
                  logger: logger,
                  type_logger: "raw_data"
                }
              }}
            >
              Raw Data
            </Link> */}
          </td>
        </tr>
      );
    });

    return (
      <>
        <h3 className="title-page">Logger List</h3>
        <div className="content modal-run-spider">
          {showModal && (
            <Modal show={showModal} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Run the spider using the originals params
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="detailParams">
                  <Col md={6}>
                    <div className="paramSpider">
                      <b>Concurrent request:</b>{" "}
                      {loggerToRun.concurrent_request}
                    </div>

                    <div className="paramSpider">
                      <b>Download delay: </b>
                      {loggerToRun.download_delay > 0 && (
                        <span>{loggerToRun.download_delay}</span>
                      )}
                    </div>

                    <div className="paramSpider">
                      <b>Autothrottle target concurrency: </b>
                      {loggerToRun.autothrottle_target_concurrency}
                    </div>

                    <div className="paramSpider">
                      <b>enabled_proxy: </b>
                      {loggerToRun.enabled_proxy ? (
                        <Badge className="badgeOn">On</Badge>
                      ) : (
                          <Badge className="badgeOff">Off</Badge>
                        )}
                    </div>

                    <div className="paramSpider">
                      <b>Random ua per proxy: </b>
                      {loggerToRun.random_ua_per_proxy ? (
                        <Badge className="badgeOn">On</Badge>
                      ) : (
                          <Badge className="badgeOff">Off</Badge>
                        )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="paramSpider">
                      <b>Proxymesh timeout: </b>
                      {loggerToRun.proxymesh_timeout}
                    </div>

                    <div className="paramSpider">
                      <b>Robotstxt obey: </b>
                      {loggerToRun.robotstxt_obey ? (
                        <Badge className="badgeOn">On</Badge>
                      ) : (
                          <Badge className="badgeOff">Off</Badge>
                        )}
                    </div>

                    <div className="paramSpider">
                      <b>Autothrottle debug: </b>
                      {loggerToRun.autothrottle_debug ? (
                        <Badge className="badgeOn">On</Badge>
                      ) : (
                          <Badge className="badgeOff">Off</Badge>
                        )}
                    </div>

                    <div className="paramSpider">
                      <b>Autothrottle enabled: </b>
                      {loggerToRun.autothrottle_enabled ? (
                        <Badge className="badgeOn">On</Badge>
                      ) : (
                          <Badge className="badgeOff">Off</Badge>
                        )}
                    </div>

                    <div className="paramSpider">
                      <b>Autothrottle start delay: </b>
                      {loggerToRun.autothrottle_start_delay}
                    </div>
                  </Col>
                </Row>

                <FormGroup validationState={finalSchemaToRun.isValid}>
                  <ControlLabel>
                    <b>Final schema name</b>
                  </ControlLabel>

                  <FormControl
                    type="text"
                    name="finalSchemaToRun"
                    value={finalSchemaToRun.value}
                    onChange={this.onChangeValue}
                  />
                </FormGroup>

                <FormGroup validationState={loggerName.isValid}>
                  <ControlLabel>
                    <b>Log name </b>
                  </ControlLabel>
                  <div className="helpField">
                    Log name is used to named logs files for track individual
                    spider execution
                  </div>

                  <FormControl
                    type="text"
                    name="loggerName"
                    value={loggerName.value}
                    onChange={this.onChangeValue}
                  />
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  bsStyle="success"
                  pullLeft
                  fill
                  disabled={
                    finalSchemaToRun.isValid == "error" ||
                    finalSchemaToRun.isValid == null ||
                    loggerName.isValid == "error" ||
                    loggerName.isValid == null
                  }
                  onClick={this.handleRestartSpider}
                >
                  Run Spider
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          <Grid fluid>
            <Row>
              <Col md={12}>
                {loading && (
                  <Loader
                    type="Circles"
                    color="rgb(161, 232, 44)"
                    height={100}
                    width={100}
                    className="loader"
                  />
                )}
                {loggerList.length > 0 && !loading && (
                  <Card
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Name Logger</th>
                            <th>Data origin table</th>
                            <th>Data origin field</th>
                            <th>Final Schema Name</th>
                            <th>Spider is running</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{loggerListMarkup}</tbody>
                      </Table>
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

export default Logger;
