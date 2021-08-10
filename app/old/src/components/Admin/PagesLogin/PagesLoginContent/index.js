import React, { Fragment } from 'react';
import {
  Grid,
  Container,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  Box,
  Card,
  CardContent,
  Button,
  FormControl
} from '@material-ui/core';

import { Link,withRouter } from 'react-router-dom';
import { setToken } from '../../../../utils/Common';
import MuiAlert from '@material-ui/lab/Alert';

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

import svgImage9 from '../../../../assets/images/illustrations/login.svg';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import i18n from '../../../../i18n';
import Config from '../../../../config';
import { th } from 'date-fns/esm/locale';

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email:'',
      password:'',
      org_logo:'',
      org_name:'',
      emailerror:false,
      passworderror:false,
      loginerror:false
    }
  }

  getOrganizationData() {
    const postData = {
    }
    new Service().apiCall('AcademicSettings/getOrgInfo', postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
            this.setState({org_name:response.data.org_name,org_logo:Config.path+"writable/uploads/organization_logo/"+response.data.org_logo});
      }
    }).catch(error => {
      console.log(error)

    });
  }

  handleLogin = () => {
    if(this.state.email == ""){
      this.setState({emailerror:true});
    }
    else  if(this.state.password == ""){
      this.setState({passworderror:true});
    }
    else{

    const postData = {
      email: this.state.email, 
      password:this.state.password,
      requestname: "get_password",
      loginflag:'3'
    };

    new Service().apiCall('users/get_password',postData).then(response => {
      
       
      if (response.status==200 && response.data!='') {
        let lData = {}
        
        lData.token = response.data.token;
        lData.data = response.data;
        lData.data.selectedOrgIndex = 0;
        lData.data.selectedInstIndex = 0;
       
        lData.data.selectedOrganizationId = response.data.organization[0].id?response.data.organization[0].id:1;
        
        lData.data.selectedInstitutionId =  response.data.organization[0].institutes[0].id?response.data.organization[0].institutes[0].id:1;
        lData.data.selectedBoardIndex = 0;
        lData.data.selectedAcademicIndex = 0;
        console.log(JSON.stringify(response.data.organization[0]));
        lData.data.selectedBoardId = response.data.organization[0].institutes[0].boards[0].id_board?response.data.organization[0].institutes[0].boards[0].id_board:1;
        console.log('test');
        lData.data.module_permissions =  response.data.module_permissions[0].permissions;
        lData.data.selectedAcademicId =  response.data.academicyear[0].id;
        
        setToken(response.data.token);
        this.props.setUserData(lData);
        this.props.history.push("/admin/dashboard");
        //response.data.organization[0].institutes[0].boards[0].id_board?response.data.organization[0].institutes[0].boards[0].id_board:
      }
      else{
       
      }
    }).catch(error => {
      console.log(error.message);
      this.setState({loginerror:true});
    });
    }
  }
  componentDidMount = () =>{
    this.getOrganizationData();
    if(this.props.token && this.props.token != ""){
      this.props.history.push('/admin/dashboard');
    }
  }
  render(){
  return (
    <Fragment>
      <div className="app-wrapper min-vh-100">
        <div className="app-main flex-column">
        <div
        className='app-header-logo w-100'>
        <Box
          className="header-logo-wrapper"
          title={this.state.org_name}>
          <Link to="/" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium"
              className="header-logo-wrapper-btn">
              <img
                className="app-header-logo-img"
                alt={this.state.org_name}
                src={this.state.org_logo}
              />
            </IconButton>
          </Link>
          <Box className="header-logo-text" style={{fontSize:'1.2rem'}}>{this.state.org_name}</Box>
        </Box>
      </div>
          <div className="app-content p-0">
            <div className="app-content--inner d-flex align-items-center">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Container maxWidth="lg">
                    <Grid container spacing={5} justify="center">
                      {/* <Grid
                        item
                        xs={12}
                        lg={5}
                        className="d-xl-flex align-items-center">
                        <img
                          alt="..."
                          className="w-100 mx-auto d-block img-fluid"
                          src={svgImage9}
                        />
                      </Grid> */}
                    
                      <Grid
                        item
                        xs={12}
                        lg={5}
                        className="d-flex flex-column align-items-center">
                        <span className="w-100 text-left text-md-center pb-4">
                          <h4 className="text-xl-left text-center mb-3 font-weight-bold">
                          {t.login_heading}
                          </h4>
                        </span>
                        <Card className="m-0 w-100 p-0 border-0">
                          <CardContent className="p-3">
                            <div className="text-center text-black-50 mb-3">
                              <span>{t.enter_credential}</span>
                            </div>
                            <form className="px-5">
                              <div className="mb-3">
                                <FormControl className="w-100">
                                  <InputLabel htmlFor="input-with-icon-adornment">
                                  {t.login_email}
                                  </InputLabel>
                                  <Input
                                    inputProps={{
                                      autoComplete: "off",
                                      pattern: "[a-z]"
                                    }}
                                    value={this.state.input}
                                    onChange={(event)=>this.setState({emailerror:false,email:event.target.value})}
                                    fullWidth
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <MailOutlineTwoToneIcon />
                                      </InputAdornment>
                                    }
                                  />
                                </FormControl>
                              </div>
                              <div className="mb-3">
                                <FormControl className="w-100">
                                  <InputLabel htmlFor="standard-adornment-password">
                                  {t.login_password}
                                  </InputLabel>
                                  <Input
                                    inputProps={{
                                      autoComplete: "off",
                                      pattern: "[a-z]"
                                    }}
                                    value={this.state.password}
                                    onChange={(event)=>this.setState({passworderror:false,password:event.target.value})}
                                    id="standard-adornment-password"
                                    fullWidth
                                    type="password"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <LockTwoToneIcon />
                                      </InputAdornment>
                                    }
                                  />
                                </FormControl>
                              </div>
                            {this.state.emailerror && <MuiAlert className="mb-4" severity="error">
                              <div className="d-flex align-items-center align-content-center">
                              <span>
                              <strong className="d-block">{t.username_empty}</strong> 
                              </span>
                              </div>
                              </MuiAlert>}
                              {this.state.passworderror && <MuiAlert className="mb-4" severity="error">
                              <div className="d-flex align-items-center align-content-center">
                              <span>
                              <strong className="d-block">{t.password_empty}</strong> 
                              </span>
                              </div>
                              </MuiAlert>}
                              {this.state.loginerror && <MuiAlert className="mb-4" severity="error">
                              <div className="d-flex align-items-center align-content-center">
                              <span>
                              <strong className="d-block">{t.login_error}</strong> 
                              </span>
                              </div>
                              </MuiAlert>}
                              <div className="text-center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={()=>this.handleLogin()}
                                  size="large"
                                  className="my-2">
                                  {t.login_text}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
};
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(LoginPage));
