import React, { Component } from "react";

import { Row, Col, Table, Badge, Tab, NavItem, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { reviewNotification } from "../../api/notification";
import { connect } from "react-redux";
import { notificationsUnView } from "../../actionsStore/notificationAction";

class DetailNotification extends Component {
  componentDidMount() {
    const {
      notification: { id }
    } = this.props.location.state;

    reviewNotification(id).then(_ => this.props.notificationsUnView());
  }

  render() {
    const { notification } = this.props.location.state;

    return (
      <>
        <h3 className="title-page">Detail Notification</h3>
        <div className="content">
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/notifications">Notifications</Link>
            </li>
            <li className="active">Detail Notification</li>
          </ol>
          <Tab.Container id="left-tabs-example" defaultActiveKey="general">
            <Row className="clearfix">
              <Col sm={3}>
                <Nav bsStyle="pills" stacked>
                  <NavItem eventKey="general">General</NavItem>
                  <NavItem eventKey="description">Description</NavItem>
                </Nav>
              </Col>
              <Col sm={8} mdOffset={1}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="general">
                    <Row className="panelRow">
                      <Col md={2}>
                        <Badge className="badgeLabel">Type</Badge>
                      </Col>
                      <Col md={10}>{notification.type}</Col>
                    </Row>
                    <Row className="panelRow">
                      <Col md={2}>
                        <Badge className="badgeLabel">Sender name</Badge>
                      </Col>
                      <Col md={10}>{notification.sender_name}</Col>
                    </Row>
                    <Row className="panelRow">
                      <Col md={2}>
                        <Badge className="badgeLabel">Sender host</Badge>
                      </Col>
                      <Col md={10}>{notification.sender_host}</Col>
                    </Row>
                    <Row className="panelRow">
                      <Col md={2}>
                        <Badge className="badgeLabel">Pid</Badge>
                      </Col>
                      <Col md={10}>{notification.sender_process_pid}</Col>
                    </Row>
                    <Row className="panelRow">
                      <Col md={2}>
                        <Badge className="badgeLabel">Create at</Badge>
                      </Col>
                      <Col md={10}>
                        {notification.created_at
                          .replace("T", " ")
                          .replace("Z", " ")}
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="description">
                    {notification.description}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </>
    );
  }
}

export default connect(null, { notificationsUnView })(DetailNotification);
