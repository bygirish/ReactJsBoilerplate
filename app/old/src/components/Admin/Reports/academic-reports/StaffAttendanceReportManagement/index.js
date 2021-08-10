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

class StaffAttendanceReportManagement extends React.Component {
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
            tableColumns: [],
            tableFixedColumns : [
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
                    accessor: "staff",
                    className: "center",
                    filterable: false,
                }
            ]
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


    getReportData = event =>{
        event.preventDefault();

        let fromDate = this.state.fromDate;
        let toDate = this.state.toDate;
        let reportType = this.state.reportType;
        let Standard_id = this.state.joiningStandardName;
        
        const postData = {
            id_organization : this.props.data.selectedOrganizationId,
            id_institute : this.props.data.selectedInstitutionId,
            id_board : this.props.data.selectedBoardId,   
            id_academicyear : this.props.data.selectedAcademicId, 
            token : "abc",
            fromDate : fromDate,
            toDate : toDate,
            id_user: this.props.data.UID
        };
        // console.log(postData); 
        // return false;
        new Service().apiCall('ReportManagement/getStaffAttendanceData',postData).then(response => {
            console.log(response);
            if (response.status==200 && response.data!='') {                
                const data = response.data.map((data) => {                    
                                        
                    return {...data, checked: false, editable: false };
                });
                this.setState({ReportDetail: data, reportFrom : this.state.fromDate, reportTo : this.state.toDate});                
                this.getData();
            }else{
                this.setState({ ReportDetail: []});
            }
        }).catch(error => {
            console.log(error); 
        });
    }

    getDaysBetweenDates(startDate, endDate) {
        var now = startDate.clone(), dates = [];
  
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates;
    };

    getData(){
        let startDate = moment(this.state.reportFrom);
        let endDate = moment(this.state.reportTo);
    
        let dateList = this.getDaysBetweenDates(startDate, endDate);
        let lColumnsList = this.state.tableFixedColumns.slice();

        dateList.map(( element, index ) => {       

            var j = index+1;
            let lColumn = {};
            lColumn.Header = element;
            lColumn.accessor = element;
            lColumn.className = "center";
            lColumn.sortable = false;
            lColumn.filterable = false;
            lColumnsList.push(lColumn);
                
        });

        let lColumn2 = {}; 
            lColumn2.Header = "Total";
            lColumn2.accessor = "total_count";
            lColumn2.className = "center";
            lColumn2.sortable = false;
            lColumn2.filterable = false;
            lColumnsList.push(lColumn2);

        let lColumn3 = {}; 
            lColumn3.Header = "Total Attendance";
            lColumn3.accessor = "present_count";
            lColumn3.className = "center";
            lColumn3.sortable = false;
            lColumn3.filterable = false;
            lColumnsList.push(lColumn3);
        
        let lColumn4 = {}; 
            lColumn4.Header = "Percentage";
            lColumn4.accessor = "percentage";
            lColumn4.className = "center";
            lColumn4.sortable = false;
            lColumn4.filterable = false;
            lColumnsList.push(lColumn4);
        
        this.setState({tableColumns : lColumnsList});  
        
    }

    componentDidMount(){ 
        //this.kjzhc
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
                                    Staff Attendance Report
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
                                                        
                                                        <Grid item xs={12} md={12} lg={6}>
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

                                                        <Grid item xs={12} md={12} lg={6}>
                                                            <FormControl fullWidth>
                                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                    <KeyboardDatePicker
                                                                        autoOk
                                                                        margin="normal"
                                                                        id="date-picker-dialog"
                                                                        label="To Date"
                                                                        format="MM/dd/yyyy"
                                                                        inputVariant="outlined"
                                                                        value={this.state.toDate}
                                                                        onChange={(x)=>this.handleEndDate(x)}     
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                    />
                                                                </MuiPickersUtilsProvider>
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
                                            data={this.state.ReportDetail}                                            
                                            
                                            filterable
                                            minRows={0}
                                            columns={this.state.tableColumns}       
                                            defaultFilterMethod={filterCaseInsensitive}
                                            defaultPageSize={10}
                                            showPaginationTop
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />

                                        <div className="mt-4 text-right">
                                            <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/ReportManagement/excelStaffAttendanceMonthlyReport?id_organization="+this.props.data.selectedOrganizationId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear+"&fromDate="+this.state.fromDate+"&toDate="+this.state.toDate}>Export</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(StaffAttendanceReportManagement);
