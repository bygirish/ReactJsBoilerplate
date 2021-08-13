import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Chip,Typography,AppBar,Divider,Card,CardContent,Box,TextField,Button,Avatar,Toolbar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import {Animated} from "react-animated-css";
import PerfectScrollbar from 'react-perfect-scrollbar';
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
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import moment from "moment";
import  { Redirect } from 'react-router-dom'

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


class StaffDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open:true,
      showStatus:'all',
      loading:false,
      dashboardDetails:[],
      errorMessageArray:[],
      selectedFile:null,
      editStaff:false,
      activeAccordion:'',
      selectedDepartment:'',
      addressType:'',
      departmentCount:[],
      roles:[],
      pincodesArr:[],
      staffData:[],
      departmentDetails:[],
      boardDetails:[],
      individualAllData:[],
      individualData:[],
      individualWork:[],
      GenderMaster:["Male","Female","Other"],
      BloodGroupMaster:["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      NationalityMaster:["Indian"],
      monday:[{dayname:'Monday',from_time:'09:30',to_time:'09:30'}], 
      tuesday:[{dayname:'Tuesday',from_time:'09:30',to_time:'09:30'}],
      wednesday:[{dayname:'Wednesday',from_time:'09:30',to_time:'09:30'}],
      thursday:[{dayname:'Thursday',from_time:'09:30',to_time:'09:30'}],
      friday:[{dayname:'Friday',from_time:'09:30',to_time:'09:30'}],
      saturday:[{dayname:'Saturday',from_time:'09:30',to_time:'09:30'}],
      mondayshift_count:1,
      tuesdayshift_count:1,
      wednesdayshift_count:1,
      thursdayshift_count:1,
      fridayshift_count:1,
      saturdayshift_count:1,
      individualSkill:[],
      selectPOPanel:false,
      individualEducation:[],
      individualAttachments:[],
      departmentChecked:'',
      departmentName:'',
      formChanged:false,
      ldepartment:'',
      staffHead:'',
      workingHours:'',
      headTeaching:'No',
      staffType:'',
      educationHolders:[{year_passout:'',board:'',degree:'',grade:'',school:'',school_address:''}],
      educationCount:'',
      awardCount:'',
      awardHolders:[{award_academic_year:'',area_of_achievement:'',award_remarks:''}],
      skillCount:'',
      remarks:EditorState.createEmpty(),
      skillHolders:[{skill:'',staff_remark:''}],
      workCount:'',
      workHolders:[{place:'',working_address:'',working_from : moment(new Date()).format("YYYY-MM-DD"), working_till : moment(new Date()).format("YYYY-MM-DD"),working_position:'',working_duties:''}],
      dashboardDetails:[],
      roleData:[],
      headDepartment:'',
      departmentData:[],
      lroles:'',
      father_name:'',
      father_age:'',
      father_number:'',
      mother_name:'',
      mother_age:'',
      mother_number:'',
      sibling_name:'',
      sibling_age:'',
      sibling_number:'',
      ldepartment:'',
      newDepartment:'',
      studentname: '',
      siblingHolders:[],
      siblingCount:'',
      same_address:false, 
      gender:'',
      dateOfBirth: new Date(),
      workFrom: new Date(),
      WorkTill: new Date(),
      working_hour_from: new Date(),
      working_hour_till: new Date(),
      first_name:'',
      first_nameError:'',
      middle_name:'',
      last_name:'',
      gender:'',
      blood_group:'',
      nationality:'',
      phone_no:'',
      email_id:'',
      linkedin_id:'',
      facebook_id:'',
      address1:'',
      address2:'',
      pincode:'',
      post_office:'',
      taluk:'',
      district:'',
      state:'',
      boardChecked:false,
      selectedFeeBoard:'',
      same_address:false,
      permanent_address1:'',
      permanent_address2:'',
      permanent_pincode:'',
      permanent_post_office:'',
      permanent_taluk:'',
      permanent_district:'',
      permanent_state:'',
      birth_certificate:'',
      aadhaar_no:'',
      passport_no:'',
      driving_license_no:'',
      selectedRoleId:'',
      year_passout:'',
      board:'',
      degree:'',
      grade:'',
      school:'',
      school_address:'',      
      headDesignation:'',
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
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      steps:['Staff Profiling', 'Education & Skills', 'Work experience', 'Family Details', 'Configuration', 'Attachments'],
      requiredState:"",
      forms : {
        "Profile":{
            fields:[
                {
                  "name":"first_name",
                  "title" : "First name",
                  "isMandatory":true,
                  "minLength":2,
                  "validation":""
                },
                {
                  "name":"last_name",
                  "title" : "Last name",
                  "minLength":0,
                  "isMandatory":true, 
                  "validation":""
                },
                {
                  "name":"phone_no",
                  "title" : "Phone number",
                  "minLength":10,
                  "isMandatory":true,
                  "validation":""
                },
                {
                  "name":"email_id",
                  "title" : "Email ID",
                  "minLength":"",
                  "isMandatory":true,
                  "validation" : '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
                },
                {
                  "name" : "gender",
                  "title" : "Gender",
                  "minLength":"",
                  "isMandatory":true,
                  "validation":""
                },
                {
                  "name" : "blood_group",
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
                  "name" : "pincode",
                  "title" : "Pincode",
                  "minLength":6,
                  "isMandatory":false,
                  "validation":""
                },
                {
                  "name" : "permanent_pincode",
                  "title" : "Permanent Pincode",
                  "minLength":6,
                  "isMandatory":false,
                  "validation":""
                },
                {
                  "name" : "aadhaar_no",
                  "title" : "Aadhaar Number",
                  "minLength":12,
                  "isMandatory":false,
                  "validation":""
                }
              ] 
        },
        "Family":{
            fields:[
              {
                "name":"father_name",
                "title" : "Father name",
                "isMandatory":true,
                "minLength":2,
                "validation":""
              },
              {
                "name" : "father_number",
                "title" : "Father's Mobile",
                "minLength":10,
                "isMandatory":false,
                "validation":""
              },
              {
                "name" : "mother_number",
                "title" : "Mother's Mobile",
                "minLength":10,
                "isMandatory":false,
                "validation":""
              },
              {
                "name" : "sibling_number",
                "title" : "Sibling's Mobile",
                "minLength":10,
                "isMandatory":false,
                "validation":""
              }
            ]
        },
        "Academic":{
            fields:[
              {
                "name":"",
                "isMandatory":true,
                // "minLength":5,
                // "maxLength":56,
                "validation":""
              }
                
            ]
        },
        "Configuration":{ 
          fields:[
            {
              "name":"staffType",
              "title" : "Staff Type",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"selectedRoleId",
              "title":"Role",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"headDesignation",
              "title":"Designation",
              "minLength":"",
              "isMandatory":true,
              "validation":""
            },
            {
              "name":"ldepartment",
              "title":"Department",
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
    
    // if(FieldValue.length > field.maxLength)
    //     errorString = errorString + field.title + " minimum length should be " + field.maxLength;
    if(FieldValue === '' && field.isMandatory === true){
        errorString = errorString + field.title + " should not be empty";
    }
    if(field.minLength !== ""){
      if(FieldValue !== ""){     
        if(FieldValue.length < field.minLength){
          errorString = errorString + field.title + " minimum length should be " + field.minLength;
        }
      }
    }
    if(field.validation != ""){ 
      if(FieldValue !== ""){     
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // let regex = field.validation;
        // console.log(regex)
        if(!regex.test(FieldValue)){
          errorString = errorString + " Invalid " + field.title;
        }
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
  // handleBoard= (type,name,status) => {
  //   if(type){  
  //     this.setState({boardChecked:true,selectedFeeBoard:type});	 
  //     }
  //     else{
  //     this.setState({ boardChecked:false,selectedFeeBoard:'' });
  //     } 
  // }
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
          id={name}  
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
         pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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


  getRolesList = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Roles/getData',postData).then(response => {
      //console.log(response)
      if (response.status==200 && response.data!='') {
      this.setState({ roles: response.data }); 
      }
    }).catch(error => {
      console.log(error);
    });
  }
  
  onEditorStateChange = remarks => {
    this.setState({
      remarks
    });
  };

  onEditorWorkChange = (value,index) => {
    var editorvalue = draftToHtml(convertToRaw(value.getCurrentContent()));
    
    let lworkholders = this.state.workHolders;
    lworkholders[index].working_duties = editorvalue;
    lworkholders[index].editorState = value;
    this.setState({workHolders:lworkholders});  
  };

  handleChangeHeadTeaching = (value) =>{
    this.setState({ headTeaching: value });
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

  Capitalize = (str) =>{
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  handCustomersdParttimeHolder = (day)=>{
    
    let data = '';
    let mondayshift_count = this.state.mondayshift_count;
    let tuesdayshift_count = this.state.tuesdayshift_count;
    let wednesdayshift_count = this.state.wednesdayshift_count;
    let thursdayshift_count = this.state.thursdayshift_count;
    let fridayshift_count = this.state.fridayshift_count;
    let saturdayshift_count = this.state.saturdayshift_count;
    let object='';

    if(day == 'monday'){ 
      object={dayname:'Monday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")}; 
      data = this.state.monday;
      mondayshift_count = this.state.mondayshift_count + 1;
    }
    if(day == 'tuesday'){ 
      object={dayname:'Tuesday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")};  
      data = this.state.tuesday;
      tuesdayshift_count = this.state.tuesdayshift_count + 1;
    }
    if(day == 'wednesday'){
      object={dayname:'Wednesday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")};
      data = this.state.wednesday;
      wednesdayshift_count = this.state.wednesdayshift_count + 1;
    }
    if(day == 'thursday'){
      object={dayname:'Thursday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")};
      data = this.state.thursday;
      thursdayshift_count = this.state.thursdayshift_count + 1;
    }
    if(day == 'friday'){
      object={dayname:'Friday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")};
      data = this.state.friday;
      fridayshift_count = this.state.fridayshift_count + 1;
    }
    if(day == 'saturday'){
      object={dayname:'Saturday', from_time:moment().format("YYYY-MM-DD HH:mm:ss"), to_time:moment().format("YYYY-MM-DD HH:mm:ss")};
      data = this.state.saturday;
      saturdayshift_count = this.state.saturdayshift_count + 1;
    }

    data.push(object);
    this.setState({data});
    this.setState({mondayshift_count:mondayshift_count, tuesdayshift_count:tuesdayshift_count, wednesdayshift_count:wednesdayshift_count, thursdayshift_count:thursdayshift_count, fridayshift_count:fridayshift_count, saturdayshift_count:saturdayshift_count});
}

  removeMondayHolder = (day, index) =>{

    let mondayshift_count = this.state.mondayshift_count;
    let tuesdayshift_count = this.state.tuesdayshift_count;
    let wednesdayshift_count = this.state.wednesdayshift_count;
    let thursdayshift_count = this.state.thursdayshift_count;
    let fridayshift_count = this.state.fridayshift_count;
    let saturdayshift_count = this.state.saturdayshift_count;

    if(day == 'monday'){ 
      const {monday} = this.state;
      mondayshift_count = this.state.mondayshift_count - 1;
      this.setState({ monday : monday.filter((data,i)=> i!==index)});
    }
    if(day == 'tuesday'){  
      const {tuesday} = this.state;
      tuesdayshift_count = this.state.tuesdayshift_count - 1;
      this.setState({ tuesday : tuesday.filter((data,i)=> i!==index)});
    }
    if(day == 'wednesday'){
      const {wednesday} = this.state;
      wednesdayshift_count = this.state.wednesdayshift_count - 1;
      this.setState({ wednesday : wednesday.filter((data,i)=> i!==index)});
    }
    if(day == 'thursday'){     
      const {thursday} = this.state;
      thursdayshift_count = this.state.thursdayshift_count - 1;
      this.setState({ thursday : thursday.filter((data,i)=> i!==index)});
    }
    if(day == 'friday'){
      const {friday} = this.state;
      fridayshift_count = this.state.fridayshift_count - 1;
      this.setState({ friday : friday.filter((data,i)=> i!==index)});
    }
    if(day == 'saturday'){
      const {saturday} = this.state;
      saturdayshift_count = this.state.saturdayshift_count - 1;
      this.setState({ saturday : saturday.filter((data,i)=> i!==index)});
    }
    
    this.setState({mondayshift_count:mondayshift_count, tuesdayshift_count:tuesdayshift_count, wednesdayshift_count:wednesdayshift_count, thursdayshift_count:thursdayshift_count, fridayshift_count:fridayshift_count, saturdayshift_count:saturdayshift_count});
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

  verifyText = value => {
    var numberRex = new RegExp("^[a-zA-Z ]*$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  }

  verifyNumberLength = (value, length) => {
    
    var numberRex = new RegExp("^[0-9]+$");
    if(value){
      // console.log(value.length,length);  
      if (value.length < length && numberRex.test(value)){
        return true;
      }
      return false;
    }else{
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

  
  handleBoard= (type,name,status) => {
    if(type){  
      this.setState({boardChecked:true,selectedFeeBoard:type});	 
      }
      else{
      this.setState({ boardChecked:false,selectedFeeBoard:'' });
      } 
  }

  rendersiblings = () =>{
    let siblingCount = this.state.siblingCount;
   
    let lsiblingholders = this.state.siblingHolders;
    if(siblingCount > 0){
      for(let i = 0 ; i < siblingCount ; i++) {
        lsiblingholders.push({sibling_firstname:'',sibling_middlename:'',sibling_lastname:'',sibling_gender:'',sibling_dob:'',sibling_standard:'',sibling_board:'',sibling_school:'',checked:""});
    }
    this.setState({siblingHolders:lsiblingholders,siblingCount:''});
    }
  }

  handlePreviouStudied = (value) => {
    this.setState({ previouslyStudied: value });  
  }

  setRole = (name, value) => {
    
    let allowOnlyText = ["lroles"];

    if (allowOnlyText.includes(name)){
      this.setState({ [name]: value.replace(/[^A-Za-z, ]/ig, '') });
     }

    //this.setState({ lroles: value });
  }

  setDepartment = (name, value) => { 
    let allowOnlyText = ["newDepartment"];

    if (allowOnlyText.includes(name)){
      this.setState({ [name]: value.replace(/[^A-Za-z, ]/ig, '') });
     }
     
  }

  updateRole = () => { 

    if(this.state.lroles === ""){
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="p-5">
            <h6 className="font-weight-bold"> 
              <div style={{color:'red', fontSize:13, marginBottom:10}}><Brightness1Icon style={{fontSize:12}} /> Enter Role</div>
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
      
      return false;
    }
    
    let formData = new FormData();
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('id_board',this.props.data.selectedBoardId);
    formData.append('id_academicyear',this.props.data.selectedAcademicId);
    formData.append('staff_type',this.state.staffType);
    formData.append('roles',this.state.lroles);
    
    new Service().apiCall('StaffDetails/insertStaffRole', formData,
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
                <h4 className="font-weight-bold">Role Inserted</h4>
              </div>
            </Dialog>
          ),
        });
        this.getRoleData(this.state.staffType)
        setTimeout(() => {
           this.setState({ basicNotify:false,lroles:'', createDesignationPanel:false});
             
        }, 2000)
      } else {
      //  this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
    //  this.raiseLoginSignupErrorAlert("signup");
    });

  }

  handleChangeDesignation =(value) => {
    this.setState({ headDesignation: value });
  }

  updateDepartment = () => {  

    if(this.state.newDepartment === ""){
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="p-5">
            <h6 className="font-weight-bold"> 
              <div style={{color:'red', fontSize:13, marginBottom:10}}><Brightness1Icon style={{fontSize:12}} /> Enter Department</div>
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

      return false;
    }
  
    const lUserData = this.props.data;
    let formData = new FormData();
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('id_board',this.props.data.selectedBoardId);
    formData.append('id_academicyear',this.props.data.selectedAcademicId);
    formData.append('staff_type',this.state.staffType);
    formData.append('departments',this.state.newDepartment);
    formData.append('id_users',this.props.data.UID);
    new Service().apiCall('StaffDetails/insertStaffDepartment', formData,
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
              <h4 className="font-weight-bold">Department Inserted</h4>
            </div>
          </Dialog>
          ),
        });
        this.getDepartmentData(this.state.staffType)
        setTimeout(() => {
           this.setState({ basicNotify:false,ldepartment:'', createDepartmentPanel:false});
             
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });

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

  //VALIDATION
  // validate = () =>{
  //   let first_nameError = "";

  //   if(!this.state.first_name){
  //     first_nameError = "First name can't be blank";
  //   }

  //   if(first_nameError){
  //     this.setState({first_nameError});
  //     return false;
  //   }

  //   return true;
  // }


  // start of submit form function
  handleStaff = () => {  
    const lUserData = this.props.data; 
    
    let inst =[];
    inst.push({id: this.props.data.selectedOrganizationId, 
    institutions : [{id: this.props.data.selectedInstitutionId}]});
    let formData = new FormData();
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    //formData.append('id_board',this.props.data.selectedBoardId);    
    formData.append('id_board',this.state.selectedFeeBoard);
    formData.append('id_academicyear',this.props.data.selectedAcademicId);
    formData.append('role_id',this.state.selectedRoleId);
    formData.append('educationHolders',JSON.stringify(this.state.educationHolders));
    formData.append('awardHolders',JSON.stringify(this.state.awardHolders));
    formData.append('skillHolders',JSON.stringify(this.state.skillHolders));
    formData.append('workHolders',JSON.stringify(this.state.workHolders));
    formData.append('first_name',this.state.first_name);
    formData.append('middle_name',this.state.middle_name);
    formData.append('last_name',this.state.last_name);
    formData.append('gender',this.state.gender);
    formData.append('blood_group',this.state.blood_group);
    formData.append('date_of_birth',moment(this.state.dateOfBirth).format("YYYY-MM-DD"));
    formData.append('nationality',this.state.nationality);
    formData.append('phone_no',this.state.phone_no);
    formData.append('email_id',this.state.email_id);
    formData.append('linkedin_id',this.state.linkedin_id);
    formData.append('facebook_id',this.state.facebook_id);
    formData.append('address1',this.state.address1);
    formData.append('address2',this.state.address2);
    formData.append('pincode',this.state.pincode);
    formData.append('taluk',this.state.taluk);
    formData.append('district',this.state.district);
    formData.append('state',this.state.state);
    formData.append('permanent_address1',this.state.permanent_address1);
    formData.append('permanent_address2',this.state.permanent_address2);
    formData.append('permanent_pincode',this.state.permanent_pincode);
    formData.append('permanent_taluk',this.state.permanent_taluk);
    formData.append('permanent_district',this.state.permanent_district);
    formData.append('permanent_state',this.state.permanent_state);
    formData.append('birth_certificate',this.state.birth_certificate);
    formData.append('aadhaar_no',this.state.aadhaar_no);
    formData.append('passport_no',this.state.passport_no);
    formData.append('driving_license_no',this.state.driving_license_no); 
    formData.append('remarks', draftToHtml(convertToRaw(this.state.remarks.getCurrentContent())));
    formData.append('staff_type',this.state.staffType);
    formData.append('head_teacher',this.state.headTeaching);
    formData.append('subject_specialization','Engilsh');
    formData.append('working_hours',this.state.workingHours);
    formData.append('father_name',this.state.father_name);
    formData.append('father_age',this.state.father_age);
    formData.append('father_mobile',this.state.father_number);
    formData.append('mother_name',this.state.mother_name); 
    formData.append('mother_age',this.state.mother_age);
    formData.append('mother_mobile',this.state.mother_number);
    formData.append('sibling_name',this.state.sibling_name);
    formData.append('sibling_age',this.state.sibling_age);
    formData.append('sibling_mobile',this.state.sibling_number);
    formData.append('designation',this.state.headDesignation);
    formData.append('department',this.state.ldepartment);
    formData.append('organizations',JSON.stringify(inst));
    formData.append('staff_photo',this.state.selectedFile);
    formData.append('father_photo',this.state.selectedFatherFile);
    formData.append('mother_photo',this.state.selectedMotherFile);
    formData.append('type', 2);
    new Service().apiCall('StaffDetails/insertStaff', formData,
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
                <h4 className="font-weight-bold mt-4">Staff Added Successfully!</h4>
              </div>
            </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify:false});
            this.props.history.push('/admin/view-staff')
          }, 2000)

        }else if(response.data === "exists"){

          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold mt-4">This Staff Data Already Exists With Us!</h4>
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

  setPostData = (name,value) => {    
    
    let allowNumberLimit = ["father_number", "mother_number","sibling_number"];
    let numberCheck = ["father_age", "mother_age","sibling_age"];
    let allowOnlyText = ["father_name", "mother_name", "sibling_name"];

    if (allowOnlyText.includes(name)){       
      this.setState({ [name]: value.replace(/[^A-Za-z\s]/ig, ''), formChanged:true });
    }else if(allowNumberLimit.includes(name)){
      if (this.verifyNumberLength(value, 11)){
        this.setState({ [name]: value, formChanged:true });
      }
    }else if(numberCheck.includes(name)){
      if (this.verifyNumber(value)){
        this.setState({ [name]: value, formChanged:true });
      }
    }

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
    console.log('invalid Email');
    return false;
  };

  handleChangeState = (name,value) => {
    let allowOnlyText = ["first_name", "middle_name", "last_name"];
    let allowNumberLimit = ["phone_no", "father_number", "mother_number","sibling_number", "father_phone_no", "mother_phone_no","guard_phone_no","primary_contact","primary_contact1"];
    let pinCheck = ["pincode","permanent_pincode","guard_pincode"];
    let numberCheck = ["passed_academic_year"];    
    let adhaarCheck = ["aadhaar_no"];

    if (allowOnlyText.includes(name)){
      if (this.verifyText(value)){
        this.setState({ [name]: value });
      }
    }
    else if(adhaarCheck.includes(name)){
      if (this.verifyNumberLength(value, 13)){
        this.setState({ [name]: value });
      }
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

  handleDepartmentChange= (type,name,status) => {
    if(type){  
      this.setState({departmentChecked:true,departmentName:name,ldepartment:type});	 
    }else{
      this.setState({ departmentChecked:false,departmentName:'',ldepartment:'' });
    } 
  }

  getRoleData(type) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type
    }
    new Service().apiCall('StaffDetails/getRoleData',postData).then(response => {
      console.log('designation'+response);
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ roleData: response.data });
        }
  
      }
    }).catch(error => {
      alert("error");  
    });
  
  } 

  getDepartmentData(type) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type
    }
    new Service().apiCall('StaffDetails/getDepartmentData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ departmentData: response.data });
        }
  
      }
    }).catch(error => {
      alert("error");  
    });  
  } 

  handleChangeStaffType = (value) => {
    this.getRoleData(value);
    this.getDepartmentData(value);
    this.setState({ staffType: value });
  };

  handleAddress = (status) => {
    if(status == false){
      this.setState({permanent_address1:this.state.address1,permanent_address2:this.state.address2, permanent_pincode:this.state.pincode,permanent_post_office: this.state.post_office,permanent_taluk:this.state.taluk,permanent_district:this.state.district,permanent_state:this.state.state,same_address:!status})
      
    }else{
      this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_taluk:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  handleWorkingHourFrom = (date) => {
    this.setState({ working_hour_from: date })
  };

  handleWorkingHourTo = (date) => {
    this.setState({ working_hour_till: date })
  };

  
  staffProfiling = () => {
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
            id="dob"
            className="m-2"
            label="Date of birth"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            inputProps={{ readOnly: true }}
            value={this.state.dateOfBirth}
            onChange={this.handleDateOfBirth}   
            disableFuture={true}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
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
          {this.renderEmailInput("email_id","Email")}
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Supporting Documents References
          </div>
         </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("birth_certificate","Birth Certificate No")}
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
        <Grid item xs={12} lg={12} className="py-1 text-right">
                 
        <Chip onClick={this.handleNext}
        avatar={<Avatar>{this.state.activeStep+2}</Avatar>}
        label={this.state.steps[this.state.activeStep+1]}
        clickable
        color="secondary"
        onDelete={this.handleNext}
        deleteIcon={<KeyboardArrowRight />}
        variant="outlined"
      />
        </Grid>
        </Grid>   
      </ExampleWrapperSimple>
      </Animated>
    )
  }

  educationSkills = () => {
    return (
      <Animated className="overflowVisible" animationIn="slideInRight" animationOut="slideOutLeft"> 
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={6} lg={12} className="p-20">
       
        {this.state.educationHolders.map((educationholder, idx) => (
           <Card className="card-box px-2 mb-2 mt-2 py-3">
                   <Grid container>
                   <Grid item xs={12} sm={12} md={3}>
                       <FormControl fullWidth>
                      
                        <TextField 
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id={"year_passout"+idx}       
                        value={educationholder.year_passout}
                        label="Passed out year" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                          this.handleEducationChange(idx,"year_passout",event.target.value.replace(/\s/g, ''))
                        }}}
                        inputRef={this.textInput} 
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
                        id={"board"+idx}  
                        value={educationholder.board}
                        label="Board/University" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => this.handleEducationChange(idx,"board",event.target.value)}
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
                        id={"degree"+idx}   
                        value={educationholder.degree}
                        label="Degree/Standard" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => this.handleEducationChange(idx,"degree",event.target.value)}
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
                        id={"grade"+idx}    
                        value={educationholder.grade}
                        label="Overall grade/marks" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => this.handleEducationChange(idx,"grade",event.target.value)}
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
                        id={"school"+idx}   
                        value={educationholder.school}
                        label="School/University Name" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => this.handleEducationChange(idx,"school",event.target.value)}
                        variant="outlined" />
                       </FormControl>
                       </Grid>
                       <Grid item xs={12} sm={12} md={7}>
                       <FormControl fullWidth>
                       <TextField 
                        inputProps={{
                          style: {textTransform: 'capitalize'},
                          autoComplete: 'off'
                        }}
                        id={"saddress"+idx}    
                        value={educationholder.school_address}
                        label="School/University Full address" 
                        type="search" 
                        className="m-2"
                        onChange={(event) => this.handleEducationChange(idx,"school_address",event.target.value)}
                        variant="outlined" />
                       </FormControl>
                       </Grid>
                      <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}}>
                      { idx === 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 
                       className="m-2"
                       id={"add-education"+idx}   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdEducationholder(); this.focusTextInput();
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off', 
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdEducationholder(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 
                       className="m-2"
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeEducationHolder(idx); 
                      }
                      }}
                      id={"remove-education"+idx}   
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Del" 
                      onClick={()=>{this.removeEducationHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                    </Grid>
 
           </Card>  

        ))}
    
      </Grid>
      <Grid item xs={12} sm={6} lg={12}>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
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
              id="award-year"   
              value={awardholder.award_academic_year}
              label="Academic Year" 
              type="search" 
              onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                this.handleAwardChange(idx,"award_academic_year",event.target.value.replace(/\s/g, ''))
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
              id="area-of-achievement"   
              value={awardholder.area_of_achievement}
              label="Area of achievement" 
              type="search" 
              onChange={(event) => this.handleAwardChange(idx,"area_of_achievement",event.target.value.replace(/\s/g, ''))}
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
              id="remarks"   
              value={awardholder.award_remarks}
              label="Remarks" 
              type="search" 
                onChange={(event) => this.handleAwardChange(idx,"award_remarks",event.target.value.replace(/\s/g, ''))}
              // onChange={(event) => { if (this.verifyNumber(event.target.value)) {
              // this.handleAwardChange(idx,"award_remarks",event.target.value.replace(/\s/g, ''))
              // }}}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={1}>
            {idx === 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
            <TextField 
            id={"award-add"+idx}    
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
            </FormControl></div>
            :
            <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
            <TextField 

            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.removeAwardHolder(idx); 
            }
            }}
            id={"remove-award"+idx}    
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
            </FormControl></div>
            }
            </Grid>  
           </Grid>
        </div>
      ))}  
      </Card>
      </Grid>

      <Grid item xs={12} sm={6} lg={12}>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Skills (if any)
          </div>
      </Grid>
      </Grid>
      {this.state.skillHolders.map((skillholders, idx) => (
        <div>
           <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id={"skill"+idx}    
              value={skillholders.skill}
              label="Special Skill" 
              type="search" 
              inputRef={this.textInput} 
              onChange={(event) => this.handleSkillChange(idx,"skill",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
           
            <Grid item xs={12} sm={6} lg={7}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id={"staff-remark"+idx}  
              value={skillholders.staff_remark}
              label="Remarks" 
              type="search" 

              onChange={(event) => this.handleSkillChange(idx,"staff_remark",event.target.value)}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={1}>
            { idx === 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 

                      id={"skill-add"+idx}   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdSkillholder(); this.focusTextInput();
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdSkillholder(); this.focusTextInput()}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeSkillHolder(idx); 
                      }
                      }}
                      id={"skill-remove"+idx}     
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Del" 
                      onClick={()=>{this.removeSkillHolder(idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
            </Grid>  
           </Grid>
        </div>
      ))}  
      </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={12}>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Additional Info (if any)
          </div>
      </Grid>
      <Grid item xs={12} sm={6} lg={12}>
      <Editor
          editorState={this.state.remarks}
          placeholder="Remarks"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Grid>
      </Grid>
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
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id={"workplace"+idx}     
                      value={workholder.place}
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
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id={"work-address"+idx}     
                      value={workholder.working_address}
                      label="Workplace full address" 
                      type="search" 
        
                      onChange={(event) => this.handleWorkChange(idx,"working_address",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                    <FormControl fullWidth>
                  
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                        margin="normal"
                        autoOk={true}
                        id={"workfrom"+idx}  
                        label="Working from"
                        inputVariant="outlined" 
                        format="MM/dd/yyyy"
                        inputProps={{ readOnly: true }}
                        value={workholder.working_from}
                        onChange={date => this.handleDateChange(idx, "working_from",date)} 
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
                        id={"worktill"+idx}  
                        label="Working till"
                        inputVariant="outlined"
                        format="MM/dd/yyyy"
                        inputProps={{ readOnly: true }}
                        value={workholder.working_till}
                        onChange={date => this.handleDateChange(idx, "working_till",date)} 
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
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id={"workposition"+idx}     
                      value={workholder.working_position}
                      label="Position held" 
                      type="search" 
                      className="mt-2"
                      onChange={(event) => this.handleWorkChange(idx,"working_position",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={11}>
                      <FormControl fullWidth>
                        <Editor
                          editorState={workholder.editorState}
                          placeholder="Duties and responsibilities"
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={(evt) => this.onEditorWorkChange(evt,idx)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}} >
                      { idx === 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField 

                      id={"work-add"+idx}     
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
                      id={"work-remove"+idx}     
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

  familyDetails = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>

      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Emergency contact
          </div>
      </Grid>
      </Grid> 
      <Grid container spacing={2}>

      <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id="father-name"   
                      value={this.state.father_name}
                      label="Father Name" 
                      inputRef={this.textInput} 
                      type="search" 
                      onChange={(event) => this.setPostData("father_name", event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="father-age"   
                      value={this.state.father_age}
                      label="Father Age" 
                      type="search" 
                      onChange={(event) => this.setPostData("father_age", event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="father-number"   
                      value={this.state.father_number}
                      label="Mobile Number" 
                      type="search" 
                      onChange={(event) => this.setPostData("father_number", event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id="mother-name"   
                      value={this.state.mother_name}
                      label="Mother Name" 
                      type="search" 
                      onChange={(event) => this.setPostData("mother_name",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="mother-age"   
                      value={this.state.mother_age}
                      label="Mother Age" 
                      type="search" 
                      onChange={(event) => this.setPostData("mother_age",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="mother-number"   
                      value={this.state.mother_number}
                      label="Mother number" 
                      type="search" 
                      onChange={(event) => this.setPostData("mother_number",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}
                      id="sibling-name"   
                      value={this.state.sibling_name}
                      label="Sibling name (anyone)" 
                      type="search" 
                      onChange={(event) => this.setPostData("sibling_name",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="sibling-age"   
                      value={this.state.sibling_age}
                      label="Sibling age" 
                      type="search" 
                      onChange={(event) => this.setPostData("sibling_age",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="sibling-number"   
                      value={this.state.sibling_number}
                      label="Mobile Number" 
                      type="search" 
                      onChange={(event) => this.setPostData("sibling_number",event.target.value)}
                      variant="outlined" />
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

  Configuration = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
            <Card className="card-box  mb-2 mt-2 py-3 px-3">    
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} className="margin-auto">
                        Staff Type
                    </Grid> 

                    <Grid item xs={12} sm={12} md={3} className="margin-auto">                      
                        <FormControlLabel
                        control={
                            <Radio
                            checked={this.state.staffType === "Teaching"}
                            onChange={() => this.handleChangeStaffType("Teaching")}
                            value="Teaching"
                            name="radio button enabled"
                            aria-label="A"/>
                        }                 
                        label="Teaching"
                        />
                    </Grid>
                
                    <Grid item xs={12} sm={12} md={3} className="margin-auto">
                                
                        <FormControlLabel
                        control={
                            <Radio
                            checked={this.state.staffType === "NonTeaching"}
                            onChange={() => this.handleChangeStaffType("NonTeaching")}
                            value="NonTeaching"
                            name="radio button enabled"
                            aria-label="A"/>
                        }                     
                        label="Non Teaching"
                        />
                        
                    </Grid>
                </Grid>  
            </Card>

          {this.state.staffType === "Teaching" && 
            <div>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <Grid container spacing={2} justify="center" className="align-center">
                  <Grid item xs={12} sm={12} lg={6} className="text-center">
                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                    Select Role
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <TextField
                      className="m-2"
                      id="roles-list"
                      select
                      label="Select Role"
                      value={this.state.selectedRoleId}
                      onChange={(event,child) => this.setState({selectedRoleId : event.target.value})}
                      helperText="Please select Staff role"
                      variant="outlined">
                      {this.state.roles.map(option => (
                      <MenuItem key={option.id} value={option.id} id={option.id}>
                      {option.name}
                    </MenuItem>
                      ))}
                    </TextField>
                  </Grid>  
                </Grid>  
              </Card> 
              
              <Card className="card-box  mb-2 mt-2 py-3 px-3">    
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} className="margin-auto">
                    Recruited as head teacher?
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="margin-auto">                  
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.headTeaching === "Yes"}
                        onChange={() => this.handleChangeHeadTeaching("Yes")}
                          value="Teaching"
                          name="radio button enabled"
                          aria-label="A"/>
                      }                    
                      label="Yes"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="margin-auto">                    
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.headTeaching === "No"}
                          onChange={() => this.handleChangeHeadTeaching("No")}
                          value="NonTeaching"
                          name="radio button enabled"
                          aria-label="A"/>
                      }                    
                      label="No"
                    />
                  </Grid>
                </Grid>  
              </Card> 

              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} className="margin-auto">Working hours?</Grid>
                    <Grid item xs={12} sm={12} md={3} className="margin-auto">                  
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.workingHours === "full_time"}
                            onChange={() => this.handleChangeWorkingHours("full_time")}
                            value="Teaching"
                            name="radio button enabled"
                            aria-label="A"/>
                        }         
                        label="Full Time"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} className="margin-auto">                    
                      <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.workingHours === "part_time"}
                          onClick={() => {this.handleChangeWorkingHours("part_time"); this.setState({workingHoursPanel:true})}}
                            value="NonTeaching"
                            name="radio button enabled"
                            aria-label="A"/>
                        }                 
                        label="Part Time"
                      />
                    </Grid>
                  </Grid> 
              </Card>   

              <Card className="card-box  mb-2 mt-2 py-3 px-3">  
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={12}>
                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                        Select Designation
                    </div>
                  </Grid>
                </Grid> 

                <Grid container spacing={2}>
                  {this.state.roleData.map((element,idx)=>(
                    <Grid item xs={12} sm={12} md={3} style={{marginTop:'auto'}}>         
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.headDesignation === element.id}                            
                            onChange={() => this.handleChangeDesignation(element.id)}
                            value={element.name}
                            name="radio button enabled"
                            aria-label="A"/>
                        }
                        label={element.name}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Grid container>
                  <Grid item xs={12} sm={12} md={12} style={{textAlign:'right', marginTop:20}}>
                    <Chip onClick={()=> this.setState({createDesignationPanel:true})} variant="outlined"  label="Not found the designation? Click here to create new designation" color="primary" size="small" />
                  </Grid>
                </Grid>
              </Card> 

              <Card className="card-box  mb-2 mt-2 py-3 px-3">  
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={12}>
                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                    Select Department
                    </div>
                  </Grid>
                </Grid> 

                <Grid container spacing={2}>
                  {this.state.departmentData.map((element,idx)=>(
                    <Grid item xs={12} sm={12} md={3} style={{marginTop:'auto'}}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={(element.id==this.state.ldepartment)?this.state.departmentChecked:false}
                                onClick={() => {this.handleDepartmentChange(element.id,element.name,this.state.departmentChecked)}}/>
                        }        
                        label={element.name}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Grid container>
                  <Grid item xs={12} sm={12} md={12} className="text-right">
                    <Chip onClick={()=> this.setState({createDepartmentPanel:true})} variant="outlined"  label="Not found the department? Click here to create new department" color="primary" size="small" />
                  </Grid>
                </Grid>
              </Card>     
            </div>
          }

      {this.state.staffType == "NonTeaching" && <div>
      <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2} justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={6} className="text-center">
        <div className="card-header--title font-size-md font-weight-bold ml-2">
        Select Role
        </div>
        </Grid>
            <Grid item xs={12} sm={6} lg={6}>
            <TextField
                    className="m-2"
                    id="roles-list"
                    select
                    label="Select Role"
                    value={this.state.selectedRoleId}
                    onChange={(event,child) => this.setState({selectedRoleId : event.target.value})}
                    helperText="Please select Staff role"
                    variant="outlined">
                    {this.state.roles.map(option => (
                     <MenuItem key={option.id} value={option.id} id={option.id}>
                     {option.name}
                   </MenuItem>
                    ))}
                  </TextField>
            </Grid>  
        </Grid>  
    </Card>  
      <Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Select Designation
          </div>
      </Grid>
      </Grid> 
      <Grid container spacing={2}>
      {this.state.roleData.map((element,idx)=>(
                      <Grid item xs={12} sm={12} md={3} style={{marginTop:'auto'}}>         
      <FormControlLabel
                  control={
                    <Radio
                      checked={this.state.headDesignation === element.id}
                      onChange={() => this.handleChangeDesignation(element.id)}
                      value={element.name}
                      name="radio button enabled"
                      aria-label="A"
                     
                    />
                  }
               
                  label={element.name}
                />
         
                      </Grid>
                  ))}
                 
      </Grid>
      <Grid container>
                        <Grid item xs={12} sm={12} md={12} style={{textAlign:'right', marginTop:20}}>
                        <Chip onClick={()=> this.setState({createDesignationPanel:true})} variant="outlined"  label="Not found the role? Click here to create new designation" color="primary" size="small" />
                        </Grid>
                      </Grid>
      </Card> 
<Card className="card-box  mb-2 mt-2 py-3 px-3">  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <div className="card-header--title font-size-md font-weight-bold ml-2">
          Select Department
          </div>
      </Grid>
      </Grid> 
      <Grid container spacing={2}>

      {this.state.departmentData.map((element,idx)=>(
                            <Grid item xs={12} sm={12} md={3} style={{marginTop:'auto'}}>
                        
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={(element.id==this.state.ldepartment)?this.state.departmentChecked:false}
                                onClick={() => {this.handleDepartmentChange(element.id,element.name,this.state.departmentChecked)}}
                           
                          />
                        }
                      
                        label={element.name}
                      />
                      
                   
                            </Grid>
                        ))}
      </Grid>
      <Grid container>
                        <Grid item xs={12} sm={12} md={12} className="text-right">
                        <Chip onClick={()=> this.setState({createDepartmentPanel:true})} variant="outlined"  label="Not found the department? Click here to create new department" color="primary" size="small" />
                        </Grid>
                      </Grid>
      </Card>     
      </div>}
  
     

           
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={3}>
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                Select Board:
                </div>
            </Grid>
        </Grid>
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
        <div className="font-weight-400 text-center display-5">Staff Photo</div>
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
        {AuthHelper('Staff Demography','can_create') &&  <Button  onClick={()=>this.handleStaff()}
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
        return this.staffProfiling();
      case 1:
        return this.educationSkills();
      case 2:
        return this.workExperience();
      case 3:
        return this.familyDetails();
      case 4:
        return this.Configuration();
      case 5:
        return this.attachments();  
      default:
        return this.staffProfiling();
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
      if(this.validateForm('Profile') == true){
        this.setState({activeStep:step});
      }else{
          return false;
      }
    }else if(step == 4){
      if(this.validateForm('Profile') == true && this.validateForm('Family') == true){
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
    }else if(this.state.activeStep == 3){
        if(this.validateForm('Profile') == true && this.validateForm('Family') == true){
          this.setState({activeStep: this.state.activeStep + 1});
          this.props.title(this.state.steps[this.state.activeStep + 1]);
        }else{
            return false;
        }        
    }else if(this.state.activeStep == 4){
      if(this.validateForm('Profile') == true && this.validateForm('Family') == true && this.validateForm('Configuration') == true){
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
  //this.handlePartTimeDays(idx, "from_time", event.target.value,'monday')}

  handlePartTimeDays(index, name, datevlaue, day){
    if(day == 'monday'){
      let timer_monday = this.state.monday;
      timer_monday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_monday });
    }
    if(day == 'tuesday'){
      let timer_tuesday = this.state.tuesday;
      timer_tuesday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_tuesday });
    }
    if(day == 'wednesday'){
      let timer_wednesday = this.state.wednesday; 
      timer_wednesday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_wednesday });
    }
    if(day == 'thursday'){
      let timer_thursday = this.state.thursday;
      timer_thursday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_thursday });
    }
    if(day == 'friday'){
      let timer_friday = this.state.friday;
      timer_friday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_friday });
    }
    if(day == 'saturday'){
      let timer_saturday = this.state.saturday;
      timer_saturday[index][name] = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
      this.setState({ timer_saturday });
    }
    
  };

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

    
  handleDateChange(index, name, datevlaue){
    let timer = this.state.workHolders;
    timer[index][name] = moment(datevlaue).format("YYYY-MM-DD");
    this.setState({ timer });
  };

    handCustomersdWorkholder = (c) => {
      let lworkHolders = this.state.workHolders;
      let lWorks = {};
      lWorks.place='';
      lWorks.working_address='';
      lWorks.working_from=moment(new Date()).format("YYYY-MM-DD");
      lWorks.working_till=moment(new Date()).format("YYYY-MM-DD");
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
    console.log(this.props.data)
   this.getAllBoardDetails();
   this.getRolesList();
   this.getFeecategories();
   this.getStandardSectionDetails();
   this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = (window.innerWidth) * (50/100)+"px";
  const width30 = (window.innerWidth) * (30/100)+"px";
 
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
open={this.state.workingHoursPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({workingHoursPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({workingHoursPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Working hours
        </Typography>
      </Toolbar>
    </AppBar>
    <Card className="card-box  m-3 py-3 px-3">
      <Grid container spacing={2} justify="center" className="mt-1">
        <Grid item xs={12} sm={12} md={6} className="pickerGrid">
          <FormControl fullWidth>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
              margin="normal"
              autoOk={true}
              id="from-date"
              label="From Date"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              inputProps={{ readOnly: true }}
              value={this.state.working_hour_from}
              onChange={this.handleWorkingHourFrom}   
              KeyboardButtonProps={{
              'aria-label': 'change date', 
              }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={6} className=" pickerGrid">
          <FormControl fullWidth>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                autoOk={true}
                id="to-date"
                label="To Date"
                inputVariant="outlined"
                format="MM/dd/yyyy"
                inputProps={{ readOnly: true }}
                value={this.state.working_hour_till}
                onChange={this.handleWorkingHourTo}   
                KeyboardButtonProps={{
                'aria-label': 'change date', 
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
      </Grid>
    </Card>

    <Card className="card-box m-3 py-3 px-3">
      <Grid container spacing={2} justify="center" className="mt-1">
        <Grid item xs={12} sm={12} md={12} className="pickerGrid">
          {this.state.monday.map((element,idx)=>(
            <Grid container className="mb-3">
              <Grid item xs={12} sm={10} md={1} className="margin-auto">
                {idx+1}
              </Grid>
              <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                {element.dayname}
              </Grid>
              <Grid item xs={12} sm={10} md={3}>
                <TextField
                  id="time"
                  label="From time"
                  type="time"
                  variant="outlined"
                  defaultValue="09:30"
                  inputProps={{ readOnly: true }}
                  onChange={(event) => this.handlePartTimeDays(idx, "from_time", event.target.value,'monday')}
                  //onChange={date => this.handleTimeChange(index, "from_time",date)} 
                  InputLabelProps={{
                  shrink: true,
                  }} 
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
              
              <Grid xs={12} sm={10} md={3}>
                <TextField
                  id="to-time"
                  label="To time"
                  type="time"
                  variant="outlined"
                  defaultValue="09:30"
                  inputProps={{ readOnly: true }}
                  onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'monday')}
                  InputLabelProps={{
                    shrink: true,
                  }} 
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>

              <Grid xs={12} sm={10} md={2} className="text-center" >
                {idx === 0 ?   
                  <div  className="addHolderStyle">
                    <FormControl fullWidth >
                      <TextField 
                        id={"monday"+idx}   
                        onKeyPress={(data) => {
                          if (data.charCode === 13) {
                            this.handCustomersdParttimeHolder('monday'); 
                          }
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          readOnly: true,
                          startAdornment: (
                          <InputAdornment position="start">
                            <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                        }}
                        label="Add" 
                        onClick={()=>{this.handCustomersdParttimeHolder('monday');}}
                        variant="outlined" 
                      />
                    </FormControl>
                  </div>
                :
                  <div className="removeHolderStyle"> 
                    <FormControl fullWidth>
                      <TextField 
                        onKeyPress={(data) => {
                          if (data.charCode === 13) {
                            this.removeMondayHolder('monday',idx); 
                          }
                        }}
                        id={"monday"+idx}  
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
                        onClick={()=>{this.removeMondayHolder('monday',idx);}}
                        variant="outlined" 
                      />
                    </FormControl>
                  </div>
                }
              </Grid>
            </Grid>
          ))}
    </Grid>
    </Grid>
    </Card>  

    <Card className="card-box m-3 py-3 px-3">
    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} md={12} className="pickerGrid">
    {this.state.tuesday.map((element,idx)=>(
                    <Grid container className="mb-3">
                       <Grid item xs={12} sm={10} md={1} className="margin-auto">
                      {idx+1}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                      {element.dayname}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}>
                    <TextField
                    id={"from-time"+idx}
                    label="From time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}            
                    onChange={(event) => this.handlePartTimeDays(idx,"from_time",event.target.value,'tuesday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={3}>
                    <TextField
                      id={"to-time"+idx}
                    label="To time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}                 
                    onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'tuesday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={2} className="text-center" >
                      {idx === 0 ?   <div  className="addHolderStyle"><FormControl fullWidth >
                      <TextField 

                      id={"tuesday"+idx}   
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdParttimeHolder('tuesday'); 
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdParttimeHolder('tuesday');}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeMondayHolder('tuesday',idx); 
                      }
                      }}
                      id={"tuesday-remove"+idx}   
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
                      onClick={()=>{this.removeMondayHolder('tuesday',idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                  </Grid>
                 ))}
    </Grid>
    </Grid>
    </Card> 

    <Card className="card-box  m-3 py-3 px-3">
    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} md={12} className="pickerGrid">
    {this.state.wednesday.map((element,idx)=>(
                    <Grid container className="mb-3" >
                       <Grid item xs={12} sm={10} md={1} className="margin-auto">
                      {idx+1}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                      {element.dayname}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}>
                    <TextField
                    id={"from-time"+idx} 
                    label="From time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}            
                    onChange={(event) => this.handlePartTimeDays(idx,"from_time",event.target.value,'wednesday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={3}>
                    <TextField
                    id={"to-time"+idx} 
                    label="To time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}                 
                    onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'wednesday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={2} className="text-center" >
                      {idx === 0 ?   <div  className="addHolderStyle"><FormControl fullWidth >
                      <TextField 

                      id={"wednesday"+idx}    
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdParttimeHolder('wednesday'); 
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdParttimeHolder('wednesday');}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeMondayHolder('wednesday',idx); 
                      }
                      }}
                      id={"wednesday-remove"+idx}     
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
                      onClick={()=>{this.removeMondayHolder('wednesday',idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                  </Grid>
                 ))}
    </Grid>
    </Grid>
    </Card> 

    <Card className="card-box  m-3 py-3 px-3">
    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} md={12} className="pickerGrid">
    {this.state.thursday.map((element,idx)=>(
                    <Grid container className="mb-3" >
                       <Grid item xs={12} sm={10} md={1} className="margin-auto">
                      {idx+1}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                      {element.dayname}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}>
                    <TextField
                    id={"from-time"+idx}    
                    label="From time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}            
                    onChange={(event) => this.handlePartTimeDays(idx,"from_time",event.target.value,'thursday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={3}>
                    <TextField
                    id={"to-time"+idx}    
                    label="To time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}                 
                    onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'thursday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={2} className="text-center" >
                      {idx === 0 ?   <div  className="addHolderStyle"><FormControl fullWidth >
                      <TextField 

                      id={"thursday-add"+idx}      
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdParttimeHolder('thursday'); 
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdParttimeHolder('thursday');}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeMondayHolder('thursday',idx); 
                      }
                      }}
                      id={"thursday-remove"+idx}      
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
                      onClick={()=>{this.removeMondayHolder('thursday',idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                  </Grid>
                 ))}
    </Grid>
    </Grid>
    </Card> 

    <Card className="card-box  m-3 py-3 px-3">
    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} md={12} className="pickerGrid">
    {this.state.friday.map((element,idx)=>(
                    <Grid container className="mb-3" >
                       <Grid item xs={12} sm={10} md={1} className="margin-auto">
                      {idx+1}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                      {element.dayname}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}>
                    <TextField
                    id={"from-time"+idx}    
                    label="From time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}            
                    onChange={(event) => this.handlePartTimeDays(idx,"from_time",event.target.value,'friday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={3}>
                    <TextField
                    id={"to-time"+idx}    
                    label="To time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}                 
                    onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'friday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={2} className="text-center" >
                      {idx === 0 ?   <div  className="addHolderStyle"><FormControl fullWidth >
                      <TextField 
                      id={"friday-add"+idx}      
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdParttimeHolder('friday'); 
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdParttimeHolder('friday');}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeMondayHolder('friday',idx); 
                      }
                      }}
                      id={"friday-remove"+idx}      
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
                      onClick={()=>{this.removeMondayHolder('friday',idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                  </Grid>
                 ))}
    </Grid>
    </Grid>
    </Card> 

    <Card className="card-box  m-3 py-3 px-3">
    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} md={12} className="pickerGrid">
    {this.state.saturday.map((element,idx)=>(
                    <Grid container className="mb-3" >
                       <Grid item xs={12} sm={10} md={1} className="margin-auto">
                      {idx+1}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}  className="margin-auto">
                      {element.dayname}
                    </Grid>
                    <Grid item xs={12} sm={10} md={3}>
                    <TextField
                    id={"from-time"+idx}    
                    label="From time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}            
                    onChange={(event) => this.handlePartTimeDays(idx,"from_time",event.target.value,'saturday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={3}>
                    <TextField
                    id={"to-time"+idx}    
                    label="To time"
                    type="time"
                    variant="outlined"
                    defaultValue="09:30"
                    inputProps={{ readOnly: true }}                 
                    onChange={(event) => this.handlePartTimeDays(idx,"to_time",event.target.value,'saturday')}
                    InputLabelProps={{
                    shrink: true,
                    }} 
                    inputProps={{
                    step: 300, // 5 min
                    }}
                    />
                    </Grid>
                    <Grid xs={12} sm={10} md={2} className="text-center" >
                      {idx === 0 ?   <div  className="addHolderStyle"><FormControl fullWidth >
                      <TextField 

                      id={"saturday-add"+idx}      
                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.handCustomersdParttimeHolder('saturday'); 
                      }
                      }}
                      InputProps={{
                      autoComplete: 'off',
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position="start">
                      <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                      </InputAdornment>
                      ),
                      }}
                      label="Add" 
                      onClick={()=>{this.handCustomersdParttimeHolder('saturday');}}
                      variant="outlined" />
                      </FormControl></div>
                      :
                      <div className="removeHolderStyle"> <FormControl fullWidth>
                      <TextField 

                      onKeyPress={(data) => {
                      if (data.charCode === 13) {
                      this.removeMondayHolder('saturday',idx); 
                      }
                      }}
                      id={"saturday-remove"+idx}       
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
                      onClick={()=>{this.removeMondayHolder('saturday',idx);}}
                      variant="outlined" />
                      </FormControl></div>
                      }
                      </Grid>
                  </Grid>
                 ))}
    </Grid>
    </Grid>
    </Card> 
    </PerfectScrollbar>
    </Box>
    </Drawer>

    <Drawer

anchor="right"
open={this.state.createDesignationPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({createDesignationPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({createDesignationPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Create Role
        </Typography>
      </Toolbar>
    </AppBar>
    <Card className="card-box  m-3 py-3 px-3">
    <Grid container>
      <Grid item xs={12} sm={10} md={12}>
      <FormControl fullWidth>
    <TextField 
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]",
           style: {textTransform: 'capitalize'}
          }}
          id={"designation"}      
          value={this.state.lroles}
          label="Use comma to insert multiple designation" 
          type="search" 
          onChange={(event) => this.setRole("lroles", event.target.value)}
          className="m-2"
          inputRef={this.textInput} 
          variant="outlined" 
       />   
       </FormControl>
       </Grid></Grid>             
    </Card>
    <Grid container>
                      <Grid item xs={12} sm={10} md={12}  className="text-right px-3">
                        <Button className="successBtnOutline" onClick={()=>{this.updateRole()}}>Submit</Button>
                      </Grid>
                    </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>  

    <Drawer

anchor="right"
open={this.state.createDepartmentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({createDepartmentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({createDepartmentPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Create Department
        </Typography>
      </Toolbar>
    </AppBar>
    <Card className="card-box  m-3 py-3 px-3">
    <Grid container>
      <Grid item xs={12} sm={10} md={12}>
      <FormControl fullWidth>
    <TextField 
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id="department"   
          value={this.state.newDepartment}
          label="Use comma to insert multiple designation" 
          type="search" 
          onChange={(event) => this.setDepartment("newDepartment", event.target.value)}
          className="m-2"
          inputRef={this.textInput} 
          variant="outlined" 
       />   
       </FormControl>
       </Grid></Grid>             
    </Card>
    <Grid container>
                      <Grid item xs={12} sm={10} md={12} className="text-right px-3">
                        <Button className="successBtnOutline" onClick={()=>{this.updateDepartment()}}>Submit</Button>
                      </Grid>
                    </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>  

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

export default connect(mapStateToProps, mapDispatchToPros)(StaffDashboard);