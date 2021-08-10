import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Chip,Typography,AppBar,Divider,Card,CardContent,Box,TextField,Button,Avatar,Toolbar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      editStudent:false,
      showStatus:'all',
      loading:false,
      firstname:"",
      previous_id:"",
      middlename:"",
      lastname:"",
      gender:"",
      student_AID:'',
      alumni_id:'',
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
      individualAcademics:[{passout_year:'',passout_board:'',passout_standard:'',passout_institute:''}],
      academicHolders:[{passout_year:'',passout_board:'',passout_standard:'',passout_institute:''}],
      individualProfession:[{prof_organization:'',prof_working:new Date(),prof_working_till:new Date(),prof_position_held:''}],
      professionHolders:[{prof_organization:'',prof_working:new Date(),prof_working_till:new Date(),prof_position_held:''}],
      individualAttachments:[{alumni_photo:""}],      
      GenderMaster:["Male","Female","Other"],
      BloodGroupMaster:["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      NationalityMaster:["Indian"],
      individualAllData:[],
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
      father_middle_name:"",
      father_last_name:"",
      father_phone_no:"",
      father_email_id:"",
      father_linkedin_id:"",
      father_facebook_id:"",
      mother_name:"",
      mother_middle_name:"",
      mother_last_name:"",
      mother_phone_no:"",
      mother_email_id:"",
      mother_linkedin_id:"",
      mother_facebook_id:"",
      guard_name:"",
      guard_middle_name:"",
      guard_last_name:"",
      guard_phone_no:"",
      guard_email_id:"",
      guard_linkedin_id:"",
      guard_facebook_id:"",
      guard_address_line1:"",
      guard_address_line2:"",
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
      passed_name:'',
      passed_address:'',
      passed_academic_year:'',
      passed_board:'',
      passed_standard:'',
      passed_grade:'',
      fee_board:'',
      fee_category:'',
      fee_standard:'',
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
      pincodesArr:[],
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
      basicNotify:false,
      searchStudent:false,
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
  selectJoiningStandard = (value,id) => {
    this.setState({joiningStandard:value, fee_standard:id});
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

  fillAddress = (po,taluk,district,state,event) => {
    event.preventDefault();
    if(this.state.addressType == "pincode"){
      this.setState({post_office:po,taluk:taluk,district:district,state:state, selectPOPanel:false});
    }
    else{
      this.setState({permanent_post_office:po,permanent_taluk:taluk,permanent_district:district,permanent_state:state, selectPOPanel:false});
    }
  }

  handleAcademicData = (pIndex,inputName,pValue) => {
    let lAcademicHolders = this.state.academicHolders;
    lAcademicHolders[pIndex][inputName] = pValue;
    this.setState({academicHolders:lAcademicHolders});
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


  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          disabled={this.state.editStudent?false:true}
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id="document-type"   
          value={this.state[name]}
          label={label} 
          type="search" 
          onChange={(event) => this.handleChangeState(name,event.target.value)}
          className="m-2"
          inputRef={this.textInput} 
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
    console.log(pIndex);
    let lAwardHolders = this.state.awardHolders;
    lAwardHolders[pIndex][inputName] = pValue;
    this.setState({awardHolders:lAwardHolders});
  }

  verifyNumber = value => {
    if(value){
      var numberRex = new RegExp("^[0-9]+$");
      if (numberRex.test(value)) {
        return true;
      }
      return false;
    }
   
  };
  verifyInput = value => {
    var numberRex = new RegExp("^[A-Za-z]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  handleFeeCategory= (id,name,status) => {
  
      this.setState({ fee_category:id,categoryName:name });
      
  }

  replaceText = (str) => {
    let string = str.replace(" B.O","");
    string = string.replace(" S.O","");
    return string;
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

  handleBoard= (id,name,status) => {
      this.setState({ fee_board:id,selectedFeeBoard:name });
  }

  handleUpdate(id,order){
    
    let formData = new FormData();
    formData.append('id',id);
    formData.append('AID',this.state.student_AID);
    formData.append('order',order);
    formData.append('individualAcademics',JSON.stringify(this.state.academicHolders));
    formData.append('individualProfession',JSON.stringify(this.state.professionHolders));
    formData.append('id_organization',this.state.selectedOrganizationId);
    formData.append('id_institute',this.state.selectedInstitutionId);  
    formData.append('name',this.state.firstname);
    formData.append('middlename',this.state.middlename);
    formData.append('lastname',this.state.lastname);
    formData.append('year_pass_out',this.state.yearpassout);
    formData.append('gender',this.state.gender?this.state.gender:this.state.individualData.gender);
    formData.append('blood_group',this.state.bloodgroup);
    formData.append('dateOfBirth',moment(this.state.dateOfBirth).format("YYYY-MM-DD"));
    formData.append('phone_no',this.state.phone_no);
    formData.append('email_id',this.state.email);
    formData.append('linkedin_id',this.state.linkedin_id);
    formData.append('facebook_id',this.state.facebook_id);
    formData.append('address1',this.state.address_line1);
    formData.append('address2',this.state.address_line2);
    formData.append('post_office',this.state.post_office);
    formData.append('pincode',this.state.pincode);
    formData.append('taluk',this.state.taluk);
    formData.append('district',this.state.district);
    formData.append('state',this.state.state);
    formData.append('permanent_address1',this.state.permanent_address1);
    formData.append('permanent_address2',this.state.permanent_address2);
    formData.append('permanent_pincode',this.state.permanent_pincode);
    formData.append('permanent_post_office',this.state.permanent_post_office);
    formData.append('permanent_taluk',this.state.permanent_city);
    formData.append('permanent_district',this.state.permanent_district);
    formData.append('permanent_state',this.state.permanent_state);
    formData.append('attachment_id',this.state.attachment_id);
    formData.append('alumni_photo',this.state.selectedFile);
    new Service().apiCall('Alumnus/updateAlumni', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      console.log(response);
      if (response.status==200) { 
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
              <h4 className="font-weight-bold mt-4">Student Updated Successfully!</h4>

            </div>
          </Dialog>
          ),
        });
        setTimeout(() => {
           this.setState({ basicNotify:null, editStudent:false, formChanged:false});
          //  this.props.history.push({
          // pathname: '/admin/student'})
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");
    });

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
  }else if(name=='guardian'){
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
    }
  };

  handleSiblingData = (pIndex,inputName,pValue) => {
    let lSiblingHolders = this.state.individualSiblings;
    lSiblingHolders[pIndex][inputName] = pValue;
    this.setState({individualSiblings:lSiblingHolders});
  }

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
        console.log(newArr);
        this.setState({pincodesArr:newArr, selectPOPanel:true, addressType:type})
        }
        else{
          this.setState({pincodesArr:[]})
        }
      }
    }).catch(error => {
      alert("error");
  
    });
  }
  }

  handleChangeState = (name,value) => {
    let allowOnlyText = ["firstname", "middlename", "lastname"];
    let allowNumberLimit = ["phone_no"];
    let pinCheck = ["pincode","permanent_pincode","guard_pincode"];
    let numberCheck = ["passed_academic_year"];
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
      this.getAddressInfo(value,"pincode");
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

  studentProfiling = () => {
    return(
      <div className="w-100">
           {this.state.individualAllData.map((element,idx)=>(
             <div>
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
          {this.renderTextInput("yearpassout","Year of passed out")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
        <FormControl fullWidth>
            <TextField                        
              id="outlined-select-currency"
              select
              label="Select Gender"
              variant="outlined"
              className="m-2"
              disabled={this.state.editStudent?false:true}
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
              disabled={this.state.editStudent?false:true}
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
          inputVariant="outlined"
          format="MM/dd/yyyy"
          disabled={this.state.editStudent?false:true}
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
          {this.renderTextInput("email","Email")}
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
          {this.renderTextInput("permanent_state","State")}
        </Grid>
      </Grid> 
      <Grid container spacing={2} className="mt-2">
             
        <Grid item xs={12} lg={12} className="py-1 text-right">
        { !this.state.editStudent &&   <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStudent:true})} color="primary">
                     Edit
        </Button>}
    { this.state.editStudent  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStudent:false})}>Cancel</Button>

          <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}}  onClick={()=>this.handleUpdate(element.id,'1')}>
                     Submit
          </Button>
          </div>}
        </Grid>
        </Grid>  
        </div> 
           ))}
    </div>                  
    )
  }

  AcademicProfiling = () => {
    return(
      <div className="w-100">
        <Card className="card-box  mb-2 mt-2 py-3 px-3">  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
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
                  disabled={this.state.editStudent?false:true}
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
                    autoComplete: 'off'
                    }}
                    id="document-type"   
                    value={academic.passout_board}
                    label="Board/University" 
                    type="search" 
                    disabled={this.state.editStudent?false:true}
                    onChange={(event) => this.handleAcademicData(idx,"passout_board",event.target.value)}
                    variant="outlined" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={2}>
                <FormControl fullWidth>
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}
                    id="document-type"   
                    value={academic.passout_standard}
                    label="Degree/Standard" 
                    type="search" 
                    disabled={this.state.editStudent?false:true}
                    onChange={(event) => this.handleAcademicData(idx,"passout_standard",event.target.value)}
                    variant="outlined" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={4}> 
                <FormControl fullWidth>
                  <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}
                    id="document-type"   
                    value={academic.passout_institute}
                    label="Institue" 
                    type="search" 
                    disabled={this.state.editStudent?false:true}
                    onChange={(event) => this.handleAcademicData(idx,"passout_institute",event.target.value)}
                    variant="outlined" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}}>
                { idx === 0 ?   
                  <div  className="addHolderStyle inputMargin">
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
                            <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                        }}
                        label="Add" 
                        onClick={()=>{this.handleAddAcademicholder(); this.focusTextInput()}}
                        variant="outlined" 
                      />
                    </FormControl>
                  </div>
                  :
                  <div className="removeHolderStyle inputMargin"> 
                    <FormControl fullWidth>
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
                    </FormControl>
                  </div>
                }
              </Grid>
            </Grid>
          ))}  
        </Card>

        <Grid container spacing={2} className="mt-2">             
          <Grid item xs={12} lg={12} className="py-1 text-right">

            {!this.state.editStudent && <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStudent:true})} color="primary">Edit</Button>}

            {this.state.editStudent  && 
              <div> 
                <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStudent:false})}>Cancel</Button>

                <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.alumni_id,'2')}>Submit</Button>
              </div>
            }
          </Grid>
        </Grid>    
    </div>
    )
  }

  attachments = () => {  
    return(
      <div className="w-100">
        <Grid container spacing={4}>
          <Grid item xs={12} lg={3}>
            <Card className="card-box  mb-2 mt-2 py-3 px-3">
              <div className="font-weight-400 text-center display-5">Student Photo</div>
              <Divider className="my-2" />
              <FormControl fullWidth>
                <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                  <div className={"img-circle"}>
                    <img className="w-100" src={this.state.imagePreviewUrl} />
                  </div>

                  <div>      
                    {this.state.selectedFile =="" ? 
                      this.state.editStudent &&   
                        <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>Add</Button>
                      : 
                      <span>
                        {this.state.editStudent &&  
                          <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>Change</Button>}
                      </span>
                    }
                  </div>
                </div>
              </FormControl> 
            </Card>
          </Grid>
        </Grid>
   
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={12} lg={12} className="py-1 text-right">
            { !this.state.editStudent &&   
              <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStudent:true})} color="primary">Edit</Button>
            }

            { this.state.editStudent  && 
              <div> 
                <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStudent:false})}>Cancel</Button>
     
                <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.alumni_id,'3')}>Submit</Button>
              </div>
            }
          </Grid>
        </Grid> 
      </div>
    )
  }

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

    handleChangeAccordion = (value) => {
      if(this.state.activeAccordion == value){
        this.setState({activeAccordion:"", editStudent:false});
      }
      else{
        this.setState({activeAccordion:value, editStudent:false});
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
        alert("error.response.data.message");
      });
    }

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
      alert("error");
  
    });
  }

  handleOptionalSubject = (type,status)=>{
    if(type){  
      this.setState({selectedOptionalSubject:true,selectedOptionalSubjectIds:type});	 
      }
      else{
      this.setState({ selectedOptionalSubject:false,selectedOptionalSubjectIds:'' });
      } 
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
           lStandardSections.forEach((element,index )=> {
            data.push({id:element.standard_id,value:element.standard_name+" "+element.stream_name+" "+element.section_name});
        });
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      alert(error);

    });

  }

  getCategoryDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_academicyear:this.state.selectedAcademicYear,
      id_board:this.state.selectedBoard,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('categories/getData',postData).then(response => {
    
        if (response.status==200 && response.data!='') {
          console.log(response.data);
          this.setState({categoryData:response.data});
        }else{
          this.setState({categoryData:[]});
        }
      }).catch(error => {
       console.log(error);
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

  getStudentInfo() {
    const UID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    console.log("UID"+UID)
    const postData = {
      AID:UID,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    }
    new Service().apiCall('Alumnus/getDataWithId',postData).then(response => {
      console.log(response.data);
      if (response.status==200 && response.data!='') { 
        // if(response.data['feeconfig'].fee_standard){
        //   this.state.textSuggestions.map((element)=>{
        //     if(element.id == response.data['feeconfig'].fee_standard){
        //       this.setState({joiningStandard:element.value,fee_standard:response.data['feeconfig'].fee_standard})
        //     }
        //   })
        // }

        this.setState({alumni_id : response.data['personal'][0].id, student_AID:response.data.profile.AID, individualAllData:response.data.personal, individualAcademics:response.data['academics'], academicHolders:response.data['academics'], individualProfession:response.data['profession'], professionHolders:response.data['profession'],individualData: response.data['profile'],attachment_id:response.data['attachment'].length > 0 ?response.data['attachment'][0].id:'',individualAttachments:response.data['attachment'].length > 0 ? response.data['attachment'] : [{alumni_photo:""}],imagePreviewUrl:response.data['attachment'][0] && response.data['attachment'][0].alumni_photo!=''?Config.path+'writable/uploads/alumin/'+response.data['attachment'][0].alumni_photo:this.state.defaultDisplayImage, student_AID:response.data['personal'][0].AID, firstname:response.data['personal'][0].name, middlename:response.data['personal'][0].middle_name, lastname:response.data['personal'][0].last_name, yearpassout:response.data['personal'][0].year_passout, gender:response.data['personal'][0].gender, dateOfBirth:response.data['personal'][0].date_of_birth, bloodgroup:response.data['personal'][0].blood_group, phone_no:response.data['personal'][0].phone_no,email:response.data['personal'][0].email_id, linkedin_id:response.data['personal'][0].linkedin_id, facebook_id:response.data['personal'][0].facebook_id, address_line1:response.data['personal'][0].address1, address_line2:response.data['personal'][0].address2, post_office:response.data['personal'][0].post_office, pincode:response.data['personal'][0].pincode, taluk:response.data['personal'][0].taluk, district:response.data['personal'][0].district, state:response.data['personal'][0].state,permanent_address1:response.data['personal'][0].permanent_address1, permanent_address2:response.data['personal'][0].permanent_address2, permanent_post_office:response.data['personal'][0].permanent_post_office, permanent_pincode:response.data['personal'][0].permanent_pincode, permanent_city:response.data['personal'][0].permanent_taluk, permanent_district:response.data['personal'][0].permanent_district, permanent_state:response.data['personal'][0].permanent_state});
  
        }else{
          this.setState({ individualData:[] });
        }
      
    }).catch(error => {
      console.log(error.message);
  
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
      alert("error.response.data.message");
    });
  }

  componentDidMount() {
   this.getAllBoardDetails();
   this.getStudentInfo();
   this.getCategoryDetails();
   this.getStandardSectionDetails(this.state.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = (window.innerWidth) * (40/100)+"px";
  const width30 = (window.innerWidth) * (30/100)+"px";
 let name = this.state.firstname+ " "+this.state.middlename+" "+this.state.lastnam;
 let matches = name.match(/\b(\w)/g); 
 var acronym = matches.join('');
  return (
    <Fragment>
      {this.state.basicNotify}

     <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
      <Card className="card-box mb-4 ml-4 pt-4">
            <div className="d-flex align-items-center px-4 mb-3">
              <div className="avatar-icon-wrapper rounded mr-3">
                <div className="rounded overflow-hidden d-100 bg-neutral-first font-size-lg text-center font-weight-bold text-first d-flex justify-content-center flex-column">
                  <span>{acronym.toUpperCase()}</span>
                </div>
              </div>
              <div className="w-100">
                <a
                  href="#/"
                  onClick={e => e.preventDefault()}
                  className="font-weight-bold font-size-lg"
                  title="...">
                  {this.state.firstname+ " "+this.state.middlename+" "+this.state.lastname}
                </a>
                <span className="text-black-50 d-block pb-1">
                  AID: {this.state.student_AID}
                </span>
              </div>
            </div>
            
            <div className="mt-3 mb-2" />
            {/* <List className="py-0">
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-center text-warning font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'user']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Profile</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-warning text-center font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'object-group']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Attendance</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-warning text-center font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'chart-bar']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Assignments</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
            </List> */}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
        {this.state.searchStudent && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={3}></Grid>  
        <Grid item xs={12} md={8} lg={6}>
          <Autocomplete
          type="student"
          SearchPlaceholderText="Enter name and select from suggestions"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          /> 
        </Grid>
        </Grid>}    
        {!this.state.searchStudent && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <ExpansionPanel
        expanded={this.state.activeAccordion === 'student_details'}
        onChange={() => this.handleChangeAccordion("student_details")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Student Profile</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.studentProfiling()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={this.state.activeAccordion === 'academics'}
        onChange={() => this.handleChangeAccordion("academics")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Academics</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.AcademicProfiling()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={this.state.activeAccordion === 'attachments'}
        onChange={() => this.handleChangeAccordion("attachments")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Attachments</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.attachments()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
        </Grid> 
        </Grid>  }
         
        </Grid>  
        </Grid>  
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
                                 checked={(element.smid == this.state.selectedOptionalSubjectIds)?true:false}
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
