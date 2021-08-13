import React, { Fragment } from 'react';
import ReactDOM from "react-dom";
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
// import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
import AutocompleteMaterial from '@material-ui/lab/Autocomplete';
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import { Animated } from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NextIcon from '@material-ui/icons/NavigateNext';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import VisibilityIcon from '@material-ui/icons/Visibility';

import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import { AlignRight } from 'react-feather';


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
const fileInput = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class FleetManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      dialogOpen: true,
      actionType: 'student_route',
      loading: false,
      selectedBlockId: '',
      TabValue: 0,
      checkAll: false,
      blocksList: [],
      checked: [],
      holidays: [{ id: 1, name: 'test' }],
      startdate: new Date(),
      enddate: new Date(),
      confirmPanel: false,
      activePanelType: true,
      selectedTab: '',
      selectedSubTab: '',
      error: '',
      activeSidebarTab: "student_route",
      alert: null,
      roomholders: [{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }],
      loading: true,
      selectedBoard: '',
      basicNotify: false,
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      RoleMaster: [],
      VehicleMaster:[{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }],
      StaffOverview:[{ vehicle_no: ''}],
      StaffToVehicle:[],
      dependentModule: false,
      value: '',
      setValue: 'female',
      monthDetails:[{month:'January', month_id:1},{month:'February', month_id:2},{month: 'March', month_id:3},{month: 'April', month_id:4},{month: 'May', month_id:5},{month: 'June', month_id:6},{month: 'July', month_id:7},{month:'August', month_id:8},{month: 'September', month_id:9},{month: 'October', month_id:10},{month: 'November', month_id:11},{month:'December', month_id:12}],
        


      StaffToRole: [{ id: 1, role_name: 'test', block_name: '1 A', name: 'test', emp_code: '2021', contact: '7412589636' }],
      selectedStaff:[],
      staffArr:[],
      RouteMaster:[],
      selectedStaffRoute:'',
      selectedStaffVehicle:'',
      id_route:'',
      id_vehicle:''

    };
  }

  handleDeactive = (id, status) => {
    let headingStatus = "Block Activated!";
    if (status == 1) {
      headingStatus = "Block Deactivated!";
    }

    const postData = {
      id: id,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/deleteVehicleMaster', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getVehicleMaster();
        setTimeout(() => {
          this.setState({ basicNotify: false });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }
  handleDeactiveStaffOverview = (id, status) => {
    let headingStatus = "Block Activated!";
    if (status == 1) {
      headingStatus = "Block Deactivated!";
    }

    const postData = {
      id: id,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/deleteStaffOverview', postData).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getStaffOverview();
        setTimeout(() => {
          this.setState({ basicNotify: false });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  insertBlock = () => {
    let headingStatus = "Block Inserted!";

    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      id_route: this.state.id_route,
      id_vehicle:this.state.id_vehicle,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationRouteMasters/insertRouteBus', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getVehicleMaster();
        this.getStaffOverview();
        setTimeout(() => {
          this.setState({ basicNotify: false, roomholders: [{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }] });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }


  updateHeading = (id,id_route,id_trip, index) => {
    // let data = this.state.staffArr;
    // let id_vehicle = data[index].id_vehicle;
    // let id_route = id_route;
    // let id_trip = id_trip;
    // let fuel_type = data[index].fuel_type;
    // let insurance_expiry_date = data[index].insurance_expiry_date;
    // let seating_capacity = data[index].seating_capacity;
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
    
      id_vehicle: this.state.staffArr,
      id_route: id_route,
      id_trip: id_trip,
    
      token: "abc",
      id_user: this.props.data.UID
    };
    console.log(postData)
    new Service().apiCall('TransportationRouteMasters/insertBusRouteMapNew', postData).then(response => {
        console.log(response)
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">Block Updated</h4>
              </div>
            </Dialog>
          ),
        });
        this.getStaffOverview();
        setTimeout(() => {
          this.setState({ basicNotify: false });
        }, 2000)
      } else {
        // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //console.log(error);
      //this.raiseLoginSignupErrorAlert("signup");

    });
  }


  addBlock = () => {
    let data = this.state.roomholders;
    let object = { block_name: '', no_of_floors: '' };
    data.push(object);
    this.setState({ data });
  }

  removeBlock = (index) => {
    const { roomholders } = this.state;
    this.setState({ roomholders: roomholders.filter((data, i) => i !== index) })

  }

  getBlocksData = (id, type) => {
      
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getFuelDetails', postData).then(response => {
      // console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ blocksList: data });
      } else {
        this.setState({ blocksList: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getRoleMaster = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getRoleData', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ RoleMaster: data });
      } else {
        this.setState({ RoleMaster: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getVehicleMaster = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getData', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ VehicleMaster: data });
      } else {
        this.setState({ VehicleMaster: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getRouteMaster = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationRouteMasters/getRouteMasterNew', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ RouteMaster: data });
      } else {
        this.setState({ RouteMaster: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getStaffOverview = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationRouteMasters/getBusRouteDetails', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ StaffOverview: data });
      } else {
        this.setState({ StaffOverview: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getStaffToVehicle = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationRouteMasters/getTripsData', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ StaffToVehicle: data });
      } else {
        this.setState({ StaffToVehicle: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  

  


  rowEdit = (estatus, index) => {

    let blocks = this.state.StaffOverview;
    if (estatus == true) {
      blocks[index].editable = false;
    }
    else {
      blocks[index].editable = true;
    }
    this.setState({ blocks });
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.StaffOverview];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;
    this.setState({ data });
  };

  handleChangeData = (index, name, value) => {
    let data = this.state.roomholders;
    data[index][name] = value;
    this.setState({ data });

  };
  resetClass=()=>{
   let data = this.state.roomholders;
   console.log(data);
    data=[{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }];
    this.setState({ roomholders: data });
    console.log(data);
  }

  renderEditable = (cellInfo) => {

    const cellValue = this.state.StaffOverview[cellInfo.index][cellInfo.column.id];
    // console.log(cellInfo.column.id);
    if (cellInfo.original.editable) {
      return (
        <Grid item xs={12} md={12} lg={12} className="autocompleteDiv" >
        <FormControl >
          
         
          <AutocompleteMaterial
                                                multiple
                                                id="tags-outlined"
                                                options={this.state.VehicleMaster}
                                                // value={cellValue}
                                                value={this.state.selectedStaff}
                                                onChange={this.searchStaff} 
                                                // onChange={(event)=>this.searchStaff(key,"students", event.target.value)
                                                //             }
                                                getOptionLabel={(option) => (option.vehicle_no)}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Vehicle No"
                                                    placeholder="Favorites"
                                                />
                                                )}
                                            />

        </FormControl>
        </Grid>
      );

    }
    else {
      return cellValue;
    }

  };
  searchStaff = (event,values) => {
    let data = this.state.staffArr;
    const name='id_vehicle';
    const index=0;
    let dataV =[];
    if(values){
        const listItems = values.map((myList, key) =>  
            dataV.push(myList.id)         
        ); 
    }
    data = dataV;
    this.setState({ staffArr:data });
    console.log(this.state.staffArr)
    
    this.setState({selectedStaff:values})
    // this.setState({selectedStaff:values, staffArr:data})
    

    // console.log( dataV )   
    // console.log(values) 
}
searchStaffRoute = (event,values) => {

  
  
  if(values){
    this.setState({id_route:values['id']});
 
    }
  
  this.setState({selectedStaffRoute:values})
  // this.setState({selectedStaff:values, staffArr:data})
  

  // console.log( dataV )   
  // console.log(values) 
}
searchStaffVehicle = (event,values) => {
        
        
        
  if(values){
      this.setState({id_vehicle:values['id']});
   
      }
  
  
 
  
  this.setState({selectedStaffVehicle:values})
  // this.setState({selectedStaff:values, staffArr:data})
  


}


  componentDidMount() {
    this.getBlocksData();
    this.getRoleMaster();
    this.getVehicleMaster();
    this.getStaffOverview();
    this.getStaffToVehicle();
    this.getRouteMaster();
  }


  handleChange = (event) => {
    //  console.log(event.target.value);
    // value=event.target.value;
    // this.setState({value: value})

    let data = [...this.state.value];
    data = event.target.value;
    this.setState({ value: data });
    console.log(data);

  };

  render() {
    const width = window.innerWidth;
    const width40p = width * (40 / 100) + "px";
    const width100p = width + "px";
    return (

      <Fragment>
        {this.state.basicNotify}
        <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
          <AppBar className="app-header" color="secondary" position="fixed">
            <Toolbar className="w-100">
              <Grid container>
                <Grid item xs={12} lg={12} className="d-flex">
                  <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/transportation-management")} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4" className="p-12">
                    Route Master
                                    </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Animated animationIn="slideInRight" animationOut="slideOutLeft">
            <div className="pt-100">

              <Grid container spacing={4} className="sliderDiv">
                <Grid item xs={12} md={8} lg={3}>
                  <Card className="card-box ml-4 mb-4">
                    <div className="text-center">
                      <div className="pt-1">
                        <List className="py-2">
                        
                          <ListItem button className={this.state.actionType == "student_route" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "student_route", showStatus: 'all' }); }}>
                            <span>Student - Route</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "bus_route" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "bus_route", showStatus: 'all' }); }}>
                            <span>Bus - Route</span>
                          </ListItem>
                        </List>
                      </div>
                    </div>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                
        
                       {/* bus route section */}
                    {this.state.actionType == "bus_route" && <div>
                    <Grid container justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Route And Vehicle ID
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    {this.state.roomholders.map((element, index) => (

                                                        <Grid container spacing={4}>
                                                            {/* <Grid item xs={12} sm={10} lg={1} align="center">
                                                                <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                    {index + 1}
                                                                </FormControl>
                                                            </Grid> */}
                                                          



                                                            <Grid container spacing={4}>
                                                            <Grid item xs={12} md={1} lg={1}></Grid>
                                              <Grid item xs={12} md={4} lg={4} className="autocompleteDiv" >
                                              <AutocompleteMaterial
                                                // multiple
                                                id="tags-outlined"
                                                options={this.state.RouteMaster}
                                                value={this.state.selectedStaffRoute}
                                                onChange={this.searchStaffRoute} 
                                                getOptionLabel={(option) => option.route_name}
                                                // filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="filter Route"
                                                    placeholder="Search Route Name"
                                                />
                                                )}
                                            />
                                              </Grid>
                                              <Grid item xs={12} md={4} lg={4} className="autocompleteDiv" >
                                              <AutocompleteMaterial
                                                // multiple
                                                id="tags-outlined"
                                                options={this.state.VehicleMaster}
                                                value={this.state.selectedStaffVehicle}
                                                onChange={this.searchStaffVehicle} 
                                                getOptionLabel={(option) => option.vehicle_no}
                                                // filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="filter Vehicle"
                                                    placeholder="Search Vehicle No"
                                                />
                                                )}
                                            />
                                              </Grid>

                                              
                                            </Grid> 
                                                            
                                                        </Grid>
                                                    ))}

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertBlock()}>Submit</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        </Grid>

           


<Grid container spacing={4} justify="center">
  <Grid item xs={12} md={12} lg={11}>
    <Card className="card-box  mb-4 p-3 customNoData">
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <div className="card-header pl-0">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
              Bus Route Mapping List
        </h4>
            </div>
          </div>
          <ReactTable
            data={this.state.StaffOverview.map((original, key) => {
              return ({
                slno: key + 1,
                id: original.id,
                vehicle_no: original.vehicle_no,
                route_no: original.route_no,
                route_name: original.route_name,
                // trip_no: original.trip_no,
                editable: original.editable,
                // contact_no: original.contact_no,
               
                actions: (
                  // we've added some custom button actions
                  <div>


                    { /* use this button to add a like kind of action */}

                    <Tooltip id="tooltip-top" title="Edit" placement="top" >
                      {original.editable ? <Button
                        className="m-2"
                        // simple
                        onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id,original.id_route,original.id_trip, key); }}
                        color="secondary"
                        className="edit"
                      >
                        <CheckCircleOutline />
                      </Button> : <Button
                        className="m-2"
                        // simple
                        onClick={() => { this.setState({ selectedHeading: original.name }); this.rowEdit(original.editable, key); }}
                        color="secondary"
                        className="edit"
                      >
                        <EditIcon />
                      </Button>}
                    </Tooltip>

                    {/* use this button to remove the data row */}

                    {/* <Tooltip id="tooltip-top" title={original.status == "1" ? "Deactivate" : "Activate"} placement="top">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={original.status == "1" ? true : false}
                            onChange={() => this.handleDeactiveStaffOverview(original.id, original.status)}
                            value="checkedA"
                          />
                        }

                        label="" />
                    </Tooltip> */}
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
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search S No"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Route No",
                accessor: "route_no",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Route No"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              // {
              //   Header: "Route Name",
              //   accessor: "route_name",
              //   className: "center",
              //   Filter: ({ filter, onChange }) => (
              //     <TextField
              //       inputProps={{
              //         autoComplete: 'off'
              //       }}
              //       id="document-type"
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Route Name"
              //       type="text"
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Route Name",
                accessor: "route_name",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Route Name"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              // {
              //   Header: "Trip No",
              //   accessor: "trip_no",
              //   className: "center",
              //   Filter: ({ filter, onChange }) => (
              //     <TextField
              //       inputProps={{
              //         autoComplete: 'off'
              //       }}
              //       id="document-type"
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Trip No"
              //       type="text"
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Bus No",
                accessor: "vehicle_no",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Bus No"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                ),
                Cell: this.renderEditable
              },
              
              {
                Header: "Actions",
                accessor: "actions",
                className: "center",
                sortable: false,
                filterable: false,
              }
            ]}
            defaultFilterMethod={filterCaseInsensitive}
            defaultPageSize={10}
            showPaginationTop={false}
            showPaginationBottom={false}
            className="-striped -highlight"
          />
        </Grid>
      </Grid>

      {/* <Grid container className="mt-2">
        <Grid item xs={12} sm={12} md={12} className="text-right">
          <Button className="m-2" variant="contained" color="secondary" onClick={() => this.handleClass()}>Export</Button>
        </Grid>
      </Grid> */}
    </Card>

  </Grid>
</Grid>
</div>}

                            {/* student route */}
 
                         {this.state.actionType == "student_route" && <div>
                                        <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.StaffToVehicle.map((element, key) => (
                                            <Grid item xs={12} sm={12} lg={12}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                       
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.route_no}</h5>
                                                                    <div><small>Route No</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.route_name}</h5>
                                                                    <div><small>Route Name</small></div>
                                                                </Grid>
                                                                {/* <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.trip_no}</h5>
                                                                    <div><small>Trip No</small></div>
                                                                </Grid> */}
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.upward_time}</h5>
                                                                    <div><small>Upward Time</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.downward_time}</h5>
                                                                    <div><small>Downward Time</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.vehicle_no}</h5>
                                                                    <div><small>Bus No</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.students}</h5>
                                                                    <div><small>No of students</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                    <h5>{element.revenue}</h5>
                                                                    <div><small>Total Revenue</small></div>
                                                                </Grid>
                                                            
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">  
                                                                    {/* <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/student-route/"+element.id_route+"/"+element.trip_no)}>Go</Button> */}
                                                                    <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/student-route/"+element.id)}>Go</Button>
                                                               
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                          ))}
                                        </Grid>
                                   
                                    </div>}

                                   
                                





                  {/* End sections   */}
                </Grid>

              </Grid>

            </div>
          </Animated>
        </Dialog>

      </Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToPros)(FleetManagement);
