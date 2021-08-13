import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Chip,Typography,AppBar,Divider,Card,CardContent,Box,TextField,Button,Avatar,Toolbar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw , ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
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

class viewManagementInfoDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      editStaff:false,
      activeAccordion:'',
      selectedDepartment:'',
      addressType:'',
      departmentCount:[],
      standardSubjects:[],
      pincodesArr:[],
      staffData:[],
      departmentDetails:[],
      boardDetails:[],
      individualAllData:[],
      individualData:[],
      individualWork:[],
      individualSkill:[],
      selectPOPanel:false,
      individualEducation:[],
      individualAttachments:[], 
      departmentChecked:'',
      departmentName:'',
      formChanged:false,
      ldepartment:'',
      staffHead:'',
      educationCount:'',
      awardCount:'',
      skillCount:'',
      remarks:EditorState.createEmpty(),
      workCount:'',
      GenderMaster:["Male","Female","Other"],
      BloodGroupMaster:["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      NationalityMaster:["Indian"],
      ReligionMaster:["Hindus","Muslims","Christians","Sikhs","Buddhists","Jains","Others"],
      workHolders:[{place:'', address:'', working_from: moment(new Date()).format("YYYY-MM-DD"), working_till:moment(new Date()).format("YYYY-MM-DD"), working_position:'', working_duties:'',editorState:''}],
      dashboardDetails:[],
      roleData:[],
      headDepartment:'',
      departmentData:[],
      lroles:'', 
      ldepartment:'',
      studentname: '',
      siblingHolders:[],
      siblingCount:'',
      same_address:false, 
      gender:'',
      dateOfBirth: new Date(),
      workFrom: new Date(),
      WorkTill: new Date(),
      father_name:'',
      father_age:'',
      father_number:'',
      mother_name:'',
      mother_age:'',
      mother_number:'',
      sibling_name:'',
      sibling_age:'',
      sibling_number:'',
      first_name:'',
      middle_name:'',
      last_name:'',
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
      post_office:'',
      taluk:'',
      district:'',
      state:'',
      same_address:false,
      permanent_address1:'',
      permanent_address2:'',
      permanent_pincode:'',
      permanent_post_office:'',
      permanent_city:'',
      permanent_district:'',
      permanent_state:'',
      birth_certificate:'',
      aadhaar_no:'',
      passport_no:'',
      driving_license_no:'',
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
      defaultDisplayImage:defaultImage,
      currentForm:'student_details',
     
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
    
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
  
  handleStudentSearch = (val) => {

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

  handleChangePrevious = (index,name,value) => {
    let data = this.state.individualPrevious;
    data[index][name] = value;
    this.setState({data});
  }
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

  fillAddress = (po,taluk,district,state,event) => {
    event.preventDefault();
    if(this.state.addressType == "pincode"){
      this.setState({post_office:po,taluk:taluk,district:district,state:state, selectPOPanel:false});
    }
    else{
      this.setState({permanent_post_office:'',permanent_taluk:'',permanent_district:'',permanent_state:'', selectPOPanel:false});
    }
  }


  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          disabled={this.state.editStaff?false:true}
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

  replaceText = (str) => {
    let string = str.replace(" B.O","");
    string = string.replace(" S.O","");
    return string;
    }

    

  handleUpdate(id,order){
    console.log(this.state.fee_id);
    let formData = new FormData();
    formData.append('id',id);
    formData.append('order',order);
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('id_board',this.props.data.selectedBoardId);
    formData.append('selectedBoard',this.props.data.selectedBoardId);
    formData.append('positionHolders',JSON.stringify(this.state.workHolders));
    formData.append('name',this.state.first_name);
    formData.append('middle_name',this.state.middle_name);
    formData.append('last_name',this.state.last_name);
    formData.append('gender',this.state.gender);
    formData.append('blood_group',this.state.blood_group);
    formData.append('dateOfBirth',moment(this.state.dateOfBirth).format("YYYY-MM-DD"));
    formData.append('nationality',this.state.nationality);
    formData.append('phone_no',this.state.phone_no);
    formData.append('email_id',this.state.email);
    formData.append('linkedin_id',this.state.linkedin_id);
    formData.append('facebook_id',this.state.facebook_id);
    formData.append('address1',this.state.address1);
    formData.append('address2',this.state.address2);
    formData.append('pincode',this.state.pincode);
    formData.append('post_office',this.state.post_office);
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
    formData.append('birth_certificate_no',this.state.birth_certificate);
    formData.append('aadhaar_no',this.state.aadhaar_no);
    formData.append('passport_no',this.state.passport_no);
    formData.append('driving_license_no',this.state.driving_license_no);
    formData.append('father_name',this.state.father_name);
    formData.append('father_age',this.state.father_age);
    formData.append('father_mobile',this.state.father_number);
    formData.append('mother_name',this.state.mother_name);
    formData.append('mother_age',this.state.mother_age);
    formData.append('mother_mobile',this.state.mother_number);
    formData.append('sibling_name',this.state.sibling_name);
    formData.append('sibling_age',this.state.sibling_age);
    formData.append('sibling_mobile',this.state.sibling_number);
    formData.append('management_photo',this.state.selectedFile);
    formData.append('id_users',this.props.data.UID);
    formData.append('attachment_id',this.state.attachment_id);
    new Service().apiCall('Management/updateManagement', formData,
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
              <h4 className="font-weight-bold mt-4">Management Updated Successfully!</h4>
            </div>
          </Dialog>
          ),
        });
        setTimeout(() => {
           this.setState({ basicNotify:null, editStaff:false, formChanged:false});
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
    let allowNumberLimit = ["phone_no", "father_phone_no", "mother_phone_no","guard_phone_no","primary_contact","primary_contact1"];
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
      this.setState({permanent_address1:this.state.address1,permanent_address2:this.state.address2, permanent_pincode:this.state.pincode,permanent_post_office: this.state.post_office,permanent_city:this.state.taluk,permanent_district:this.state.district,permanent_state:this.state.state,same_address:!status})
      
    }
    else{
      this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_city:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  staffProfiling = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
 
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
             { !this.state.editStaff &&   <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                          Edit
             </Button>}
         { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
     
               <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.management_id,'1')}>
                          Submit
               </Button>
               </div>}
             </Grid>
      </Grid>
  
      </Animated>
    )
  }

  workExperience = () => {
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft" className="w-100"> 

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
                      value={workholder.place}
                      disabled={this.state.editStaff?false:true}
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
                      value={workholder.address}
                      disabled={this.state.editStaff?false:true}
                      label="Workplace full address" 
                      type="search" 
        
                      onChange={(event) => this.handleWorkChange(idx,"address",event.target.value)}
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
                        disabled={this.state.editStaff?false:true}
                        value={workholder.working_from}
                        onChange={val => {this.handleWorkChange(idx, "working_from",val)}}   
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
                        disabled={this.state.editStaff?false:true}
                        format="MM/dd/yyyy"
                        value={workholder.working_till}
                        onChange={val => {this.handleWorkChange(idx, "working_till",val)}}   
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
                      value={workholder.working_position}
                      label="Position held" 
                      type="search" 
                      disabled={this.state.editStaff?false:true}
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
             <Grid item xs={12} lg={12} className="py-1 text-right">
             { !this.state.editStaff &&   <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                          Edit
             </Button>}
         { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
     
               <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.management_id,'2')}>
                          Submit
               </Button>
               </div>}
             </Grid>
      </Grid>
     
      </Animated>
    )
  }

  familyDetails = () => {
    return(
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft" className="w-100"> 
  

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
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      disabled={this.state.editStaff?false:true}
                      value={this.state.father_name}
                      label="Father Name" 
                      inputRef={this.textInput} 
                      type="search" 
                      onChange={(event) => this.setPostData("father_name",event.target.value)}
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
                      disabled={this.state.editStaff?false:true} 
                      value={this.state.father_age}
                      label="Father Age" 
                      type="search" 
                      onChange={(event) => this.setPostData("father_age",event.target.value)}
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
                      disabled={this.state.editStaff?false:true}
                      value={this.state.father_number}
                      label="Mobile Number" 
                      type="search" 
                      onChange={(event) => this.setPostData("father_number",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                    <TextField 
                      inputProps={{
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={this.state.mother_name}
                      disabled={this.state.editStaff?false:true}
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
                      id="document-type"   
                      value={this.state.mother_age}
                      disabled={this.state.editStaff?false:true}
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
                      id="document-type"   
                      value={this.state.mother_number}
                      disabled={this.state.editStaff?false:true}
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
                      autoComplete: 'off'
                      }}
                      id="document-type"   
                      value={this.state.sibling_name}
                      disabled={this.state.editStaff?false:true}
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
                      id="document-type"   
                      value={this.state.sibling_age}
                      disabled={this.state.editStaff?false:true}
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
                      id="document-type"   
                      value={this.state.sibling_number}
                      disabled={this.state.editStaff?false:true}
                      label="Mobile Number" 
                      type="search" 
                      onChange={(event) => this.setPostData("sibling_number",event.target.value)}
                      variant="outlined" />
                    </FormControl>
                    </Grid>
       </Grid>  
        </Card>
        <Grid container spacing={2} className="mt-2"> 
             <Grid item xs={12} lg={12} className="py-1 text-right">
             { !this.state.editStaff &&   <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                          Edit
             </Button>}
         { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
     
               <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.management_id,'3')}>
                          Submit
               </Button>
               </div>}
             </Grid>
      </Grid>

 
    </Animated>  
    )
  }

  attachments = () => {
    return(
      <div className="w-100">

    <Grid container spacing={4}>

    <Grid item xs={12} lg={3}>
    <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <div className="font-weight-400 text-center display-5">Management Photo</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrl} />
                 </div>
               <div>
      
                 { this.state.selectedFile === "" ? 
                this.state.editStaff &&   <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>
                 Add
                 </Button>
                  : 
                 <span>
                {this.state.editStaff &&  <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>
                 Change
                 </Button>}
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
             { !this.state.editStaff &&   <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                          Edit
             </Button>}
         { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
     
               <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.management_id,'4')}>
                          Submit
               </Button>
               </div>}
             </Grid>
             </Grid> 
    </div>
    )
    }
    handleDeactive = (id,status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Staff Deactivated";
       }
       else{
          switchStatus = "Staff Activated Successfully";
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
        this.setState({activeAccordion:"", editStaff:false});
      }
      else{
        this.setState({activeAccordion:value, editStaff:false});
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

  // getStandardSectionDetails() {
  //   const postData = {
  //   count:"student",
  //   id_organization:this.state.selectedOrganizationId,
  //   id_institute:this.state.selectedInstitutionId,
  //   token:"abc",
  //   id_user: this.props.data.UID,
  //   id_board:this.state.selectedBoard,
  //   id_academicyear:this.state.selectedAcademicYear
  //   };
  //   new Service().apiCall('ClassDetails/getData',postData).then(response => {
  //     console.log(response);
  //     if (response.status==200 && response.data!='') {
  //       var lStandardSections = [];
  //       var lBoardDetails =[];
  //       response.data.forEach(element => {
  //             if(lStandardSections[element.standard_id]){
  //                 var lSection = {};
  //                 lSection.section_id = element.section_id;
  //                 lSection.section_name = element.section_name;
  //                 lSection.standard_id = element.standard_id;
  //                 lSection.standard_name = element.standard_name;
  //                 lSection.all_subject_count = element.all_subject_count;
  //                 lSection.active_subject_count = element.active_subject_count;
  //                 lSection.fee_remain_count = element.feeremaindetails;
  //                 lStandardSections[element.standard_id].standards.push(lSection);
  //             }else{
  //                 var lStandard = {};
  //                 var lSection = {};
  //                 lStandard.standard_name = element.standard_name;
  //                 lStandard.section_name = element.section_name;
  //                 lStandard.stream_name = element.stream_name;
  //                 lStandard.standard_id = element.standard_id;
  //                 lSection.section_id = element.section_id;
  //                 lSection.section_name = element.section_name;
  //                 lSection.standard_id = element.standard_id;
  //                 lSection.standard_name = element.standard_name;
  //                 lSection.all_subject_count = element.all_subject_count;
  //                 lSection.active_subject_count = element.active_subject_count;
  //                 lSection.fee_remain_count = element.feeremaindetails;
  //                 lStandard.standards = new Array();
  //                 lStandard.standards.push(lSection);

  //                 lStandardSections[element.standard_id] = lStandard;

  //             }

  //       });
  //       let data =  [];  
  //          lStandardSections.forEach((element,index )=> {
  //           data.push({id:element.standard_id,value:element.standard_name+" "+element.stream_name+" "+element.section_name});
  //       });
  //       this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
  //     }
  //   }).catch(error => {
  //     alert(error);

  //   });

  // }

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

  getManagementInfo() {
    const id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const postData = {
      id:id,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear 
    }
    new Service().apiCall('Management/getDataWithId',postData).then(response => { 
      console.log(response.data);
      if (response.status==200 && response.data!='') {

        // response.data['profession'].map((element, index) =>{
        //   const html = element.working_duties;
        //   const contentBlock = htmlToDraft(html);

        //   if (contentBlock) {
        //     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        //     this.state.workHolders[index].editorState= EditorState.createWithContent(contentState);
        //   }else{
        //     this.state.workHolders[index].editorState= EditorState.createEmpty();
        //   }
        // });          

        this.setState({management_id:response.data['personal'][0].id, individualAllData:response.data['personal'],  individualData : response.data['profile'] , individualProfession:response.data['profession'],workHolders:response.data['profession'],individualPosition:response.data['position'],attachment_id:response.data['attachment'].length > 0 ? response.data['attachment'][0].id:'', individualAttachments:response.data['attachment'].length > 0 ? response.data['attachment'] : [{management_photo:""}],imagePreviewUrl:response.data['attachment'][0] && response.data['attachment'][0].management_photo!=''?Config.path+'writable/uploads/management/'+response.data['attachment'][0].management_photo:this.state.defaultDisplayImage,first_name:response.data['personal'][0].name,middle_name:response.data['personal'][0].middle_name,last_name:response.data['personal'][0].last_name,gender:response.data['personal'][0].gender,blood_group:response.data['personal'][0].blood_group,nationality:response.data['personal'][0].nationality,phone_no:response.data['personal'][0].phone_no,email:response.data['personal'][0].email_id,linkedin_id:response.data['personal'][0].linkedin_id,facebook_id:response.data['personal'][0].facebook_id,address1:response.data['personal'][0].address1,address2:response.data['personal'][0].address2,pincode:response.data['personal'][0].pincode,taluk:response.data['personal'][0].taluk,district:response.data['personal'][0].district,state:response.data['personal'][0].state,birth_certificate:response.data['personal'][0].birth_certificate_no,aadhaar_no:response.data['personal'][0].aadhaar_no,passport_no:response.data['personal'][0].passport_no,driving_license_no:response.data['personal'][0].driving_license_no, dateOfBirth:response.data['personal'][0].date_of_birth, permanent_address1:response.data['personal'][0].permanent_address1,permanent_address2:response.data['personal'][0].permanent_address2,permanent_pincode:response.data['personal'][0].permanent_pincode,permanent_city:response.data['personal'][0].permanent_taluk,permanent_state:response.data['personal'][0].permanent_state,permanent_district:response.data['personal'][0].permanent_district,permanent_post_office:response.data['personal'][0].permanent_post_office,post_office:response.data['personal'][0].post_office, father_name:response.data['personal'][0].father_name, father_age:response.data['personal'][0].father_age, father_number:response.data['personal'][0].father_mobile, mother_name:response.data['personal'][0].mother_name, mother_age:response.data['personal'][0].mother_age, mother_number:response.data['personal'][0].mother_mobile, sibling_name:response.data['personal'][0].sibling_name, sibling_age:response.data['personal'][0].sibling_age, sibling_number:response.data['personal'][0].sibling_mobile}); 
  
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

  onEditorWorkChange = (value,index) => {    
    //console.log('e'+JSON.stringify(value.getCurrentContent().getPlainText()))
    var editorvalue = draftToHtml(convertToRaw(value.getCurrentContent()));//value.getCurrentContent().getPlainText();
    //console.log(editorvalue);
    let lworkholders = this.state.workHolders;
    lworkholders[index].working_duties = editorvalue;
    lworkholders[index].editorState = value;
    //lworkholders[index].editorState = 
    //const html = data.value;
    //const contentBlock = htmlToDraft(html);
    //if (contentBlock) {
    //  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    //  lworkholders[index].editorState= EditorState.createWithContent(contentState);
    //}else{
    //  lworkholders[index].editorState= EditorState.createEmpty();
    //}

    this.setState({workHolders:lworkholders});  
  };

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



  handleWorkChange = (pIndex,inputName,pValue) => {
    let lworkholders = this.state.workHolders;
    lworkholders[pIndex][inputName] = pValue;
    this.setState({workHolders:lworkholders});
  }

  handCustomersdWorkholder = (c) => {
    let lworkHolders = this.state.workHolders;
    let lWorks = {};
    lWorks.place='';
    lWorks.address='';
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

  componentDidMount() {
   this.getAllBoardDetails();
   this.getManagementInfo();
   this.getCategoryDetails();
   //this.getStandardSectionDetails(this.state.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = (window.innerWidth) * (40/100)+"px";
  const width30 = (window.innerWidth) * (30/100)+"px";
 let name = this.state.first_name+ " "+this.state.middle_name+" "+this.state.last_name;
 let matches = name.match(/\b(\w)/g); 
 var acronym = matches ? matches.join(''): '';
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
                  {this.state.first_name+ " "+this.state.middle_name+" "+this.state.last_name}
                </a>
                {/* <span className="text-black-50 d-block pb-1">
                  UID: {this.state.staff_uid}
                </span> */}
              </div>
            </div>
            <Divider className="my-3" />
            <div className="font-size-sm px-4 rounded-sm">
              {/* <div className="d-flex justify-content-between">
                <span className="font-weight-bold">Designation:</span>
                <span className="text-black-50">{this.state.headDesignation}</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="font-weight-bold">Department:</span>
                <span className="text-black-50">{this.state.departmentName}</span>
              </div> */}
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">Contact:</span>
                <span className="text-black-50">{this.state.phone_no}</span>
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
        expanded={this.state.activeAccordion === 'staff_details'}
        onChange={() => this.handleChangeAccordion("staff_details")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Management Profile</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.staffProfiling()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
     
      <ExpansionPanel
        expanded={this.state.activeAccordion === 'work_experience'}
        onChange={() => this.handleChangeAccordion("work_experience")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Work Experience</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.workExperience()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={this.state.activeAccordion === 'family_details'}
        onChange={() => this.handleChangeAccordion("family_details")}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>Family Details</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         {this.familyDetails()}
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
     


    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(viewManagementInfoDashboard);