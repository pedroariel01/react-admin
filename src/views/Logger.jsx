import React, { Component } from "react";
import { getLogs, getTableInfo } from "../api/spiders";
import { Grid, Row, Col, Table } from "react-bootstrap";

class Logger extends Component {
  state = {
    loggerName: "",
    content: "",
    interval: null,
    logger: null,
    type_logger: null
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getNewLogs = _ => {
    const {
      logger: { name_logger },
      type_logger
    } = this.state;

    if (type_logger === "log_file") {
      //get logs from file
      const {
        logger: { file }
      } = this.state;

      getLogs(name_logger, file).then(res => {
        const {
          data: { content }
        } = res;

        this.setState({ content });
      });
    } else {
      //get logs from database table
      const { logger, type_logger } = this.state;
      getTableInfo(logger.id, type_logger).then(res => {
        const {
          data: { content }
        } = res;
        this.setState({ content });
      });
    }
  };

  startLogger = _ => {
    this.getNewLogs();
    let t = setInterval(this.getNewLogs, 9000);
    this.setState({ interval: t });
  };

  componentDidMount() {
    if (this.props.location) {
      const { logger, type_logger } = this.props.location.state;

      this.setState(
        {
          logger: logger,
          type_logger
        },
        () => {
          this.startLogger();
        }
      );
    } else {
      const { logger, type_logger } = this.props;
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
      console.log(logger);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
      this.setState({ logger, type_logger }, () => {
        this.startLogger();
      });
    }
  }

  render() {
    const { content, type_logger, logger } = this.state;
    let contentMarkup = "";

    if (type_logger && type_logger == "raw_data" && content !== "") {
      contentMarkup = (
        <Table>
          <thead>
            <tr>
              <th>Pin</th>
              <th>Subtype</th>
              <th>Building number</th>
              <th>Path</th>
              <th>Url</th>
            </tr>
          </thead>

          <tbody>
            {content.map(item => {
              return (
                <tr key={item.id}>
                  <td>{item.pin}</td>
                  <td>{item.subtype}</td>
                  <td>{item.building_number}</td>
                  <td>{item.path}</td>
                  <td>{item.url}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    } else if (type_logger && type_logger == "parser_log" && content !== "") {
      contentMarkup = (
        <Table>
          <thead>
            <tr>
              <th>Pin</th>
              <th>Message</th>
              <th>Url</th>
            </tr>
          </thead>

          <tbody>
            {content.map(item => {
              return (
                <tr key={item.id}>
                  <td>{item.pin}</td>
                  <td>{item.message}</td>
                  <td>{item.url}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    } else {
      contentMarkup = content;
    }

    return (
      <>
        {/* <h1>{name_logger}</h1> */}
        <h2>{logger && logger.name_logger}</h2>
        <h3>{logger && logger.file}</h3>
        <pre className="terminal">{contentMarkup}</pre>
      </>
    );
  }
}
export default Logger;
