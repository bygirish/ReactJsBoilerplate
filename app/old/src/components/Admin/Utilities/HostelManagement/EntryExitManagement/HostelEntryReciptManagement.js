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
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
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
      actionType:'room_structure',
      loading:false,
      selectedBlockId:'',
      TabValue:0,
      checkAll:false,
      blocksList:[],
      checked: [],
      ReceiptData: [],
      joining_data:new Date(),
      enddate: new Date(),
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'', 
      foodtype: 'Veg',
      error: '',
      activeSidebarTab:"room_structure",
      alert: null,
      articleholders: [{ articles: '', quantity: '' }],     
      loading:true,
      selectedBoard:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

  getReceiptData = (type) => {
    let student = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      student: student,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('HostelRooms/getReciptData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
        });
    
        this.setState({ ReceiptData: data }); 
      }else{
        this.setState({ ReceiptData: []});
      }
    }).catch(error => {
      console.log(error); 
    });
  }

 
  componentDidMount() {
    this.getReceiptData();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/hostel-entry-exit")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                    Fee Receipt
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} justify="center" className="sliderDiv">                                

                                <Grid item xs={12} md={12} lg={9}>
                                    {/* Room Structure section */}
                                    {this.state.actionType == "room_structure" && <div>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box mb-4 p-4">

                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-body"> 
                                                                            {this.state.ReceiptData.map((element,index)=>(
                                                                            <>  
                                                                            <Grid container spacing={0}>                                                                         
                                                                                <Grid item xs={12} sm={10} md={3}>
                                                                                    <img  className="mt-3" src="http://react.egenius.in/static/media/demo_logo.1e2e543a.png" style={{"max-width":"60px"}}/>                                                                                   
                                                                                </Grid>
                                                                                <Grid item xs={12} sm={10} md={6}  className="text-center">
                                                                                    <p className="mb-1">Bunts Sangha Bengaluru</p>   
                                                                                    <h6>Bunts Sangha R.N.S. Vidyaniketan</h6> 
                                                                                    <p className="mb-1">Vijayanagar, Karnataka Bengaluru - 560040</p>   
                                                                                    <h5>HOSTEL MEMORANDUM</h5>                                                                            
                                                                                </Grid>
                                                                                <Grid item xs={12} sm={10} md={3} className="text-right">
                                                                                    <h6 className="mt-3">Academic Year</h6> 
                                                                                    <h6>{element.academic_year}</h6>                                                                               
                                                                                </Grid>
                                                                            </Grid>
                                                                            
                                                                            <Grid container spacing={0} className="mt-4">
                                                                                <Grid item xs={12} sm={10} md={6}>
                                                                                    <p className="mb-1">Student Name : {element.student_name}</p>
                                                                                    <p className="mb-1">Father Name : {element.father_name}</p>
                                                                                    <p className="mb-1">Standard : {element.standard}</p>
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
                                                                                                    <TableCell style={{"width":"70px"}}>S No</TableCell>
                                                                                                    <TableCell align="left">Particulars</TableCell>
                                                                                                    <TableCell align="right" style={{"width":"150px"}}>Amount Rs.</TableCell>
                                                                                                </TableRow>
                                                                                            </TableHead>
                                                                                            <TableBody>

                                                                                                <TableRow>
                                                                                                    <TableCell component="th" scope="row">1</TableCell>
                                                                                                    <TableCell>Deposit</TableCell>
                                                                                                    <TableCell align="right">{element.deposit}</TableCell>
                                                                                                </TableRow>

                                                                                                <TableRow>
                                                                                                    <TableCell component="th" scope="row">2</TableCell>
                                                                                                    <TableCell>Hostel Fee per Annum</TableCell>
                                                                                                    <TableCell align="right">{element.fee_per_annum}</TableCell>
                                                                                                </TableRow>

                                                                                                <TableRow>
                                                                                                    <TableCell component="th" scope="row"></TableCell>
                                                                                                    <TableCell align="right"><h6>Total Rs.</h6></TableCell>
                                                                                                    <TableCell align="right"><h6>{element.gross_total}</h6></TableCell>
                                                                                                </TableRow>

                                                                                                <TableRow>
                                                                                                    <TableCell component="th" scope="row"></TableCell>
                                                                                                    <TableCell align="center">The hostel fee will be payable in 10 installments of Rs. 2000 starting from May 30, 2020 every month</TableCell>
                                                                                                    <TableCell align="right"></TableCell>
                                                                                                </TableRow>

                                                                                                <TableRow>
                                                                                                    <TableCell component="th" scope="row"></TableCell>
                                                                                                    <TableCell align="center"><h6>This is just a memo. Not a fee receipt.</h6></TableCell>
                                                                                                    <TableCell></TableCell>
                                                                                                </TableRow>

                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    </TableContainer>
                                                                                </Grid>
                                                                            </Grid>
                                                                            </>
                                                                        ))}
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={11} className="text-right">
                                                            <Button className="m-2" color="secondary" variant="contained" startIcon={<SendIcon/>}>Send</Button>
                                                            <Button className="m-2" color="secondary" variant="contained" startIcon={<CloudDownloadIcon />}>Download</Button>
                                                            <Button className="m-2" color="secondary" variant="contained" startIcon={<PrintIcon />}>Print</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(HostelEntryReciptManagement);
