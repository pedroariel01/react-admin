import React, { Component } from "react";
import { Grid, Row, Col, Alert } from "react-bootstrap";

import Button from "../components/CustomButton/CustomButton.jsx";

class MiddleWareSpider extends Component {
  state = {
    middlewares: [],
    middlwareLabel: { isValid: null, value: "" },
    middlewareValue: { isValid: null, value: "" },
    formInvalid: true
  };

  isValidForm = _ => {
    const {
      middlwareLabel: { isValid: isValidMiddlewareLabel },
      middlewareValue: { isValid: isValidMiddlewareValue }
    } = this.state;

    this.setState({
      formInvalid:
        isValidMiddlewareLabel === "has-error" ||
        isValidMiddlewareLabel === null ||
        isValidMiddlewareValue === "has-error" ||
        isValidMiddlewareValue === null
    });
  };

  addedMiddleWare = _ => {
    const { handleMiddlewares } = this.props;

    const { middlwareLabel, middlewareValue, middlewares } = this.state;
    this.setState(
      {
        middlewares: middlewares.concat({
          label: middlwareLabel.value,
          value: middlewareValue.value
        })
      },
      () => {
        handleMiddlewares(middlewares);
      }
    );
  };

  handleDelete = middlewareLabel => {
    const { handleMiddlewares } = this.props;

    const { middlewares } = this.state;
    this.setState(
      {
        middlewares: middlewares.filter(item => item.label != middlewareLabel)
      },
      () => {
        handleMiddlewares(this.state.middlewares);
      }
    );
  };

  handleChange = e => {
    const state = {
      ...this.state,
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value,
        isValid: e.target.value != "" ? "has-success" : "has-error"
      }
    };

    this.setState(state, () => this.isValidForm());
  };

  render() {
    const {
      middlewares,
      middlwareLabel,
      middlewareValue,
      formInvalid
    } = this.state;

    return (
      <div>
        <h3>Middleware section</h3>

        {middlewares.map(item => {
          return (
            <div className="middleware" key={item.label}>
              <b>{item.label}:</b>
              {item.value}
              <span
                className="deleteMiddleware"
                onClick={_ => this.handleDelete(item.label)}
              >
                {" "}
                Delete
              </span>
            </div>
          );
        })}

        <div
          className={`form-group middleware-group ${middlwareLabel.isValid}`}
        >
          <input
            type="text"
            className="middlwareInput form-control"
            value={middlwareLabel.value}
            name="middlwareLabel"
            onChange={this.handleChange}
          />
        </div>

        <div
          className={`form-group middleware-group ${middlewareValue.isValid}`}
        >
          <input
            type="text"
            className="middlwareInput form-control"
            value={middlewareValue.value}
            name="middlewareValue"
            onChange={this.handleChange}
          />
        </div>

        <input
          type="button"
          className="btn-fill btn btn-success"
          value="Add middlware"
          disabled={formInvalid}
          onClick={this.addedMiddleWare}
        />
      </div>
    );
  }
}

export default MiddleWareSpider;
