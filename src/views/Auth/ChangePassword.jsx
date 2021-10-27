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

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import { validate } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";
import { connect } from "react-redux";
import { changeUserPassword } from "../../actionsStore/authActions";

class ChangePassword extends Component {
  state = {
    password: { value: "", isValid: null },
    confirmPassword: { value: "", isValid: null, isSamePassword: null },
    loading: false
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

  addNotification = _ => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: <div>Successfully change password.</div>,
      level: "info"
    });
  };

  onSubmit = e => {
    e.preventDefault();
    // this.setState({ loading: true });

    const { password, confirmPassword } = this.state;

    if (password.value !== confirmPassword.value) {
      this.setState({
        confirmPassword: { isSamePassword: false, value: "", isValid: "error" }
      });
    } else {
      const { changeUserPassword } = this.props;

      changeUserPassword({ password: password.value }).then(_ => {
        this.setState({
          username: { value: "" },
          confirmPassword: { value: "" }
        });
      });

      this.addNotification();
    }
  };

  notificationSystem = React.createRef();

  render() {
    const { password, confirmPassword, loading } = this.state;

    return (
      <>
        <div>
          <h3 className="title-page">New Password</h3>
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
                          validationState={password.isValid}
                        >
                          <ControlLabel>New Password</ControlLabel>
                          <FormControl
                            type="password"
                            name="password"
                            value={password.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup
                          controlId="formValidationSuccess1"
                          validationState={confirmPassword.isValid}
                        >
                          <ControlLabel>Confirm Password</ControlLabel>
                          <FormControl
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword.value}
                            onChange={this.handleChange}
                          />

                          {confirmPassword.isSamePassword === false && (
                            <div class="helpField error-color">
                              Confirm password must be equal to password
                            </div>
                          )}
                        </FormGroup>

                        <Button
                          bsStyle="success"
                          pullRight
                          fill
                          type="submit"
                          disabled={
                            password.isValid !== "success" ||
                            confirmPassword.isValid !== "success"
                          }
                        >
                          Change password
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

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { changeUserPassword })(ChangePassword);
