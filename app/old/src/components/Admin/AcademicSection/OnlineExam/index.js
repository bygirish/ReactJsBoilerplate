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
      expired_exams:0,
      total_exams:0,
      nextExam:{days:0,hours:0,minutes:0},
      future_exams:0,
      dashboardDetails:[],
      onlineExams:[],
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
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID
    };
    new Service().apiCall('ExamDetails/getExamDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
           this.setState({examList:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  getDashboardInfo () {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
    };
    new Service().apiCall('ExamsOnline/getOnlineExamDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
          this.setState({total_exams: response.data.total_exams?response.data.total_exams:0,expired_exams: response.data.expired_exams,future_exams: response.data.future_exams, loading:false, nextExam: response.data.next ? response.data.next : this.state.nextExam})
      } 
      else{
        this.setState({loading:false})
      }
    }).catch(error => {
      console.log(error);

    });

  }

  getOnlineExams () {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
    };
    new Service().apiCall('ExamsOnline/getOnlineUpcomingExam',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
          this.setState({onlineExams: response.data})
      } 
      else{
        this.setState({loading:false})
      }
    }).catch(error => {
      console.log(error);

    });
  }

  componentDidMount() {
    this.getDashboardInfo();
    this.getOnlineExams();
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
       <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Online Exam"
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
                  {this.state.total_exams}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Total Exams
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.future_exams}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Future dated exams
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.expired_exams}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Expired exams
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  0
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Assigned students
                  </div>
                </div>
              </div>
            </Grid>
           </Grid>
      

     <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={3}>
        <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-exams")}>
          View Exams
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-results")}>
          View Results
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4} justify="center">
         <Grid item xs={12} sm={6} lg={8}>
      {this.state.onlineExams.map(element=> (

        <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
                <div className="py-3 px-3 d-flex align-items-center text-center">
            <div>
              <span className="font-weight-bold font-size-md">
                {element.exam_name}
              </span>
              <span className="d-block opacity-7">exam name</span>
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center  text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {moment(element.start_date+ " "+ element.start_time).format("hh:mm A")}
              </span>
              <span className="d-block opacity-7">start time</span>
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center  text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {element.appeared}
              </span>
              <span className="d-block opacity-7">appeared</span>
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {element.students_online}
              </span>
              <span className="d-block opacity-7">students online</span>
            </div>
          </div>
    
        </Card>
      ))}
      </Grid>
      </Grid>

      <Grid container spacing={4} justify="center">
         <Grid item xs={12} sm={6} lg={6}>
     
        <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
                <div className="py-3 px-3 d-flex align-items-center text-center">
            <div>
              <span className="font-weight-bold font-size-lg">
              Next exam starts in
              </span>
            
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center  text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {this.state.nextExam.days  ? this.state.nextExam.days : 0}
              </span>
              <span className="d-block opacity-7">days</span>
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center  text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {this.state.nextExam.hours ? this.state.nextExam.hours : 0}
              </span>
              <span className="d-block opacity-7">hours</span>
            </div>
          </div>
          <div className="py-3 px-4 d-flex align-items-center text-center">
            <div>
              <span className="font-weight-bold font-size-md">
              {this.state.nextExam.minutes ? this.state.nextExam.minutes : 0}
              </span>
              <span className="d-block opacity-7">minutes</span>
            </div>
          </div>
        </Card>
      </Grid>
      </Grid>

   </Animated>

   

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
