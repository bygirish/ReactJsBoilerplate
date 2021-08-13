import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider, MenuItem,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6'; 
import CustomAutocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import Autocomplete from '@material-ui/lab/Autocomplete'; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
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

class CheckinVisitorManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        waitingtime:'',
        dialogOpen:true,
        loading:false,
        TabValue:0,
        checkAll:false,
        load: false,
        error: '',
        selectedBoard:'',
        VisitorList:[],
        lcontactnumber:'',
        remarks:'',
        meetingStatus:'1',
        time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId,    
        lsearchname:'',
        searchtableData:[],
        basicNotify:false
        
        };        
    }

    
    handleTimeChange(datevlaue){
        let time = this.state.time;
        time = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
        this.setState({ time });
    };

    checkinVisit = event =>{
        event.preventDefault();

        let headingStatus = "The visitor has checked in!";

        let id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId, 
            token:"abc",
            Id:id,
            Intime:currentTime,
            id_user: this.props.data.UID
        };
        // console.log(postData);
        // return false;
        new Service().apiCall('VisitorManagement/checkinVisitor',postData).then(response => {
            console.log(response);
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
                
                setTimeout(() => {
                    this.setState({ basicNotify:false});
                    this.props.history.push("/admin/visitors-management");
                }, 2000) 
            
            }else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    checkoutVisit = event =>{
        event.preventDefault();

        let headingStatus = "The visitor has checked out!";

        let id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let outtime = this.state.time;
        let remarks = this.state.remarks;
        let meetingStatus = this.state.meetingStatus;

        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId, 
            token:"abc",
            Id:id,
            Outtime:outtime,
            Remarks:remarks,
            Meeting_Status:meetingStatus,
            id_user: this.props.data.UID
        };
        // console.log(postData);
        // return false;
        new Service().apiCall('VisitorManagement/checkoutVisitor',postData).then(response => {
            console.log(response);
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
                
                setTimeout(() => {
                    this.setState({ basicNotify:false});
                    this.props.history.push("/admin/visitors-management");
                }, 2000) 
            
            }else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    getVisitorData = (type) => {

        let id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        const postData = {
          id_organization:this.state.selectedOrganizationId,
          id_institute:this.state.selectedInstitutionId,
          token:"abc",
          id_user: this.props.data.UID,
          type:type,
          Id:id,
          id_board:this.state.selectedBoard,
          id_academicyear:this.state.selectedAcademicYear,
        };
        new Service().apiCall('VisitorManagement/getDailyVisitorData',postData).then(response => { 
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

    componentDidMount() {
        this.getVisitorData();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/visitors-management")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                    {this.state.VisitorList.map((element, index) =>
                                        <>
                                        {element.intime == '' ? 'Check-In' : 'Check-Out'}
                                        </>
                                    )}
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv" justify="center">

                                <Grid item xs={12} md={8} lg={4}> 
                                    <Card className="card-box  mb-4 p-4 customNoData text-center">
                                    {this.state.VisitorList.map((element, index) =>
                                        <>
                                        {element.intime == '' ?
                                            <>
                                            <form  onSubmit={this.checkinVisit.bind(this)} autoComplete="off">

                                                <Grid container spacing={6} justify="center">
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <Grid container>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h4 className="font-size-lg mb-4 ml-0 pb-2 font-weight-bold">
                                                                        Check-In
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={12} >
                                                                <h6><span className="text-capitalize">{element.name}</span> to meet <span className="text-capitalize">{element.person}</span></h6>
                                                            </Grid>
                                                        </Grid> 
                                                    </Grid> 
                                                </Grid>
                                                
                                                <Grid container className="mt-2 text-center">
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Button type="submit" className="successBtnOutline m-2" variant="outlined">CHECK IN</Button>
                                                        <Button color="secondary" className="m-2" variant="contained" onClick={()=>this.props.history.push("/admin/visitors-management")}>CLOSE</Button>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                            </>
                                            :
                                            <>
                                            <form  onSubmit={this.checkoutVisit.bind(this)} autoComplete="off">

                                                <Grid container spacing={6} justify="center">
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <Grid container>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h4 className="font-size-lg mb-4 ml-0 pb-2 font-weight-bold">
                                                                        Check-Out
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={12} >
                                                                <h6><span className="text-capitalize">{element.name}</span> to meet <span className="text-capitalize">{element.person}</span></h6>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <FormControl fullWidth>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                    <KeyboardTimePicker
                                                                    margin="normal"
                                                                    autoOk={true}
                                                                    value={this.state.time}
                                                                    shrink={true}
                                                                    id="time-picker"
                                                                    label="From Time"
                                                                    inputVariant="outlined"
                                                                    onChange={date => this.handleTimeChange(date)} 
                                                                    KeyboardButtonProps={{
                                                                    'aria-label': 'change time', 
                                                                    }} 
                                                                    /> 
                                                                    </MuiPickersUtilsProvider>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12} className="text-left">
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup row aria-label="position" name="meetingStatus" value={this.state.meetingStatus} onChange={(event) => this.setState({meetingStatus:event.target.value})} defaultValue="top">
                                                                        <FormControlLabel value="1" control={<Radio name="gender" color="primary"
                                                                                />} label="Met" checked={this.state.meetingStatus == '1'}/>
                                                                        <FormControlLabel value="0" control={<Radio name="gender" color="primary"
                                                                                    />} label="Not Met" checked={this.state.meetingStatus == '0'} />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <FormControl fullWidth>
                                                                    <TextField 
                                                                    inputProps={{
                                                                    autoComplete: 'off',
                                                                    style: {textTransform: 'capitalize'} 
                                                                    }}
                                                                    value={this.state.remarks}
                                                                    onChange = {(event) => this.setState({remarks:event.target.value})}
                                                                    id="document-type"   
                                                                    label="Remarks" 
                                                                    type="search" 
                                                                    variant="outlined" required/>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid> 
                                                    </Grid> 
                                                </Grid>

                                                <Grid container className="mt-2 text-center">
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Button type="submit" className="successBtnOutline m-2" variant="outlined">CHECK OUT</Button>
                                                        <Button color="secondary" className="m-2" variant="contained" onClick={()=>this.props.history.push("/admin/visitors-management")}>CLOSE</Button>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                            </>
                                        }
                                        </>
                                    )}
                                    </Card>                                
                                </Grid>
                
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(CheckinVisitorManagement);
