import React, { Fragment, createRef } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { PageTitle } from '../../../../layout-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Dialog,Grid,Drawer,Box,IconButton,Typography,AppBar,Toolbar,Card,CardContent,FormControlLabel,Radio,Button,FormGroup,Checkbox,Tooltip,Switch,TextField,Slide,FormControl,CardActions,Paper,Chip} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';
import DateFnsUtils from '@date-io/date-fns';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const fileInputRef = createRef();
const fileInput = React.createRef();

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

const fileInputClicked = () => {
  fileInputRef.current.click();
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate:new Date(),
      examList:[],
      selectedExam:"",
      selectedStudent:"",
      standardSubjects:[],
      studentSuggestions:[],
      absentList:[],
      dialogOpen:true,
      basicNotify:false,
      dashboardDetails:[],
      TotalStudentCount:0,
      boardDetails:[],
      subjects: [],

    };

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

  getExamDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,  
    token:"abc",
    type:"offline",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID
    };
    new Service().apiCall('ExamDetails/getExamDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
           this.setState({examList:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }
  getSubjectDetails(id_section){
    const postData = { 
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      type:"assignment",
      standard_id:[id_section],
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('subjectStandards/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ subjects: response.data,standardSubjects:response.data });
      }else{
        this.setState({ subjects: [] });
      }
    }).catch(error => {
      alert("error.response.data.message");

    });
  }

  handleStudentSearch = (val) => {
    if(val!='' && val != undefined){
    this.setState({id_section:val.standard, selectedStudent:val.name, selectedStudentId: val.UID});
    // this.getStandardSubjects(val.standard);
    this.getSubjectDetails(val.standard);
    this.setState({studentPanel:false,subjectPanel:true});
    }else{
      this.setState({studentPanel:false});
    }
  }

  handleDeactive = (id,status) => {
    let switchStatus = "";
    
        switchStatus = "Status Updated";
    
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id: id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamsAttendance/deleteAbsentStudent',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.getAbsentList();
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
        //  window.location.reload()
        this.setState({
          basicNotify:false
        })

        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  getStudentDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('students/getData',postData).then(response => {
   
      if (response.status==200 && response.data!='') {
       
        const newArr = response.data.map(v => ({...v, editable: false}));
            this.setState({studentData:newArr,studentSuggestions:newArr});
      }else{
        this.setState({studentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 

  getAbsentList = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsAttendance/getExamAttendanceDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({absentList:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  saveAbsentList = () => {
    
    let subjects = this.state.standardSubjects;
    let mapped=[];
    console.log({subjects})
    subjects.map(element=>{
      if(element.checked == true){
        mapped.push(element.subject_id);
      }
    });
    let msgText = "Please choose the subject";
    if(mapped.length > 0){
      msgText = mapped.length+" Subjects Marked as Absent";
    
    let mappedIds = mapped.join(",");
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_student:this.state.selectedStudentId, 
      id_exam:this.state.selectedExamId,
      subjects: mappedIds,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    console.log({postData})

    new Service().apiCall('ExamsAttendance/insertExamDetails',postData).then(response => {
      console.log(response);
      if(response.data == 201){
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">Student Is Already Absent</h4>
              </div>
            </Dialog>
          ),
        });
        setTimeout(() => {
          this.setState({ basicNotify:false});
          window.location.reload()
        }, 2000)
      }
      else if (response.status==200 && response.data!='') {
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
              <h4 className="font-weight-bold mt-4">{msgText}</h4>

            </div>
          </Dialog>
          ),
        });
        setTimeout(() => {
        //  this.props.history.push("/admin/exam-attendance")
        window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }else{
    
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="text-center p-5">
            <div className="avatar-icon-wrapper rounded-circle m-0">
              <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130">
                <FontAwesomeIcon
                  icon={['fas', 'times']}
                  className="d-flex align-self-center display-3"
                />
              </div>
            </div>
            <h4 className="font-weight-bold mt-4">{msgText}</h4>

          </div>
        </Dialog>
        ),
      });
      setTimeout(() => {
      //  this.props.history.push("/admin/exam-attendance")
      this.setState({
        basicNotify: false
      })
      }, 2000) 

  }
  } 
  handleSubjectSelection= (type,name,status) => {
    if(type){  
      // this.setState({subjectChecked:true,subjectName:name,lsubject:type, subjectPanel:false});	 
      this.setState({subjectChecked:true,subjectName:name,lsubject:type});
      }
      else{
      this.setState({ subjectChecked:false,subjectName:'',lsubject:'', subjectPanel:false });
      } 
  }

  selectSubject = (idx,status) => {
    let data = this.state.standardSubjects;
    data[idx].checked = !status;
    this.setState({data});
    // this.setState({studentPanel:false,subjectpanel:true});
  }

  getStandardSubjects = (id_section) => {
    
    const postData = {
        id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_exam:this.state.selectedExamId,
      id_section: id_section,
      token:"abc",
      id_user: this.props.data.UID
      };
  
      new Service().apiCall('ExamsTimetable/getExamTimetableSubjects',postData).then(response => {
 
        if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, checked: false}));
            this.setState({standardSubjects:newArr});
        }
        else{
          this.setState({standardSubjects:[]});
        }
      }).catch(error => {
        console.log(error);
       // alert(error);
      });
  }


  componentDidMount() {
    this.getExamDetails();
    this.getStudentDetails();
    this.getSubjectDetails();
    this.getAbsentList();
  }

  render() {
    const width = window.innerWidth;
    const width40p =  width * (40/100)+"px";
    const width50p =  width * (50/100)+"px";

  return (
    <Fragment>
       {this.state.basicNotify}
     
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/exam-attendance")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Mark Attendance
            </Typography>
               </Grid>
            
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      {AuthHelper('Exam Attendance','can_create') &&  <Grid container justify="center">
      <Grid item xs={12} md={4} lg={6}>
          <Card className="card-box mb-4 p-3">
   
           <Grid container  className="customDiv" justify="center">
           <Grid item xs={12} sm={12} md={5} className="mr-2">
           <OutlinedDiv label="Select Exam">
            <Paper component="ul">
          
         {this.state.selectedExam!="" && <li>
            <Chip
            variant="outline"
            color="primary"
            label={this.state.selectedExam}
            className="m-1"
            />
            </li>}
           
            <li onClick={()=>{this.setState({examPanel:true});}}>
            <Chip
            variant="outline"
            color="secondary"
            label={this.state.selectedExam!="" ? "Change Exam" : "Select Exam"}
            className="m-1"
            />
            </li>
             </Paper>
            </OutlinedDiv>    
            </Grid>

            <Grid item xs={12} sm={12} md={5}>
           <OutlinedDiv label="Select Student">
            <Paper component="ul">
            {this.state.selectedStudent!="" && <li>
            <Chip
            variant="outline"
            color="primary"
            label={this.state.selectedStudent}
            className="m-1"
            />
            </li>}
            <li 
            // onClick={()=>{this.setState({studentPanel:true});}}
            >
            <Chip
            onClick={()=>{this.setState({studentPanel:true});}}
            disabled={this.state.selectedExam.length > 0 ?false:true}
            variant="outline"
            color="secondary"
            label={this.state.selectedStudent!="" ? "Change Student" : "Select Student"}
            className="m-1"
            />
            </li>
             </Paper>
            </OutlinedDiv>    
            </Grid>
         
           </Grid>
       
        
          </Card> 
      </Grid>
      </Grid>}

      <Grid container justify="center">
        <Grid item xs={12} md={12} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Absent List
                </h4>
              </div>

            </div>

    
     
    <ReactTable

data={
this.state.absentList.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  UID:original.UID,
  exam_name: original.exam_name,
  student:original.student,
  standard:original.standard,
  subject:original.subject,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }

                
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
  Header: "UID",
  accessor: "UID",
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
    Header: "Exam",
    accessor: "exam_name",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Exam"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
{
Header: "Student",
accessor: "student",
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
Header: "Standard",
accessor: "standard",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search standard"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
Header: "Subject",
accessor: "subject",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Subject"
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
    {AuthHelper('Exam Attendance','can_export') && <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/ExamsAttendance/excelExamStudent?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card></Grid> 
        </Grid>  

      </div>
      </Animated>     
      </Dialog>
      <Drawer

anchor="right"
open={this.state.examPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({examPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({examPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Select Exam
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4">
<CardContent>
{ this.state.examList.map((element, index) => (
                  <Grid container>
                      <Grid xs={12} sm={6} md={12}  style={{textAlign:'left'}}>
                     
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.selectedExamId === element.id}
                          onChange={() => {this.setState({selectedExamId:element.id, selectedExam:element.name, examPanel:false});}}
                          id="driver"
                          name="driver"
                          value="driver"
                          name="radio button enabled"
                        />
                      }
                    
                      label={element.name}
                    />
                  
                  </Grid>
                    </Grid>
                ))}
</CardContent>

</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>


<Drawer
anchor="right"
open={this.state.studentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({studentPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({studentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Select Student
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4">
<CardContent>
<Grid container  justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10}>
          <Autocomplete
          type="student"
          SearchPlaceholderText="Enter name and select from suggestions"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          /> 
        </Grid>
        </Grid>
      
        {/* <Grid container justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10}>
      <FormControl component="fieldset">
      <FormGroup>
      {this.state.standardSubjects.length > 0 && this.state.standardSubjects.map((element,idx)=>
        <div>
        <FormControlLabel
        control={<Checkbox checked={element.checked} onClick={()=>this.selectSubject(idx,element.checked)} name="subject1" />}
        label={element.name+" - "+element.exam_date}
        />
        </div>
      )}
   
      </FormGroup>
      </FormControl>
      </Grid>
      </Grid> */}
      <Grid container  justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10} className="text-right">
          {/* <Button className="successBtnOutline" onClick={()=>this.saveAbsentList()}>Submit</Button> */}
          {/* <Button className="successBtnOutline" onClick={()=>this.setState({subjectpanel:true,studentPanel:false})}>Submit</Button> */}
        </Grid>
        </Grid>  
</CardContent>
</Card>
</div>
</PerfectScrollbar>
</Box>

</Drawer>
<Drawer
anchor="right"
open={this.state.subjectPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({subjectPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({subjectPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Select Subject
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4">
<CardContent>
{/* {this.state.subjects.length > 0 && this.state.subjects.map((element, index) => { */}
{this.state.standardSubjects.length > 0 && this.state.standardSubjects.map((element,idx)=>{
                        return <Grid container>
                        <Grid xs={12} sm={10} md={12}>
                          {/* <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}   
                                checked={(element.id==this.state.lsubject)?this.state.subjectChecked:false}
                                onClick={() => {this.handleSubjectSelection(element.id,element.name,this.state.subjectChecked)}}
                              />
                            }
                            label={element.name}
                          /> */}
                           {/* {this.state.standardSubjects.length > 0 && this.state.standardSubjects.map((element,idx)=> */}
        <div>
        <FormControlLabel
        control={<Checkbox checked={element.checked} onClick={()=>this.selectSubject(idx,element.checked)} name="subject1" />}
        // label={element.name+" - "+element.exam_date}
        label={element.name}
        />
        </div>
      {/* )} */}
                          </Grid> 
                      </Grid>    
                    {/* })} */}
                        })}
</CardContent>
<CardActions>
<Grid container spacing={4}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" color="secondary" onClick={()=>
// this.setState({subjectPanel:false}),
this.saveAbsentList()
 }>
  Submit
</Button>
</Grid>
</Grid>
</CardActions>
</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>
   
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
