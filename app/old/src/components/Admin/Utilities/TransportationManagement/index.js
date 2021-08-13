import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Drawer,Box,Tooltip,Typography,AppBar,Toolbar,Card,CardActions,IconButton,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Config from '../../../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function filterCaseInsensitive(filter, row) {

  const id = filter.pivotId || filter.id;
  if (row[id] !== null) {
    return (
        row[id] !== undefined ?
          String(row[id].toString().toLowerCase())
                .includes(filter.value.toString().toLowerCase())
        :
            true
    );
  }
}

class Transportation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {vehicle_count:0, route_count:0, student_count:0, staff_count:0, stops_count:0,  no_of_seats:0,  },
      selectedOrganizationId: this.props.data.selectedOrganizationId,  
      selectedInstitutionId: this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear: this.props.data.selectedAcademicId,   
      getVehicleTransportationDashboardDetails:[{vehicle_no:0,driver_count:0,route_count:0}],
    };

  }

  getDashboardDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID,
    }
    new Service().apiCall('TransportationMasters/getTransportationDashboardDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
          this.setState({dashboardDetails:response.data});
        }
    }).catch(error => {
      alert("error");
    });

  }
  getVehicleTransportationDashboardDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID,
    }
    new Service().apiCall('TransportationMasters/getVehicleTransportationDashboardDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
          this.setState({getVehicleTransportationDashboardDetails:response.data});
        }
    }).catch(error => {
      alert("error");
    });

  }

  componentDidMount() {
    this.getDashboardDetails();
    this.getVehicleTransportationDashboardDetails();
  }

  render() {
    const width = window.innerWidth;
    const width100p =  width +"px";
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Transportation Management"
        titleDescription=""
        {...this.props}
      /> 
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.vehicle_count}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Vehicle Count
              
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3 font-weight-400">
              {this.state.dashboardDetails.route_count}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Route Count
              
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.student_count}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Students Count
              
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.staff_count}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase"> 
              Staff Count
              
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/Fleet-management")}>
          Fleet Management
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/RouteFee-Master")}>
          Route/Fee Master
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/student-route-bus")}>
          Student - Route - Bus
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/transportation-route-switch")}>
          Route Switch
          </Button>
        </Grid>
      </Grid>   

      {/* <Grid container spacing={4} justify="center" >
        <Grid item xs={12} sm={12} lg={6}>
          <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default">Individual Hostelite's Data</Button>
        </Grid>
      </Grid> */}

      <Grid container spacing={6} justify="center">
        <Grid item xs={12} sm={12} lg={9}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-2 text-center">
            <Grid container spacing={2} justify="center">
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.vehicle_count}</h5>
                  <div>Buses</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.route_count}</h5>
                  <div>Routes</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.stops_count}</h5>
                  <div>Stops</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                <h5>{this.state.dashboardDetails.no_of_seats}</h5>
                  <div>No Of Seats</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.student_count}</h5>
                  <div>Students</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.staff_count}</h5>
                  <div>Allocated Staffs</div>
                </Grid>
              </Grid>
          </div>
        </Grid>
      </Grid>
     {this.state.getVehicleTransportationDashboardDetails.map((element,index)=>(
      <Grid container spacing={6} justify="center">
        <Grid item xs={12} sm={12} lg={9}>
          <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-2 text-center">
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} sm={12} lg={3}>
                <h5>{element.vehicle_no}</h5>
                <div>Vehicle Number</div>
              </Grid>
              <Grid item xs={12} sm={12} lg={9}>
                <Grid container spacing={1} justify="center">
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>{element.driver_count}</h5>
                    <div>Driver</div>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>{element.route_count}</h5>
                    <div>Route</div>
                  </Grid>
                
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      ))}

      </Animated>
   
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Transportation));
