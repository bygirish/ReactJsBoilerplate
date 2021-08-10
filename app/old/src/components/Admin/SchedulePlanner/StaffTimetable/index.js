import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,MenuItem,Box,Tabs,ButtonGroup,ListItem,Slide,Checkbox,RadioGroup,Radio,List,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import GridList from '@material-ui/core/GridList';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
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

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      selectedStaffId:'',
      actionType:AuthHelper('Events','can_create') ? 'create':'view',
      loading:false,
      id_event:'',
      no_of_days:'',
      teaching_periods:'',
      break_periods:'',
      time_interval:'',
      dashboardDetails:[],
      timetableData:[],
      staffList:[],
      subjectList:[],
      selectedStandards:[],
      current_date:moment().format("YYYY-MM-DD"),
      subjects:[],
      roleData:[],
      markSubmitted:'',
      lfeedback:'',
      filterReadReceipients:[],
      events:[],
      SelectedSectionsIds:'',
      SelectedDepartmentIds:'', 
      classwiseSections:[],
      periodTypes:['Teaching','Break', 'Lunch Break'],
      basicNotify:false,
      allStudents:true,
      from_time:moment().format("YYYY-MM-DD HH:mm"),
      to_time:moment().format("YYYY-MM-DD HH:mm"),
      searchStudent:false,
      startdate: new Date(),
      enddate:  new Date(),
      selectedFile:null,
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '',
      selectedEnabled:'',
      gradeMarksSelected:'',
      assignmentname: '',
      lstaff:'',
      lnote:'',
      TabValue:'MONDAY',
      lfeedback:'',
      lmarks:'',
      lsubject:'',
      lchapter:'',
      ltype:'',
      lenabled:'',
      lgrademarks:'',
      lgrade:'',
      lsubmission:'',
      readReceipt:'',
      smsAlert:'',
      gradeData:[],
      description: EditorState.createEmpty(),
      event_description: EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      assignmentsData:[],
      staffSuggestions:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = description => {
    
    this.setState({description})};
 

  onEditorStateUpdate = event_description => {
    
    this.setState({event_description})};
  

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }



  setValue = (val) => {
    this.setState({TabValue:val});
    if(this.props.data.usertype == "admin"){
      this.getTimetable(val,this.state.selectedStaffId);
    }
    else{
      this.getTimetable(val,this.props.data.UID);
    }
  }

  renderEditableSubject = (cellInfo) => {
    const cellValue = this.state.timetableData[cellInfo.index].subject;
  
      return (
        <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="subject-list"
                    select
                    label="Select Subject"
                    value={cellValue}
                    onChange={(event,child)=>    this.handleChangeType(cellInfo,event,child.props.id, "subject")}
                    variant="outlined">
                    {this.state.subjectList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
        </FormControl>
    );      
  };

  renderEditableStaff = (cellInfo) => {
    const cellValue = this.state.timetableData[cellInfo.index].staff;
  
      return (
        <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="staff-list"
                    select
                    label="Select Staff"
                    value={cellValue}
                    onChange={(event,child)=>    this.handleChangeType(cellInfo,event,child.props.id, "staff")}
                    variant="outlined">
                    {this.state.staffList.map(option => (
                      <MenuItem key={option.UID} name={option.UID} id={option.UID} value={option.UID}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
        </FormControl>
    );      
  };

  handleChangeType = (cellInfo, event,id, name) => {
    let data = [...this.state.timetableData];
    data[cellInfo.index][name] = id;
    this.setState({ data });
  };

  renderTextInput = (name,label) => {
    return (
      <FormControl fullWidth>
      <TextField 
        inputProps={{
         autoComplete: "off",
         pattern: "[a-z]"
        }}
        id={name}  
        value={this.state[name]}
        label={label} 
        type="search" 
        onChange={(event) => this.handleChangeState(name,event.target.value)}
        className="my-2"
        inputRef={this.textInput} 
        variant="outlined" 
     />
     </FormControl>
    )
}

showError = (error) => {
  this.setState({
    basicNotify: (
      <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">{error}</h4>
    </div>
  </Dialog>
    ),
  });
     setTimeout(() => {
       this.setState({ basicNotify:false});
      // window.location.reload()
     }, 2000)
  }


  getTimetable(day,uid) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.state.selectedAcademicId,
      no_of_days:this.state.no_of_days,
      teaching_periods:this.state.teaching_periods,
      break_periods:this.state.break_periods,
      time_interval:this.state.time_interval,
      id_staff:uid,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassTimetable/getStaffTimatable',postData).then(response => {
  
      if (response.status==200 && response.data!='') {
          this.setState({ timetableData:response.data[day], subjectList:response.data.subject_list,staffList:response.data.staff_list})
      }
    }).catch(error => {
      this.showError(error.response.data)
  
    });
  
  } 

  getStaffDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_board:this.props.data.selectedBoardId,
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('Staffs/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data =  [];
        response.data.forEach(element => {
            data.push({id:element.UID,name:element.first_name+" "+" "+element.last_name,designation:element.designation, UID:element.UID});
        });
      
        this.setState({staffSuggestions:data});
      }else{
        this.setState({staffSuggestions:[]});
      }  
    }).catch(error => {
      console.log(error);

    });
  }

  componentDidMount() {
  this.getStaffDetails();
  if(this.props.data.usertype == "admin"){
    this.getTimetable(this.state.TabValue,this.state.selectedStaffId);
  }
  else{
    this.getTimetable(this.state.TabValue,this.props.data.UID);
  }

  }

