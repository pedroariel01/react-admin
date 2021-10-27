import React, { Component } from "react";
import { NavLink } from "react-router-dom";


import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";
import { connect } from "react-redux";
import {ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
// import logo from "assets/img/logo.ico";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };

    const {
      auth: { isAuthenticated }
    } = this.props;

    if (isAuthenticated === false) {
      window.location.href = "/admin/login";
    }
  }

  handleCLickSideBarOption = () => {
    const {
      auth: { isAuthenticated }
    } = this.props;

    if (isAuthenticated === false) {
      window.location.href = "/admin/login";
    }
  };

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  lookForSubMenus(parentName)  {
      const children= this.props.routes.filter(route =>
      {
          if(route.parent && route.parent===parentName){
              return true;
          }
          return false;
      })
      return(
          children.map(sub =>{
              return (
                    <MenuItem>
                        {sub.name}
                        <NavLink
                            onClick={this.handleCLickSideBarOption}
                            to={sub.layout + sub.path}
                            className="nav-link"
                            activeClassName="active"
                        >
                        </NavLink>
                    </MenuItem>
                );
          })
      )

  }



  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + this.props.image + ")"
    };
    return (
        <div
            id="sidebar"
        className="sidebar">
      <ProSidebar
          image = {this.props.image}
          >
          <SidebarHeader>
            <div
              style={{
                padding: '24px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: 14,
                letterSpacing: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              First Due
            </div>
          </SidebarHeader>
          <SidebarContent>
              <Menu iconShape="circle">
                  {this.props.routes.map((prop,key)=>{
                      if(!prop.redirect && prop.sidebar){
                          if(!prop.path){
                              return(
                                  <SubMenu title={prop.name} icon={prop.icon}>
                                      {this.lookForSubMenus(prop.name)}
                                  </SubMenu>
                              );
                          }
                          else if(!prop.parent){
                              return (
                                  <MenuItem  icon={prop.icon}>
                                      {prop.name}
                                      {prop.path ?
                                          <NavLink
                                              onClick={this.handleCLickSideBarOption}
                                              to={prop.layout + prop.path}
                                              className="nav-link"
                                              activeClassName="active"
                                          >
                                          </NavLink>
                                          : ''
                                      }
                                  </MenuItem>
                              );

                          }
                      }
                      return null;

                  })}
                </Menu>
          </SidebarContent>
      </ProSidebar>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(Sidebar);
