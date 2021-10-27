import React, { Component } from "react";
import { NavItem, Nav, MenuItem, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { logoutUser } from "../../actionsStore/authActions";
import { withRouter } from "react-router-dom";
// import { notificationsUnView } from "../../api/notification";
import { Link } from "react-router-dom";
import { notificationsUnView } from "../../actionsStore/notificationAction";

class AdminNavbarLinks extends Component {
  state = {
    notifications: [],
    totalUnview: 0,
    interval: null
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  manageShowMore = _ => {
    const { history } = this.props;

    history.push("/admin/notifications");
  };

  updateNotifications = _ => {
    this.props.notificationsUnView();
  };

  componentDidMount() {
    this.updateNotifications();

    let t = setInterval(this.updateNotifications, 9000);
    this.setState({ interval: t });
  }

  handleLogout = () => {
    const { logoutUser, history } = this.props;

    logoutUser(history);
  };

  handleAccount = () => {
    const { history } = this.props;

    history.push("/admin/auth/account");
  };

  handleDetailNotification = notify => {
    this.props.history.push("/admin/detail/notification", {
      notification: notify
    });
  };

  render() {
    const {
      auth: { isAuthenticated },
      notificationsData: { notifications, totalUnview }
    } = this.props;

    // const { total_unview } = this.state;

    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        {notifications.length > 0 && (
          <>
            <span className="notification">{totalUnview}</span>
            <p className="hidden-lg hidden-md">Notification</p>
          </>
        )}
      </div>
    );
    return (
      <div>
        <Nav>
          {/* <NavItem eventKey={1} href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem> */}
          <NavDropdown
            eventKey={2}
            title={notification}
            noCaret
            id="basic-nav-dropdown"
          >
            {notifications.map(notify => {
              return (
                <MenuItem
                  eventKey={notify.id}
                  key={notify.id}
                  onClick={_ => this.handleDetailNotification(notify)}
                >
                  {notify.type} {notify.sender_name} {notify.description}
                </MenuItem>
              );
            })}

            {notifications.length > 0 && (
              <MenuItem onClick={_ => this.manageShowMore()}>
                Show more
              </MenuItem>
            )}
          </NavDropdown>
          {/* <NavItem eventKey={3} href="#">
            <i className="fa fa-search" />
            <p className="hidden-lg hidden-md">Search</p>
          </NavItem> */}
        </Nav>
        <Nav pullRight>
          <NavItem onClick={this.handleAccount}>Account</NavItem>

          <NavDropdown
            eventKey={2}
            title="Dropdown"
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1}>Action</MenuItem>
            <MenuItem eventKey={2.2}>Another action</MenuItem>
            <MenuItem eventKey={2.3}>Something</MenuItem>
            <MenuItem eventKey={2.4}>Another action</MenuItem>
            <MenuItem eventKey={2.5}>Something</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={2.5}>Separated link</MenuItem>
          </NavDropdown>
          {isAuthenticated && (
            <NavItem eventKey={3} onClick={this.handleLogout}>
              Log out
            </NavItem>
          )}
        </Nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  notificationsData: state.notifications
});

export default connect(mapStateToProps, { logoutUser, notificationsUnView })(
  withRouter(AdminNavbarLinks)
);
