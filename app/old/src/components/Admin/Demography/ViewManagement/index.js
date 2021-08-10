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
      managementSelectedIds:'',
      selectedOverlayBoard:'',
      activeAccordion:'',
      boardDetails:[],
      boardData:[],
      editStaff:false,
      pincodesArr:[],
      individualAllData:[],
      individualData:[],
      individualProfession:[],
      individualPosition:[],
      individualFamily:[],
      individualAttachments:[],
      managementDetails:[],
      professionCount:'',
      positionCount:'',
      familyCount:'',
      familyHolders:[{pname:'',relationship:'',age:'',mobile:''}],
      professionHolders:[{working_name:'',working_address:'',working_from:new Date(),working_till:new Date(),working_positon:'',working_duties:''}],
      positionHolders:[{working_from:'',working_till:'',position:''}],
      dashboardDetails:[],
      studentname: '',
      siblingHolders:[],
      same_address:false,
      siblingCount:'',
      gender:'',
      dateOfBirth: new Date(),
      workFrom: new Date(),
      WorkTill: new Date(),
      first_name:'',
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
      taluk:'',
      district:'',
      state:'',
      pincode:'',
      permanent_address1:'',
      permanent_address2:'',
      permanent_pincode:'',
      permanent_taluk:'',
      permanent_district:'',
      permanent_state:'',
      permanent_pincode:'',
      birth_certificate_no:'',
      aadhaar_no:'',
      passport_no:'',
      driving_license_no:'',
      imagePreviewUrl:defaultImage,
      error: '',
      genderArray:['Male','Female','Others'],
      selectedFile:null,
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
          switchStatus = "Management Deactivated";
       }
       else{
          switchStatus = "Management Activated Successfully";
       }
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        id: id,
        token:"abc",
        id_user: this.props.data.UID,
      };
      new Service().apiCall('Management/deleteManagement',postData).then(response => {
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

  getMemberdetails = (department,designation) => {
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
    new Service().apiCall('Management/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data =  [];
        response.data.forEach(element => {
            data.push({id:element.UID,name:element.first_name+" "+" "+element.last_name,designation:element.designation, UID:element.UID});
        });
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({managementDetails:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({managementDetails:newArray});
        }
      }else{
        this.setState({managementDetails:[]});
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
   this.getMemberdetails();
   this.getDashboardDetails();
   this.getAllDepartmentDetails();
  }

render(){
 

  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container spacing={2} justify="center" className="sliderDiv">
        
        <Grid item xs={12} md={8} lg={8}>
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
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Management List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.getMemberdetails()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.getMemberdetails()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.getMemberdetails()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.managementDetails.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  name: original.name+" "+original.last_name,
  board:original.board_name,
  phone_no:original.phone_no,
  designation:original.current_designation,
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
                onClick={()=>this.props.history.push("/admin/view-management-info/"+original.id)}
                color="secondary"
                className="edit"
              >
                <ViewIcon />
              </Button> 

</Tooltip>
                
                {/* use this button to remove the data row */}
                <Tooltip
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
  accessor: "standard",
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
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/Management/excelManagement"}>
        Export
        </Button>
        </Grid>
        </Grid>
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
