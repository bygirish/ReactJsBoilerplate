import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      startdate: new Date(),
      enddate:  new Date(),
      dialogOpen:true,
      actionType:AuthHelper('Course Management','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      settingDetails:[],
      staffSuggestions:[],
      selectedStandards:[],
      allData:true,
      subjects:[],
      selectedStandardId:'',
      selectedSidebarSection:'',
      standardSubjects:[],
      basicNotify:false,
      start_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_time:  moment().format("YYYY-MM-DD HH:mm:ss"),
      selectedFile:null,
      workdone_description: EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      workdoneData:'',
      workdoneDetails:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = workdone_description => {
    this.setState({workdone_description})};
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

  handleStartDate = (startdate) => {
    this.setState({ startdate: startdate })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

  getStaffDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_board:this.props.data.selectedBoardId,
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('Staffs/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data =  [];
        response.data.forEach(element => {
            data.push({id:element.UID,name:element.first_name+" "+" "+element.last_name,designation:element.designation, UID:element.UID});
        });
      
        this.setState({staffSuggestions:data});
      }else{
        this.setState({staffSuggestions:[],staffData:[]});
      }  
    }).catch(error => {
      console.log(error);

    });
  }

  // getWorkDone = (id_standard) => {
  //   this.setState({workdoneDetails:[]});
  //   const postData = {
  //   id_organization:this.props.data.selectedOrganizationId,
  //   id_institute:this.props.data.selectedInstitutionId,
  //   id_academicyear:this.props.data.selectedAcademicId,
  //   id_board:this.props.data.selectedBoardId,
  //   token:"abc",
  //   id_standard:id_standard,
  //   id_user: this.props.data.UID
  //   };
  //   new Service().apiCall('Workdone/getData',postData).then(response => {
  //     if (response.status==200 && response.data!='') {
  //       this.setState({workdoneDetails:response.data});
  //     } 
  //   }).catch(error => {
  //     console.log(error);

  //   });
  // }

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

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
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
          className="my-2"
          inputRef={this.textInput} 
          variant="outlined" 
       />
       </FormControl>
      )
  }

  handleTime = (x, name) => {
    let date = moment(x).format('YYYY-MM-DD HH:mm:ss');
    this.setState({[name]:date});
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



  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

    // handleDeactive = (id,status) => {
    //   let switchStatus = "";
    //    if(status == true){
    //       switchStatus = "Workdone Deactivated";
    //    }
    //    else{
    //       switchStatus = "Workdone Activated";
    //    }
    //   const postData = {
    //     id_organization:this.props.data.selectedOrganizationId,
    //     id_institute:this.props.data.selectedInstitutionId,
    //     id_board:this.props.data.selectedBoardId,
    //     id_academicyear:this.props.data.selectedAcademicId,
    //     id: id,
    //     token:"abc",
    //     id_user: this.props.data.UID,
    //   };
    //   new Service().apiCall('Workdone/deleteWorkdone',postData).then(response => {
    //     if (response.status==200 && response.data!='') {
    //       this.setState({
    //         basicNotify: (
    //           <Dialog open={true}>
    //   <div className="text-center p-5">
    //     <h4 className="font-weight-bold">{switchStatus}</h4>
    //   </div>
    // </Dialog>
    //         ),
    //       });
    //       this.getWorkDone();
    //       setTimeout(() => {
    //         this.setState({ basicNotify:false});
    //       }, 2000) 
    //     }
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // }

    getPreadmissionSettingDetails() {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        token:"abc",
        id_user: this.props.data.UID
      }
      new Service().apiCall('Preadmissions/getData',postData).then(response => {
        console.log(JSON.stringify(response));
        if (response.status==200 && response.data!='') {
          if(response.data){
           
            this.setState({ settingDetails: response.data});
          }
        }
      }).catch(error => {
        console.log("error");
    
      });
    }

  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
  }

  // handleSelecteSidebardSection = (id,name) => {
  //   this.getWorkDone(id);
  // }

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards}); 
  }

  getStandardSubjects = (id) => {
  const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    id_section: id,
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('SubjectStandards/getStandardSubjects',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
     
          this.setState({standardSubjects:response.data});

      }
    }).catch(error => {
      alert(error);

    });
}

