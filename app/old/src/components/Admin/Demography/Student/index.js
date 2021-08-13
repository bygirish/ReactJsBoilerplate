import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "@assetss/custom.scss";
import { Animated } from "react-animated-css";
import { Dialog, Grid, Switch, FormControlLabel, IconButton, Typography, AppBar, Toolbar, Card, CardContent, Fab, TextField, Button, Avatar, List, ListItem, Slide, FormControl, Checkbox, Drawer, Box } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';

import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import { AuthHelper } from '@utils/AuthHelper.js';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections: [],
      dialogOpen: false,
      basicNotify: false,
      dashboardDetails: [],
      TotalStudentCount: 0,
      classwiseSectionsDashboard: [],
      boardDetails: [],

    };

  }

  getDashboardDetails(id_board, id_academicyear) {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_academicyear: id_academicyear,
      id_board: id_board
    }
    new Service().apiCall('StudentDetails/getDashboardDetails', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          this.setState({ dashboardDetails: response.data['boards'], TotalStudentCount: response.data['Total'] });
        }
      }
    }).catch(error => {
      alert("error");

    });
  }

  getStandardSectionDetailsDashboard(id_board, id_academicyear) {
    const postData = {
      count: "student",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId
    };
    console.log(postData);
    new Service().apiCall('ClassDetails/getData', postData).then(response => {
      console.log(response.data);
      if (response.status == 200 && response.data != '') {
        var lStandardSections = [];
        let section_student_count=0;
        response.data.forEach(element => {
          if (lStandardSections[element.board_id]) {
            var lStandard = {};
            lStandard.standard_name = element.standard_name;
            lStandard.standard_id = element.standard_id;
            console.log("cboard 1" + JSON.stringify(lStandardSections[element.board_id]))
          } else {
            var lBoard = {};
            var lStandard = {};
            lBoard.board_name = element.board_name;
            lStandard.standard_name = element.standard_name;
            lStandard.standard_id = element.standard_id;
            lStandardSections[element.board_id] = lBoard;
            console.log("cboard 2" + JSON.stringify(lStandardSections[element.board_id]))
          }
          // if (lStandardSections[element.board_id][element.stream_name]) {
          //   var lStream = {};
          //   console.log("stream 1" + JSON.stringify(lStandardSections[element.board_id][element.stream_name]))
          // } else {
          //   var lStream = {};
            
          //   if (element.stream_name != null && element.stream_name != '') {
          //     lStream.stream_name = element.stream_name;

          //     lStream.standard_all_student_count=element.standard_all_student_count;
          //   } else {
          //     lStream.stream_name = 'others';
          //   }
          //   lStandardSections[element.board_id][element.stream_name] = lStream;
          //   console.log("stream 2" + JSON.stringify(lStandardSections[element.board_id][element.stream_name]))
          // }


          if (lStandardSections[element.board_id][element.standard_id]) {

            var lSection = {};
            
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_student_count = element.all_student_count;
            lSection.standard_all_student_count = element.standard_all_student_count;
            
            lSection.stream_name = element.stream_name;

            lSection.active_student_count = element.active_student_count;
            lStandardSections[element.board_id][element.standard_id].standards.push(lSection);
            console.log('check 1' + JSON.stringify(lStandardSections[element.board_id][element.standard_id]))
          } else {
            console.log('check 2' + JSON.stringify(lStandardSections[element.board_id][element.standard_id]))

            var lStandard = {};
            var lSection = {};
           
            lStandard.standard_name = element.standard_name;
            lStandard.stream_name = element.stream_name;
            lStandard.standard_all_student_count = element.standard_all_student_count;

            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_student_count = element.all_student_count;
            lSection.standard_all_student_count = element.standard_all_student_count;
           
            lSection.stream_name = element.stream_name;

            lSection.active_student_count = element.active_student_count;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);
            lStandardSections[element.board_id][element.standard_id] = lStandard;
            console.log('check 3' + JSON.stringify(lStandardSections[element.board_id][element.standard_id]))
          }






          // if(lStandardSections[element.board_id][element.standard_id][element.stream_name]){
          //   var lStream = {};
          // }else{
          //   var lStream = {};
          //   lStandardSections[element.board_id][element.standard_id][element.stream_name]=lStream;
          // }
        });
        this.setState({ classwiseSectionsDashboard: lStandardSections, loading: false });
        console.log({ lStandardSections });
      }
    }).catch(error => {
      alert(error);

    });

  }

  componentDidMount() {
    console.log(this.props.data);
    this.getDashboardDetails(this.props.data.selectedBoardId, this.props.data.selectedAcademicId);
    this.getStandardSectionDetailsDashboard(this.props.data.selectedBoardId, this.props.data.selectedAcademicId);
  }

  render() {
    const width40p = (window.innerWidth) * (40 / 100) + "px";
    return (
      <Fragment>
        {this.state.basicNotify}
        <Animated animationIn="slideInRight" animationOut="slideOutLeft">
          <div className=" pl-1">


            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link color="inherit" href="/admin/dashboard"

              >
                Home
              </Link>
              <Link color="inherit"
                href="/admin/demography"

              >
                Demography
              </Link>
              <Typography color="textPrimary">Student Demography</Typography>
            </Breadcrumbs>
          </div>
          {this.props.data.usertype != "student" && <Grid container spacing={4} justify='center'>
            <Grid item xs={12} sm={6} lg={4}>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                    {this.state.TotalStudentCount}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Total Students
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
            </Grid>
            {this.state.dashboardDetails.map(boardDetails =>
              


                this.state.dashboardDetails.length > 2 ?
                <Grid item xs={12} sm={6} lg={4}>
                  <div
                    className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                    <div className="w-100 text-center">
                      <div className="display-3 font-weight-400">
                        {boardDetails.count}
                      </div>
                      <div className="mt-2 mb-2" />
                      <div className="font-weight-400 font-size-sm text-uppercase">
                        {boardDetails.name}
                      </div>
                    </div>
                  </div>
                </Grid>
                :
                this.state.dashboardDetails.length != 1 &&
                <Grid item xs={12} sm={6} lg={6}>
                  <div
                    className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                    <div className="w-100 text-center">
                      <div className="display-3 font-weight-400">
                        {boardDetails.count}
                      </div>
                      <div className="mt-2 mb-2" />
                      <div className="font-weight-400 font-size-sm text-uppercase">
                        {boardDetails.name}
                      </div>
                    </div>
                  </div>
                </Grid>

            )}
          </Grid>}

          <Grid container spacing={5} justify="center" className="mb-5">
            {AuthHelper('Student Demography', 'can_create') && <Grid item xs={12} sm={12} lg={4}>
              <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/add-student")}>
                Add New Student
              </Button>
            </Grid>}
            <Grid item xs={12} sm={12} lg={4}>
              <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/view-student")}>
                {AuthHelper('Student Demography', 'can_edit') ? "View/Edit Student" : "View Student"}
              </Button>
            </Grid>
            {AuthHelper('Student Demography', 'can_create') && <Grid item xs={12} sm={12} lg={3}>
              <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/upload-students")}>
                Bulk Upload
              </Button>
            </Grid>}
          </Grid>

          {this.state.classwiseSectionsDashboard.length > 0 && this.state.classwiseSectionsDashboard.map((ele, index) => (
            <>
              <Grid container spacing={4} justify="center" className="SectionGrid mb-5">
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <h4>Class Wise Count</h4>
                </Grid>
              </Grid>

              {console.log('test2' + JSON.stringify(Object.entries(ele))+ 'ele length'+Object.entries(ele).length)}
              <Grid container spacing={4} justify="center" className="SectionGrid">
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Card className="">
                    <div className="card-body text-center">
                        <Grid container spacing={4} justify="center" className="SectionGrid mb-3">
                          <Grid xs={12} sm={12} md={12} lg={12}>
                            <div className="avatar-icon-wrapper border-white overflow-hidden rounded border-5 p-3 px-5 MuiButton-containedSecondary" style={{marginTop:-30}}>
                              
                              {ele.board_name}
                              
                            </div>
                          </Grid>
                        </Grid>



                     
                     
                        

                            <Grid container spacing={1} justify="center" className="SectionGrid pt-5">
                             
                              {Object.entries(ele).map(([k, elements]) => elements.standard_name ? (
                                <Grid xs={12} sm={4} md={4} lg={Object.entries(ele).length>2?4:6}>
                                  <Card className="m-4 ">
                                    <div className="card-body  card-body-avatar text-center">
                                      <div className="avatar-icon-wrapper border-white overflow-hidden rounded border-3 text-center card_auto_width ">
                                        <div className="avatar-icon rounded-0 MuiButton-containedSecondary text-center px-3" >
                                          {elements.standard_name!=elements.stream_name?
                                          elements.standard_name+'/'+elements.stream_name:
                                          elements.standard_name}
                                          
                                        
                                         
                                        </div>
                                      </div>

                                      <div>
                                        <div className="display-4  font-weight-400 text-center">
                                          {elements.standard_all_student_count}
                                          <Grid container style={{ textAlign: 'center' }}>

                                            {elements.standards && elements.standards.map(sections => (
                                              <Grid xs={12} sm={12} md={12} lg={12} style={{ width: 100 / elements.standards.length + '%', cursor: 'pointer' }}>

                                                <a onClick={() => {
                                                  this.setState({ viewEditPanel: true });
                                                  let CstudentCount = 0;
                                                  CstudentCount += sections.active_student_count;
                                                  this.setState({CstudentCount:CstudentCount});
                                                }}>
                                                  

                                                </a>
                                              </Grid>

                                            ))}

                                          </Grid>
                                        </div>

                                        <Grid container style={{ textAlign: 'center' }}>

                                         

                                        </Grid>
                                      </div>



                                    </div>
                                    
                                    <div className="card-footer card_footer_border pb-2 ">
                                      <div className="font-size-md px-2">
                                        <span
                                          // onClick={()=> this.props.history.push("/admin/master/combination/add")}
                                          onClick={() => { this.setState({ viewCourseDetail: true, SBoardName: ele.board_name, SStreamName: elements.stream_name, SStandardName: elements.standard_name }); }}
                                          className="font-size-md text-black-50 px-2 cursor text-center"
                                          title="Total views">
                                          <FontAwesomeIcon icon={['far', 'eye']} />
                                          View
                                        </span>
                                      </div>
                                    </div>
                                  </Card>
                                </Grid>
                              ) : '')}
                            </Grid>

                        

                      

                     
                      {/* ( element.map((k, elements) => elements.standard_name ? (
                 <Grid xs={12} sm={6} md={4} lg={4}>
              
              <Card className="m-4">
              <div className="card-body text-center card-body-avatar">
                  <div className="avatar-icon-wrapper border-white overflow-hidden rounded border-3">
                  <div className="avatar-icon rounded-0 MuiButton-containedSecondary">
                      {elements.standard_name}
                     
                  </div>
                  </div>
                  <div>
                  <Grid container style={{textAlign:'center'}}> 
              {elements.standards && elements.standards.map(sections => ( 
              <Grid xs={12} sm={12} md={12} lg={12} style={{width:100/elements.standards.length+'%',cursor:'pointer'}}>
              <h4  style={{cursor:'pointer',fontWeight:'bold', color:'#3C4858'}}>{sections.stream_name}</h4>
                <a onClick={()=>{this.setState({viewEditPanel:true});this.props.history.push({pathname: '/admin/view-student',state: {'section_id':sections.section_id}})}}><h4  style={{cursor:'pointer',fontWeight:'bold', color:'#3C4858'}}>{sections.section_name}</h4><h4  style={{cursor:'pointer',fontWeight:'bold', color:'#3C4858'}}>{sections.active_student_count}</h4></a>
                </Grid>
                
              ))} 
              </Grid>
              </div>
              </div>
  
            </Card>
            </Grid>
            ):''))  
           )}   */}
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </>
          ))}

        </Animated>
        {/* ):'')} */}
        <Drawer

          anchor="right"
          open={this.state.viewCourseDetail}
          variant="temporary"
          elevation={4}
          onClose={() => this.setState({ viewCourseDetail: false })}>
          <Box className={"app-header-drawer bgColor"} style={{ width: width40p }}>
            <PerfectScrollbar>

              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => this.setState({ viewCourseDetail: false })} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4">
                    {this.state.SBoardName}, {this.state.SStandardName}, {this.state.SStreamName}
                  </Typography>
                </Toolbar>
              </AppBar>

              {/* <Grid container spacing={2} justify="center" className="mt-1">
                <Grid item xs={12} sm={12} lg={12}>

                </Grid>
              </Grid> */}
              <Grid container spacing={4} className="pt-5">
      <Grid xs={12} sm={12} md={3}></Grid>   
      <Grid xs={12} sm={12} md={6}>  
      {/* {this.state.childMenu.length > 0 && this.state.childMenu.map((element, index) => ( */}
        <Card key={3} className="card-box mb-2">
      <Grid container spacing={4}  justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={9}>
          <Grid container spacing={4} >
            <Grid item xs={12}>
              <div className="px-4 py-2">
                <div className="mt-2 mb-2 line-height-sm">
                  <span className="font-size-lg">{'All'}</span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div className="text-right py-2">
                <div className="mt-2 mb-2 mr-4 line-height-sm">
                <Fab size="medium" color="secondary" aria-label="edit" onClick={()=>this.props.history.push("/admin/view-student")}>
                  <NavigateNext />
                </Fab>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
      <Card key={1} className="card-box mb-2">
      <Grid container spacing={4}  justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={9}>
          <Grid container spacing={4} >
            <Grid item xs={12}>
              <div className="px-4 py-2">
                <div className="mt-2 mb-2 line-height-sm">
                  <span className="font-size-lg">{'PCMB-A 40'}</span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div className="text-right py-2">
                <div className="mt-2 mb-2 mr-4 line-height-sm">
                <Fab size="medium" color="secondary" aria-label="edit" onClick={()=>this.renderPage('/')}>
                  <NavigateNext />
                </Fab>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
    <Card key={2} className="card-box mb-2">
      <Grid container spacing={4}  justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={9}>
          <Grid container spacing={4} >
            <Grid item xs={12}>
              <div className="px-4 py-2">
                <div className="mt-2 mb-2 line-height-sm">
                  <span className="font-size-lg">{'PCMB-B 20'}</span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div className="text-right py-2">
                <div className="mt-2 mb-2 mr-4 line-height-sm">
                <Fab size="medium" color="secondary" aria-label="edit" onClick={()=>this.renderPage('/')}>
                  <NavigateNext />
                </Fab>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
       {/* ))} */}
      </Grid>
      </Grid>
            </PerfectScrollbar>
          </Box>
        </Drawer>


      </Fragment>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
