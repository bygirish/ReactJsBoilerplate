import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import PropTypes from "prop-types";
import Autocomplete from "../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import { withRouter } from 'react-router-dom';
import {Animated} from "react-animated-css";
import GroupWork from "@material-ui/icons/GroupWork";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import logo from "../../../assets/images/egenius_logo.png";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../assets/custom.scss";
import Service from '../../../utils/Service';
import Config from '../../../config';
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

class ClassMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      selectedDate:new Date(),
      enddate: new Date(),
      selectedSection:'',
      selectedStandard:'',
      roomInfo:'',
      standardSuggestions:[],
      studentInfo:'',
      activestandardSubjects:[],
      standardSubjects:[],
      roommasterDetails: [],
      tags: [],
      mapclassDetails:[],
      filterSections: [],
      lstandardSections: [],
      streamDetails:[],
      standardSections: [],
      classmasterDetails:[],
      academicsetting: [],
      documentInfo:'',
      classholders: [{ standards: '', sections: '', streams: '', academics: '' }],
      roomholders: [{ floor: '', roomno: '', roomname: '' }],
      suggestions:[],
      studentSuggestions:[],
      studentDocuments:[],
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
 
  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 
  selectJoiningStandard = (value) => {
    this.setState({joiningStandard:value});
  }
  getStateValue = (name) => {
    return this.state.name;
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };
  showError = (error,status) => {
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
         if(status == 401){
          this.props.removeUserData();
          this.props.history.push("/login");
        }
       }, 2000)
    }
  getAcademicSettingData() {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          this.setState({ academicsetting: response.data });
        }
      }
    }).catch(error => {
      console.log(error)

    });
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

  handleRoomSubject = (id, index, status) => {
    let lboards = this.state.activestandardSubjects;
    lboards.map(element => {
      if (element.id == id) {
        lboards[index].checked = !status;
      }
    });
    this.setState({ activestandardSubjects: lboards });
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  handleRoomMasterData = (pIndex, inputName, pValue) => {
    let lroomholders = this.state.roomholders;
    lroomholders[pIndex][inputName] = pValue;
    this.setState({ roomholders: lroomholders });
  }

  removeHolder(i) {
    const { roomholders } = this.state;
    this.setState({
      roomholders: roomholders.filter((holder, index) => index !== i),
    });
  }

  handleAddHolder = () => {
    let data = this.state.roomholders;
    let lData = {};
    lData.floor = '';
    lData.roomno = '';
    lData.roomname = '';
    data.push(lData);
    this.setState({data});
  }

  handleDocumentChange = (pIndex,inputName,pValue) => {
    let data = this.state.classholders;
    data[pIndex][inputName] = pValue;
    this.setState({data});
  }

  getStudentDetails = (id,id_board,id_academicyear) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      standard_id:id?id:'',
      id_board:id_board ? id_board : this.state.selectedBoard,
      id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('students/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({studentData:newArr,studentSuggestions:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({studentData:newArray,studentSuggestions:newArray});
        }
      }else{
        this.setState({studentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 


  getStandardSectionDetails() {
    const postData = {
      count: "subject",
      type:"cstr",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    };
    console.log(postData);
    new Service().apiCall('ClassDetails/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        let sectionDetails = response.data;
        const lsectionList = response.data.map((data) => {
          return { ...data, checked: false };
        });
        var lStandardSections = [];
        sectionDetails.forEach(element => {
          if (lStandardSections[element.standard_id]) {
            var lSection = {};
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.active_teacher_count = element.active_teacher_count;
            lSection.active_subject_count = element.active_subject_count;
            lStandardSections[element.standard_id].standards.push(lSection);
          } else {
            var lStandard = {};
            var lSection = {};
            lStandard.standard_name = element.standard_name;
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.active_teacher_count = element.active_teacher_count;
            lSection.active_subject_count = element.active_subject_count;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);

            lStandardSections[element.standard_id] = lStandard;

          }

        });

        this.setState({ lstandardSections: sectionDetails, filterSections: sectionDetails, sectionList: lsectionList, masterSectionList: lsectionList, standardSections: lStandardSections });
      } else {
        this.setState({ lstandardSections: [], filterSections: [], sectionList: [], masterSectionList: [], standardSections: [] });
      }
    }).catch(error => {
      console.log(error);

    });

  }

  handleClassMasterDelete = (id,status) => {
    const postData = {
      id: id,
      status:status,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id:this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('RoomMasters/deleteRoomMaster', postData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">{status == 1?"Room Deactivated":"Room Activated"}</h4>
          </div>
        </Dialog>
          ),
        });
        setTimeout(() => {
          this.getRoommasterDetails();
          this.setState({ basicNotify: false });
        
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      if(error.response.status == 500 && error.response.data!=""){
        this.showError(error.response.data,error.response.status)
      }
      else if(error.response.status == 401){
        this.showError('Invalid Auth token. Redirecting to login',error.response.status)
      }
      else{
        console.log(error)
      }
    });
  }

  getClassmasterDetails(id_board, id_academicyear) {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassMasters/getClassMasterDetails', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          let data = [];

          response.data.forEach(element => {
            data.push({ id: element.id, value: element.standard + " " + element.section });
          });
        
          this.setState({ standardSuggestions: data, classmasterDetails: response.data });
        }
      } else {
        this.setState({ standardSuggestions: [], classmasterDetails: [], activeclassmasterDetails: [], inactiveclassmasterDetails: [], allClassmasterDetails: [] });
      }
    }).catch(error => {
      console.log(error);

    });
  }

  submit = event => {
    event.preventDefault();
    const postData = {
      roomholders: this.state.roomholders,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id:this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('RoomMasters/insertData', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
             this.setState({
       basicNotify: (
         <Dialog open={true}>
       <div className="text-center p-5">
         <h4 className="font-weight-bold">Room Inserted</h4>
       </div>
     </Dialog>
       ),
     });
        setTimeout(() => {
         // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
          window.location.reload()
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      if(error.response.status == 500 && error.response.data!=""){
        this.showError(error.response.data,error.response.status)
      }
      else if(error.response.status == 401){
        this.showError('Invalid Auth token. Redirecting to login',error.response.status)
      }
      else{
        console.log(error)
      }
    });
}

updateStreamData = (streamSelections) =>{
  const postData = {
    streamSelections: streamSelections,
    id_academicyear: this.state.selectedAcademicYear,
    id_board: this.state.selectedBoard,
    id_organization: this.props.data.selectedOrganizationId,
    id_institute: this.props.data.selectedInstitutionId,
    role_id:this.props.data.role_id,
    token: "abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ClassMasters/updateStreamDetails', postData,
  {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  ).then(response => {
    if (response.status==200 && response.data!='') {
           this.setState({
     basicNotify: (
       <Dialog open={true}>
     <div className="text-center p-5">
       <h4 className="font-weight-bold">Streams Inserted</h4>
     </div>
   </Dialog>
     ),
   });
      setTimeout(() => {
       // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
       window.location.reload()
      }, 2000)
    } else {
      //this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
    if(error.response.status == 500 && error.response.data!=""){
      this.showError(error.response.data,error.response.status)
    }
    else if(error.response.status == 401){
      this.showError('Invalid Auth token. Redirecting to login',error.response.status)
    }
    else{
      console.log(error)
    }
  });
}

renderRoomSubject = () => {
  let lboards = this.state.activestandardSubjects;
  let selectedRoomSubjectIds = "";
  let selectedids = [];
  lboards.map(element => {
    if (element.checked == true) {
      selectedids.push(element.id);
    }
  });
  if (selectedids.length > 0) {
    selectedRoomSubjectIds = selectedids.join(',');
  }
  // this.getSubjectDetails(thselectedSectionsIds);
  this.updateRoomData(this.state.selectedRoomId, this.state.roomInfo.id, selectedRoomSubjectIds);
  this.setState({ roomSubjectSelectedIds: selectedRoomSubjectIds, roomMapPanel:false });
}
updateRoomData(id_room, id_section, selectedRoomSubjectIds) {
  const postData = {
    id_room: id_room,
    id_section: id_section,
    selectedRoomSubjectIds: selectedRoomSubjectIds,
    id_academicyear: this.state.selectedAcademicYear,
    id_board: this.state.selectedBoard,
    id_organization: this.props.data.selectedOrganizationId,
    id_institute: this.props.data.selectedInstitutionId,
    role_id:this.props.data.role_id,
    token: "abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('SubjectStandardRooms/roomSubjectMap', postData,
    {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
  ).then(response => {
    console.log(response)
    if (response.status == 200 && response.data != '') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
        <div className="text-center p-5">
          <h4 className="font-weight-bold">Subjectwise Room Alloted</h4>
        </div>
      </Dialog>
        ),
      });
      setTimeout(() => {
        this.setState({ basicNotify: false });
      //  window.location.reload()
      }, 2000)
    } else {
     // this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
    if(error.response.status == 500 && error.response.data!=""){
      this.showError(error.response.data,error.response.status)
    }
    else if(error.response.status == 401){
      this.showError('Invalid Auth token. Redirecting to login',error.response.status)
    }
    else{
      console.log(error)
    }
  });
}

renderSelectedStreams = () => {
  const lUserData = this.props.data;
  let lstdstreams = this.state.streamDetails;
  let selectedSectionIds = "";
  let selectedSection = "";
  let selected = [];
  let selectedids = [];
  lstdstreams.map(element => {
    selected[element.id] = new Array();
    element.streams.map((stream, sindex) => {
      var ldata = {};
      if (stream.checked == true) {
        selected[element.id].push(stream.stream);
      }
    });
    if (selected[element.id].length > 0) {
      selectedids[element.id] = selected[element.id].join(',');
    }

  });
  //if(selected.length > 0){
  // selectedSectionIds = selected.join(',');
  // selectedSection = selectedids;
  //}
  this.setState({ streamSelections: selectedids });
  this.updateStreamData(selectedids);


}



  handleRoomSearch = (val) => {
    this.setState({ roomInfo: val});
    this.getSectionSubjectDetails(val.id);
    this.getRoomsSubjectsWithId(val.id,this.state.selectedRoomId);
  }

  getRoomsSubjectsWithId(id_section, id_room) {
    const postData = {
      id_section: id_section,
      id_room:id_room,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('SubjectStandardRooms/getRoomWiseSubjects', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          this.setState({ roomwiseSubjects: response.data['data'], selectedSubjects:response.data['selectedsubject'][id_section] });
          this.getSectionSubjectDetails(id_section,response.data['selectedsubject'][id_section]);
        }
      } else {
        this.setState({ roomwiseSubjects: [] });
      }
    }).catch(error => {
      console.log("error");

    });
  }

  handleStreamChecked(standard, idx, id, status) {
    let lstreams = this.state.streamDetails;
    lstreams[idx].streams[id].checked = !status;
    this.setState({ streamDetails: lstreams });
  }

  getRoommasterDetails() {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('RoomMasters/getRoomMasterDetails', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        
        
          this.setState({ roommasterDetails: response.data });
        
      } else {
        this.setState({ roommasterDetails: []});
      }
    }).catch(error => {
      if(error.response.status == 500 && error.response.data!=""){
        this.showError(error.response.data,error.response.status)
      }
      else if(error.response.status == 401){
        this.showError('Invalid Auth token. Redirecting to login',error.response.status)
      }
      else{
        console.log(error)
      }
    });
  }

  getSectionSubjectDetails(id_section, selectedSubjects,selectedStaffSection) {
    const postData = {
      type: 'cstr',
      standard_id: id_section,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('SubjectStandards/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        var lAllSubjectStandards = [];
        var lActiveSubjectStandards = [];
        var lInActiveSubjectStandards = [];
        response.data.forEach(element => {
          var lAllSubjectStandard = {};
          lAllSubjectStandard.id = element.id;
          lAllSubjectStandard.smid = element.smid;
          lAllSubjectStandard.name = element.name;
          lAllSubjectStandard.status = element.status;
          lAllSubjectStandard.type = element.type;
          lAllSubjectStandard.teacher_count = element.teacher_count;
          lAllSubjectStandard.checked = false;
          if (selectedSubjects && selectedSubjects.includes(element.id)) {
            lAllSubjectStandard.checked = true;
          }
          if (selectedStaffSection && selectedStaffSection.includes(element.id)) {
            lAllSubjectStandard.checked = true;
          }
          lAllSubjectStandards.push(lAllSubjectStandard);
          if (element.status == 1) {
            var lActiveSubjectStandard = {};
            lActiveSubjectStandard.id = element.id;
            lActiveSubjectStandard.name = element.name;
            lActiveSubjectStandard.status = element.status;
            lActiveSubjectStandard.type = element.type;
            lActiveSubjectStandard.teacher_count = element.teacher_count;
            lActiveSubjectStandard.checked = false;
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
              lActiveSubjectStandard.checked = true;
            }
            if (selectedStaffSection && selectedStaffSection.includes(element.id)) {
              lActiveSubjectStandard.checked = true;
            }
            lActiveSubjectStandards.push(lActiveSubjectStandard);
          }
          if (element.status == 0) {
            var lInActiveSubjectStandard = {};
            lInActiveSubjectStandard.id = element.id;
            lInActiveSubjectStandard.name = element.name;
            lInActiveSubjectStandard.status = element.status;
            lInActiveSubjectStandard.type = element.type;
            lInActiveSubjectStandard.checked = false;
            lInActiveSubjectStandard.teacher_count = element.teacher_count;
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
              lInActiveSubjectStandard.checked = true;
            }
            lInActiveSubjectStandards.push(lInActiveSubjectStandard);
          }

        })
        this.setState({ standardSubjects: response.data, allstandardSubjects: lAllSubjectStandards, activestandardSubjects: lActiveSubjectStandards, inactivestandardSubjects: lInActiveSubjectStandards });
      } else {
        this.setState({ standardSubjects: [], allstandardSubjects: [], activestandardSubjects: [], inactivestandardSubjects: [] });
      }
    }).catch(error => {
      console.log("error.response.data.message");

    });
  }


  componentDidMount() {
   this.getRoommasterDetails();
   this.getClassmasterDetails();
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
   this.getStandardSectionDetails();
  }

