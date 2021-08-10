import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Chip,Typography,AppBar,Divider,Card,CardContent,Box,TextField,Button,Avatar,Toolbar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem} from '@material-ui/core';
import {Animated} from "react-animated-css";
import PerfectScrollbar from 'react-perfect-scrollbar';
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import Stepper from '@material-ui/core/Stepper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddCircleTwoToneIcon from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import Step from '@material-ui/core/Step';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import CloseIcon from '@material-ui/icons/Close';
import StepButton from '@material-ui/core/StepButton';
import NavigateNext from "@material-ui/icons/NavigateNext";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { ExampleWrapperSimple } from '../../../../layout-components';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
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
      loading:false,
      dashboardDetails:[],
      showStatus:"all",
      individualAllData:[],
      individualData:[],
      pincodesArr:[],
      individualProfession:[],
      individualAcademics:[{passout_year:'',passout_board:'',passout_standard:'',passout_institute:''}],
      individualAttachments:[],
      alumniDetails:[],
      academicCount:'',
      professionCount:'',
      dashboardDetails:[],
      academicHolders:[{passout_year:'',passout_board:'',passout_standard:'',passout_institute:''}],
      professionHolders:[{prof_organization:'',prof_working:new Date(),prof_working_till:new Date(),prof_position_held:''}],
      studentname: '',
      siblingHolders:[],
      GenderMaster:["Male","Female","Other"],
      BloodGroupMaster:["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      NationalityMaster:["Indian"],
      siblingCount:'',
      gender:'',
      dateOfBirth: new Date(),
      first_name:'',
      middle_name:'',
      last_name:'',
      year_pass_out:'',
      gender:'',
      blood_group:'',
      nationality:'',
      phone_no:'',
      email:'',
      linkedin_id:'',
      facebook_id:'',
      address1:'',
      address2:'',
      pincode:'',
      taluk:'',
      district:'',
      state:'',
      pincode:'',
      same_address:false,
      post_office:'',
      permanent_address1:'',
      permanent_address2:'',
      permanent_pincode:'',
      permanent_taluk:'',
      permanent_district:'',
      permanent_state:'',
      permanent_post_office:'',
      remarks:'',
      permanent_pincode:'',
      imagePreviewUrl:defaultImage,
      error: '',
      genderArray:['Male','Female','Others'],
      selectedFile:null,
       imagePreviewUrl:defaultImage,
      imageFatherPreviewUrl:defaultImage,
      imageMotherPreviewUrl:defaultImage,
      imageGuardPreviewUrl:defaultImage,
      imageBirthPreviewUrl:defaultImage,
      imageAadhaarPreviewUrl:defaultImage,
      imageMarksPreviewUrl:defaultImage,
      imageTransferPreviewUrl:defaultImage,
      activeStep:0,
      joiningStandard:'',
      steps:['Alumni Profiling', 'Career Profiling', 'Attachments'],      
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      requiredState:"",     
      forms : {
        "Profile":{
          fields:[

            {
                "name":"first_name",
                "title" : "First name",
                "isMandatory":true,
                "minLength":'',
                "validation":"(a-zA-Z)+"
            },  
            {
                "name":"last_name",
                "title" : "Last name",
                "isMandatory":true,
                "minLength":'',
                "validation":"(a-zA-Z)+"
            },{
              "name" : "year_pass_out",
              "title" : "Pass Out Year",
              "minLength":'',
              "isMandatory":true,
            },
            {
              "name":"phone_no",
              "title" : "Phone number",
              "minLength":10,
              "isMandatory":true,
            },
            {
              "name":"email",
              "title" : "Email ID",
              "minLength":'',
              "isMandatory":true,
            }
          ] 
        }, 
        "Academics":{  
          fields:[
            {
              "name" : "passout_year",
              "title" : "Passed Out Year",
              "minLength":'',
              "isMandatory":true,
            },
            {
              "name" : "passout_board",
              "title" : "Passed Out Board",
              "minLength":'',
              "isMandatory":true,
            },
            {
              "name" : "passout_standard",
              "title" : "Passed Out Standard",
              "minLength":'',
              "isMandatory":true,
            },
            {
              "name" : "passout_institute",
              "title" : "Passed Out Institute",
              "minLength":'',
              "isMandatory":true,
            }
          ]
        }
      }
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
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
    // if(FieldValue.length < field.minLength)
    //     errorString = errorString + field.title + " minimum length should be " + field.minLength;
    // if(FieldValue.length > field.maxLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.maxLength;
    if(FieldValue == '' && field.isMandatory == true)
      errorString = errorString + field.title + " should not be empty";
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
  handleAddAcademicholder = (c) => {
    let lacademicholders = this.state.academicHolders;
    let lAcademic = {};
    lAcademic.passout_year='';
    lAcademic.passout_board='';
    lAcademic.passout_standard='';
    lAcademic.passout_institute='';
    lacademicholders.push(lAcademic);
    this.setState({academicHolders:lacademicholders});
  }
  
  removeAcademicHolder(i) {  
    const { academicHolders } = this.state;
    this.setState({
      academicHolders: academicHolders.filter((skill, index) => index !== i),
    });
  }
  handleAcademicData = (pIndex,inputName,pValue) => {
    let lAcademicHolders = this.state.academicHolders;
    lAcademicHolders[pIndex][inputName] = pValue;
    this.setState({academicHolders:lAcademicHolders});
  }
  handleAddProfessionholder = (c) => {
    let lprofessionholders = this.state.professionHolders;
    let lProf = {};
    lProf.prof_organization='';
    lProf.prof_working=new Date();
    lProf.prof_working_till=new Date();
    lProf.prof_position_held='';
    lprofessionholders.push(lProf);
    this.setState({professionHolders:lprofessionholders});
  }
  
  removeProfessionHolder(i) {  
    const { professionHolders } = this.state;
    this.setState({
      professionHolders: professionHolders.filter((skill, index) => index !== i),
    });
  }
  handleProfessionData = (pIndex,inputName,pValue) => {
    let lProfessionHolders = this.state.professionHolders;
    lProfessionHolders[pIndex][inputName] = pValue;
    this.setState({professionHolders:lProfessionHolders});
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
    console.log(val);
  }
  handleIndividualSearch = (val) => {
    this.setState({'id_user':val.UID,viewStudentPanel:true});
    setTimeout(() => {
      this.getIndividualStudentDetails(val.UID);
    }, 1500);
  }  
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
      this.setState({boardChecked:true,selectedFeeBoard:1});	 
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

  renderTextInput = (name, label) => {
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
          onChange={(event) => this.handleChangeState(name,event.target.value)}
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
  
  onEditorStateChange = remarks => {
    this.setState({
      remarks
    });
  };

  removeAwardHolder(i) {  
    const { awardHolders } = this.state;
    this.setState({
      awardHolders: awardHolders.filter((award, index) => index !== i),
    });
  }
  removeSiblingdHolder(i) {  
    const { siblingHolders } = this.state;
    this.setState({
      siblingHolders: siblingHolders.filter((award, index) => index !== i),
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
      console.log(value.length,length);  
    if (value.length < length && numberRex.test(value)){
       return true;
     }
     return false;
    }
    else{
      console.log("error");
      return true;
    }
   };




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
  handleStaff = () => {  
    const lUserData = this.props.data; 
    let formData = new FormData();
    formData.append('id_organization',this.state.selectedOrganizationId);
    formData.append('id_institute',this.state.selectedInstitutionId);
    formData.append('academicHolders',JSON.stringify(this.state.academicHolders));
    formData.append('professionHolders',JSON.stringify(this.state.professionHolders));
    formData.append('name',this.state.first_name);
    formData.append('middle_name',this.state.middle_name);
    formData.append('last_name',this.state.last_name);
    formData.append('year_pass_out',this.state.year_pass_out);
    formData.append('gender',this.state.gender);
    formData.append('blood_group',this.state.blood_group);
    formData.append('dateOfBirth',this.state.dateOfBirth?moment(this.state.dateOfBirth).format("YYYY-MM-DD"):'');
    formData.append('phone_no',this.state.phone_no);
    formData.append('email_id',this.state.email);
    formData.append('linkedin_id',this.state.linkedin_id);
    formData.append('facebook_id',this.state.facebook_id);
    formData.append('address1',this.state.address1);
    formData.append('address2',this.state.address2);
    formData.append('pincode',this.state.pincode);
    formData.append('taluk',this.state.taluk);
    formData.append('district',this.state.district);
    formData.append('state',this.state.state);
    formData.append('post_office',this.state.post_office);
    formData.append('permanent_address1',this.state.permanent_address1);
    formData.append('permanent_address2',this.state.permanent_address2);
    formData.append('permanent_pincode',this.state.permanent_pincode);
    formData.append('permanent_taluk',this.state.permanent_taluk);
    formData.append('permanent_district',this.state.permanent_district);
    formData.append('permanent_state',this.state.permanent_state);
    formData.append('permanent_post_office',this.state.permanent_post_office);
    formData.append('remarks',this.state.remarks);
    formData.append('alumni_photo',this.state.selectedFile);
  
    new Service().apiCall('Alumnus/insertAlumni', formData,
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
              <div className="avatar-icon-wrapper rounded-circle m-0">
                <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-success text-success m-0 d-130">
                  <FontAwesomeIcon
                    icon={['fas', 'check']}
                    className="d-flex align-self-center display-3"
                  />
                </div>
              </div>
              <h4 className="font-weight-bold mt-4">Alumni Added Successfully!</h4>

            </div>
          </Dialog>
          ),
        });
        setTimeout(() => {
           this.setState({ basicNotify:false});
           this.props.history.push('/admin/view-alumni')
        }, 2000)
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
    //  this.raiseLoginSignupErrorAlert("signup");
    });
  }

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
    let allowOnlyText = ["first_name", "middle_name", "last_name"];
    let allowNumberLimit = ["phone_no", "father_phone_no", "mother_phone_no","guard_phone_no","primary_contact","primary_contact1"];
    let pinCheck = ["pincode","permanent_pincode","guard_pincode"];
    let numberCheck = ["passed_academic_year","year_pass_out","passout_year"];
    if (allowOnlyText.includes(name)){
     this.setState({ [name]: value.replace(/[^A-Za-z]/ig, '') });
    }
    else if(allowNumberLimit.includes(name)){
      if (this.verifyNumberLength(value, 11)){
        this.setState({ [name]: value });
      }
    }
    else if(pinCheck.includes(name)){
      if (this.verifyNumberLength(value, 7)){
      this.getAddressInfo(value,name);
      }
    }
    else if(numberCheck.includes(name)){
      if (this.verifyNumber(value)){
        this.setState({ [name]: value });
      }
    }
    else{
      this.setState({ [name]: value });
    }
  }

  handleChangeStaffType = (value) => {
    this.getRoleData(value);
    this.getDepartmentData(value);
    this.setState({ staffType: value });
  };

  handleAddress = (status) => {
    if(status == false){
      this.setState({permanent_address1:this.state.address1,permanent_address2:this.state.address2, permanent_pincode:this.state.pincode, permanent_post_office: this.state.post_office, permanent_taluk:this.state.taluk,permanent_district:this.state.district,permanent_state:this.state.state,same_address:!status})
      
    }
    else{
      this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_taluk:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  alumniProfiling = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
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
          {this.renderTextInput("first_name","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("middle_name","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("last_name","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("year_pass_out","Year of passed out")}
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
              value={this.state.blood_group}
              onChange={(event) => this.setState({blood_group:event.target.value})}>
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
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.dateOfBirth}
          onChange={this.handleDateOfBirth}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
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
          {this.renderTextInput("address1","Communication address line 1")}
        </Grid>
        <Grid item xs={12} lg={5} className="py-1">
          {this.renderTextInput("address2","Communication address line 2")}
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
          {this.renderTextInput("permanent_taluk","Taluk/City")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_district","District")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_state","State")}
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

  workExperience = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
    
      
      {this.state.workHolders.map((workholder, idx) => (
        <Card className="card-box  mb-2 mt-2 py-3 px-3">  
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={this.state.place}
                      label="Workplace name" 
                      type="search" 
                      inputRef={this.textInput} 
                      onChange={(event) => this.handleWorkChange(idx,"place",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} className="inputMargin">
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={this.state.place}
                      label="Workplace full address" 
                      type="search" 
        
                      onChange={(event) => this.handleWorkChange(idx,"place",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                    <FormControl fullWidth>
                  
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                        margin="normal"
                        autoOk={true}
                        id="date-picker-dialog"
                        label="Working from"
                        inputVariant="outlined"
                        format="MM/dd/yyyy"
                        value={this.state.workFrom}
                        onChange={val => {this.handleWorkChange(idx, "working from",val)}}   
                        KeyboardButtonProps={{
                        'aria-label': 'change date', 
                        }}
                        />
                </MuiPickersUtilsProvider>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                    <FormControl fullWidth>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
     
                        margin="normal"
                        autoOk={true}
                        id="date-picker-dialog"
                        label="Working till"
                        inputVariant="outlined"
                        format="MM/dd/yyyy"
                        value={this.state.WorkTill}
                        onChange={val => {this.handleWorkChange(idx, "working till",val)}}   
                        KeyboardButtonProps={{
                        'aria-label': 'change date', 
                        }}
                        />
                </MuiPickersUtilsProvider>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={this.state.working_position}
                      label="Position held" 
                      type="search" 
                      onChange={(event) => this.handleWorkChange(idx,"working_position",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={11}>
                    <FormControl fullWidth>
                    <Editor
          editorState={this.state.remarks}
          placeholder="Duties and responsibilities"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}} >
                      {(this.state.workHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 

                      id="document-type"   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdWorkholder(); this.focusTextInput();
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
                      onClick={()=>{this.handCustomersdWorkholder(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeWorkHolder(idx); 
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
                      onClick={()=>{this.removeWorkHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
        </Grid>
        </Card>
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
 


  careerProfiling = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Academic Details
          </div>
      </Grid>
      </Grid> 
      {this.state.academicHolders.map((academic, idx) => (
                       <Grid container spacing={2}>
                   
                     <Grid item xs={12} sm={12} md={2}>
                    <FormControl fullWidth>
                     <TextField 
                      inputProps={{
                        autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={academic.passout_year}
                      label="Passed out year" 
                      type="search" 
                      inputRef={this.textInput} 
                      onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                        this.handleAcademicData(idx,"passout_year",event.target.value.replace(/\s/g, ''))
                      }}}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                       <FormControl fullWidth>
                       <TextField 
                      inputProps={{
                        style: {textTransform: 'capitalize'},
                        autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={academic.passout_board}
                      label="Board/University" 
                      type="search" 
        
                      onChange={(event) => this.handleAcademicData(idx,"passout_board",event.target.value)}
                      variant="outlined" />
                       </FormControl>
                       </Grid>
                       <Grid item xs={12} sm={12} md={2}>
                       <FormControl fullWidth>
                       <TextField 
                      inputProps={{
                        style: {textTransform: 'capitalize'},
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={academic.passout_standard}
                      label="Degree/Standard" 
                      type="search" 
        
                      onChange={(event) => this.handleAcademicData(idx,"passout_standard",event.target.value)}
                      variant="outlined" />
                       </FormControl>
                       </Grid>
                       <Grid item xs={12} sm={12} md={4}>
                       <FormControl fullWidth>
                       <TextField 
                      inputProps={{
                        style: {textTransform: 'capitalize'},
                        autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={academic.passout_institute}
                      label="Institue" 
                      type="search" 
        
                      onChange={(event) => this.handleAcademicData(idx,"passout_institute",event.target.value)}
                      variant="outlined" />
                       </FormControl>
                       </Grid>
                       <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}}>
                      {idx === 0 ?   <div  className="addHolderStyle inputMargin">
                        <FormControl fullWidth >
                      <TextField 
                      
                      id="document-type"   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handleAddAcademicholder(); this.focusTextInput();
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
                      onClick={()=>{this.handleAddAcademicholder(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeAcademicHolder(idx); 
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
                      onClick={()=>{this.removeAcademicHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                         </Grid>
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

  attachments = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
    <Grid container spacing={4}>
    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Alumni Photo</div>
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
        <Button  onClick={()=>this.handleStaff()}
        color="secondary"
        variant="outlined">
        Finish
        </Button>
        </Grid>
        </Grid>    
    </ExampleWrapperSimple>
    </Animated>
    )
    }


  getStepContent = (step) => { 
    switch (step) {
      case 0:
        return this.alumniProfiling();
      case 1:
        return this.careerProfiling();
      case 2:
        return this.attachments();  
      default:
        return this.alumniProfiling();
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
      if(this.validateForm('Profile') == true && this.validateForm('Academics')){
        this.setState({activeStep:step});
      }else{ 
          return false;
      }
    }else{
      this.setState({activeStep:step});
    }
    //
  }

  removeSkillHolder(i) {  
    const { skillHolders } = this.state;
    this.setState({
      skillHolders: skillHolders.filter((skill, index) => index !== i),
    });
  }

  handCustomersdSkillholder = (c) => {
    let lskillHolders = this.state.skillHolders;
    let lSkills = {};
    lSkills.skill='';
    lSkills.staff_remark='';
    lskillHolders.push(lSkills);
    this.setState({skillHolders:lskillHolders});
  }

  removeEducationHolder(i) {  
    const { educationHolders } = this.state;
    this.setState({
      educationHolders: educationHolders.filter((education, index) => index !== i),
    });
  }
  handCustomersdEducationholder = (c) => {
    let leducationHolders = this.state.educationHolders;
    let lEducation = {};
    lEducation.year_passout='';
    lEducation.board='';
    lEducation.degree='';
    lEducation.grade='';
    lEducation.school='';
    lEducation.school_address='';
    leducationHolders.push(lEducation);
    this.setState({educationHolders:leducationHolders});
  }
  handleEducationChange = (pIndex,inputName,pValue) => {
    let lEducationHolders = this.state.educationHolders;
    lEducationHolders[pIndex][inputName] = pValue;
    this.setState({educationHolders:lEducationHolders});
  }

 
  handleNext = () => {
    if(this.state.activeStep == 0){
      if(this.validateForm('Profile') == true){
        this.setState({activeStep: this.state.activeStep + 1});
      this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{
          return false;
      }
    }else if(this.state.activeStep == 1 || this.state.activeStep == 2){      
      if(this.validateForm('Profile') == true && this.validateForm('Academics')){
        this.setState({activeStep: this.state.activeStep + 1});
      this.props.title(this.state.steps[this.state.activeStep + 1]);
      }else{
          return false;
      }
    }    
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
      console.log(response.data)
      if (response.status==200 && response.data!='') {         
        let newArr = response.data.filter(v=>v.delivery == "Delivery");
        this.setState({pincodesArr:newArr, selectPOPanel:true, addressType:type})
      }
      else{
        this.setState({pincodesArr:[]})
      }
    }).catch(error => {
      console.log(error)
      //alert("error");
  
    });
  }
  }

  handleSkillChange = (pIndex,inputName,pValue) => {
    let lskillHolders = this.state.skillHolders;
    lskillHolders[pIndex][inputName] = pValue;
    this.setState({skillHolders:lskillHolders});
  }

  handleChangeWorkingHours =(value) =>{
      this.setState({ workingHours: value });
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
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
      console.log(response);
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
            data.push({id:element.standard_id,value:element.standard_name+" "+element.stream_name+" "+element.section_name});
        });
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
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

  handleWorkChange = (pIndex,inputName,pValue) => {
    let lworkholders = this.state.workHolders;
    lworkholders[pIndex][inputName] = pValue;
    this.setState({workHolders:lworkholders});
    }

    handCustomersdWorkholder = (c) => {
      let lworkHolders = this.state.workHolders;
      let lWorks = {};
      lWorks.place='';
      lWorks.working_from='';
      lWorks.working_till='';
      lWorks.working_position='';
      lWorks.working_duties='';
      lworkHolders.push(lWorks);
      this.setState({workHolders:lworkHolders});
    }
    
    removeWorkHolder(i) {  
      const { workHolders } = this.state;
      this.setState({
        workHolders: workHolders.filter((skill, index) => index !== i),
      });
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

  }

render(){
  const width = (window.innerWidth) * (50/100)+"px";
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

    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
