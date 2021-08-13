import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import OutlinedDiv from "../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../layout-components/CustomComponents/StandardSectionsList.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";
import ViewIcon from "@material-ui/icons/Visibility"; 
import ChipInput from 'material-ui-chip-input';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {Checkbox,Grid,Switch,FormControlLabel,ButtonGroup,Dialog,CardActions,Toolbar,Card,Radio,Avatar,TextField,Button,Paper,Chip,Drawer,Slide,FormControl,Box,Tooltip,IconButton,Typography,AppBar, List,ListItem,Divider,InputAdornment} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { AuthHelper } from '@utils/AuthHelper.js';
import moment from "moment";
import Config from '../../../config';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; 
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
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

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partamapping : [{grade:'',min_score:'',max_score:''}],
      partbmapping : [{grade:'',min_score:'',max_score:''}],
      standardSubjects:[],
      selectedbatchList:[],
      createTimetableData:[],
      mappedExamBatches:[],
      editExamTimetable:[],
      batchStudents:[],
      mappedExamStandards:[],
      viewExamTimetable:[],
      classwiseStudent : [],
      allStudents:[],
      batchList:[],
      batchArr:[],
      examType:'',
      editExam:false,
      examList:[],
      mappedBatchList:[],
      selectedStandards:[],
      examTimetableList:[],
      selectedBatches:[],
      studentsData:[],
      mappedSelectedStandards:[],
      dialogOpen:true,
      menuLevel:1,
      basicNotify:false,
      selected_category:0,
      tags:[],
      subtags:[],
      category_type:"main",
      categoryList:[],
      examMasterType:'',
      batchName:'',
      showStatus:'all',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicId:this.props.data.selectedAcademicId, 
    };
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this); 
  }

  focusTextInput() {
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  handleAddPartA = () => {
    let lPartAData = this.state.partamapping;
    let lPartA = {};
    lPartA.grade = '';
    lPartA.min_score = '';
    lPartA.max_score = '';
    lPartAData.push(lPartA);
    this.setState({partamapping:lPartAData});
  }

  handleAddPartB = () => {
    let lPartBData = this.state.partbmapping;
    let lPartB = {};
    lPartB.grade = '';
    lPartB.min_score = '';
    lPartB.max_score = '';
    lPartBData.push(lPartB);
    this.setState({partamapping:lPartBData});
  }

  handleChangeInternalEnabled = (value) => {
    this.setState({ internalEnabled: value });
  };

  handleChangeAttendanceEnabled = (value) => {
    this.setState({ attendanceEnabled: value });
  };

  removePartAHolder(i) {
    const { partamapping } = this.state;
    this.setState({
        partamapping: partamapping.filter((data, index) => index !== i),
    });
  }

  removePartBHolder(i) {
    const { partbmapping } = this.state;
    this.setState({
        partbmapping: partbmapping.filter((data, index) => index !== i),
    });
  }

  searchExam = (event, values) => {
  console.log(values)
    if(values){
    //   if(this.state.examTimetableList.some(heading => heading.id === values.id)){
    //     this.setState({
    //       alert: (
    //         <SweetAlert
    //         style={{ display: "block", marginTop: "-100px",zIndex:999999 }}
    //         title="Exam Timetable Already Exists!"
    //         showConfirm={false}
    //       >
    //       </SweetAlert>
            
    //       ),
          
    //     });
    //     setTimeout(() => {
    //       this.setState({ alert:null});
    //     }, 2000)
    // } else{
      let batchArr = [];
      if(values.selected_batches!=""){
        let splitBatch = values.selected_batches.split(",");
        this.state.batchList.map(element=>{
          if(splitBatch.some(batch => batch === element.id)){
            batchArr.push(element);
          }
        })
      }
      this.setState({mappedExamStandards:values.selectedstandard, mappedExamBatches:batchArr, selectedExamId:values.id, examType:values.type});
   // }
 
    }
  }

  handleStandardDelete(i) {
    const { selectedStandards } = this.state;
    this.setState({
      selectedStandards: selectedStandards.filter((standard, index) => index !== i),
    });
  }

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards});
  }

  handleMappedSelected = (standards) => {
    this.setState({mappedSelectedStandards:standards});
  }

  
handleChangePartA = (index,name,value) => {
  let Data = this.state.partamapping;
  Data[index][name] = value;
  this.setState({partamapping:Data});
}

handleChangePartB = (index,name,value) => {
  let Data = this.state.partbmapping;
  Data[index][name] = value;
  this.setState({partbmapping:Data});
}

handleGradingConfig = (value) => {
  this.setState({ gradingConfig: value });
};

handleGradingConfigPartB = (value) => {
  this.setState({ gradingConfigPartB: value });
};

  handleMappedStandardSelected = (standards) => {
    this.setState({mappedExamStandards:standards});
  }
  
  handleInputChange = (cellInfo, event, name) => {
    let data = [...this.state.createTimetableData];
    data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
    this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lheadings = this.state.examList;
  if(estatus == true){
    lheadings[index].editable = false;
  }
  else{
    lheadings[index].editable = true;
  }
 // console.log(lheadings);
  this.setState({ examList:lheadings});
}

handleExamDate = (x, index, name) => {
  let timetableData = this.state.createTimetableData;
  timetableData[index][name] = moment(x).format('YYYY-MM-DD');
  this.setState({createTimetableData:timetableData});
}

handleExamTime = (x, index, name) => {
  let timetableData = this.state.createTimetableData;
  let date = moment(x).format('HH:mm:ss');
  timetableData[index][name] = date;
  this.setState({createTimetableData:timetableData});
}

