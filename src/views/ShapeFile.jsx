import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Card } from "../components/Card/Card.jsx";
import Button from "../components/CustomButton/CustomButton.jsx";
import { download_shapefile } from "../api/shapeFile";
import { validate } from "../validations/commons";
import NotificationSystem from "react-notification-system";
import { style } from "../variables/Variables.jsx";
import Select from "react-select";
import BootstrapSwitchButton from "bootstrap-switch-button-react";


class ShapeFile extends Component{
    state = {
        url :{ value: "", isValid: null },
        file_name :{ value: "", isValid: null },
        data_type :{ value: "json", isValid: null },
        is_login : [{value :0,label : 'None' },{value :1,label : 'Standard' },{value :2,label : 'EsriCode' }],
        selectedLogin : {value :0,label : 'None' },
        limit:{value:'1000', isValid:null},
        user_name :{ value: "", isValid: null },
        code_login :{ value: "", isValid: null },
        origin_url :{ value: "", isValid: null },
        min_offset :{ value: "0", isValid: null },
        max_offset :{ value: "", isValid: null },
        sign_in_url :{ value: "", isValid: null },
        is_paginated : true,
        errorForm : "",
        loading:false
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

  handleChangeLogin = selectedLog => {

       this.setState({ selectedLogin: selectedLog });
    //    const {
    //   selectedLogin,
    //
    // } = this.state;
    //    console.log(selectedLogin);

  };

    addNotification = _ => {
    const { file_name } = this.state;
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: (
        <div>
          File <b>{file_name.value}</b> successfully downloading.
        </div>
      ),
      level: "info"
    });
  };


    onSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    const {
      url,
      file_name,
      data_type,
      selectedLogin,
      limit,
      user_name,
      code_login,
      origin_url,
      min_offset,
      max_offset,
      sign_in_url,
        is_paginated,
    } = this.state;
    let formValid = true;

    if (url.value === ""||!url.value.match('^http(s)?:')) {
      this.setState({ errorForm: "URL is required" });
      formValid = false;
    } else if (data_type.value==="") {
        this.setState({errorForm: "data type is required"});
        formValid = false;
    }
    else if (file_name.value==="") {
        this.setState({errorForm: "File Name is required"});
        formValid = false;
    }
    else if (limit.value ==="" || !limit.value.match('^[1-9][0-9]*$')) {
        this.setState({errorForm: "Numeric Batch Size is required"});
        formValid = false;
    }
    else if (min_offset.value ==="" || (min_offset.value!=="0" &&!min_offset.value.match('^[1-9][0-9]*$'))) {
        this.setState({errorForm: "Numeric Min Offset Value is required"});
        formValid = false;
    }
    else if (max_offset.value !=="" && !max_offset.value.match('^[1-9][0-9]*$')) {
        this.setState({errorForm: "Numeric Max Offset Value , or null, is required"});
        formValid = false;
    }
    else if (selectedLogin.value !== 0 && code_login.value ==="") {
        this.setState({errorForm: "Login Pass is required"});
        formValid = false;
    }else if (selectedLogin.value !== 0 && user_name.value ==="") {
        this.setState({errorForm: "User Name is required"});
        formValid = false;
    }else if (selectedLogin.value !== 0 && (origin_url.value ==="" ||!origin_url.value.match('^http(s)?:'))) {
        this.setState({errorForm: "Login URL is required"});
        formValid = false;
    }
    else if (selectedLogin.value === 2 && (sign_in_url.value ==="" ||!sign_in_url.value.match('^http(s)?:'))) {
        this.setState({errorForm: "Sing in  URL is required"});
        formValid = false;
    }
    else if(!is_paginated && parseInt(limit.value) > 100){
        this.setState({errorForm: "When not paginating limits above 100 can cause request errors"});
        formValid = false;
    }
    if(formValid) {
        this.setState({ errorForm: "" });
        download_shapefile(this.state).then(res => {
            this.addNotification();
            this.setState({
                url: {value: "", isValid: null},
                file_name: {value: "", isValid: null},
                data_type: {value: "json", isValid: null},
                selectedLogin : {value :0,label : 'None' },
                limit :{value:"1000",isValid:null},
                user_name: {value: "", isValid: null},
                code_login: {value: "", isValid: null},
                origin_url: {value: "", isValid: null},
                min_offset: {value: "0", isValid: null},
                max_offset: {value: "", isValid: null},
                sign_in_url: {value: "", isValid: null},
                errorForm:"",
                is_paginated:true,
                loading:false
            });

        });

    }
    this.setState({ loading: false });
  };

    notificationSystem = React.createRef();

    render() {

    const { url , file_name, data_type, is_login,selectedLogin,
        limit, is_paginated,user_name,code_login,origin_url,
        min_offset,max_offset ,sign_in_url, errorForm,loading} = this.state;

    return (
      <>
        <h3 className="title-page">Download Shapefile</h3>
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
                />
              )}

              <Col md={12}>
                {!loading && (
                  <Card
                    title="Specify format and layer"
                    content={
                      <>
                          <Col md={12}>
                            <div className="errorForm">{errorForm}</div>
                          </Col>
                          <form onSubmit={this.onSubmit}>
                              <Col md={6}>
                                <FormGroup validationState={url.isValid}>
                                  <ControlLabel>Layer url</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="url"
                                    value={url.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                                <FormGroup validationState={file_name.isValid}>
                                  <ControlLabel>Name of the File</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="file_name"
                                    value={file_name.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                                <FormGroup validationState={data_type.isValid}>
                                  <ControlLabel>Data Type</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="data_type"
                                    value={data_type.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                                <FormGroup validationState={limit.isValid}>
                                  <ControlLabel>Batch Size</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="limit"
                                    value={limit.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                                <FormGroup>
                                  <ControlLabel>Login Type</ControlLabel>
                                  <Select
                                    options={is_login}
                                    onChange={this.handleChangeLogin}
                                    value={selectedLogin}
                                  />
                                </FormGroup>

                                <FormGroup>
                                  <ControlLabel>Has Pagination</ControlLabel>
                                  <br />
                                  <BootstrapSwitchButton
                                    checked={is_paginated}
                                    onChange={checked => {
                                        this.setState({is_paginated: checked});
                                        if(checked){
                                            this.setState({limit:{value:'1000', isValid:null}})
                                        }
                                        else{
                                            this.setState({limit:{value:'100', isValid:null}})
                                        }
                                    }

                                    }
                                    onstyle="danger"
                                  />
                                </FormGroup>


                              </Col>

                              <Col md={6}>
                                {(selectedLogin.value === 1 ||selectedLogin.value === 2) &&(<FormGroup validationState={user_name.isValid}>
                                  <ControlLabel>Provide Username</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="user_name"
                                    value={user_name.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>) }

                                {(selectedLogin.value === 1 ||selectedLogin.value === 2) &&(<FormGroup validationState={code_login.isValid}>
                                  <ControlLabel>Provide Login Code</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="code_login"
                                    value={code_login.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>) }

                                {(selectedLogin.value === 1 ||selectedLogin.value === 2) &&(<FormGroup validationState={origin_url.isValid}>
                                  <ControlLabel>Provide Login URL</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="origin_url"
                                    value={origin_url.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>) }

                                {selectedLogin.value === 2 && (<FormGroup validationState={sign_in_url.isValid}>
                                  <ControlLabel>Provide Sign In URL</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="sign_in_url"
                                    value={sign_in_url.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>)}

                                <FormGroup validationState={min_offset.isValid}>
                                  <ControlLabel>Provide Min Offset (Calculated according to batch size)</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="min_offset"
                                    value={min_offset.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                                <FormGroup validationState={max_offset.isValid}>
                                  <ControlLabel>Provide Max Offset (Calculated according to batch size)</ControlLabel>
                                  <FormControl
                                    type="text"
                                    name="max_offset"
                                    value={max_offset.value}
                                    onChange={this.handleChange}
                                  />
                                </FormGroup>

                              </Col>
                            <Button
                              bsStyle="success"
                              pullRight
                              fill
                              type="submit"
                            >
                              Download
                            </Button>
                            <div className="clearfix" />
                          </form>
                      </>
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

export default ShapeFile;