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
import { AuthHelper } from '../../../../utils/AuthHelper.js';
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
      staffData:[],
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
  handleStaffSearch = (val) => {
    this.props.history.push("/admin/view-staff-info/"+val.UID);
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
      new Service().apiCall('StaffDetails/deleteStaff',postData).then(response => {
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
      console.log("error");
  
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

  getStaffDetails = (department,designation) => {
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
    new Service().apiCall('Staffs/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data =  [];
        response.data.forEach(element => {
            data.push({id:element.UID,name:element.first_name+" "+" "+element.last_name,designation:element.designation, UID:element.UID});
        });
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({staffData:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({staffData:newArray});
        }
        this.setState({staffSuggestions:data});
      }else{
        this.setState({staffSuggestions:[],staffData:[]});
      }  
    }).catch(error => {
      console.log(error);

    });
  }

  getStaffs = (type) => {
    
    const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    type:type,
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('Staffs/getData',postData).then(response => {
    //console.log(response)
    if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
        return {...data, checked: false, editable: false};
    });
    
        this.setState({ StaffAutoCompleteSuggesstion: data }); 
    }else{
        this.setState({ StaffAutoCompleteSuggesstion: []});
    }
    }).catch(error => {
        console.log(error);
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
   this.getStaffDetails();
   this.getDashboardDetails();
   this.getAllDepartmentDetails();
   this.getStaffs();
  }

render(){
 

  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container spacing={2}> 
      <Grid item xs={12} md={4} lg={3}> 
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                  <ListItem button className={this.state.searchStaff ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStaffDetails();this.setState({searchStaff:true,allStaff:false,selectedDepartment:''})}}>
                    <span>Search Staff</span>
                  </ListItem>
                  <Divider />
                  <ListItem button className={this.state.allStaff ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStaffDetails();this.setState({searchStaff:false,allStaff:true,selectedDepartment:''})}}>
                    <span>All Staff</span>
                    <span className="ml-auto badge badge-warning">{this.state.dashboardDetails['Total']}</span>
                  </ListItem>

                  {this.state.departmentDetails.map(departments =>(
                    <>
                    <Divider />
                    <ListItem button onClick={()=>this.setState({selectedDepartment:departments.id})} className={this.state.selectedDepartment==departments.id ?"my-2 activeSidebarColor":"my-2"}>
                      <span>{departments.name}</span>
                      <span className="ml-auto badge badge-warning">0</span>
                    </ListItem>
                    </>
                  ))}

                  {/* {this.state.departmentDetails.map(departments => (
                    this.state.departmentCount[departments.id] > 0 && <ListItem button onClick={()=>this.setState({selectedDepartment:departments.id})} className={this.state.selectedDepartment==departments.id ?"my-2 activeSidebarColor":"my-2"} >
                    <span>{departments.name}</span>
                    <span className="ml-auto badge badge-warning">      {this.state.departmentCount[departments.id]?this.state.departmentCount[departments.id]:0}</span>
                  </ListItem>
                        ))} */}
                        
                        {/* {this.sidebarStandardSections()} */}
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
        {this.state.searchStaff && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={3}></Grid>  
        <Grid item xs={12} md={8} lg={6}>
          <Autocomplete
          type="staff"
          SearchPlaceholderText="Enter name and select from suggestions"
          suggestions={this.state.StaffAutoCompleteSuggesstion}
          onSelected={this.handleStaffSearch}
          {...this.props}
          /> 
        </Grid>
        </Grid>}    
        {!this.state.searchStaff && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Staff List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.getStaffDetails()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.getStaffDetails()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.getStaffDetails()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.staffData.map((original,key) => {
return ({
  slno: key+1,
  uid:original.UID,
  name: original.first_name+" "+original.last_name,
  board:original.board,
  designation: original.designation_data,
  phone_no:original.phone_no,
  assigned:original.assigned,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
                <Tooltip
id="tooltip-top"
title={"View"}
placement="top"
>
                <Button
                className="m-2"
                simple
                onClick={()=>this.props.history.push("/admin/view-staff-info/"+original.UID)}
                color="secondary"
                className="edit"
              >
                <ViewIcon />
              </Button> 

</Tooltip>
                
                {/* use this button to remove the data row */}
                {AuthHelper('Staff Demography','can_edit') &&  <Tooltip
        id="tooltip-top"
        title={original.status == 1 ? "Deactivate":"Activate"}
        placement="top"
     
      >
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
      </Tooltip>}

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
  accessor: "uid",
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
  Header: "Designation",
  accessor: "designation",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Designation"
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
    {AuthHelper('Staff Demography','can_export') &&  <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/StaffDetails/excelStaff?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.state.selectedAcademicYear+"&id_organization="+this.state.selectedOrganizationId}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card></Grid> 
        </Grid>  }
         
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
