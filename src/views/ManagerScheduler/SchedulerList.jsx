import React, { Component } from "react";
import { getSchedulersByConnector, deleteScheduler } from "../../api/manager";

import { NavLink, Link } from "react-router-dom";
import { Table, Badge, Button } from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import NavClientDetail from "./SchedulerNavigation/NavClientDetail";
import NavConnectorAll from "./SchedulerNavigation/NavConnectorAll";
import Pager from "react-bootstrap/lib/Pager";

class SchedulerList extends Component {
  state = {
    schedulers: [],
    loading: false
  };

  delete = scheduler => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this scheduler.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.setState({ loading: true });
            // deleteScheduler(scheduler).then(res => {
            //   this.setState({ schedulers: res.data, loading: false });
            // });

            deleteScheduler(scheduler).then(_ => {
              getSchedulersByConnector(this.props.match.params.id).then(res => {
                this.setState({
                  schedulers: res.data.results,
                  loading: false
                });
              });
            });
          }
        },
        { label: "No" }
      ]
    });
  };

  componentDidMount() {
    this.setState({ loading: true });

    getSchedulersByConnector(this.props.match.params.id).then(res => {
      this.setState({
        schedulers: res.data.results,
        loading: false
      });
    });
  }

  render() {
    const { schedulers, loading } = this.state;
    const { connector, client, typeNavigation } = this.props.location.state;

    return (
      <>
        <h3 className="title-page">Scheduler List {connector.name}</h3>
        <div className="content">
          {typeNavigation === "client_detail" && (
            <NavClientDetail client={client} connector={connector} />
          )}

          {typeNavigation === "all_connector" && <NavConnectorAll />}

          <NavLink
            to={{
              pathname: "/admin/scheduler/" + connector.id,
              state: {
                connector: connector,
                client: client,
                typeNavigation: typeNavigation
              }
            }}
            className="nav-link"
          >
            <Button className={"btn-fill"} bsStyle="success">
              New Scheduler
            </Button>
          </NavLink>
          <br></br>
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
          <br></br>

          {!loading && (
            <Card
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover>
                  <thead>
                    <tr>
                      <td>Run asap</td>
                      <td>Enabled</td>
                      <td>Status</td>
                      <td>Last runtime</td>
                      <td>Params</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {schedulers.map(scheduler => {
                      return (
                        <tr key={scheduler.id}>
                          <td>
                            {scheduler.run_asap ? (
                              <Badge className="badgeOn">On</Badge>
                            ) : (
                              <Badge className="badgeOff">Off</Badge>
                            )}
                          </td>

                          <td>
                            {scheduler.enabled ? (
                              <Badge className="badgeOn">On</Badge>
                            ) : (
                              <Badge className="badgeOff">Off</Badge>
                            )}
                          </td>

                          <td>{scheduler.status[1]}</td>
                          <td>{scheduler.last_run_time}</td>
                          <td>{scheduler.params}</td>
                          <td>
                            <Link
                              to={{
                                pathname:
                                  "/admin/scheduler/edit/" + scheduler.id,
                                state: {
                                  connector: connector,
                                  scheduler: scheduler,
                                  client: client,
                                  typeNavigation: typeNavigation
                                }
                              }}
                            >
                              <i className="pe-7s-note mr-5 edit-icon action-icon" />
                            </Link>

                            <span onClick={_ => this.delete(scheduler)}>
                              <i className="pe-7s-trash trash-icon action-icon" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                      <Pager>
                            <Pager.Item previous onClick={(event) => this.pagePrev(event)}>
                              &larr; Previous Page
                            </Pager.Item>
                            <Pager.Item next onClick={(event) => this.pageNext(event)}>
                              Next Page &rarr;
                            </Pager.Item>
                          </Pager>
                      </tfoot>
                </Table>
              }
            />
          )}
        </div>
      </>
    );
  }

   pageNext = e => {
        const {next_page} = this.state;
        if(next_page){
            this.loadScheduler(next_page)
        }

    };

    pagePrev = e => {
        const {prev_page} = this.state;
        if(prev_page){
           this.loadScheduler(prev_page)
        }

    };

  loadScheduler =(page=0) =>{
    this.setState({ loading: true });

    getSchedulersByConnector(this.props.match.params.id,page).then(res => {
      this.setState({
        schedulers: res.data.results,
        loading: false
      });
    });

  }
}

export default SchedulerList;
