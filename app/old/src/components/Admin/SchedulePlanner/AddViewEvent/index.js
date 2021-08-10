import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
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

class AddViewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:AuthHelper('Events','can_create') ? 'create':'view',
      loading:false,
      id_event:'',
      dashboardDetails:[],
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
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
      basicNotify:false,
      allDepartments:false,
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
      selectedBoard:this.props.data.selectedBoardId,
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
  selectJoiningStandard = (value) => {
    this.setState({joiningStandard:value});
  }
  getStateValue = (name) => {
    return this.state.name;
  }

  renderDepartmentsCheckBox = (element,index,checked) =>{   
    const { classes } = this.props;
    return <div>
        <Grid container>
            <Grid item xs={12} sm={6} md={3} lg={12}>
         <FormControlLabel
         control={
           <Checkbox
             tabIndex={-1}
             onClick={() => this.handleDepartment(element.id,index,element.checked)}
             checked={element.checked}
           />
         }
         label= {element.name} 
       />
          </Grid>
      </Grid>
      </div>
  }

  handleAllDepartment = (status) =>{
    let ldepartments = this.state.roleData;
    let departmentids=[];
    let selectedDepartmentsIds='';
    ldepartments.map((element,index)=>{
      ldepartments[index].checked = !status;
    }); 
    ldepartments.map(element=>{
      if(element.checked == true){
        departmentids.push(element.id);
      }
});
    if(departmentids.length > 0){
      selectedDepartmentsIds = departmentids.join(',');
      }
    this.setState({roleData:ldepartments,allDepartments:!this.state.allDepartments,SelectedDepartmentIds:selectedDepartmentsIds});
  }
  
  handleDepartment = (id,index,status) => {
    let ldepartments = this.state.roleData;
    let departmentids=[];
    let selectedDepartmentsIds='';
    let selectedDepartmentIds=0;
    ldepartments[index].checked = !status;
    ldepartments[index].count+=1;
    ldepartments.map((element,index)=>{
       if(element.id == id){
        ldepartments[index].checked = !status;
       }
    });
    let total = 0;
    let checked = 0;
    ldepartments.map(element=>{
      total++;
      if(element.checked == true){
        checked++;
        departmentids.push(element.id);
      }
});
if(departmentids.length > 0){
selectedDepartmentsIds = departmentids.join(',');
}
if(total == checked){
  this.setState({allDepartments:true})
}
else{
  this.setState({allDepartments:false})
}
    this.setState({roleData:ldepartments,SelectedDepartmentIds:selectedDepartmentsIds});
   }

  renderStandardSectionCheckBox = (element,index,checked) =>{   
    const { classes } = this.props;
    let parentStandardCount = this.state.standardSections.length;
    let childStandardCount = element.standards.length;
    let childStandardCheckedCount = 0;
    let parentStandardCheckedCount = 0;
    element.standards.forEach((item) => {if(item.checked) childStandardCheckedCount++; })
    if(childStandardCount == childStandardCheckedCount) element.checked = true;
    this.state.standardSections.forEach((item) => {if(element.checked) parentStandardCheckedCount++; })
    if(parentStandardCount == (parentStandardCheckedCount+1)) {
      this.state.allSections = true;
    }else{
      this.state.allSections = false;
    }
    return <div><Grid container><Grid item xs={12} sm={6} md={9} lg={3}>
         
    <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              onClick={() => {this.handleStandard(element.standard_id,index,element.checked)}}
              checked={element.checked}
            
            />
          }
      
          label= {element.standard_name} 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={9}>
        <Grid container>
        {element.standards.map((sections,sindex) => (
         <div>
            <Grid item xs={12} sm={6} md={12} lg={12}>
         <FormControlLabel
         control={
           <Checkbox
             tabIndex={-1}
             onClick={() => {this.handleSection(sections.section_id,index,sindex,sections.checked)}}
             checked={sections.checked}
            
           />
         }
       
         label= {sections.section_name} 
       />
          </Grid>
          </div>
        ))} 
        </Grid>
      </Grid>
      </Grid>
      </div>
  }

  handleImageChange = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }
 
    reader.readAsDataURL(event.target.files[0])
  };

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };

  handleStartDate = (startdate) => {
    this.setState({ startdate: startdate })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

  handleChangeEnabledGrade = (value) => {
    this.setState({ lgrade: value });
  };

  handleChangeEnabledSubmission = (value) => {
      this.setState({ lsubmission: value }); 
  };
  handleChangeEnabled = (value) => {
    this.setState({ lenabled: value });
  };

  handleGradingRequired = (value) => {     
       this.setState({ type: value });
  };
  handleGradeMarksSelected = (value) => {
      this.setState({ ltype: value }); 
  };

  setGrademarks = (value) =>{
    this.setState({ lgrademarks: value });
  }
  handleReadReceiptRequired = (value) =>{
    this.setState({ readReceipt: value });
  }
  handleSmsAlert = (value) =>{
    this.setState({ smsAlert: value });
  }

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards}); 
    let stdIds = [];
    standards.map((element,index) =>{
      stdIds.push(element.id);
     });
     let selectedStandardId = stdIds.join(",");
     this.getSubjectDetails(selectedStandardId);
     this.setState({SelectedSectionsIds:selectedStandardId})
  }
  handleStudentSearch = (val) => {
    this.props.history.push("/admin/view-student-info/"+val.UID);
  }
  handleIndividualSearch = (val) => {
    this.setState({'id_user':val.UID,viewStudentPanel:true});
    setTimeout(() => {
      this.getIndividualStudentDetails(val.UID);
    }, 1500);
  } 
   
  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          inputProps={{
           autoComplete: "off",
           style: {textTransform: 'capitalize'}
          }}
          required
          className="m-2"
          id={name}   
          value={this.state[name]}
          label={label} 
          type="search" 
          onChange={(event) => this.handleChangeState(name,event.target.value.replace(/[^a-zA-Z0-9\.,]/g, ''))}
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

  handleEvent = e => {
    e.preventDefault();
    let formData = new FormData();

    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('id_academicyear',this.state.selectedAcademicYear);
    formData.append('id_board',this.state.selectedBoard);
    formData.append('title',this.state.title);
    formData.append('type',this.state.type);
    formData.append('id',this.state.id_event);
    formData.append('description',this.state.id_event!=''?this.state.event_description.getCurrentContent().getPlainText():this.state.description.getCurrentContent().getPlainText());
    formData.append('start_date',moment(this.state.startdate).format("YYYY-MM-DD"));
    formData.append('end_date',moment(this.state.enddate).format("YYYY-MM-DD"));
    formData.append('from_time',moment(this.state.from_time).format("HH:mm"));
    formData.append('to_time',moment(this.state.to_time).format("HH:mm"));
    formData.append('student_applicable',this.state.SelectedSectionsIds!=''?this.state.SelectedSectionsIds:this.state.student_standards);
    formData.append('staff_applicable',this.state.SelectedDepartmentIds!=''?this.state.SelectedDepartmentIds:this.state.staff_depts);
    formData.append('token','abc');
    formData.append('id_user',this.props.data.UID);
    formData.append('role_id',this.props.data.role_id);
    formData.append('path',this.state.path);
    new Service().apiCall('EventDetails/insertEvent', formData,
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
      <h4 className="font-weight-bold">{this.state.id_event!=''?"Event Updated":"Event Created"}</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
     window.location.reload()
        }, 2000)
       
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  handleChangeTime = (x, name) => {
     this.setState({[name]:this.state.current_date+ " "+moment(x).format('HH:mm')});
  }

  handleEventDelete =(id,status) =>{
    let switchStatus = "";
    if(status == 1){
       switchStatus = "Event Deactivated";
    }
    else{
       switchStatus = "Event Activated ";
    }
    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('EventDetails/deleteEvent', postData,
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
      <h4 className="font-weight-bold">{switchStatus}</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
           this.setState({ basicNotify:false});   
          this.getEventDetails('','','');

        }, 2000)
      } else {
      //  this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  getSubjectDetails(id_section){
    const postData = { 
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      type:"assignment",
      standard_id:[id_section],
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('subjectStandards/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ subjects: response.data });
      }else{
        this.setState({ subjects: [] });
      }
    }).catch(error => {
      alert("error.response.data.message");

    });
  }

  handleSubjectSelection= (type,name,status) => {
    if(type){  
      this.setState({subjectChecked:true,subjectName:name,lsubject:type, subjectPanel:false});	 
      }
      else{
      this.setState({ subjectChecked:false,subjectName:'',lsubject:'', subjectPanel:false });
      } 
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



  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

    
    getEventDetails(id_section,type,id_dept){
      const postData = { 
        id_section:id_section,
        id_academicyear:this.props.data.selectedAcademicId,
        id_board:this.props.data.selectedBoardId,
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        type:type,
        usertype:this.props.usertype,
        role_id: this.props.data.role_id,
        id_dept:id_dept
      };
      new Service().apiCall('EventDetails/getEventDetails',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ events: response.data });
        }else{
          this.setState({ events: [] });
        }
      }).catch(error => {
        this.showError(error.response.data)
  
      });
    }
  getStandardSectionDetails() {
    const postData = {
    count:"student",
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
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
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      alert(error);

    });
  }

  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
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

  handleSelecteSidebardSection = (id,name) => {
    this.getEventDetails(id,'student','');
    this.setState({selectedStandardId:id, selectedSidebarSection:name,allStudents:false,searchStudent:false,activeSuggestion:0,filteredSuggestions:[],selectedStudentId:'',customAssignInput:"",customAssignStudents:[] });
   // this.getStudentDetails(id,this.state.selectedBoard,this.state.selectedAcademicYear);
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

  getRoleData(selectedDepartment) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getRoleData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let depatmentDetails = response.data;
        var lDepartments = []; 
        depatmentDetails.forEach(element => {
          var lDepartment = {};
          lDepartment.id = element.id;
          lDepartment.name = element.name;
          lDepartment.status = element.status;
          lDepartment.checked = element.checked;
          if (selectedDepartment && selectedDepartment.includes(element.id)) {
            lDepartment.checked = true;
          }
          lDepartments.push(lDepartment);
        })
        if(response.data){
          this.setState({ roleData: lDepartments });
        }
  
      }
    }).catch(error => {
    console.log(error);
  
    });
  
  } 

  componentDidMount() {
   this.getStandardSectionDetails();
   this.getSubjectDetails();
   this.getEventDetails();
   this.getRoleData();
  // this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
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
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/events")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Add/View Event
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Events','can_create') &&  <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.actionType == "create" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:'create',selectedStandards:[], id_event:'', title:'',startdate:new Date(),enddate:new Date()});this.getRoleData() }}>
                  Create
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "view" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:"view"}); }}>
                View
                </Button>
                {/* <Button color="primary" size="small" variant={this.state.actionType == "assessment" ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({actionType:"assessment"}); }}>
                  Marks Completion
                </Button> */}
                  </ButtonGroup>
                </Box>
              </div>}
               </Grid>
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
     {this.state.actionType == 'create' && 
     <Grid container>
      <Grid item xs={12} md={4} lg={1}>
         
        </Grid>
        
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={2} justify="center">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 ">
        <form
        onSubmit={this.handleEvent.bind(this)}
        autoComplete="off">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Event
                </h4>
              </div>
         
        </div>
        <CardContent>
 

        <Grid container>
        <Grid item xs={12} lg={6}>
            {this.renderTextInput("title","Title")}
        </Grid>
      <Grid item xs={12} md={12} lg={3} className="pickerGrid">
      <FormControl fullWidth>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker 
        disableToolbar
        autoOk={true}
        inputProps={{ readOnly: true }}
        variant="inline"
        inputVariant="outlined"
        format="dd/MM/yyyy"
        className="m-2"
        id="startdate"
        label="Start date"
        value={this.state.startdate}
        onChange={this.handleStartDate}
        KeyboardButtonProps={{
        'aria-label': 'change date',
        }}
        />
        </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={3} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker 
            disableToolbar
            inputProps={{ readOnly: true }}
            autoOk={true}
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            className="m-2"
            id="enddate"
            label="End date"
            value={this.state.enddate}
            onChange={this.handleEndDate}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
            </MuiPickersUtilsProvider>
      </FormControl>
      </Grid>
     
    </Grid>


    <Grid container>

<Grid item xs={12} sm={6} md={3} className="text-center">  
        <FormControlLabel
          control={
            <Radio
              checked={this.state.type === "Allday"}
              onChange={() => this.handleGradingRequired("Allday")}
              value="Allday"
              name="radio button enabled"
              aria-label="A"
            
            />
          }
        
          label="All day"
        />
      </Grid>
<Grid item xs={12} sm={6} md={9}  className="text-center">      
<Grid container>
 <Grid item xs={12} sm={6} md={4}  className="text-center">
        <FormControlLabel
          control={
            <Radio
              checked={this.state.type === "Schedule"}
              onChange={() => this.handleGradingRequired("Schedule")}
              value="Schedule"
              name="radio button enabled"
              aria-label="A"
             
            />
          }
          label="Schedule"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}  className="text-center">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
          className="m-2"
          inputProps={{ readOnly: true }}
          id="starttime"
          label="Start Time"
          inputVariant="outlined"
          value={this.state.from_time}
          onChange={(x, event) => this.handleChangeTime(x,"from_time")}   
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /></MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={6} md={4}  className="text-center">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
          className="m-2"
          inputProps={{ readOnly: true }}
          id="endtime"
          label="End Time"
          inputVariant="outlined"
          value={this.state.to_time}
          onChange={(x, event) => this.handleChangeTime(x,"to_time")}   
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /></MuiPickersUtilsProvider>
      </Grid>
      </Grid>
      </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.description}
          placeholder="Enter description"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Card>
        </Grid>
        </Grid>

       <Grid container>
         <Grid item xs={12} lg={12} className="py-1">
         <h4 className="font-size-lg mb-0 py-3 pl-3 font-weight-bold">
                  Applicable To:
                </h4>
         </Grid>
        </Grid>

        <Grid container>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.allDepartments}
                          onClick={() => {this.handleAllDepartment(this.state.allDepartments);}}
                         
                         
                        />
                      }
                     
                      label="All Staff"
                    />
         </Grid>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         {this.state.roleData.length>0 && this.state.roleData.map((element, index) => {
                       if(this.state.allDepartments)
                          return this.renderDepartmentsCheckBox(element,index,true);
                         else 
                           return this.renderDepartmentsCheckBox(element,index,false);  
                  })}
        </Grid>
        <Divider />
        <Grid item xs={12} lg={12} className="py-1">
        <StandardSectionsList
          board_id={this.props.data.selectedBoardId}
          label={"All Students"}
          type="checkbox"
          mappedstandards={this.state.selectedStandards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
          </Grid>
        </Grid>
        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Events','can_export') && <Grid container>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button  type="submit" variant="outlined" className="successBtnOutline">
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </form>
        </Card>
        </Grid>  
        {/* <Grid item xs={12} md={8} lg={4}>
        <Card className="card-box p-4">
        <div className="font-weight-400 text-center font-size-lg">Upload Attachment</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.path?this.state.path:this.state.imagePreviewUrl} alt={this.state.imagePreviewUrl} />
                 </div>
               <div>
               {this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                 {"Select file"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove()}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
  
        </Grid> */}
        </Grid>  
  
         
        </Grid>  
        </Grid>  }

        {(this.state.actionType == "view" || this.state.actionType == "assessment") && <Grid container justify={this.props.data.usertype!= "student" ? "none" : "center"}>
        {this.props.data.usertype!= "student" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allStudents ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getEventDetails();this.setState({searchStudent:false,allStudents:true,selectedStandardId:''})}}>
                    <span>All</span>
                    <span className="ml-auto badge badge-warning">{this.state.TotalStudentCount}</span>
                  </ListItem>
                  <Divider />
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid>  }
        <Grid item xs={12} md={8} lg={9}>
        <Grid container>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Events
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.events.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          title: original.title,
          type:original.type,
          description:original.description,
          path:original.path,
          start_date:original.start_date,
          end_date:original.end_date,
          from_time:original.from_time,
          to_time:original.to_time,
          day_difference:original.day_difference,
          student_applicable:original.student_applicable,
          staff_applicable:original.staff_applicable,
          status:original.status,
          assigned:original.assigned,
          actions: (
            // we've added some custom button actions
            <div>
              { /* use this button to add a like kind of action */ }
            
                        <Tooltip
        id="tooltip-top"
        title="Edit"
        placement="top"
        >
        <Button
                          simple
                          disabled={original.status == 1 ? false:true}
                          onClick={() => {console.log(moment(original.start_date+' '+original.to_time).format('HH:mm'));this.getRoleData(original.staff_applicable);this.setState({editEventPanel:true,title:original.title, startdate:new Date(original.start_date),enddate:new Date(original.end_date),from_time:moment(original.start_date+' '+original.from_time).format('YYYY-MM-DD  HH:mm'),to_time:moment(original.start_date+' '+original.to_time).format('YYYY-MM-DD HH:mm'),staff_depts:original.staff_applicable,student_standards:original.student_applicable, id_event:original.id, path:Config.path+"writable/uploads/event/"+original.path, type:original.type, event_description:EditorState.createWithContent(ContentState.createFromText(original.description))})}}
                          color="secondary"
                          className="edit"
                        >
                          <Edit />
                        </Button>
        </Tooltip>
                        
                        {/* use this button to remove the data row */}
                       
                    <Tooltip
        id="tooltip-top"
        title={original.status == "1" ? "Deactivate":"Activate"}
        placement="top"
 
        >
         <FormControlLabel
                    control={
                      <Switch
                        checked={original.status == "1" ? true:false}
                        onChange={() => this.handleEventDelete(original.id,original.status)}
                        value="checkedA"
                      />
                    }
                  
                    label=""
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
id="sno"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Title",
  accessor: "title",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="title"   
value={filter ? filter.value : ''}
placeholder="Search Title"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "From",
accessor: "start_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="standard"   
value={filter ? filter.value : ''}
placeholder="Search Date"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "To",
accessor: "end_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="end_date"   
value={filter ? filter.value : ''}
placeholder="Search Date"
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
    <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"Assignments/excelAssignment?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
        Export
        </Button>
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={3}></Grid>            
        </Grid>
        </Grid> 
        </Grid>
           }      

        <Drawer

          anchor="right"
          open={this.state.editEventPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({editEventPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({editEventPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Edit Event
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
    
        <Grid container justify="center">
        <Grid item xs={12} md={12} lg={12}>
        <Card className="card-box  mb-4 ">
        <form
        onSubmit={this.handleEvent.bind(this)}
        autoComplete="off">
        <CardContent>
 

        <Grid container>
        <Grid item xs={12} lg={12}>
            {this.renderTextInput("title","Title")}
        </Grid>
      <Grid item xs={12} md={12} lg={6} className="pickerGrid">
      <FormControl fullWidth>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker 
        disableToolbar
        inputProps={{ readOnly: true }}
        autoOk={true}
        variant="inline"
        inputVariant="outlined"
        format="dd/MM/yyyy"
        className="m-2"
        id="start-date"
        label="Start date"
        value={this.state.startdate}
        onChange={this.handleStartDate}
        KeyboardButtonProps={{
        'aria-label': 'change date',
        }}
        />
        </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={6} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker 
            disableToolbar
            inputProps={{ readOnly: true }}
            autoOk={true}
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            className="m-2"
            id="end-date"
            label="End date"
            value={this.state.enddate}
            onChange={this.handleEndDate}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
            </MuiPickersUtilsProvider>
      </FormControl>
      </Grid>
     
    </Grid>

    <Grid container>

<Grid item xs={12} sm={6} md={3} className="text-center">  
        <FormControlLabel
          control={
            <Radio
              checked={this.state.type === "Allday"}
              onChange={() => this.handleGradingRequired("Allday")}
              value="Allday"
              name="radio button enabled"
              aria-label="A"
            
            />
          }
        
          label="All day"
        />
      </Grid>
<Grid item xs={12} sm={6} md={9}  className="text-center">      
<Grid container>
 <Grid item xs={12} sm={6} md={4}  className="text-center">
        <FormControlLabel
          control={
            <Radio
              checked={this.state.type === "Schedule"}
              onChange={() => this.handleGradingRequired("Schedule")}
              value="Schedule"
              name="radio button enabled"
              aria-label="A"
             
            />
          }
          label="Schedule"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}  className="text-center">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
          className="m-2"
          id="start-time"
          label="Start Time"
          inputVariant="outlined"
          inputProps={{ readOnly: true }}
          value={this.state.from_time}
          onChange={(x, event) => this.handleChangeTime(x,"from_time")}   
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /></MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={6} md={4}  className="text-center">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
          className="m-2"
          id="to-time"
          label="End Time"
          inputProps={{ readOnly: true }}
          inputVariant="outlined"
          value={this.state.to_time}
          onChange={(x, event) => this.handleChangeTime(x,"to_time")}   
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /></MuiPickersUtilsProvider>
      </Grid>
      </Grid>
      </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.event_description}
          placeholder="Enter description"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateUpdate}
        />
        </Card>
        </Grid>
        </Grid>

       <Grid container>
         <Grid item xs={12} lg={12} className="py-1">
         <h4 className="font-size-lg mb-0 py-3 pl-3 font-weight-bold">
                  Applicable To:
                </h4>
         </Grid>
        </Grid>

        <Grid container>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.allDepartments}
                          onClick={() => {this.handleAllDepartment(this.state.allDepartments);}}
                         
                         
                        />
                      }
                     
                      label="All Staff"
                    />
         </Grid>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         {this.state.roleData.length>0 && this.state.roleData.map((element, index) => {
                       if(this.state.allDepartments)
                          return this.renderDepartmentsCheckBox(element,index,true);
                         else 
                           return this.renderDepartmentsCheckBox(element,index,false);  
                  })}
        </Grid>
        <Divider />
        <Grid item xs={12} lg={12} className="py-1">
        <StandardSectionsList
          board_id={this.props.data.selectedBoardId}
          label={"All Students"}
          type="checkbox"
          mappedstandards={this.state.selectedStandards}
          selectedSections={this.state.student_standards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
          </Grid>
        </Grid>
        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        <Grid container>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button type="submit"  variant="outlined" className="successBtnOutline">
        Submit
        </Button>
        </Grid>
        </Grid>
        </CardActions>
        </form>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToPros)(AddViewEvent);
