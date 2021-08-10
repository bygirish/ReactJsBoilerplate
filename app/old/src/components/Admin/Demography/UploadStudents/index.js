import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,MenuItem,Box,Tabs,ButtonGroup,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel, List} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from "prop-types";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import 'date-fns';
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class UploadStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      loading:false,
      examList:[],
      subjectList:[],
      marksList:[],
      selectedFile:'',
      selectedFileName:'',
      SelectedSectionsIds:'',
      SelectedDepartmentIds:'', 
      basicNotify:false,
      selectedStandardId: '',
      selectedExam:'',
      selectedSubject:'',
      selectedSection: '',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = description => {
    this.setState({description})};
 

  onEditorStateUpdate = event_description => {
    this.setState({event_description})};
  

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,examList:[],subjectList:[],marksList:[] });
  }

  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.searchStudent && this.state.allStudents ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  handleImageChange = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    })
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      selectedFile:null
    });
    fileInput.current.value = null;
  };

  getMarks = e => {
    e.preventDefault();
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:this.state.selectedStandardId,
      id_exam:this.state.selectedExam,
      id_subject:this.state.selectedSubject,
      type:"offline",
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ExamDetails/getExamResults',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ marksList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  }


  handleUpdateChange = (cellInfo, event, name) => {
    let data = [...this.state.marksList];
    data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
    this.setState({ data });
  };

  handleChangeState = (cellInfo, event, name) => {
    let data = [...this.state.marksList];
    data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
    this.setState({ data });
  };

  handleAbsent = (cellInfo) => {
    const status = this.state.marksList[cellInfo.index].status;
    let data = [...this.state.marksList];
    
    if(status == 1){
      data[cellInfo.index].marks = "AB";
      data[cellInfo.index].status = 0;
    }
    else{
      data[cellInfo.index].marks = "";
      data[cellInfo.index].status = 1;
    }
    
    this.setState({ data });
  };

  exportStudentSample = (url) => {
    window.location.href = url;
  }

  renderMarks = (cellInfo) => {
    const cellValue = this.state.marksList[cellInfo.index].marks;
    const status = this.state.marksList[cellInfo.index].status;
      return (
      <FormControl fullWidth>
        <TextField 
          disabled={status == 0 ? true:false}
          inputProps={{
           autoComplete: 'off'
           }} 
         onChange={(event)=>this.handleUpdateChange(cellInfo,event, "marks")}
         value={cellValue}
         label="Marks" 
         type="search" 
         variant="outlined" />
     
      </FormControl>
    );      
  } 


  renderAbsent = (cellInfo) => {
    const cellValue = this.state.marksList[cellInfo.index].max_marks;
    const status = this.state.marksList[cellInfo.index].status;

      return (
        <FormControlLabel
        control={
          <Switch
            
            checked={status == 1 ? true:false}
            onChange={() => this.handleAbsent(cellInfo)}
            value="checkedA"
          
          />
        }
      
        label=""
      />
    );      
  
  };

  handleChangeType = (cellInfo, event,id, name) => {
    let data = [...this.state.timetableData];
    data[cellInfo.index][name] = id;
    this.setState({ data });
  };

  renderTextInput = (name,label) => {
    return (
      <FormControl fullWidth>
      <TextField 
        inputProps={{
         autoComplete: "off",
         pattern: "[a-z]"
        }}
        id={name}   
        value={this.state[name]}
        label={label} 
        type="search" 
        onChange={(event) => this.handleChangeState(name,event.target.value)}
        className="my-2"
        inputRef={this.textInput} 
        variant="outlined" 
     />
     </FormControl>
    )
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
  
  submit = e =>{ 
    e.preventDefault();
    let formData = new FormData();
   formData.append('id_organization',this.props.data.selectedOrganizationId);
   formData.append('id_institute',this.props.data.selectedInstitutionId);
   formData.append('id_board',this.props.data.selectedBoardId);
   formData.append('id_academicyear',this.props.data.selectedAcademicId);
   formData.append('insertFile',this.state.selectedFile);
   formData.append('id_user',this.props.data.UID);
  
    new Service().apiCall('studentDetails/excelStudentsUpload', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => { 
      // console.log('studentupload'+JSON.stringify(response));
      if (response.status==200 && response.data!='') {
        if(response.data === 'inserted'){
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Data Uploaded</h4>
                </div>
              </Dialog>
            ),
          });          
          setTimeout(() => {
            window.location.reload()
            //this.setState({ basicNotify:false,selectedFile:'',selectedFileName:'',groupName:''});
          }, 2000)
        }else if(response.data === 'duplicates'){
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Duplicate Data Not Uploaded</h4>
                </div>
              </Dialog>
            ),
          });

          setTimeout(() => {
            window.location.reload()
            //this.setState({ basicNotify:false,selectedFile:'',selectedFileName:'',groupName:''});
          }, 2000)
        }
         
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  getExamsList(id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      type:"offline",
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ExamDetails/getExamStandardWiseDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ examList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  
  } 

  getExamSubjects(id_section,id_exam) {
    this.setState({subjectList:[]})
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      id_exam:id_exam,
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ExamDetails/getExamSubjectDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ subjectList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  
  } 

  componentDidMount() {

  }

render(){
  const width = window.innerWidth;
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  return (
<Fragment>
{this.state.basicNotify}
<Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
<AppBar className="app-header" color="secondary" position="fixed">
<Toolbar className="w-100">
<Grid container>
<Grid item xs={12} lg={12} className="d-flex">
<IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/student")} aria-label="close">
<CloseIcon />
</IconButton>
<Typography variant="h4" className="p-12">
Upload Students
</Typography>
</Grid>
</Grid>
</Toolbar>
</AppBar>
<Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
<div  className="pt-100">  
<Grid container justify="center">
<Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
          <Grid container>
          <Grid item xs={12} sm={12} md={1}></Grid>
          <Grid item xs={12} sm={12} md={10} className="outlinedInput">
        {this.state.selectedStandardId!='' && <Card className="card-box mb-4 p-3">
          <form
        onSubmit={this.submit.bind(this)}
        autoComplete="off">
            
                <Grid container>
                <Grid item xs={12} sm={12} md={6} className="text-left">
                <Button variant="outlined" color="primary" onClick={()=>this.exportStudentSample(Config.url+"/StudentDetails/excelStudentSample?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId+"&id_section="+this.state.selectedStandardId)}>Sample Excel Format</Button>
                  &nbsp;&nbsp; <input id="fileButton" type="file" onChange={this.handleImageChange} ref={fileInput} hidden />
                  <Button variant="outlined" color="secondary"  onClick={()=>this.handleClick()}>Click to Upload File</Button>{this.state.selectedFileName}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} className="text-right">
                   <Button type="submit" variant="outlined" className="successBtnOutline" >Submit</Button>
                  </Grid>
                </Grid>
                <br></br>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} className="text-left">
                    <p style={{color:'red'}}><b>*Please Add Date of Birth And Admission Date in 'yyyy-mm-dd' format in excel.</b></p>
                  </Grid>
                </Grid>
              </form>
            </Card>}
            </Grid>
            </Grid>
          </Grid>
        </Grid>
</div>
</Animated>
</Dialog>
</Fragment>
  );
};

}
UploadStudents.propTypes = {
  classes: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToPros)(UploadStudents);