renderEditableExamDate = (cellInfo) => {
  const cellValue = this.state.createTimetableData[cellInfo.index].exam_date;

  return (
    <div className="pickerGrid">
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
  <KeyboardDatePicker
  margin="normal"
  autoOk={true}
  id="exam-date"
  label="Exam date"
  inputVariant="outlined"
  format="dd/MM/yyyy"
  value={moment(cellValue).format("YYYY-MM-DD")}
  onChange={(x, event) => this.handleExamDate(x, cellInfo.index, "exam_date")}     
  KeyboardButtonProps={{
  'aria-label': 'change date', 
  }}
  /> </MuiPickersUtilsProvider>
  </div>
);    
};

renderEditableStartTime = (cellInfo) => {
  const cellValue = this.state.createTimetableData[cellInfo.index].exam_date+' '+this.state.createTimetableData[cellInfo.index].start_time;
  return (
    <div className="pickerGrid">
   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          id="start-time"
    label="Start time"
    inputVariant="outlined"
    value={cellValue}
    onChange={(x, event) => this.handleExamTime(x, cellInfo.index, "start_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
  </div>
);    
};

verifyNumber = value => {
  var numberRex = new RegExp("^[0-9]+$");
  if (numberRex.test(value)) {
    return true;
  }
  return false;
};

renderEditableEndTime = (cellInfo) => {
  const cellValue = this.state.createTimetableData[cellInfo.index].exam_date+' '+this.state.createTimetableData[cellInfo.index].end_time;

  return (
    <div className="pickerGrid">
   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          id="end-time"
    label="End time"
    inputVariant="outlined"
    value={cellValue}
    onChange={(x, event) => this.handleExamTime(x, cellInfo.index, "end_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
  </div>
);    
};
renderEditableMax = (cellInfo) => {
  const cellValue = this.state.createTimetableData[cellInfo.index].exam_max_marks;

    return (
      <FormControl fullWidth>
<TextField 
        inputProps={{
         autoComplete: 'off'
         }} 
       onChange={(event)=>this.handleInputChange(cellInfo,event, "exam_max_marks")}
       value={cellValue}
       label="Exam Max marks" 
       type="search" 
       variant="outlined" />
   
    </FormControl>
  );      
};
renderEditableInternal = (cellInfo) => {
  const cellValue = this.state.createTimetableData[cellInfo.index].internal_max_marks;

    return (
      <FormControl fullWidth>
<TextField 
        inputProps={{
         autoComplete: 'off'
         }} 
       onChange={(event)=> this.handleInputChange(cellInfo,event, "internal_max_marks")}
       value={cellValue}
       label="Internal Max marks" 
       type="search" 
       variant="outlined" />
   
    </FormControl>
  );      
};

handleUpdateChange = (cellInfo, event, name) => {
  let data = [...this.state.viewExamTimetable];
  data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
  this.setState({ data });
};

handleUpdateExamDate = (x, index, name) => {
  let timetableData = this.state.viewExamTimetable;
  timetableData[index][name] = moment(x).format('YYYY-MM-DD');
  this.setState({createTimetableData:timetableData});
}

handleUpdateExamTime = (x, index, name) => {
  let timetableData = this.state.viewExamTimetable;
  let date = moment(x).format('HH:mm:ss');
  timetableData[index][name] = date;
  this.setState({createTimetableData:timetableData});
}

renderUpdateExamDate = (cellInfo) => {
  const cellValue = this.state.viewExamTimetable[cellInfo.index].start_date;
  console.log(this.state.viewExamTimetable)
  if(cellInfo.original.editable){
  return (
    <div className="pickerGrid">
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
  <KeyboardDatePicker
  margin="normal"
  autoOk={true}
  id="exam-date"
  label="Exam date"
  inputVariant="outlined"
  format="dd/MM/yyyy"
  value={moment(cellValue).format("YYYY-MM-DD")}
  onChange={(x, event) => this.handleUpdateExamDate(x, cellInfo.index, "exam_date")}     
  KeyboardButtonProps={{
  'aria-label': 'change date', 
  }}
  /> </MuiPickersUtilsProvider>
  </div>
);  
  } 
else{
  return cellValue;
}
};

renderUpdateStartTime = (cellInfo) => {
  const cellValue = this.state.viewExamTimetable[cellInfo.index].start_date+' '+this.state.viewExamTimetable[cellInfo.index].start_time;
  if(cellInfo.original.editable){
  return (
    <div className="pickerGrid">
   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          id="starttime"
    label="Start time"
    inputVariant="outlined"
    value={cellValue}
    onChange={(x, event) => this.handleUpdateExamTime(x, cellInfo.index, "start_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
  </div>
);    
} 
else{
  return moment(cellValue).format("hh:mm A");
}
};



renderUpdateEndTime = (cellInfo) => {
  const cellValue = this.state.viewExamTimetable[cellInfo.index].start_date+' '+this.state.viewExamTimetable[cellInfo.index].end_time;
  if(cellInfo.original.editable){
  return (
    <div className="pickerGrid">
   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          id="endtime"
    label="End time"
    inputVariant="outlined"
    value={cellValue}
    onChange={(x, event) => this.handleUpdateExamTime(x, cellInfo.index, "end_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
  </div>
);    
} 
else{
  return moment(cellValue).format("hh:mm A");
}
};
renderUpdateMax = (cellInfo) => {
  const cellValue = this.state.viewExamTimetable[cellInfo.index].max_marks;
  if(cellInfo.original.editable){
    return (
      <FormControl fullWidth>
<TextField 
        inputProps={{
         autoComplete: 'off'
         }} 
       onChange={(event)=>this.handleUpdateChange(cellInfo,event, "max_marks")}
       value={cellValue}
       label="Exam Max marks" 
       type="search" 
       variant="outlined" />
   
    </FormControl>
  );      
} 
else{
  return cellValue;
}
};
renderUpdateInternal = (cellInfo) => {
  const cellValue = this.state.viewExamTimetable[cellInfo.index].internal_max_marks;

    return (
      <FormControl fullWidth>
<TextField 
        inputProps={{
         autoComplete: 'off'
         }} 
       onChange={(event)=> this.handleUpdateChange(cellInfo,event, "internal_max_marks")}
       value={cellValue}
       label="Internal Max marks" 
       type="search" 
       variant="outlined" />
   
    </FormControl>
  );      
};
handleDeactiveTimetable = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Exam Timetable Deactivated";
     }
     else{
        switchStatus = "Exam Timetable Activated";
     }
     const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id_examtimetable: id,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamsTimetable/deleteExamTimeTable',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">{switchStatus}</h4>
    </div>
  </Dialog>
          ),
        });
        this.getExamTimetable();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  examEdit = (status) => {
    let data = this.state.viewExamTimetable;
    data.map((ele,index)=>{
      if(status == true){
        data[index].editable = false;
      }
      else{
        data[index].editable = true;
      }
    })
    console.log(data)
    this.setState({data});
  }

  handleSelectedSection = (id) => {
    this.getStandardExamTimetable(id);
  }
  
  viewExamTimetable = (id) => {
    this.setState({viewExamTimetable:[], editExamTimetable:[]});
    const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_timetable:this.state.selectedTimetableId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,   
    userrole: this.props.data.type,
    id_academicyear:this.state.selectedAcademicId, 
    id_section:this.props.data.usertype == "student"?this.props.data.standard:id, 
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsTimetable/getClassWiseTimetableDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
           this.setState({viewExamTimetable:response.data, editExamTimetable:response.data});
      }
    }).catch(error => {
      console.log(error);

    });
  }

  updateExamStandards = () => {
    let filtered = this.state.mappedExamStandards;
    let standards=[];
    filtered.map(element=>{
      standards.push(element.id);
    });
    let mapped = standards.join(",");
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id_exam:this.state.selectedExamId,
      selected_standards: mapped,
      token:"abc",
      id_user: this.props.data.UID,
    };
  
    new Service().apiCall('ExamDetails/updateExamStandards',postData).then(response => {
     
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Standards Updated</h4>
    </div>
  </Dialog>
          ),
        });
        this.getExamDetails();
        setTimeout(() => {
          this.setState({ viewAssignedExamClasses:false, basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      alert(error);
    });
  } 

  saveExamTimetable = () => {
    let selectedId = [];
    let ids = "";
    if(this.state.mappedSelectedStandards){
      this.state.mappedSelectedStandards.map(ele=>{
        selectedId.push(ele.id);
      })
    }
    if(selectedId){
      ids = selectedId.join(",");
    }
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      exam_type:'Offline',
      id_exam:this.state.selectedExamId,
      id_sections:ids, 
      role_id:this.props.data.role_id,
      internal_considered:this.state.internalEnabled,
      attendance_considered:this.state.attendanceEnabled,
      parta_grademark_configuration:this.state.gradingConfig,
      partb_grademark_configuration:this.state.gradingConfigPartB,
      subjectmapping:this.state.createTimetableData,
      partamapping:this.state.partamapping,
      partbmapping:this.state.partbmapping,
      token:"abc",
      id_user: this.props.data.UID,
    };

    new Service().apiCall('ExamsTimetable/insertExamTimetable',postData).then(response => {
    console.log(response)
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
        this.getExamTimetable();
        setTimeout(() => {
          window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  } 

  updateTimetable = () => {
   
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      timetableData:this.state.viewExamTimetable,
      role_id:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID,
    };

    new Service().apiCall('ExamsTimetable/updateExamTimeTable',postData).then(response => {
    console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Timetable  Updated</h4>
    </div>
  </Dialog>
          ),
        });
        this.getExamTimetable();
        setTimeout(() => {
          window.location.reload()
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

  getExamTimetable = () => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,   
    id_academicyear:this.state.selectedAcademicId,  
    token:"abc",
    id_user: this.props.data.UID,
    usertype:this.props.data.usertype,
    id_section:this.props.data.usertype == "student"?this.props.data.standard:"",  
    role_id: this.props.data.role_id,
    type:"Offline"
    };
    new Service().apiCall('ExamsTimetable/getMainTimetableDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({examTimetableList:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({examTimetableList:newArray});
        }

      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  getStandardSubjects = (id) => {
    this.setState({selectedExamStandardId:id});
    let selectedId = [];
    let ids = "";
    if(this.state.mappedSelectedStandards){
      this.state.mappedSelectedStandards.map(ele=>{
        selectedId.push(ele.id);
      })
    }
    if(selectedId){
      ids = selectedId.join(",");
    }
  const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicId,
    standard_id: [selectedId.join(",")],
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('SubjectStandards/getData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          let timetableData = [];
          response.data.forEach(element => {
              timetableData.push({id_subject_master:element.id, id_subject:element.id, subject_name:element.name,exam_date:moment().format("YYYY-MM-DD"),start_time:moment().format("HH:mm:ss"),end_time:moment().format("HH:mm:ss"), exam_max_marks:'',internal_max_marks:'',invigilator:''});
            
          });
          this.setState({standardSubjects:response.data, createTimetableData:timetableData});

      }
    }).catch(error => {
      console.log(error);

    });
}

  handleSelectedBatch = (index, status)=>{
    let batches = this.state.batchList;
    batches[index].checked = !status;
    let selected = [];
    batches.map(element=>{
      if(element.checked){
        selected.push(element);
      }
    })
    this.setState({batchList:batches, selectedBatches:selected});
  }

  handleSelectedExamBatch = (index, status)=>{
    let batches = this.state.mappedExamBatches;
    batches[index].checked = !status;
    this.setState({mappedExamBatches:batches});
  }

  getBatchMapped = (id) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicId,
    id_batch:id,
    token:"abc",
    id_user: this.props.data.UID,
    type:"ams"
    };
    new Service().apiCall('ExamDetails/getExamBatchesMappedDetails',postData).then(response => {
    //  console.log(response);
      if (response.status==200 && response.data!='') {
       
        const newArr = response.data.map(v => ({...v, checked: false}));
        this.setState({mappedBatchList:newArr});
        console.log(newArr);
      }
      else{
        this.setState({mappedBatchList:[]});
      }
 
    }).catch(error => {
      console.log(error);

    });
  }

  getMappedExamBatches = (batches) => { 
      let mapped = batches.split(",");
      let batchList = this.state.batchList;
      batchList.map((element,index)=>{
        if(mapped){
          if (mapped.some(stdid => stdid === element.id)) {
            element.checked = true;
          }
          else{
            element.checked = false;
          }
        }
      })
      this.setState({mappedExamBatches:batchList});
  }

  handleAddChip = (chip) => {
    this.setState(state => ({ tags: [...state.tags, chip] }));
  }

  handleDeleteChip = (chip,i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddSubChip = (chip) => {
    this.setState(state => ({ subtags: [...state.subtags, chip] }));
  }

  handleDeleteSubChip = (chip,i) => {
    const { subtags } = this.state;
    this.setState({
      subtags: subtags.filter((tag, index) => index !== i),
    });
  }

  selectCategory = (val,id) => {
    this.setState({selected_category:id});
  }

  refreshData = () => {  
      this.getExamTimetable();
  }

  refreshSubData = () => {  
    this.getExamTimetable();
}
setLevel = (val) =>{
  this.setState({menuLevel:val})
}

getBatchDetails = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,
  id_academicyear:this.state.selectedAcademicId,
  token:"abc",
  userrole: this.props.data.type,
  id_user: this.props.data.UID,
  type:"ams"
  };
  new Service().apiCall('ExamDetails/getExamBatchesDetails',postData).then(response => {
    if (response.status==200 && response.data!='') {
    //  console.log(response.data);
      const newArr = response.data.map(v => ({...v, checked: false}));
      this.setState({batchList:newArr});
    }

  }).catch(error => {
    console.log(error);

  });
}

