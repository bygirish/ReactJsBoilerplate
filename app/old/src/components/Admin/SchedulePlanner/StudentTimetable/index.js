import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,MenuItem,Box,Tabs,ButtonGroup,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
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
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
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

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
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

  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name });
    
    if(this.props.data.usertype != "student"){
      this.getTimetable(this.state.TabValue,id);
    }
    else{
      this.getTimetable(this.state.TabValue,this.props.data.standard);
    }
  }

  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.searchStudent && this.state.allStudents ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  setValue = (val) => {
    this.setState({TabValue:val});
    if(this.props.data.usertype != "student"){
      this.getTimetable(val,this.state.selectedStandardId);
    }
    else{
      this.getTimetable(val,this.props.data.standard);
    }
  }

  renderEditableSubject = (cellInfo) => {
    const cellValue = this.state.timetableData[cellInfo.index].subject;
    let period_type=  this.state.timetableData[cellInfo.index].period_type;
  
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
                    {this.state.subjectList && this.state.subjectList.map(option => (
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
                    {this.state.staffList && this.state.staffList.map(option => (
                      <MenuItem key={option.UID} name={option.UID} id={option.UID} value={option.UID}>
                        {option.first_name+" "+option.last_name}
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

saveSettings = () => {
  
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicYear,
    timetable_settings:this.state.timetableData,
    id_standard:this.state.selectedStandardId,
    day_name:this.state.TabValue,
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ClassTimetable/insertTimetable',postData).then(response => {
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Timetable  Created</h4>
  </div>
</Dialog>
        ),
      });
     // this.getSettings();
      setTimeout(() => {
        this.setState({ basicNotify:false});
      }, 2000) 
    }
  }).catch(error => {
    this.showError(error.response.data)
  });
}

  getTimetable(day, id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassTimetable/getStudentTimatable',postData).then(response => {
  console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ timetableData:response.data[day], subjectList:response.data.subject_list,staffList:response.data.staff_list})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  
  } 

  componentDidMount() {
    if(this.props.data.usertype != "student"){
   //   this.getTimetable(this.state.TabValue,id);
    }
    else{
      this.getTimetable(this.state.TabValue,this.props.data.standard);
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
            {this.props.data.usertype == "admin" ? "Create Timetable" : "View Timetable"}
            </Typography>
               </Grid>
       
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

      <Grid container  justify={this.props.data.usertype == "admin" ? "none" : "center"}>
      {this.props.data.usertype == "admin" &&  <Grid item xs={12} md={8} lg={3}>
      <Card className="card-box ml-4 mb-4">
        <div className="text-center">
       {this.sidebarStandardSections()}
       </div>
       </Card>
      </Grid>}
      <Grid item xs={12} md={8} lg={8}>
      <Grid container  justify="center">
       <Grid item xs={12} md={8} lg={10}>
       {this.props.data.usertype == "admin" && <Card className="card-box mb-4 customTab ">
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
                <Grid container  justify="center">
       <Grid item xs={12} sm={12} lg={10}>
        <Card className="card-box  mb-4 p-3 customNoData customPadding">
        {console.log('timetable'+JSON.stringify(this.state.timetableData))}
    {/* <ReactTable style={{height: this.state.timetableData.length>0 &&500}} */}
    <ReactTable
data={
  this.state.timetableData.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  period_number: original.period_number,
  staff:original.staff,
  subject:original.subject
})
})
}
minRows={0}
columns={[
  {
    Header: "Period",
    accessor: "period_number",
    width: 90,
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="sno"   
    value={filter ? filter.value : ''}
    placeholder="S No"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
   
{ 
  Header: "Subject",
  // Header:  (row.original.period_type!="Break" && row.original.period_type!="Lunch Break")?"Subject":"Break",
  accessor: "exam_name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="exam-name"   
value={filter ? filter.value : ''}
placeholder={"Search Subject"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderEditableSubject
  // Cell: row =>(row.original.period_type!="Break" && row.original.period_type!="Lunch Break")?this.renderEditableSubject:"Break",
},

  {
    Header: "Staff",
    accessor: "staff",
    className: "center",
    Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="staff-name"   
  value={filter ? filter.value : ''}
  placeholder="Search Staff"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
    ),
    Cell:this.renderEditableStaff
    },
    

  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    <Grid container>
      <Grid item xs={12} md={12} lg={12} className="text-right">
        <Button className="successBtnOutline" onClick={()=>this.saveSettings()}>
        Submit
        </Button> 
        </Grid>
        </Grid>
  </CardActions>

        </Card>
        </Grid>
       </Grid>
              </Typography>
              </CardContent>  
          </Card>}

          {this.props.data.usertype == "student" &&  <Card className="card-box mb-4 customTab ">
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
      <Grid item xs={12} md={12} lg={12}>

      {this.state.timetableData.map((element)=>(
                
               
        <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
          <Grid container >
      <Grid item xs={12} md={2} lg={2}>
            <div className="py-3 px-3 d-flex align-items-center text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.period_number}
          </span>
          <span className="d-block opacity-7">period</span>
        </div>
      </div>
      </Grid>
      <Grid item xs={12} md={2} lg={3}>
      <div className="py-3 px-4 d-flex align-items-center  text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.staff_name}
          </span>
          <span className="d-block opacity-7">staff</span>
        </div>
      </div>
      </Grid>
      <Grid item xs={12} md={2} lg={3}>
      <div className="py-3 px-4 d-flex align-items-center  text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.subject_name}
          </span>
          <span className="d-block opacity-7">subject</span>
        </div>
      </div>
      </Grid>
      <Grid item xs={12} md={2} lg={2}>
      <div className="py-3 px-4 d-flex align-items-center  text-center">
        <div>
          <span className="font-weight-bold font-size-md">
          {element.start}
          </span>
          <span className="d-block opacity-7">start time</span>
        </div>
      </div>
      </Grid>
      <Grid item xs={12} md={2} lg={2}>
      <div className="py-3 px-4 d-flex align-items-center text-center">
        <div>
          <span className="font-weight-bold font-size-md">
            {element.end}
          </span>
          <span className="d-block opacity-7">end time</span>
        </div>
      </div>
     </Grid>
     </Grid>   
    </Card>
     ))}
              
      </Grid>
      </Grid>  
              </Typography>
              </CardContent>  
          </Card> }
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
