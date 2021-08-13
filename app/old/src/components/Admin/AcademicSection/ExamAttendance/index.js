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
import { AuthHelper } from '@utils/AuthHelper.js';
import EditIcon from '@material-ui/icons/Edit';
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
      dashboardDetails:[],
      TotalStudentCount:0,
      album_count:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],

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

  getExamDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,  
    type:"offline",
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsAttendance/getExamDashboard',postData).then(response => {
      if (response.status==200 && response.data!='') {
           this.setState({examList:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  componentDidMount() {
    this.getExamDetails();
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
       <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Exam Attendance"
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
                  {this.state.examList.exam_count}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Exams
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.examList.student_absent}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Absenties
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

      {AuthHelper('Exam Attendance','can_create') &&   <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={4}></Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/mark-exam-attendance")}>
          Mark/View Attendance
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}></Grid>
      </Grid>}

   </Animated>

   

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
