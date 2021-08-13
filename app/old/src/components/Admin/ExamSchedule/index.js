import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections:[],
      examList:[],
      dialogOpen:false,
      basicNotify:false,
      categoryLength:0,
      academicLength:0,
      nonacademicLength:0,
      dashboardDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId,   
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


  getRoundedValue = (v1,v2) => {
    if(v1 == 0 && v2 == 0){
        return 0;
    }
    else{
      let numberToRound = ((v1 - v2)/v2) * 100;
      let per =  numberToRound.toFixed(2);
      return per;
    }

  }

  getExamDetails = () => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,  
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID,
    type:'offline'
    };
    new Service().apiCall('ExamDetails/getExamDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));    
            this.setState({examList:newArr});

      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  componentDidMount() {
    this.getExamDetails();
  }

  render() {
    const {dashboardDetails} = this.state;

  return (
    <Fragment>
       {this.state.basicNotify}
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <Grid container spacing={4} justify="center">
    

            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                
                  <small className="mt-1">{this.state.examList.length}</small>
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Total Exams
                  </div>
                </div>
              </div>
            </Grid>
            </Grid>
       

     <Grid container spacing={5} justify="center">
     {this.props.data.usertype !== "student" && <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/exam-master")}>
          {AuthHelper('Exam Scheduling','can_create') ? "Create/View Exams" : "View Exams"} 
          </Button>
        </Grid>}
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/exam-timetable")}>
          {AuthHelper('Exam Scheduling','can_create') ? "Create/View Timetable" : "View Timetable"} 
          </Button>
        </Grid>
        {/* <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/print-hallticket")}>
          Print Hall Ticket
          </Button>
        </Grid> */}
      </Grid>
      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
