import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,FormLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import DialogActions from '@material-ui/core/DialogActions';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
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
      actionType:AuthHelper('Events','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      selectedStandards:[],
      subjects:[],
      markSubmitted:'',
      lfeedback:'',
      filterReadReceipients:[],
      dairiesData:[],
      dairiesDataIdData:[],
      dairiesDataMapData:[],
      dairiesIdData:[],
      readdairiesMapData:[],
      unreaddairiesMapData:[],
      dairiesMapData:[],
      dairiesNotesData:[],
      noteholders : [{name:''}],
      readCount:0,
      unReadCount:0,
      allCount:0,
      SelectedSectionsIds:[],
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
      complete:'',
      gradeData:[],
      dailydairy_description: EditorState.createEmpty(),
      Edescription:EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      assignmentsData:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      imagePreviewUrlStudent:defaultImage,
      student_standards:'',
      errorMessageArray:[],
      forms : {
        "Assignment":{
          fields:[
            {
                "name":"SelectedSectionsIds",
                "title":"Add Recipients",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            // {
            //     "name":"lsubject",
            //     "title":"Subject",
            //     "isMandatory":true,
            //     "minLength":5,
            //     "maxLength":56,
            //     "validation":"(a-zA-Z)+"
            // },
            {
                "name":"lname",
                "title":"Title",
                "isMandatory":true,
                "minLength":5,
                "maxLength":56,
                "validation":"(a-zA-Z)+"
            },
            // {
            //     "name":"lchapter",
            //     "title":"Chapter Title",
            //     "isMandatory":true,
            //     "minLength":5,
            //     "maxLength":56,
            //     "validation":"(a-zA-Z)+"
            // },
            // {
            //     "name":"lsubmission",
            //     "title":"Submission Type",
            //     "isMandatory":true,
            //     "minLength":5,
            //     "maxLength":56,
            //     "validation":"(a-zA-Z)+"
            // },
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
  
  handleComplete = (value) =>{
    this.setState({ complete: value });
  }
  handleSmsAlert = (value) =>{
    this.setState({ smsAlert: value });
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
           style: { textTransform: 'capitalize' }
          //  pattern: "[a-z]"
          }}
          required
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
      new Service().apiCall('Dailydairy/deleteStudent',postData).then(response => {
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
    handleClickStudent = () => {
      fileInput.current.click();
    };
    handleRemoveStudent = () => {
      this.setState({
        imagePreviewUrlStudent: defaultImage, selectedFile:null
      });
      fileInput.current.value = null;
    };

    handleDairy = e => {
      e.preventDefault();
      const lUserData = this.props.data;
      if(this.validateForm('Assignment') == true){
      let data = new FormData();
      let formData = new FormData();
      formData.append('id_board',this.state.selectedBoard);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      formData.append('id_section',this.state.SelectedSectionsIds?this.state.SelectedSectionsIds:this.state.selectedStandardId);
      formData.append('id_staff_dept',this.state.SelectedDepartmentIds?this.state.SelectedDepartmentIds:'');
      formData.append('start_date',this.state.startdate?moment(this.state.startdate).format("YYYY-MM-DD"):'');
      formData.append('end_date',this.state.enddate?moment(this.state.enddate).format("YYYY-MM-DD"):'');
      formData.append('name',this.state.lname);
      formData.append('details',this.state.dailydairy_description.getCurrentContent().getPlainText());
      formData.append('mark_completed',this.state.markCompleted);
      formData.append('read_receipt',this.state.readReceipt);
      formData.append('sms_alert',this.state.smsAlert);
      formData.append('path',this.state.selectedFile);
      formData.append('requestname',"insert_dailydairy");
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('id_user',this.props.data.UID);
      new Service().apiCall('Dailydairy/insertDairy', formData,
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
        <h4 className="font-weight-bold">Notes Inserted</h4>
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
    }else{
      return false;
    }
    }
    getDairyMappedData(id_section,id) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_section:id_section,
        id:id
      };
      console.log("postdata"+ JSON.stringify(postData));

      new Service().apiCall('Dailydairy/getStudentDairyMap',postData).then(response => {
        console.log(response.data);
        if (response.status==200 && response.data!='') {
          var lDairies = [];
          var lReadDairies = [];
          var lUnReadDairies = [];
          response.data.forEach(element => {
                    var lDairy = {};
                    var lReadDairy = {};
                    var lUnReadDairy = {};
                    lDairy.id                  = element.id;
                    lDairy.view_count          = element.view_count;
                    lDairy.studentname         = element.studentname;
                    lDairy.email               = element.email;
                    lDairy.contact             = element.contact;
                    lDairy.roll_no             = element.roll_no;
                    lDairy.id_user             = element.id_user;
                    lDairy.id_section          = element.id_section;
                    lDairy.feedback          = element.feedback;
                    lDairy.submitted         = element.submitted;
                    lDairies.push(lDairy);
                    if(element.view_count==1){
                      lReadDairy.id = element.id;
                      lReadDairy.studentname         = element.studentname;
                      lReadDairy.view_count         = element.view_count;
                      lReadDairy.contact             = element.contact;
                      lReadDairies.push(lReadDairy);
                    }
                    if(element.view_count==0){
                      lUnReadDairy.id = element.id;
                      lUnReadDairy.studentname         = element.studentname;
                      lUnReadDairy.view_count         = element.view_count;
                      lUnReadDairy.contact             = element.contact;
                      lUnReadDairies.push(lUnReadDairy);
                    }
                });
                this.setState({ filterReadReceipients:lDairies,receipientSuggestions:lDairies,dairiesMapData:lDairies,readdairiesMapData:lReadDairies,unreaddairiesMapData:lUnReadDairies,readCount:lReadDairies.length,unReadCount:lUnReadDairies.length,allCount:lDairies.length});
          
        }else{
          this.setState({ dairiesMapData: [] });
        }
      }).catch(error => {
        alert(error);
  
      });
  
    }
    updateDailydiary = () => {
 
      const lUserData = this.props.data;
      let data = new FormData();
      let formData = new FormData();
      formData.append('id_board',this.state.selectedBoard);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('id',this.state.DairyId);
      formData.append('path',this.state.selectedFile);

      formData.append('details',this.state.Edescription.getCurrentContent().getPlainText());
      formData.append('name',this.state.ETitle);
      formData.append('start_date',moment(this.state.Estartdate).format("YYYY-MM-DD"));
      formData.append('end_date',moment(this.state.Eenddate).format("YYYY-MM-DD"));
     
      formData.append('id_user',this.props.data.UID); 
      formData.append('created_by',lUserData.UID);
      // console.log(...formData)
      new Service().apiCall('Dailydairy/updateDairy', formData,
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
            <h4 className="font-weight-bold">Daily diary Updated!</h4>
            </div>
            </Dialog>
            ),
            });
          setTimeout(() => {
            // window.location.reload()
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
    insertDairyFeedback(id){
      const lUserData = this.props.data;
      let data = new FormData();
      const postData = {
        id:id,
        feedback:this.state.lfeedback,
        // grade:this.state.lgrade?this.state.lgrade:this.state.assignmentsIdData.grademarks,
        // marks:this.state.lmarks,
        created_by: lUserData.UID, 
        complete:this.state.complete,
        requestname: "insert_feedback",
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID
      };
      new Service().apiCall('Dailydairy/insertFeedback', postData,
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
          <h4 className="font-weight-bold"> Feedback Inserted</h4>
        </div>
      </Dialog>
              ),
            });
          setTimeout(() => {
           window.location.reload()
          }, 2000)
         
        } else {
          
        //  this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
        // console.log(error)
      //  this.raiseLoginSignupErrorAlert("signup");
  
      });
    }
    getDairyIdData(id_section,id) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        usertype:this.props.data.usertype,
        id_section:id_section,
        id:id
      };
      // console.log("postdata"+JSON.stringify(postData));
      new Service().apiCall('Dailydairy/getDataWithId',postData).then(response => {
        if (response.status==200 && response.data!='') {
          // console.log(response.data);
          this.getNoteData(id);
          this.setState({ dairiesIdData:response.data});
          this.setState({ ETitle:response.data.name,Estartdate:response.data.start_date,Eenddate:response.data.end_date,imagePreviewUrlStudent:Config.path+'writable/uploads/dailydairy/'+response.data.path,Edescription:EditorState.createWithContent(ContentState.createFromText(response.data.details)),
          student_standards:response.data.id_section});
        }
      }).catch(error => {
        alert(error);
  
      });
  
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
    getMappdedDataWithId(id) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        usertype:this.props.data.usertype,
       // id_section:id_section,
        id:id
      };
      new Service().apiCall('Dailydairy/getMappedDataWithId',postData).then(response => {
        if (response.status==200 && response.data!='') {
          // console.log(response.data);
          this.getNoteData(id);
          this.setState({ dairiesDataMapData:response.data,complete:response.data.submitted});
          // console.log('comp'+response.data.submitted)
        }
      }).catch(error => {
        alert(error);
  
      });
  
    }
    getNoteData(id){
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_dailydairy:id
      };
      new Service().apiCall('Dailydairy/getNoteData',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ dairiesNotesData:response.data});
        }
      }).catch(error => {
        alert(error);
  
      });
    }
    onEditorStateUpdate = Edescription => {
    
      this.setState({Edescription})
    // console.log({Edescription});
    };

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
        // console.log(data);
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
      // id_section:this.props.data.usertype == "student"?this.props.data.standard:id,
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
      // console.log(error);
    });
  } 

  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,allStudents:false,searchStudent:false,activeSuggestion:0,filteredSuggestions:[],selectedStudentId:'',customAssignInput:"",customAssignStudents:[] });
    // this.getStudentDetails(id,this.state.selectedBoard,this.state.selectedAcademicYear);
    this.getDairyData(id);
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
      // active={false}
      // active={this.state.searchStudent ? true : false}
      active={this.state.searchStudent && this.state.allStudents ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  getDairyData(id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      usertype:this.props.data.usertype,
      id_user: this.props.data.UID,
      id_section:this.props.data.usertype == "student"?this.props.data.standard:id_section, 
      id_board:this.state.selectedBoard
    };
    new Service().apiCall('Dailydairy/getData',postData).then(response => {
      // console.log(response);
      if (response.status==200) {
        var lDairies = [];
        if(response.data){
          response.data.forEach(element => {
            var lDairy = {};
            lDairy.id                  = element.id;
            lDairy.title               = element.title;
            lDairy.standrad            = element.standrad;
            lDairy.start_date          = element.start_date;
            lDairy.end_date            = element.end_date;
            lDairy.details             = element.details;
            lDairy.path                = element.path;
            lDairy.feedback                = element.feedback;
            lDairy.submitted                = element.submitted;
            lDairy.student_id                = element.student_id;
            lDairy.id_standard                = element.id_standard;

            

            lDairies.push(lDairy);
        });
             this.setState({ dairiesData:lDairies});
        }else{
          alert("no data found");
        }
      }else{
        this.setState({ dairiesData:[]});
      }
    }).catch(error => {
      alert(error);

    });

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
handleDeactiveCompleted = (id,status) => {
  let switchStatus = "";
  
      switchStatus = "Status Updated";
  
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    id: id,
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID,
  };
  new Service().apiCall('Dailydairy/completedStatus',postData).then(response => {
    if (response.status==200 && response.data!='') {
      this.getDairyData();
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
      //  window.location.reload()
      this.setState({
        basicNotify:false
      })

      }, 2000) 
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  //  if(error.response.data){
   this.setState({
    basicNotify: (
      <Dialog open={true}>
<div className="text-center p-5">
<h4 className="font-weight-bold">{error.response.data}</h4>
</div>
</Dialog>
    ),
  });

  setTimeout(() => {
  //  window.location.reload()
  this.setState({
    basicNotify:false
  })

  }, 2000) 
// }
  });

}

  componentDidMount() {
   this.getStandardSectionDetails();
   this.getSubjectDetails();
   this.getDairyData();
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
            <Grid container className="sliderDiv">
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/dailydiary")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              {/* Add/View Notes */}
              {this.props.data.usertype == "student"? "View Notes": (this.state.actionType == "view" || this.state.actionType == "assessment"  ?"View Notes":"Add/View Notes")}
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Daily Diary/Note to Parents','can_create') && 
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
                  Marks Completion
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
     <Grid container spacing={2} className="sliderDiv">
      <Grid item xs={12} md={4} lg={1}>
         
        </Grid>
        
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={4} >
        <Grid item xs={12} md={8} lg={8}>
        <form
         onSubmit={this.handleDairy.bind(this)}
         autoComplete="off">
        <Card className="card-box  mb-4 ">
        
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Notes
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container spacing={2}>

          <Grid item xs={12} md={12} lg={8} className="customDiv">
            <OutlinedDiv label="Add Recipients">
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
            label={this.state.selectedStandards.length > 0?"Add more recipients":"Add recipients"}
            className="m-1"
            />
            </li>
            </Paper>
            </OutlinedDiv>
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
          <Grid container spacing={2}>
      
      <Grid item xs={12} md={12} lg={12} className="pickerGrid">
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
      <Grid item xs={12} md={12} lg={12} className="pickerGrid">
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
            label="End date"
            inputProps={{ readOnly: true }}
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
          </Grid>
        </Grid>
   

        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
            {this.renderTextInput("lname","Title")}
        </Grid>
        </Grid>  
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.dailydairy_description}
          placeholder="Enter notes to parents"
          required
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
            Whether task needs to be marked as completed?
                  </FormLabel></Grid>
             <Grid xs={12} sm={6} md={2}  className="text-center">
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.markCompleted === "1"}
                          onChange={() => this.handleMarkCompleted("1")}
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
                          checked={this.state.markCompleted === "0"}
                          onChange={() => this.handleMarkCompleted("0")}
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
        <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   type="submit" variant="outlined" className="successBtnOutline" 
        // onClick={()=>this.handleDairy()}
        >
        Submit
        </Button>
        </Grid>
        </Grid>
        </CardActions>

        </Card>
        </form>
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
        <Grid container spacing={4} justify={this.props.data.usertype!= "student" ? "none" : "center"} className="sliderDiv">
          {this.props.data.usertype!= "student" && 
        <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allStudents ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);this.setState({searchStudent:false,allStudents:true,selectedStandardId:''});this.getDairyData()}}>
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
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Daily Dairy/Note to Parents
                </h4>
              </div>
        </div>
        {this.props.data.usertype != "student" ?
        (
        <ReactTable
    data={this.state.dairiesData.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          standrad: original.standrad,
          id_section: original.id_section,
          id_standard:original.id_standard,
          title:original.title,
          end_date:original.end_date
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
  accessor: "id_section",
  className: "center",
  sortable: false,
    filterable: false,
  // Filter: ({filter, onChange}) => (
  //   <TextField 
  //   inputProps={{
  //   autoComplete: 'off'
  //   }}         
  //   id="document-type"   
  //   // value={filter ? filter.value : ''}
  //   // placeholder="Search Assessed"
  //   type="text" 
  //   onChange={event => onChange(event.target.value)}
  //   />
  // ),
  Cell: row => (
    <div>  <span style={{marginLeft:'10px'}}> 
    <Tooltip
    id="tooltip-top"
    title={this.state.actionType=="view"? "View" : "Assess"}
    placement="top"
    >
                      <Button style={{padding:0}}
                      simple
                      onClick={()=> {
                        this.state.actionType=="assessment" && this.getDairyMappedData(row.original.id_standard,row.original.id);
                        this.state.actionType=="view"? this.getDairyIdData(row.original.id_section,row.original.id) : this.getDairyIdData(row.original.id_section,row.original.id);this.setState({ viewAssignmentPanel: this.state.actionType=="view"? true : false,  assessmentPanel:this.state.actionType=="assessment" ? true:false,DairyId:row.original.id,id_section_assess:row.original.id_section})}}
                      color="secondary"
                      className="edit"
                    >
                    {this.state.actionType=="view"? <ViewIcon /> : <Edit  />}
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
  data={this.state.dairiesData.map((original,key) => {
      return ({
        slno: key+1,
        id:original.id,
        standrad: original.standrad,
        id_section: original.id_section,
        title:original.title,
        end_date:original.end_date,
        feedback:original.feedback,
        submitted:(
          // we've added some custom button actions
          <div className="grouplist-actions">
            { /* use this button to add a like kind of action */ }
      
                      
                      {/* use this button to remove the data row */}
                      <Tooltip
              id="tooltip-top"
              title={original.submitted == 1 ? "Completed":"Not Completed"}
              placement="top"
           
            >
                 <FormControlLabel
                            control={
                              <Switch
                                checked={original.submitted == 1 ? true:false}
                                onChange={() => this.handleDeactiveCompleted(original.student_id, original.submitted)}
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
  )
  },
  {
    Header: "Completed?",
    accessor: "submitted",
    className: "center",
    sortable: false,
    filterable: false
    // Filter: ({filter, onChange}) => (
    // <TextField 
    // inputProps={{
    // autoComplete: 'off'
    // }}         
    // id="document-type"   
    // // value={filter ? filter.value : ''}
    // // placeholder="Search Completed"
    // type="text" 
    // onChange={event => onChange(event.target.value)}
    // />
    // )
    },
{
Header: "Assessed",
accessor: "sent_date",
className: "center",
sortable: false,
filterable: false,
// Filter: ({filter, onChange}) => (
//   <TextField 
//   inputProps={{
//   autoComplete: 'off'
//   }}         
//   id="document-type"   
//   // value={filter ? filter.value : ''}
//   // placeholder="Search Assessed"
//   type="text" 
//   onChange={event => onChange(event.target.value)}
//   />
// ),
Cell: row => (
  <div>  <span style={{marginLeft:'10px'}}> 
  <Tooltip
  id="tooltip-top"
  title={this.state.actionType=="view"? "View" : "Assess"}
  placement="top"
  >
                    <Button style={{padding:0}}
                    simple
                    onClick={()=> {
                      this.state.actionType=="assessment" && this.getDairyMappedData(row.original.id_section,row.original.id);
                      this.state.actionType=="view"? this.getDairyIdData(row.original.id_section,row.original.id) : this.getDairyIdData(row.original.id_section,row.original.id);this.setState({ viewAssignmentPanel: this.state.actionType=="view"? true : false,  assessmentPanel:this.state.actionType=="assessment" ? true:false,DairyId:row.original.id,id_section_assess:row.original.id_section})}}
                    color="secondary"
                    className="edit"
                  >
                  {this.state.actionType=="view"? <ViewIcon /> : <Edit  />}
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
)
}

<CardActions stats style={{marginTop:0}}>
{AuthHelper('Daily Diary/Note to Parents','can_export') &&
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"Dailydairy/excelDairy?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
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
  View Daily Dairy
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={10} md={4}>
    {/* <strong>Start Date:</strong> {this.state.dairiesIdData.start_date} */}
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
{/* <strong>End Date:</strong> {this.state.dairiesIdData.end_date} */}
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
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Title: </strong> {this.state.dairiesIdData.name} */}
{this.state.ETitle != '' && this.state.ETitle!=undefined &&
this.renderTextInputEdit("ETitle","Title")
 }
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Description: </strong> {this.state.dairiesIdData.details} */}
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
{/* <strong>Attachments: </strong> {this.state.dairiesIdData.path} */}
<Grid container spacing={2} justify="center">
<Grid item xs={12} sm={12} md={8} lg={8}>
<strong>Attachments: </strong> 
<a target="_blank" href={Config.path+'writable/uploads/dailydairy/'+this.state.dairiesIdData.path}>{this.state.dairiesIdData.path}</a>

{/* <div className="font-weight-400 text-center font-size-lg">Upload Attachment</div> */}
        <Divider className="my-2" />
        <FormControl fullWidth height={100}>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChangeStudent} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrlStudent} alt={this.state.imagePreviewUrlStudent} />
                 </div>
               <div>
               {this.props.data.usertype != "student"? 
               this.state.selectedFile === null ? 
               (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 {"Select file"}
                 </Button>
                 )
                  : 
                  (
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
           
              {/* <CardActions>
<Grid container spacing={4}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" color="secondary" onClick={()=>this.setState({standardPanel:false}),this.updateDailydiary}>
  Submit
</Button>
</Grid>
</Grid>
</CardActions> */}


</Grid>
</Grid>
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
{/* <strong>Assigned to: </strong> {this.state.assignmentsIdData.standardname+this.state.assignmentsIdData.sectionname} */}

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
{AuthHelper('Daily Diary/Note to Parents','can_create') &&
<CardActions stats style={{marginTop:0}}>
<Grid container spacing={2}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" className="successBtnOutline" onClick={()=>this.updateDailydiary(this.state.dairiesIdData.id,this.state.dairiesIdData.path)}>
Submit
</Button>
</Grid>
</Grid>
</CardActions>
}
</Card>

{/* <Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Note to: </strong> {this.state.standard}
</Grid>
</Grid>
</Card> */}

{/* <Card className="card-box  mb-4 p-3">
{this.state.dairiesNotesData.map((element, idx) => (
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
   Mark Completion
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
                  Mark Completion
                </h4>
              </div>
        </div>
        <ReactTable
    // data={this.state.dairiesDataMapData.map((original,key) => {
      data={this.state.dairiesMapData.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          studentname: original.studentname,
          feedback:original.feedback,
          submitted:(original.submitted==1?"YES":"No")
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
      Header: "Completed?",
      accessor: "submitted",
      className: "center",
      sortable: false,
      filterable: false,
      // Filter: ({filter, onChange}) => (
      //   <TextField 
      //   inputProps={{
      //   autoComplete: 'off'
      //   }}         
      //   id="document-type"   
      //   // value={filter ? filter.value : ''}
      //   // placeholder="Search Grade/Marks"
      //   type="text" 
      //   onChange={event => onChange(event.target.value)}
      //   />
      // ),
      Cell: row => (
        <div>{row.original.submitted} <span style={{marginLeft:'10px'}}> <Tooltip
        id="tooltip-top"
        title="Assess"
        placement="top"
        >
        <Button style={{padding:0}}
                          simple
                          onClick={()=>{this.getMappdedDataWithId(row.original.id);this.setState({editAssessmentPanel:true,viewAssignmentBlock:false,studentname:row.original.studentname,id:row.original.id,id_assignment:row.original.id_assignment,id_section:row.original.id_section,lgrade:row.original.grade, lfeedback: row.original.feedback});}}
                          color="success"
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
{AuthHelper('Daily Diary/Note to Parents','can_export') &&
<CardActions stats style={{marginTop:0}}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"Dailydairy/excelStudentDairy?id_section="+this.state.id_section_assess+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id="+this.state.DairyId}>
        Export
        </Button>
        </Grid>
        </Grid>
  </CardActions>
}
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
 Edit  Mark Completion
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<h4>{this.state.studentname}'s submission as below</h4>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Description: </strong> {this.state.dairiesDataMapData.title}
</Grid>
</Grid>
</Card>
{/* <Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> {this.state.dairiesDataMapData.path}
</Grid>
</Grid>
</Card> */}

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
               label="Feedback on this particular Daiydiary/Notes goes here!" 
               type="search" 
               multiple
               rows={4}
               onChange={(event) => this.setState({lfeedback: event.target.value})}
               variant="outlined" />
                  </FormControl>
</Grid>
</Grid>
</Card>

{/* <Grid xs={12} sm={6} md={6} className="text-center"> */}
{/* {console.log(this.state.complete)} */}
{/* {this.state.complete != ''  && */}
<Card className="card-box  mb-4 p-3">
                    <Grid container>
                    <Grid xs={12} sm={6} md={12} className="text-center">  
                    
            <FormLabel>
                    Completed?
                  </FormLabel></Grid>
              
             <Grid xs={12} sm={6} md={12} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.complete== 1}
                          onChange={() => this.handleComplete(1)}
                          value="Online"
                          id = "readreceipt"
                          // inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                      label="Yes"
                    />
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.complete == 0}
                          onChange={() => this.handleComplete(0)}
                          value="No"
                          id = "readreceipt"
                          // inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="No"
                    />
                  </Grid>
                    </Grid>
                </Card>
{/* } */}
                  {/* </Grid> */}

<Grid container>
            <Grid item xs={12} sm={10} md={12} className="text-right">
                <Button className="successBtnOutline" variant="outlined" onClick={()=>{this.insertDairyFeedback(this.state.dairiesDataMapData.id);this.setState({viewAssignmentBlock:false})}}>Submit</Button>
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
