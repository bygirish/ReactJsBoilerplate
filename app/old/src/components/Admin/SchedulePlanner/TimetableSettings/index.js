import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,MenuItem,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
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
      timetableSettings:[],
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

  handleTime = (x, index, name) => {
    let timetableData = this.state.timetableSettings;
    let date = moment(x).format('HH:mm:ss');
    if(name == "start_time"){
      const durationInMinutes = this.state.time_interval;
      const endTime = moment(date, 'HH:mm:ss').add(durationInMinutes, 'minutes').format('HH:mm:ss');
      timetableData[index][name] = date;
      timetableData[index].end_time = endTime;
      console.log(endTime)
    }
    else{
      timetableData[index][name] = date;
    }
   
    this.setState({timetableSettings:timetableData});
  }

  renderEditableStartTime = (cellInfo) => {
    const cellValue = moment().format("YYYY-MM-DD")+" "+this.state.timetableSettings[cellInfo.index].start_time;

    return (
      <div className="pickerGrid">
     <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardTimePicker
            margin="normal"
            id="time-picker"
      label="Start time"
      inputVariant="outlined"
      inputProps={{ readOnly: true }}
      value={cellValue}
      onChange={(x, event) => this.handleTime(x, cellInfo.index, "start_time")}     
      KeyboardButtonProps={{
      'aria-label': 'change time', 
      }}
      /> </MuiPickersUtilsProvider>
    </div>
  );    
  };

  renderEditableEndTime = (cellInfo) => {
    const cellValue = moment().format("YYYY-MM-DD")+" "+this.state.timetableSettings[cellInfo.index].end_time;
  
    return (
      <div className="pickerGrid">
     <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardTimePicker
            margin="normal"
            id="time-picker"
      label="End time"
      inputVariant="outlined"
      value={cellValue}
      inputProps={{ readOnly: true }}
      onChange={(x, event) => this.handleTime(x, cellInfo.index, "end_time")}     
      KeyboardButtonProps={{
      'aria-label': 'change time', 
      }}
      /> </MuiPickersUtilsProvider>
    </div>
  );    
  };

  renderEditablePeriodType = (cellInfo) => {
    const cellValue = this.state.timetableSettings[cellInfo.index].period_type;
  
      return (
        <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="period-list"
                    select
                    label="Select Period Type"
                    value={cellValue}
                    onChange={(event,child)=>    this.handleChangeType(cellInfo,event,child.props.id, "period_type")}
                    variant="outlined">
                    {this.state.periodTypes.map(option => (
                      <MenuItem key={option} name={option} id={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
        </FormControl>
    );      
  };

  handleChangeType = (cellInfo, event,id, name) => {
    let data = [...this.state.timetableSettings];
    data[cellInfo.index][name] = event.target.value;
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
        onChange={(event) => this.handleChangeState(name,event.target.value.replace(/\D/g, ""))}
        className="my-2"
        inputRef={this.textInput} 
        variant="outlined" 
     />
     </FormControl>
    )
}



saveSettings = () => {
  
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicYear,
    no_of_days:this.state.no_of_days,
    teaching_periods:this.state.teaching_periods,
    break_periods:this.state.break_periods,
    time_interval:this.state.time_interval,
    timetable_settings:this.state.timetableSettings,
    role_id: this.props.data.role_id,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ClassTimetable/insertSettings',postData).then(response => {
  console.log(response);
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Timetable Settings  Created</h4>
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

  getPeriodSettings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.state.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassTimetable/getSettingsData',postData).then(response => {
      if (response.status==200 && response.data!='') {
          this.setState({ no_of_days:response.data[0].no_of_days,teaching_periods:response.data[0].teaching_periods,break_periods:response.data[0].break_periods,time_interval:response.data[0].time_interval})
      }
    }).catch(error => {
      this.showError(error.response.data)
  
    });
  
  } 

  getTimetableSettings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.state.selectedAcademicId,
      no_of_days:this.state.no_of_days,
      teaching_periods:this.state.teaching_periods,
      break_periods:this.state.break_periods,
      time_interval:this.state.time_interval,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassTimetable/getTimetableSettings',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ timetableSettings:response.data})
      }
    }).catch(error => {
   
      this.showError(error.response.data)
  
    });
  
  } 

  componentDidMount() {
   this.getPeriodSettings();
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
             Timetable Settings
            </Typography>
               </Grid>
       
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container  justify="center" className="sliderDiv">
      <Grid item xs={12} lg={8}>
      <Card className="card-box  mb-4 p-3 customNoData ">
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3} className="py-1">
            {this.renderTextInput("no_of_days","No of Days")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
            {this.renderTextInput("teaching_periods","No of Teaching Periods")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
            {this.renderTextInput("break_periods","No of Break Periods")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
            {this.renderTextInput("time_interval","Time interval")}
        </Grid>
      </Grid> 

       <Grid container spacing={2}> 
         <Grid item xs={12} lg={12} className="py-1 text-right">
            <Button className="successBtnOutline" onClick={()=>this.getTimetableSettings()}>Submit</Button>
         </Grid>  
       </Grid>
       </Card>
       </Grid>
       </Grid>

      {this.state.timetableSettings.length > 0 && <Grid container spacing={2} justify="center">
       <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-4 p-3 customNoData customPadding">
 
    <ReactTable

data={
this.state.timetableSettings.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  period_no: original.period_no,
  period:original.period,
  period_type:original.period_type,
  start_time:original.start_time,
  end_time:original.end_time
})
})
}
minRows={0}
columns={[
{
Header: "S No",
accessor: "slno",
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
  Header: "Period Type",
  accessor: "exam_name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="exam-name"   
value={filter ? filter.value : ''}
placeholder={"Search Exam Name"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderEditablePeriodType
},

  {
    Header: "Start Time",
    accessor: "from_date",
    className: "center",
    Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="exam-time"   
  value={filter ? filter.value : ''}
  placeholder="Search Time"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
    ),
    Cell:this.renderEditableStartTime
    },
    {
      Header: "End TIme",
      accessor: "to_date",
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="end-time"   
    value={filter ? filter.value : ''}
    placeholder="Search Time"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      ),
      Cell:this.renderEditableEndTime
      }

  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={12} lg={12} className="text-right">
        <Button className="successBtnOutline" onClick={()=>this.saveSettings()}>
        Submit
        </Button> 
        </Grid>
        </Grid>
  </CardActions>

        </Card>
        </Grid>
       </Grid>}

</div>
</Animated>
</Dialog>


    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
