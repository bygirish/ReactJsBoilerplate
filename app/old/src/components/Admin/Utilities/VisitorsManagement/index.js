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
import moment from "moment";

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

class Visitors extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            VisitorList:[],
            ScheduledVisitorList:[],
            dashboardDetails: [],
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
        //console.log(postData);
        new Service().apiCall('VisitorManagement/getVisitorsDashboardDetails', postData).then(response => {
            //console.log(response);
            if (response.status==200 && response.data!='') {
                this.setState({dashboardDetails:response.data});
            }
        }).catch(error => {
            alert("error");
        });
    }

    getVisitorData = (id,type) => {
        const postData = {
          id_organization:this.state.selectedOrganizationId,
          id_institute:this.state.selectedInstitutionId,
          token:"abc",
          id_user: this.props.data.UID,
          type:type,
          id_board:this.state.selectedBoard,
          id_academicyear:this.state.selectedAcademicYear,
        };
        new Service().apiCall('VisitorManagement/getWaitingVisitorData',postData).then(response => { 
          console.log(response)
          if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
              return {...data, checked: false, editable: false};
            });
        
            this.setState({ VisitorList: data }); 
          }else{
            this.setState({ VisitorList: []});
          }
        }).catch(error => {
          console.log(error); 
        });
    }

    getScheduledVisitorData = (id,type) => {
        const postData = {
          id_organization:this.state.selectedOrganizationId,
          id_institute:this.state.selectedInstitutionId,
          token:"abc",
          id_user: this.props.data.UID,
          type:type,
          id_board:this.state.selectedBoard,
          id_academicyear:this.state.selectedAcademicYear,
        };
        new Service().apiCall('VisitorManagement/getScheduledVisitorData',postData).then(response => { 
          //console.log(response)
          if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
              return {...data, checked: false, editable: false};
            });
        
            this.setState({ ScheduledVisitorList: data }); 
          }else{
            this.setState({ ScheduledVisitorList: []});
          }
        }).catch(error => {
          console.log(error); 
        });
    } 


    updateWaitingTime = () =>{
      
          let lVisitorList = this.state.VisitorList;
          let currentDateTime = moment(new Date()).format("HH:mm:ss A")
          lVisitorList.forEach(element =>{
            
            var lWaitingTimeInSeconds = this.getWaitingTimeInSeconds(element.entered_time,currentDateTime);
            element.waiting_visit = lWaitingTimeInSeconds;

          });
          this.setState({VisitorList:lVisitorList});
    }
    

    getWaitingTimeInSeconds = (pEnteredTime,pCurrentTime) =>{
      
      let enteredTime = moment(pEnteredTime, "hh:mm:ss a");
      let currentTime = moment(pCurrentTime, "hh:mm:ss a");
      let secondsDiff = currentTime.diff(enteredTime, 'seconds');
      let hours = Math.floor(secondsDiff / 3600);
      secondsDiff %= 3600;
      let minutes = Math.floor(secondsDiff / 60);
      let seconds = secondsDiff % 60;
      return hours+' : '+minutes+' : '+seconds;
    }
      
    componentDidMount() {
      this.getDashboardDetails();
      this.getVisitorData();
      this.getScheduledVisitorData();  
      setInterval(() => { 
        this.updateWaitingTime();
      }, 1000);   
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
                        titleHeading="Visitors Management"
                        titleDescription=""
                        {...this.props}
                    /> 
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} lg={3}>
                        <div
                            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                            <div className="w-100 text-center">
                            <div className="display-3  font-weight-400">
                            {this.state.dashboardDetails.waiting_visitor}
                            </div>
                            <div className="mt-2 mb-2" />
                            <div className="font-weight-400 font-size-sm text-uppercase">
                                Visitors Waiting
                            </div>
                            </div>
                        </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                        <div
                            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                            <div className="w-100 text-center">
                            <div className="display-3 font-weight-400">
                            {this.state.dashboardDetails.daily_visitor}
                            </div>
                            <div className="mt-2 mb-2" />
                            <div className="font-weight-400 font-size-sm text-uppercase">
                                Todays Visitor
                            </div>
                            </div>
                        </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                        <div
                            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                            <div className="w-100 text-center">
                            <div className="display-3  font-weight-400">
                            {this.state.dashboardDetails.weekly_visitor}
                            </div>
                            <div className="mt-2 mb-2" />
                            <div className="font-weight-400 font-size-sm text-uppercase">
                                This Week Visitors
                            </div>
                            </div>
                        </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                        <div
                            className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                            <div className="w-100 text-center">
                            <div className="display-3  font-weight-400">
                            {this.state.dashboardDetails.scheduled_visitor}
                            </div>
                            <div className="mt-2 mb-2" />
                            <div className="font-weight-400 font-size-sm text-uppercase"> 
                                Scheduled Visitors
                            </div>
                            </div>
                        </div>
                        </Grid>
                    </Grid>  

                    <Grid container spacing={4} justify="center"> 
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-waiting-visitors")}>
                            View Visitors Waiting
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-todays-visitor")}>
                            View Todays Visitor
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-weekly-visitor")}>
                            View This Week Visitors
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button className="w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/scheduled-visitors")}>
                            View Scheduled Visitors
                            </Button>
                        </Grid>
                    </Grid>                       
 
                    <Grid container spacing={4} justify="center"> 
                      <Grid item xs={12} sm={12} lg={3}>
                        <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default" onClick={()=>this.props.history.push("/admin/add-visitor-data")}>Add Visitors</Button>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3}>
                        <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default" onClick={()=>this.props.history.push("/admin/view-visitor-data")}>View Visitors</Button>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3}>
                        <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default" onClick={()=>this.props.history.push("/admin/add-scheduled-data")}>Add Scheduled Visitors</Button>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3}>
                        <Button className="my-4 w-100 py-2 font-18" variant="contained" color="default" onClick={()=>this.props.history.push("/admin/visitor-reports")}>Reports</Button>
                      </Grid>
                    </Grid>

                    <Grid container spacing={4} justify="center"> 
                        <Grid item xs={12} sm={12} lg={12} className="mb-3">
                          <Card className="card-box  mb-4 p-4 customNoData">
                            <div className="card-header">
                                <div className="card-header--title">
                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                        Visitors Waiting
                                    </h4>
                                </div>
                            </div>

                            <ReactTable
                                data={this.state.VisitorList.map((original,key) => {

                                  // let enteredTime = moment(original.entered_time, "hh:mm:ss");
                                  // let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                                  // let subtract = enteredTime.subtract(currentTime);
                                  // let format = moment(subtract).format("hh:mm:ss")

                                    return ({
                                        slno: key+1,
                                        id:original.id,
                                        name: original.name,
                                        type:original.type,
                                        person:original.person,
                                        person_type:original.person_type,
                                        phone:original.phone,
                                        age:original.age,
                                        address:original.address,
                                        date:original.date,
                                        sex:original.sex,
                                        purpose:original.purpose, 
                                        intime:original.intime,
                                        entered_time:original.entered_time,
                                        waiting_visit:original.waiting_visit,
                                        actions: (
                                          // we've added some custom button actions
                                          <div>                                                                   
                                                        
                                            {/* use this button to remove the data row */}
                                              <Tooltip id="tooltip-top" title="View" placement="top" >
                                                <Button
                                                  className="m-2"
                                                  variant="contained"
                                                  onClick={()=>this.props.history.push("/admin/check-in-visit/"+original.id)}
                                                  color="secondary"
                                                  className="view"
                                                  >CHECK IN
                                                  </Button> 
                                              </Tooltip>
                                            </div>
                                        )
                                    })
                                })
                            } 

                            filterable
                            minRows={0}
                            columns={[
                            {
                              Header: "S No",
                              accessor: "slno",
                              width: 80,
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Waiting",
                              accessor: "waiting_visit",
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Visitor Name",
                              accessor: "name",
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Person To Meet",
                              accessor: "person",
                              className: "center",
                              filterable: false,
                            },
                            {
                            Header:"Actions",
                            accessor: "actions",
                            className: "center",
                            sortable: false,
                            filterable: false,
                            }
                            ]}
                            defaultFilterMethod={filterCaseInsensitive}
                            defaultPageSize={10}
                            showPaginationTop
                            showPaginationBottom={false}
                            className="-striped -highlight"
                        />
                      </Card>
                    </Grid> 
                        
                        <Grid item xs={12} sm={12} lg={12} className="mb-3">
                          <Card className="card-box  mb-4 p-4 customNoData">
                            <div className="card-header">
                                <div className="card-header--title">
                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                        Scheduled Appointments
                                    </h4>
                                </div>
                            </div>

                            <ReactTable
                                data={this.state.ScheduledVisitorList.map((original,key) => {
                                    return ({
                                        slno: key+1,
                                        id:original.id,
                                        name: original.name,
                                        type:original.type,
                                        person:original.person,
                                        person_type:original.person_type,
                                        phone:original.phone,
                                        age:original.age,
                                        address:original.address,
                                        date:original.date,
                                        sex:original.sex,
                                        purpose:original.purpose,
                                        time:original.time,
                                        actions: (
                                          // we've added some custom button actions
                                          <div>                                                                   
                                                        
                                            {/* use this button to remove the data row */}
                                              <Tooltip id="tooltip-top" title="View" placement="top" >
                                                <Button
                                                  className="m-2"
                                                  simple
                                                  onClick={()=>this.props.history.push("/admin/view-visit-details/"+"Scheduled/"+original.id)}
                                                  color="secondary"
                                                  className="view"
                                                  >
                                                  <ViewIcon/>
                                                  </Button> 
                                              </Tooltip>
                                            </div>
                                        )
                                    })
                                })
                            } 

                            filterable
                            minRows={0}
                            columns={[
                            {
                              Header: "S No",
                              accessor: "slno",
                              width: 80,
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Name",
                              accessor: "name",
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Person To Meet",
                              accessor: "person",
                              className: "center",
                              filterable: false,
                            },
                            {
                              Header: "Scheduled Time",
                              accessor: "time",
                              className: "center",
                              filterable: false,
                            },
                            {
                            Header:"Actions",
                            accessor: "actions",
                            className: "center",
                            sortable: false,
                            filterable: false,
                            }
                            ]}
                            defaultFilterMethod={filterCaseInsensitive}
                            defaultPageSize={10}
                            showPaginationTop
                            showPaginationBottom={false}
                            className="-striped -highlight"
                        />
                      </Card>
                    </Grid>

                    </Grid>

                </Animated>
            </Fragment>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Visitors));