handleWorkdone = () => {
  const lUserData = this.props.data;

  let data = new FormData();
  let formData = new FormData();
  formData.append('id_board',this.state.selectedBoard);
  formData.append('id_academicyear',this.state.selectedAcademicYear);
  formData.append('id_section',this.state.selectedStandardId);
  formData.append('start_time',moment(this.state.start_time).format("HH:mm:ss"));
  formData.append('end_time',moment(this.state.endd_time).format("HH:mm:ss"));
  formData.append('lesson',this.state.lesson);
  formData.append('details',this.state.workdone_description.getCurrentContent().getPlainText());
  formData.append('path',this.state.selectedFile);
  formData.append('subject',this.state.selectedSubjectId);
  formData.append('staff',this.state.selectedStaffId);
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc');
  formData.append('id_user',this.props.data.UID);
  new Service().apiCall('Workdone/insertWorkdone', formData,
  {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  ).then(response => {
    if (response.status==200 && response.data!='') {
      console.log(response.data);
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Workdone Inserted</h4>
  </div>
</Dialog>
        ),
      });
      setTimeout(() => {
  window.location.reload()
      }, 2000)
     
    } else {
     // this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
   // this.raiseLoginSignupErrorAlert("signup");

  });
}

 
  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewMapped={true}
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.allData == false ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  selectStaff = (event,id) => {
    this.setState({selectedStaffId:id});
  }

  selectSubject = (event,id) => {
    this.setState({selectedSubjectId:id});
  }
  

  componentDidMount() {
    this.getStaffDetails();
    //this.getWorkDone(this.state.selectedStandardId);
    this.getPreadmissionSettingDetails();
  // this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = window.innerWidth;
  const width40p =  width * (40/100)+"px"; 
  const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
        <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
              <Grid item xs={12} lg={6} className="d-flex">
                <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/preadmission")} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" className="p-12">
                  Application Assessment
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
          <div  className="pt-100"> 
            <Grid container spacing={4} justify="center" className="sliderDiv">
              <Grid item xs={12} md={10} lg={10}>
                {this.state.settingDetails.map((element)=>(
                  <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
                    <div className="py-3 px-3 d-flex align-items-center text-center">
                      <div>
                        <span className="font-weight-bold font-size-md">
                        {element.description}
                        </span>
                        <span className="d-block opacity-7">description</span>
                      </div>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center  text-center">
                      <div>
                        <span className="font-weight-bold font-size-md">
                          {element.end_date}
                        </span>
                        <span className="d-block opacity-7">end date</span>
                      </div>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center  text-center">
                      <div>
                        <span className="font-weight-bold font-size-md">
                        {element.applications}
                        </span>
                        <span className="d-block opacity-7">applications</span>
                      </div>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center text-center">
                      <div>
                        <span className="font-weight-bold font-size-md">
                        {element.accepted}
                        </span>
                        <span className="d-block opacity-7">accepted</span>
                      </div>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center text-center">
                      <div>
                        <span className="font-weight-bold font-size-md"> 
                        {element.rejected}
                        </span>
                        <span className="d-block opacity-7">rejected</span>
                      </div>
                    </div>
                    <div className="py-3 px-4 d-flex align-items-center text-center">
                      <div>
                        <span className="font-weight-bold font-size-md">
                        {element.onhold}
                        </span>
                        <span className="d-block opacity-7">not assessed</span>
                      </div>
                    </div>  
                    {element.prestatus == "Running" && <>
                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/add-application-assessment/"+element.id)} startIcon={<AddIcon />}>
                          Application
                        </Button>
                      </div>  

                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-application-assessments/"+element.id)} startIcon={<VisibilityIcon />}>
                          Applications
                        </Button>
                      </div>   
                      </>
                    }

                    {element.prestatus == "Future" && <>
                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="secondary" startIcon={<AddIcon />} disabled>
                          Application
                        </Button>
                      </div>  
                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="secondary" startIcon={<VisibilityIcon />} disabled>
                          Applications
                        </Button>
                      </div>  
                      </>   
                    }

                    {element.prestatus == "Expired" && <>
                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="primary">
                          Application Closed
                        </Button>
                      </div> 
                      
                      <div className="py-3 px-4 d-flex align-items-center text-center">
                        <Button className="m-2 w-100 py-1 font-14" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-application-assessments/"+element.id)} startIcon={<VisibilityIcon />}>
                          Applications
                        </Button>
                      </div>  
                      </> 
                    }     
                          
                  </Card>
                ))}
              </Grid>  
            </Grid>  
                

            <Drawer anchor="right" open={this.state.standardPanel} variant="temporary" elevation={4} onClose={()=> this.setState({standardPanel:false})}>
              <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
                <PerfectScrollbar>
                  <AppBar className="app-header" color="secondary" position="relative">
                    <Toolbar>
                      <IconButton edge="start" color="inherit" onClick={()=> this.setState({standardPanel:false})} aria-label="close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h5">Select Section</Typography>                  
                    </Toolbar>
                  </AppBar>

                  <div className="m-20">
                    <Card className="card-box  mb-4">
                      <CardContent>
                        <StandardSectionsList
                        board_id={this.props.data.selectedBoardId}
                        type="checkbox"
                        mappedstandards={this.state.selectedStandards}
                        academic_id={this.props.data.selectedAcademicId}
                        onSelected={this.handleSelecteSidebardSection}
                        {...this.props} 
                        />
                      </CardContent>

                      <CardActions>
                        <Grid container spacing={4}>
                          <Grid item xs={12} md={4} lg={6}></Grid>
                          <Grid item xs={12} md={4} lg={6} className="text-right">
                            <Button   variant="outlined" color="secondary" onClick={()=>this.setState({standardPanel:false})}>Submit</Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </div>
                </PerfectScrollbar>
              </Box>
            </Drawer>

            <Drawer anchor="right" open={this.state.viewAssignmentPanel} variant="temporary" elevation={4} onClose={()=> this.setState({viewAssignmentPanel:false})}>
              <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
                <PerfectScrollbar>
                  <AppBar className="app-header" color="secondary" position="relative">
                    <Toolbar>
                      <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignmentPanel:false})} aria-label="close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h5">
                      View Assignment
                      </Typography>
                    
                    </Toolbar>
                  </AppBar>
                  
                  <div className="m-20">
                    <Card className="card-box  mb-4 p-3">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={10} md={4}>
                            <strong>Start Time:</strong> {moment(this.state.start_time).format("HH:mm")}
                        </Grid>
                        <Grid item xs={12} sm={10} md={8}>
                          <strong>End Time:</strong> {moment(this.state.end_time).format("HH:mm")}
                        </Grid>
                      </Grid>
                    </Card>

                    <Card className="card-box  mb-4 p-3">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                          <strong>Lesson: </strong> {this.state.workdoneData.lesson}
                        </Grid>
                      </Grid>
                    </Card>

                    <Card className="card-box  mb-4 p-3">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                          <strong>Description: </strong> {this.state.workdoneData.details}
                        </Grid>
                      </Grid>
                    </Card>

                    <Card className="card-box  mb-4 p-3">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                          <strong>Attachments: </strong> {this.state.workdoneData.path}
                        </Grid>
                      </Grid>
                    </Card>
                  </div>
                </PerfectScrollbar>
              </Box>
            </Drawer>


          </div>
        </Animated>
      </Dialog>
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