render(){
  const width = window.innerWidth;
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/timetable")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
            {this.props.data.usertype == "admin" ? "Staff Timetable" : "View Timetable"}
            </Typography>
               </Grid>
       
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

      <Grid container justify={this.props.data.usertype == "admin" ? "none" : "center"}>
      {this.props.data.usertype == "admin" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 {this.state.staffSuggestions.map(element=>(
                   <ListItem button className={this.state.selectedStaffId==element.id ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getTimetable(this.state.TabValue,element.id);this.setState({selectedStaffId:element.id})}}>
                   <span>{element.name}</span>
                 </ListItem>
           
                 ))}
                  
                
                </List>
              </div>
            </div>
          </Card>
          </Grid>  }
      <Grid item xs={12} md={8} lg={8}>
      <Grid container  justify="center">
       <Grid item xs={12} md={8} lg={10}>
          <Card className="card-box mb-4 customTab ">
          <div className="card-header p-1 m-3">
            <Grid container  justify="center">
              <Grid item xs={12} md={8} lg={12}>
                    
                <Tabs
                  value={this.state.TabValue}
                  indicatorColor="default"
                  textColor="secondary"
                  >
                    <ButtonGroup  color="secondary" aria-label="outlined secondary button group" className="buttonGroup">
                  <Button variant={this.state.TabValue == "MONDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("MONDAY")}}>MONDAY</Button>
                  <Button variant={this.state.TabValue == "TUESDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("TUESDAY")}}>TUESDAY</Button>
                  <Button variant={this.state.TabValue == "WEDNESDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("WEDNESDAY")}}>WEDNESDAY</Button>
                  <Button variant={this.state.TabValue == "THURSDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("THURSDAY")}}>THURSDAY</Button>
                  <Button variant={this.state.TabValue == "FRIDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("FRIDAY")}}>FRIDAY</Button>
                  <Button variant={this.state.TabValue == "SATURDAY" ?"contained":"outlined"} onClick={()=>{this.setValue("SATURDAY")}}>SATURDAY</Button>
                  </ButtonGroup>
                </Tabs>
                </Grid>
            </Grid>  
                </div>

              <CardContent className="p-1 m-3">
              <Typography
              component="div"
              role="tabpanel"
              >
                 <Grid container  justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8} style={{height: this.state.timetableData.length>0 &&500}}>
      {/* <GridList   cols={1} style={{height: this.state.timetableData.length>0 &&500}}> */}
      {this.state.timetableData.map((element)=>(    
        <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
            <div className="py-3 px-3 d-flex align-items-center text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.period_number}
          </span>
          <span className="d-block opacity-7">period</span>
        </div>
      </div>
      <div className="py-3 px-4 d-flex align-items-center  text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.subject}
          </span>
          <span className="d-block opacity-7">subject</span>
        </div>
      </div>
      <div className="py-3 px-4 d-flex align-items-center  text-center">
        <div>
          <span className="font-weight-bold font-size-md">
          {element.start}
          </span>
          <span className="d-block opacity-7">start time</span>
        </div>
      </div>
      <div className="py-3 px-4 d-flex align-items-center text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.end}
          </span>
          <span className="d-block opacity-7">end time</span>
        </div>
      </div>

    </Card>
     ))}
     {/* </GridList> */}
              
      </Grid>
      </Grid>  
              </Typography>
              </CardContent>  
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