getStudentInfo = (id) => {
  let students = this.state.allStudents;
  let data = "";
  students.forEach(element => {
    if (element.UID === id) {
      data = element.name+" "+String.fromCharCode(9679)+" "+element.UID+" "+String.fromCharCode(9679)+" "+element.standard_name+" "+element.section_name;
    }
});
return data;
}

getExamDetails = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,   
  id_academicyear:this.state.selectedAcademicId,  
  token:"abc",
  active:1,
  userrole: this.props.data.type,
  role_id: this.props.data.role_id,
  id_user: this.props.data.UID,
  type:'offline'
  };
  new Service().apiCall('ExamDetails/getExamDetails',postData).then(response => {
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({examList:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({examList:newArray});
      }
      
    }
  }).catch(error => {
    this.showError(error.response.data)
  });
}

getAllStudentDetails = () => {  
  const postData = {
  id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  token:"abc",
  id_user: this.props.data.UID,
  id_board:this.state.selectedBoardId,
  id_academicyear:this.state.selectedAcademicId,
  };
  new Service().apiCall('students/getData',postData).then(response => {
    if (response.status==200 && response.data!='') {
      const studentsList = response.data.map((data) => {
        return {...data, checked: this.state.mappedBatchList.some(d => d.id_user === data.UID)?true:false};
    });
      this.setState({ allStudents:studentsList,studentsData: studentsList, studentsTotal: response.data.length  });
    }
    else{
      this.setState({  allStudents:[],studentsData: []})
    } 
  }).catch(error => {
    alert(error);

  });
}