render(){
  const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  const { classes } = this.props;
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/cstrmodule")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
             Room Master
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar> 
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      {AuthHelper('CSTR','can_create') &&  <Grid container  justify="center" className="sliderDiv">
        <Grid item xs={12} md={10} lg={10}>
        <Card className="card-box  mb-4 p-3">
        <form
        onSubmit={this.submit.bind(this)}
        autoComplete="off">
        <Grid container>
        <Grid item xs={12} md={12} lg={12}>
        <div className="card-header pl-0">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                Create Room
                </h4>
              </div>
        </div>
        {this.state.roomholders.map((holder, idx) => (
      <Grid container>
        
       <Grid item xs={12} sm={10} md={1}></Grid>  
      <Grid item xs={12} sm={10} md={2}>
             <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                // style: {textTransform: 'capitalize'}
                }}
                className="m-2"
                onChange={(event) => 
                  this.handleRoomMasterData(idx, "floor", event.target.value.replace(/\D/g, ""))  
                  }
                  required
                value={holder.floor}
               id={"floor"+idx}   
               label="Floor" 
               type="search" 
               inputRef={this.textInput} 
               variant="outlined" />
               </FormControl>
        </Grid>
        <Grid item xs={12} sm={10} md={2}>
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                // style: {textTransform: 'capitalize'}
                }}
                onChange={(event) => 
                  this.handleRoomMasterData(idx, "roomno", event.target.value.replace(/\D/g, ""))
                  }
                  className="m-2"
               required
               id={"roomno"+idx}  
               label="Room No" 
               value={holder.roomno}
               type="search" 
               variant="outlined" />
               </FormControl>
        </Grid>
      
        <Grid item xs={12} sm={10} md={5}>
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                // style: {textTransform: 'capitalize'}
                }}
                onChange={(event) => 
                  this.handleRoomMasterData(idx, "roomname", event.target.value.replace(/[^a-zA-Z0-9\.,]/g, ''))
                  }
                  className="m-2"
                required
                value={holder.roomname}
                id={"roomname"+idx}     
               label="Room Name" 
               type="search" 
               variant="outlined" />
               </FormControl>
        </Grid>
      
        <Grid item xs={12} sm={6} lg={1}>
            { idx == 0 ?   <div  className="addHolderStyle inputMargin">
            <TextField 
             className="m-2"
            id="document-type"   
            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.handleAddHolder(); this.focusTextInput();
            }
            }}
            InputProps={{
            autoComplete: 'off',
            readOnly: true,
            startAdornment: (
            <InputAdornment position="start">
            <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
            </InputAdornment>
            ),
            }}
            label="Add" 
            onClick={()=>{this.handleAddHolder(); this.focusTextInput()}}
            variant="outlined" />
            </div>
            :
            <div className="removeHolderStyle inputMargin">
            <TextField 
             className="m-2"
            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.removeHolder(idx); 
            }
            }}
            id="document-type"   
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
            onClick={()=>{this.removeHolder(idx);}}
            variant="outlined" />
            </div>
            }
            </Grid> 
        </Grid>
        ))}
   
        </Grid>
        </Grid>

      <Grid container className="mt-2">

        <Grid item xs={12} sm={12} md={12} className="text-right">
             <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
        </Grid>
        </Grid>
        </form>
     </Card></Grid></Grid>}

       <Grid container  justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Rooms List
                </h4>
              </div>
        </div>
    <ReactTable

