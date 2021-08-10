import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw,ContentState } from 'draft-js'; 
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
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
      // actionType:'create',
      actionType:AuthHelper('Events','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      selectedStandards:[],
      subjects:[],
      subjectName:'',
      projectsData:[],
      standardSections:[],
      sectionSuggestions:[],
      filterSections:[],
      projectStudents:[],
      customAssignStudents:[],
      projectsMapData:[],
      projectsIdData:[],
      projectsMappedData:[],
      projectsNotesData:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
      basicNotify:false,
      allStudents:true,
      searchStudent:false,
      startdate: new Date(),
      currentDate:new Date(),
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
      ltype:'Grading System',
      lenabled:'',
      lgrademarks:'',
      lgrade:'',
      projectname:'',
      lsubmission:'',
      readReceipt:'',
      smsAlert:'',
      gradeData:[],
      project_description: EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      imagePreviewUrlStudent:defaultImage,
      imageStudent:defaultImage,
      assignmentsData:[],
      id_section_assess:'',
      id_assess:'',
      forms : {
        "Project":{
          fields:[
            {
                "name":"selectedStandardId",
                "title":"Standard",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            {
                "name":"lsubject",
                "title":"Subject",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            {
                "name":"projectname",
                "title":"Project Title",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            {
                "name":"lchapter",
                "title":"Chapter Title",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            {
                "name":"lsubmission",
                "title":"Submission Type",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            {
                "name":"gradeRequired",
                "title":"Grading Type",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            }
          ]
        }
      }
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = project_description => {
    this.setState({project_description})};
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


  validateForm = (formName) =>{ 
    let selectedForm = this.state.forms[formName];
    let errorMessage = [];
    let isFormValid = true;
    selectedForm.fields.forEach((field , index) =>{
      let fieldValue = this.state[field.name];
      var lFieldErrorMessage = this.validateField(field,fieldValue);
      if(!lFieldErrorMessage == ""){
        isFormValid = false;
        errorMessage.push(lFieldErrorMessage);
      }        
    })
    this.setState({errorMessageArray:errorMessage});
    //alert(errorMessage);
    {isFormValid == false &&
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="p-5">
            <h6 className="font-weight-bold"> 
              {errorMessage.map((element) => 
                <div style={{color:'red', fontSize:13, marginBottom:10}}><Brightness1Icon style={{fontSize:12}} /> {element}</div>
              )}
            </h6>

            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        )
      });
    }
    return isFormValid;
  }

  validateField = (field,FieldValue) => {
    let errorString = "";
    // if(FieldValue.length < field.minLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.minLength;
    // if(FieldValue.length > field.maxLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.maxLength;
    if(FieldValue == '' && field.isMandatory == true)
        errorString = errorString + field.title + " should not be empty";
    
        return errorString;
  }
  
  handleClose =() =>{
    this.setState({basicNotify:false});
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
    (moment(startdate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
    this.setState({ startdate: startdate }) )
  };
  handleEndDate = (enddate) => {
    (moment(enddate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
    this.setState({ enddate: enddate }) )
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
    this.setState({selectedStandards:standards}); 
    let stdIds = [];
    standards.map((element,index) =>{
      stdIds.push(element.id);
     });
     let selectedStandardId = stdIds.join(",");
     this.getSubjectDetails(selectedStandardId);
     this.setState({selectedStandardId:selectedStandardId})
     console.log({selectedStandardId});
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
           style: { textTransform: 'capitalize' },
           pattern: "[a-z]"
          }}
          id="document-type"   
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
  renderTextInputEdit = (name,label) => {
    return (
      <FormControl fullWidth>
      <TextField 
      disabled={this.props.data.usertype == "student"? true:false}
        inputProps={{
         autoComplete: "off",
         pattern: "[a-z]",
         style: { textTransform: 'capitalize' }
        }}
        // id="document-type"   
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
  handleESubjectSelection= (type,name,status) => {
    if(type){  
      this.setState({subjectChecked:true,Esubject:type});	 
      }
      else{
      this.setState({ subjectChecked:false,Esubject:'' });
      } 
      console.log({type})
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

  handleproject = () => {    

    if(this.validateForm('Project') == true){
      const lUserData = this.props.data;
      let data = new FormData();
      let formData = new FormData();
      formData.append('id_board',this.state.selectedBoard);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      formData.append('customStudents',JSON.stringify(this.state.customAssignStudents));
      formData.append('start_date',moment(this.state.startdate).format("YYYY-MM-DD"));
      formData.append('end_date',moment(this.state.enddate).format("YYYY-MM-DD"));
      formData.append('submission',this.state.lsubmission);
      formData.append('subject_id',this.state.lsubject);
      formData.append('chapter',this.state.lchapter);
      formData.append('id_section',this.state.selectedStandardId);
      formData.append('name',this.state.projectname);
      formData.append('details',this.state.project_description.getCurrentContent().getPlainText());
      formData.append('type',this.state.ltype);
      formData.append('grade_required',this.state.gradeRequired);
      formData.append('mentored_by',this.state.lmentored);
      formData.append('grademarks',this.state.lgrademarks);
      formData.append('read_receipt',this.state.readReceipt);
      formData.append('sms_alert',this.state.smsAlert);
      formData.append('id','');
      formData.append('path',this.state.selectedFile);
      formData.append('requestname',"insert_project");
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('id_user',this.props.data.UID);
      console.log(...formData);
      
      new Service().apiCall('projects/insertProject', formData,
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
        <h4 className="font-weight-bold">Project Inserted</h4>
      </div>
    </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify:false});
          window.location.reload()

          }, 2000)
        
        } else {
          // this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");
        this.showError(error.response.data) 

      });
    }else{
      return false;
    }
  }
  handleUpdateProjectData = () => {
    const lUserData = this.props.data;
    let data = new FormData();
    let formData = new FormData();
    formData.append('id_board',this.state.selectedBoard);
    formData.append('id_section',this.state.selectedStandardId);
    formData.append('customStudents',JSON.stringify(this.state.customAssignStudents));
    formData.append('subject_id',this.state.lsubject?this.state.lsubject:this.state.projectsIdData.subject_id);
    formData.append('chapter',this.state.lchapter?this.state.lchapter:this.state.projectsIdData.chapter);
    formData.append('name',this.state.projectname?this.state.projectname:this.state.projectsIdData.name);
    formData.append('details',this.state.project_description?this.state.project_description:this.state.projectsIdData.details);
    formData.append('submission',this.state.selectedEnabledSubmission?this.state.selectedEnabledSubmission:this.state.projectsIdData.submission);
    formData.append('type',this.state.ltype?this.state.ltype:this.state.projectsIdData.type);
    formData.append('grade_required',this.state.gradeRequired?this.state.gradeRequired:this.state.projectsIdData.grade_required);
    formData.append('grademarks',this.state.lgrademarks?this.state.lgrademarks:this.state.projectsIdData.grademarks);
    formData.append('id',this.state.projectsIdData.id);
    formData.append('path',this.state.selectedFile);
    formData.append('start_date',this.state.startdate?moment(this.state.startdate).format("YYYY-MM-DD"):this.state.projectsIdData.start_date);
    formData.append('end_date',this.state.enddate?moment(this.state.enddate).format("YYYY-MM-DD"):this.state.projectsIdData.end_date);
    formData.append('read_receipt',this.state.readReceipt?this.state.readReceipt:this.state.projectsIdData.read_receipt);
    formData.append('sms_alert',this.state.smsAlert?this.state.smsAlert:this.state.projectsIdData.sms_alert);
    formData.append('mentored_by',this.state.lmentored?this.state.lmentored:this.state.projectsIdData.mentored_by);
    formData.append('requestname',"update_project");
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('token','abc');
    formData.append('id_user',this.props.data.UID);
    
    const postData = {
      id_board: this.state.selectedBoard, 
      id_section:this.state.selectedStandardId,
      customStudents: this.state.customAssignStudents,
      subject_id:this.state.lsubject?this.state.lsubject:this.state.projectsIdData.subject_id,
      chapter: this.state.lchapter?this.state.lchapter:this.state.projectsIdData.chapter, 
      name: this.state.projectname?this.state.projectname:this.state.projectsIdData.name,
      details: this.state.project_description?this.state.project_description:this.state.projectsIdData.details,
      submission:this.state.selectedEnabledSubmission?this.state.selectedEnabledSubmission:this.state.projectsIdData.submission,
      type:this.state.ltype?this.state.ltype:this.state.projectsIdData.type,
      grade_required: this.state.gradeRequired?this.state.gradeRequired:this.state.projectsIdData.grade_required,
      grademarks:this.state.lgrademarks?this.state.lgrademarks:this.state.projectsIdData.grademarks,
      id:this.state.projectsIdData.id,
      path:'../pdf/project/'+this.state.selectedFile,
      start_date: this.state.startdate?moment(this.state.startdate).format("YYYY-MM-DD"):this.state.projectsIdData,
      end_date:this.state.enddate?moment(this.state.enddate).format("YYYY-MM-DD"):this.state.projectsIdData.end_date,
      read_receipt:this.state.readReceipt?this.state.readReceipt:this.state.projectsIdData.read_receipt,
      sms_alert:this.state.smsAlert?this.state.smsAlert:this.state.projectsIdData.sms_alert,
      mentored_by:this.state.lmentored?this.state.lmentored:this.state.projectsIdData.mentored_by,
      created_by: lUserData.UID, 
      requestname: "update_project",
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('projects/updateProject', formData,
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
      <h4 className="font-weight-bold">Project Updated</h4>
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
    //  this.raiseLoginSignupErrorAlert("signup");

    });
  }

  getAllDetails() {
    const postData = {
      standard_id:this.state.selectedStandardId,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_academicyear:this.state.selectedAcademicYear,
      id_board:this.state.selectedBoard,
      id_user: this.props.data.UID
    };
    new Service().apiCall('projects/getData',postData).then(response => {
     // console.log(response.data);
      if (response.status==200 && response.data!='') {
        this.setState({ tableData: response.data });
        this.setState({ column_count: response.data.length });
      }
    }).catch(error => {
      alert(error);

    });

  }

  getProjectDashboardDetails(id_board,id_academicyear) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:id_board,
      id_academicyear:id_academicyear
    };
    new Service().apiCall('projects/getProjectDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ dashboardDetails:response.data});
      }
    }).catch(error => {
      alert(error);

    });

  }
  getProjectData(id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      usertype:this.props.data.usertype,
      // id_section:id_section,
      id_section:this.props.data.usertype == "student"?this.props.data.standard:id_section, 
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
    };
    new Service().apiCall('projects/getData',postData).then(response => {
      console.log({response})
      if (response.status==200 && response.data!='') {
      
        var lProjects = [];
        response.data.forEach(element => {
                  var lProject = {};
                  lProject.id                  = element.id;
                  lProject.title               = element.title;
                  lProject.standrad            = element.standrad;
                  lProject.subjectname         = element.subjectname;
                  lProject.start_date          = element.start_date;
                  lProject.end_date            = element.end_date;
                  lProject.start_date          = element.start_date;
                  lProject.details             = element.details;
                  lProject.path                = element.path;
                  lProject.student_path        = element.student_path;
                  lProject.type                = element.type;
                  lProject.submission          = element.submission;
                  lProject.chapter             = element.chapter;
                  lProject.feedback             = element.feedback;
                  lProjects.push(lProject);
              });
        this.setState({ projectsData:lProjects});
        console.log('project'+JSON.stringify(this.state.projectsData))
      }else{
        this.setState({ projectsData:[]});
      }
    }).catch(error => {
      console.log(error)
    

    });

  }
  getProjectMappedData(id_section,id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_section:id_section,
      id:id
    };
    new Service().apiCall('projects/getStudentProjectMap',postData).then(response => {
      if (response.status==200 && response.data!='') {
        var lProjects = [];
        var data = [];
        response.data.forEach(element => {
                  var lProject = {};
                  lProject.id                  = element.id;
                  lProject.submitted           = element.submitted;
                  lProject.attachment          = element.attachment;
                  lProject.feedback            = element.feedback;
                  if(element.type=='Grading System'){
                    // lProject.grade             = element.gd?element.gd:element.grade;
                    lProject.grade             = element.gd?element.gd:element.gd;
                  }else{
                    // lProject.grade             = element.marks?element.marks:element.grade;
                    lProject.grade             = element.marks?element.marks:element.marks;
                  }
                  lProject.view_count          = element.view_count;
                  lProject.studentname         = element.studentname;
                  lProject.email               = element.email;
                  lProject.contact             = element.contact;
                  lProject.roll_no             = element.roll_no;
                  lProject.id_user             = element.id_user;
                  lProject.id_assignment       = element.id_assignment;
                  lProject.id_section          = element.id_section;
                  lProject.father_name         = element.father_name;
                  lProject.primary_contact     = element.primary_contact;
                  lProjects.push(lProject);
                  data.push({id:element.id,value:element.studentname+" "+String.fromCharCode(9679)+" "+element.id_user+" "+String.fromCharCode(9679)+" "+element.father_name+" "+String.fromCharCode(9679)+" "+element.roll_no+" "+String.fromCharCode(9679)+" "+element.primary_contact});
           
              });
              
        this.setState({ projectsMapData:lProjects,projectStudents:data});
      }
    }).catch(error => {
      alert(error);

    });

  }
  getProjectIdData(id_section,id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      usertype:this.props.data.usertype,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      id:id
    };
    new Service().apiCall('projects/getDataWithId',postData).then(response => {
      
      if (response.status==200 && response.data!='') {
        this.getNoteData(id);
        var lProjects = [];
        this.setState({ projectsIdData:response.data});
        this.setState({ Echapter:response.data.chapter,Estartdate:response.data.start_date,Eenddate:response.data.end_date,student_standards:response.data.selectedsection,Esubject:response.data.subject_id
          ,ETitle:response.data.name,Edescription:EditorState.createWithContent(ContentState.createFromText(response.data.details)),imagePreviewUrlStudent:Config.path+'writable/uploads/project/'+response.data.path});
          this.getSubjectDetails(response.data.selectedsection);
        }
    }).catch(error => {
      alert(error);

    });

  }
  getMappdedDataWithId(id){
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id:id
    };
    new Service().apiCall('projects/getMappedDataWithId',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ projectsMappedData:response.data});
      }
    }).catch(error => {
      alert(error);

    });
  }
  insertProjectFeedback(id){
    const lUserData = this.props.data;
    let data = new FormData();
    const postData = {
      id:id,
      feedback:this.state.lfeedback,
      grade:this.state.lgrade,
      marks:this.state.lmarks,
      created_by: lUserData.UID, 
      requestname: "insert_feedback",
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('projects/insertFeedback', postData,
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
      <h4 className="font-weight-bold">Feedback Inserted</h4>
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
     // this.raiseLoginSignupErrorAlert("signup");

    });
  }
  getNoteData(id){
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_project:id
    };
    new Service().apiCall('projects/getNoteData',postData).then(response => {
      console.log('noteData'+response);
      if (response.status==200 && response.data!='') {
        this.setState({ projectsNotesData:response.data});
      }
    }).catch(error => {
     // alert(error);

    });
  }

  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

    handleDeactive = (id,status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Student Deactivated";
       }
       else{
          switchStatus = "Student Activated Successfully";
       }
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        id_student: id,
        token:"abc",
        id_user: this.props.data.UID,
      };
      new Service().apiCall('StudentDetails/deleteStudent',postData).then(response => {
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
          this.getStudentDetails();
          setTimeout(() => {
            this.setState({ basicNotify:false});
          }, 2000) 
        }
      }).catch(error => {
        alert(error);
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
      alert(error);

    });
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

  handleSelecteSidebardSection = (id, name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,allStudents:false,searchStudent:false,activeSuggestion:0,filteredSuggestions:[],selectedStudentId:'',customAssignInput:"",customAssignStudents:[] });
    this.getProjectData(id);
  }

  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewMapped={true}
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.searchStudent && this.state.allStudents ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }
  handleImageChangeStudent = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrlStudent: reader.result
      });
    }
 
    reader.readAsDataURL(event.target.files[0])
  };
  handleClickStudent = () => {
    fileInput.current.click();
  };
  handleRemoveStudent = () => {
    this.setState({
      imagePreviewUrlStudent: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };
  insertProjectFile = () => {
 
    const lUserData = this.props.data;
    let data = new FormData();
    let formData = new FormData();
    formData.append('id_board',this.state.selectedBoard);
    formData.append('id_academicyear',this.state.selectedAcademicYear);
    
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('token','abc');
    formData.append('project_id',this.state.project_id);
    formData.append('path',this.state.selectedFile);
   
    formData.append('id_user',this.props.data.UID); 
    formData.append('created_by',lUserData.UID);
    console.log(...formData)
    new Service().apiCall('projects/insertProjectFile', formData,
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
          <h4 className="font-weight-bold">Project Uploaded!</h4>
          </div>
          </Dialog>
          ),
          });
        setTimeout(() => {
          window.location.reload()
          this.setState({
            basicNotify: false,
            selectedFile:null,
            imagePreviewUrlStudent:defaultImage
          })

        }, 2000)
      
      } else {
      // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)    
    });
 
}
handleEStartDate = (startdate) => {
  // let startdate = startdate;
//  console.log( moment(startdate).format("YYYY-MM-DD"));
(moment(startdate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
//  console.log(startDate) )
  this.setState({ Estartdate: startdate }) )
};
handleEEndDate = (enddate) => {
  (moment(enddate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
  this.setState({ Eenddate: enddate }) )
};
onEditorStateUpdate = Edescription => {
    
  this.setState({Edescription})
console.log({Edescription});
};
handleEvent(project_id,path){
  const lUserData = this.props.data;

  let data = new FormData();
  let formData = new FormData();
  formData.append('id_board',this.state.selectedBoard);
  formData.append('id_academicyear',this.state.selectedAcademicYear);
  
  // formData.append('id_section',this.state.SelectedSectionsIds);
  // formData.append('id_staff_dept',this.state.SelectedDepartmentIds);
  
  formData.append('start_date',moment(this.state.Estartdate).format("YYYY-MM-DD"));
  formData.append('end_date',moment(this.state.Eenddate).format("YYYY-MM-DD"));
  formData.append('project_id',project_id);
  formData.append('name',this.state.ETitle);

  formData.append('subject_id',this.state.Esubject);
  formData.append('chapter',this.state.Echapter);
  formData.append('path',this.state.selectedFile != null && this.state.selectedFile != '' ? this.state.selectedFile : path );
  
  formData.append('details',this.state.Edescription.getCurrentContent().getPlainText());
  
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc');
  formData.append('role_id',this.props.data.role_id);
  formData.append('id_user',this.props.data.UID);
 console.log(...formData);
  new Service().apiCall('Projects/updateProjectNew', formData,
  {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  ).then(response => {
    if (response.status==200 && response.data!='') {
      console.log(response.data);
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Project Updated</h4>
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

  componentDidMount() {
   this.getStandardSectionDetails();
   this.getSubjectDetails();
   this.getProjectData();
  // this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/project")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
             
              {this.props.data.usertype == "student"? "View Project":" Add/View Project"}
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Project/Seminar','can_create') &&
               <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.actionType == "create" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:'create'}); }}>
                  Create
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "view" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:"view"}); }}>
                View
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "assessment" ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({actionType:"assessment"}); }}>
                  Assessment
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
                 }    
               </Grid>
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
     {this.state.actionType == 'create' && 
     <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={1}>
         
        </Grid>
        
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 ">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Project
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} className="customDiv">
            <OutlinedDiv label="Add Sections">
            <Paper component="ul">
            {this.state.selectedStandards.length > 0 && this.state.selectedStandards.map((data,i) => {
              let icon="";
            return (
            <li key={data.id}>
            <Chip
            icon={icon}
            variant="outline"
            color="primary"
            label={data.name}
            className="m-1"
            />
            </li>
            );
            })}
            <li>
            <Chip
            onClick={()=>this.setState({standardPanel:true})}
            variant="outline"
            color="secondary"
            label={this.state.selectedStandards.length > 0?"Add more sections":"Add sections"}
            className="m-1"
            />
            </li>
            </Paper>
            </OutlinedDiv>
          </Grid>
        </Grid>
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={12} md={12} lg={4} className="customDiv">
            <OutlinedDiv label="Add Subject">
            <Paper component="ul">
            {this.state.subjectName!='' &&
             
            <li>
            <Chip
            variant="outline"
            color="primary"
            label={this.state.subjectName}
            className="m-1"
            />
            </li>
           
            }
            <li>
            <Chip
            disabled={this.state.selectedStandards.length > 0 ?false:true}
            onClick={()=>this.setState({subjectPanel:true})}
            variant="outline"
            color="secondary"
            label={this.state.subjectName.length > 0?"Change subject":"Select subject"}
            className="m-1"
            />
            </li>
            </Paper>
            </OutlinedDiv>
          </Grid>
          <Grid item xs={12} md={12} lg={4} className="pickerGrid">
          <FormControl fullWidth>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker 
            disableToolbar
            autoOk={true}
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Start date"
            inputProps={{ readOnly: true }}
            value={this.state.startdate}
            onChange={this.handleStartDate}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
            </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} lg={4} className="pickerGrid">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="End date"
                inputProps={{ readOnly: true }}
                value={this.state.enddate}
                onChange={this.handleEndDate}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={6} className="py-1">
          {this.renderTextInput("lchapter","Chapter")}
        </Grid>
        <Grid item xs={12} lg={6} className="py-1">
        <Grid container>
            <Grid xs={12} sm={6} md={4} className="text-center m-auto">  <FormLabel>
                    Submission
                  </FormLabel></Grid>
                  <Grid xs={12} sm={6} md={4}  style={{textAlign:'center'}}>
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.lsubmission === "Online"}
                          id="submission"
                          name="submission"
                          inputRef={el => this.submission = el} 
                          onChange={() => this.handleChangeEnabledSubmission("Online")}
                          value="Offline"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="Online"
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={4} className="text-center">
            
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.lsubmission === "Offline"}
                          onChange={() => this.handleChangeEnabledSubmission("Offline")}
                          id="submission"
                          name="submission"
                          inputRef={el => this.submission = el} 
                          value="Offline"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="Offline"
                    />
                  </Grid>
                  </Grid>
        </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={8} className="py-1">
            {this.renderTextInput("projectname","Project/Seminar Title")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
            {this.renderTextInput("lmentored","Mentored by")}
        </Grid>
        </Grid>  
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.project_description}
          placeholder="Enter description"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Card>
        </Grid>
        </Grid>  
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
           <Card className="card-box my-2 py-2">
           <Grid container>  
                  <Grid xs={12} sm={12} md={12}>
                  <Grid container>
                  <Grid xs={12} sm={6} md={2} className="text-center"></Grid>
            <Grid xs={12} sm={6} md={4} className="text-center m-auto">  
            <FormLabel>
                    Grading Required?
                  </FormLabel></Grid>
             <Grid xs={12} sm={6} md={2}  className="text-center">
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradeRequired === "1"}
                          onChange={() => this.handleGradingRequired("1")}
                          id = "grade"
                          inputRef={el => this.gradeRequired = el} 
                          value="Online"
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                      label="Yes"
                    />
                 
                  </Grid>
                  <Grid xs={12} sm={6} md={2} className="text-center">
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.gradeRequired === "0"}
                          onChange={() => this.handleGradingRequired("0")}
                          id = "grade"
                          inputRef={el => this.gradeRequired = el} 
                          value="No"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="No"
                    />
                 
                  </Grid>
                  <Grid xs={12} sm={6} md={2} className="text-center"></Grid>
                  </Grid>
                  </Grid>

                  {this.state.gradeRequired =="1" &&   <Grid xs={12} sm={12} md={12}>
                  <Grid>
    
             <Grid xs={12} sm={6} md={3} className="text-center">
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.ltype === "Grading System"}
                          onChange={() => {this.handleGradeMarksSelected("Grading System");this.handleGradingRequired("1");}}
                          value="Grade"
                          id = "type"
                          inputRef={el => this.type = el} 
                          name="radio button enabled"
                          aria-label="A"
                          checked = {this.state.ltype == "Grading System" ? true :false}
                        />
                      }
                      label="Grade"
                    />
                 
                  </Grid>
                  <Grid xs={12} sm={6} md={3} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.ltype === "Marks System"}
                          onChange={() => {this.handleGradeMarksSelected("Marks System");this.handleGradingRequired("1");}}
                          value="Marks"
                          id = "type"
                          inputRef={el => this.type = el} 
                          name="radio button enabled"
                          aria-label="B"
                          checked = {this.state.ltype == "Marks System" ? true :false}
                        />
                      }
                      label="Marks"
                    />
                  </Grid>
                 {this.state.grademarks!='' && <Grid xs={12} sm={6} md={6} style={{textAlign:'center'}} className="marksGradeGrid">
                 <FormControl fullWidth>
                    <TextField 
                    inputProps={{
                    autoComplete: 'off',
                    style: { textTransform: 'uppercase' }
                    }}       
                    id="document-type"   
                    label={this.state.ltype == "Marks System" ? " Mention max mark here" : "Mention grade here (eg:A+,A,B...)"}
                    rows={4}
                    value={this.state.lgrademarks}
                    onChange={(event) => this.state.ltype == "Marks System" ? this.setGrademarks(event.target.value.replace(/\D/g, "")):this.setGrademarks(event.target.value.replace(/\d/g, ""))}
                     />                   
                    </FormControl>
                  </Grid>}
                  </Grid>
                  </Grid>}

                  </Grid>  
           </Card>  
        </Grid>
        </Grid>  
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
           <Card className="card-box my-2 py-2">
           <Grid container>  
                  <Grid xs={12} sm={12} md={12}>
                  <Grid container>
                  <Grid xs={12} sm={6} md={6} className="text-center">
                    <Grid container>
                    <Grid xs={12} sm={6} md={12} className="text-center">  
                    
            <FormLabel>
                    Read receipt from recipients required?
                  </FormLabel></Grid>
              
             <Grid xs={12} sm={6} md={12} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.readReceipt=== 1}
                          onChange={() => this.handleReadReceiptRequired(1)}
                          value="Online"
                          id = "readreceipt"
                          inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                      label="Yes"
                    />
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.readReceipt === 0}
                          onChange={() => this.handleReadReceiptRequired(0)}
                          value="No"
                          id = "readreceipt"
                          inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="No"
                    />
                  </Grid>
                    </Grid>
                  </Grid>
         
                  <Grid xs={12} sm={6} md={6} className="text-center">
                    <Grid>
                    <Grid xs={12} sm={6} md={12} className="text-center">  
                    
            <FormLabel>
                    SMS alert to recipients required?<span style={{fontSize:'10px', margin:'auto', paddingLeft:'5px'}}>*cost may apply</span>  
                  </FormLabel></Grid>
              
             <Grid xs={12} sm={6} md={12} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.smsAlert === 1}
                          onChange={() => this.handleSmsAlert(1)}
                          value="Online"
                          id = "smsalert"
                          inputRef={el => this.smsalert = el} 
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                    
                      label="Yes"
                    />
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.smsAlert === 0}
                          onChange={() => this.handleSmsAlert(0)}
                          id = "smsalert"
                          inputRef={el => this.smsalert = el}
                          value="No"
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label="No"
                    />
                 
                  </Grid>
                    </Grid>
                  </Grid>
                  </Grid>
                  </Grid>
                  </Grid>  
                  </Card>
                  </Grid>
                  </Grid>
        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Project/Seminar','can_create') &&
        <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handleproject()}>
        Submit
        </Button>
        </Grid>
        </Grid>
        }
       </CardActions>
        </Card>
        </Grid>  
        <Grid item xs={12} md={8} lg={4}>
        <Card className="card-box p-4">
        <div className="font-weight-400 text-center font-size-lg">Upload Attachment</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrl} alt={this.state.imagePreviewUrl} />
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
  
        </Grid>
        </Grid>  
  
         
        </Grid>  
        </Grid>  }

        {(this.state.actionType == "view" || this.state.actionType == "assessment") && 
        <Grid container spacing={4} justify={this.props.data.usertype!= "student" ? "none" : "center"}>
        {this.props.data.usertype!= "student" && 
        <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allStudents ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);this.setState({searchStudent:false,allStudents:true,selectedStandardId:''});this.getProjectData()}}>
                    <span>All</span>
                    <span className="ml-auto badge badge-warning">{this.state.TotalStudentCount}</span>
                  </ListItem>
                  <Divider />
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid>  
        }
        <Grid item xs={12} md={8} lg={9}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Projects
                </h4>
              </div>
        </div>
        { this.props.data.usertype == "student" ?(
          
        <ReactTable
          data={this.state.projectsData.map((original,key) => {
            return ({
              slno: key+1,
              id:original.id,
              standrad: original.standrad,
              id_section: original.id_section,
              student_path:original.student_path,
              title:original.title,
              feedback:original.feedback,
              end_date:original.end_date
            })
          })}

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
            Header: "Title",
            accessor: "title",
            className: "center",
            Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Title"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
            )
            },
          {
          Header: "Feedback",
          accessor: "feedback",
          className: "center",
          Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search feedback"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
          )
          },

          {
          Header: "Expiring Status",
          accessor: "end_date",
          className: "center",
          Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Status"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
          )
          },
          {
            Header: "Assessed",
            accessor: "sent_date",
            className: "center",
            Filter: ({filter, onChange}) => (
              <TextField 
              inputProps={{
              autoComplete: 'off'
              }}         
              id="document-type"   
              value={filter ? filter.value : ''}
              placeholder="Search Assessed"
              type="text" 
              onChange={event => onChange(event.target.value)}
              />
            ),
            Cell: row => (
              // <div>No <span style={{marginLeft:'10px'}}> <Tooltip
              <div> <span style={{marginLeft:'10px'}}> <Tooltip
              id="tooltip-top"
              title={this.state.actionType=="view"? "View" : "Assess"}
              placement="top"
              >
                <Button style={{padding:0}}
                  simple
                  onClick={()=> {this.getProjectMappedData(row.original.id_section,row.original.id);this.state.actionType=="view"? this.getProjectIdData(row.original.id_section,row.original.id) : this.getProjectIdData(row.original.id_section,row.original.id);this.getProjectMappedData(row.original.id_section,row.original.id);this.setState({ viewAssignmentPanel: this.state.actionType=="view"? true : false,  assessmentPanel:this.state.actionType=="assessment" ? true:false})}}
                  color="secondary"
                  className="edit">{this.state.actionType=="view"? <ViewIcon /> : <Edit  />}
                </Button>
              </Tooltip></span></div>
            )
            },
            this.props.data.usertype == "student" &&
            {
              Header: 'Upload Project',
              accessor: "sent_date",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
               // placeholder="Search Assessed"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
              Cell: row => (
                <div> <span style={{marginLeft:'10px'}}> <Tooltip
                id="tooltip-top"
                title={this.state.actionType=="view"? "View" : "Assess"}
                placement="top"
                >
                                  <Button style={{padding:0}}
                                  simple
                                  onClick={()=> {this.getProjectMappedData(row.original.id_section,row.original.id);this.state.actionType=="view"? this.getProjectIdData(row.original.id_section,row.original.id) : this.getProjectIdData(row.original.id_section,row.original.id);
                                  this.getProjectMappedData(row.original.id_section,row.original.id);
                                  this.setState({ imageStudent:row.original.student_path,viewFileUpload: this.state.actionType=="view"? true : false,project_id:row.original.id});
                                 console.log('imageStudent'+JSON.stringify(row.original))}}
                                  color="secondary"
                                  className="edit"
                                >
                                {this.state.actionType=="view"? <AddIcon /> : <Edit  />}
                                </Button>
                </Tooltip></span></div>
              )
              }
          ]}
          defaultFilterMethod={filterCaseInsensitive}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          />
          ):(
            <ReactTable
          data={this.state.projectsData.map((original,key) => {
            return ({
              slno: key+1,
              id:original.id,
              standrad: original.standrad,
              id_section: original.id_section,
              title:original.title,
              end_date:original.end_date
            })
          })}

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
            Header: "Title",
            accessor: "title",
            className: "center",
            Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Title"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
            )
            },
          // {
          // Header: "Standard",
          // accessor: "standrad",
          // className: "center",
          // Filter: ({filter, onChange}) => (
          // <TextField 
          // inputProps={{
          // autoComplete: 'off'
          // }}         
          // id="document-type"   
          // value={filter ? filter.value : ''}
          // placeholder="Search Standard"
          // type="text" 
          // onChange={event => onChange(event.target.value)}
          // />
          // )
          // },

          {
          Header: "Expiring Status",
          accessor: "end_date",
          className: "center",
          Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Status"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
          )
          },
          {
            Header: "Assessed",
            accessor: "sent_date",
            className: "center",
            Filter: ({filter, onChange}) => (
              <TextField 
              inputProps={{
              autoComplete: 'off'
              }}         
              id="document-type"   
              value={filter ? filter.value : ''}
              placeholder="Search Assessed"
              type="text" 
              onChange={event => onChange(event.target.value)}
              />
            ),
            Cell: row => (
              // <div>No <span style={{marginLeft:'10px'}}> <Tooltip
              <div> <span style={{marginLeft:'10px'}}> <Tooltip
              id="tooltip-top"
              title={this.state.actionType=="view"? "View" : "Assess"}
              placement="top"
              >
                <Button style={{padding:0}}
                  simple
                  onClick={()=> {this.getProjectMappedData(row.original.id_section,row.original.id);this.state.actionType=="view"? this.getProjectIdData(row.original.id_section,row.original.id) : this.getProjectIdData(row.original.id_section,row.original.id);this.getProjectMappedData(row.original.id_section,row.original.id);this.setState({ viewAssignmentPanel: this.state.actionType=="view"? true : false,  
                  assessmentPanel:this.state.actionType=="assessment" ? true:false,id_section_assess:row.original.id_section,id_assess:row.original.id})}}
                  color="secondary"
                  className="edit">{this.state.actionType=="view"? <ViewIcon /> : <Edit  />}
                </Button>
              </Tooltip></span></div>
            )
            }
          ]}
          defaultFilterMethod={filterCaseInsensitive}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          />
          )}
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Project/Seminar','can_export') &&
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"Projects/excelProject?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
        Export
        </Button>
        </Grid>
        </Grid>
}
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
open={this.state.viewFileUpload}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewFileUpload:false})}>
<Box className={"app-header-drawer bgColor text-center"} style={{width:width40p}} justify="center">
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewFileUpload:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
   Upload Project
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20 text-center" justify="center">
<Grid container spacing={4} justify="center">
<Grid item xs={12} md={8} lg={8} justify="center">
        <Card className="card-box p-4 text-center">
        <div className="font-weight-400 text-center font-size-lg">Student Attachment</div>
        <a target="_blank" href={Config.path+'writable/uploads/project/'+this.state.imageStudent}>{this.state.imageStudent} </a>
        
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChangeStudent} ref={fileInput} />
                 <div className={"img-circle"}>
                 {this.state.selectedFile === null ? (
                 <img className="w-100" src={Config.path+'writable/uploads/project/'+this.state.imageStudent} alt={Config.path+'writable/uploads/project/'+this.state.imageStudent}/>
                 ):
                 ( <img className="w-100" src={this.state.imagePreviewUrlStudent} alt={this.state.imagePreviewUrlStudent} />
                 )}
                    {/* <img className="w-100" src={this.state.imagePreviewUrlStudent} alt={this.state.imagePreviewUrlStudent} /> */}
                  {/* {this.state.imageStudent !=''&&
                   <img className="w-100" src={Config.path+'writable/uploads/project/'+this.state.imageStudent} alt={Config.path+'writable/uploads/project/'+this.state.imageStudent}/>
                   } */}
                 </div>
               <div>
               {this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 {"Select file"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemoveStudent()}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
             
              <CardActions>
<Grid container spacing={4}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" color="secondary" onClick={()=>this.setState({viewFileUpload:false}),this.insertProjectFile}>
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
          open={this.state.standardPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({standardPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({standardPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Select Section
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4">
          <CardContent>
          <StandardSectionsList
          board_id={this.props.data.selectedBoardId}
          type="checkbox"
          mappedstandards={this.state.selectedStandards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
          </CardContent>
          <CardActions>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
          <Button   variant="outlined" color="secondary" onClick={()=>this.setState({standardPanel:false})}>
            Submit
          </Button>
          </Grid>
          </Grid>
          </CardActions>
          </Card>
        </div>
        </PerfectScrollbar>
        </Box>
        </Drawer>

        <Drawer
anchor="right"
open={this.state.subjectPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({subjectPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({subjectPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Select Subject
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4">
<CardContent>
{this.state.subjects.length > 0 && this.state.subjects.map((element, index) => {
                        return <Grid container>
                        <Grid xs={12} sm={10} md={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}   
                                checked={(element.id==this.state.lsubject)?this.state.subjectChecked:false}
                                onClick={() => {this.handleSubjectSelection(element.id,element.name,this.state.subjectChecked)}}
                              />
                            }
                            label={element.name}
                          />
                          </Grid> 
                      </Grid>    
                    })}
</CardContent>
{/* <CardActions>
<Grid container spacing={4}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" color="secondary" onClick={()=>this.setState({subjectPanel:false})}>
  Submit
</Button>
</Grid>
</Grid>
</CardActions> */}
</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.viewAssignmentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignmentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignmentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Edit Project
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={10} md={4}>
    {/* <strong>Subject:</strong> {this.state.projectsIdData.subjectname} */}
    { this.state.Esubject !='' && this.state.Esubject != undefined &&
<FormControl fullWidth>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Subject"
                                    variant="outlined"
                                    value={this.state.Esubject}
                                    onChange={(event) =>
                                      this.handleESubjectSelection( event.target.value)
                                    }
                                    // required
                                  >
                                  
                                    {this.state.subjects.map(option => (
                                      <MenuItem key={option.id} value={option.id} id={option.id}>
                                        {option.name}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  
                                </FormControl>
}
    
</Grid>
<Grid item xs={12} sm={10} md={8}>
{/* <strong>Chapter:</strong> {this.state.projectsIdData.chapter} */}
{this.state.Echapter != '' && this.state.Echapter!=undefined &&
this.renderTextInputEdit("Echapter","Chapter")
}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={10} md={4}>
    {/* <strong>Start Date:</strong> {this.state.projectsIdData.start_date} */}
    <FormControl fullWidth>
<MuiPickersUtilsProvider utils={DateFnsUtils}>
<KeyboardDatePicker 
 disabled={this.props.data.usertype == "student"? true:false}
disableToolbar
autoOk={true}
variant="inline"
inputVariant="outlined"
format="dd/MM/yyyy"
margin="normal"
id="date-picker-inline"
label="Start date"
inputProps={{ readOnly: true }}
value={this.state.Estartdate}
onChange={this.handleEStartDate}
KeyboardButtonProps={{
'aria-label': 'change date',
}}
/>
</MuiPickersUtilsProvider>
</FormControl>
</Grid>
<Grid item xs={12} sm={10} md={8}>
{/* <strong>End Date:</strong> {this.state.projectsIdData.end_date} */}
<FormControl fullWidth>
<MuiPickersUtilsProvider utils={DateFnsUtils}>
  <KeyboardDatePicker 
   disabled={this.props.data.usertype == "student"? true:false}
  disableToolbar
  autoOk={true}
  variant="inline"
  inputVariant="outlined"
  format="dd/MM/yyyy"
  margin="normal"
  id="date-picker-inline"
  label="End date"
  inputProps={{ readOnly: true }}
  value={this.state.Eenddate}
  onChange={this.handleEEndDate}
  KeyboardButtonProps={{
  'aria-label': 'change date',
  }}
  />
  </MuiPickersUtilsProvider>
</FormControl>
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={10} md={4}>
    <strong>Submission:</strong> {this.state.projectsIdData.submission}
</Grid>
<Grid item xs={12} sm={10} md={8}>
<strong>Type: </strong>{this.state.projectsIdData.type}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Title: </strong> {this.state.projectsIdData.name} */}
{this.state.ETitle != '' && this.state.ETitle!=undefined &&
this.renderTextInputEdit("ETitle","Title")
}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Description: </strong> {this.state.projectsIdData.details} */}
{this.state.Edescription != '' && this.state.Edescription!=undefined &&
<Card className="card-box my-2 py-2">
<Editor
//  disabled={this.props.data.usertype == "student"? true:false}
//  disable={this.props.data.usertype == "student"? true:false}
 readOnly={this.props.data.usertype == "student"? true:false}
editorState={this.state.Edescription}
placeholder="Enter description"
toolbarClassName="toolbarClassName"
wrapperClassName="wrapperClassName"
editorClassName="editorClassName"
onEditorStateChange={this.onEditorStateUpdate}
/>
</Card>
}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> <a target="_blank" href={Config.path+'writable/uploads/project/'+this.state.projectsIdData.path}>{this.state.projectsIdData.path}</a>
<Divider className="my-2" />
        <FormControl fullWidth height={100}>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChangeStudent} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrlStudent} alt={this.state.imagePreviewUrlStudent} />
                 </div>
               <div>
               {this.props.data.usertype != "student"? 
               this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 {"Select file"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemoveStudent()}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               ) : ''}
               </div>
               </div>
              </FormControl> 
         
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Assigned to: </strong> {this.state.projectsIdData.standardname+this.state.projectsIdData.sectionname} */}
{this.state.student_standards !='' && this.state.student_standards!=undefined &&
<StandardSectionsList
board_id={this.props.data.selectedBoardId}
label={"All Students"}
type="checkbox"
disable={true}
// disabled={this.props.data.usertype == "student"? true:false}
mappedstandards={this.state.selectedStandards}
selectedSections={this.state.student_standards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleStandardSelected}
{...this.props} 
/>}
</Grid>
</Grid>
</Card>

<CardActions stats style={{marginTop:0}}>
{AuthHelper('Project/Seminar','can_create') &&<Grid container spacing={2}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handleEvent(this.state.projectsIdData.id,this.state.projectsIdData.path)}>
Submit
</Button>
</Grid>
</Grid>}
</CardActions>

{/* <Card className="card-box  mb-4 p-3">
{this.state.projectsNotesData.map((element, idx) => (
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Note: </strong> {element.note}
</Grid>
<Grid item xs={12} sm={12} md={12}>
<strong>Added on: </strong> {element.note_created}
</Grid>
</Grid>
 ))}
</Card> */}
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.assessmentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({assessmentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({assessmentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
   Assessment
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Assessment 
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.projectsMapData.map((original,key) => {
        // return ({
        //   slno: key+1,
        //   id:original.id,
        //   studentname: original.studentname,
        //   submitted:original.submitted,
        //   attachment:original.attachment,
        //   feedback:original.feedback,
        //   grade:original.grade,
        //   marks:original.marks,
        //   id_assignment:original.id_assignment,
        //   id_section:original.id_section
        // })
        return ({
          slno: key+1,
          id:original.id,
          studentname: original.studentname,
          submitted:original.submitted =='1'?'Yes':'No',
          // attachment:original.attachment,
          attachment:(<a target="_blank" href={Config.path+'writable/uploads/project/'+original.attachment}>{original.attachment}</a>),
          feedback:original.feedback,
          grade:original.grade,
          marks:original.marks,
          id_assignment:original.id_assignment,
          id_section:original.id_section
        })
})
}

filterable
minRows={0}
// columns={[
// {
// Header: "S No",
// accessor: "slno",
// width: 80,
// className: "center",
// Filter: ({filter, onChange}) => (
// <TextField 
// inputProps={{
// autoComplete: 'off'
// }}         
// id="document-type"   
// value={filter ? filter.value : ''}
// placeholder="Search S No"
// type="text" 
// onChange={event => onChange(event.target.value)}
// />
// )
// },
// {
//   Header: "Student Name",
//   accessor: "studentname",
//   className: "center",
//   Filter: ({filter, onChange}) => (
// <TextField 
// inputProps={{
// autoComplete: 'off'
// }}         
// id="document-type"   
// value={filter ? filter.value : ''}
// placeholder="Search Student Name"
// type="text" 
// onChange={event => onChange(event.target.value)}
// />
//   )
//   },
// {
// Header: "Submitted?",
// accessor: "submitted",
// className: "center",
// Filter: ({filter, onChange}) => (
// <TextField 
// inputProps={{
// autoComplete: 'off'
// }}         
// id="document-type"   
// value={filter ? filter.value : ''}
// placeholder="Search Status"
// type="text" 
// onChange={event => onChange(event.target.value)}
// />
// )
// },

// {
// Header: "Attachment",
// accessor: "attachment",
// className: "center",
// Filter: ({filter, onChange}) => (
// <TextField 
// inputProps={{
// autoComplete: 'off'
// }}         
// id="document-type"   
// value={filter ? filter.value : ''}
// placeholder="Search Attachment"
// type="text" 
// onChange={event => onChange(event.target.value)}
// />
// )
// },
// {
//   Header: "Feedback",
//   accessor: "feedback",
//   className: "center",
//   Filter: ({filter, onChange}) => (
//     <TextField 
//     inputProps={{
//     autoComplete: 'off'
//     }}         
//     id="document-type"   
//     value={filter ? filter.value : ''}
//     placeholder="Search Feedback"
//     type="text" 
//     onChange={event => onChange(event.target.value)}
//     />
//   ),
//   },
//   {
//     Header: "Grade/Marks",
//     accessor: "feedback",
//     className: "center",
//     Filter: ({filter, onChange}) => (
//       <TextField 
//       inputProps={{
//       autoComplete: 'off'
//       }}         
//       id="document-type"   
//       value={filter ? filter.value : ''}
//       placeholder="Search Grade/Marks"
//       type="text" 
//       onChange={event => onChange(event.target.value)}
//       />
//     ),
//     },
//     {
//       Header: "Assessment",
//       accessor: "feedback",
//       className: "center",
//       Filter: ({filter, onChange}) => (
//         <TextField 
//         inputProps={{
//         autoComplete: 'off'
//         }}         
//         id="document-type"   
//         value={filter ? filter.value : ''}
//         placeholder="Search Grade/Marks"
//         type="text" 
//         onChange={event => onChange(event.target.value)}
//         />
//       ),
//       Cell: row => (
//         // <div>No <span style={{marginLeft:'10px'}}> <Tooltip
//         <div> <span style={{marginLeft:'10px'}}> <Tooltip
//         id="tooltip-top"
//         title="Assess"
//         placement="top"
//         >
//         <Button style={{padding:0}}
//                           simple
//                           onClick={()=>{this.getMappdedDataWithId(row.original.id);this.setState({editAssessmentPanel:true,viewAssignmentBlock:false,studentname:row.original.studentname,id:row.original.id,id_assignment:row.original.id_assignment,id_section:row.original.id_section,lgrade:row.original.grade, lfeedback: row.original.feedback});}}
//                           color="success"
//                           className="edit"
//                         >
//                          <Edit />
//                         </Button>
//         </Tooltip></span></div>
//       )
//       }
// ]}
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
    Header: "Student Name",
    accessor: "studentname",
    className: "center",
    Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Student Name"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
    )
    },
  {
  Header: "Submitted?",
  accessor: "submitted",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Status"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
  
  {
  Header: "Attachment",
  accessor: "attachment",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Attachment"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
  {
    Header: "Feedback",
    accessor: "feedback",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Feedback"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },
    {
      Header: "Grade/Marks",
      accessor: "grade",
      className: "center",
      Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Grade/Marks"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
      },
      {
        Header: "Assessment",
        accessor: "feedback",
        className: "center",
        Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Grade/Marks"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
        ),
        Cell: row => (
          <div> <span style={{marginLeft:'10px'}}> <Tooltip
          id="tooltip-top"
          title="Assess"
          placement="top"
          >
          <Button style={{padding:0}}
                            simple
                            onClick={()=>{this.getMappdedDataWithId(row.original.id);this.setState({editAssessmentPanel:true,viewAssignmentBlock:false,studentname:row.original.studentname,id:row.original.id,id_assignment:row.original.id_assignment,id_section:row.original.id_section,lgrade:row.original.grade, lfeedback: row.original.feedback});}}
                            color="secondary"
                            className="edit"
                          >
                           <Edit />
                          </Button>
          </Tooltip></span></div>
        )
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
      <Button   variant="outlined" color="secondary" href={Config.url+"Projects/excelProjectAssess?id_section="+this.state.id_section_assess+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id="+this.state.id_assess}>
        Export
        </Button>
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={3}></Grid>            
        </Grid>

</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.editAssessmentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({editAssessmentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({editAssessmentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
 Edit  Assessment
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<h4>{this.state.studentname}'s submission as below</h4>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Description: </strong> {this.state.projectsMappedData.title}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> {this.state.projectsMappedData.path}
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<FormControl fullWidth>
<TextField 
                inputProps={{
                 autoComplete: 'off'
                 }}  
                 value={this.state.lfeedback}      
               id="document-type"   
               label="Feedback on this particular project/Seminar goes here!" 
               type="search" 
               multiple
               rows={4}
               onChange={(event) => this.setState({lfeedback: event.target.value})}
               variant="outlined" />
                  </FormControl>
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{this.state.projectsMappedData.type== 'Marks System'?
                <>
                 <Grid container>
                  <Grid item xs={12} sm={10} md={4} style={{marginTop:'auto'}}>
                  <strong>Marks Obtained: </strong> 
                  </Grid>
                  <Grid item xs={12} sm={10} md={4} className="marksGradeGrid">
                  <TextField 
                inputProps={{
                 autoComplete: 'off'
                 }}     
                 value={this.state.lmarks}  
               id="document-type"   
               label="Enter Marks" 
               type="search" 
               onChange={(event) => this.setState({lmarks: event.target.value})}
               variant="outlined" />
                  </Grid>                  
                </Grid>
                </>: 
                <Grid container>
                  <Grid item xs={12} sm={10} md={4} style={{margin:'auto 0'}}>
                  <strong>Grade Obtained: </strong> 
                  </Grid>
                  {console.log("grade total"+JSON.stringify(this.state.projectsMappedData))}
                  {console.log("grade"+JSON.stringify(this.state.projectsMappedData.grademarks))}
                  
                  {/* {this.state.gradeData.map((gradedetail,key) =>  */}
                  {this.state.projectsMappedData.grademarks!=null && this.state.projectsMappedData.grademarks!='' &&
                    // this.state.projectsMappedData.grademarks.map((gradedetail,key)=>
                    // Object.entries(this.state.projectsMappedData.grademarks).map(([k, element])=>
                    // console.log('in data'+element)
                    // )
                    JSON.parse(this.state.projectsMappedData.grademarks).map((letter) => {
                      console.log('foreach'+letter)
                  })
                 
                  }
                  {this.state.projectsMappedData.grademarks!=null && this.state.projectsMappedData.grademarks!='' &&
                  // console.log('inside'+(this.state.projectsMappedData.grademarks))
                  JSON.parse(this.state.projectsMappedData.grademarks).map((gradedetail,key) => 
                  <Grid item style={{textAlign:'center'}}>
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.lgrade == gradedetail}
                          onChange={(e) => this.handleChangeEnabledGrade(gradedetail)}
                          // value={this.state.grade}
                          value={this.state.lgrade}
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label={gradedetail}
                     // label= {console.log({gradedetail})}
                    />
                
                  </Grid>
                          
                          )
                          }
                 
                </Grid>
              }
</Grid>
</Grid>
</Card>
<Grid container>
            <Grid item xs={12} sm={10} md={12} className="text-right">
            {AuthHelper('Project/Seminar','can_create') &&
                <Button className="successBtnOutline" variant="outlined" onClick={()=>{this.insertProjectFeedback(this.state.projectsMappedData.id);this.setState({viewAssignmentBlock:false})}}>Submit</Button>
            }
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


export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);