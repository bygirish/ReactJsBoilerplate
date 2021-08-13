import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {Badge,Grid,Dialog,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
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
import i18n from '../../../i18n';

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

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
      column_count: '',
      academicLength:0,
      nonacademicLength:0,
      dashboardDetails:[],
      TotalStudentCount:0,
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

  getDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      role_id:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassMasters/getDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ dashboardDetails: response.data });
        }
      }
    }).catch(error => {
      this.showError(error.response.data);
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
    this.getDashboardDetails();
    this.getStandardSectionDetailsDashboard(this.props.data.selectedBoardId,this.props.data.selectedAcademicId);
  }

  render() {
    const {dashboardDetails} = this.state;

  return (
    <Fragment>
       {this.state.basicNotify}
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 

  <h5>{t.masters}</h5><br/>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
              {t.class} {t.master}
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails['classmaster']}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
            {AuthHelper('CSTR','can_create') &&  <div>
                <span onClick={()=> this.props.history.push("/admin/class-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                   {t.add}
                </span>
              </div>}
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/class-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  {t.view}
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  {t.subject} {t.master}
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails['subjectmaster']}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
            {AuthHelper('CSTR','can_create') &&  <div>
                <span onClick={()=> this.props.history.push("/admin/subject-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  {t.add}
                </span>
              </div>}
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/subject-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  {t.view}
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  {t.teacher} {t.master}
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails['teachermaster']}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
          
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/teacher-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  {t.view}
                </span>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="card-box mb-4">
            <div className="card-body px-3 py-3">
              <div className="font-size-md pb-3 text-center">  
                  {t.room} {t.master}
              </div>
              <div className="display-4  font-weight-400 text-center">
              {this.state.dashboardDetails['roommaster']}
                  </div>
              <div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center p-2 justify-content-between">
            {AuthHelper('CSTR','can_create') && <div>
                <span onClick={()=> this.props.history.push("/admin/room-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
              {t.add}
                </span>
              </div>}
              <div className="font-size-sm px-2">
              <span onClick={()=> this.props.history.push("/admin/room-master")}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total views">
                  <FontAwesomeIcon icon={['far', 'eye']} className="mr-1" />
                  {t.view}
                </span>
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
