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
import { validate } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";
import { connect } from "react-redux";
import { registerUser } from "../../actionsStore/authActions";

class RegisterUser extends Component {
  state = {
    username: { value: "", isValid: null },
    password: { value: "", isValid: null },
    confirmPassword: { value: "", isValid: null, isSamePassword: null }
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
    const { name } = this.state;
    const notification = this.notificationSystem.current;
    // notification.addNotification({
    //   message: (
    //     <div>
    //       Client <b>{name.value}</b> successfully save.
    //     </div>
    //   ),
    //   level: "info"
    // });
  };

  onSubmit = e => {
    e.preventDefault();
    // this.setState({ loading: true });

    const { username, password, confirmPassword } = this.state;

    if (username.value !== confirmPassword.value) {
      this.setState({ confirmPassword: { isSamePassword: false } });
    }

    const { registerUser, history } = this.props;

    registerUser(
      { username: username.value, password: password.value },
      history
    );
  };

  notificationSystem = React.createRef();

  render() {
    const { username, password, confirmPassword } = this.state;

    return (
      <>
        <div className="containerAuth">
          <NotificationSystem ref={this.notificationSystem} style={style} />

          <Card
            content={
              <form onSubmit={this.onSubmit}>
                <h3>Register</h3>
                <FormGroup validationState={username.isValid}>
                  <ControlLabel>User name</ControlLabel>
                  <FormControl
                    type="text"
                    name="username"
                    value={username.value}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup validationState={password.isValid}>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    name="password"
                    value={password.value}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup validationState={confirmPassword.isValid}>
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

                <div class="helpField">
                  <Link to={"/admin/login"}>Back to log in</Link>
                </div>

                <Button
                  bsStyle="success"
                  pullRight
                  fill
                  type="submit"
                  disabled={
                    username.isValid !== "success" ||
                    password.isValid !== "success" ||
                    confirmPassword.isValid !== "success"
                  }
                >
                  Register
                </Button>
                <div className="clearfix" />
              </form>
            }
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { registerUser })(RegisterUser);
