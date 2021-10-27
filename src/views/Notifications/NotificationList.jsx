import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "../../components/Card/Card.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { notifications } from "../../api/notification";
import { NavLink, Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

class NotificationList extends Component {
  state = {
    notificationList: [],
    loading: true
  };

  componentDidMount() {
    notifications().then(data => {
      this.setState({ notificationList: data, loading: false });
    });
  }

  render() {
    const { notificationList, loading } = this.state;

    const notificationMarkup = notificationList.map(notification => {
      return (
        <tr key={notification.id}>
          <td>{notification.type}</td>
          <td>{notification.sender_name}</td>
          <td>{notification.sender_host}</td>
          <td>{notification.sender_process_pid}</td>
          {/* This replace will be remove and fixed it on backend */}
          <td>{notification.created_at.replace("T", " ").replace("Z", " ")}</td>
          <td>
            {notification.viewed ? (
              <Badge className="badgeOn">Yes</Badge>
            ) : (
              <Badge className="badgeOff">No</Badge>
            )}
          </td>
          <td className="table-action-client">
            <Link
              title="Detail notification"
              key={1}
              to={{
                pathname: "/admin/detail/notification",
                state: {
                  notification: notification
                }
              }}
            >
              <i className="mr-5 pe-7s-search action-icon" />
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <>
        <h3 className="title-page">Notification List</h3>
        <div className="content">
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
                {notificationList.length > 0 && !loading && (
                  <Card
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table striped hover>
                        <thead>
                          <tr>
                            <td>Type</td>
                            <td>Sender name</td>
                            <td>Sender host</td>
                            <td>Pid</td>
                            <td>Create at</td>
                            <td>View</td>
                            <td>Action</td>
                          </tr>
                        </thead>
                        <tbody>{notificationMarkup}</tbody>
                      </Table>
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

export default NotificationList;
