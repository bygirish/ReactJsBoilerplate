import React, { Fragment } from 'react';
import {Dialog,Grid,Toolbar,IconButton,Typography,AppBar,Card,TextField,Slide,Button} from '@material-ui/core';
import Autocomplete from "../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import axios from 'axios';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import 'date-fns';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../config';

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
      sno:1,
      tc_info:{admission_no:'',c_record_no:'',student_name:'',place_of_birth:'',district:'',taluk:'',state:'',gender:'',nationality:'',religion:'',caste:'',subcaste:'',father_name:'',mother_name:'',candidate_belongs_to_scheduled_caste:'',qualified_for_promotion:'',date_of_birth:'',leaving_standard:'',languages_studied:'',electives_studied:'',medically_examined:'',last_attendance_date:'',medium_of_instruction:'',application_date:'',date_of_admission:'',issue_date:'',balance_paid:'',school_days:'',fee_concession:'',total_days_attended:'',scholarship:'',character_and_conduct:''},
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
    let data = this.state.tc_info;
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
        if(this.state.showStatus == 'all'){
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

    this.setState({ studentInfo: val,  tc_info:{admission_no:'',c_record_no:'',student_name:val.name+' '+val.middle_name+' '+val.last_name,place_of_birth:'',district:val.district,taluk:val.taluk,state:val.state,gender:val.gender,nationality:val.nationality,religion:val.religion,caste:val.caste,subcaste:val.category,father_name:val.father_name+' '+val.father_middle_name+' '+val.father_last_name,mother_name:val.mother_name+' '+val.mother_middle_name+' '+val.mother_last_name,candidate_belongs_to_scheduled_caste:'',qualified_for_promotion:'',date_of_birth:val.date_of_birth,leaving_standard:val.class_name,languages_studied:'',electives_studied:'',medically_examined:'',last_attendance_date:'',medium_of_instruction:'',application_date:'',date_of_admission:'',issue_date:'',balance_paid:'',school_days:'',fee_concession:'',total_days_attended:'',scholarship:'',character_and_conduct:''}});
  
  }

  
  print_tc = () =>{
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      tcData:this.state.tc_info,
      school_name:this.props.data.inst_name,
      role_id:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    };
    axios({
      method: 'post',
      responseType: 'blob',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer '+this.props.token },
      url: Config.url+'Certificates/view_tc',
      data: postData
    }).then(response => {
  //   console.log(response);return false;
      if (response.status === 200 && response.data !== '') {
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
              Transfer Certificate
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
        <div className="tc-main">
        <div className="tc-main1">
													<p className="tc-title">Transfer Certificate</p>
													
													<h6 className="text-left"><b>TC Serial No:</b> <TextField id="tc-no" value="" /></h6>
													<table className="tc-table" width='100%'>
                          <tr>
															<td className="tc-td1" width='55%' align='left' >1. Name of the School</td>
															<td className="tc-td2" align='left' >{this.props.data.inst_name}</td>
														</tr>
                            <tr>
															<td className="tc-td1" width='55%' align='left' ><p>2. Admission No:<TextField id="admission_no" value={this.state.admission_no} onChange={(e)=>this.setData("admission_no",e.target.value)} /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ಪ್ರವೇಶ ಸಂಖ್ಯೆ</p></td>
															<td className="tc-td2" align='left' ><p>3. Cumulative Record No:<TextField id="c_record_no" value={this.state.c_record_no} onChange={(e)=>this.setData("c_record_no",e.target.value)} /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ಕ್ಯುಮುಲೇಟಿವ್ ರೆಕಾರ್ಡ್ ನಂ.</p></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>4. Name of the Pupil in full:</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ವಿದ್ಯಾರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು</p></td>
															<td className="tc-td2" align='left' ><TextField id="student_name" value={this.state.tc_info.student_name} onChange={(e)=>this.setData("student_name",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>5. Place of Birth ಹುಟ್ಟಿದ ಸ್ಥಳ :<TextField id="place_of_birth" value={this.state.tc_info.place_of_birth} onChange={(e)=>this.setData("place_of_birth",e.target.value)} /></p><p>6. Taluk ತಾಲ್ಲೂಕು :<TextField id="taluk" value={this.state.tc_info.taluk} onChange={(e)=>this.setData("taluk",e.target.value)} /></p></td>
															<td className="tc-td2" align='left' ><p>7. District ಜಿಲ್ಲೆ :<TextField id="district" value={this.state.tc_info.district} onChange={(e)=>this.setData("district",e.target.value)} /></p>	<p>8. State ರಾಜ್ಯ :<TextField id="state" value={this.state.tc_info.state} onChange={(e)=>this.setData("state",e.target.value)} /></p></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>9. Sex ಲಿಂಗ :<TextField id="gender" value={this.state.tc_info.gender} onChange={(e)=>this.setData("gender",e.target.value)} /></p>
															<p>10. Nationality ರಾಷ್ಟ್ರೀಯತೆ :<TextField id="nationality" value={this.state.tc_info.nationality} onChange={(e)=>this.setData("nationality",e.target.value)} /></p>	<p>11. Caste ಜಾತಿ :<TextField id="caste"  value={this.state.tc_info.caste} onChange={(e)=>this.setData("caste",e.target.value)} /></p></td>
													<td className="tc-td2" align='left' ><p>12. Religion ಧರ್ಮ :<TextField id="religion" value={this.state.tc_info.religion} onChange={(e)=>this.setData("religion",e.target.value)} /></p>
															<p>13. Sub Caste ಉಪಜಾತಿ :<TextField id="subcaste" value={this.state.tc_info.subcaste} onChange={(e)=>this.setData("subcaste",e.target.value)} /></p></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >14. Name of the Father ತಂದೆಯ ಹೆಸರು :</td>
													<td className="tc-td2" align='left' ><TextField id="father_name" value={this.state.tc_info.father_name} onChange={(e)=>this.setData("father_name",e.target.value)} /></td> 
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >15. Name of the Mother ತಾಯಿಯ ಹೆಸರು :</td>
														<td className="tc-td2" align='left' ><TextField id="mother_name" value={this.state.tc_info.mother_name} onChange={(e)=>this.setData("mother_name",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>16. Whether the candidate belongs to Scheduled Castes or Scheduled Tribes</p>
															<p>ವಿದ್ಯಾರ್ಥಿಯು ಪರಿಶಿಷ್ಟ ಜಾತಿ ಅಥವಾ ಪರಿಶಿಷ್ಟ ವರ್ಗಕ್ಕೆ ಸೇರಿದವನಾಗಿದ್ದಾನೆಯೇ?</p>
                              <TextField id="candidate_belongs_to_scheduled_caste" value={this.state.tc_info.candidate_belongs_to_scheduled_caste} onChange={(e)=>this.setData("candidate_belongs_to_scheduled_caste",e.target.value)} /></td>
													<td className="tc-td2" align='left' >	<p>17. Whether qualified for promotion to the standard</p>
															<p>ತರಗತಿಗೆ ಉತ್ತೀರ್ಣಗೊಳಿಸಲು ಅರ್ಹನಾಗಿದ್ದಾನೆಯೇ?</p>
                              <TextField id="qualified_for_promotion" value={this.state.tc_info.qualified_for_promotion} onChange={(e)=>this.setData("qualified_for_promotion",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>18. Date of Birth</p>
															<p>ಹುಟ್ಟಿದ ದಿನಾಂಕ (ಅಕ್ಷರಗಳಲ್ಲಿ ಮತ್ತು ಅಂಕಿಗಳಲ್ಲಿ)</p></td>
													<td className="tc-td2" align='left' ><TextField id="date_of_birth" value={this.state.tc_info.date_of_birth} onChange={(e)=>this.setData("date_of_birth",e.target.value)}/></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>19. Standard in which the pupil was reading at the time of leaving the School(in words)</p>
															<p>ಶಾಲೆಯನ್ನು ಬಿಡುವಾಗ ವಿದ್ಯಾರ್ಥಿಯು ಓದುತ್ತಿದ್ದ ದರ್ಜೆ-ತರಗತಿ (ಅಕ್ಷರಗಳಲ್ಲಿ)</p>  </td>
													<td className="tc-td2" align='left' ><TextField id="leaving_standard" value={this.state.tc_info.leaving_standard} onChange={(e)=>this.setData("leaving_standard",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' ><p>20. In the case of Pupil of Higher Standards</p>
															<p>ಪ್ರೌಢ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳ ವಿಷಯದಲ್ಲಿ</p>
															<p>Languages Studied:
                              <TextField id="languages_studied" value={this.state.tc_info.languages_studied} onChange={(e)=>this.setData("languages_studied",e.target.value)} /></p>
															<p>ಅಧ್ಯಯನ ಮಾಡಿದ ಭಾಷೆ</p>
															<p>Elective Studied:
                              <TextField id="electives_studied" value={this.state.tc_info.electives_studied} onChange={(e)=>this.setData("electives_studied",e.target.value)} /></p>
															<p>ಅಧ್ಯಯನ ಮಾಡಿದ ಐಚ್ಚಿಕ ವಿಷಯಗಳು</p></td>
														<td className="tc-td2" align='left' ><p>26. Whether Medically Examined or not</p>
															<p>ವ್ಯೆದ್ಯಕೀಯ ಪರೀಕ್ಷೆ ಮಾಡಿಸಲಾಗಿದೆಯೇ ಅಥವಾ ಇಲ್ಲವೇ</p>
                              <TextField id="medically_examined" value={this.state.tc_info.medically_examined} onChange={(e)=>this.setData("medically_examined",e.target.value)} />  </td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>27. Date of student's last attendance at College</p>
															<p>ಶಾಲೆಗೆ ವಿದ್ಯಾರ್ಥಿಯು ಕಡೆಗೆ ಹಾಜರಾಗಿದ್ದ ದಿನಗಳ ಸಂಖ್ಯೆ</p>
                              <TextField id="last_attendance_date" value={this.state.tc_info.last_attendance_date} onChange={(e)=>this.setData("last_attendance_date",e.target.value)} />  </td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>21. Medium of Instruction:</p>
															<p>ಬೋಧನಾ ಮಾಧ್ಯಮ</p>
                              <TextField id="medium_of_instruction" value={this.state.tc_info.medium_of_instruction} onChange={(e)=>this.setData("medium_of_instruction",e.target.value)} /></td>
													<td className="tc-td2" align='left' >	<p>28. Date on which the application for the Transfer Certificate was received</p>
															<p>ವರ್ಗಾವಣೆ ಪ್ರಮಾಣ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿಯನ್ನು ಸ್ವೀಕರಿಸಿದ ದಿನಾಂಕ</p>
                              <TextField id="application_date" value={this.state.tc_info.application_date} onChange={(e)=>this.setData("application_date",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>22. Date of Admission or Promotion to that Class or Standard:</p>
															<p>ಆ ವರ್ಗಕ್ಕೆ ಅಥವಾ ತರಗತಿಗೆ ಪ್ರವೇಶ ಪಡೆದ ಅಥವಾ ಬಡ್ತಿ ಪಡೆದ ದಿನಾಂಕ</p>
                              <TextField id="date_of_admission" value={this.state.tc_info.date_of_admission} onChange={(e)=>this.setData("date_of_admission",e.target.value)} /></td>
													<td className="tc-td2" align='left' ><p>29. Date of issue of the Transfer Certificate</p>
															<p>ವರ್ಗಾವಣೆ ಪ್ರಮಾಣ ಪತ್ರ ನೀಡಿಕೆ ದಿನಾಂಕ</p>
                              <TextField id="issue_date" value={this.state.tc_info.issue_date} onChange={(e)=>this.setData("issue_date",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>23. Whether all Balance of fees paid or not</p>
															<p>ಶಾಲೆಗೆ ಬಾಕಿಯಿರುವ ಎಲ್ಲಾ ಶುಲ್ಕಗಳನ್ನೂ ವಿದ್ಯಾರ್ಥಿಯು ಪಾವತಿ ಮಾಡಿದ್ದಾನೆಯೇ?</p>
                              <TextField id="balance_paid" value={this.state.tc_info.balance_paid} onChange={(e)=>this.setData("balance_paid",e.target.value)} /></td>
													<td className="tc-td2" align='left' >	<p> 30. Number of School days up to the date of leaving</p>
															<p>ಶಾಲೆ ಬಿಟ್ಟ ದಿನಾಂಕದವರೆಗಿನ ಶಾಲೆಯ ದಿನಗಳ ಸಂಖ್ಯೆ</p>
                              <TextField id="total_days_attended" value={this.state.tc_info.total_days_attended} onChange={(e)=>this.setData("total_days_attended",e.target.value)} /> </td>
														</tr>
														<tr>
															<td className="tc-td1" width='55%' align='left' >	<p>24. Fee concessions, if any(nature and period to be specified)</p>
															<p>ವಿನಾಯಿತಿ ಯಾವುದಾದರೂ ಇದ್ದಲ್ಲಿ (ಸ್ವರೂಪ ಮತ್ತು ಅವಧಿಯನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸತಕ್ಕದ್ದು)</p>
                              <TextField id="fee_concession" value={this.state.tc_info.fee_concession} onChange={(e)=>this.setData("fee_concession",e.target.value)} /></td>
													<td className="tc-td2" align='left' >	<p>31. Total Number of days the pupil attended</p>
															<p>ವಿದ್ಯಾರ್ಥಿಯು ಕಾಲೇಜಿಗೆ ಹಾಜರಾದ ಒಟ್ಟು ದಿನಗಳು</p>
                              <TextField id="total_days_attended" value={this.state.tc_info.total_days_attended} onChange={(e)=>this.setData("total_days_attended",e.target.value)} /></td>
														</tr>
														<tr>
															<td className="tc-td1-last" width='55%' align='left' ><p>25. Scholarship if any(nature and period to be specified)</p>
															<p>ವಿದ್ಯಾರ್ಥಿ ವೇತನ ಯಾವುದಾದರೂ ಇದ್ದಲ್ಲಿ (ಸ್ವರೂಪ ಮತ್ತು ಅವಧಿಯನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸತಕ್ಕದ್ದು)</p>
                              <TextField id="scholarship" value={this.state.tc_info.scholarship} onChange={(e)=>this.setData("scholarship",e.target.value)} /></td>
													<td className="tc-td2-last" align='left' ><p>32. Character and conduct</p>
															<p>ಶೀಲ ಮತ್ತು ಚಾರಿತ್ರ್ಯ</p>
                              <TextField id="character_and_conduct" value={this.state.tc_info.character_and_conduct} onChange={(e)=>this.setData("character_and_conduct",e.target.value)} /></td>
														</tr>
												
													</table>

													<br />
                          <br />
                          <br />
													<p className="tc-signature">Signature of the Head of the Institution</p>
  
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
