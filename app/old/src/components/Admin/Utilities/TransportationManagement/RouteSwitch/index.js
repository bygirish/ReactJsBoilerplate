import React, { Fragment } from 'react';
import { Dialog, Grid,MenuItem, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
import  AutocompleteMaterial from '@material-ui/lab/Autocomplete';
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
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import isThisISOWeek from 'date-fns/isThisISOWeek';

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

class RoomFeeManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: 'all',
            dialogOpen: true,
            actionType: 'room_structure',
            loading: false,
            selectedBlockId: '',
            TabValue: 0,
            checkAll: false,
            blocksList: [{ route_no: '', route_name: '', starting_point: '', ending_point: '', vehicle_no: '',status:'' }],
            checked: [],
            holidays: [{ id: 1, name: 'test' }],
            startdate: new Date(),
            enddate: new Date(),
            confirmPanel: false,
            activePanelType: true,
            selectedTab: '',
            selectedSubTab: '',
            error: '',
            activeSidebarTab: "room_structure",
            alert: null,
            roomholders: [{ route_no: '', route_name: '', starting_point: '', ending_point: '' }],
            RouteStops:[{ stop_name: '', upward_time: '', downward_time: '',distance_from_school:'',total_fee:'' }],
            loading: true,
            selectedBoard: '',
            basicNotify: false,
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
            StaggeredInstallment:'',
            EqualInstallment:'',
            navPanel:false,
            RouteDetails:[],
            showChange:0,
            RoleMaster: [],
            staffArr:[{id_stop:'',students:''}],
            id_route:'',
            id_trip:'',
            id_stop:'',
            students:'',
            navPanelStatus:false,
            RouteChange:[{stop_name:'',UID:'',old_stop_name:'',old_route_name:'',new_route_name:'',new_stop_name:'',new_bus_number:'',id_route:'',id_trip:'',id:''}],
            selectedStaff:'',
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
        new Service().apiCall('TransportationRouteMasters/deleteRouteMaster', postData).then(response => {
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
                this.getBlocksData();
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
        let headingStatus = "Route Change!";
        let data = this.state.staffArr;
        // let id_route = data[0].id_route;
        // let id_trip = data[0].id_trip;
        let stopDetails = [{id_stop:this.state.id_stop,students:this.state.students}];
        
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            
            token: "abc",
            id_user: this.props.data.UID,
            id_route:this.state.id_route,
            id_trip:this.state.id_trip,
            stopDetails:stopDetails
        };
        console.log(postData)
        new Service().apiCall('TransportationRouteMasters/insertStudentNewRoute', postData).then(response => {
            console.log(response)
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
                this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false, roomholders: [{ route_no: '', route_name: '', starting_point: '', ending_point: '' }] });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }
    insertRouteChange = () => {
        let headingStatus = "Route Change!";
        let data = this.state.RouteChange;
        let id_route = data[0].id_route;
        let id_trip = data[0].id_trip;
        let id_stop = data[0].id;
        let UID = data[0].UID;
        // let stopDetails = [{id_stop:this.state.id_stop,students:this.state.students}];
        
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            
            token: "abc",
            id_user: this.props.data.UID,
            id_route:id_route,
            id_trip:id_trip,
            UID:UID,
            
        };
        console.log(postData)
        new Service().apiCall('TransportationRouteMasters/UpdateRouteChange', postData).then(response => {
            console.log(response)
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
                this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false, RouteChange:[{stop_name:'',UID:'',old_stop_name:'',old_route_name:'',new_route_name:'',new_stop_name:'',new_bus_number:'',id_route:'',id_trip:'',id:''}],
                });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    getStudentDetails = (id,id_board,id_academicyear) => {
        const postData = {
          id_organization:this.state.selectedOrganizationId,
          id_institute:this.state.selectedInstitutionId,
          token:"abc",
          id_user: this.props.data.UID,
          standard_id:id?id:'',
          id_board:id_board ? id_board : this.state.selectedBoard,
          id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('students/getData',postData).then(response => {
          //console.log(response);
          if (response.status==200 && response.data!='') {
            const newArr = response.data.map(v => ({...v, editable: false}));
            if(this.state.showStatus == 'all'){
                this.setState({studentData:newArr,studentSuggestions:newArr});
            }
            else{
               var newArray = newArr.filter(x => x.status == this.state.showStatus);
               this.setState({studentData:newArray,studentSuggestions:newArray});
            }
          }else{
            this.setState({studentData:[]});
          }
        }).catch(error => {
          console.log(error);
        });
      }


    updateHeading = (id, index) => {
        let data = this.state.blocksList;
        let heading = data[index].block_name;
        let floor = data[index].no_of_floors;
        let fee = data[index].fee;
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            id: id,
            block_name: heading,
            no_of_floors: floor,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('HostelBlocks/updateBlock', postData).then(response => {
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
                this.getBlocksData();
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
        let object = { route_no: '', route_name: '', starting_point: '', ending_point: '' };
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
            type: type,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
        };
        new Service().apiCall('TransportationRouteMasters/getStudentRouteChangeDetails', postData).then(response => {
            console.log(response)
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
        // const split = window.location.href.split("/");
        
        // const id_route= split[split.length - 2];
        const postData = {
        //   id_route:id_route,
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
    
          id_board: this.state.selectedBoard,
          id_academicyear: this.state.selectedAcademicYear,
        };
        // console.log(postData);
        new Service().apiCall('TransportationRouteMasters/getRouteStopDetails', postData).then(response => {
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
    getStudentOldAndNewRouteDetails = (UID, type) => {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            type: type,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            UID:UID
        };
        console.log(postData)
        new Service().apiCall('TransportationRouteMasters/getStudentOldAndNewRouteDetails', postData).then(response => {
            console.log(response)
            if (response.status == 200 && response.data != '') {
                if(response.data.allottedroute){
                const data = response.data.allottedroute.map((data) => {
                    return { ...data, checked: false, editable: false, gross_rent: 0 };
                });
                this.setState({ RouteDetails: data });
            }else {
                const data = response.data.allottedhistory.map((data) => {
                    return { ...data, checked: false, editable: false, gross_rent: 0 };
                });
            

                this.setState({ RouteDetails: data });
            }
            } else {
                this.setState({ RouteDetails: [] });
            }
            console.log(this.state.RouteDetails)
        }).catch(error => {
            console.log(error);
        });
    }
    handleStudentSearch = (val) => {
        //console.log(val);
        // const lHostelData = this.state.hostelData;
        // let lStudentFound = false;
        // let lStudentMatchData = null;
        // lHostelData.forEach((element,index) => {
        //     if(element.UID == val.UID){
        //       console.log("User Found");
        //       console.log(element.UID);
        //       console.log(element);
        //       
        //     }
        // });
        if(val == ""){
          this.setState({
            selectedStudent:"",
            selectedStudentSection:"",
            studentInfo:""
        });
        }
        else{
            console.log(val);
          this.getStudentOldAndNewRouteDetails(val.UID);
          this.setState({
            selectedStudent:val.UID,
            selectedStudentSection:val.standard,
            studentInfo:val
        });
        this.setState({
            navPanel:true,
        })
        }
      
       
    
        //console.log(this.state.selectedStudentSection);
      }


   

    rowEdit = (estatus, index) => {

        let blocks = this.state.blocksList;
        if (estatus == true) {
            blocks[index].editable = false;
        }
        else {
            blocks[index].editable = true;
        }
        this.setState({ blocks });
    }

    handleInputChange = (cellInfo, event) => {
        let data = [...this.state.blocksList];
        data[cellInfo.index][cellInfo.column.id] = event.target.value;
        this.setState({ data });
    };

    handleChangeData = (index, name, value) => {
        let data = this.state.roomholders;
        data[index][name] = value;
        this.setState({ data });
    };
    setChange = (val) =>{
        // if(this.showChange==0){
        this.setState({showChange:1})
        // }else{
        //     this.setState({showChange:0})   
        // }
        console.log(this.state.showChange)
      }

    renderEditable = (cellInfo) => {

        const cellValue = this.state.blocksList[cellInfo.index][cellInfo.column.id];
        if (cellInfo.original.editable) {
            return (
                <FormControl >
                    <TextField
                        inputProps={{
                            autoComplete: 'off'
                        }}
                        id="document-type"
                        value={cellValue}
                        placeholder={"Block Name"}
                        type="text"
                        onChange={event => this.handleInputChange(cellInfo, event)}
                    />
                </FormControl>
            );

        }
        else {
            return cellValue;
        }

    };
    filterValue=(value)=>{
        let dataRoute=this.state.RoleMaster;
       return dataRoute.filter(item => {
            return item.id == value
          })
          
    }
    filterValueState=(value)=>{
        let dataRoute=this.state.blocksList;
       return dataRoute.filter(item => {
            return item.id == value
          })
          
    }
    handleClick=(value,id)=>{
       console.log(value)
       
       let result=this.filterValueState(id);
       let data=this.state.RouteChange;
       result.map((element,key)=>{
        // RouteChange:[{stop_name:'',UID:'',old_stop_name:'',old_route_name:'',new_route_name:'',new_stop_name:''
        // ,new_bus_number:'',id_route:'',id_trip:'',id:''}],
       
        data[0]['stop_name']=  element.stop_name;
        data[0]['old_stop_name']=  element.old_stop_name;
        data[0]['old_route_name']=  element.old_route_name;
        data[0]['new_route_name']=  element.new_route_name;
        data[0]['new_stop_name']=  element.new_stop_name;
        data[0]['new_bus_number']=  element.new_bus_number;
        data[0]['id_route']=  element.id_route;
        data[0]['id_trip']=  element.id_trip;
        data[0]['id']=  element.id;
        data[0]['UID']=  element.UID;
        
            
           });
           console.log(result[0])


       this.setState({
        
        RouteChange:data,
       
    })
    this.setState({
        navPanelStatus:true,
    })
    console.log(this.state.RouteChange);
    

    }
    handleChangeDataRoute = (index, name, value) => {
        
        let data = this.state.staffArr;
        
        
        data[index][name] = value;
        this.setState({ data });
        
       let result=this.filterValue(value);
   

    
       if(result){
       this.setState({id_route:result[0]['id_route'],id_trip:result[0]['trip_no'],id_stop:result[0]['id'],students:this.state.selectedStudent});
   
       }
    }
    searchStaff = (event,values) => {
        
        
        
        if(values){
            this.setState({id_route:values['id_route'],id_trip:values['trip_no'],id_stop:values['id'],students:this.state.selectedStudent});
         
            }
        
        
       
        
        this.setState({selectedStaff:values})
        // this.setState({selectedStaff:values, staffArr:data})
        
    
      
    }


    componentDidMount() {
        this.getBlocksData();
        this.getStudentDetails();
        this.getRoleMaster();
    }

    render() {
        const width = window.innerWidth;
        const width40p = width * (40 / 100) + "px";
        const width100p = width + "px";
        const level1 =  width * (60/100)+"px" ;
const level2 = this.state.menuLevel == 2 ? width * (40/100)+"px" : "";
const level3 = this.state.menuLevel == 3 ? width * (60/100)+"px" : "";
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
                                        Route Switch
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                        <div className="pt-100">

                            <Grid container spacing={4} className="sliderDiv" justify="center">
                              
                                <Grid item xs={12} md={8} lg={9}>
                                    {/* Room Structure section */}
                                    {this.state.actionType == "room_structure" && <div>
                                    <Grid container spacing={4} justify="center" className = "mb-5">
                                          <Grid item xs={12} md={12} lg={8}>
                                          <Autocomplete
                                              type="student"
                                              showValue={true}
                                              SearchPlaceholderText="Search by Name / Phone Number / UID"
                                              suggestions={this.state.studentSuggestions}
                                              onSelected={this.handleStudentSearch}
                                             
                                              {...this.props}

                                          /> 
                                          </Grid>
                                      </Grid>

                                      <Drawer

anchor="right"
open={this.state.navPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({navPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:level1}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({navPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Route Change
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={2}>
        <Grid xs={12} sm={6} md={12} lg={12}>
          
        <Grid container spacing={2}>
          
        <Grid xs={12} sm={12} md={12} lg={12}>
          
              {/* {this.props.data.organization[this.state.selectedOrgIndex].institutes.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes.map((instdata ,index)=>  */}
              {/* <Card className= "activeCard backgroundTransparent card-box  m-3 p-3">
                   <div className="font-weight-400" onClick={() => {}}>Aks</div>
              </Card> */}
              {/* )} */}
              <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.RouteDetails.map((element, key) => (
                                            <Grid item xs={12} sm={12} lg={10}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                        {/* <Grid item xs={12} sm={12} lg={3}>
                                                            <h5>{key + 1}</h5>
                                                            <div><small>{element.block_name}</small></div>
                                                        </Grid> */}
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.UID}</h5>
                                                                    <div><small>Student UID</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.route_name}</h5>
                                                                    <div><small>Route Name</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.stop_name}</h5>
                                                                    <div><small>stop_name</small></div>
                                                                </Grid>
                                                                
                                                                <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.vehicle}</h5>
                                                                    <div><small>Bus No</small></div>
                                                                </Grid>
                                                                
                                                            
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">  
                                                                    <Button variant="contained" color="secondary" onClick={() => {this.setChange(1)}}>Change</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                          ))}

                                        </Grid>
                                   
            
        </Grid>  
       
          {this.state.showChange == 1 &&
            <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={0} justify="center" className="sliderDiv">
                    {/* {this.state.RouteDetails.map((element, key) => ( */}
                      <Grid item xs={12} sm={12} lg={10} className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                         
                              {/* <Grid container spacing={2} justify="center">
                                  <Grid item xs={12} sm={12} lg={12}> */}
                                  {this.state.staffArr.map((original, key) => (  
                                    <Grid container spacing={2} justify="center">             
                                               
                                        <Grid item xs={12} md={12} lg={12}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend" className="pt-2">Search Stop Name:</FormLabel>
                                            </FormControl>
                                        </Grid>
                                        
                                        <Grid item xs={12} md={9} lg={9} className="autocompleteDiv">
                                            <FormControl fullWidth>
                                               
                                                <AutocompleteMaterial
                                                // multiple
                                                id="tags-outlined"
                                                options={this.state.RoleMaster}
                                                // value={cellValue}
                                                value={this.state.selectedStaff}
                                                onChange={this.searchStaff} 
                                                // onChange={(event)=>this.searchStaff(key,"students", event.target.value)
                                                //             }
                                                getOptionLabel={(option) => (option.stop_name)}
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Stop Name"
                                                    placeholder="Search Stop Name"
                                                />
                                                )}
                                            />
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={12} sm={6} md={2} lg={2} className="text-right m-3">
        <Button onClick={() => {this.insertBlock(); this.setState({navPanel:false})}}  color="secondary" variant="contained">Go</Button>
        </Grid>
                                   
                                        </Grid>
                                    ))}
                                  
                                  {/* </Grid>
                              </Grid> */}
                          
                      </Grid>
                    {/* ))} */}
                </Grid>
                {/* <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={12} lg={12} className="text-right m-3">
        <Button onClick={() => {this.insertBlock(); this.setState({navPanel:false})}}  color="secondary" variant="contained">Go</Button>
        </Grid>
        </Grid>        */}

</Grid>
 

            }
            {this.state.RouteDetails == [] || this.state.RouteDetails=='' &&
              <h3>Please set the route before route change..</h3>
            } 
        </Grid>
        </Grid>
        </Grid>

       
                  
</div>
  </PerfectScrollbar>
</Box>
</Drawer>      

<Drawer

anchor="right"
open={this.state.navPanelStatus}
variant="temporary"
elevation={4}
onClose={()=> this.setState({navPanelStatus:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:level1}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({navPanelStatus:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Route Change
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={2}>
        <Grid xs={12} sm={6} md={12} lg={12}>
          
        <Grid container spacing={2}>
          
        <Grid xs={12} sm={12} md={12} lg={12}>
          
              {/* {this.props.data.organization[this.state.selectedOrgIndex].institutes.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes.map((instdata ,index)=>  */}
              {/* <Card className= "activeCard backgroundTransparent card-box  m-3 p-3">
                   <div className="font-weight-400" onClick={() => {}}>Aks</div>
              </Card> */}
              {/* )} */}
              <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.RouteChange.map((element, key) => (
                                            <Grid item xs={12} sm={12} lg={10}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                        {/* <Grid item xs={12} sm={12} lg={3}>
                                                            <h5>{key + 1}</h5>
                                                            <div><small>{element.block_name}</small></div>
                                                        </Grid> */}
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.UID}</h5>
                                                                    <div><small>Student UID</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.old_route_name}</h5>
                                                                    <div><small>Old Route Name</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.new_route_name}</h5>
                                                                    <div><small>New Route Name</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.new_bus_number}</h5>
                                                                    <div><small>Bus Number</small></div>
                                                                </Grid>
                                                                
                                                               
                                                                
                                                            
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">  
                                                                    <Button variant="contained" color="secondary" onClick={() => {this.insertRouteChange()}}>Allocate</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                          ))}

                                        </Grid>
                                   
            
        </Grid>  
       {/* {(this.state.menuLevel == 2 || this.state.menuLevel == 3) && <Grid xs={12} sm={Year1+Year2+Year3} md={Year1+Year2+Year3} lg={Year1+Year2+Year3}>
          
          {this.props.data.academicyear.length > 1 && this.props.data.academicyear.map((acddata,index) => 
          <Card className={this.state.selectedAcademicYear == acddata.id ? "activeCard backgroundTransparent card-box  m-3 p-3": "InactiveCard backgroundTransparent card-box  m-3 p-3"} >
               <div className="font-weight-400" onClick={() => {this.setLevel(3);this.setLevel(3);this.setYear(acddata.id);this.setYearIndex(index)}}>{acddata.label}</div>
          </Card>
          )}
        
          </Grid>  } */}

          {/* {this.state.menuLevel == 3 && <Grid xs={12} sm={Board1+Board2+Board3} md={Board1+Board2+Board3} lg={Board1+Board2+Board3}>
          
          {this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards.map((boarddata,index) => 
          <Card className={this.state.selectedBoard == boarddata.id_board ? "activeCard backgroundTransparent card-box  m-3 p-3": "InactiveCard backgroundTransparent card-box  m-3 p-3"}>
               <div className="font-weight-400" onClick={() => {this.setLevel(3);this.setBoard(boarddata.id_board);this.setBoardIndex(index)}}>{boarddata.board_name}</div>
          </Card>
          )}   
        
          </Grid>  } */}
        
        </Grid>
        </Grid>
        </Grid>

       
                  
</div>
  </PerfectScrollbar>
</Box>
</Drawer>      

                                        <Grid container justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Route change requests
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <ReactTable
                                                                data={this.state.blocksList.map((original, key) => {
                                                                    return ({
                                                                        slno: key + 1,
                                                                        id: original.id,
                                                                        student_name: original.student_name,
                                                                        contact_number: original.contact_number,
                                                                        old_route_name: original.old_route_name,
                                                                        new_route_name: original.new_route_name,
                                                                        new_stop_name: original.new_stop_name,
                                                                        new_bus_number: original.new_bus_number,

                                                                        editable: original.editable,
                                                                        checked: original.checked,
                                                                        application_status: original.application_status,
                                                                        pendingbtn:(<Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => { this.handleClick( original.application_status,original.id );  }}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                        style={ original.application_status=='pending'?
                                                                                            { color: 'rgb(255,140,0)', cursor: 'pointer' }:{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }
                                                                                        }
                                                                                    >{original.application_status}</Button>),
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                                { /* use this button to add a like kind of action */}

                                                                                <Tooltip id="tooltip-top" title="Next" placement="top" >
                                                                                    <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => this.props.history.push("/admin/route-map-stops/" + original.id)}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                    >
                                                                                        <NextIcon />
                                                                                    </Button>
                                                                                </Tooltip>

                                                                                { /* use this button to add a like kind of action */}

                                                                                {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                    {original.editable ? <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id, key); }}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                    >
                                                                                        <CheckCircleOutline />
                                                                                    </Button> : <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => { this.setState({ selectedHeading: original.name }); this.rowEdit(original.editable, key); }}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                    >
                                                                                        <EditIcon />
                                                                                    </Button>}
                                                                                </Tooltip> */}

                                                                                {/* use this button to remove the data row */}

                                                                                <Tooltip id="tooltip-top" title={original.status == "1" ? "Deactivate" : "Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Switch
                                                                                                checked={original.status == "1" ? true : false}
                                                                                                onChange={() => this.handleDeactive(original.id, original.status)}
                                                                                                value="checkedA"
                                                                                            />
                                                                                        }

                                                                                        label="" />
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
                                                                        Header: "Student Name",
                                                                        accessor: "student_name",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Contact No",
                                                                        accessor: "contact_number",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Old Route Name",
                                                                        accessor: "old_route_name",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "New Route Name",
                                                                        accessor: "new_route_name",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Stop Name",
                                                                        accessor: "new_stop_name",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Bus No",
                                                                        accessor: "new_bus_number",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Status",
                                                                        accessor: "pendingbtn",
                                                                        className: "center",
                                                                       // onClick={()=>{handleClick()}},
                                                                        Filter: ({ filter, onChange }) => (
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off'
                                                                                }}
                                                                                id="document-type"
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                ]}
                                                                defaultFilterMethod={filterCaseInsensitive}
                                                                defaultPageSize={10}
                                                                showPaginationTop
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" onClick={() => {this.handleClass()}}>Export</Button>
                            </Grid>
                          </Grid>


                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </div>}

                                     
                                   
                                </Grid>

                            </Grid>

                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(RoomFeeManagement);
