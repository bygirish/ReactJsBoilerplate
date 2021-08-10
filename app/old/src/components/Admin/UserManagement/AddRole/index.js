import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";

import {
  Grid,
  IconButton,
  Card,
  Fab,
  Button,
  List,
  ListItem,
  Tooltip
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';

import EditIcon from '@material-ui/icons/Edit';

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      total_roles:0,
      total_modules:0,
      total_employees:0,
      total_mapped:0,
      showNextBtn:false,
      role_name:'',
      expanded: '',
      viewUpdatePermissionCount:0,
      showPermissions:false,
      roles:[],
      viewPermissionCount:0,
      create_role_permissions:[],
      view_role_permissions:[],
      role_permission:[],
    };

  }

  getDashboardInfo = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Roles/getUserManagementDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ total_roles: response.data.roles, total_modules: response.data.modules, total_employees: response.data.employees, total_mapped: response.data.mapped }); 
      }
    }).catch(error => {
      alert(error);
    });
  }

  getRolesList = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Roles/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ roles: response.data }); 
      }
    }).catch(error => {
      alert(error);
    });
  }

  componentDidMount() {
    this.getDashboardInfo();
    this.getRolesList();
    // this.getAllPermissions();
  }

  render() {
  return (
    <Fragment>
      <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_roles}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Total Roles1
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_modules}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Total Modules
                  </div>
                </div>
      
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_employees}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Total Employees
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                 <div className="w-100 text-center">
                  <div className="display-3 font-weight-400">
                  {this.state.total_mapped}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Pending Mapping
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

      <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary">
          Create Role
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={5} justify="center">
      <Grid item xs={12} sm={12} lg={8}>
      {this.state.roles.length > 0 && this.state.roles.map(roledata =>   
      <Card className="card-box mb-4">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} lg={4}>
            <div className="divider-v divider-v-lg" />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-center py-2">
                  <div className="mt-3 mb-2 line-height-sm">
                  <b className="font-size-lg">{roledata.name}</b>
                    <span className="text-black-50 d-block">role</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <div className="divider-v divider-v-lg" />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-center py-2">
                  <div className="mt-3 mb-2 line-height-sm">
                    <b className="font-size-lg">{roledata.mappedcount}</b>
                    <span className="text-black-50 d-block">modules mapped</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-right py-2">
                  <div className="mt-2 mb-2 mr-4 line-height-sm">
                  <Fab size="medium" color="secondary" aria-label="edit">
                    <EditIcon />
                  </Fab>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
        )} 
        </Grid>
      </Grid>
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(UserManagement));
