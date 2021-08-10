import React, { Fragment } from 'react';
import {Dialog,Grid,Switch,FormControlLabel,FormControl,IconButton,Chip,Paper,Divider,Card,CardContent,Drawer,CardActions,TextField,Button,AppBar,Box,Avatar,List,ListItem,Toolbar,Checkbox,MenuItem,Radio,InputAdornment,Typography,Tooltip} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import ReactTable from 'react-table-6';
import CloseIcon from '@material-ui/icons/Close';
import Clear from "@material-ui/icons/Clear";
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import NavigateNext from "@material-ui/icons/NavigateNext";
import ViewIcon from "@material-ui/icons/Visibility";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import { ExampleWrapperSimple } from '../../../../layout-components';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import { connect } from 'react-redux';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
import Config from '../../../../config';

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
const fileMotherInput = React.createRef();
const fileFatherInput = React.createRef();
const fileGuardInput = React.createRef();
const fileBirthInput = React.createRef();
const fileAadhaarInput = React.createRef();
const fileTransferInput = React.createRef();
const fileMarksInput = React.createRef();

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      selectedPeriod:'',
      selectedSubject:'',
      frequencySettings:[],
      attendanceType:'onceaday',
      periodList:[],
      subjectList:[],
      filteredStudents:[],
      mappedAttendance:[],
      frequencyChipData:[],
      marking_type:"regular_student_attendance",
      alert: null,
      currentForm:'student_details',
      showonceaday:true,
      showtwiceaday:true,
      selectedDate: new Date(),
      showMappedTable:false,
      showperiodwise:true,
      standardSections:[],
      staffSearchResults:[],
      sectionSuggestions:[],
      studentSuggestions:[],
      SelectedFrequencyStandards:[],
      mappedStaffAttendance:[],
      staffSuggestions:[],
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '',
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      basicNotify:false,
      allStudents:true,
      searchStudent:false,
      selectedSession:'session1',
      period:'',
      subject_id:'',
      notice:false,
      timetableData:[],
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  focusTextInput() {
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  removeSelected(i) {
    const { filteredStudents } = this.state;
    this.setState({
      filteredStudents: filteredStudents.filter((data, index) => index !== i),
    });
  }

  renderSelectedFrequencyStandards = (type) => {
    this.resetData();
    let lstdsections = this.state.frequencySettings;
    console.log({lstdsections});
    let chipData=[];
    let selectedstandards=[];
    lstdsections.map(element=>{
      if(element.type == type){
        selectedstandards.push(element);
      }
   });
   console.log("selectedstandards"+JSON.stringify(selectedstandards))
   this.setState({SelectedFrequencyStandards: selectedstandards});
  }
  renderSelectedFrequencyStandardsTwiceaday = (type) => {
    this.resetData();
    let lstdsections = this.state.frequencySettings;
    console.log({lstdsections});
    let chipData=[];
    let selectedstandards=[];
    lstdsections.map(element=>{
      if(element.type == type){
        selectedstandards.push(element);
      }
   });
   console.log("renderSelectedFrequencyStandardsTwiceaday"+JSON.stringify(selectedstandards))
   this.setState({SelectedFrequencyStandards: selectedstandards});
  }

  insertStudentRegularAttendance = () => {
    let filtered = this.state.mappedAttendance;
    let filteredStudents=[];
    filtered.map(element=>{
      if(element.status == false){
        filteredStudents.push(element.UID);
      }
    }); 
    this.setState({filteredStudentsCount:filteredStudents.length})
    let session=this.state.selectedSession;
  
    let selecteddate = moment(this.state.selectedDate).format('YYYY-MM-DD');
  let selectedStudentData = filteredStudents.join(",");
  if(this.state.attendanceType=='periodwise' && this.state.period==''){
    session='';
    this.setState({
      basicNotify: (
        <Dialog open={true}>
<div className="text-center p-5">
  <h4 className="font-weight-bold">Please Select Period</h4>
</div>
</Dialog>
      ),
    });
    setTimeout(() => {
      // window.location.reload();
      this.setState({basicNotify:false});
    }, 2000) 
  }else{
  
  
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      attendance_type:"regularstudent",
      type:"student",
      attendance_date:selecteddate,
      absentlist:selectedStudentData,
      selectedstandard:this.state.selectedRegularStandard,
      frequency:this.state.attendanceType,
      session:session,
      period:this.state.period,
      id_subject:this.state.subject_id,
      token:"abc",
      id_user: this.props.data.UID,
    };
    //console.log('post'+postData.selectedstandard);return false;
    new Service().apiCall('AttendanceDetails/insertAttendanceDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      {/* <h4 className="font-weight-bold">Attendance Added Successfully</h4> */}
      <h4 className="font-weight-bold">Students Absent Count {this.state.filteredStudentsCount}</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
          // window.location.reload();
          this.setState({basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      console.log(error);
    });
  }
  } 

  insertStaffRegularAttendance = () => {
    let filtered = this.state.mappedStaffAttendance;
    let filteredStaff=[];
    filtered.map(element=>{
      if(element.status == false){
        filteredStaff.push(element.UID);
      }
    }); 

   this.setState({filteredStaffCount:filteredStaff.length})
    let selecteddate = moment(this.state.selectedDate).format('YYYY-MM-DD');
    let selectedStaffData = filteredStaff.join(",");
  
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    attendance_type:"regularstaff",
    type:"staff",
    attendance_date:selecteddate,
    absentlist:selectedStaffData,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('AttendanceDetails/insertAttendanceDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      {/* <h4 className="font-weight-bold">Attendance Added Successfully </h4> */}
      <h4 className="font-weight-bold">Staff Absent Count {this.state.filteredStaffCount}</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000) 
      }
    }).catch(error => {
      console.log(error);
    });
  } 


  insertStaffQuickAttendance = () => {
    let filtered = this.state.staffSearchResults;
    let filteredStaff=[];
    filtered.map(element=>{
        filteredStaff.push(element.UID);
    }); 
  
    let selecteddate = moment(this.state.selectedDate).format('YYYY-MM-DD');
    let selectedStaffData = filteredStaff.join(",");
  
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    attendance_type:"quickstaff",
    type:"staff",
    attendance_date:selecteddate,
    absentlist:selectedStaffData,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('AttendanceDetails/insertAttendanceDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Attendance Added Successfully</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000) 
      }
    }).catch(error => {
      console.log(error);
    });
  } 

  handleStaffSearch = (val) => {
    console.log(val)
    let results = this.state.staffSearchResults.filter(e => e.UID === val.UID).length;
    console.log(results);
    if (this.state.staffSearchResults && results == "0") {
      this.setState({
        staffSearchResults: [...this.state.staffSearchResults, val]
      })
    }
  }

  handleDelete(stdindex, secindex, i) {
    const { frequencyChipData } = this.state;
    let lstdsections = this.state.SelectedFrequencyStandards;
    let chipData = frequencyChipData.filter((item, index) => index !== i);
    lstdsections[stdindex].standards[secindex].checked = false;
    let checked_count = 0;
    lstdsections[stdindex].standards.map((sections)=>{
      if(sections.checked == true){
        checked_count++;
      }
    });
    if(checked_count == 0){
      lstdsections[stdindex].checked = false;
    }
   this.setState({SelectedFrequencyStandards:lstdsections});
    this.setState({
      frequencyChipData: chipData,
    });
    this.getChipData();
  }
  handlePeriodData = (pValue) => {
   

    this.setState({ period: pValue });
    console.log(this.state.period)

  }

  getFreQuencySettings = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Attendance/getAttendanceFrequency',postData).then(response => {
      console.log('getAttendanceFrequency'+JSON.stringify(response));
      if (response.status==200 && response.data!='') {
        var frequncyData = [];
        var allData = [];
        var onceadayCount = 0;
        var twiceaCount = 0;
        var showonceaday = false;
        var showtwiceaday = false;
        var showperiodwise = false;
        var periodwiseCount = 0;
        let attendance_type = "";
        response.data.forEach(element => {
          console.log('sd' + element.type);
          if(frequncyData[element.standard_id]){
            var lSection = {};
            if(element.type){
              lSection.type = element.type;
              lSection.checked = false; 
            }else{
              lSection.type = "";
              lSection.checked = false; 
            }
            if(lSection.type == "onceaday"){
              onceadayCount = onceadayCount + 1;
              lSection.type = element.type;
              lSection.fno = 1;
            }else if(lSection.type == "twiceaday"){
              twiceaCount = twiceaCount + 1;
              lSection.fno = 2; 
            }else if(lSection.type == "periodwise"){
              periodwiseCount = periodwiseCount + 1;
              lSection.fno = 3;
            }
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.assignment_count = element.assignment_count;
            lSection.board_id = element.board_id;
            
            frequncyData[element.standard_id].standards.push(lSection);
          }else{
            var lStandard = {};
            var lSection = {};
            if(element.type){
              lSection.type = element.type;
              lStandard.checked = false;
              lStandard.type = element.type;
              lSection.checked = false;
            }
            else{
              lStandard.checked = false;
              lSection.checked = false;
              lSection.type = "";
              lStandard.type = "";
            }
            if(lSection.type == "onceaday"){
              onceadayCount = onceadayCount + 1;
              lSection.fno = 1;
            }
            else if(lSection.type == "twiceaday"){
              twiceaCount = twiceaCount + 1;
              lSection.fno = 2;
            }
            else if(lSection.type == "periodwise"){
              periodwiseCount = periodwiseCount + 1;
              lSection.fno = 3;
            }
          
            lStandard.standard_name = element.standard_name;
            lStandard.standard_id = element.standard_id;
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.assignment_count = element.assignment_count;
            lSection.board_id = element.board_id;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);
            frequncyData[element.standard_id] = lStandard;   
          }             
        }); 
        if(frequncyData){
          frequncyData.map(ele=>{
            allData.push(ele);
          })
        }
      
        if(onceadayCount > 0 && (twiceaCount == 0 && periodwiseCount == 0)){
          attendance_type = "onceaday";
          showonceaday = true;
        }
        else if(twiceaCount > 0 && (onceadayCount == 0 && periodwiseCount == 0)){
          attendance_type = "twiceaday";
          showtwiceaday = true;
        }
        else if(periodwiseCount > 0 && (onceadayCount == 0 && twiceaCount == 0)){
          attendance_type = "periodwise";
          showperiodwise = true;
        }
        let allFrequencyCount = onceadayCount + twiceaCount + periodwiseCount;
        this.setState({ onceadayCount: onceadayCount, twiceaCount:twiceaCount, periodwiseCount:periodwiseCount, frequencySettings:allData, allFrequencyCount: allFrequencyCount, attendanceType:attendance_type, showonceaday:showonceaday, showtwiceaday:showtwiceaday, showperiodwise:showperiodwise });
      }else{
        this.setState({ frequencySettings:[]});
      }      
    }).catch(error => {
      console.log(error);
    });
  }

  
