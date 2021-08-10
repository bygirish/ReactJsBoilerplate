import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
import Config from '../../../../config';
import moment from "moment";

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

class IndividualHostelliteManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatus:'all',
            changeArticle:'d-none',
            dialogOpen:true,            
            actionType:'leave_application',
            loading:false,
            TabValue:0,
            checkAll:false,     
            leaveApplication:[],
            AccessLog:[],
            studentsData:[],
            activeSidebarTab:"leave_application",
            VisitorRequest:[],
            GuestRequest:[],
            RoomChange:[{id:1, name:'test', block_name:'A Block', room_no:4, contact:'7896541235', status:'pending'}, {id:2, name:'test2', block_name:'A Block', room_no:4, contact:'7896541235', status:'re-allocated'}],
            hostelstudentSuggestions:[],
            suggestions: [],
            selectedOrganizationId:this.props.data.selectedOrganizationId,
            selectedInstitutionId:this.props.data.selectedInstitutionId,
            selectedBoard:this.props.data.selectedBoardId,
            selectedAcademicYear:this.props.data.selectedAcademicId,    
            lsearchname:'',
            searchtableData:[],
            selectedStudent:'',
            selectedHostelStudent:'',
            basicNotify:false,
            selectedOrganizationId:this.props.data.selectedOrganizationId,
            selectedInstitutionId:this.props.data.selectedInstitutionId,
            selectedBoard:this.props.data.selectedBoardId,
            selectedAcademicYear:this.props.data.selectedAcademicId, 
        };
    } 

    getHostelStudentDetails = (id, id_board, id_academicyear) => {
        const postData = {
            id_organization:this.state.selectedOrganizationId,
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            standard_id:id?id:'',
            id_board:id_board ? id_board : this.state.selectedBoard,
            id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('students/getHostelStudentData',postData).then(response => {
            //console.log(response);
            if (response.status==200 && response.data!='') {
                const newArr = response.data.map(v => ({...v, editable: false}));
                if(this.state.showStatus == 'all'){
                    this.setState({hostelstudentData:newArr,hostelstudentSuggestions:newArr});
                }
                else{
                    var newArray = newArr.filter(x => x.status == this.state.showStatus);
                    this.setState({hostelstudentData:newArray,hostelstudentSuggestions:newArray});
                }
            }else{
                this.setState({hostelstudentData:[]});
            }
        }).catch(error => {
            console.log(error);
        });
    } 

    handleHostelStudentSearch = (val) => {
        //console.log(val);
        if(val == ''){
            this.setState({
                selectedHostelStudent : '',
                selectedHostelStudentSection : '', 
                studentInfo : ''
            });     
        }else{
            this.setState({
                selectedHostelStudent : val.UID,
                selectedHostelStudentSection : val.standard, 
                studentInfo : val
            });        
            this.getGuestDetails(val.UID);
            this.getVisitorsDetails(val.UID);
            this.getAccessLogDetails(val.UID);
            this.getLeaveApplicationDetails(val.UID);
            //console.log(this.state.selectedHostelStudent);
        }
    } 
    
    //GET LEAVE APPLICATION DETAIL
    getLeaveApplicationDetails = (student, type) => {

        const postData = {
            id_organization:this.state.selectedOrganizationId,
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            type:type,
            student:student,
            id_board:this.state.selectedBoard,
            id_academicyear:this.state.selectedAcademicYear,
        };
        console.log(postData);
        new Service().apiCall('HostelDailyActivities/getLeaveRequests',postData).then(response => {
            console.log(response);
            if (response.status==200 && response.data!='') {
                const studentsList = response.data.map((data) => {
                    return {...data, checked: false};
                });
                this.setState({ leaveApplication: studentsList }); 
            }else{
                this.setState({  leaveApplication: []});
            }
        }).catch(error => {
          console.log(error);
        });
    }

    //GET ACCESS LOG DETAIL
    getAccessLogDetails = (student, type) => {

        const postData = {
            id_organization:this.state.selectedOrganizationId,
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            type:type,
            student:student,
            id_board:this.state.selectedBoard,
            id_academicyear:this.state.selectedAcademicYear,
        };
      
        new Service().apiCall('HostelDailyActivities/getAccessLogs',postData).then(response => {
            //console.log(response);
            if (response.status==200 && response.data!='') {
                const accesslogList = response.data.map((data) => {
                    return {...data, checked: false};
                });
                this.setState({ AccessLog: accesslogList }); 
            }else{
                this.setState({  AccessLog: []});
            }
        }).catch(error => {
            console.log(error);
        });
    }

    //GET VISITORS DETAIL
    getVisitorsDetails = (student, type) => {

        const postData = {
            id_organization:this.state.selectedOrganizationId, 
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            type:type,
            student:student,
            id_board:this.state.selectedBoard,
            id_academicyear:this.state.selectedAcademicYear,
        };
      
        new Service().apiCall('HostelDailyActivities/getVisitorRequests',postData).then(response => {
            //console.log(response);
            
            if (response.status==200 && response.data!='') {
                //console.log(response.data)
                const newArr = response.data.map(v => ({...v, editable: false}));
                if(this.state.visitoractionType == 'all'){
                    this.setState({VisitorRequest:newArr});
                }else{
                    var newArray = newArr.filter(x => x.visitor_status == this.state.visitoractionType);
                    this.setState({VisitorRequest:newArray});
                }
            }else{
                this.setState({VisitorRequest:[]});
            }
            
        }).catch(error => {
            console.log(error);
        });
    } 
    
    //GET GUESTS DETAIL
    getGuestDetails = (student, type) => {

        const postData = {
            id_organization:this.state.selectedOrganizationId,
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            type:type,
            student:student,
            id_board:this.state.selectedBoard,
            id_academicyear:this.state.selectedAcademicYear,
        };
      
        new Service().apiCall('HostelDailyActivities/getGuestRequests',postData).then(response => {
            //console.log(response);
            
            if (response.status==200 && response.data!='') {
                //console.log(response.data)
                const newArr = response.data.map(v => ({...v, editable: false}));
                if(this.state.guestactionType == 'all'){
                    this.setState({GuestRequest:newArr});
                }else{
                    var newArray = newArr.filter(x => x.guest_status == this.state.guestactionType);
                    this.setState({GuestRequest:newArray});
                }
            }else{
                this.setState({GuestRequest:[]});
            }
        }).catch(error => {
            console.log(error);
        });
    } 

    componentDidMount() { 
        this.getHostelStudentDetails('', this.props.data.selectedBoard, this.state.selectedAcademicYear);  
    }

    render(){
        const width = window.innerWidth;
        const width40p =  width * (40/100)+"px";
        const width100p =  width +"px";
        return (
            <Fragment>
                {this.state.basicNotify}
                <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
                    <AppBar className="app-header" color="secondary" position="fixed">
                        <Toolbar className="w-100">
                            <Grid container>
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/hostel-management")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                    Individual Hostelites
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 
                            <Grid container spacing={4} className="sliderDiv">
                                <Grid item xs={12} md={8} lg={12}> 

                                    {/* Room Rent section */}                                    
                                    <Grid container spacing={4} justify="center" className="mb-2">
                                        <Grid item xs={12} md={8} lg={3}></Grid>
                                        <Grid item xs={12} sm={12} lg={9}>
                                            <Grid container spacing={4} justify="center">
                                                <Grid item xs={12} sm={12} lg={9}>
                                                    <Autocomplete
                                                        type="student"
                                                        showValue={true}
                                                        SearchPlaceholderText="Enter name and select from suggestions"
                                                        suggestions={this.state.hostelstudentSuggestions}
                                                        onSelected={this.handleHostelStudentSearch}
                                                        {...this.props}
                                                    /> 
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>    

                                {this.state.selectedHostelStudent!='' && 

                                    <Grid item xs={12} md={12} lg={12}>
                                        
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={8} lg={3}>
                                                <Card className="card-box ml-4 mb-4">
                                                    <div className="text-center">
                                                        <div className="pt-1">
                                                            <List className="py-2">
                                                            
                                                                <ListItem button className={this.state.actionType == "leave_application" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"leave_application",showStatus:'all'});}}>
                                                                    <span>Leave Application</span>
                                                                    
                                                                </ListItem>

                                                                <Divider />
                                                                <ListItem button className={this.state.actionType == "access_logs" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"access_logs",showStatus:'all'});}}>
                                                                    <span>Access Logs</span>
                                                                </ListItem>

                                                                <Divider />
                                                                <ListItem button className={this.state.actionType == "visitor_request" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"visitor_request",showStatus:'all'});}}>
                                                                    <span>Visitor Request</span>
                                                                </ListItem>

                                                                <Divider />
                                                                <ListItem button className={this.state.actionType == "guest_request" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"guest_request",showStatus:'all'});}}>
                                                                    <span>Guest Request</span>
                                                                </ListItem>

                                                                <Divider />
                                                                <ListItem button className={this.state.actionType == "room_change" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"room_change",showStatus:'all'});}}>
                                                                    <span>Room Details</span>
                                                                </ListItem>

                                                                <Divider />
                                                                <ListItem button className={this.state.actionType == "hostel_fee_detail" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"hostel_fee_detail",showStatus:'all'});}}>
                                                                    <span>Hostel Fee Details</span>
                                                                </ListItem>

                                                            </List>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Grid>  

                                            <Grid item xs={12} md={8} lg={9}>
                                                {/* Leave Application Section */}
                                                {this.state.actionType == "leave_application" && <div>

                                                    <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={11}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold"> 
                                                                                Access Logs
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                        <ReactTable
                                                                            data={this.state.leaveApplication.map((original,key) => { 
                                                                                return ({
                                                                                    slno: key+1,
                                                                                    id:original.id,
                                                                                    name: original.name,
                                                                                    block_name: original.block_name,
                                                                                    room_no: original.room_no,
                                                                                    start_date: original.start_date,
                                                                                    end_date: original.end_date,
                                                                                    no_of_days: original.no_of_days,
                                                                                    status: original.leave_status,
                                                                                    leave_status:(<div>
                                                                                    <Button variant="contained" color="primary" onClick={()=>this.props.history.push("/admin/view-hostel-leave-application/"+original.id)}>
                                                                                    {original.leave_status}
                                                                                    </Button>                                                                         
                                                                                </div>),
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Hostelite's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Block Name",
                                                                                accessor: "block_name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Room No.",
                                                                                accessor: "room_no",
                                                                                className: "center",
                                                                                filterable: false                                                          
                                                                                },
                                                                                {
                                                                                Header: "Start Date",
                                                                                accessor: "start_date",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "End Date",
                                                                                accessor: "end_date",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "No. of Days",
                                                                                accessor: "no_of_days",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Status",
                                                                                accessor: "leave_status",
                                                                                className: "center",
                                                                                filterable: false
                                                                                }
                                                                            ]}
                                                                            defaultFilterMethod={filterCaseInsensitive}
                                                                            defaultPageSize={10}
                                                                            showPaginationTop
                                                                            showPaginationBottom={false}
                                                                            className="-striped -highlight"
                                                                        />
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid container className="mt-2" hidden>
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                </div>} 

                                                {/* Access Logs Section */}
                                                {this.state.actionType == "access_logs" && <div>
                                                    <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={11}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                                Leave Applications
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                        <ReactTable
                                                                            data={this.state.AccessLog.map((original,key) => {
                                                                                return ({
                                                                                    slno: key+1,
                                                                                    id:original.id,
                                                                                    name: original.name,
                                                                                    block: original.block_name,
                                                                                    floor: original.floor_no,
                                                                                    room: original.room_no,
                                                                                    date: original.date,
                                                                                    intime: original.in_time,
                                                                                    outtime: original.out_time
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Student's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Block",
                                                                                accessor: "block",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Floor",
                                                                                accessor: "floor",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Room",
                                                                                accessor: "room",
                                                                                className: "center",
                                                                                filterable: false                                                          
                                                                                },
                                                                                {
                                                                                Header: "Date",
                                                                                accessor: "date",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "In Time",
                                                                                accessor: "intime",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Out Time",
                                                                                accessor: "outtime",
                                                                                className: "center",
                                                                                filterable: false
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

                                                                <Grid container className="mt-2" hidden>
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                </div>} 

                                                {/* Visitor Request Section */}
                                                {this.state.actionType == "visitor_request" && <div>
                                                    <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                            <Grid container spacing={3}>
                                                                                <Grid item xs={12} md={12} lg={5}>
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                                Visitor Request
                                                                                </h4>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={12} lg={7}>
                                                                                <Grid container spacing={4}>
                                                                                    <Grid item xs={12} md={12} lg={11} className="text-right">
                                                                                    <Box>
                                                                                        <ButtonGroup size="small" className="m-2">
                                                                                        <Button  color="secondary" size="small" variant={this.state.visitoractionType == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({visitoractionType:'all'}); this.getVisitorsDetails()}}>
                                                                                            All
                                                                                        </Button>
                                                                                        <Button color="secondary" size="small" variant={this.state.visitoractionType == 'pending' ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({visitoractionType:"pending"}); this.getVisitorsDetails()}}>
                                                                                            Pending
                                                                                        </Button>
                                                                                        <Button color="secondary" size="small" variant={this.state.visitoractionType == 'approved' ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({visitoractionType:"approved"}); this.getVisitorsDetails()}}>
                                                                                            Approved
                                                                                        </Button>
                                                                                        <Button color="secondary" size="small" variant={this.state.visitoractionType == 'rejected' ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({visitoractionType:"rejected"}); this.getVisitorsDetails()}}>
                                                                                            Rejected
                                                                                        </Button>
                                                                                        </ButtonGroup>
                                                                                    </Box>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                                
                                                                            </div>
                                                                        </div>

                                                                        <ReactTable
                                                                            data={this.state.VisitorRequest.map((original,key) => {
                                                                                return ({
                                                                                slno: key+1,
                                                                                id:original.id,
                                                                                name: original.visitor_name,
                                                                                meeting_with: original.name+' .'+'F'+original.floor_no+' .'+'R'+original.room_no, 
                                                                                relation: original.relation,
                                                                                date: original.date,
                                                                                intime: original.in_time,
                                                                                outtime: original.out_time,
                                                                                status: original.visitor_status,
                                                                                leave_status:(<div>
                                                                                    <Button variant="contained" color="primary" onClick={()=>this.props.history.push("/admin/view-visitor-request/"+original.id)}>
                                                                                    {original.visitor_status}
                                                                                    </Button>                                                                          
                                                                                </div>),
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Visitor's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Meeting With",
                                                                                accessor: "meeting_with",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Relation",
                                                                                accessor: "relation",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Date",
                                                                                accessor: "date",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "In Time",
                                                                                accessor: "intime",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Out Time",
                                                                                accessor: "outtime",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Status",
                                                                                accessor: "leave_status",
                                                                                className: "center",
                                                                                filterable: false
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

                                                                <Grid container className="mt-2">
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                </div>}                                     

                                                {/* Guest Request Section */}
                                                {this.state.actionType == "guest_request" && <div>
                                                <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                            <Grid container spacing={3}>
                                                                                <Grid item xs={12} md={12} lg={5}>
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                                Guest Request
                                                                                </h4>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={12} lg={7}>
                                                                                <Grid container spacing={4}>
                                                                                    <Grid item xs={12} md={12} lg={11} className="text-right">
                                                                                    <Box>
                                                                                        <ButtonGroup size="small" className="m-2">
                                                                                        <Button  color="secondary" size="small" variant={this.state.guestactionType == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({guestactionType:'all'}); this.getGuestDetails()}}>
                                                                                            All
                                                                                        </Button>guestactionType
                                                                                        <Button color="secondary" size="small" variant={this.state.guestactionType == 'pending' ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({guestactionType:"pending"}); this.getGuestDetails()}}>
                                                                                            Pending
                                                                                        </Button>
                                                                                        <Button color="secondary" size="small" variant={this.state.guestactionType == 'approved' ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({guestactionType:"approved"}); this.getGuestDetails()}}>
                                                                                            Approved
                                                                                        </Button>
                                                                                        <Button color="secondary" size="small" variant={this.state.guestactionType == 'rejected' ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({guestactionType:"rejected"}); this.getGuestDetails()}}>
                                                                                            Rejected
                                                                                        </Button>
                                                                                        </ButtonGroup>
                                                                                    </Box>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                                
                                                                            </div>
                                                                        </div>

                                                                        <ReactTable
                                                                            data={this.state.GuestRequest.map((original,key) => {

                                                                                return ({
                                                                                    slno: key+1,
                                                                                    id:original.id,
                                                                                    name: original.guest_name,
                                                                                    meeting_with: original.name,
                                                                                    start_date: original.start_date, 
                                                                                    end_date: original.end_date,
                                                                                    no_of_days_staying: original.no_of_days,
                                                                                    status: original.guest_status,
                                                                                    guest_status:(<div>
                                                                                        <Button variant="contained" color="primary" onClick={()=>this.props.history.push("/admin/view-guest-request/"+original.id)}>
                                                                                        {original.guest_status}
                                                                                        </Button>                                                                          
                                                                                    </div>),
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Guest's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Meeting With",
                                                                                accessor: "meeting_with",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Start Date",
                                                                                accessor: "start_date",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "End Date",
                                                                                accessor: "end_date",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "No of Days Staying",
                                                                                accessor: "no_of_days_staying",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Status",
                                                                                accessor: "guest_status",
                                                                                className: "center",
                                                                                filterable: false
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

                                                                <Grid container className="mt-2">
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                    
                                                </div>} 

                                                {/* Room Detail Section */}
                                                {this.state.actionType == "room_change" && <div>

                                                    <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={11}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                                Re-allocation Requests Initiated By Hostelier
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                        <ReactTable
                                                                            data={this.state.RoomChange.map((original,key) => {
                                                                                return ({
                                                                                    slno: key+1,
                                                                                    id:original.id,
                                                                                    name: original.name,
                                                                                    block_name: original.block_name,
                                                                                    room_no: original.room_no,
                                                                                    contact: original.contact,
                                                                                    status: original.status,
                                                                                    leave_status:(<div>
                                                                                    <Button variant="contained" color="primary" onClick={()=>this.props.history.push("/admin/view-reallocation-request/")}>
                                                                                    {original.status}
                                                                                    </Button>                                                                          
                                                                                </div>),
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Student's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Block Name",
                                                                                accessor: "block_name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Room No.",
                                                                                accessor: "room_no",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Contact No.",
                                                                                accessor: "contact",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "Status",
                                                                                accessor: "leave_status",
                                                                                className: "center",
                                                                                filterable: false
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

                                                                <Grid container className="mt-2">
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                </div>} 
                                                
                                                
                                                {this.state.actionType == "hostel_fee_detail" && <div>

                                                    <Grid container spacing={4} justify="center">
                                                        <Grid item xs={12} md={12} lg={11}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-header pl-0">
                                                                            <div className="card-header--title">
                                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                                    Re-allocation Requests Initiated By Hostelier
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                        <ReactTable
                                                                            data={this.state.RoomChange.map((original,key) => {
                                                                                return ({
                                                                                    slno: key+1,
                                                                                    id:original.id,
                                                                                    name: original.name,
                                                                                    block_name: original.block_name,
                                                                                    room_no: original.room_no,
                                                                                    contact: original.contact,
                                                                                    status: original.status,
                                                                                    leave_status:(<div>
                                                                                    <Button variant="contained" color="primary" onClick={()=>this.props.history.push("/admin/view-reallocation-request/")}>
                                                                                    {original.status}
                                                                                    </Button>                                                                          
                                                                                </div>),
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
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Student's Name",
                                                                                accessor: "name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Block Name",
                                                                                accessor: "block_name",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Room No.",
                                                                                accessor: "room_no",
                                                                                className: "center",
                                                                                filterable: false
                                                                                },
                                                                                {
                                                                                Header: "Contact No.",
                                                                                accessor: "contact",
                                                                                className: "center",
                                                                                filterable: false,
                                                                                },
                                                                                {
                                                                                Header: "Status",
                                                                                accessor: "leave_status",
                                                                                className: "center",
                                                                                filterable: false
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

                                                                <Grid container className="mt-2">
                                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                        <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.handleClass()}>Export</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>
                                                </div>}

                                            </Grid>
                            
                                        </Grid>

                                    </Grid>  
                                }

                            </Grid>                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(IndividualHostelliteManagement);
