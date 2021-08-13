import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Chip,Typography,AppBar,Divider,Card,CardContent,Box,TextField,Button,Avatar,Toolbar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem} from '@material-ui/core';
import {Animated} from "react-animated-css";
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Stepper from '@material-ui/core/Stepper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddCircleTwoToneIcon from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import Step from '@material-ui/core/Step';
import CloseIcon from '@material-ui/icons/Close';
import StepButton from '@material-ui/core/StepButton';
import NavigateNext from "@material-ui/icons/NavigateNext";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { ExampleWrapperSimple } from '../../../../layout-components';
import { AuthHelper } from '@utils/AuthHelper.js';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/placeholder.jpg";
import 'date-fns';
import  { Redirect } from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import moment from "moment";

const fileInput = React.createRef();
const fileMotherInput = React.createRef();
const fileFatherInput = React.createRef();
const fileGuardInput = React.createRef();
const fileBirthInput = React.createRef();
const fileAadhaarInput = React.createRef();
const fileTransferInput = React.createRef();
const fileMarksInput = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});


class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      errorMessageArray:[],
      loading:false,
      firstname:"",
      middlename:"",
      lastname:"",
      gender:"",
      bloodgroup:"",
      mothertongue:"",
      nationality:"",
      religion:"",
      caste:"",
      castecategory:"",
      phone_no:"",
      email:"",
      linkedin_id:"",
      facebook_id:"",
      address_line1:"",
      address_line2:"",
      pincode:"",
      taluk:"",
      post_office:"",
      city:"",
      district:"",
      state:"",
      permanent_address1:"",
      permanent_address2:"",
      permanent_pincode:"",
      permanent_city:"",
      permanent_district:"",
      permanent_state:"",
      permanent_post_office:"",
      birth_certificate_no:"",
      aadhaar_no:"",
      passport_no:"",
      driving_license_no:"",
      selectedOptionalSubject:'',
      selectedOptionalSubjectIds:'',
      standardSubjects:[],
      subjects:[],
      GenderMaster:["Male","Female","Other"],
      BloodGroupMaster:["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      NationalityMaster:["Indian"],
      ReligionMaster:["Hindus","Muslims","Christians","Sikhs","Buddhists","Jains","Others"],
      StateMaster:["Karnataka","Kerala","Maharashtra","Tamil Nadu","Telangana","Puducherry"],
      individualAttachments:[{student_photo:"",father_photo:"",mother_photo:"",guardian_photo:"",birth_certificate:"",aadhaar_card:"",latest_marks_card:"",transfer_certificate:""}],
      individualAllData:[],
      pincodesArr:[],
      individualPrevious:[],
      individualFees:[],
      phone1Checked:false,
      phone2Checked:false,
      bothChecked:false,
      studentData:[],
      individualData:[],
      individualSiblings:[],
      message_sent_to:'',
      messageCheck:false,
      formChanged:false,
      showTextSuggestions:false,
      textSuggestions:[],
      feeCategoryChecked:false,
      selectedFeeSection:false,
      selectedFeeSectionId:'',
      boardChecked:false,
      selectedFeeBoard:'',
      same_address:false,
      father_name:"",
      joining_year:'',
      roll_number:'',
      father_middle_name:"",
      father_last_name:"",
      father_phone_no:"",
      father_email_id:"",
      father_education:'',
      father_occupation:'',
      father_linkedin_id:"",
      father_facebook_id:"",
      mother_name:"",
      mother_middle_name:"",
      mother_last_name:"",
      mother_phone_no:"",
      mother_email_id:"",
      mother_education:'',
      mother_occupation:'',
      mother_linkedin_id:"",
      mother_facebook_id:"",
      passed_academic_year:'',
      guard_name:"",
      guard_middle_name:"",
      guard_last_name:"",
      guard_phone_no:"",
      guard_email_id:"",
      guard_linkedin_id:"",
      guard_facebook_id:"",
      guard_address_line1:"",
      guard_address_line2:"",
      guard_post_office:"",
      guard_pincode:"",
      guard_city:"",
      guard_district:"",
      guard_state:"",
      primary_contact:"",
      primary_contact1:"",
      message_sent_to:"",
      activeAccordion:'',
      categoryName:'',
      lfeecategory:'',
      categoryData:[],
      classwiseSectionsDashboard:[],
      boardDetails:[],
      academicDetails:[],
      dashboardDetails:[],
      TotalStudentCount:0,
      studentname: '',
      siblingHolders:[],
      awardHolders:[{award_academic_year:'',area_of_achievement:'',award_remarks:''}],
      siblingCount:'',
      awardCount:'',
      previouslyStudied:'',
      gender:'',
      dateOfBirth: new Date(),
      imagePreviewUrl:defaultImage,
      imageFatherPreviewUrl:defaultImage,
      imageMotherPreviewUrl:defaultImage,
      imageGuardPreviewUrl:defaultImage,
      imageBirthPreviewUrl:defaultImage,
      imageAadhaarPreviewUrl:defaultImage,
      imageMarksPreviewUrl:defaultImage,
      imageTransferPreviewUrl:defaultImage,
      defaultDisplayImage:defaultImage,
      error: '',
      genderArray:['Male','Female','Others'],
      selectedFile:null,
      selectedFatherFile:null,
      selectedMotherFile:null,
      selectedGuardFile:null,
      selectedBirthFile:null,
      selectedAadhaarFile:null,
      selectedMarksFile:null,
      selectedTransferFile:null,
      alert: null,
      currentForm:'student_details',
      sameInstitute:'',
      standardSections:[],
      sectionSuggestions:[],
      filterSections:[],
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '',
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
      userInput:"",
      userSiblingInput:"",
      studentSuggestions:[],
      activeSuggestion:0,
      filteredSuggestions:[],
      activeStep:0,
      joiningStandard:'',
      steps:['Student Profiling', 'Sibling Profiling', 'Parents Profiling', 'Academic Profiling', 'Fee Configuration', 'Attachments'],
      requiredState:"",
      admission_number:'',
      admission_date:new Date(),
      sts_number:'',
      forms : {
        "Profile":{
            fields:[
                {
                    "name":"firstname",
                    "title" : "First name",
                    "isMandatory":true,
                    "minLength":"2",
                    // "minLength":5,
                    // "maxLength":56,
                    "validation":""
                },
                {
                    "name":"lastname",
                    "title" : "Last name",
                    "isMandatory":true,
                    "minLength":"1",
                    // "minLength":5,
                    // "maxLength":56,
                    "validation":""
                },
                {
                  "name" : "gender",
                  "title" : "Gender",
                  "minLength":"",
                  "isMandatory":true,
                  "validation":""
                },
                {
                  "name" : "bloodgroup",
                  "title" : "Blood Group",
                  "minLength":"",
                  "isMandatory":true,
                  "validation":""
                },
                {
                  "name" : "nationality",
                  "title" : "Nationality",
                  "minLength":"",
                  "isMandatory":true,
                  "validation":""
                },
                {
                  "name" : "email",
                  "title" : "Email ID",
                  "minLength":"",
                  "isMandatory":true,
                  "validation" : '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/'
                }
              ] 
        }, 
        "Academic":{ 
            fields:[
              {
                "name":"previouslyStudied",
                "title" : "Previously Studied Class",
                "minLength":"",
                "isMandatory":true,
                // "minLength":5,
                // "maxLength":56,
                "validation":""
              }
                
            ]
        },
        "Family":{
          fields:[ 
            {
              "name" : "father_name",
              "title" : "Father First Name",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name" : "father_last_name",
              "title" : "Father Last Name",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"primary_contact",
              "title" : "Primary Contact",
              "minLength":10,
              "isMandatory":true,
              "validation":"" 
            },
            {
              "name":"primary_contact1",
              "title" : "Alternate Primary Contact",
              "minLength":10,
              "isMandatory":true,
              "validation":""
            }
          ]
        },
        "Configuration":{
          fields:[
            {
              "name" : "lfeecategory",
              "title" : "Fee Category",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"selectedFeeBoard",
              "title" : "Board",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"joiningStandard",
              "title" : "Joining Standard",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            }
          ]
        }
      }
    };
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
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
    // alert(errorMessage);
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
    
    // if(FieldValue.length > field.maxLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.maxLength;
    if(FieldValue === '' && field.isMandatory === true){
      errorString = errorString + field.title + " should not be empty";
    }else if(field.minLength !== ""){
      if(FieldValue.length < field.minLength){
        errorString = errorString + field.title + " minimum length should be " + field.minLength;
      }
    }else if(field.validation != ""){      
      let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
      // let regex = field.validation;
      // console.log(regex)
      if(!regex.test(FieldValue)){
        errorString = errorString + " Invalid " + field.title;
      }
    }

    return errorString;
  }
  
  handleClose =() =>{
    this.setState({basicNotify:false});
  }


  focusTextInput() {
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 
  selectJoiningStandard = (event,id) => {
    this.setState({joiningStandard:id, joiningStandardName:event.target.value});
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
  handleFatherImageChange = event => {
    this.setState({
      selectedFatherFile: event.target.files[0]
    })
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imageFatherPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleMotherImageChange = event => {
    this.setState({
      selectedMotherFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageMotherPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleGuardImageChange = event => {
    this.setState({
      selectedGuardFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageGuardPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleBirthImageChange = event => {
    this.setState({
      selectedBirthFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageBirthPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleStudentSearch = (val) => {
    this.setState({sibling_UID:val.UID,viewStudentPanel:true});
    this.getIndividualStudentDetails(val.UID);
    console.log('ind'+this.state.SiblingHolders);
  }

  getIndividualStudentDetails = (studentUID) => {
    
    const postData = {
      UID:studentUID,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    }
    new Service().apiCall('students/getIndividualStudentDetails',postData).then(response => {
      console.log(JSON.stringify(response));
      if (response.status==200 && response.data!='') {
        
        this.setState({SiblingHolders:response.data});
  
        }else{
          this.setState({ SiblingHolders:[] });
        }
      
    }).catch(error => {
      console.log(error.message);
  
    });
  }

  // handleIndividualSearch = (val) => {
  //   this.setState({'id_user':val.UID,viewStudentPanel:true});
  //   setTimeout(() => {
  //     this.getIndividualStudentDetails(val.UID);
  //   }, 1500);
  // }  
  handleAadhaarImageChange = event => {
    this.setState({
      selectedAadhaarFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageAadhaarPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleBoard= (type,name,status) => {
    if(type){  
      this.setState({boardChecked:true,selectedFeeBoard:type});	 
      }
      else{
      this.setState({ boardChecked:false,selectedFeeBoard:'' });
      } 
  }
  handleMarksImageChange = event => {
    this.setState({
      selectedMarksFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageMarksPreviewUrl: reader.result
      }); 
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleTransferImageChange = event => {
    this.setState({
      selectedTransferFile: event.target.files[0]
    })
    let reader = new FileReader();
     
    reader.onloadend = () => {
      this.setState({
        imageTransferPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };

  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          inputProps={{
          style: {textTransform: 'capitalize'},
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id="document-type"   
          value={this.state[name]}
          label={label} 
          type="search" 
          onChange={(event) => this.handleChangeState(name, event.target.value)}
          className="m-2"
          variant="outlined" 
       />
       </FormControl>
      )
  }

  renderEmailInput = (name,label) => {
    return (
      <FormControl fullWidth>
      <TextField 
        inputProps={{
         autoComplete: "off",
         pattern: "[a-z]"
        }}
        id="document-type"   
        value={this.state[name]}
        label={label} 
        type="search" 
        onChange={(event) => this.handleChangeState(name, event.target.value)}
        className="m-2"
        variant="outlined" 
     />
     </FormControl>
    )
}

  removeAwardHolder(i) {  
    const { awardHolders } = this.state;
    this.setState({
      awardHolders: awardHolders.filter((award, index) => index !== i),
    });
  }
  removeSiblingdHolder(i) {  
    const { siblingHolders } = this.state;
    this.setState({
      siblingHolders: siblingHolders.filter((award, index) => index !== i),siblingCount: this.state.siblingCount - 1
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

  verifyNumberLength = (value, length) => {
    
    var numberRex = new RegExp("^[0-9]+$");
    if(value){
      //console.log(value.length,length);  
    if (value.length < length && numberRex.test(value)){
       return true;
     }
     return false;
    }
    else{
     // console.log("error");
      return true;
    }
   };

  handleFeeCategory= (type,name,status) => {
    if(type){  
      this.setState({feeCategoryChecked:true,categoryName:name,lfeecategory:type});	 
      }
      else{
      this.setState({ feeCategoryChecked:false,categoryName:'',lfeecategory:'' });
      } 
  }

  handleChangeInstitute = (idx,value) => {
    let lsiblingata = this.state.siblingHolders;
    lsiblingata.map((siblings,id)=>{ 
      if(idx==id){
        siblings.checked=value;
      } 
    });
      this.setState({ siblingHolders: lsiblingata });   
  };

  rendersiblings = () =>{
    let siblingCount = this.state.siblingCount;
   
    //let lsiblingholders = this.state.siblingHolders;
    let newSiblingHolder = [];
    if(siblingCount > 0){
      for(let i = 0 ; i < siblingCount ; i++) {
        newSiblingHolder.push({sibling_firstname:'',sibling_middlename:'',sibling_lastname:'',sibling_gender:'',sibling_dob:moment(new Date()).format("YYYY-MM-DD"),sibling_standard:'',sibling_board:'',sibling_school:'',sibling_school_address:'',checked:""});
    }
    this.setState({siblingHolders:newSiblingHolder,siblingCount:siblingCount});
    }
  }

  handlePreviouStudied = (value) => {
    this.setState({ previouslyStudied: value });  
  }

  handleClick = (name) => {
    if(name=='student'){
    fileInput.current.click();
  }else if(name=='father'){
    fileFatherInput.current.click();
  }else if(name=='mother'){
    fileMotherInput.current.click();
  }else if(name=='guard'){
    fileGuardInput.current.click();
  }else if(name=='birth'){
    fileBirthInput.current.click();
  }else if(name=='aadhaar'){
    fileAadhaarInput.current.click();
  }else if(name=='marks'){
    fileMarksInput.current.click();
  }else if(name=='transfer'){
    fileTransferInput.current.click();
  }
  };

  handleRemove = (name) => {
    if(name=='student'){
      this.setState({
        imagePreviewUrl: defaultImage, selectedFile:null
      });
      fileInput.current.value = null;
    }else if(name=='father'){
      this.setState({
        imageFatherPreviewUrl: defaultImage, selectedFatherFile:null
      });
      fileFatherInput.current.value = null;
    }else if(name=='mother'){
      this.setState({
        imageMotherPreviewUrl: defaultImage, selectedMotherFile:null
      });
      fileMotherInput.current.value = null;
    }else if(name=='guard'){
      this.setState({
        imageGuardPreviewUrl: defaultImage, selectedGuardFile:null
      });
      fileGuardInput.current.value = null;
    }else if(name=='birth'){
      this.setState({
        imageBirthPreviewUrl: defaultImage, selectedBirthFile:null
      });
      fileBirthInput.current.value = null;
    }else if(name=='aadhaar'){
      this.setState({
        imageAadhaarPreviewUrl: defaultImage, selectedAadhaarFile:null
      });
      fileAadhaarInput.current.value = null;
    }else if(name=='marks'){
      this.setState({
        imageMarksPreviewUrl: defaultImage, selectedMarksFile:null
      });
      fileMarksInput.current.value = null;
    }else if(name=='transfer'){
      this.setState({
        imageTransferPreviewUrl: defaultImage, selectedTransferFile:null
      });
      fileTransferInput.current.value = null;
    }  
  };

  // start of submit form function
  handleStudent = () => {  
    const lUserData = this.props.data; 
    let inst =[];
    inst.push({id: this.state.selectedOrganizationId, 
      institutions : [{id: this.state.selectedOrganizationId}]
    });
    let formData = new FormData();
    formData.append('id_organization',this.state.selectedOrganizationId);
    formData.append('id_institute',this.state.selectedInstitutionId);
    formData.append('standard',this.state.joiningStandard);
    formData.append('id_board',this.state.selectedFeeBoard);
    formData.append('id_academicyear',this.state.selectedAcademicYear); 
    formData.append('fee_category',this.state.lfeecategory);
    formData.append('awardHolders',JSON.stringify(this.state.awardHolders));
    formData.append('siblingHolders',JSON.stringify(this.state.siblingHolders));
    formData.append('firstname',this.state.firstname);
    formData.append('middlename',this.state.middlename);
    formData.append('lastname',this.state.lastname); 
    formData.append('gender',this.state.gender);
    formData.append('bloodgroup',this.state.bloodgroup);
    formData.append('dateOfBirth',this.state.dateOfBirth?moment(this.state.dateOfBirth).format("YYYY-MM-DD"):'');
    formData.append('mothertongue',this.state.mothertongue);
    formData.append('nationality',this.state.nationality);
    formData.append('religion',this.state.religion);
    formData.append('caste',this.state.caste);
    formData.append('castecategory',this.state.castecategory);
    formData.append('phone_no',this.state.phone_no);
    formData.append('email',this.state.email);
    formData.append('linkedin_id',this.state.linkedin_id);
    formData.append('facebook_id',this.state.facebook_id);
    formData.append('address_line1',this.state.address_line1);
    formData.append('address_line2',this.state.address_line2);
    formData.append('post_office',this.state.post_office);
    formData.append('pincode',this.state.pincode);
    formData.append('city',this.state.city);
    formData.append('district',this.state.district);
    formData.append('state',this.state.state);
    formData.append('permanent_address1',this.state.permanent_address1);
    formData.append('permanent_address2',this.state.permanent_address2);
    formData.append('permanent_pincode',this.state.permanent_pincode);
    formData.append('permanent_city',this.state.permanent_city);
    formData.append('permanent_post_office',this.state.permanent_post_office);
    formData.append('permanent_district',this.state.permanent_district);
    formData.append('permanent_state',this.state.permanent_state);
    formData.append('birth_certificate_no',this.state.permanent_district);
    formData.append('aadhaar_no',this.state.aadhaar_no);
    formData.append('passport_no',this.state.passport_no);
    formData.append('driving_license_no',this.state.driving_license_no);
    formData.append('father_name',this.state.father_name);
    formData.append('father_middle_name',this.state.father_middle_name);
    formData.append('father_last_name',this.state.father_last_name);
    formData.append('father_phone_no',this.state.father_phone_no);
    formData.append('father_email_id',this.state.father_email_id);
    formData.append('father_education',this.state.father_education);
    formData.append('father_occupation',this.state.father_occupation);    
    formData.append('father_linkedin_id',this.state.father_linkedin_id);
    formData.append('father_facebook_id',this.state.father_facebook_id);
    formData.append('mother_name',this.state.mother_name);
    formData.append('mother_middle_name',this.state.mother_middle_name);
    formData.append('mother_last_name',this.state.mother_last_name);
    formData.append('mother_phone_no',this.state.mother_phone_no);
    formData.append('mother_email_id',this.state.mother_email_id);
    formData.append('mother_education',this.state.mother_education);
    formData.append('mother_occupation',this.state.mother_occupation);    
    formData.append('mother_linkedin_id',this.state.mother_linkedin_id);
    formData.append('mother_facebook_id',this.state.mother_facebook_id);
    formData.append('guard_name',this.state.guard_name);
    formData.append('guard_middle_name',this.state.guard_middle_name);
    formData.append('guard_last_name',this.state.guard_last_name);
    formData.append('guard_phone_no',this.state.guard_phone_no);
    formData.append('guard_email_id',this.state.guard_email_id);
    formData.append('guard_linkedin_id',this.state.guard_linkedin_id);
    formData.append('guard_facebook_id',this.state.guard_facebook_id);
    formData.append('guard_address_line1',this.state.guard_address_line1);
    formData.append('guard_address_line2',this.state.guard_address_line2);
    formData.append('guard_pincode',this.state.guard_pincode);
    formData.append('guard_city',this.state.guard_city);
    formData.append('guard_district',this.state.guard_district);
    formData.append('guard_state',this.state.guard_state);
    formData.append('primary_contact',this.state.primary_contact);
    formData.append('primary_contact1',this.state.primary_contact1);
    formData.append('previouslyStudied',this.state.previouslyStudied);
    formData.append('passed_name',this.state.passed_name);
    formData.append('passed_address',this.state.passed_address);
    formData.append('passed_academic_year',this.state.passed_academic_year);
    formData.append('passed_board',this.state.passed_board);
    formData.append('passed_standard',this.state.passed_standard);
    formData.append('passed_grade',this.state.passed_grade);
    formData.append('is_visible',false);
    formData.append('other_details','abcd'); 
    formData.append('type', 1);
    formData.append('message_sent_to',this.state.message_sent_to);
    formData.append('organizations',JSON.stringify(inst));
    formData.append('student_photo',this.state.selectedFile);
    formData.append('father_photo',this.state.selectedFatherFile);
    formData.append('mother_photo',this.state.selectedMotherFile);
    formData.append('guardian_photo',this.state.selectedGuardFile);
    formData.append('birth_certificate',this.state.selectedBirthFile);
    formData.append('aadhaar_card',this.state.selectedAadhaarFile);
    formData.append('latest_marks_card',this.state.selectedMarksFile);
    formData.append('transfer_certificate',this.state.selectedTransferFile);
    formData.append('optional1',this.state.selectedOptionalSubjectIds);
    formData.append('admission_date',moment(this.state.admission_date).format("YYYY-MM-DD"));
    formData.append('admission_number',this.state.admission_number);
    formData.append('sts_number',this.state.sts_number);
    formData.append('joining_year',this.state.joining_year);
    formData.append('roll_number',this.state.roll_number);
    formData.append('role_id', 2);
    //console.log(...formData);
    new Service().apiCall('StudentDetails/insertStudent', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      //console.log(response);
      if (response.status==200 && response.data!='') {
        if(response.data === "inserted"){
          this.setState({
            basicNotify: (
              <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold mt-4">Student Added Successfully!</h4>
              </div>
            </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify:false});
            this.props.history.push('/admin/view-student')
          }, 2000)

        }else if(response.data === "exists"){

          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold mt-4">This Student Data Already Exists With Us!</h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify:false});
            return false;
          }, 2000)
        }
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
    //  this.raiseLoginSignupErrorAlert("signup");
    });
  }

  onKeyUp = (event) => {
    console.log('key'+ event.target.value);
    // if (event.key === 13) {
      this.setState({ father_last_name: event.target.value });
    // }
  }

  // handleEmail = (event) => {
  //   if (this.verifyEmail(event.target.value)){
  //     this.setState({ email: event.target.value });
  //   } 
  // }

  replaceText = (str) => {
    let string = str.replace(" B.O","");
    string = string.replace(" S.O","");
    return string;
    }

  handleSiblingData = (pIndex,inputName,pValue) => {
    let lSiblingHolders = this.state.siblingHolders;
    lSiblingHolders[pIndex][inputName] = pValue;
    this.setState({siblingHolders:lSiblingHolders});
  }

  verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false; 
  };

  handleChangeState = (name,value) => {
    let allowOnlyText = ["firstname", "middlename", "lastname"];
    let allowNumberLimit = ["phone_no", "father_phone_no", "mother_phone_no","guard_phone_no","primary_contact","primary_contact1"];
    let pinCheck = ["pincode","permanent_pincode","guard_pincode"];
    let numberCheck = ["passed_academic_year","joining_year"];
    let AdhaarCheck = ["aadhaar_no"];

    if (allowOnlyText.includes(name)){
     this.setState({ [name]: value.replace(/[^A-Za-z]/ig, '') });
    }else if(allowNumberLimit.includes(name)){
      if (this.verifyNumberLength(value, 11)){
        this.setState({ [name]: value });
      }
    }else if(pinCheck.includes(name)){
      if (this.verifyNumberLength(value, 7)){
      this.getAddressInfo(value,name);
      }
    }else if(AdhaarCheck.includes(name)){
      if (this.verifyNumberLength(value, 13)){
        this.setState({ [name]: value });
      }
    }else if(numberCheck.includes(name)){
      if (this.verifyNumber(value)){
        this.setState({ [name]: value });
      }
    }else{
      this.setState({ [name]: value });
    }
  }
  

  handleAddress = (status) => {
    if(status == false){
      this.setState({permanent_address1:this.state.address_line1,permanent_address2:this.state.address_line2, permanent_pincode:this.state.pincode,permanent_post_office: this.state.post_office,permanent_city:this.state.taluk,permanent_district:this.state.district,permanent_state:this.state.state,same_address:!status})
      
    }
    else{
      this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_city:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };
  handleAdmissionDate = (val) => {
    this.setState({ admission_date: val })
  };
  

  studentProfiling = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <Grid container spacing={2} className="mb-3">
        <Grid item xs={12} sm={6} lg={4} >
        <Grid container spacing={2} >
        <Grid item xs={12} sm={6} lg={4} >
        <Button
                 variant="contained"
                 color="secondary"
                onClick={() => this.setState({addForm:true})}>
                Add Field
              </Button>
      
     </Grid>
     <Grid item xs={12} sm={6} lg={6} >
        <Button
                variant="contained"
                color="secondary"
                onClick={() => this.setState({updateForm:true})}>
                 Update/Delete Field
              </Button>
              </Grid>
       </Grid>
      </Grid>
       <Grid item xs={12} sm={6} lg={8} ></Grid>
      </Grid> 
      
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
            Primary Information
          </div>
      </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("firstname","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("middlename","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("lastname","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Gender"
              variant="outlined"
              className="m-2"
              value={this.state.gender}
              onChange={(event) => this.setState({gender:event.target.value})}>
              {this.state.GenderMaster.map(option => (
              <MenuItem key={option} value={option} id={option}>
                  {option}
              </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
            <TextField                        
                id="outlined-select-currency"
                select
                label="Select Blood Group"
                variant="outlined"
                className="m-2"
                value={this.state.bloodgroup}
                onChange={(event) => this.setState({bloodgroup:event.target.value})}>
                {this.state.BloodGroupMaster.map(option => (
                <MenuItem key={option} value={option} id={option}>
                    {option}
                </MenuItem>
                ))}
            </TextField>
          </FormControl> 
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          id="date-picker-dialog"
          label="Date of birth"
          className="m-2"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.dateOfBirth}
          inputProps={{ readOnly: true }}
          disableFuture={true}
          onChange={this.handleDateOfBirth}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mothertongue","Mother Tongue")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Nationality"
              variant="outlined"
              className="m-2"
              value={this.state.nationality}
              onChange={(event) => this.setState({nationality:event.target.value})}>
              {this.state.NationalityMaster.map(option => (
              <MenuItem key={option} value={option} id={option}>
                  {option}
              </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Religion"
              variant="outlined"
              className="m-2"
              value={this.state.religion}
              onChange={(event) => this.setState({religion:event.target.value})}>
              {this.state.ReligionMaster.map(option => (
              <MenuItem key={option} value={option} id={option}>
                  {option}
              </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("caste","Caste")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("castecategory","Caste Category")}
        </Grid>
      </Grid>

          <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
              Contact Details
          </div>
      </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("phone_no","Phone Number")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {/* <FormControl fullWidth>
            <TextField 
              inputProps={{
              style: {textTransform: 'capitalize'},
              autoComplete: "off",
              pattern: "[a-z]"
              }}
              id="document-type"   
              value=""
              label="Email" 
              type="search" 
              onChange={(event) => this.handleEmail}
              //onKeyPress={this.handleEmail}
              className="m-2"
              variant="outlined"  />
          </FormControl> */}
          {this.renderEmailInput("email","Email")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("linkedin_id","Linkedin ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("facebook_id","Facebook ID")}
        </Grid>
      </Grid> 

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Correspondance Address
          </div>
         </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("address_line1","Communication address line 1")}
        </Grid>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("address_line2","Communication address line 2")}
        </Grid>
        <Grid item xs={12} lg={2} className="py-1">
          {this.renderTextInput("pincode","Pincode")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("post_office","Post Office")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("taluk","Taluk/City")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("district","District")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {/* <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select State"
              variant="outlined"
              className="m-2"
              value={this.state.state}
              onChange={(event) => this.setState({state:event.target.value})}>
              {this.state.StateMaster.map(option => (
              <MenuItem key={option} value={option} id={option}>
                  {option}
              </MenuItem>
              ))}
            </TextField>
          </FormControl> */}
          {this.renderTextInput("state","State")}
        </Grid>
      </Grid> 

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3} className="p-20  mt-3">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Permanent Address
          </div>
         </Grid>

         <Grid item xs={12} sm={6} lg={9} className="p-20">
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.same_address == true}
                          onClick={() => {this.handleAddress(this.state.same_address); this.setState({same_address:!this.state.same_address})}}
                        />
                      }
                      label="Same as above"
                    />
         </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("permanent_address1","Permanent address line 1")}
        </Grid>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("permanent_address2","Permanent address line 2")}
        </Grid>
        <Grid item xs={12} lg={2} className="py-1">
          {this.renderTextInput("permanent_pincode","Pincode")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_post_office","Post Office")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_city","Taluk/City")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_district","District")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {/* <FormControl fullWidth>
              <TextField                        
                id="outlined-select-currency"
                select
                label="Select State"
                variant="outlined"
                className="m-2"
                value={this.state.permanent_state}
                onChange={(event) => this.setState({permanent_state:event.target.value})}>
                {this.state.StateMaster.map(option => (
                <MenuItem key={option} value={option} id={option}>
                    {option}
                </MenuItem>
                ))}
              </TextField>
            </FormControl> */}
            {this.renderTextInput("permanent_state","Permanent State")}
        </Grid>
      </Grid> 
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Admission Details
          </div>
         </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("admission_number","Admission Number")}
        </Grid>
        {/* <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("aadhaar_no","Aadhaar No")}
        </Grid> */}
        <Grid item xs={12} lg={4} className="py-1">
          <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          id="date-picker-dialog"
          label="Admission Date"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          className="m-2"
          inputProps={{ readOnly: true }}
          value={this.state.admission_date}
          onChange={this.handleAdmissionDate}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("admission_date","Admission Date")}
        </Grid> */}
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("sts_number","STS Number")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("joining_year","Year Of Joining")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("roll_number","Roll Number")}
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Supporting Documents References
          </div>
         </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("birth_certificate_no","Birth Certificate No")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("aadhaar_no","Aadhaar No")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("passport_no","Passport No")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("driving_license_no","Driving License No")}
        </Grid>
      </Grid>
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
     
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                 
        <Chip onClick={()=>this.handleNext()}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={()=>this.handleNext()}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>   
      </ExampleWrapperSimple>
      </Animated>
    )
  }

  siblingProfiling = () => {
    return (
      <Animated className="overflowVisible" animationIn="slideInRight" animationOut="slideOutLeft"> 
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={6} lg={12} className="p-20">
        <Card className="card-box  mb-2 mt-2 py-3">
        <Grid container spacing={2} justify="center" className="align-center">
        <Grid item xs={12} sm={6} lg={3} className="text-right">
          <span className="mr-10">No of Siblings </span>
          <input type='number' className="text-center mr-10 w-50"
                    value={this.state.siblingCount}
                    onChange={(event => this.setState({siblingCount:event.target.value}))}
          />
          </Grid>
          <Grid item xs={12} sm={6} lg={1} className="m-0 pickerGrid">
          <Avatar onClick={()=>this.rendersiblings()}>
            <NavigateNext />
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={6} lg={8} className="m-0"></Grid>
          </Grid>
        </Card>  
      </Grid>
      </Grid>
      {this.state.siblingHolders.map((routeholder, idx) => (
        <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2} justify="center" className="align-center">
        <Grid item xs={12} sm={6} lg={5}>
        <strong>Sibling {idx+1} </strong>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        Studying in same institute?
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        <FormControl component="fieldset">
        <RadioGroup row aria-label="position"  defaultValue="top">
        <FormControlLabel value="end" control={
            <Radio name="yes" color="primary" checked={routeholder.checked=="Yes"}
                   onChange={() => {this.handleChangeInstitute(idx,"Yes")}} />} label="Yes" />
        <FormControlLabel value="end" control={<Radio name="no" color="primary" checked={routeholder.checked=="No"}
                          onChange={() => {this.handleChangeInstitute(idx,"No")}} />} label="No" />
        </RadioGroup>
        </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={1}>
        <IconButton aria-label="delete" className="m-2" onClick={()=>this.removeSiblingdHolder(idx)}>
            <AddCircleTwoToneIcon />
          </IconButton>
        </Grid>
        </Grid>

        {routeholder.checked == "Yes" && <div>
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={3}></Grid>
          <Grid xs={12} sm={12} md={6} >    
          <Autocomplete
            type="student"
            showValue={true}
            SearchPlaceholderText="Enter name and select from suggestions"
            suggestions={this.state.studentSuggestions}
            onSelected={this.handleStudentSearch}
            {...this.props}
          /> 
          </Grid>
          </Grid> 
          </div>
        }
          {routeholder.checked == "No" && <div>
          <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
             <FormControl fullWidth>
              <TextField 
                inputProps={{
                 autoComplete: 'off',
                 style: {textTransform: 'capitalize'}
                 }}
                 className="m-2"
               id="document-type"   
               value={routeholder.sibling_firstname}
               label="First Name" 
               type="search" 
               onChange={(event) => this.handleSiblingData(idx,"sibling_firstname",event.target.value)}
               inputRef={this.textInput} 
               variant="outlined" />
             </FormControl>
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
        <FormControl fullWidth>
            <TextField 
              inputProps={{
               autoComplete: 'off',
               style: {textTransform: 'capitalize'}
               }}
               className="m-2"
             id="document-type"   
             value={routeholder.sibling_middlename}
             label="Middle Name" 
             type="search" 
             onChange={(event) => this.handleSiblingData(idx,"sibling_middlename",event.target.value)}
             inputRef={this.textInput} 
             variant="outlined" />
                 
                  </FormControl>
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
            <FormControl fullWidth>
                <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  className="m-2"
                id="document-type"   
                value={routeholder.sibling_lastname}
                label="Last Name" 
                type="search" 
                onChange={(event) => this.handleSiblingData(idx,"sibling_lastname",event.target.value)}
                inputRef={this.textInput} 
                variant="outlined" />
            </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Gender"
              variant="outlined"
              className="m-2"
              value={routeholder.sibling_gender}
              onChange={(event) => this.handleSiblingData(idx,"sibling_gender",event.target.value)}
            >
              {this.state.GenderMaster.map(option => (
                <MenuItem key={option} value={option} id={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        {/* <FormControl fullWidth>
                  <TextField 
                inputProps={{
                 autoComplete: 'off',
                 style: {textTransform: 'capitalize'}
                 }}
               id="document-type"   
               value={routeholder.sibling_gender}
               label="Gender" 
               type="search" 
               onChange={(event) => this.handleSiblingData(idx,"sibling_gender",event.target.value)}
               inputRef={this.textInput} 
               variant="outlined" />
                    </FormControl> */}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1 dobGrid">
        <FormControl fullWidth>
                   <MuiPickersUtilsProvider utils={DateFnsUtils}>
                   <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date of birth"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          className="m-2"
          disableFuture={true}
          inputProps={{ readOnly: true }}
          value={routeholder.sibling_dob}
          onChange={(val) => this.handleSiblingData(idx,"sibling_dob",val)}   
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
                </MuiPickersUtilsProvider>
                    </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {/* <FormControl fullWidth>
            <TextField
              className="m-2"
              id="outlined-select-currency"
              select
              label="Select Standard"
              value={routeholder.sibling_standard}
              onChange={(event) => this.handleSiblingData(idx,"sibling_standard",event.target.value)}
              variant="outlined">
              {this.state.textSuggestions.map(option => (
              <MenuItem key={option.value} value={option.value} id={option.id}>
              {option.value}
            </MenuItem>
              ))}
            </TextField>
          </FormControl> */}

        <FormControl fullWidth>
                  <TextField 
                inputProps={{
                 autoComplete: 'off',
                 style: {textTransform: 'capitalize'}
                 }}
               id="document-type"   
               value={routeholder.sibling_standard}
               label="Studying Standard" 
               type="search" 
               onChange={(event) => this.handleSiblingData(idx,"sibling_standard",event.target.value)}
               inputRef={this.textInput} 
               variant="outlined" />
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
        
        {/* <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Board"
              variant="outlined"
              className="m-2"
              value={routeholder.sibling_board}
              onChange={(event) => this.handleSiblingData(idx,"sibling_board",event.target.value)}
            >
              {this.state.boardDetails.map(option => (
                <MenuItem key={option.id} value={option.id} id={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl> */}

          <FormControl fullWidth>
            <TextField 
            inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
            id="document-type"   
            value={routeholder.sibling_board}
            label="Board" 
            type="search" 
            onChange={(event) => this.handleSiblingData(idx,"sibling_board",event.target.value)}
            inputRef={this.textInput} 
            variant="outlined" />
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
                 <FormControl fullWidth>
                  <TextField 
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  className="m-2"
                  id="document-type"   
                  value={routeholder.sibling_school}
                  label="School name" 
                  type="search" 
                  onChange={(event) => this.handleSiblingData(idx,"sibling_school",event.target.value)}
                  inputRef={this.textInput} 
                  variant="outlined" />
                  </FormControl>
        </Grid>
        <Grid item xs={12} lg={8} className="py-1">
                <FormControl fullWidth>
                  <TextField 
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  className="m-2"
                  id="document-type"   
                  value={routeholder.sibling_school_address}
                  label="School full address" 
                  type="search" 
                  onChange={(event) => this.handleSiblingData(idx,"sibling_school_address",event.target.value)}
                  inputRef={this.textInput} 
                  variant="outlined" />
                  </FormControl>
        </Grid>
      </Grid>
         </div>
          }
        </Card>
      ))}
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
        <Chip onClick={()=>this.handleBack()}
        icon={<KeyboardArrowLeft />}
        label={this.state.steps[this.state.activeStep - 1]}
        clickable
        color="secondary"
        onDelete={()=>()=>this.handleBack()}
        deleteIcon={<Avatar style={{width:22,height:22,backgroundColor:'#303f9f',color:'#fff', fontSize:'0.75rem'}}>{this.state.activeStep}</Avatar>}
        variant="outlined"
      />
        
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
        <Chip onClick={()=>this.handleNext()}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={()=>this.handleNext()}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>   
      </ExampleWrapperSimple>
      </Animated>  
    )
  }

  parentsProfiling = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Fathers Primary Information
          </div>
      </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("father_name","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("father_middle_name","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">          
          {this.renderTextInput("father_last_name","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("father_phone_no","Phone Number")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderEmailInput("father_email_id","Email ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("father_education","Father Education")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("father_occupation","Father Occupation")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("father_linkedin_id","Linkedin ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("father_facebook_id","Facebook ID")}
        </Grid>
      </Grid>
      </Card>

      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Mothers Primary Information
          </div>
      </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("mother_name","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("mother_middle_name","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("mother_last_name","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mother_phone_no","Phone Number")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderEmailInput("mother_email_id","Email ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mother_education","Mother Education")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mother_occupation","Mother Occupation")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mother_linkedin_id","Linkedin ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mother_facebook_id","Facebook ID")}
        </Grid>
      </Grid>
      </Card>

      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Guardians(if any) Primary Information
          </div>
      </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("guard_name","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("guard_middle_name","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("guard_last_name","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_phone_no","Phone Number")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderEmailInput("guard_email_id","Email ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_linkedin_id","Linkedin ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_facebook_id","Facebook ID")}
        </Grid>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("guard_address_line1","Communication address line 1")}
        </Grid>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("guard_address_line2","Communication address line 2")}
        </Grid>
        <Grid item xs={12} lg={2} className="py-1">
          {this.renderTextInput("guard_pincode","Pincode")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_post_office","Post Office")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_city","Taluk/City")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_district","District")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_state","State")}
        </Grid>
      </Grid>
      </Card>

      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} className="py-1 m-auto text-center">
        Preferred Contact Numbers
        </Grid>
        <Grid xs={12} sm={12} md={3} className="primaryCommunicationGrid">
        {this.renderTextInput("primary_contact","Phone Number 1")}         
        </Grid>
        <Grid xs={12} sm={12} md={3} className="primaryCommunicationGrid">
        {this.renderTextInput("primary_contact1","Phone Number 2")}         
        </Grid>
      </Grid>
      <Grid container spacing={4} className="mt-2">
        <Grid item xs={12} lg={3} className="py-1 m-auto text-center">
        Message to be sent to:
        </Grid>
        <Grid item xs={12} lg={3} className="py-1 m-auto text-center">
        <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.phone1Checked}
                          onClick={() => {this.handleMessageSent("1")}}
                        />
                      }
                      label="Phone Number 1"
                    />
        </Grid>
        <Grid item xs={12} lg={3} className="py-1 m-auto text-center">
        <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.phone2Checked}
                          onClick={() => {this.handleMessageSent("2")}}
                        />
                      }
                      label="Phone Number 2"
                    />
        </Grid>
        <Grid item xs={12} lg={3} className="py-1 m-auto text-center">
        <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.bothChecked}
                          onClick={() => {this.handleMessageSent("0")}}
                        />
                      }
                      label="Both"
                    />
        </Grid>
        </Grid>
      </Card>    
        
  
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
        <Chip onClick={()=>this.handleBack()}
        icon={<KeyboardArrowLeft />}
        label={this.state.steps[this.state.activeStep - 1]}
        clickable
        color="secondary"
        onDelete={()=>()=>this.handleBack()}
        deleteIcon={<Avatar style={{width:22,height:22,backgroundColor:'#303f9f',color:'#fff', fontSize:'0.75rem'}}>{this.state.activeStep}</Avatar>}
        variant="outlined"
      />
        
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
        <Chip onClick={()=>this.handleNext()}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={()=>this.handleNext()}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>  
    
      </ExampleWrapperSimple>
      </Animated>
    )
  }

  AcademicProfiling = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2} justify="center" className="align-center">
       
        <Grid item xs={12} sm={6} lg={6}>
        Previously studied?
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        <FormControl component="fieldset">
        <RadioGroup row aria-label="position" name="yes" defaultValue="top">
        <FormControlLabel value="end" control={
            <Radio color="primary" checked={this.state.previouslyStudied=="Yes"}
                   onChange={() => {this.handlePreviouStudied("Yes")}} />} label="Yes" />
        </RadioGroup>
        </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        <FormControl component="fieldset">
        <RadioGroup row aria-label="position" name="no" defaultValue="top">
        <FormControlLabel value="end" control={<Radio color="primary" checked={this.state.previouslyStudied=="No"}
        onChange={() => {this.handlePreviouStudied("No")}} />} label="No" />
        </RadioGroup>
        </FormControl>
        </Grid>
        </Grid>

        {this.state.previouslyStudied == "Yes" && <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
            Please mention latest passed out details
          </div>
         </Grid>
        </Grid> 
        <Grid container spacing={2}> 
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_name","School Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_address","School Address")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_academic_year","Academic Year")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_board","Board")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_standard","Standard")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("passed_grade","Grade")}
        </Grid>
        </Grid>
        </div>  
        }
        </Card>
        <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Awards and recognition (if any)
          </div>
      </Grid>
      </Grid>
      {this.state.awardHolders.map((awardholder, idx) => (
        <div>
           <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id={"award_academic_year"+idx}   
              value={awardholder.award_academic_year}
              label="Academic Year" 
              type="search" 
              onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                this.handleAwardChange(idx,"award_academic_year", event.target.value.replace(/\s/g, ''))
              }}}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id={"achievement"+idx}   
              value={awardholder.area_of_achievement}
              label="Area of achievement" 
              type="search" 
              onChange={(event) => { this.handleAwardChange(idx,"area_of_achievement",event.target.value.replace(/\s/g, ''))}}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id={"remarks"+idx}   
              value={awardholder.award_remarks}
              label="Remarks" 
              type="search" 
              onChange={(event) => { this.handleAwardChange(idx,"award_remarks",event.target.value.replace(/\s/g, ''))}}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={1}>
            {idx === 0 ?   
            
              <div  className="addHolderStyle inputMargin">
                <FormControl fullWidth >
                  <TextField 

                  id="document-type"   
                  onKeyPress={(data) => {
                  if (data.charCode === 13) {
                  this.handleAddAwardholder(); this.focusTextInput();
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
                  onClick={()=>{this.handleAddAwardholder(); this.focusTextInput()}}
                  variant="outlined" />
                </FormControl>
              </div>
              :
              <div className="removeHolderStyle inputMargin"> 
                <FormControl fullWidth>
                  <TextField 
                  onKeyPress={(data) => {
                  if (data.charCode === 13) {
                  this.removeAwardHolder(idx); 
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
                  onClick={()=>{this.removeAwardHolder(idx);}}
                  variant="outlined" />
                </FormControl>
              </div>
            }
            </Grid>  
           </Grid>
        </div>
      ))}  
      </Card>
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
        <Chip onClick={()=>this.handleBack()}
        icon={<KeyboardArrowLeft />}
        label={this.state.steps[this.state.activeStep - 1]}
        clickable
        color="secondary"
        onDelete={()=>()=>this.handleBack()}
        deleteIcon={<Avatar style={{width:22,height:22,backgroundColor:'#303f9f',color:'#fff', fontSize:'0.75rem'}}>{this.state.activeStep}</Avatar>}
        variant="outlined"
      />
        
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
        <Chip onClick={()=>this.handleNext()}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={()=>this.handleNext()}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>  
    </ExampleWrapperSimple>
    </Animated>  
    )
  }

  feeConfiguration = () => {
    console.log('standard'+JSON.stringify(this.state.textSuggestions));
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={12}>
        <div className="card-header--title font-size-md font-weight-bold ml-2">
        Select Category:
        </div>
        </Grid>
        </Grid>
        <Grid container spacing={2}>
          
        {this.state.categoryData.length>0 && this.state.categoryData.map((original,key) => (

            <Grid item xs={12} sm={6} lg={3}>
                 <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={(original.id==this.state.lfeecategory)?this.state.feeCategoryChecked:false}
                          onClick={() => {this.handleFeeCategory(original.id,original.name,this.state.feeCategoryChecked)}}
                        />
                      }
                      label={original.name}
                    />
            </Grid>  
        ))}  
        </Grid>  
    </Card> 
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={3}>
        <div className="card-header--title font-size-md font-weight-bold ml-2">
        Select Board:
        </div>
        </Grid>
        </Grid>
        {/* <Grid container spacing={2}>
        {this.state.boardDetails.length>0 && this.state.boardDetails.map((original,key) => (
            <Grid item xs={12} sm={6} lg={3}>
                 <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={(original.id == this.state.selectedBoard)?this.state.boardChecked:false}
                          onClick={() => {this.handleBoard(original.id,original.name,this.state.boardChecked)}}
                        />
                      }
                      label={original.name}
                    />
            </Grid>  
        ))}  
        </Grid>   */}
        <Grid container spacing={2}>
        {this.state.boardDetails.length>0 && this.state.boardDetails.map((original,key) => (
            <Grid item xs={12} sm={6} lg={3}>
                 <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked = {(original.id === this.state.selectedFeeBoard)?this.state.boardChecked:false}
                          onClick={() => {this.handleBoard(original.id,original.name,this.state.boardChecked)}}
                        />
                      }
                      label={original.name}
                    />
            </Grid>  
        ))}  
        </Grid>  
    </Card> 
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2} justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={6} className="text-center">
        <div className="card-header--title font-size-md font-weight-bold ml-2">
        Joining Standard
        </div>
        </Grid>
            <Grid item xs={12} sm={6} lg={6}>
            <FormControl fullWidth>
            <TextField
                    className="m-2"
                    id="outlined-select-currency"
                    select
                    label="Select Standard"
                    value={this.state.joiningStandardName}
                    onChange={(event,child) => this.selectJoiningStandard(event,child.props.id)}
                    variant="outlined">
                    {this.state.textSuggestions.map(option => (
                     <MenuItem key={option.value} value={option.value} id={option.id}>
                     {option.value}
                   </MenuItem>
                    ))}
                  </TextField>
                  </FormControl>
            </Grid>  
        </Grid>  
    </Card> 
    <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
        <Chip onClick={()=>this.handleBack()}
        icon={<KeyboardArrowLeft />}
        label={this.state.steps[this.state.activeStep - 1]}
        clickable
        color="secondary"
        onDelete={()=>()=>this.handleBack()}
        deleteIcon={<Avatar style={{width:22,height:22,backgroundColor:'#303f9f',color:'#fff', fontSize:'0.75rem'}}>{this.state.activeStep}</Avatar>}
        variant="outlined"
      />
        
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
        <Chip onClick={()=>this.handleNext()}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={()=>this.handleNext()}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>  
    </ExampleWrapperSimple>
    </Animated>
    )
  }     

  attachments = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
    <Grid container spacing={4}>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Student Photo</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrl} alt={this.state.selectedFile} />
                 </div>
               <div>
               {this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('student')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('student')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('student')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>  
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Father Photo</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleFatherImageChange} ref={fileFatherInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageFatherPreviewUrl} alt={this.state.selectedFatherFile} />
                 </div>
               <div>
               {this.state.selectedFatherFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('father')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('father')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('father')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid> 
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Mother Photo</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleMotherImageChange} ref={fileMotherInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageMotherPreviewUrl} alt={this.state.selectedMotherFile} />
                 </div>
               <div>
               {this.state.selectedMotherFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('mother')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('mother')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('mother')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Guardian Photo</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleGuardImageChange} ref={fileGuardInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageGuardPreviewUrl} alt={this.state.selectedGuardFile} />
                 </div>
               <div>
               {this.state.selectedGuardFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('guard')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('guard')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('guard')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Birth Certificate</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleBirthImageChange} ref={fileBirthInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageBirthPreviewUrl} alt={this.state.selectedBirthFile} />
                 </div>
               <div>
               {this.state.selectedBirthFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('birth')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('birth')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('birth')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Aadhaar Card</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleAadhaarImageChange} ref={fileAadhaarInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageAadhaarPreviewUrl} alt={this.state.selectedAadhaarFile} />
                 </div>
               <div>
               {this.state.selectedAadhaarFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('aadhaar')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('aadhaar')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('aadhaar')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Latest Marks Card</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleMarksImageChange} ref={fileMarksInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageMarksPreviewUrl} alt={this.state.selectedMarksFile} />
                 </div>
               <div>
               {this.state.selectedMarksFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('marks')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('marks')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('marks')}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               )}
               </div>
               </div>
              </FormControl> 
    </Card>
    </Grid>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Transfer Certificate</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleTransferImageChange} ref={fileTransferInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imageTransferPreviewUrl} alt={this.state.selectedTransferFile} />
                 </div>
               <div>
               {this.state.selectedTransferFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('transfer')}>
                 {"Add Photo"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('transfer')}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('transfer')}>
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
    <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
        <Chip onClick={()=>this.handleBack()}
        icon={<KeyboardArrowLeft />}
        label={this.state.steps[this.state.activeStep - 1]}
        clickable
        color="secondary"
        onDelete={()=>()=>this.handleBack()}
        deleteIcon={<Avatar style={{width:22,height:22,backgroundColor:'#303f9f',color:'#fff', fontSize:'0.75rem'}}>{this.state.activeStep}</Avatar>}
        variant="outlined"
      />
        
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
        {AuthHelper('Student Demography','can_create') &&  <Button  onClick={()=>this.handleStudent()}
        color="secondary"
        variant="outlined">
        Finish
        </Button>}
        </Grid>
        </Grid>    
    </ExampleWrapperSimple>
    </Animated>
    )
    }


  getStepContent = (step) => {
    switch (step) {
      case 0:
        return this.studentProfiling();
      case 1:
        return this.siblingProfiling();
      case 2:
        return this.parentsProfiling();
      case 3:
        return this.AcademicProfiling();
      case 4:
        return this.feeConfiguration();
      case 5:
        return this.attachments();  
      default:
        return this.studentProfiling();
    }
  }

 
  handleStep = (step) => {  
    if(step == 1){
      if(this.validateForm('Profile') == true){
        this.setState({activeStep:step});
      }else{
          return false;
      }
    }else if(step == 2){
      if(this.validateForm('Profile') == true){
        this.setState({activeStep:step});
      }else{
          return false;
      }
    }else if(step == 3){
      if(this.validateForm('Profile') == true && this.validateForm('Family') == true){
        this.setState({activeStep:step});
      }else{
          return false;
      }
    }else if(step == 4){
      if(this.validateForm('Profile') == true && this.validateForm('Family') == true && this.validateForm('Academic') == true){
        this.setState({activeStep:step});
      }else{
          return false;
      }
    }else if(step == 5){
      if(this.validateForm('Profile') == true && this.validateForm('Family') == true && this.validateForm('Configuration') == true){
        this.setState({activeStep:step});
      }else{        
        return false;
      }
    }else{
      this.setState({activeStep:step});
    }    
  }



  handleNext = () => {
    if(this.state.activeStep === 0){
      if(this.validateForm('Profile') === true){
        this.setState({activeStep: this.state.activeStep + 1});
        this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{ 
          return false;
      }
    }else if(this.state.activeStep === 2){
      if(this.validateForm('Family') === true){
        this.setState({activeStep: this.state.activeStep + 1});
        this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{
          return false;
      }
    }else if(this.state.activeStep === 3){
      if(this.validateForm('Profile') === true && this.validateForm('Family') === true && this.validateForm('Academic') === true){
        this.setState({activeStep: this.state.activeStep + 1});
        this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{
          return false;
      }
    }else if(this.state.activeStep === 4){
      if(this.validateForm('Configuration') === true){
        this.setState({activeStep: this.state.activeStep + 1});
        this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{
          return false;
      }
    }else{
      this.setState({activeStep: this.state.activeStep + 1});
      this.props.title(this.state.steps[this.state.activeStep + 1]);  
    }

    // this.setState({activeStep: this.state.activeStep + 1});
    // this.props.title(this.state.steps[this.state.activeStep + 1]);
  };

  handleBack = () => {
    this.setState({activeStep: this.state.activeStep - 1});
    this.props.title(this.state.steps[this.state.activeStep - 1]);
  };

  getAllBoardDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,  
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('boards/get_data',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ boardDetails: response.data });
        }
      }
    }).catch(error => {
      //alert("error");
  
    });
  }

  getAddressInfo(pincode, type) {
    this.setState({ [type]: pincode });
    if(pincode && pincode.length == 6){
    const postData = {
      pincode:pincode,
    }
    new Service().apiCall('Pincode/GetPincode',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
                
        let newArr = response.data.filter(v=>v.delivery == "Delivery");
        //console.log(newArr);
        this.setState({pincodesArr:newArr, selectPOPanel:true, addressType:type})
        }
        else{
          this.setState({pincodesArr:[]})
        }
      }
    }).catch(error => {
      //alert("error");  
    });
  }
  }

  getSectionSubjectDetails(id_section, selectedSubjects) {
    const postData = {
      type: 'cstr',
      standard_id: id_section,
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('SubjectStandards/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        console.log(response.data);
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
          lAllSubjectStandard.checked = false;
          if (selectedSubjects && selectedSubjects.includes(element.id)) {
            lAllSubjectStandard.checked = true;
          }
          lAllSubjectStandards.push(lAllSubjectStandard);
          if (element.status == 1) {
            var lActiveSubjectStandard = {};
            lActiveSubjectStandard.id = element.id;
            lActiveSubjectStandard.name = element.name;
            lActiveSubjectStandard.status = element.status;
            lActiveSubjectStandard.type = element.type;
            lActiveSubjectStandard.checked = false;
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
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
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
              lInActiveSubjectStandard.checked = true;
            }
            lInActiveSubjectStandards.push(lInActiveSubjectStandard);
          }
        })
        this.setState({ standardSubjects: response.data });
      } else {
        this.setState({ standardSubjects: []});
      }
    }).catch(error => {
     // alert("error.response.data.message");
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
      //console.log(response);
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
                  lStandard.section_name = element.section_name;
                  lStandard.stream_name = element.stream_name;
                  lStandard.standard_id = element.standard_id;
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
        response.data.forEach((element,index )=> { 
          if(element.stream_name != null){
            data.push({id:element.section_id, value:element.standard_name+" "+element.stream_name+" "+element.section_name});
          }else{
            data.push({id:element.section_id, value:element.standard_name+" "+element.section_name});
          }
          
        });

        //console.log(data);
        this.setState({classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
     // alert(error);

    });

  }

  handleOptionalSubject = (type,status)=>{
    console.log(type);
    if(type){  
      this.setState({selectedOptionalSubject:true,selectedOptionalSubjectIds:type});	 
      }
      else{
      this.setState({ selectedOptionalSubject:false,selectedOptionalSubjectIds:'' });
      } 
  }

  getFeecategories() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('categories/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
  
        if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, editable: false}));
          if(this.state.showStatus == 'all'){
              this.setState({categoryData:newArr});
          }
          else{
             var newArray = newArr.filter(x => x.status == this.state.showStatus);
             this.setState({categoryData:newArray});
          }
        }
      }
    }).catch(error => {
    //  alert("error");

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

  getSubjectDetails(id_section){
    const postData = { 
      standard_id:[id_section],
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('subjectStandards/get_data',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ subjects: response.data });
      }else{
        this.setState({ subjects: [] });
      }
    }).catch(error => {
    //  alert("error.response.data.message");
    });
  }

  handleSection= (type,name,status)=>{
    if(type){  
      this.setState({selectedFeeSection:true,selectedFeeSectionIds:type});	 
      }
      else{
      this.setState({ selectedFeeSection:false,selectedFeeSectionIds:'' });
      } 
    
  }

  handleMessageSent = (type)=>{
    if(type){  
      if(type == 0){
        if(this.state.bothChecked == false){
          this.setState({message_sent_to:type, phone1Checked:true, phone2Checked:true,bothChecked:true});	
        }
        else{
          this.setState({message_sent_to:type, phone1Checked:false, phone2Checked:false,bothChecked:false});	
        }
      }
     else if(type == 1){
        if(this.state.phone1Checked == false){
          if(this.state.phone2Checked == true){
            this.setState({message_sent_to:type, phone1Checked:true, phone2Checked:true,bothChecked:true});	
          }
          else{
            this.setState({message_sent_to:type, phone1Checked:true});	
          }
        }
        else{
          if(this.state.phone2Checked == true){
            this.setState({message_sent_to:type, phone1Checked:false, phone2Checked:this.state.phone2Checked,bothChecked:false});	
          }
          else{
            this.setState({message_sent_to:type, phone1Checked:false, bothChecked:false});	
          }
        }
      }
      else if(type == 2){
        if(this.state.phone2Checked == false){
          if(this.state.phone1Checked == true){
            this.setState({message_sent_to:type, phone1Checked:true, phone2Checked:true,bothChecked:true});	
          }
          else{
            this.setState({message_sent_to:type, phone2Checked:true,bothChecked:false});	
          }
        }
        else{
          if(this.state.phone1Checked == true){
            this.setState({message_sent_to:type, phone1Checked:this.state.phone1Checked, phone2Checked:false,bothChecked:false});	
          }
          else{
            this.setState({message_sent_to:type, phone2Checked:false, bothChecked:false});	
          }
        }
      }
      }
      else{
      this.setState({ message_sent_to:'' });
      } 
  }

  fillAddress = (po,taluk,district,state,event) => {
    event.preventDefault();
    if(this.state.addressType == "pincode"){
      this.setState({post_office:po,taluk:taluk,district:district,state:state, selectPOPanel:false});
    }
    if(this.state.addressType == "guard_pincode"){
      this.setState({guard_post_office:po,guard_city:taluk,guard_district:district,guard_state:state, selectPOPanel:false});
    }
    else{
      this.setState({permanent_post_office:'',permanent_taluk:'',permanent_district:'',permanent_state:'', selectPOPanel:false});
    }
  }

  componentDidMount() {
   this.getAllBoardDetails();
   this.getFeecategories();
   this.getStandardSectionDetails();
   this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = (window.innerWidth) * (40/100)+"px";
  const width30 = (window.innerWidth) * (30/100)+"px";
  console.log(this.props);
  return (
    <Fragment>
      {this.state.basicNotify}
      <div className="w-100">
        <Stepper alternativeLabel nonLinear activeStep={this.state.activeStep} className="customCard">
          {this.state.steps.map((label, index) => {
            const stepProps = {};
            const buttonProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepButton
                  onClick={()=>this.handleStep(index)}
                  {...buttonProps}>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
       
       
                <Typography>
                  {this.getStepContent(this.state.activeStep)}
                </Typography>
               
            </div>

            <Drawer

anchor="right"
open={this.state.selectPOPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({selectPOPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({selectPOPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Select Address
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} lg={12}>
    {this.state.pincodesArr.length > 0 && this.state.pincodesArr.map((element, index) => (  
    <Card className="card-box my-2 mx-4">
            <div className="card-indicator bg-first" />
            <CardContent className="px-4 py-3">
              <div className="pb-2 d-flex justify-content-between">
                <a href="#" onClick={(e) => this.fillAddress(this.replaceText(element.office),element.taluk,element.district,element.circle,e)}>
                {this.replaceText(element.office)}
                </a>
              </div>
              <div className="d-flex align-items-center justify-content-start">
               
                <div className="font-size text-dark">
                {"Taluk: "+element.taluk+"    District: "+element.district+"    State: "+element.circle}
                </div>
              </div>
            </CardContent>
          </Card>
    ))}
    </Grid>
    </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>

    <Drawer
anchor="right"
open={this.state.standardPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({standardPanel:false})}>
<Box className={"app-header-drawer "} style={{width:width30}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({standardPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Select Section and Subject
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} lg={12}>
    <h4 className="theme-configurator--heading">Sections</h4>
    <ul className="theme-configurator--list">
      <li className="d-block p-3">
    {this.state.classwiseSections.length > 0 && this.state.classwiseSections.map((element, index) => (
                  
                  <Grid container spacing={2} className="p-1 text-center"> 
                  {element.standards.map( sections => sections.standard_id == this.state.joiningStandard ? (
                   <Grid xs={12} sm={10} md={3}>
                     <FormControlLabel
                       control={
                         <Checkbox
                           tabIndex={-1}
                           checked={(sections.section_id==this.state.selectedFeeSectionIds)?this.state.selectedFeeSection:false}
                           onClick={() => {this.getSectionSubjectDetails(sections.section_id);this.getSubjectDetails(sections.section_id);this.handleSection(sections.section_id,sections.section_name,this.state.selectedFeeSection)}}
                         />
                       }
                       label={sections.section_name}
                     />
                     </Grid>
                  ):"")} 
                  </Grid>
               ))}
       </li>
      </ul>   
      <h4 className="theme-configurator--heading">Optional Subjects</h4>
    <ul className="theme-configurator--list">
      <li className="d-block p-3">
                  
                  <Grid container spacing={2} className="p-1 "> 
                  {this.state.standardSubjects.map(element => element.id ? (
                   <Grid xs={12} sm={10} md={6}>
                        <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={(element.smid==this.state.selectedOptionalSubjectIds)?this.state.selectedOptionalSubject:false}
                                 onClick={() => {this.handleOptionalSubject(element.smid,this.state.selectedOptionalSubject)}}
                               />
                             }
                            
                             label={element.name}
                           />
                     </Grid>
                  ):"")} 
                  </Grid>
        
       </li>
      </ul>       
    </Grid>
    </Grid>
    <Grid container spacing={2} className="mt-1 p-3">
    <Grid item xs={12} sm={12} lg={12} className="text-right">
       <Button size="small" color="secondary" variant="contained" onClick={()=>this.setState({standardPanel:false})}>Submit</Button>                      
    </Grid>
    </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>

    

    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);