import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
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
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
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

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {allotted_staffs:0, blocks:0, rooms:0, beds:0, allotted:0, vehicle_count:0, no_of_seats:0, route_count:0, student_count:0, staff_count:0, stops_count:0, floors:0},
      selectedOrganizationId: this.props.data.selectedOrganizationId,  
      selectedInstitutionId: this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear: this.props.data.selectedAcademicId,   
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
    new Service().apiCall('HostelBlocks/getHostelsDashboardDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
          this.setState({dashboardDetails:response.data});
        }
    }).catch(error => {
      alert("error");
    });

  }

  componentDidMount() {
    this.getDashboardDetails();
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
        titleHeading="Hostel Management"
        titleDescription=""
        {...this.props}
      /> 
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.rooms}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Total Rooms
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3 font-weight-400">
              {this.state.dashboardDetails.allotted}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Allocated Rooms
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.beds}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase">
              Total Beds
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
            <div className="w-100 text-center">
              <div className="display-3  font-weight-400">
              {this.state.dashboardDetails.allotted}
              </div>
              <div className="mt-2 mb-2" />
              <div className="font-weight-400 font-size-sm text-uppercase"> 
              Allocated Beds
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/room-fee-master")}>
          Room/Fee Master 
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/hostel-entry-exit")}>
          Entry/Exit
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/daily-activities")}>
          Daily Activities
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff-allocation")}>
          Staff Allocation
          </Button>
        </Grid>
      </Grid>   

      <Grid container spacing={4} justify="center" > 
        <Grid item xs={12} sm={12} lg={6}>
          <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default" onClick={()=>this.props.history.push("/admin/individual-hostellite-data")}>Individual Hostelite's Data</Button>
        </Grid>
      </Grid>

      <Grid container spacing={6} justify="center">
        <Grid item xs={12} sm={12} lg={9}>
          <div
            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-2 text-center">
            <Grid container spacing={2} justify="center">
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.blocks}</h5>
                  <div>Blocks</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.floors}</h5>
                  <div>Floors</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.rooms}</h5>
                  <div>Rooms</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.beds}</h5>
                  <div>Total Beds</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.allotted}</h5>
                  <div>Allocated Beds</div>
                </Grid>
                <Grid item xs={12} sm={12} lg={2}>
                  <h5>{this.state.dashboardDetails.allotted_staffs}</h5>
                  <div>Allocated Staffs</div>
                </Grid>
              </Grid>
          </div>
        </Grid>
      </Grid>

      {/* <Grid container spacing={6} justify="center">
        <Grid item xs={12} sm={12} lg={9}>
          <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-2 text-center">
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} sm={12} lg={3}>
                <h5>Vikram  Vikram Vikram</h5>
                <div>Block Name</div>
              </Grid>
              <Grid item xs={12} sm={12} lg={9}>
                <Grid container spacing={1} justify="center">
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>5</h5>
                    <div>Floors</div>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>5</h5>
                    <div>Rooms</div>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>5</h5>
                    <div>Total Beds</div>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>5</h5>
                    <div>Allocated Beds</div>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={2}>
                    <h5>5</h5>
                    <div>Allocated Staffs</div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid> */}


      </Animated>
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
