import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider, MenuItem,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6'; 
import CustomAutocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
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
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import  "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import Moment from 'moment';
import { VariantContext } from '@material-ui/pickers/wrappers/Wrapper';

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

class StudentDailyAbsentManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen:true,
            role:'',
            role_name:'',
            loading:false,
            ReportDetail:[],
            frequencySettings:[],
            attendanceData:[],
            joiningStandard:'',
            joiningStandardName:'', 
            load: false,
            error: '',
            selectedBoard:'',
            fromDate : moment(new Date()).format("YYYY-MM-DD"),
            toDate : moment(new Date()).format("YYYY-MM-DD"),
            ReportTypeArr:["onceaday","twiceaday","periodwise"],
            reportType:"",
            totalRecord:'',
            selectedOrganizationId:this.props.data.selectedOrganizationId,
            selectedInstitutionId:this.props.data.selectedInstitutionId,
            selectedBoard:this.props.data.selectedBoardId,
            selectedAcademicYear:this.props.data.selectedAcademicId,    
            lsearchname:'',
            searchtableData:[],
            staffArr:[],
            basicNotify:false,
        }; 
    }    
  
    handleStartDate = (x) => {
        let fromDate = this.state.fromDate;
        fromDate = moment(x).format("YYYY-MM-DD");
        this.setState({ fromDate})
    };

    handleEndDate = (x) => {
        let toDate = this.state.toDate;
        toDate = moment(x).format("YYYY-MM-DD");
        this.setState({toDate})
    }

    getFreQuencySettings = (reportType) => {

        const postData = {
          id_organization : this.props.data.selectedOrganizationId,
          id_institute : this.props.data.selectedInstitutionId,
          id_board : this.props.data.selectedBoardId,   
          id_academicyear : this.props.data.selectedAcademicId,
          token : "abc",
          id_user : this.props.data.UID,
          reportType : reportType
        };
        
        new Service().apiCall('Attendance/getAttendanceFrequencyStandard',postData).then(response => {
            //console.log('hg'+response.data);
            if (response.status==200 && response.data!='') {
                
                const data = response.data.map((data) => {
                    
                    return {...data, checked: false, editable: false};
                });
                this.setState({frequencySettings: data});
                
            }else{
                this.setState({ frequencySettings: []});
            }
            
        }).catch(error => {
            alert(error);
        });
    }

    selectJoiningStandard = (value) => {
        this.setState({joiningStandardName:value});
    }

    selectReportType = (value) => {        
        this.setState({reportType:value});
        this.getFreQuencySettings(value);        
    }

    getReportData = event =>{
        event.preventDefault();

        let fromDate = this.state.fromDate;
        let reportType = this.state.reportType;
        let Standard_id = this.state.joiningStandardName;
        
        const postData = {
            id_organization : this.props.data.selectedOrganizationId,
            id_institute : this.props.data.selectedInstitutionId,
            id_board : this.props.data.selectedBoardId,   
            id_academicyear : this.props.data.selectedAcademicId, 
            token : "abc",
            standard_id : Standard_id,
            reportType : reportType,
            fromDate : fromDate,
            id_user: this.props.data.UID 
        };
        // console.log(postData);
        // return false;
        new Service().apiCall('ReportManagement/getStudentDailyAbsentData', postData).then(response => {
            console.log(response);
            if (response.status==200 && response.data!='') {                
                const data = response.data.map((data) => {                    
                                        
                    return {...data, checked: false, editable: false };
                });
                this.setState({ReportDetail: data, reportFrom : this.state.fromDate});                
                
            }else{
                this.setState({ ReportDetail: []});
            }
        }).catch(error => {
            console.log(error); 
        });
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/academic-reports")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                    Student Daily Absent Report
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv" justify="center">

                                <Grid item xs={12} md={8} lg={8} className="mb-4"> 
                                    <Card className="card-box  mb-4 p-4 customNoData">

                                        <form onSubmit={this.getReportData.bind(this)} autoComplete="off">

                                            <Grid container spacing={6} justify="center">
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Report
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4}>
                                                        
                                                        <Grid item xs={12} md={12} lg={4}>
                                                            <FormControl fullWidth>
                                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                    <KeyboardDatePicker
                                                                        autoOk
                                                                        margin="normal"
                                                                        id="date-picker-dialog"
                                                                        label="From Date"
                                                                        format="MM/dd/yyyy"
                                                                        inputVariant="outlined"
                                                                        value={this.state.fromDate}
                                                                        onChange={(x)=>this.handleStartDate(x)}     
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                    />
                                                                </MuiPickersUtilsProvider>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={4}>
                                                            <FormControl fullWidth>
                                                            <TextField
                                                                className="text-capitalize"
                                                                id="outlined-select-currency"
                                                                select
                                                                label="Select Report Type"
                                                                value={this.state.reportType}
                                                                onChange={(event, value) => this.selectReportType(event.target.value)}
                                                                variant="outlined">
                                                                {this.state.ReportTypeArr.map(option => (
                                                                    <MenuItem key={option} value={option} id={option} className="text-capitalize">
                                                                        {option}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                            </FormControl> 
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={4}>
                                                            <FormControl fullWidth>
                                                            <TextField
                                                                id="outlined-select-currency"
                                                                select
                                                                label="Select Standard"
                                                                value={this.state.joiningStandardName}
                                                                onChange={(event, value) => this.selectJoiningStandard(event.target.value)}
                                                                variant="outlined">
                                                                {this.state.frequencySettings.map((element,index) => (
                                                                    <MenuItem key={element.id} value={element.id} id={element.id}>
                                                                        {element.standard_name+" "+element.section}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                            </FormControl> 
                                                        </Grid>
                                                        
                                                    </Grid> 
                                                </Grid> 
                                            </Grid>
                                            
                                            <Grid container className="mt-2">
                                                <Grid item xs={12} sm={12} md={12} className="text-right">
                                                    <Button type="submit" className="successBtnOutline" variant="outlined" >Submit</Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Card>                                
                                </Grid>

                                {this.state.ReportDetail != '' && <>
                                    <Grid item xs={12} sm={12} lg={12} className="mb-3">
                                        <Card className="card-box  mb-4 p-4 customNoData">
                                            <div className="card-header">
                                                <div className="card-header--title">
                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                        Report Table
                                                    </h4>
                                                </div>
                                            </div>

                                            <ReactTable
                                                data={this.state.ReportDetail.map((original,key) => {
                                                    return ({
                                                        slno : original.slno,
                                                        UID : original.UID,
                                                        student : original.student,
                                                        contact_number : original.contact_number,
                                                        
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
                                                        Header: "UID",
                                                        accessor: "UID",
                                                        className: "center",
                                                        filterable: false,
                                                    },
                                                    {
                                                        Header: "Name",
                                                        accessor: "student",
                                                        className: "center",
                                                        filterable: false,
                                                    },
                                                    {
                                                        Header: "Contact",
                                                        accessor: "contact_number",
                                                        className: "center",
                                                        filterable: false,
                                                    }
                                                ]}
                                                defaultFilterMethod={filterCaseInsensitive}
                                                defaultPageSize={10}
                                                showPaginationTop
                                                showPaginationBottom={false}
                                                className="-striped -highlight"
                                            />  
                                            <div className="mt-4 text-right">
                                                <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/ReportManagement/excelStudentDailyAbsentReport?id_organization="+this.props.data.selectedOrganizationId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear+"&reportType="+this.state.reportType+"&standard_id="+this.state.joiningStandardName+"&fromDate="+this.state.fromDate}>Export</Button>
                                            </div>  

                                        </Card>
                                    </Grid> 
                                </>
                                }
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDailyAbsentManagement);
