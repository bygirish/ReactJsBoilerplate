import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
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
      basicNotify:false,
      dashboardDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],
      filterSections:[],

    };

  }

  

  getDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('projects/getProjectDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ dashboardDetails:response.data});
      }
    }).catch(error => {
      alert(error);

    });

  }

  getAssignmentMappedData(id_section,id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_section:id_section,
      id:id
    };
    new Service().apiCall('assignments/getStudentAssignmentMap',postData).then(response => {
      if (response.status==200 && response.data!='') {
        var lAssignments = [];
        var lReadAssignments = [];
        var lUnReadAssignments = [];
        response.data.forEach(element => {
                  var lAssignment = {};
                  var lReadAssignment = {};
                  var lUnReadAssignment = {};
                  lAssignment.id                  = element.id;
                  lAssignment.submitted           = element.submitted;
                  lAssignment.attachment          = element.attachment;
                  lAssignment.feedback            = element.feedback;
                  lAssignment.grade               = element.gd?element.gd:element.grade;
                  lAssignment.grade               = (element.marks!=0)?element.marks:element.gd;
                  lAssignment.view_count          = element.view_count;
                  lAssignment.studentname         = element.studentname;
                  lAssignment.email               = element.email;
                  lAssignment.contact             = element.contact;
                  lAssignment.roll_no             = element.roll_no;
                  lAssignment.id_user             = element.id_user;
                  lAssignment.id_assignment       = element.id_assignment;
                  lAssignment.id_section          = element.id_section;
                  lAssignments.push(lAssignment);
                  if(element.view_count==1){
                    lReadAssignment.id = element.id;
                    lReadAssignment.studentname         = element.studentname;
                    lReadAssignment.view_count         = element.view_count;
                    lReadAssignment.contact             = element.contact;
                    lReadAssignments.push(lReadAssignment);
                  }
                  if(element.view_count==0){
                    lUnReadAssignment.id = element.id;
                    lUnReadAssignment.studentname         = element.studentname;
                    lUnReadAssignment.view_count         = element.view_count;
                    lUnReadAssignment.contact             = element.contact;
                    lUnReadAssignments.push(lUnReadAssignment);
                  }
              });
              this.setState({ filterReadReceipients:lAssignments,receipientSuggestions:lAssignments,assignmentsMapData:lAssignments,readassignmentsMapData:lReadAssignments,unreadassignmentsMapData:lUnReadAssignments,readCount:lReadAssignments.length,unReadCount:lUnReadAssignments.length,allCount:lAssignments.length});
        
      }
    }).catch(error => {
      alert(error);

    });

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


  componentDidMount() {
   // console.log(this.props.data);
    this.getDashboardDetails();
    this.getStandardSectionDetailsDashboard(this.props.data.selectedBoardId,this.props.data.selectedAcademicId);
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Projects"
        titleDescription=""
        {...this.props}
      /> 
      <Grid container spacing={4}>
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['total']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                     Created Tasks
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['today']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                      Expiring Today
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['presentweek']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Expiring in 7 days
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['nextweek']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  After 7 days
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={4}></Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/add-view-project")}>
          {/* Create/View Project */}
          {AuthHelper('Project/Seminar','can_create')? "Create/View Project" : "View Project"}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}></Grid>
      </Grid>

      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
