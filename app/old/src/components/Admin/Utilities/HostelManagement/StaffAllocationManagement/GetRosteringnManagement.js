import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
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

class GetRosteringManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:'room_structure',
      loading:false,
      TabValue:0,
      checkAll:false,
      groupName:'',
      groupRecipients:'',
      messageCenterSelectedSections:[],
      messageCenterSelectedSectionsIds:[],
      groupChecked:[],
      selectedStandards:[],
      checked: [],
      groupCount:[],
      holidays:[{id:1, food_type:'Veg'}, {id:2, food_type:'Non Veg'}],
      message: '',
      groupInsert :[],
      classwiseStudent : [],
      startdate:new Date(),
      enddate: new Date(),
      allChecked:false,
      allStaffChecked:false,
      allStudentChecked:false,
      staffAll:false,
      allstudentsChecked:false,
      staffTeaching:false,
      staffNonTeaching:false,
      classicModal:false,
      allSections:false,
      searchbyDateChecked:false,
      sectionCount:0,
      usersTotal:0,
      staffTotal:0,
      nonTeachingstaffTotal:0,
      teachingstaffTotal:0,
      viewRecipientsPanel:false,
      studentsTotal:0,
      isPaneOpen:false,
      studentPanel:false,
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'',
      reportMessageCenterPanel:false,
      selectedClass:'',
      selectedSection:'',
      selectedStandard:'',
      showSuggestions:false,
      showTextSuggestions:false,
      userTextInput:"",
      userInput:"",
      userSearchInput:"",
      group_members:[],
      studentsData:[],
      filteredSuggestions:[],
      groups:[],
      groupSelection:[],
      members:[],
      filterSections:[],
      fileUploadState:"",
      messageReceipntsData:[],
      messageData:[],
     customAssignStudents:[],
     customAssignUsers:[],
      checkedCount:0,
      load: false,
      error: '',
      activeSidebarTab:"room_structure",
      alert: null,
      messageCount:0,
      column_count: '',
      creditCount:1,
      classwiseAll:false,
      createGroupsBlock:true,
      updateGroupsBlock:false,
      listGroupsBlock:true,
      viewRecipientsBlock:false,
      standardSections:[],
      selectSections:[],
      roomholders: [{ block: '', floor: '' }],
      totalRecipents:0,
      totalConsumed:0,
      allSectionData:[],
      loading:true,
      boardDetails:[],
      messageHistoryDetails:[],
      tags: [],
      suggestions: [],
      messageusedcount:0,
      totalmessagecount:0,
      balancemessagecount:0,
      selectedBoard:'',
      lcontactnumber:'',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId,    
      lsearchname:'',
      searchtableData:[],
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }


  componentDidMount() {
      
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
                                        Rostering
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4}> 

                                <Grid item xs={12} md={12} lg={12}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={10}>
                                            <Card className="card-box  mb-4 p-3">
                                                <Grid container>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                Select Staff
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </Grid>

                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <FormControl component="fieldset">
                                                            <FormLabel component="legend">All Staffs</FormLabel>
                                                            
                                                            <FormControlLabel
                                                                value="end"
                                                                control={<Checkbox color="primary" />}
                                                                label="Staff Name"
                                                                labelPlacement="end"
                                                            />

                                                            <FormControlLabel
                                                                value="end"
                                                                control={<Checkbox color="primary" />}
                                                                label="Assign For All Reaing Days"
                                                                labelPlacement="end"
                                                            />
                                                        </FormControl>

                                                    </Grid>
                                                </Grid>
                                            
                                                <Grid container className="mt-2">
                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                        <Button className="m-2 successBtnOutline" variant="outlined" onClick={()=>this.handleClass()}>Submit</Button> 
                                                    </Grid>
                                                </Grid>

                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(GetRosteringManagement);
