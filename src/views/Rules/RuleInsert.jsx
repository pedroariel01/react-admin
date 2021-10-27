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
import { validate, requireDisabledButton } from "../../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables.jsx";

class InsertRuleBasic extends Component {
  state = {
    name: { value: "", isValid: null },
    description: { value: "", isValid: null },
    action: { value: "", isValid: null },
    loading: false
  };
  render() {
    const { loading, name, description, action } = this.state;

    return (
      <>
        <h3 className="title-page">Client new</h3>
        <div className="content">


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
                  timeout={3000} //3 secs
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
                          <ControlLabel>Name</ControlLabel>
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
                          validationState={action.isValid}
                        >
                          <ControlLabel>Action</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            name="confluence_pages_urls"
                            value={action.value}
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

export default InsertRuleBasic;
