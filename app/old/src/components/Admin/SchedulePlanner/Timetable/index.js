import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections:[],
      dialogOpen:false,
      no_of_days:0,
      teaching_periods:0,
      break_periods:0,
      total_periods:0,
      basicNotify:false,
      dashboardDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],
      filterSections:[],

    };

  }

  showError = (error) => {
    this.setState({
      basicNotify: (
        <Dialog open={true}>
      <div className="text-center p-5">
        <h4 className="font-weight-bold">{error}</h4>
      </div>
    </Dialog>
      ),
    });
       setTimeout(() => {
         this.setState({ basicNotify:false});
        // window.location.reload()
       }, 2000)
    }

  getPeriodSettings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.state.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassTimetable/getSettingsData',postData).then(response => {
      if (response.status==200 && response.data!='') {
          this.setState({ no_of_days:response.data[0].no_of_days,teaching_periods:response.data[0].teaching_periods,break_periods:response.data[0].break_periods,total_periods:response.data[0].total_periods})
      }
    }).catch(error => {
      this.showError(error.response.data)
  
    });
  
  }

  componentDidMount() {
    this.getPeriodSettings();
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Timetable"
        titleDescription=""
        {...this.props}
      /> 
      <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.no_of_days}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Total Days
                  </div>
                </div>
              </div>
            </Grid>
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_periods}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                     Total Periods
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.teaching_periods}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Teaching Periods
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.break_periods}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Break Periods
                  </div>
                </div>
              </div>
            </Grid>
          
      </Grid>

      <Grid container spacing={2} justify="center">
        
      {AuthHelper('Timetable','can_create') && <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/timetable-settings")}>
            Timetable Settings
          </Button>
        </Grid>}
        {(this.props.data.usertype == "admin" || this.props.data.usertype == "student") && <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/student-timetable")}>
          {this.props.data.usertype == "admin" ? "Create Timetable" : "View Timetable"}
          </Button>
        </Grid>}
        {this.props.data.usertype != "student" && <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff-timetable")}>
          {this.props.data.usertype == "admin" ? "Staff Timetable" : "View Timetable"}
          </Button>
        </Grid>}
        {/* {AuthHelper('Timetable','can_create') && <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff_substitute")}>
          Staff Substitute
          </Button>
        </Grid>} */}

      </Grid>

      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
