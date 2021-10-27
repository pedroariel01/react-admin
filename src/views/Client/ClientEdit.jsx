import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { validate, requireDisabledButton } from "../../validations/commons";
import { Link } from "react-router-dom";
import { updateClient, getClient } from "../../api/clients";

import { Card } from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class ClientEdit extends Component {
  state = {
    name: { value: "", isValid: "success" },
    description: { value: "", isValid: "success" },
    confluence_pages_urls: { value: "", isValid: "success" },
    loading: false
  };

  componentDidMount() {
    getClient(this.props.match.params.id).then(res => {
      const {
        data: { name, description, confluence_pages_urls }
      } = res;

      this.setState({
        name: { isValid: "success", value: name },
        description: { isValid: "success", value: description },
        confluence_pages_urls: {
          isValid: "success",
          value: confluence_pages_urls
        },
        loading: false
      });
    });
  }

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
          Client <b>{name.value}</b> successfully updated.
        </div>
      ),
      level: "info"
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, description, confluence_pages_urls } = this.state;
    this.setState({ loading: true });

    updateClient(this.props.match.params.id, {
      name: name.value,
      description: description.value,
      confluence_pages_urls: confluence_pages_urls.value
    }).then(res => {
      this.setState({ loading: false });
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
        <h3 className="title-page">Client edit</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/clients">Client List</Link>
            </li>
            <li className="active">
              <span>Edit new</span>
            </li>
          </ol>

          <NotificationSystem ref={this.notificationSystem} style={style} />
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

                        <FormGroup>
                          <ControlLabel>Description</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Here can be your description"
                            name="description"
                            value={description.value}
                            onChange={this.handleChange}
                          />
                        </FormGroup>

                        <FormGroup>
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
                          Update client
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

export default ClientEdit;