getChipData = () => {
  let lstdsections = this.state.SelectedFrequencyStandards;
  let chipData=[];
  let pendingData = [];
  lstdsections.map((element,index)=>{
    if(element.checked == true && element.type == this.state.attendanceType){
      element.standards.map((sections,sindex)=>{
        if(sections.checked == true  && sections.type == this.state.attendanceType){
          chipData.push({ stdindex:index, std_id:sections.section_id, secindex: sindex, label: element.standard_name+" "+sections.section_name });
        }
    });
    }
    else{
      element.standards.map((sections,sindex)=>{
          pendingData.push({ stdindex:index, secindex: sindex, label: element.standard_name+" "+sections.section_name }); 
    });
    }
  });
  this.setState({frequencyChipData:chipData});
}

  removeAwardHolder(i) {  
    const { awardHolders } = this.state;
    this.setState({
      awardHolders: awardHolders.filter((award, index) => index !== i),
    });
  }
  handleAddAwardholder = (c) => {
    let lawardholders = this.state.awardHolders;
    let lAwards = {};
    lAwards.award_academic_year='';
    lAwards.area_of_achievement='';
    lAwards.award_remarks='';
    lawardholders.push(lAwards);
    this.setState({awardHolders:lawardholders});
  }

  handleBoard= (type,name,status) => {
    if(type){  
      this.setState({boardChecked:true,selectedFeeBoard:type});	 
      }
      else{
      this.setState({ boardChecked:false,selectedFeeBoard:'' });
      } 
  }

  handleAwardChange = (pIndex,inputName,pValue) => {
    let lAwardHolders = this.state.awardHolders;
    lAwardHolders[pIndex][inputName] = pValue;
    this.setState({awardHolders:lAwardHolders});
  }

  verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  verifyInput = value => {
    var numberRex = new RegExp("^[A-Za-z]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  resetData = () =>{
    this.setState({SelectedFrequencyStandards:[], chipData:[],pendingStandards:[], frequencyChipData:[], showStandards:false, mappedAttendance:[], mappedStaffAttendance:[]})
  }

  handleDateChange = (date) => {
    this.setState({selectedDate:date});
    // this.setState({markdateConfirm:true})
  };

  getStudentDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    token:"abc",
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_user: this.props.data.UID
    };
    new Service().apiCall('Students/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        //console.log(response.data);
        this.setState({studentSuggestions:response.data});
      }
  
    }).catch(error => {
      alert(error);
  
    });
  }

  getStaffMappedAttendance = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    token:"abc",
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    date:moment(this.state.selectedDate).format('YYYY-MM-DD'),
    type:"staff",
    id_user: this.props.data.UID
    };
    new Service().apiCall('AttendanceDetails/getAttendanceMappedDetails',postData).then(response => {
      //console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, status: v.attendance_status == 1 ? true : false}));
        this.setState({mappedStaffAttendance:newArr});
      }
    }).catch(error => {
      alert(error);
  
    });
  }

  handleStandard = (standard_id,index,status) => {
    let lstdsections = this.state.SelectedFrequencyStandards;
    lstdsections.map(element=>{
       if(element.standard_id == standard_id){
         lstdsections[index].checked = !status;
         element.standards.map((sections,sindex)=>{
           lstdsections[index].standards[sindex].checked = !status;
           lstdsections[index].standards[sindex].type = this.state.attendanceType;
         });  
       }
    }); 
    this.setState({SelectedFrequencyStandards:lstdsections});
  }

  handleSection = (section_id,index,sindex,status) => {
    let lstdsections = this.state.SelectedFrequencyStandards;
    lstdsections[index].standards[sindex].checked = !status;
    let total_sections = lstdsections[index].standards.length;
    let checked_count = 0;
    lstdsections[index].standards.map((sections)=>{
      if(sections.checked == true){
        checked_count++;
      }
    });
    if(checked_count == total_sections){
      lstdsections[index].checked = true;
      lstdsections[index].type = this.state.attendanceType;
    }
    else{
      lstdsections[index].type = "";
    }
    this.setState({SelectedFrequencyStandards:lstdsections});
   }
   handleSectionStudent = (section_id,index,sindex,status) => {
    let lstdsections = this.state.SelectedFrequencyStandards;
    lstdsections[index].standards[sindex].checked = !status;
    let total_sections = lstdsections[index].standards.length;
    let checked_count = 0;
    for(let i=0;i<lstdsections.length;i++){
    lstdsections[i].standards.map((sections)=>{
      if(sections.checked == true){
        sections.checked = false;
        checked_count++;
      }
    });
  }
    lstdsections[index].standards[sindex].checked = !status;
    // if(checked_count == total_sections){
    //   lstdsections[index].checked = true;
    //   lstdsections[index].type = this.state.attendanceType;
    // }
    // else{
    //   lstdsections[index].type = "";
    // }
    this.setState({SelectedFrequencyStandards:lstdsections});
    var d = new Date(this.state.selectedDate);
    var weekday = new Array(7);
    weekday[0] = "SUNDAY";
    weekday[1] = "MONDAY";
    weekday[2] = "TUESDAY";
    weekday[3] = "WEDNESDAY";
    weekday[4] = "THURSDAY";
    weekday[5] = "FRIDAY";
    weekday[6] = "SATURDAY";
    this.getTimetable(weekday[d.getDay()], section_id);
    // this.setState({period:'Period1'});

   }

  getStandardSectionDetails() {
    const postData = {
    count:"student",
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
    //  console.log(response);
      if (response.status==200 && response.data!='') {
        var lStandardSections = [];
        var lBoardDetails =[];
        response.data.forEach(element => {
              if(lStandardSections[element.standard_id]){
                  var lSection = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandardSections[element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);

                  lStandardSections[element.standard_id] = lStandard;

              }

        });
        let data =  [];  
           lStandardSections.forEach((element,index )=> {
            data.push({id:index,value:element.standard_name});
        });
      //  console.log(data);
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      alert(error);

    });

  }

  getStaffDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    token:"abc",
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_user: this.props.data.UID
    };
    new Service().apiCall('Staffs/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        //console.log(response.data);
        this.setState({staffSuggestions:response.data});
      }
  
    }).catch(error => {
      console.log(error);
  
    });
  }

  insertStudentQuickAttendance = () => {
    let filtered = this.state.filteredStudents;
    let filteredStudents=[];
    filtered.map(element=>{
      filteredStudents.push(element.UID);
    });
  
    let standards = this.state.frequencyChipData;
    let selectedStandardIds=[];
    standards.map(element=>{
      selectedStandardIds.push(element.std_id);
    });
    let selecteddate = moment(this.state.selectedDate).format('YYYY-MM-DD');
  let selectedStudentData = filteredStudents.join(",");
  let selectedStandardData = selectedStandardIds.join(",");
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      attendance_type:"quickstudent",
      type:"student",
      attendance_date:selecteddate,
      absentlist:selectedStudentData,
      selectedstandard:selectedStandardData,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AttendanceDetails/insertAttendanceDetails',postData).then(response => {
      //console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Attendance Added Successfully</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000) 
      }
    }).catch(error => {
      alert(error);
    });
  } 
  

  getMappedAttendance = (standard_id) => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      selectedstandard:standard_id,
      date:moment(this.state.selectedDate).format('YYYY-MM-DD'),
      type:"student",
      id_user: this.props.data.UID
    };
    //console.log('fg'+postData.id_board);return false;
    new Service().apiCall('AttendanceDetails/getAttendanceMappedDetails',postData).then(response => {
      console.log('students'+response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, status: v.attendance_status == 1 ? true : false}));
        this.setState({mappedAttendance:newArr});
      }else{
        this.setState({mappedAttendance:[]});
      }
    }).catch(error => {
      console.log(error);
      this.setState({mappedAttendance:[]});
      this.setState({
        basicNotify: (
            <Dialog open={true}>
                <div className="text-center p-5">
                    <h4 className="font-weight-bold">Data Not Found</h4>
                </div>
            </Dialog>
        ),
    });
    
    setTimeout(() => {
        this.setState({ basicNotify: false });
    }, 2000)
  
    });
  }


  selectSection = (index, section_id, sindex,standard) => {
    let chipData=[];
    chipData.push({ stdindex:index, std_id:section_id, secindex: sindex, label: standard,checked:true });
    this.setState({frequencyChipData:chipData});

    
  }

  
