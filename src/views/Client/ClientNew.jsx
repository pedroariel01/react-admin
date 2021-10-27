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
import { newClient } from "../../api/clients";
import { validate, requireDisabledButton } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";

class ClientNew extends Component {
  state = {
    name: { value: "", isValid: null },
    description: { value: "", isValid: null },
    confluence_pages_urls: { value: "", isValid: null },
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
    const { name } = this.state;
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: (
        <div>
          Client <b>{name.value}</b> successfully save.
        </div>
      ),
      level: "info"
    });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    newClient(this.state).then(res => {
      this.setState({
        name: { value: "", isValid: null },
        description: { value: "", isValid: null },
        confluence_pages_urls: { value: "", isValid: null },
        loading: false
      });

      this.addNotification();
      const { data } = res;
      this.props.history.push("/admin/clientconnectors/" + data.id, {
        client: data
      });
    });
  };

  notificationSystem = React.createRef();

  render() {
    const { loading, name, confluence_pages_urls, description } = this.state;

    return (
      <>
        <h3 className="title-page">Client new</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/clients">Client List</Link>
            </li>
            <li className="active">
              <span>Client new</span>
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
                          validationState={name.isValid}
                        >
                          <ControlLabel>Client name</ControlLabel>
                          <FormControl
                            type="text"
                            name="name"
                            value={name.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup validationState={description.isValid}>
                          <ControlLabel>Description</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            name="description"
                            value={description.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup
                          validationState={confluence_pages_urls.isValid}
                        >
                          <ControlLabel>Confluence Pages Urls</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            name="confluence_pages_urls"
                            value={confluence_pages_urls.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <Button
                          bsStyle="success"
                          pullRight
                          fill
                          type="submit"
                          disabled={requireDisabledButton(this.state, ["name"])}
                        >
                          Create client
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

export default ClientNew;
