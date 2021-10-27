import React, {Component} from "react";
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Row, Table,Pagination} from "react-bootstrap";

import Card from "../../components/Card/Card.jsx";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {confirmAlert} from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {clientsAssessor, deleteClient} from "../../api/clientsAssessor";
import {Link, NavLink} from "react-router-dom";
import {validate} from "../../validations/commons";
import Select from "react-select";

class ClientAssessorList extends Component {
    state = {
        clientList: [],
        nameFilter : { value: "", isValid: null },
        scrapeStatus : [{value :0,label : 'All' },{value :1,label : 'Scraping' },{value :2,label : 'Not Scraping' }],
        selectedScrapeStatus : {value :0,label : 'All' },
        activePage : "1",
        itemsPerPAge:25,
        loading: true
    };

    componentDidMount() {
        clientsAssessor()
            .then(response => {
                console.log(response)
            this.setState({clientList: response, loading: false});
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

    paginationClicked = e =>{

        if(e.target.text){
            this.setState({activePage:e.target.text})
        }
    };


    handleChangeScrapeStatus = selectedStatus => {
           this.setState({ selectedScrapeStatus: selectedStatus });
      };

    render() {
        const {clientList, loading,nameFilter, scrapeStatus, selectedScrapeStatus, activePage,itemsPerPAge} = this.state;

        const clientFilter = clientList.filter( client =>{
            if (nameFilter.value && !client.full_name.includes(nameFilter.value)) {
                return false;
            }
            if((selectedScrapeStatus.value===1&&!client.scraping)||
                (selectedScrapeStatus.value===2&&client.scraping) ){
                return false;
            }
            return true;
        });

        const clientMarkup = clientFilter.filter((client,idx) => {
            if((activePage-1)*itemsPerPAge>idx || idx >= activePage*itemsPerPAge){
                return false;
            }
            return true;
        }).map(client => {
            // console.log(client);
            return (
                <tr key={client.url}>
                    <td>{client.name}</td>
                    <td>{client.country}</td>
                    <td>{client.state}</td>
                    <td>{client.county}</td>
                    <td>{client.assessor_config}</td>
                    <td>{client.scraping &&(<i style={{'text-align':'center','display':'block'}} className="glyphicon glyphicon-check icon-client"/> )}</td>
                    <td className="table-action-client">
                        <Link
                            title="Detail client"
                            key={client.id}
                            to={{
                                pathname: "/admin/assessor_clients/" + client.url.match('/([0-9]+)/$')[1],
                                state: {
                                    client: client
                                }
                            }}
                        >
                            <i className="mr-5 pe-7s-search action-icon"/>
                        </Link>


                        <span onClick={_ => this.delete(client)} title="Delete client">
              <i className="pe-7s-trash trash-icon action-icon"/>
            </span>
                    </td>
                </tr>
            );
        });

        let clientTotal=clientFilter.length;
        let items = [];

        for (let number = 1; number <= clientTotal/itemsPerPAge+(clientTotal%itemsPerPAge>0?1:0); number++) {

          items.push(
            <Pagination.Item key={number} active={String(number)=== activePage } onClick={(event) => this.paginationClicked(event)}>
              {number}
            </Pagination.Item>,
          );
        }

        return (
            <>
                <h3 className="title-page">Client List</h3>
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col md={12}>

                                <Col md={4}>

                                    <FormGroup
                                      controlId="formValidationSuccess1"
                                      validationState={nameFilter.isValid}
                                    >
                                    <ControlLabel>Filter by Name</ControlLabel>
                                      <FormControl
                                        type="text"
                                        name="nameFilter"
                                        value={nameFilter.value}
                                        onChange={this.handleChange}
                                      />
                                    </FormGroup>
                                    <NavLink to="/admin/assessor_clients/new" className="nav-link">
                                        <Button className={"btn-fill"} bsStyle="success">
                                            New Client
                                        </Button>
                                    </NavLink>
                                </Col>
                                <Col  md={4}>
                                    <FormGroup
                                      controlId="formValidationSuccess1"
                                      validationState={nameFilter.isValid}
                                    >
                                    <ControlLabel>Scraping Now</ControlLabel>
                                      <Select
                                        options={scrapeStatus}
                                        onChange={this.handleChangeScrapeStatus}
                                        value={selectedScrapeStatus}
                                      />
                                    </FormGroup>

                                </Col>
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
                                                    <td>Country</td>
                                                    <td>State</td>
                                                    <td>County</td>
                                                    <td>Assessor Config</td>
                                                    <td>Now Scraping</td>
                                                    <td>Action
                                                    </td>
                                                </tr>
                                                </thead>
                                                <tbody>{clientMarkup}</tbody>
                                                <tfoot>{
                                                        <Pagination>{items}</Pagination>
                                                }</tfoot>
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

export default ClientAssessorList