handleChangeStatus = (index) => {
  let data = this.state.mappedAttendance;
  console.log(data);
  data[index].status = !data[index].status;
    this.setState({
      data
    });
}

handleChangeStaffStatus = (index) => {
  let data = this.state.mappedStaffAttendance;
  console.log(data);
  data[index].status = !data[index].status;
    this.setState({
      data
    });
}

handleStudentSearch = (val) => {
  let filtered = this.state.filteredStudents;
  if(filtered.length > 0 && filtered.some(data => data.id === val.id)){

  } else{
    filtered.push(val);
    this.setState({filteredStudents:filtered});
  }
}

  getTotalStudentCount = (count) => {
    this.setState({TotalStudentCount:count})
  }
  getTimetable(day, id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      date:this.state.selectedDate,
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
   this.getStandardSectionDetails();
   this.getFreQuencySettings();
   this.getStaffDetails();
   this.getStudentDetails();
  
  }

render(){
  const width = window.innerWidth;
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container spacing={2} className="sliderDiv">
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                {/* {this.state.attendanceType!="periodwise" && <div><ListItem>
                    <strong>Quick Attendance</strong>
                </ListItem>
                <ListItem button className={this.state.marking_type == "quick_student_attendance" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({marking_type:'quick_student_attendance'})}}>
                    <span> Student</span>
                  </ListItem>
                  <ListItem button className={this.state.marking_type == "quick_staff_attendance" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({marking_type:'quick_staff_attendance'})}}>
                    <span>Staff</span>
                    <span className="ml-auto badge badge-warning">{this.state.TotalStudentCount}</span>
                  </ListItem>
                  <Divider /></div>}
                 */}
                  <ListItem>
                    <strong>Regular Attendance</strong>
                </ListItem>
                <ListItem button className={this.state.marking_type == "regular_student_attendance" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({marking_type:'regular_student_attendance'})}}>
                    <span>Student</span>
                  </ListItem>
                  <ListItem button className={this.state.marking_type == "regular_staff_attendance" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({marking_type:'regular_staff_attendance'})}}>
                    <span>Staff</span>
                    <span className="ml-auto badge badge-warning">{this.state.TotalStudentCount}</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
       
        {this.state.marking_type == "quick_student_attendance" && <div>
          
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={6}>
        <Card className="card-box pt-3 pb-1 mb-4 customNoData">
        <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={12} className="text-center">
        {/* { this.state.showonceaday > 0 &&   */}
        <FormControlLabel
                     control={
                       <Radio
                         checked={this.state.attendanceType === "onceaday"}
                         onChange={() => {this.setState({attendanceType:'onceaday'}); this.renderSelectedFrequencyStandards('onceaday')}}
                         value="block_wise"
                         name="radio button enabled"
                         aria-label="B"
                      
                       />
                     }
                     label="Once a day"
                   />
                  {/* } */}
                 
       
                 {/* { this.state.showtwiceaday > 0 &&     */}
                 <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType === "twiceaday"}
                       onChange={() => {this.setState({attendanceType:'twiceaday'});this.renderSelectedFrequencyStandards('twiseaday')}}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                       
                        
                       />
                     }
                    
                     label="Twice a day"
                   />
                   {/* } */}

                {/* { this.state.showperiodwise > 0 &&    */}
                <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType === "periodwise"}
                       onClick={() => {this.setState({attendanceType:'periodwise'});this.renderSelectedFrequencyStandards('periodwise')}}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                         
                        
                       />
                     }
                    
                     label="Periodwise"
                   />
                   {/* } */}
                   </Grid>
                   </Grid>
        </Card></Grid> 
        </Grid> 

        {this.state.attendanceType !='' &&  
        <Grid container spacing={4} justify="center">
          <Grid item xs={12} md={8} lg={10}>
            <Card className="card-box p-3  mb-4">
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={6} className="pickerGrid">
                  <Grid container>                    
                    <Grid item xs={12} sm={12} md={8}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker 
                          disableToolbar
                          autoOk={true}
                          variant="inline"
                          inputVariant="outlined"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Select date"
                          inputProps={{ readOnly: true }}
                          value={this.state.selectedDate}
                          onChange={this.handleDateChange}
                          KeyboardButtonProps={{
                          'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    
                    <Grid item xs={12} sm={12} md={2} className="pl-2 pt-2">
                      <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandards(this.state.attendanceType)}}>
                        <NavigateNext />
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>

                {this.state.markdateConfirm && 
                  <Grid item xs={12} sm={12} md={6}  className="customDiv">
                    <Grid container>
                      <Grid item xs={12} sm={12} md={12} className="mt-2">
                        <OutlinedDiv label="Select standard">
                          <Paper component="ul">
                            {this.state.frequencyChipData.map((data,i) => {
                              let icon="";
                              return (
                                <li key={data.secindex}>
                                  <Chip
                                    className="m-2"
                                    icon={icon}
                                    variant="outline"
                                    color="primary"
                                    onDelete={()=>this.handleDelete(data.stdindex, data.secindex, i)}
                                    label={data.label}
                                  />
                                </li>
                              );
                            })}

                            <li onClick={()=>{this.setState({addStandardsPanel:true});}}>
                              <Chip
                                className="m-2"
                                clickable
                                variant="outline"
                                color="secondary"
                                label={this.state.frequencyChipData.length > 0 ? "Change Standards" : "Add Standards"}
                              />
                            </li>
                          </Paper>
                        </OutlinedDiv>     
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} className="mt-2">
                        <OutlinedDiv label="Select session">
                          <Paper component="ul">
                            {this.state.attendanceType == "onceaday" && 
                              <li>
                                <Chip
                                  className="m-2"
                                  variant="outline"
                                  color="primary"
                                  label="All day"
                                />
                              </li>
                            }
            
                            {this.state.attendanceType == "twiceaday" && 
                              <div>
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session1"}
                                        onChange={() => {this.setState({selectedSession:'session1'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"/>
                                    }
                                    label="session 1"
                                  />
                                </li>
                                
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session2"}
                                        onChange={() => {this.setState({selectedSession:'session2'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"
                                        
                                      />
                                    }
                                    label="session 2"
                                  />
                                </li>
                              </div>
                            }

                            {this.state.attendanceType == "periodwise" && 
                              <div>
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session1"}
                                        onChange={() => {this.setState({selectedSession:'session1'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"
                                      />
                                    }
                                    label="session 1"
                                  />
                                </li>

                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session2"}
                                        onChange={() => {this.setState({selectedSession:'session2'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"
                                        
                                      />
                                    }
                                    label="session 2"
                                  />
                                </li>
                              </div>
                            }
                          </Paper>
                        </OutlinedDiv>
                      </Grid>    
                    </Grid>
                  </Grid>
               
                }  
              </Grid> 

              {this.state.frequencyChipData.length > 0  &&  
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={12} className="text-right" >
                    <Button variant="outlined" className="successBtnOutline " onClick={()=>{  window.scrollTo(0, 0); this.setState({searchStudentPanel:true});}}>
                      Start absent marking
                    </Button> 
                  </Grid>
                </Grid>
              }
            </Card>
            
          </Grid>
        </Grid>}
        </div>}

        {/* {this.state.marking_type == "quick_staff_attendance" && <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={10}  className="pickerGrid">
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
         <Grid container spacing={4}>
         <Grid item xs={12} sm={12} md={6}>
         <Grid container spacing={4}>
         <Grid item xs={12} sm={12} md={2}></Grid>
         <Grid item xs={12} sm={12} md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Absent date"
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={2} className="pl-2 pt-2 margin-auto text-left">
                <Avatar onClick={()=>this.setState({markdateConfirm:true})}>
                <NavigateNext />
                </Avatar>
               
             </Grid>
             </Grid>
             </Grid>
             
             <Grid item xs={12} sm={12} md={6}>
             {this.state.markdateConfirm &&  <div><FormControlLabel
                     control={
                       <Radio
                         checked={this.state.attendanceType === "fullday"}
                         onChange={() => this.setState({attendanceType:'fullday'})}
                         value="block_wise"
                         name="radio button enabled"
                         aria-label="B"
                         
                       />
                     }
                   
                     label="Full day"
                   />
                 
       
                   <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType === "halfday"}
                       onChange={() => this.setState({attendanceType:'halfday'})}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                        
                       />
                     }
                    
                     label="Half day"
                   />

                  <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType === "latecoming"}
                       onChange={() => this.setState({attendanceType:'latecoming'})}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                        
                       />
                     }
                    
                     label="Late coming"
                   /></div>}
               
             </Grid>
             </Grid>
             </Card>

            {this.state.attendanceType!='' && <Grid container spacing={4} justify="center">
              <Grid item xs={12} sm={12} md={8}>
              <Autocomplete
          type="staff"
          SearchPlaceholderText="Enter name and select from suggestions"
          suggestions={this.state.staffSuggestions}
          onSelected={this.handleStaffSearch}
          {...this.props}
          /> 
              </Grid>
            </Grid> }

             {this.state.staffSearchResults.length > 0 &&  <Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Mark Attendance
                </h4>
              </div>
        </div>
        <ReactTable
       
    data={this.state.staffSearchResults.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          name:original.first_name,
          UID: original.UID,
          parent_name:original.parent_name,
          contact:original.phone_no,
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
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Emp ID",
  accessor: "UID",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Emp ID"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
  Header: "Name",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },

{
  Header: "Designation",
  accessor: "designation",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Designation"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Contact No"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },

]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Attendance','can_create') &&    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">

        <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStaffQuickAttendance()}>
              Submit
            </Button> 
        </Grid>
        </Grid>}
  </CardActions>
        </Card>
        </Grid>
        </Grid>}
             </Grid>
             </Grid>} */}
             {this.state.marking_type == "quick_staff_attendance" && <Grid container spacing={4}  justify="center">
        <Grid item xs={12} md={8} lg={10}  className="pickerGrid">
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
         <Grid container spacing={4} justify="center">
         <Grid item xs={12} sm={12} md={3}></Grid>
         <Grid item xs={12} sm={12} md={4}>
              
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="date"
                inputProps={{ readOnly: true }}
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={2} className="pl-2 pt-2 margin-auto">
                <Avatar onClick={()=>this.getStaffMappedAttendance()}>
                <NavigateNext />
                </Avatar>
               
             </Grid>
             <Grid item xs={12} sm={12} md={3}></Grid>
             </Grid>
             </Card>

             {this.state.mappedStaffAttendance.length > 0 &&  <Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Mark Attendance
                </h4>
              </div>
        </div>
        <ReactTable
         getTrProps={(state, rowInfo, column, instance) => {
          if (typeof rowInfo !== "undefined") {
              return {
                  onClick: (e, handleOriginal) => {
                    let data = this.state.mappedStaffAttendance;
                    data[rowInfo.index].status = !data[rowInfo.index].status;
                      this.setState({
                        data
                      });
                      if (handleOriginal) {
                      handleOriginal()
                      }
                  },
              }
          }
          else {
              return {
                  onClick: (e, handleOriginal) => {
                      if (handleOriginal) {
                      handleOriginal()
                      }
                  },
              }
          }
      }}
    data={this.state.mappedStaffAttendance.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          name:original.first_name,
          UID: original.UID,
          designation:original.designation,
          
          contact:original.phone_no,
          status:original.status,
          actions: (
            // we've added some custom button actions
            <div>
                       
                    <Tooltip
      id="tooltip-top"
      title="Change status"
      placement="top"
    >
          <FormControlLabel
                    control={
                      <Switch
                        checked={original.status ? true : false}
                        onChange={() => this.handleChangeStaffStatus(key)}
                        onClick={() => this.handleChangeStaffStatus(key)}
                        value="checkedA"
                       
                      />
                    }
                   
                    label={original.status ? "Present" : "Absent"}
                  />
                
    </Tooltip>
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
width: 80,
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Emp ID",
  accessor: "UID",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Emp ID"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
  Header: "Name",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },

{
  Header: "Designation",
  accessor: "designation",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Designation"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Contact No"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },

      {
        Header: "Actions",
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
<CardActions stats style={{marginTop:0}}>
   <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
      {AuthHelper('Attendance','can_export') && <Button className="mr-2"  variant="outlined" color="secondary">
        Export
        </Button>}
        {AuthHelper('Attendance','can_create') && <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStaffRegularAttendance()}>
              Submit
            </Button> }
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>
        </Grid>}
             </Grid>
             </Grid>}
       

        {this.state.marking_type == "regular_student_attendance" && 
       <>
       <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={6}>
        <Card className="card-box pt-3 pb-1 mb-4 customNoData">
        <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={12} className="text-center">
        {/* { this.state.showonceaday > 0 &&   */}
        <FormControlLabel
                     control={
                       <Radio
                         checked={this.state.attendanceType == "onceaday"}
                         onChange={() => {this.setState({attendanceType:'onceaday'}); this.setState({markdateConfirm:false}); this.renderSelectedFrequencyStandards('onceaday')}}
                         value="block_wise"
                         name="radio button enabled"
                         aria-label="B"
                      
                       />
                     }
                     label="Once a day"
                   />
                  {/* } */}
                 
       
                 {/* { this.state.showtwiceaday > 0 &&     */}
                 <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType == "twiceaday"}
                       onChange={() => {this.setState({attendanceType:'twiceaday'});this.setState({markdateConfirm:false});this.renderSelectedFrequencyStandards('twiseaday')}}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                       
                        
                       />
                     }
                    
                     label="Twice a day"
                   />
                   {/* } */}

                {/* { this.state.showperiodwise > 0 &&    */}
                <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.attendanceType == "periodwise"}
                       onClick={() => {this.setState({attendanceType:'periodwise'});this.setState({markdateConfirm:false});this.renderSelectedFrequencyStandards('periodwise')}}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                         
                        
                       />
                     }
                    
                     label="Periodwise"
                   />
                   {/* } */}
                   </Grid>
                   </Grid>
        </Card></Grid> 
        </Grid> 
    {this.state.attendanceType=='onceaday' &&
     <Grid container spacing={4} justify="center">
        
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4} className="pickerGrid">
              <Grid container>
                <Grid item xs={12} sm={12} md={9}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker 
                    disableToolbar
                    autoOk={true}
                    variant="inline"

                    inputVariant="outlined"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="date"
                    inputProps={{ readOnly: true }}
                    disabled
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={12} md={3} className="pt-2 pl-2">
                  {/* <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandards('periodwise')}}> */}
                  <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandards('onceaday')}}>
                    <NavigateNext />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>

            {this.state.markdateConfirm && <Grid item xs={12} sm={12} md={4} className="pickerGrid customDiv">
             
              <OutlinedDiv label="Select Standard">
                <Paper component="ul">
                  {this.state.frequencyChipData.map((data,i) => {
                    return (
                      <li key={data.secindex}>
                        <Chip
                        className="m-2"
                        variant="outline"
                        color="primary"
                        label={data.label}
                        />
                      </li>
                    );
                  })}

                  <li onClick={()=>{this.setState({AddSectionPanel:true});}}>
                    <Chip
                      className="m-2"
                      variant="outline"
                      color="secondary"
                      label={this.state.frequencyChipData.length > 0 ? "Change Standard" : "Select Standard"}
                    />
                  </li>
                </Paper>
              </OutlinedDiv>
            </Grid>}
 
            {/* <Grid item xs={12} sm={12} lg={2} className="m-2 pickerGrid">
                <Avatar onClick={()=>this.setState({showStandards:true})}>
                  <NavigateNext />
                  </Avatar>
            </Grid> */}          
         </Grid>  
        </Card>

        {this.state.mappedAttendance.length > 0 && <Grid container spacing={4} justify="center">   
          <Grid item xs={12} md={8} lg={12}>
            <Card className="card-box  mb-4 customNoData">
              <div className="card-header">
                <div className="card-header--title">
                  <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                    Mark Attendance
                  </h4>
                </div>
              </div>

              <ReactTable
                getTrProps={(state, rowInfo, column, instance) => {
                  if (typeof rowInfo !== "undefined") {
                      return {
                          onClick: (e, handleOriginal) => {
                            let data = this.state.mappedAttendance;
                            data[rowInfo.index].status = !data[rowInfo.index].status;
                              this.setState({
                                data
                              });
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }else {
                      return {
                          onClick: (e, handleOriginal) => {
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }
                }}

                data={this.state.mappedAttendance.map((original,key) => {
                  return ({
                    slno: key+1,
                    id:original.id,
                    roll_no:original.UID,
                    name: original.name,
                    parent_name:original.father_name,
                    contact:original.contact_number,
                    status:original.status,
                    actions: (
                      // we've added some custom button actions
                      <div>
                        <Tooltip
                          id="tooltip-top"
                          title="Change status"
                          placement="top"
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={original.status ? true : false}
                                onChange={() => this.handleChangeStatus(key)}
                                onClick={() => this.handleChangeStatus(key)}
                                value="checkedA"
                              
                              />
                            }
                          
                            label={original.status ? "Present" : "Absent"}
                          />
                        </Tooltip>
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
                width: 80,
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search S No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                />
                )
              },
              {
                Header: "Roll No",
                accessor: "roll_no",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Roll No"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Name",
                accessor: "name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Parent Name",
                accessor: "parent_name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Parent Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              {
                Header: "Contact No",
                accessor: "contact",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                  inputProps={{
                  autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search Contact No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              // {
              //   Header: "Percentage",
              //   accessor: "percentage",
              //   className: "center",
              //   Filter: ({filter, onChange}) => (
              //     <TextField 
              //       inputProps={{
              //       autoComplete: 'off'
              //       }}         
              //       id="document-type"   
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Percentage"
              //       type="text" 
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Actions",
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
            <CardActions stats style={{marginTop:0}}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={6}></Grid>
                <Grid item xs={12} md={4} lg={6} className="text-right">
                {/* {AuthHelper('Attendance','can_export') &&  <Button className="mr-2"  variant="outlined" color="secondary">
                  Export
                  </Button>} */}
                  {AuthHelper('Attendance','can_create') &&  <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStudentRegularAttendance()}>
                    Submit </Button> }
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        </Grid>}
        </Grid>
        </Grid>
      
    }
    {this.state.attendanceType=='twiceaday' &&
    <Grid container spacing={4} justify="center">
        
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4} className="pickerGrid">
              <Grid container>
                <Grid item xs={12} sm={12} md={9}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker 
                    disableToolbar
                    autoOk={true}
                    variant="inline"

                    inputVariant="outlined"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="date"
                    inputProps={{ readOnly: true }}
                    disabled
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={12} md={3} className="pt-2 pl-2">
                  {/* <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandards('periodwise')}}> */}
                  <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandardsTwiceaday('twiceaday')}}>
                    <NavigateNext />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>

            {this.state.markdateConfirm && <Grid item xs={12} sm={12} md={4} className="pickerGrid customDiv">
             
              <OutlinedDiv label="Select Standard">
                <Paper component="ul">
                  {this.state.frequencyChipData.map((data,i) => {
                    return (
                      <li key={data.secindex}>
                        <Chip
                        className="m-2"
                        variant="outline"
                        color="primary"
                        label={data.label}
                        />
                      </li>
                    );
                  })}

                  <li onClick={()=>{this.setState({AddSectionPanel:true});}}>
                    <Chip
                      className="m-2"
                      variant="outline"
                      color="secondary"
                      label={this.state.frequencyChipData.length > 0 ? "Change Standard" : "Select Standard"}
                    />
                  </li>
                </Paper>
              </OutlinedDiv>
              <Grid item xs={12} sm={12} md={12} className="mt-2">
                        <OutlinedDiv label="Select session">
                          <Paper component="ul">
                          {this.state.attendanceType == "twiceaday" && 
                              <div>
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session1"}
                                        onChange={() => {this.setState({selectedSession:'session1'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"/>
                                    }
                                    label="session 1"
                                  />
                                </li>
                                
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session2"}
                                        onChange={() => {this.setState({selectedSession:'session2'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"
                                        
                                      />
                                    }
                                    label="session 2"
                                  />
                                </li>
                              </div>
                            }
                          </Paper>
                          </OutlinedDiv>
                          </Grid>

            </Grid>}
 
            {/* <Grid item xs={12} sm={12} lg={2} className="m-2 pickerGrid">
                <Avatar onClick={()=>this.setState({showStandards:true})}>
                  <NavigateNext />
                  </Avatar>
            </Grid> */}          
         </Grid>  
        </Card>

        {this.state.mappedAttendance.length > 0 && <Grid container spacing={4} justify="center">   
          <Grid item xs={12} md={8} lg={12}>
            <Card className="card-box  mb-4 customNoData">
              <div className="card-header">
                <div className="card-header--title">
                  <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                    Mark Attendance 
                  </h4>
                </div>
              </div>

              <ReactTable
                getTrProps={(state, rowInfo, column, instance) => {
                  if (typeof rowInfo !== "undefined") {
                      return {
                          onClick: (e, handleOriginal) => {
                            let data = this.state.mappedAttendance;
                            data[rowInfo.index].status = !data[rowInfo.index].status;
                              this.setState({
                                data
                              });
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }else {
                      return {
                          onClick: (e, handleOriginal) => {
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }
                }}

                data={this.state.mappedAttendance.map((original,key) => {
                  return ({
                    slno: key+1,
                    id:original.id,
                    roll_no:original.UID,
                    name: original.name,
                    parent_name:original.father_name,
                    contact:original.contact_number,
                    status:original.status,
                    actions: (
                      // we've added some custom button actions
                      <div>
                        <Tooltip
                          id="tooltip-top"
                          title="Change status"
                          placement="top"
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={original.status ? true : false}
                                onChange={() => this.handleChangeStatus(key)}
                                onClick={() => this.handleChangeStatus(key)}
                                value="checkedA"
                              
                              />
                            }
                          
                            label={original.status ? "Present" : "Absent"}
                          />
                        </Tooltip>
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
                width: 80,
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search S No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                />
                )
              },
              {
                Header: "Roll No",
                accessor: "roll_no",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Roll No"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Name",
                accessor: "name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Parent Name",
                accessor: "parent_name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Parent Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              {
                Header: "Contact No",
                accessor: "contact",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                  inputProps={{
                  autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search Contact No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              // {
              //   Header: "Percentage",
              //   accessor: "percentage",
              //   className: "center",
              //   Filter: ({filter, onChange}) => (
              //     <TextField 
              //       inputProps={{
              //       autoComplete: 'off'
              //       }}         
              //       id="document-type"   
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Percentage"
              //       type="text" 
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Actions",
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
            <CardActions stats style={{marginTop:0}}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={6}></Grid>
                <Grid item xs={12} md={4} lg={6} className="text-right">
                {/* {AuthHelper('Attendance','can_export') &&  <Button className="mr-2"  variant="outlined" color="secondary">
                  Export
                  </Button>} */}
                  {AuthHelper('Attendance','can_create') &&  <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStudentRegularAttendance()}>
                    Submit </Button> }
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        </Grid>}
        </Grid>
        </Grid>
              
    }
    {this.state.attendanceType=='periodwise' &&
    <Grid container spacing={4} justify="center">
        
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4} className="pickerGrid">
              <Grid container>
                <Grid item xs={12} sm={12} md={9}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker 
                    disableToolbar
                    autoOk={true}
                    variant="inline"

                    inputVariant="outlined"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="date"
                    inputProps={{ readOnly: true }}
                    disabled
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={12} md={3} className="pt-2 pl-2">
                  <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandards('periodwise')}}>
                  {/* <Avatar onClick={()=>{this.setState({markdateConfirm:true}); this.renderSelectedFrequencyStandardsTwiceaday('twiceaday')}}> */}
                    <NavigateNext />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>

            {this.state.markdateConfirm && <Grid item xs={12} sm={12} md={4} className="pickerGrid customDiv">
             
              <OutlinedDiv label="Select Standard">
                <Paper component="ul">
                  {this.state.frequencyChipData.map((data,i) => {
                    return (
                      <li key={data.secindex}>
                        <Chip
                        className="m-2"
                        variant="outline"
                        color="primary"
                        label={data.label}
                        />
                      </li>
                    );
                  })}

                  <li onClick={()=>{this.setState({AddSectionPanel:true});}}>
                    <Chip
                      className="m-2"
                      variant="outline"
                      color="secondary"
                      label={this.state.frequencyChipData.length > 0 ? "Change Standard" : "Select Standard"}
                    />
                  </li>
                </Paper>
              </OutlinedDiv>
              {this.state.frequencyChipData.length > 0 &&
              <Grid item xs={12} sm={12} md={12} className="mt-2">
                        <OutlinedDiv label="Select period">
                        {/* <Grid item xs={12} md={3} lg={3}> */}
                                <FormControl fullWidth>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    // label="Select period"
                                    variant="outlined"
                                    value={this.state.period}
                                    onChange={(event) =>
                                      this.handlePeriodData( event.target.value)
                                    }
                                    required
                                  >
                                  
                                    {this.state.timetableData.map(option => (
                                      <MenuItem key={option.id} value={option.id} id={option.period}>
                                        {option.period} {option.subject_name}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  
                                </FormControl>
                              {/* </Grid> */}
                            
                          {/* <Paper component="ul">
                          {this.state.attendanceType == "periodwise" && 
                              <div>
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session1"}
                                        onChange={() => {this.setState({selectedSession:'session1'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"/>
                                    }
                                    label="session 1"
                                  />
                                </li>
                                
                                <li>
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={this.state.selectedSession === "session2"}
                                        onChange={() => {this.setState({selectedSession:'session2'})}}
                                        value="floor_wise"
                                        name="radio button enabled"
                                        aria-label="B"
                                        
                                      />
                                    }
                                    label="session 2"
                                  />
                                </li>
                              </div>
                            }
                          </Paper>
                           */}
                          </OutlinedDiv>
                          </Grid>
                        }
            </Grid>}
 
            {/* <Grid item xs={12} sm={12} lg={2} className="m-2 pickerGrid">
                <Avatar onClick={()=>this.setState({showStandards:true})}>
                  <NavigateNext />
                  </Avatar>
            </Grid> */}          
         </Grid>  
        </Card>

        {this.state.mappedAttendance.length > 0 && <Grid container spacing={4} justify="center">   
          <Grid item xs={12} md={8} lg={12}>
            <Card className="card-box  mb-4 customNoData">
              <div className="card-header">
                <div className="card-header--title">
                  <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                    Mark Attendance 
                  </h4>
                </div>
              </div>

              <ReactTable
                getTrProps={(state, rowInfo, column, instance) => {
                  if (typeof rowInfo !== "undefined") {
                      return {
                          onClick: (e, handleOriginal) => {
                            let data = this.state.mappedAttendance;
                            data[rowInfo.index].status = !data[rowInfo.index].status;
                              this.setState({
                                data
                              });
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }else {
                      return {
                          onClick: (e, handleOriginal) => {
                              if (handleOriginal) {
                              handleOriginal()
                              }
                          },
                      }
                  }
                }}

                data={this.state.mappedAttendance.map((original,key) => {
                  return ({
                    slno: key+1,
                    id:original.id,
                    roll_no:original.UID,
                    name: original.name,
                    parent_name:original.father_name,
                    contact:original.contact_number,
                    status:original.status,
                    actions: (
                      // we've added some custom button actions
                      <div>
                        <Tooltip
                          id="tooltip-top"
                          title="Change status"
                          placement="top"
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={original.status ? true : false}
                                onChange={() => this.handleChangeStatus(key)}
                                onClick={() => this.handleChangeStatus(key)}
                                value="checkedA"
                              
                              />
                            }
                          
                            label={original.status ? "Present" : "Absent"}
                          />
                        </Tooltip>
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
                width: 80,
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search S No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                />
                )
              },
              {
                Header: "Roll No",
                accessor: "roll_no",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Roll No"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Name",
                accessor: "name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Parent Name",
                accessor: "parent_name",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}         
                    id="document-type"   
                    value={filter ? filter.value : ''}
                    placeholder="Search Parent Name"
                    type="text" 
                    onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              {
                Header: "Contact No",
                accessor: "contact",
                className: "center",
                Filter: ({filter, onChange}) => (
                  <TextField 
                  inputProps={{
                  autoComplete: 'off'
                  }}         
                  id="document-type"   
                  value={filter ? filter.value : ''}
                  placeholder="Search Contact No"
                  type="text" 
                  onChange={event => onChange(event.target.value)}
                  />
                ),
              },
              // {
              //   Header: "Percentage",
              //   accessor: "percentage",
              //   className: "center",
              //   Filter: ({filter, onChange}) => (
              //     <TextField 
              //       inputProps={{
              //       autoComplete: 'off'
              //       }}         
              //       id="document-type"   
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Percentage"
              //       type="text" 
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Actions",
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
            <CardActions stats style={{marginTop:0}}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={6}></Grid>
                <Grid item xs={12} md={4} lg={6} className="text-right">
                {/* {AuthHelper('Attendance','can_export') &&  <Button className="mr-2"  variant="outlined" color="secondary">
                  Export
                  </Button>} */}
                  {AuthHelper('Attendance','can_create') &&  <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStudentRegularAttendance()}>
                    Submit </Button> }
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        </Grid>}
        </Grid>
        </Grid>
              
    }
      </>
    }
        {this.state.marking_type == "regular_staff_attendance" && 
        <Grid container spacing={4}  justify="center">
        <Grid item xs={12} md={8} lg={10}  className="pickerGrid">
        <Card className="card-box pt-2 pb-1 pl-2 mb-4">
         <Grid container spacing={4} justify="center">
         <Grid item xs={12} sm={12} md={3}></Grid>
         <Grid item xs={12} sm={12} md={4}>
              
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="date"
                inputProps={{ readOnly: true }}
                disabled
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={2} className="pb-1 mt-1" style={{verticalAlign:'center'}}>
                <Avatar onClick={()=>this.getStaffMappedAttendance()}>
                <NavigateNext />
                </Avatar>
               
             </Grid>
             <Grid item xs={12} sm={12} md={3}></Grid>
             </Grid>
             </Card>

             {this.state.mappedStaffAttendance.length > 0 &&  <Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Mark Attendance
                </h4>
              </div>
        </div>
        <ReactTable
         getTrProps={(state, rowInfo, column, instance) => {
          if (typeof rowInfo !== "undefined") {
              return {
                  onClick: (e, handleOriginal) => {
                    let data = this.state.mappedStaffAttendance;
                    data[rowInfo.index].status = !data[rowInfo.index].status;
                      this.setState({
                        data
                      });
                      if (handleOriginal) {
                      handleOriginal()
                      }
                  },
              }
          }
          else {
              return {
                  onClick: (e, handleOriginal) => {
                      if (handleOriginal) {
                      handleOriginal()
                      }
                  },
              }
          }
      }}
    data={this.state.mappedStaffAttendance.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          name:original.first_name,
          UID: original.UID,
          parent_name:original.parent_name,
          designation:original.designation,
          contact:original.phone_no,
          status:original.status,
          actions: (
            // we've added some custom button actions
            <div>
                       
                    <Tooltip
      id="tooltip-top"
      title="Change status"
      placement="top"
    >
          <FormControlLabel
                    control={
                      <Switch
                        checked={original.status ? true : false}
                        onChange={() => this.handleChangeStaffStatus(key)}
                        onClick={() => this.handleChangeStaffStatus(key)}
                        value="checkedA"
                       
                      />
                    }
                   
                    label={original.status ? "Present" : "Absent"}
                  />
                
    </Tooltip>
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
width: 80,
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Emp ID",
  accessor: "UID",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Emp ID"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
  Header: "Name",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },

{
  Header: "Designation",
  accessor: "designation",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Designation"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Contact No"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },

      {
        Header: "Actions",
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
<CardActions stats style={{marginTop:0}}>
   <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
      {/* {AuthHelper('Attendance','can_export') && <Button className="mr-2"  variant="outlined" color="secondary">
        Export
        </Button>} */}
        {AuthHelper('Attendance','can_create') && <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStaffRegularAttendance()}>
              Submit
            </Button> }
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>
        </Grid>}
             </Grid>
             </Grid>}
       
        <Drawer

anchor="right"
open={this.state.selectSessionPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({selectSessionPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({selectSessionPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Session
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box pt-3 pb-1 mb-4 customNoData">
<Grid container spacing={4} justify="center">
<Grid item xs={12} md={8} lg={12} className="text-center">
{ this.state.showonceaday > 0 &&  <FormControlLabel
             control={
               <Radio
                 checked={this.state.attendanceType === "onceaday"}
                 onChange={() => {this.setState({attendanceType:'onceaday'}); this.renderSelectedFrequencyStandards('onceaday')}}
                 value="block_wise"
                 name="radio button enabled"
                 aria-label="B"
              
               />
             }
             label="Once a day"
           />}
         

         { this.state.showtwiceaday > 0 &&  <FormControlLabel
             control={
               <Radio
               checked={this.state.attendanceType === "twiceaday"}
               onChange={() => {this.setState({attendanceType:'twiceaday'});this.renderSelectedFrequencyStandards('twiseaday')}}
                 value="floor_wise"
                 name="radio button enabled"
                 aria-label="B"
               
                
               />
             }
            
             label="Twice a day"
           />}

        { this.state.showperiodwise > 0 &&   <FormControlLabel
             control={
               <Radio
               checked={this.state.attendanceType === "periodwise"}
               onChange={() => {this.setState({attendanceType:'periodwise'});this.renderSelectedFrequencyStandards('periodwise')}}
                 value="floor_wise"
                 name="radio button enabled"
                 aria-label="B"
                 
                
               />
             }
            
             label="Periodwise"
           />}
           </Grid>
           </Grid>

</Card>

<Grid container spacing={4}>
<Grid item xs={12} md={12} lg={12} className="text-right">
<Button color="secondary" variant="outlined" onClick={()=>this.setState({selectSessionPanel:false})}>
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
open={this.state.addStandardsPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({addStandardsPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({addStandardsPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
{this.state.SelectedFrequencyStandards.length > 0 ? (
this.state.SelectedFrequencyStandards.length > 0 && this.state.SelectedFrequencyStandards.map((element, index) => ( 
<Grid container spacing={4}>
<Grid item xs={12} md={6} lg={3}>
<FormControlLabel

control={
  <Checkbox
    tabIndex={-1}
    checked={element.checked}
    onClick={() => {this.handleStandard(element.standard_id,index,element.checked)}}
    
  />
}
label={element.standard_name}
/>
</Grid>
{element.standards.map((sections,sindex) => (

<Grid item xs={12} md={6} lg={3}>
<FormControlLabel
           
           control={
             <Checkbox
               tabIndex={-1}
               checked={sections.checked}
               onClick={() => this.handleSection(sections.section_id,index,sindex,sections.checked)}
             />
           }
           label={sections.section_name}
         />
</Grid>
  ))} 
</Grid>
    ))
    ): (
      <>
     <h4>Please Add Class in Attendance settings </h4>
    </>   )} 
     
</Card> 
<Grid container spacing={4}>
<Grid item xs={12} md={12} lg={12} className="text-right">
{this.state.SelectedFrequencyStandards.length > 0 ? (
<Button color="secondary" variant="outlined" onClick={()=>{this.setState({ addStandardsPanel: false});this.getChipData()}}>
  Submit
</Button>
):''}
</Grid>
</Grid>        
</div>
</PerfectScrollbar>
</Box>
</Drawer>  

<Drawer

anchor="right"
open={this.state.AddSectionPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({AddSectionPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({AddSectionPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
{this.state.SelectedFrequencyStandards.length > 0 ? (
this.state.SelectedFrequencyStandards.length > 0 && this.state.SelectedFrequencyStandards.map((element, index) => ( 
<Grid container spacing={4}>
{element.standards.map((sections,sindex) => (
<Grid item xs={12} md={6} lg={3}>
<FormControlLabel
           
           control={
             <Checkbox
               tabIndex={-1}
               
               checked={sections.checked}
               onClick={() => { this.selectSection(index, sections.section_id, sindex, element.standard_name+" "+sections.section_name); this.setState({AddSectionPanel:false, selectedRegularStandard:sections.section_id}); this.getMappedAttendance(sections.section_id);
               this.handleSectionStudent(sections.section_id,index,sindex,sections.checked)}}
              
             />
           }
          
           label={element.standard_name+" "+sections.section_name}
         />
</Grid>
    ))} 
</Grid>
    ))): (
      <>
     <h4>Please Configure Period Wise in Attendance settings </h4>
    </>   )} 
</Card>    


</div>
</PerfectScrollbar>
</Box>
</Drawer>  

<Drawer

anchor="right"
open={this.state.searchStudentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({searchStudentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({searchStudentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Search & select students
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
<Grid container spacing={4}  className="customDiv">
<Grid item xs={12} md={6} lg={2}>
<OutlinedDiv label="Selected date">
    <Paper component="ul">
    {this.state.selectedDate.toDateString()}
    </Paper>
</OutlinedDiv>      
</Grid>   
<Grid item xs={12} md={6} lg={2}>
<OutlinedDiv label="Selected date">
    <Paper component="ul">
    {this.state.attendanceType == "onceaday" && "Once a day"}
                {this.state.attendanceType == "twiseaday" && "Twice a day"}
                {this.state.attendanceType == "periodwise" && "Periodwise"}
    </Paper>
</OutlinedDiv>      
</Grid>   
<Grid item xs={12} md={6} lg={2}>
<OutlinedDiv label="Selected date">
    <Paper component="ul">
    {this.state.attendanceType == "onceaday" && "All Day"}
    </Paper>
</OutlinedDiv>      
</Grid>  
<Grid item xs={12} md={6} lg={5}>
<OutlinedDiv label="Selected date">
    <Paper component="ul">
    {this.state.frequencyChipData.map((data,i) => {
                  let icon="";
                return (
                <li key={data.key}>
                <Chip
                variant="outline"
                color="primary"
                label={data.label}
                />
                </li>
                );
                })}
    </Paper>
</OutlinedDiv>      
</Grid>  
<Grid item xs={12} md={6} lg={1} className="margin-auto">

    <Avatar style={{backgroundColor:'transparent', color: '#f50057', border: '1px solid #f50057', cursor:'pointer'}} onClick={()=>this.setState({searchStudentPanel:false})}><Clear /></Avatar>
   
</Grid>  
</Grid>   
</Card>
<Grid container spacing={4} justify="center">
              <Grid item xs={12} sm={12} md={8}>
              <Autocomplete
          type="student"
          SearchPlaceholderText="Enter name and select from suggestions"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          /> 
              </Grid>
            </Grid> 

      <Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Mark Attendance
                </h4>
              </div>
        </div>
        <ReactTable
       
    data={this.state.filteredStudents.map((original,key) => {
        return ({
          slno: key+1,
            id:original.id,
            roll_no: original.UID,
            standard: original.standard_name+" "+original.section_name,
            name:original.name,
            father_name:original.father_name,
            contact:original.father_phone_no,
            actions: (
              // we've added some custom button actions
              <div>
                { /* use this button to add a like kind of action */ }
                          
                          {/* use this button to remove the data row */}
                         
                      <Tooltip
        id="tooltip-top"
        title="Change status"
        placement="top"
      >
          <Button variant="outlined" color="secondary"
                            simple
                            className="edit"
                            onClick={()=>this.removeSelected(key)}
                          >
                          <Clear  />
                          </Button>
      </Tooltip>
              </div>
            )
        })
})
}
minRows={0}
columns={[
  {
    Header: "S No",
    accessor: "slno",
    width: 80,
    className: "center",
  },
  {
    Header: "Roll No",
    accessor: "roll_no",
    className: "center",
  },
  {
    Header: "Standard",
    accessor: "standard",
    className: "center",
  },
  {
    Header: "Student Name",
    accessor: "name",
    className: "center",
  },
  {
    Header: "Parent Name",
    accessor: "father_name",
    className: "center",
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
  },
  {
    Header: "Actions",
    accessor: "actions",
    className: "center",
  },
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Attendance','can_create') &&    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">

        <Button className="mr-2" variant="outlined" className="successBtnOutline" onClick={()=> this.insertStudentQuickAttendance()}>
              Submit
            </Button> 
        </Grid>
        </Grid>}
  </CardActions>
        </Card>
        </Grid>
        </Grid>

</div>
</PerfectScrollbar>
</Box>
</Drawer>
</Grid>
</Grid>
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);