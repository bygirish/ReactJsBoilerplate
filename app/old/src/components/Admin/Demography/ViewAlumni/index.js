import React, { Fragment } from 'react';
import {Dialog,Grid,Switch,FormControlLabel,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip} from '@material-ui/core';
import ReactTable from 'react-table-6';
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
      showStatus:'all',
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
      city:"",
      district:"",
      state:"",
      permanent_address1:"",
      permanent_address2:"",
      permanent_pincode:"",
      permanent_city:"",
      permanent_district:"",
      permanent_state:"",
      birth_certificate_no:"",
      aadhaar_no:"",
      passport_no:"",
      driving_license_no:"",
      selectedOptionalSubject:'',
      selectedOptionalSubjectIds:'',
      standardSubjects:[],
      subjects:[],
      individualAttachments:[{student_photo:"",father_photo:"",mother_photo:"",guardian_photo:"",birth_certificate:"",aadhaar_card:"",latest_marks_card:"",transfer_certificate:""}],
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
      alumniDetails:[],
      departmentDetails:[],
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
      basicNotify:false,
      allStudents:true,
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
    this.props.history.push("/admin/view-student-info/"+val.UID);
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
   
    let lsiblingholders = this.state.siblingHolders;
    if(siblingCount > 0){
      for(let i = 0 ; i < siblingCount ; i++) {
        lsiblingholders.push({sibling_firstname:'',sibling_middlename:'',sibling_lastname:'',sibling_gender:'',sibling_dob:'',sibling_standard:'',sibling_board:'',sibling_school:'',checked:""});
    }
    this.setState({siblingHolders:lsiblingholders,siblingCount:this.state.siblingHolders.length});
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

  handleSiblingData = (pIndex,inputName,pValue) => {
    let lSiblingHolders = this.state.siblingHolders;
    lSiblingHolders[pIndex][inputName] = pValue;
    this.setState({siblingHolders:lSiblingHolders});
  }

  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

  handleAddress = (status) => {
    if(status == false){
      this.setState({permanent_address1:this.state.address_line1,permanent_address2:this.state.address_line2, permanent_pincode:this.state.pincode,permanent_city:this.state.city,permanent_district:this.state.district,permanent_state:this.state.state,same_address:!status})
      
    }
    else{
      this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_city:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  studentProfiling = () => {
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
          {this.renderTextInput("firstname","First Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("middlename","Middle Name")}
        </Grid>
        <Grid item xs={12} lg={4} className="py-1">
          {this.renderTextInput("lastname","Last Name")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("gender","Gender")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("bloodgroup","Blood Group")}
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
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("mothertongue","Mother Tongue")}
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
        <Grid item xs={12} lg={6} className="py-1">
          {this.renderTextInput("address_line1","Communication address line 1")}
        </Grid>
        <Grid item xs={12} lg={6} className="py-1">
          {this.renderTextInput("address_line2","Communication address line 2")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("pincode","Pincode")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("city","Taluk/City")}
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
        <Grid item xs={12} lg={6} className="py-1">
          {this.renderTextInput("permanent_address1","Permanent address line 1")}
        </Grid>
        <Grid item xs={12} lg={6} className="py-1">
          {this.renderTextInput("permanent_address2","Communication address line 2")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("permanent_pincode","Pincode")}
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
     
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={()=>this.handleBack()}>
                    Back
                  </Button>
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                  <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext()}
                        >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
        </Grid>
        </Grid>   
      </ExampleWrapperSimple>
      </Animated>
    )
  }

  siblingProfiling = () => {
    return (
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
      <Grid container spacing={2}>
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
        <Grid item xs={12} sm={6} lg={6}>
        <strong>Sibling {idx+1} </strong>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        Studying in same institute?
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
        <FormControl component="fieldset">
        <RadioGroup row aria-label="position" name="yes" defaultValue="top">
        <FormControlLabel value="end" control={
            <Radio color="primary" checked={routeholder.checked=="Yes"}
                   onChange={() => {this.handleChangeInstitute(idx,"Yes")}} />} label="Yes" />
        <FormControlLabel value="end" control={<Radio color="primary" checked={routeholder.checked=="No"}
                          onChange={() => {this.handleChangeInstitute(idx,"No")}} />} label="No" />
        </RadioGroup>
        </FormControl>
        </Grid>
        </Grid>

        {routeholder.checked == "Yes" && <div>

          </div>
        }
          {routeholder.checked == "No" && <div>
          <Grid container spacing={2}>
        <Grid item xs={12} lg={4} className="py-1">
             <FormControl fullWidth>
              <TextField 
                inputProps={{
                 autoComplete: 'off'
                 }}
               id="document-type"   
               value={this.state.sibling_firstname}
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
               autoComplete: 'off'
               }}
             id="document-type"   
             value={this.state.sibling_middlename}
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
                  autoComplete: 'off'
                  }}
                id="document-type"   
                value={this.state.sibling_lastname}
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
                inputProps={{
                 autoComplete: 'off'
                 }}
               id="document-type"   
               value={this.state.sibling_gender}
               label="Gender" 
               type="search" 
               onChange={(event) => this.handleSiblingData(idx,"sibling_gender",event.target.value)}
               inputRef={this.textInput} 
               variant="outlined" />
                    </FormControl>
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
          value={this.state.sibling_dob}
          onChange={(val) => this.handleSiblingData(idx,"sibling_dob",val)}   
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
                inputProps={{
                 autoComplete: 'off'
                 }}
               id="document-type"   
               value={this.state.sibling_standard}
               label="Studying Standard" 
               type="search" 
               onChange={(event) => this.handleSiblingData(idx,"sibling_standard",event.target.value)}
               inputRef={this.textInput} 
               variant="outlined" />
                    </FormControl>
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
        <FormControl fullWidth>
                  <TextField 
                  inputProps={{
                  autoComplete: 'off'
                  }}
                  id="document-type"   
                  value={this.state.sibling_board}
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
                  autoComplete: 'off'
                  }}
                  id="document-type"   
                  value={this.state.sibling_school}
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
                  autoComplete: 'off'
                  }}
                  id="document-type"   
                  value={this.state.sibling_school}
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
     
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={()=>this.handleBack()}>
                    Back
                  </Button>
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                  <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext()}
                        >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
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
          {this.renderTextInput("father_email_id","Email ID")}
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
          {this.renderTextInput("mother_email_id","Email ID")}
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
          {this.renderTextInput("guard_email_id","Email ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_linkedin_id","Linkedin ID")}
        </Grid>
        <Grid item xs={12} lg={3} className="py-1">
          {this.renderTextInput("guard_facebook_id","Facebook ID")}
        </Grid>
      </Grid>
      </Card>
        
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
     
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={()=>this.handleBack()}>
                    Back
                  </Button>
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                  <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext()}
                        >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
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
        <RadioGroup row aria-label="position" name="yes" defaultValue="top">
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
              autoComplete: 'off'
              }}
              id="document-type"   
              value={this.state.award_academic_year}
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
              autoComplete: 'off'
              }}
              id="document-type"   
              value={this.state.area_of_achievement}
              label="Area of achievement" 
              type="search" 
              onChange={(event) => { if (this.verifyNumber(event.target.value)) {
              this.handleAwardChange(idx,"area_of_achievement",event.target.value.replace(/\s/g, ''))
              }}}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off'
              }}
              id="document-type"   
              value={this.state.award_remarks}
              label="Remarks" 
              type="search" 
              onChange={(event) => { if (this.verifyNumber(event.target.value)) {
              this.handleAwardChange(idx,"award_remarks",event.target.value.replace(/\s/g, ''))
              }}}
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={1}>
            {(this.state.awardHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
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
            </FormControl></div>
            :
            <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
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
            </FormControl></div>
            }
            </Grid>  
           </Grid>
        </div>
      ))}  
      </Card>
        <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
     
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={()=>this.handleBack()}>
                    Back
                  </Button>
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                  <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext()}
                        >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
        </Grid>
        </Grid>   
    </ExampleWrapperSimple>
    </Animated>  
    )
  }

  feeConfiguration = () => {
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
        <Grid container spacing={2}>
        {this.state.boardDetails.length>0 && this.state.boardDetails.map((original,key) => (
            <Grid item xs={12} sm={6} lg={3}>
                 <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={(original.id==this.state.selectedFeeBoard)?this.state.boardChecked:false}
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
            <TextField
                    className="m-2"
                    id="outlined-select-currency"
                    select
                    label="Select Standard"
                    value={this.state.joiningStandard}
                    onChange={(event) => this.selectJoiningStandard(event.target.value)}
                    helperText="Please select joining standard"
                    variant="outlined">
                    {this.state.textSuggestions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
            </Grid>  
        </Grid>  
    </Card> 
    <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} lg={6} className="py-1">
     
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={()=>this.handleBack()}>
                    Back
                  </Button>
        </Grid>         
        <Grid item xs={12} lg={6} className="py-1 text-right">
                  <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext()}
                        >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
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
        <div className="font-weight-400 text-center display-4">Student Photo</div>
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
        <div className="font-weight-400 text-center display-4">Father Photo</div>
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
        <div className="font-weight-400 text-center display-4">Mother Photo</div>
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
        <div className="font-weight-400 text-center display-4">Guardian Photo</div>
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
        <div className="font-weight-400 text-center display-4">Birth Certificate</div>
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
        <div className="font-weight-400 text-center display-4">Aadhaar Card</div>
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
        <div className="font-weight-400 text-center display-4">Latest Marks Card</div>
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
        <div className="font-weight-400 text-center display-4">Transfer Certificate</div>
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
    </ExampleWrapperSimple>
    </Animated>
    )
    }
    handleDeactive = (id,status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Alumni Deactivated";
       }
       else{
          switchStatus = "Alumni Activated";
       }
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        id:id,
        token:"abc",
        id_user: this.props.data.UID,
      };
      //console.log(postData);return false;
      new Service().apiCall('Alumnus/deleteAlumni',postData).then(response => {
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
           window.location.reload()
          }, 2000) 
        }
      }).catch(error => {
        alert(error);
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


  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,allStudents:false,searchStudent:false,activeSuggestion:0,filteredSuggestions:[],selectedStudentId:'',customAssignInput:"",customAssignStudents:[] });
    this.getStudentDetails(id,this.state.selectedBoard,this.state.selectedAcademicYear);
  }

  getTotalStudentCount = (count) => {
    console.log("c"+count);
    this.setState({TotalStudentCount:count})
  }

  getAlumniDetails = (department,designation) => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID,
      department:department,
      designation:designation
    };
    new Service().apiCall('Alumnus/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data =  [];
        response.data.forEach(element => {
            data.push({id:element.UID,name:element.first_name+" "+" "+element.last_name,designation:element.designation, UID:element.UID});
        });
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({alumniDetails:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({alumniDetails:newArray});
        }
        this.setState({alumniSuggestions:data});
      }else{
        this.setState({alumniSuggestions:[],alumniDetails:[]});
      }  
    }).catch(error => {
      alert(error);

    });
  }

  getAllDepartmentDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId
    }
    new Service().apiCall('StaffDetails/getDepartmentData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ departmentDetails: response.data});  
        }
      }else{
        this.setState({ departmentDetails: []});
      }
    }).catch(error => {
      alert("error");
    });
  }

  getDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ dashboardDetails: response.data ,selectedBoard:'all',departmentCount:response.data['department']});
        }
      }
    }).catch(error => {
      alert("error");
  
    });
  }

  componentDidMount() {
   this.getAllBoardDetails();
   this.getAlumniDetails();
   this.getDashboardDetails();
   this.getAllDepartmentDetails();
  }