handleSelecteSidebardSection = (id,name) => {
  this.viewExamTimetable(id);
}

sidebarStandardSections = () => {
  return(
    <StandardSectionsList
    board_id={this.state.selectedBoard}
    type="sidebar"
    viewMapped={true}
    showBadge={false}
    viewcount="student" 
    institute_id={this.state.selectedInstitutionId}
    academic_id={this.state.selectedAcademicId}
    active={this.state.searchStudent ? true : false}
    handleSelectedSection={this.handleSelecteSidebardSection}
    {...this.props}
  /> 
  )
}

updateBatch = () => {
  let filtered = this.state.studentsData;
  let batchMapped=[];
  filtered.map(element=>{
    if(element.checked == true){
      batchMapped.push(element.UID);
    }
  });

  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicId,
    mappedstudents: batchMapped, 
    token:"abc",
    id_batch: this.state.selectedBatchId,
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ExamDetails/updateBatchStudents',postData).then(response => {
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Batch Updated</h4>
  </div>
</Dialog>
        ),
      });
      this.getBatchDetails();
      this.getBatchMapped(this.state.selectedBatchId);
      setTimeout(() => {
        this.setState({ basicNotify:false,  createBatchPanel:false, studentPanel:false});
      }, 2000) 
    }
  }).catch(error => {
    alert(error);
  });
} 

selectAll = () => {   
  let lstudents = this.state.studentsData;
  lstudents.map((element,index) => {
    if(this.state.checkAll){
      lstudents[index].checked = false;
    }
    else{
      lstudents[index].checked = true;
    }
     
  });
  this.setState({classwiseStudent:lstudents, checkAll: this.state.checkAll});
}

