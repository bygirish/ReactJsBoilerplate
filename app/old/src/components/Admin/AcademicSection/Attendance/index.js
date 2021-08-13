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
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import { AuthHelper } from '@utils/AuthHelper.js';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections:[],
      dialogOpen:true,
      basicNotify:false,
      examList:[],
      albumData:[],
      StudentTotal:0,
      StaffTotal:0,
      StudentAbsent:0,
      StaffAbsent:0,
      dashboardDetails:[],
      TotalStudentCount:0,
      album_count:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],

    };

  }

  getStandardSectionDetailsDashboard(id_board,id_academicyear) {
    const postData = {
    count:"student",
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        var lStandardSections = [];
        response.data.forEach(element => {
                if(lStandardSections[element.board_id]){
                  var lStandard = {};
                  lStandard.standard_name = element.standard_name;
                  lStandard.standard_id = element.standard_id;
                }else{
                  var lBoard = {};
                  var lStandard = {};
                  lBoard.board_name = element.board_name;
                  lStandard.standard_name = element.standard_name;
                  lStandard.standard_id = element.standard_id;
                  lStandardSections[element.board_id] = lBoard;
                }
                if(lStandardSections[element.board_id][element.standard_id]){
                  var lSection = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_student_count = element.all_student_count;
                  lSection.active_student_count = element.active_student_count;
                  lStandardSections[element.board_id][element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_student_count = element.all_student_count;
                  lSection.active_student_count = element.active_student_count;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);
                  lStandardSections[element.board_id][element.standard_id] = lStandard;
              } 
        });
        this.setState({ classwiseSectionsDashboard:lStandardSections,loading:false});
      }
    }).catch(error => {
      alert(error);

    });

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

  getDashboardDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Attendance/getDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ StudentTotal: response.data.StudentTotal, StudentAbsent: response.data.StudentAbsent,StaffTotal: response.data.StaffTotal, StaffAbsent: response.data.StaffAbsent }); 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  componentDidMount() {
    this.getDashboardDetails();
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
       <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Attendance"
        titleDescription=""
        {...this.props}
      /> 
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
  
     

     
      <Grid container spacing={4} justify="center">
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.StudentTotal}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Student Count
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.StudentAbsent}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Student Absent
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.StaffTotal}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Staff Count
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.StaffAbsent}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Staff Absent
                  </div>
                </div>
              </div>
            </Grid>

      </Grid>

      <Grid container spacing={2} justify="center">
      {AuthHelper('Attendance','can_create') &&   <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/mark-attendance")}>
          Mark/View Attendance
          </Button>
        </Grid>}
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/attendance-history")}>
          View History
          </Button>
        </Grid>
        {AuthHelper('Attendance','can_create') &&  <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/attendance-settings")}>
          Settings
          </Button>
        </Grid>}
      </Grid>
   
   </Animated>

   

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
