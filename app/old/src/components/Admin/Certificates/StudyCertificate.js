import React, { Fragment } from 'react';
import {Dialog,Grid,Toolbar,IconButton,Typography,AppBar,Card,TextField,Slide,Button} from '@material-ui/core';
import Autocomplete from "../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import axios from 'axios';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import  "../../../assets/custom.scss";
import Service from '../../../utils/Service';
import Config from '../../../config';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class StudyCertificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      sno:1,
      study_info:{ref_no:'',student_name:'',district:'',taluk:'',state:'',caste:'',father_name:'',class_name:'',academic_year:this.props.data.academic_year, date_of_birth:'',mother_tongue:'',address:'',pincode:'',gender:''},
      selectedSection:'',
      selectedStandard:'',
      studentInfo:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
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

  setData = (name,value) => {
    let data = this.state.study_info;
    data[name] = value;
    this.setState({data});
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

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

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

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
      if (response.status === 200 && response.data !== '') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus === 'all'){
            this.setState({studentData:newArr,studentSuggestions:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status === this.state.showStatus);
           this.setState({studentData:newArray,studentSuggestions:newArray});
        }
      }else{
        this.setState({studentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 

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

  handleStudentSearch = (val) => {
    this.setState({ studentInfo: val,  study_info:{ref_no:'',student_name:val.name+' '+val.middle_name+' '+val.last_name,district:val.district,pincode:val.pincode,taluk:val.taluk,state:val.state,caste:val.caste,father_name:val.father_middle_name+' '+val.father_last_name,class_name:val.class_name,academic_year:this.props.data.academic_year, date_of_birth:val.date_of_birth,mother_tongue:val.mother_tongue, address:val.permanent_address1+' '+val.permanent_address2, gender:val.gender}});

  }

  
  print_tc = () =>{
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      studyData:this.state.study_info,
      school_name:this.props.data.inst_name,
      role_id:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    };
    axios({
      method: 'post',
      responseType: 'blob',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer '+this.props.token },
      url: Config.url+'Certificates/view_study',
      data: postData
    }).then(response => {
   
      if (response.status ===200 && response.data !== '') {
        const file = new Blob(
        [response.data], 
        {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    }).catch(error => {
    });
}


  componentDidMount() {
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = window.innerWidth;
  // const width40p =  width * (40/100)+"px";
  // const width50p =  width * (50/100)+"px";
  // const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/certificates")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Study Certificate
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

      <Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={6}>  
        <Autocomplete
          type="student"
          showValue={true}
          SearchPlaceholderText="Search Student Name"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          />
          </Grid>
          </Grid>
        </Grid> 
        </Grid>

        {this.state.studentInfo !== '' &&   <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 p-3"> 
        <div className="study-main">
<div classMame="study-main1">
        <p className="study-ref">Ref:<TextField className="mx-1 mb-3" id="ref-no" value={this.state.ref_no} onChange={(e)=>this.setData("ref_no",e.target.value)} /></p>
        
       <p className="study-heading">Study Certificate</p>
       <br /><br /><br />
     
       <p  style={{fontSize:15,textAlign:'left'}}>This is to certify that Sri/Kum. <TextField style ={{width: 250}} inputProps={{
                autoComplete: 'off',style: {textTransform: 'capitalize'}}} className="mx-1 mb-3" id="student-name" value={this.state.study_info.student_name} onChange={(e)=>this.setData("student_name",e.target.value)} />  Son/Daughter of Shri.<TextField style ={{width: 250}} inputProps={{
                  autoComplete: 'off',style: {textTransform: 'capitalize'}}} className="mx-1 mb-3" id="father-name" value={this.state.study_info.father_name} onChange={(e)=>this.setData("father_name",e.target.value)} /> residing at <TextField style ={{width: 400}} inputProps={{
                    autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="address" value={this.state.study_info.address} onChange={(e)=>this.setData("address",e.target.value)} /> <TextField inputProps={{
                      autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="taluk" value={this.state.study_info.taluk} onChange={(e)=>this.setData("taluk",e.target.value)} />   &nbsp;&nbsp;<TextField inputProps={{
                        autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="pincode" value={this.state.study_info.pincode} onChange={(e)=>this.setData("pincode",e.target.value)} />studying in Std. <TextField inputProps={{
                          autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="class_name" value={this.state.study_info.class_name} onChange={(e)=>this.setData("class_name",e.target.value)} />during the academic Year <TextField  inputProps={{
                            autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="academic_year" value={this.state.study_info.academic_year} onChange={(e)=>this.setData("academic_year",e.target.value)} />
      &nbsp;&nbsp;  His/Her date of birth is <TextField inputProps={{
                  autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="date_of_birth" value={this.state.study_info.date_of_birth} onChange={(e)=>this.setData("date_of_birth",e.target.value)} /> He/She belongs to <TextField inputProps={{
                    autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="caste" value={this.state.study_info.caste} onChange={(e)=>this.setData("caste",e.target.value)} />caste and the mother  tongue of the candidate is <TextField inputProps={{
                      autoComplete: 'off',style: {textTransform: 'capitalize'}}}  className="mx-1 mb-3" id="mother_tongue" value={this.state.study_info.mother_tongue} onChange={(e)=>this.setData("mother_tongue",e.target.value)} /> as per the Admission register of the institution.</p> 
        
       <br /><br />
       <p style={{fontSize:15,textAlign:'left'}}><b>The above details are true and correct to the best of my Knowledge.</b></p><br /><br />
       
        <p style={{fontSize:18,textAlign:'right'}}>Signature of the Head of the Institution</p>
       
                                              </div>
                                            </div>
        
        <Grid container spacing={4}>
        <Grid item xs={12} md={10} lg={12} className="m-2 text-right">
            <Button variant="contained" color="secondary" onClick={()=>this.print_tc()}>Print</Button>
        </Grid>
        </Grid>				
        </Card>

            </Grid> 
        </Grid>}
        
   
      

        
</div>
</Animated>
</Dialog>

    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudyCertificate);
