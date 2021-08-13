import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SendIcon from '@material-ui/icons/Send';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import NextIcon from '@material-ui/icons/NavigateNext';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../../config';
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

class HostelEntryReciptManagement extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      loading:false,
      TabValue:0,
      checkAll:false,
      leaveApplication:[],
      leave_status:'',
      amount:'',
      leave_remarks:'',
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'', 
      concession: 0,
      error: '',
      alert: null, 
      loading:true,
      selectedBoard:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

  //GET LEAVE APPLICATION DETAIL
  getLeaveApplicationDetails = (type) => {

    let applicationID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      id:applicationID
    };

    new Service().apiCall('HostelDailyActivities/getLeaveRequests',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const leaveList = response.data.map((data) => {
          return {...data, checked: false};
      });
      this.setState({ leaveApplication: leaveList }); 
      }
      else{
        this.setState({  leaveApplication: []});
      }
    }).catch(error => {
      alert(error);
    });
  }

  AcceptHostelLeave = () =>{ 
    let headingStatus = "Leave Accepted!";

    let applicationID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let concession = this.state.concession;   
    let amount = this.state.amount;   
    let leave_remarks = this.state.leave_remarks;   

    const postData = {
      id_organization : this.props.data.selectedOrganizationId,
      id_institute : this.props.data.selectedInstitutionId,
      id_board : this.props.data.selectedBoardId,   
      id_academicyear : this.props.data.selectedAcademicId,  
      leaveApplication : this.state.leaveApplication,
      token : "abc",
      concession : concession,
      amount : amount,
      remarks : leave_remarks,
      leave_status : 'approved',
      id : applicationID,
      id_user : this.props.data.UID
    };
    // console.log(postData);
    
    new Service().apiCall('HostelDailyActivities/updateLeaveStatus',postData).then(response => {
      //console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getLeaveApplicationDetails();
        setTimeout(() => {
          this.setState({ basicNotify:false, leaveApplication:[]});
        }, 2000) 
      
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });
  }

  RejectHostelLeave = () =>{ 
    let headingStatus = "Leave Rejected!";

    let applicationID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let concession = this.state.concession;   
    let amount = this.state.amount;   
    let leave_remarks = this.state.leave_remarks;   

    const postData = {
      id_organization : this.props.data.selectedOrganizationId,
      id_institute : this.props.data.selectedInstitutionId,
      id_board : this.props.data.selectedBoardId,   
      id_academicyear : this.props.data.selectedAcademicId,  
      leaveApplication : this.state.leaveApplication,
      token : "abc",
      concession : concession,
      amount : amount,
      remarks : leave_remarks,
      leave_status : 'rejected',
      id : applicationID,
      id_user : this.props.data.UID
    };
    //console.log(postData);
    
    new Service().apiCall('HostelDailyActivities/updateLeaveStatus',postData).then(response => {
      //console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getLeaveApplicationDetails();
        setTimeout(() => {
          this.setState({ basicNotify:false, leaveApplication:[]});
        }, 2000) 
      
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });
  }

 
  componentDidMount() {
    this.getLeaveApplicationDetails();
  }

    render(){
        const width = window.innerWidth;
        const width40p =  width * (40/100)+"px";
        const width100p =  width +"px";
        return (
            <Fragment>
                {this.state.basicNotify} 
                <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
                    {this.state.leaveApplication.map((element, index) => 
                    <>
                    <AppBar className="app-header" color="secondary" position="fixed">
                        <Toolbar className="w-100">
                            <Grid container>
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/daily-activities")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        {element.leave_status == 'pending'?'Leave Request':'Leave Status'}                                    
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} justify="center" className="sliderDiv"> 
                                {element.leave_status == 'pending'?'':
                                    <Grid item xs={12} md={12} lg={9}>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box p-4">

                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={12} className="text-center">
                                                            
                                                            <h5 className="text-capitalize">{element.leave_status}</h5>
                                                            <p><small>By {element.status_by} on {element.status_changed_on}</small></p>
                                                            
                                                        </Grid>
                                                    </Grid>

                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                } 
                                                               

                                <Grid item xs={12} md={12} lg={9}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={11}>
                                            <Card className="card-box mb-1 p-4">

                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <Card className="card-box p-3">
                                                            <Grid container>
                                                                <Grid item xs={12} md={12} lg={12}>
                                                                    <div className="card-body"> 
                                                                    
                                                                        <Grid container spacing={0} justify="center">  
                                                                            <Grid item xs={12} sm={10} md={6}  className="text-center">
                                                                                <h5>Application Date: Jun 29, 2020</h5>                                                                            
                                                                            </Grid>
                                                                        </Grid>
                                                                        
                                                                        <Grid container spacing={0} className="mt-4">
                                                                            <Grid item xs={12} sm={10} md={6}>
                                                                                <p className="mb-1 text-capitalize">Student Name : {element.name}</p>
                                                                                <p className="mb-1 text-capitalize">Father Name : {element.father_name}</p>
                                                                                <p className="mb-1 text-capitalize">Father Contact: : {element.contact_number}</p>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={10} md={6} className="text-right">
                                                                                <p className="mb-1">Block Name : {element.block_name}</p>
                                                                                <p className="mb-1">Floor Name/Room No. : {element.floor_no}/{element.room_no}</p>
                                                                                <p className="mb-1">Bed No. : {element.bed_no}</p>
                                                                            </Grid>
                                                                        </Grid>

                                                                        <Grid container spacing={0} className="mt-4">
                                                                            <Grid item xs={12} sm={12} md={12}>
                                                                                <TableContainer>
                                                                                    <Table className="" aria-label="simple table">
                                                                                        <TableHead className="bg-light">
                                                                                            <TableRow>
                                                                                                <TableCell align="left" style={{"width":"150px"}}>From Date</TableCell>
                                                                                                <TableCell align="left" style={{"width":"150px"}}>To Date</TableCell>
                                                                                                <TableCell align="left" style={{"width":"120px"}}>No of Days</TableCell>
                                                                                                <TableCell align="left">Remarks</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>

                                                                                            <TableRow>
                                                                                                <TableCell component="th" scope="row">{element.start_date}</TableCell>
                                                                                                <TableCell>{element.end_date}</TableCell>
                                                                                                <TableCell align="left">{element.no_of_days}</TableCell>
                                                                                                <TableCell>{element.remarks}</TableCell>
                                                                                            </TableRow>

                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Grid>
                                                                        </Grid>
                                                                        
                                                                    </div>
                                                                </Grid>
                                                            </Grid>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                                
                                                {element.leave_status == 'pending'?'':
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={11} className="text-right">
                                                            <Button className="m-2" color="secondary" variant="contained" startIcon={<CloudDownloadIcon />}>Download</Button>
                                                            <Button className="m-2" color="secondary" variant="contained" startIcon={<PrintIcon />}>Print</Button>
                                                        </Grid>
                                                    </Grid>
                                                }
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {element.leave_status == 'pending'?
                                <>
                                <Grid item xs={12} md={12} lg={9}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={11}>
                                            <Card className="card-box mb-4 p-4">

                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <Grid container spacing={0}> 
                                                                                                                                    
                                                            <Grid item xs={12} sm={10} md={3}> 
                                                                <FormControl component="fieldset">
                                                                    <FormLabel component="legend" className="pt-3">Whether eligible for concession:</FormLabel>  
                                                                </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} sm={10} md={4}>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup row aria-label="position" name="concession_elligibility" defaultValue="top" value={this.state.concession} onChange={(event) => this.setState({concession:event.target.value})}>
                                                                        <FormControlLabel value="1" control={<Radio color="primary" />}  label="Yes" checked={this.state.concession == 1}/> 
                                                                        <FormControlLabel value="0" control={<Radio color="primary" />}  label="No" checked={this.state.concession == 0}/>
                                                                    </RadioGroup>
                                                                </FormControl>                                                                      
                                                            </Grid>

                                                            {this.state.concession == '1' && 
                                                            <Grid item xs={12} sm={10} md={5}>
                                                                <FormControl fullWidth>
                                                                    <TextField 
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: {textTransform: 'capitalize'}
                                                                    }}
                                                                    onChange={event => this.setState({amount:event.target.value})}
                                                                    value={this.state.amount}
                                                                    id="document-type"   
                                                                    label="Amount Rs." 
                                                                    type="search" 
                                                                    variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            }

                                                        </Grid>

                                                        <Grid container spacing={0} className="mt-5"> 

                                                            <Grid item xs={12} sm={12} md={12}>
                                                                <FormControl fullWidth>
                                                                    <TextField 
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: {textTransform: 'capitalize'}
                                                                    }}
                                                                    onChange={event => this.setState({leave_remarks:event.target.value})}
                                                                    value={this.state.leave_remarks}
                                                                    id="document-type"   
                                                                    label="Remarks" 
                                                                    type="search" 
                                                                    variant="outlined" />
                                                                </FormControl>
                                                            </Grid>

                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                                
                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={12} lg={11} className="text-right">
                                                        <Button className="m-2" color="secondary" variant="contained" onClick={() => this.RejectHostelLeave()}>Reject</Button>
                                                        <Button className="m-2 successBtnOutline" color="secondary" variant="outlined" onClick={() => this.AcceptHostelLeave()}>Approve</Button>
                                                    </Grid>
                                                </Grid>

                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                </>
                                :
                                <>
                                    <Grid item xs={12} md={12} lg={9}>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box mb-1 p-4">

                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            
                                                            <p className="text-capitalize mb-0"><b>Remarks:</b> {element.remarks}</p>
                                                            
                                                        </Grid>
                                                    </Grid>

                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                                }
                            </Grid>
                    
                        </div>
                    </Animated>
                    </>
                    )}
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(HostelEntryReciptManagement);
