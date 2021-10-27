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
import { loginUser } from "../../actionsStore/authActions";

class LoginForm extends Component {
  state = {
    username: { value: "", isValid: null },
    password: { value: "", isValid: null }
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

    const { username, password } = this.state;

    const { loginUser, history } = this.props;

    loginUser(
      { username: username.value, password: password.value },
      history
    ).then(res => {
      const { error } = this.props;

      if (Object.keys(error).length !== 0) {
        this.setState({
          password: { value: "", isValid: "error" }
        });
      }
    });
  };

  notificationSystem = React.createRef();

  render() {
    const { username, password } = this.state;

    return (
      <>
        <div className="containerAuth">
          <NotificationSystem ref={this.notificationSystem} style={style} />

          <Card
            content={
              <form onSubmit={this.onSubmit}>
                <h3>Log in</h3>
                <FormGroup
                  controlId="formValidationSuccess1"
                  validationState={username.isValid}
                >
                  <ControlLabel>User name</ControlLabel>
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
                {/* <div class="helpField">
                  To create your account please follow this link{" "}
                  <Link to={"/admin/register"}>Register new account</Link>
                </div> */}

                <Button
                  bsStyle="success"
                  pullRight
                  fill
                  type="submit"
                  disabled={
                    username.isValid !== "success" ||
                    password.isValid !== "success"
                  }
                >
                  Login
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
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, { loginUser })(LoginForm);