handleStudent(key,status){

  let lstudents = this.state.studentsData;
  let count = 0;
  lstudents[key].checked = !status;
  lstudents.map((element,index) => {
        if(element.checked == true){
          count++;
        }
  });
  if(count == this.state.studentsTotal){
    this.setState({checkAll:true});
  }
  else{
    this.setState({checkAll:false});
  }
  this.setState({classwiseStudent:lstudents});
}

  componentDidMount() {
      this.getBatchDetails();
      this.getExamDetails();
      this.getExamTimetable();
      this.getAllStudentDetails();
  }

  render() {
    const width = window.innerWidth;
    const width30p =  width * (30/100)+"px";
    const width50p =  width * (50/100)+"px";
    const width100p =  width +"px";
    const level1 = this.state.menuLevel == 1 ? width30p : "";
    const level2 = this.state.menuLevel == 2 ? width50p : "";
    const Inst1 = this.state.menuLevel == 1 ? 12: "";
    const Inst2 = this.state.menuLevel == 2 ? 6 : "";
  return (
    <Fragment>
       {this.state.basicNotify}
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/exam-schedule")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">  
              Exam Timetable
            </Typography>  
               </Grid>
             
            </Grid>
          </Toolbar>
        </AppBar>
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <div  className="pt-100"> 

      <Grid container justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        {AuthHelper('Exam Scheduling','can_create') &&    <Card className="card-box  mb-3 mt-2 p-3">
        
        <Grid container justify="center">
                 
                        <Grid item xs={12} sm={12} md={8} className="autocompleteDiv">
                        <FormControl fullWidth>
                        <Autocomplete
                        id="exams-list"
                        onChange={this.searchExam}   
                        options={this.state.examList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Search exam title from exam master" variant="outlined" />} 
                        />
                        </FormControl>
                  </Grid> 
                  </Grid>
      

        { this.state.examType.toLowerCase() == "offline" && this.state.mappedExamStandards && <Grid container justify="center">
               <Grid item xs={12} sm={12} md={10} className="mt-4 customDiv">
               <OutlinedDiv label="Select standard">
                 <Paper component="ul">
                 {this.state.mappedSelectedStandards.map((data,i) => {
              let icon="";
            return (
            <li key={data.id}>
            <Chip
            className="mr-2"
            icon={icon}
            variant="outline"
            color="secondary"
            onDelete={()=>this.handleMappedStandardDelete(i)}
            label={data.name}
            />
            </li>
            );
            })}
            <li onClick={()=>{this.setState({mappedStandardPanel:true});}}>
            <Chip
            className="mr-2"
            variant="outline"
            color="primary"
            label={this.state.mappedSelectedStandards.length > 0 ? "Change Standard" : "Select Standard"}
            />
            </li>
                 </Paper>
               </OutlinedDiv>
               </Grid>
               </Grid>}  

               {this.state.mappedSelectedStandards.length > 0 &&  <Grid container>
                <Grid item xs={12} sm={12} md={1}></Grid>
                <Grid item xs={12} sm={12} md={10} className="gridBorderGrading">
                <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                      <Grid container>
                          <Grid item xs={12} sm={12} md={6} style={{margin:'auto'}}>
                          Internal considered?
                          </Grid>
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                       
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.internalEnabled === "1"}
                          onChange={() => this.handleChangeInternalEnabled("1")}
                          value="Yes"
                          name="radio button enabled"
                          aria-label="A"
                        
                        />
                      }
                   
                      label="Yes"
                    />
                
                          </Grid>
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                        
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.internalEnabled === "0"}
                          onChange={() => this.handleChangeInternalEnabled("0")}
                          value="No"
                          name="radio button enabled"
                          aria-label="A"
                        
                        />
                      }
                     
                      label="No"
                    />
                  
                          </Grid>
                      </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                      <Grid container>
                          <Grid item xs={12} sm={12} md={6} style={{margin:'auto'}}>
                          Attendance considered?
                          </Grid>
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                         
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.attendanceEnabled === "1"}
                          onClick={() => {this.handleChangeAttendanceEnabled("1"); this.setState({attendanceEligibilityPanel:true})}}
                          value="Yes"
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                    
                      label="Yes"
                    />
                  
                          </Grid>
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                        
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.attendanceEnabled === "0"}
                          onChange={() => this.handleChangeAttendanceEnabled("0")}
                          value="No"
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                     
                      label="No"
                    />
                
                          </Grid>
                      </Grid>
                </Grid>
                </Grid>
                </Grid>
                </Grid>}

               {this.state.mappedSelectedStandards.length > 0 &&   <Grid container justify="center">

                <Grid item xs={12} sm={12} md={10} className="customDiv mt-4">
                <Grid container>
                <Grid item xs={12} sm={12} md={4}>
                <Paper component="ul">
            
            <li onClick={()=> this.setState({gradingRangePanel:true, addViewTimetable:'Create'})}>
            <Chip
            variant="outline"
            color="secondary"
            label="Grade/Mark configuration"
            />
            </li>
            </Paper>
                  </Grid> 
                <Grid item xs={12} sm={12} md={8}>
                     
                </Grid>
                </Grid>
                </Grid>
                </Grid>}   

                {this.state.partamapping.length > 0 && this.state.partamapping.some(data => data.grade != "" || data.min_score != "" || data.max_score != "") && <Grid container>
                    <Grid item xs={12} sm={12} md={1}></Grid>
                    <Grid item xs={12} sm={12} md={10} style={{textAlign:'right'}}>
                    <Button  color="secondary" variant="outlined" onClick={()=>this.setState({addTimetablePanel:true})}>Next</Button>
                </Grid>
                   </Grid>}
      
        </Card>}

        </Grid>

        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-4 p-3 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Exams List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.refreshData()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.refreshData()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.refreshData()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

      data={
      this.state.examTimetableList.map((original,key) => {
      return ({
        slno: key+1,
        id_exam:original.id,
        exam_name: original.name,
        standard:original.standard,
        from_date:moment(original.start_date).format('DD/MM/YYYY'),
        to_date:moment(original.end_date).format('DD/MM/YYYY'),
        id_section:original.id_section,
        editable:original.editable,
        status:original.status,
        actions: (
          // we've added some custom button actions
          <div className="grouplist-actions">
            { /* use this button to add a like kind of action */ }
          
            <Tooltip
              id="tooltip-viewexam"
              title="View"
              placement="top"

            >
              <Button                  
                simple
                onClick={()=> {this.setState({viewExamTimetablePanel:true,selectedTimetableId:original.id})}} 
                color="secondary"
                className="edit"
              >
                <ViewIcon  />
              </Button>
            </Tooltip>
                          
            {/* use this button to remove the data row */}
            
            {AuthHelper('Exam Scheduling','can_delete') &&  <Tooltip
              id="tooltip-deactivate"
              title={original.status == 1 ? "Deactivate":"Activate"}
              placement="top"
            >
            <FormControlLabel
              control={
                <Switch
                  checked={original.status == 1 ? true:false}
                  onChange={() => this.handleDeactiveTimetable(original.id, original.status)}
                  value="checkedA"
                
                />
              }
            
              label=""
            />
            </Tooltip>}

    </div>
  )
})
})
}
filterable
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
  Header: "Exam Name",
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
  Cell:this.renderEditable
},

  {
    Header: "From Date",
    width: 100,
    accessor: "from_date",
    className: "center",
    Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="from-date"   
  value={filter ? filter.value : ''}
  placeholder="Search Date"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
    )
    },
    {
      Header: "To Date",
      width: 100,
      accessor: "to_date",
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="to-date"   
    value={filter ? filter.value : ''}
    placeholder="Search Date"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
      },

  {
    Header: "Actions",
    width: 150,
    accessor: "actions",
    className: "center",
    sortable: false,
    filterable: false,
  }
  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    {AuthHelper('Exam Scheduling','can_export') && <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
      <Button   variant="outlined" color="secondary" href={Config.url+"/ExamsTimetable/excelMainExamData?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId+"&type=offline"}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card>
        </Grid>
        </Grid>

</div>
    </Animated>
    </Dialog>
    <Drawer

anchor="right"
open={this.state.mappedStandardPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({mappedStandardPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({mappedStandardPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
<StandardSectionsList
        board_id={this.state.selectedBoardId}
        type="checkbox"
        institute_id={this.state.selectedInstitutionId}
        academic_id={this.state.selectedAcademicId}
        mappedstandards={this.state.mappedSelectedStandards}
        filterStandards={this.state.mappedExamStandards}
        onSelected={this.handleMappedSelected}
        {...this.props} 
      />
</Card> 
<Grid container>
<Grid item xs={12} md={12} lg={12} className="text-right">
<Button color="secondary" variant="outlined" onClick={()=>{this.setState({ mappedStandardPanel: false});this.getStandardSubjects()}}>
  Submit
</Button>
</Grid>
</Grid>        
</div>
</PerfectScrollbar>
</Box>
</Drawer> 

<Drawer

anchor="right"
open={this.state.viewAssignedExamClasses}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignedExamClasses:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignedExamClasses:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
<StandardSectionsList
                    board_id={this.state.selectedBoardId}
                    type="checkbox"
                    institute_id={this.state.selectedInstitutionId}
                    academic_id={this.state.selectedAcademicId}
                    onSelected={this.handleMappedStandardSelected}
                    mappedstandards={this.state.mappedExamStandards}
                    {...this.props} 
                    />
</Card> 
<Grid container>
<Grid item xs={12} md={12} lg={12} className="text-right">
<Button color="secondary" variant="outlined" onClick={()=>this.updateExamStandards()}>
  Update
</Button>
</Grid>
</Grid>        
</div>
</PerfectScrollbar>
</Box>
</Drawer> 

<Drawer

anchor="right"
open={this.state.viewAssignedBatches}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignedBatches:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: level1+level2}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignedBatches:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View/Edit Batch
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container>
          <Grid item sm={Inst1+Inst2} md={Inst1+Inst2} lg={Inst1+Inst2}>
          
     
        
          {this.state.mappedExamBatches.map((data,i) => (
              <Card className="card-box p-3  mb-4 customNoData">
            
              <Grid container>
              <Grid item xs={12} sm={12} md={2}>
              <FormControlLabel
                          control={
                            <Checkbox
                            
                              tabIndex={-1}
                              onChange={()=>this.handleSelectedExamBatch(i, data.checked)}
                              checked={data.checked}
                            />
                          }
                          label=""
                        />
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{margin:'auto'}}>
                   <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}> {data.name}</div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="textRight" style={{margin:'auto'}}>
              <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}><Chip size="small" variant="outlined" color="secondary" label={data.count} /></div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="pickerGrid" style={{margin:'auto'}}>
              <Avatar style={{cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}>  
                <NavigateNext />
                </Avatar>
              </Grid>
              </Grid>

              </Card>
               
          ))}
          <Card className="card-box p-3  mb-4 customNoData">
             
               <Grid container>
               <Grid item xs={12} sm={12} md={12} className="textRight">
                 <Button className="successBtnOutline" variant="outlined" size="small" onClick={()=>this.setState({createBatchPanel:false})}>Submit</Button>
               </Grid>
               </Grid>
               
               </Card>
          </Grid>
         {this.state.navPanel && <Grid item sm={6} md={6} lg={6}>
         <Grid container>
         <Grid item xs={12} sm={12} md={12}>
         <Card className="card-box p-3  mb-4 customNoData">
         
                <div><Button color="primary" variant="outlined" style={{width:'100%'}}  onClick={() => {this.setState({studentPanel:true});this.getAllStudentDetails();}}>{this.state.mappedBatchList.length > 0 ? "Add more students" : "Add Students"}</Button></div>
         
          </Card>  
         </Grid>
        </Grid>  
         {this.state.mappedBatchList.length > 0 && 
            <div>
            <Grid container>
            <Grid item xs={12} sm={12} md={12}>
            <Card className="card-box p-3  mb-4 customNoData">
            <ul className="suggestions" style={{boxShadow:'none',padding:0}}> 
            {this.state.mappedBatchList.map((element,index) => {
               return(
                <li key={element.id}>
                  {index+1}.  { this.getStudentInfo(element.id_user)} 
                </li>
               ) 
            })}
            </ul>
        
           
            </Card>
            </Grid>
          </Grid>
        
          </div>
            }
          </Grid>}
          </Grid>

</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.gradingRangePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({gradingRangePanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({gradingRangePanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Grade/Mark configuration
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container>   
          <Grid item xs={12} sm={12} md={12}>
          <Card className="card-box p-3  mb-4">
            
          <Grid container> 
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                         <strong>Part A</strong>
                          </Grid>
                          <Grid item xs={12} sm={12} md={4} style={{margin:'auto'}}>
                         
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradingConfig === "Marks"}
                          onChange={() => this.handleGradingConfig("Marks")}
                          value="Marks"
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                      
                      label="Marks"
                    />
               
                          </Grid>
                          <Grid item xs={12} sm={12} md={5} style={{margin:'auto'}}>
                         
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradingConfig === "Grading"}
                          onChange={() => this.handleGradingConfig("Grading")}
                          value="Grading"
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                     
                      label="Grading"
                    />
                 
                          </Grid>
                      </Grid>
            
            </Card>
           { (this.state.gradingConfig=="Grading" ||  this.state.gradingConfig=="Marks") &&  <Card className="card-box p-3  mb-4">
           

              {this.state.partamapping.map((data, idx) => (
     <Grid container>
      <Grid item xs={12} sm={10} md={4} className="inputMargin">
           <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      inputRef={this.textInput} 
                      id={"parta-list"+idx}   
                      value={data.grade}
                      label={this.state.gradingConfig=="Grading"?"Grade":"Division"}
                      placeholder={this.state.gradingConfig=="Grading"?"A+, A etc...":"First class etc..."}
                      type="search" 
                      onChange={(event) => this.handleChangePartA(idx,"grade",event.target.value.replace(/[^A-Za-z]/g, ""))}
                      variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={10} md={3} className="inputMargin">
      
          <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      id={"min-marks"+idx} 
                      value={data.min_score}
                      label="Min marks" 
                      type="search" 
                      onChange={(event) => this.handleChangePartA(idx,"min_score",event.target.value.replace(/\D/g, ""))}
                      variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={10} md={3} className="inputMargin">
        <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      id={"max-marks"+idx}   
                      value={data.max_score}
                      label="Max marks" 
                      type="search" 
                      onChange={(event) => this.handleChangePartA(idx,"max_score",event.target.value.replace(/\D/g, ""))}
                      variant="outlined" />
        </Grid>

        <Grid item xs={12} sm={10} md={2} style={{textAlign:'center'}}>
                      { idx == 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 
                      
                      id={"add"+idx}   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handleAddPartA(); this.focusTextInput();
                      }
                      }}
                      className="m-2"
                      InputProps={{
                      autoComplete: 'off', 
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start" >
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handleAddPartA(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 
                      disabled={this.state.editStaff ? false : true}
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removePartAHolder(idx); 
                      }
                      }}
                      className="m-2"
                      id={"remove"+idx}     
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start" disabled={this.state.editStaff ? false : true}>
                      <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Del" 
                      onClick={()=>{this.removePartAHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
        </Grid>
        ))}

            </Card>}


          {this.state.gradingConfig!==""  &&      <Card className="card-box p-3  mb-4">
           
             <Grid container>
                          <Grid item xs={12} sm={12} md={3} style={{margin:'auto'}}>
                         <strong>Part B</strong> 
                          </Grid>
                          <Grid item xs={12} sm={12} md={4} style={{margin:'auto'}}>
                         
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradingConfigPartB === "Configure"}
                          onChange={() => this.handleGradingConfigPartB("Configure")}
                          value="Configure"
                          name="radio button enabled"
                          aria-label="A"
                        
                        />
                      }
                     
                      label="Configure"
                    />
                 
                          </Grid>
                          <Grid item xs={12} sm={12} md={5} style={{margin:'auto'}}>
                        
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradingConfigPartB === "NA"}
                          onChange={() => this.handleGradingConfigPartB("NA")}
                          value="NA"
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                     
                      label="NA"
                    />
                
                          </Grid>
                      </Grid>
       
            </Card>}
            { this.state.gradingConfigPartB=="Configure" &&   <Card className="card-box p-3  mb-4">
        
              
              {this.state.partbmapping.map((data, idx) => (
     <Grid container>
     
        <Grid item xs={12} sm={10} md={4} className="inputMargin">
           <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      inputRef={this.textInput} 
                      id={"grade"+idx}     
                      value={data.grade}
                      label="Grade" 
                      placeholder="A+, A etc..."
                      type="search" 
                      onChange={(event) => this.handleChangePartB(idx,"grade",event.target.value.replace(/[^A-Za-z]/g, ""))}
                      variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={10} md={3} className="inputMargin">
           <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      id={"min"+idx}     
                      value={data.min_score}
                      label="Min marks" 
                      type="search" 
                      onChange={(event) => this.handleChangePartB(idx,"min_score",event.target.value.replace(/\D/g, ""))}
                      variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={10} md={3} className="inputMargin">
           <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      className="m-2"
                      id={"max"+idx}     
                      value={data.max_score}
                      label="Max marks" 
                      type="search" 
                      onChange={(event) => this.handleChangePartB(idx,"max_score",event.target.value.replace(/\D/g, ""))}
                      variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={10} md={2} style={{textAlign:'center'}}>
                      {idx == 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 
                      id={"addgrade"+idx}    
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handleAddPartB(); this.focusTextInput();
                      }
                      }}
                      className="m-2"
                      InputProps={{
                      autoComplete: 'off', 
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start" >
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handleAddPartB(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removePartBHolder(idx); 
                      }
                      }}
                      id={"removegrade"+idx}     
                      className="m-2"
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} />
                      </InputAdornment>
                      ),
                      }}
                      label="Del" 
                      onClick={()=>{this.removePartBHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
        </Grid>
        ))} 
            </Card>}

           <Grid container>
              <Grid item xs={12} sm={12} md={12} style={{textAlign:'right'}}>
                  <Button color="secondary" variant="contained"  onClick={()=>this.setState({gradingRangePanel:false})}>Submit</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid> 
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.addTimetablePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({addTimetablePanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({addTimetablePanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Exam timetable
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container>
<Grid item xs={12} sm={12} md={1}></Grid>
<Grid item xs={12} sm={12} md={10} className="outlinedInput">
<Card className="card-box  mb-4 customNoData customPadding">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Timetable
                </h4>
              </div>
             
            </div>
    <ReactTable 
data={
this.state.createTimetableData.map((original,key) => {
return ({
  id: key+1,
  index:key,
  name: original.subject_name,
  exam_date:original.exam_date,
  start_time:original.start_time,
  end_time:original.end_time,
  exam_max_marks:original.exam_max_marks,
  internal_max_marks:original.internal_max_marks,
})
})
}
minRows={0}
columns={[
{
Header: "S No",
accessor: "id",
width: 80,
className: "center",
},
{
Header: "Subject",
accessor: "name",
className: "center",
},

{
  Header: "Exam Date",
  accessor: "name",
  className: "center",
  Cell: this.renderEditableExamDate
  },
  {
    Header: "Start Time",
    accessor: "name",
    className: "center",
    Cell: this.renderEditableStartTime
    },
    
    {
      Header: "End Time",
      accessor: "name",
      className: "center",
      Cell: this.renderEditableEndTime
      },
      {
        Header: "Exam Max Marks",
        accessor: "name",
        className: "center",
        Cell: this.renderEditableMax
        },
        {
          Header: "Internal Max Marks",
          accessor: "name",
          className: "center",
          show: this.state.internalEnabled==1?true:false,
          Cell: this.renderEditableInternal
        },
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop={false}
showPaginationBottom={false}
className="-striped -highlight"
/>

    <CardActions>
    <Grid container>
<Grid item xs={12} sm={12} md={12} className="text-right">
    <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.saveExamTimetable()}>
      Submit
    </Button>
    </Grid>
    </Grid>
  </CardActions>
  </Card>
</Grid>
</Grid>
</div>
</PerfectScrollbar>
</Box>
</Drawer>



<Drawer

anchor="right"
open={this.state.viewExamTimetablePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewExamTimetablePanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewExamTimetablePanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Exam timetable
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container>
<Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid>
 <Grid item xs={12} md={8} lg={9}>
<Grid container>
<Grid item xs={12} sm={12} md={1}></Grid>
<Grid item xs={12} sm={12} md={10} className="outlinedInput">
<Card className="card-box  mb-4 px-3 pb-3 pt-1 customNoData customPadding">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  View Timetable
                </h4>
              </div>
             
            </div>
    <ReactTable 
data={
this.state.viewExamTimetable.map((original,key) => {
return ({
  id: key+1,
  index:key,
  name: original.subject_name,
  exam_date:original.start_date,
  start_time:moment(original.start_date+' '+original.start_time).format("hh:mm A"),
  end_time:moment(original.start_date+' '+original.end_time).format("hh:mm A"),
  exam_max_marks:original.max_marks,
  internal_max_marks:original.internal_max_marks,
  editable:original.editable,
})
})
}
minRows={0}
columns={[
{
Header: "S No",
accessor: "id",
width: 80,
className: "center",
},
{
Header: "Subject",
accessor: "name",
className: "center",
},

{
Header: "Exam Date",
accessor: "exam_date",
className: "center",
Cell:this.renderUpdateExamDate
},
{
Header: "Start Time",
accessor: "start_time",
className: "center",
Cell:this.renderUpdateStartTime
},

{
Header: "End Time",
accessor: "end_time",
className: "center",
Cell:this.renderUpdateEndTime
},
{
Header: "Exam Max Marks",
accessor: "exam_max_marks",
className: "center",
Cell:this.renderUpdateMax
},
{
Header: "Internal Max Marks",
accessor: "internal_max_marks",
className: "center",
show: this.state.internalEnabled==1?true:false,
Cell:this.renderUpdateInternal
},
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop={false}
showPaginationBottom={false}
className="-striped -highlight"
/>
<Grid container className="mt-2">
             
             <Grid item xs={12} lg={12} className="py-1 text-right">
             { !this.state.editExam && AuthHelper('Exam Scheduling','can_edit') &&  <Button className="mx-2"  variant="outlined" onClick={()=>{this.setState({editExam:true});this.examEdit(false)}} color="primary">
                          Edit
             </Button>}
         { this.state.editExam  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>{this.setState({editExam:false});this.examEdit(true)}}>Cancel</Button>
     
               <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}}  onClick={()=>this.updateTimetable()}>
                          Submit
               </Button>
               </div>}
             </Grid>
             </Grid> 

  </Card>
</Grid>
</Grid>
</Grid>
</Grid>
</div>
</PerfectScrollbar>
</Box>
</Drawer>
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
