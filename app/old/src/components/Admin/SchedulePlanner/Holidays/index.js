import React, { Fragment } from 'react';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Slide,Button} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import { AuthHelper } from '@utils/AuthHelper.js';
import 'react-table-6/react-table.css';
import i18n from '../../../../i18n';

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Holidays extends React.Component {
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
      can_view:0,
      can_create:0,
      can_edit:0,
      can_delete:0,
      can_export:0
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
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      role_id: this.props.data.role_id,
    };
    new Service().apiCall('HolidayDetails/getHolidaysDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ dashboardDetails:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)
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
      console.log(error);

    });

  }


  componentDidMount() {
    this.getDashboardDetails();
    this.getStandardSectionDetailsDashboard(this.props.data.selectedBoardId,this.props.data.selectedAcademicId);
  }

  render() {
    const {can_view, can_create, can_delete, can_edit, can_export} = this.state;
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading={t.holidays}
        titleDescription=""
        {...this.props}
      /> 

      <Grid container spacing={4}>
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails.total}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                     {t.total} {t.holidays}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails.presentweek}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  {t.this} {t.week}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails.presentmonth}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  {t.this} {t.month}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails.expired}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  {t.expired} 
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

     <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={4}></Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/add-view-holiday")}>
         {AuthHelper('Holidays','can_create') ? `${t.create}/${t.view} ${t.holidays}` : `${t.view} ${t.holidays}`}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}></Grid>
      </Grid>
    </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Holidays));
