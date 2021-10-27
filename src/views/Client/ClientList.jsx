import React, {Component} from "react";
import {Button, Col, Grid, Row, Table} from "react-bootstrap";

import Card from "../../components/Card/Card.jsx";
import {Link, NavLink} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {confirmAlert} from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {clients, deleteClient} from "../../api/clients";
import Pager from "react-bootstrap/lib/Pager";

class ClientList extends Component {
    state = {
        clientList: [],
        next_page : '',
        prev_page : '',
        total:0,
        loading: true
    };

    componentDidMount() {
        clients().then(data => {
             console.log(data);
            this.setState({clientList: data.results, loading: false,
            total:data.count, next_page:data.next, prev_page:data.previous});
        });
    }

    delete = client => {
        const {name} = client;

        confirmAlert({
            title: "Confirm to delete",
            message: `Are you sure to delete client ${name}`,
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        this.setState({loading: true});

                        deleteClient(client).then(res => {
                            this.setState({clientList: res.data, loading: false});
                        });
                    }
                },
                {label: "No"}
            ]
        });
    };

    render() {
        const {clientList, loading} = this.state;

        const clientMarkup = clientList.map(client => {
            return (
                <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.association.length}</td>
                    <td>{client.data_count.permits}</td>
                    <td className="table-action-client">
                        <Link
                            title="Detail client"
                            key={client.id}
                            to={{
                                pathname: "/admin/clientconnectors/" + client.id,
                                state: {
                                    client: client
                                }
                            }}
                        >
                            <i className="mr-5 pe-7s-search action-icon"/>
                        </Link>

                        <Link to={"client/" + client.id} title="Edit client">
                            <i className="pe-7s-note mr-5 edit-icon action-icon"/>
                        </Link>

                        <span onClick={_ => this.delete(client)} title="Delete client">
              <i className="pe-7s-trash trash-icon action-icon"/>
            </span>
                    </td>
                </tr>
            );
        });

        return (
            <>
                <h3 className="title-page">Client List</h3>
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <NavLink to="/admin/clients/new" className="nav-link">
                                    <Button className={"btn-fill"} bsStyle="success">
                                        New Client
                                    </Button>
                                </NavLink>
                                {loading && (
                                    <Loader
                                        type="Circles"
                                        color="rgb(161, 232, 44)"
                                        height={100}
                                        width={100}
                                        className="loader"
                                    />
                                )}
                                {clientList.length > 0 && !loading && (
                                    <Card
                                        ctTableFullWidth
                                        ctTableResponsive
                                        content={
                                            <Table striped hover>
                                                <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Connectors count</td>
                                                    <td>Permits</td>
                                                    <td>Action</td>
                                                </tr>
                                                </thead>
                                                <tbody>{clientMarkup}</tbody>
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
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </>
        );
    }

    pageNext = e => {
        const {next_page} = this.state;
        if(next_page){
            clients(next_page).then(data => {
             console.log(data);
            this.setState({clientList: data.results, loading: false,
            total:data.count, next_page:data.next, prev_page:data.previous});
        });
        }

    };

    pagePrev = e => {
        const {prev_page} = this.state;
        if(prev_page){
            clients(prev_page).then(data => {
             console.log(data);
            this.setState({clientList: data.results, loading: false,
            total:data.count, next_page:data.next, prev_page:data.previous});
        });
        }

    };
}

export default ClientList;