render(){
 

  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container spacing={2} justify="center" className="sliderDiv">
        <Grid item xs={12} md={8} lg={8}>
      
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Alumni List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.getAlumniDetails()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.getAlumniDetails()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.getAlumniDetails()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.alumniDetails.map((original,key) => {
return ({
  slno: key+1,
  id:original.AID,
  name: original.name+" "+original.last_name,
  phone_no:original.phone_no,
  year_passout:original.year_passout,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
      <Tooltip id="tooltip-top" title={"View"} placement="top" >
        <Button
          className="m-2"
          simple
          onClick={()=>this.props.history.push("/admin/view-alumni-info/"+original.AID)}
          color="secondary"
          className="edit"
        >
          <ViewIcon />
        </Button> 
      </Tooltip>
      
      {/* use this button to remove the data row */} 
      <Tooltip id="tooltip-top" title={original.status == 1 ? "Deactivate":"Activate"} placement="top" >
        <FormControlLabel
          control={
            <Switch
              checked={original.status == 1 ? true:false}
              onChange={() => this.handleDeactive(original.id, original.status)}
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
width: 90,
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "UID",
  accessor: "id",
  width: 90,
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search UID"
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
Header: "Contact No",
accessor: "phone_no",
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
)
},
{
  Header: "Passed out year",
  accessor: "year_passout",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Year"
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
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/Alumnus/excelAlumni"}>
        Export
        </Button>
        </Grid>
        </Grid>
  </CardActions>

        </Card></Grid> 
        </Grid>  
         
        </Grid>  
        </Grid>  
      {/* <div className="w-100">
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
               
            </div> */}

    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
