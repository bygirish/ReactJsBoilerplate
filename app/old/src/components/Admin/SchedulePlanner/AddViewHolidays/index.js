import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../config';
import { AuthHelper } from '@utils/AuthHelper.js';
import i18n from '../../../../i18n';
import moment from "moment";

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

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

class AddViewHoliday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:AuthHelper('Holidays','can_create') ? 'create':'view',
      loading:false,
      id_holiday:'',
      allDepartments:false,
      dashboardDetails:[],
      selectedStandards:[],
      subjects:[],
      roleData:[],
      markSubmitted:'',
      lfeedback:'',
      filterReadReceipients:[],
      holidays:[],
      SelectedSectionsIds:'',
      SelectedDepartmentIds:'',
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
      basicNotify:false,
      allStudents:true,
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
      dailydairy_description: EditorState.createEmpty(),
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
  onEditorStateChange = dailydairy_description => {
    this.setState({dailydairy_description})};
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
      console.log(selectedDepartmentsIds)
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
       this.setState({ gradeRequired: value });
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
    console.log(standards);
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
          className="m-2"
          inputProps={{
           autoComplete: "off",
           style: {textTransform: 'capitalize'}
          }}
          required
          id="document-type"   
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

  handleHoliday = e => {
    e.preventDefault();
    const postData = {
      id_academicyear: this.state.selectedAcademicYear, 
      id_board: this.state.selectedBoard, 
      title:this.state.title,
      type: this.state.type, 
      start_date: moment(this.state.startdate).format("YYYY-MM-DD"),
      end_date: moment(this.state.enddate).format("YYYY-MM-DD"),
      from_time: this.state.from_time,
      to_time: this.state.to_time,
      student_applicable: this.state.SelectedSectionsIds!=''?this.state.SelectedSectionsIds:this.state.student_standards,
      staff_applicable: this.state.SelectedDepartmentIds!=''?this.state.SelectedDepartmentIds:this.state.staff_depts,
      id:this.state.id_holiday,
      requestname: "insert_holiday",
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    console.log(postData);
    new Service().apiCall('HolidayDetails/insertHoliday', postData,
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
      <h4 className="font-weight-bold">{this.state.id_holiday!=''?`${t.holiday} ${t.updated}`:`${t.holiday} ${t.created}`}</h4>
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

  handleHolidayDelete =(id,status) =>{
    let switchStatus = "";
    if(status == 1){
       switchStatus = `${t.holiday} ${t.deactivated}`;
    }
    else{
       switchStatus = `${t.holiday} ${t.activated}`;
    }
    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('HolidayDetails/deleteHoliday', postData,
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
          this.getHolidayDetails(this.state.selectedBoard,this.state.selectedAcademicYear,'','','');

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

    getHolidayDetails(id_board,id_academicyear,id_section,type,id_dept){
      const postData = { 
        id_section:id_section,
        id_academicyear:id_academicyear?id_academicyear:this.props.data.selectedAcademicId,
        id_board:id_board?id_board:this.props.data.selectedBoardId,
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        role_id: this.props.data.role_id,
        type:type,
        id_dept:id_dept
      };
      new Service().apiCall('HolidayDetails/getHolidayDetails',postData).then(response => {
        console.log(response)
        if (response.status==200 && response.data!='') {
          this.setState({ holidays: response.data });
        }else{
          this.setState({ holidays: [] });
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
        console.log(data);
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      console.log(error);

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
    this.getHolidayDetails(this.state.selectedBoard,this.state.selectedAcademicYear,id,'student','');
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
    console.log(this.props.data)
   this.getStandardSectionDetails();
   this.getSubjectDetails();
   this.getHolidayDetails();
   this.getRoleData();
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
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/holidays")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              {t.add}/{t.view} {t.holiday}
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
              {AuthHelper('Holidays','can_create') && <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.actionType == "create" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:'create',selectedStandards:[], id_holiday:'', title:'',startdate:new Date(),enddate:new Date()});this.getRoleData(); }}>
                  {t.create}
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "view" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:"view"}); }}>
                {t.view}
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
        <Grid container  justify="center">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 ">
        <form
        onSubmit={this.handleHoliday.bind(this)}
        autoComplete="off">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  {t.create} {t.holiday}
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
        id="start-date"
        label={t.start_date}
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
            autoOk={true}
            inputProps={{ readOnly: true }}
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            className="m-2"
            id="end-date"
            label={t.end_date}
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
                     
                      label={`${t.all} ${t.staff}`}
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
          label={`${t.all} ${t.students}`}
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
        <Grid container>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button type="submit"  variant="outlined" className="successBtnOutline">
        {t.submit}
        </Button>
        </Grid>
        </Grid>
        </CardActions>
        </form>
        </Card>
        </Grid>  
     
        </Grid>  
  
         
        </Grid>  
        </Grid>  }

        {(this.state.actionType == "view") && <Grid container justify={this.props.data.usertype!= "student" ? "none" : "center"}>
      {this.props.data.usertype!= "student" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allStudents ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getHolidayDetails();this.setState({searchStudent:false,allStudents:true,selectedStandardId:''})}}>
                    <span>{t.all}</span>
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
                {t.holidays}
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.holidays.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          title: original.title,
          start_date:original.start_date,
          end_date:original.end_date,
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
                          onClick={() => {this.getRoleData(original.staff_applicable);this.setState({editHolidayPanel:true,title:original.title, startdate:new Date(original.start_date),enddate:new Date(original.end_date),staff_depts:original.staff_applicable,student_standards:original.student_applicable, id_holiday:original.id})}}
                          color="secondary"
                          className="edit"
                        >
                          <Edit  />
                        </Button>
        </Tooltip>
                        
                        {/* use this button to remove the data row */}
                       
                    <Tooltip
        id="tooltip-top"
        title={original.status == "1" ? `${t.deactivate}`:`${t.activate}`}
        placement="top"
 
        >
         <FormControlLabel
                    control={
                      <Switch
                        checked={original.status == "1" ? true:false}
                        onChange={() => this.handleHolidayDelete(original.id,original.status)}
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
  Header: `${t.title}`,
  accessor: "title",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="title"   
value={filter ? filter.value : ''}
placeholder={`${t.search} ${t.title}`}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: `${t.from}`,
accessor: "start_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="start_date"   
value={filter ? filter.value : ''}
placeholder={`${t.search} ${t.from}`}
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: `${t.to}`,
accessor: "end_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="end_date"   
value={filter ? filter.value : ''}
placeholder={`${t.search} ${t.to}`}
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: `${t.actions}`,
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
  {AuthHelper('Holidays','can_export') &&  <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button  variant="outlined" color="secondary" href={Config.url+"HolidayDetails/excelHolidayData?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_academicyear="+this.props.data.selectedAcademicId+"&id_board="+this.props.data.selectedBoardId}>
        {t.export}
        </Button>
        </Grid>
        </Grid>}
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
          open={this.state.editHolidayPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({editHolidayPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({editHolidayPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            {t.edit} {t.holiday}
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
    
        <Grid container justify="center">
        <Grid item xs={12} md={10} lg={10}>
        <Card className="card-box  mb-4 ">
        <form
        onSubmit={this.handleHoliday.bind(this)}
        autoComplete="off">
        <CardContent>
 

        <Grid container>
        <Grid item xs={12} lg={12} className="py-1">
            {this.renderTextInput("title",`${t.title}`)}
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
        id="date-picker-inline"
        label={`${t.start_date}`}
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
            id="date-picker-inline"
            label={`${t.end_date}`}
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
                     
                      label={`${t.all} ${t.staff}`}
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
          label={`${t.all} ${t.students}`}
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
        <Button type="submit" variant="outlined" className="successBtnOutline">
        {t.submit}
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

export default connect(mapStateToProps, mapDispatchToPros)(AddViewHoliday);
