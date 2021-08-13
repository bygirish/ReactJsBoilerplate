import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Grid,
  IconButton,
  Card,
  Button,
  List,
  ListItem,
  Tooltip
} from '@material-ui/core';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';
import Service from '@utils/Service';
import Config from '../../../../config';

class Section2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardData:'',
      total_students:0,
      total_staff:0,
    }
  }

  getDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    // new Service().apiCall('dashboards/get_dashboard_data',postData).then(response => {
      new Service().apiCall('Attendance/getDashboardDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({total_students:response.data.StudentTotal, total_staff:response.data.StaffTotal,StaffAbsent:response.data.StaffAbsent, StudentAbsent:response.data.StudentAbsent});    
      }
      
    }).catch(error => {
      console.log(error)
    });

  }
  componentDidMount() {
    this.getDashboardDetails();
  }
  render(){  
  return (
    <Fragment>
      <Grid container spacing={4}>
  
            <Grid item xs={12} md={3}>
              <a
                href="/admin/view-student"
                // onClick={e => e.preventDefault()}
                onClick={()=>this.props.history.push("/admin/view-student")}
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div>
                  <div className="display-3 text-first font-weight-bold">
                    {this.state.total_students}
                  </div>
                  <div className="divider mt-2 mb-3 border-2 w-25 bg-first rounded border-warning" />
                  <div className="font-weight-bold font-size-sm text-uppercase">
                    Total Students
                  </div>
                </div>
             
              </a>
            </Grid>
            <Grid item xs={12} md={3}>
              <a
                href="/admin/view-staff"
                // onClick={e => e.preventDefault()}
                onClick={()=>this.props.history.push("/admin/view-staff")}
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div>
                  <div className="display-3 font-weight-bold text-danger">
                  {this.state.total_staff}
                  </div>
                  <div className="divider mt-2 mb-3 border-2 w-25 bg-danger rounded border-danger" />
                  <div className="font-weight-bold font-size-sm text-uppercase">
                  Total Staff
                  </div>
                </div>
               
              </a>
            </Grid>
            <Grid item xs={12} md={3}>
              <a
                href="/admin/attendance-history"
                // onClick={e => e.preventDefault()}
                onClick={()=>this.props.history.push("/admin/attendance-history")}
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div>
                  <div className="display-3 text-success font-weight-bold">
                  {this.state.StudentAbsent}
                  </div>
                  <div className="divider mt-2 mb-3 border-2 w-25 bg-success rounded border-success" />
                  <div className="font-weight-bold font-size-sm text-uppercase">
                   Absent Students
                  </div>
                </div>
               
              </a>
            </Grid>
            <Grid item xs={12} md={3}>
              <a
                href="/admin/attendance-history"
                // onClick={e => e.preventDefault()}
                onClick={()=>this.props.history.push("/admin/attendance-history")}
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div>
                  <div className="display-3 text-warning font-weight-bold">
                  {this.state.StaffAbsent}
                  </div>
                  <div className="divider mt-2 mb-3 border-2 w-25 bg-success rounded border-warning" />
                  <div className="font-weight-bold font-size-sm text-uppercase">
                    Absent Staff
                  </div>
                </div>

              </a>
            </Grid>
      </Grid>
    </Fragment>
  );
  }
}

export default connect(mapStateToProps, mapDispatchToPros)(Section2);