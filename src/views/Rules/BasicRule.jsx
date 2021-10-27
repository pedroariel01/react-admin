import React, { Component } from "react";
import { getRules } from "../../api/rules/rules";
import Card from "../../components/Card/Card.jsx";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

class BasicRule extends Component {
  state = {
    rules: []
  };

  componentDidMount() {
    getRules().then(res => {
      console.log(res);

      const { data } = res;

      this.setState({ rules: data });
    });
  }

  render() {
    const { rules } = this.state;

    return (
      <div>
        <Link to="/admin/basic/rule/insert">
          <Button className={"btn-fill"} bsStyle="success">
            New Rule
          </Button>
        </Link>
        <Card
          ctTableFullWidth
          ctTableResponsive
          content={
            <Table striped hover>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Description</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {rules.map(item => {
                  return (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          }
        />
      </div>
    );
  }
}

export default BasicRule;