data={
  this.state.roommasterDetails.map((original,key) => {
    return ({
      slno: key + 1,
      id: original.id,
      floor: original.floor,
      room_no: original.room_no,
      room_name: original.room_name,
      assigned:original.assigned,
      actions: (
        <div>
          {original.status == "1" && <>
            {AuthHelper('CSTR','can_edit') && <Tooltip
              id="tooltip-top"
              title="Map Class to Room"
              placement="top"
              >
              <Button
              simple 
              onClick={() => { this.setState({ roomMapPanel: true,selectedRoomId: original.id, room_no: original.room_no }); }}
              color="secondary"
              className="edit"
              >
              <Edit />
              </Button>
              </Tooltip>}
          </>
          }

          {AuthHelper('CSTR','can_delete') && <Tooltip
          id="tooltip-top"
          title={original.status == "1" ? "Deactivate" : "Activate"}
          placement="top"
          >
          <FormControlLabel
          control={
          <Switch
          checked={original.status == "1" ? true : false}
          onChange={() => this.handleClassMasterDelete(original.id,original.status)}
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
  Header: "Room No",
  width: 90,
  accessor: "room_no",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="roomno"   
value={filter ? filter.value : ''}
placeholder="Search Room No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Room Name",
  accessor: "room_name",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="roomname"   
value={filter ? filter.value : ''}
placeholder="Search Room Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Floor",
  width: 90,
  accessor: "floor",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="floor"   
value={filter ? filter.value : ''}
placeholder="Search Floor"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
Header: "Assigned Classes",
accessor: "assigned",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="assigned-classes"   
value={filter ? filter.value : ''}
placeholder="Search Class"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
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

  </CardActions>

        </Card></Grid> 
        </Grid>

        <Drawer

          anchor="right"
          open={this.state.custodyPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({custodyPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({custodyPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Return or Dispose Documents
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4 p-3">
        <Grid container  justify="center">
           
    
              <Grid item xs={12} sm={12} md={6} className="text-center margin-auto"> 
              
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "returned"}
                          onChange={() => this.setState({changeTo:'returned'})}
                          value="fulltime"
                          name="radio button enabled"
                          aria-label="B"
                        
                        />
                      }
                    
                      label="Return"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "disposed"}
                        onChange={() => this.setState({changeTo:'disposed'})}
                          value="shift"
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label="Dispose"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="margin-auto">
                    <Button className="successBtnOutline" onClick={()=>this.updateStatus()}>
                        Submit
                    </Button>
                  </Grid>
              </Grid>
          </Card>
          </div>
        </PerfectScrollbar>
        </Box>
        </Drawer>

    
<Drawer

anchor="right"
open={this.state.mapSectionStreamPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({mapSectionStreamPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({mapSectionStreamPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Map Section to Stream
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container justify="center">
  <Grid item xs={12} sm={10} md={6}>
  <Card className="card-box  mb-4 pt-2 pb-1 px-3">
  <div className="card-header pl-0">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                Map Section to Stream
                </h4>
              </div>
        </div>
{this.state.streamDetails.map((element, idx) => (
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={10} md={2} style={{marginTop:'auto',marginBottom:'auto'}}>
                              <Box>{element.standard}</Box>
                            </Grid>
                            {element.streams.map((ele, id) => (
                              <Grid  item xs={12} sm={10} md={2}>
                              
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        tabIndex={-1}
                                        checked={ele.checked}
                                        onClick={() => this.handleStreamChecked(element.id, idx, id, ele.checked)}
                                       
                                      />
                                    }
                                 
                                    label={ele.stream}
                                  />
                             
                              </Grid>
                            ))}
                          </Grid>
                        ))}
                        <Grid container>
                          <Grid  item xs={12} sm={12} md={12} className="text-right mb-2">   
                            <Button className="successBtnOutline"  onClick={() => this.renderSelectedStreams()}>Submit</Button>
                          </Grid>      
                        </Grid>
                        </Card>
                    
                        </Grid>
                        </Grid>
</div>
</PerfectScrollbar>
</Box>
</Drawer>  

<Drawer
anchor="right"
open={this.state.roomMapPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({roomMapPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({roomMapPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Room No.: {this.state.room_no}
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container  justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10} className="mb-3">
          <Autocomplete
          type="room"
          SearchPlaceholderText="Search Class "
          suggestions={this.state.standardSuggestions}
          onSelected={this.handleRoomSearch}
          {...this.props}
          /> 
        </Grid>
</Grid>
        {this.state.standardSubjects.length > 0 &&    
        <Card className="card-box  mb-4 mt-4">
<CardContent>
<Grid container spacing={4}>
<Grid item xs={12} md={6} lg={6}>
<Typography variant="h5">
  Standard: {this.state.roomInfo.value}
  </Typography>                                   
</Grid>  
<Grid item xs={12} md={6} lg={6}>
<Typography variant="h5">
 Teacher: {this.state.room_no}
  </Typography>
</Grid>  
</Grid>
      <Grid container  spacing={4} >
      {this.state.activestandardSubjects.map((element, idx) => (
      <Grid item xs={12} sm={12} md={6}><FormControlLabel
      control={
      <Checkbox
      tabIndex={-1}
      checked={element.checked}
      onClick={() => { this.handleRoomSubject(element.id, idx, element.checked) }}

      />
      }

      label={element.name}
      /></Grid>

      ))}
      </Grid>
</CardContent>
</Card>  }
      <Grid container spacing={4} justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10} className="text-right">
          <Button color="secondary" variant="contained" onClick={()=>this.renderRoomSubject()}>Submit</Button>
        </Grid>
        </Grid>  

</div>
</PerfectScrollbar>
</Box>

</Drawer>
        
</div>
</Animated>
</Dialog>

    </Fragment>
  );
};
}

ClassMaster.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToPros)(withRouter(ClassMaster));
