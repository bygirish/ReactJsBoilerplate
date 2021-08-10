import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
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
      roleDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],  
    };
  }

  getDashboardDetails() { 
    const postData = {      
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ dashboardDetails: response.data ,selectedBoard:'all',departmentCount:response.data['department']});
        }
      }
    }).catch(error => {
      console.log("error");
  
    });
  }
  
  getRoleDetails() {
    const postData = {   
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getRoleDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ roleDetails: response.data, loading:false });
        }
  
      }
    }).catch(error => {
      alert("error");
  
    });
  
  } 

  componentDidMount() {
    this.getDashboardDetails();
    this.getRoleDetails();
  }

  render() {
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
                  {this.state.dashboardDetails['Total']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Total Staff
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['Teaching']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Teaching Staff
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.dashboardDetails['NonTeaching']}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Non Teaching Staff
                  </div>
                </div>
              </div>
            </Grid>
          
     
      </Grid>

      <Grid container spacing={5} justify="center">
      {AuthHelper('Staff Demography','can_create') &&  <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/add-staff")}>
          Add New Staff
          </Button>
        </Grid>}
        {AuthHelper('Staff Demography','can_edit') &&   <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-staff")}>
          View/Edit Staff
          </Button>
        </Grid>}
        
        {AuthHelper('Staff Demography','can_create') &&   <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/upload-staff")}>
          Bulk Upload
          </Button>
        </Grid>}
      </Grid>

      <Grid container spacing={2} justify="center" className="mt-2">
      {this.state.roleDetails.map((element,idx) => (
      <Grid item xs={12} sm={6} md={3}>
          <Card className="card-box mb-2 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="display-14r font-weight-bold">{element.name}</div>
              
              </div>
              <div className="display-14r font-weight-bold text-second">
              {element.staff_count}
              </div>
            </div>
            <div>
           
            </div>
          </Card>
        </Grid> 
         ))}
      </Grid>
      

      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
