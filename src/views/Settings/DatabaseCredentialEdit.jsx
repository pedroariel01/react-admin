import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import { updateDatabaseCredential } from "../../api/databases";
import { validate, requireDisabledButton } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";

class DatabaseCredentialEdit extends Component {
  state = {
    host: { value: "", isValid: null },
    username: { value: "", isValid: null },
    password: { value: "", isValid: null },
    loading: false,
    id: ""
  };

  handleChange = e => {
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

  componentDidMount() {
    const {
      databaseCredential: { id, host, username }
    } = this.props.location.state;

    this.setState({
      id,
      host: { value: host, isValid: "success" },
      username: { value: username, isValid: "success" }
    });
  }

  // addNotification = _ => {
  //   const { name } = this.state;
  //   const notification = this.notificationSystem.current;
  //   notification.addNotification({
  //     message: (
  //       <div>
  //         Client <b>{name.value}</b> successfully save.
  //       </div>
  //     ),
  //     level: "info"
  //   });
  // };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    updateDatabaseCredential(this.state).then(res => {
      this.props.history.push("/admin/database/");
    });
  };

  notificationSystem = React.createRef();

  render() {
    const { loading, host, username, password } = this.state;

    return (
      <>
        <h3 className="title-page">Database credential new</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/database">Database Credential List</Link>
            </li>
            <li className="active">
              <span>Database credential new</span>
            </li>
          </ol>

          <NotificationSystem ref={this.notificationSystem} style={style} />
          <Grid fluid>
            <Row>
              {loading && (
                <Loader
                  type="Circles"
                  color="rgb(161, 232, 44)"
                  height={100}
                  width={100}
                  className="loader"
                />
              )}

              <Col md={12}>
                {!loading && (
                  <Card
                    content={
                      <form onSubmit={this.onSubmit}>
                        <FormGroup
                          controlId="formValidationSuccess1"
                          validationState={host.isValid}
                        >
                          <ControlLabel>Host</ControlLabel>
                          <FormControl
                            type="text"
                            name="host"
                            value={host.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup
                          controlId="formValidationSuccess1"
                          validationState={username.isValid}
                        >
                          <ControlLabel>Username</ControlLabel>
                          <FormControl
                            type="text"
                            name="username"
                            value={username.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup
                          controlId="formValidationSuccess1"
                          validationState={password.isValid}
                        >
                          <ControlLabel>Password</ControlLabel>
                          <FormControl
                            type="password"
                            name="password"
                            value={password.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <Button bsStyle="success" pullRight fill type="submit">
                          Update credential
                        </Button>
                        <div className="clearfix" />
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

export default DatabaseCredentialEdit;
