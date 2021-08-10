import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Badge,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

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
      categoryLength:0,
      academicLength:0,
      nonacademicLength:0,
      dashboardDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],
    };

  }

  getAllDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/getMasterDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ dashboardDetails: response.data });
        }
      }
    }).catch(error => {
    //  console.log("error");
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
    //  alert(error);

    });

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

  componentDidMount() {
    this.getAllDashboardDetails();
    this.getStandardSectionDetailsDashboard(this.props.data.selectedBoardId,this.props.data.selectedAcademicId);
  }

  render() {
    const {dashboardDetails} = this.state;

  return (
    <Fragment>
       {this.state.basicNotify}
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <div  className="pt-1 pl-1">


<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
  <Link color="inherit" href="/admin/dashboard"

  >
    Home
  </Link>
  <Link color="inherit"
    href="/admin/settings"

  >
    Settings
  </Link>
  <Typography color="textPrimary">Board/Course Master</Typography>
</Breadcrumbs>
</div> 
      
      <br/><h5>Master Data</h5><br/>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  Board
              </div>
              <div className="display-4  font-weight-400 text-center">
                  {this.state.dashboardDetails.board}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
              <div>
                <span onClick={()=> this.props.history.push("/admin/master/board/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Add
                </span>
              </div>
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/master/board/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  View
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  Course
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails.course}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
              <div>
                <span onClick={()=> this.props.history.push("/admin/master/course/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Add
                </span>
              </div>
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/master/course/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  View
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  Stream
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails.stream} 
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
              <div>
                <span onClick={()=> this.props.history.push("/admin/master/stream/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Add
                </span>
              </div>
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/master/stream/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  View
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  Combination
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails.combination}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
              <div>
                <span onClick={()=> this.props.history.push("/admin/master/combination/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Add
                </span>
              </div>
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/master/combination/add")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  View
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        </Grid>
        
        {/* {this.state.classwiseSectionsDashboard.length > 0 && this.state.classwiseSectionsDashboard.map((ele, index) => ( 
        <div>
        <br/><h5>Class Wise Fees</h5><br/>
        <Grid container spacing={4} justify="center" className="SectionGrid">
             { Object.entries(ele).map(([k, element]) => element.standard_name ? (
               <Grid xs={12} sm={6} md={4} lg={4}>
            <Card className="m-4">
            <div className="card-body text-center card-body-avatar">
                <div className="avatar-icon-wrapper border-white overflow-hidden rounded border-3">
                <div className="avatar-icon rounded-0 MuiButton-containedSecondary">
                    {element.standard_name}
                </div>
                </div>
                <div>
                <Grid container style={{textAlign:'center'}}> 
            {element.standards && element.standards.map(sections => ( 
            <Grid style={{width:100/element.standards.length+'%',cursor:'pointer'}}>
              <a onClick={()=>{this.setState({viewEditPanel:true});this.props.history.push({pathname: '/admin/view-student',state: {'section_id':sections.section_id}})}}><h4  style={{cursor:'pointer',fontWeight:'bold', color:'#3C4858'}}>{sections.section_name}</h4><h4  style={{cursor:'pointer',fontWeight:'bold', color:'#3C4858'}}>{sections.active_student_count}</h4></a>
              </Grid>
              
            ))} 
            </Grid>
            </div>
            </div>
           
        
           
          </Card>
          </Grid>
           ):'')}
        </Grid>
        </div>
            ))}  */}

      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
