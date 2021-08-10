import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from "prop-types";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
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

class AddViewWorkdone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:AuthHelper('Course Management','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      staffSuggestions:[],
      selectedStandards:[],
      allData:true,
      workdoneInfo:'',
      subjects:[],
      selectedStaffId:this.props.data.usertype == "staff" ? this.props.data.UID:'',
      selectedStandardId:'',
      selectedSidebarSection:'',
      standardSubjects:[],
      basicNotify:false,
      date:new Date(),
      workdate:new Date(),
      start_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_time:  moment().format("YYYY-MM-DD HH:mm:ss"),
      selectedFile:null,
      workdone_description: EditorState.createEmpty(),
      description: EditorState.createEmpty(),
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

    onEditorStateUpdate = description => {
    
      this.setState({description})};
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

  handleDate = date => {
    this.setState({date});
  }

  handleUpdateDate = workdate => {
    this.setState({workdate:moment(workdate).format("YYYY-MM-DD")});
  }
  
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

  showError = (error,status) => {
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
         if(status == 401){
          this.props.removeUserData();
          this.props.history.push("/login");
        }
       }, 2000)
    }

  getWorkDone = (id_standard) => {
    this.setState({workdoneDetails:[]});
    const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_board:this.props.data.selectedBoardId,
    token:"abc",
    id_standard:id_standard,
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID
    };
    new Service().apiCall('Workdone/getData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({workdoneDetails:response.data});
      } 
    }).catch(error => {
      if(error.response.status == 500 && error.response.data!=""){
        this.showError(error.response.data,error.response.status)
      }
      else if(error.response.status == 401){
        this.showError('Invalid Auth token. Redirecting to login',error.response.status)
      }
      else{
        console.log(error)
      }

    });
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
           autoComplete: "off"
          }}
          className="mx-1"
          required
          id="document-type"   
          value={this.state.lesson}
          label={label} 
          type="search" 
          onChange={(event) => this.setState({lesson:event.target.value})}
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

  handleUpdateTime = (x, name) => {
    let date = moment(x).format('HH:mm:ss');
    let data = this.state.workdoneInfo;
    data[name] = date;
    this.setState({data});
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

  handleDeactive = (id,status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Workdone Deactivated";
       }
       else{
          switchStatus = "Workdone Activated";
       }
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
      new Service().apiCall('Workdone/deleteWorkdone',postData).then(response => {
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
          this.getWorkDone();
          setTimeout(() => {
            this.setState({ basicNotify:false});
          }, 2000) 
        }
      }).catch(error => {
        if(error.response.status == 500 && error.response.data!=""){
          this.showError(error.response.data,error.response.status)
        }
        else if(error.response.status == 401){
          this.showError('Invalid Auth token. Redirecting to login',error.response.status)
        }
        else{
          console.log(error)
        }
      });
  }

  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
  }

  handleSelecteSidebardSection = (id,name) => {
    this.getWorkDone(id);
  }

  handleStandardSelected = (id) => {
    this.setState({selectedStandardId:id });
    this.getStandardSubjects(id);
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

handleWorkdone = e => {
  e.preventDefault();
  let formData = new FormData();
  formData.append('id_board',this.state.selectedBoard);
  formData.append('id_academicyear',this.state.selectedAcademicYear);
  formData.append('id_section',this.state.selectedStandardId);
  formData.append('date',moment(this.state.date).format("YYYY-MM-DD"));
  formData.append('start_time',moment(this.state.start_time).format("HH:mm:ss"));
  formData.append('end_time',moment(this.state.end_time).format("HH:mm:ss"));
  formData.append('lesson',this.state.lesson);
  formData.append('description',this.state.workdone_description.getCurrentContent().getPlainText());
  formData.append('path',this.state.selectedFile);
  formData.append('subject',this.state.selectedSubjectId);
  formData.append('staff',this.state.selectedStaffId);
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc');
  formData.append('role_id',this.props.data.role_id);
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
    if(error.response.status == 500 && error.response.data!=""){
      this.showError(error.response.data,error.response.status)
    }
    else if(error.response.status == 401){
      this.showError('Invalid Auth token. Redirecting to login',error.response.status)
    }
    else{
      console.log(error)
    }
  });
}

updateWorkdone = () => {
  let formData = new FormData();
  formData.append('id',this.state.workdoneInfo.id);
  formData.append('id_board',this.state.selectedBoard);
  formData.append('id_academicyear',this.state.selectedAcademicYear);
  formData.append('id_section',this.state.selectedStandardId);
  formData.append('date',moment(this.state.date).format("YYYY-MM-DD"));
  formData.append('start_time',this.state.workdoneInfo.start_time);
  formData.append('end_time',this.state.workdoneInfo.end_time);
  formData.append('lesson',this.state.lesson);
  formData.append('description',this.state.description.getCurrentContent().getPlainText());
  formData.append('path',this.state.selectedFile);
  formData.append('subject',this.state.workdoneInfo.subject);
  formData.append('staff',this.state.workdoneInfo.staff);
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc');
  formData.append('role_id',this.props.data.role_id);
  formData.append('id_user',this.props.data.UID);
  new Service().apiCall('Workdone/updateWorkdone', formData,
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
    <h4 className="font-weight-bold">Workdone Updated</h4>
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
    if(error.response.status == 500 && error.response.data!=""){
      this.showError(error.response.data,error.response.status)
    }
    else if(error.response.status == 401){
      this.showError('Invalid Auth token. Redirecting to login',error.response.status)
    }
    else{
      console.log(error)
    }
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

  StandardSectionsDropdown = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="dropdown"
      viewcount="student" 
      viewMapped={true}
      mappedStandard={this.state.selectedStandardId}
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.allData == false ? true : false}
      handleDropdown={this.handleStandardSelected}
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
  
  updateStaff = (event,id) => {
    let data = this.state.workdoneInfo;
    data.staff = id;
    this.setState({data});
  }

  updateSubject = (event,id) => {
    let data = this.state.workdoneInfo;
    data.subject = id;
    this.setState({data});
  }

  componentDidMount() {
    this.getStaffDetails();
    this.getWorkDone(this.state.selectedStandardId);
  // this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = window.innerWidth;
  const width50p =  width * (50/100)+"px";
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/course-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Add/View Workdone
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Course Management','can_create') &&    <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.actionType == "create" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:'create'}); }}>
                  Create
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "view" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:"view"}); }}>
                View
                </Button>
                {/* <Button color="primary" size="small" variant={this.state.actionType == "assessment" ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({actionType:"assessment"}); }}>
                  Marks Completion
                </Button> */}
                  </ButtonGroup>
                </Box>
              </div>}
               </Grid>
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
     {this.state.actionType == 'create' && 
     <Grid container>
      <Grid item xs={12} md={4} lg={1}>
         
        </Grid>
        
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4">
        <form
        onSubmit={this.handleWorkdone.bind(this)}
        autoComplete="off">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Add Workdone
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container>
          <Grid item xs={12} md={12} lg={4} className="customDiv">
          {this.StandardSectionsDropdown()}
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    disabled={this.props.data.usertype == "staff"?true:false}
                    className="m-1"
                    id="outlined-select-currency"
                    select
                    required
                    label="Select Staff"
                    value={this.state.selectedStaffId}
                    onChange={(event, child) => this.selectStaff(event, child.props.id)}
                    variant="outlined">
                    {this.state.staffSuggestions.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 

            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                 
                    className="m-1"
                    id="outlined-select-currency"
                    select
                    required
                    label="Select Subject"
                    value={this.state.selectedSubjectId}
                    onChange={(event, child) => this.selectSubject(event, child.props.id)}
                    variant="outlined">
                    {this.state.standardSubjects.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 
       
 
         
        </Grid>

        <Grid container>
      
      <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker 
        disableToolbar
        autoOk={true}
        variant="inline"
        inputVariant="outlined"
        format="dd/MM/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Date"
        value={this.state.date}
        onChange={this.handleDate}
        KeyboardButtonProps={{
        'aria-label': 'change date',
        }}
        />
        </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          className="mx-1"
          id="time-picker"
    label="Start time"
    inputVariant="outlined"
    value={this.state.start_time}
    onChange={(x, event) => this.handleTime(x, "start_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
      </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          className="mx-1"
          id="time-picker"
    label="End time"
    inputVariant="outlined"
    value={this.state.end_time}
    onChange={(x, event) => this.handleTime(x, "end_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
      </FormControl>
      </Grid>
      <Grid item xs={12} lg={12} className="py-1">
            {this.renderTextInput("lname","Lesson Name")}
        </Grid>
    </Grid>
   
      
   
        <Grid container>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.workdone_description}
          placeholder="Enter description here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Card>
        </Grid>
        </Grid>  

        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Course Management','can_create') &&   <Grid container>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button type="submit"  variant="outlined" className="successBtnOutline">
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </form>
        </Card>
        </Grid>  
        <Grid item xs={12} md={8} lg={4}>
        <Card className="card-box p-4">
        <div className="font-weight-400 text-center font-size-lg">Upload Attachment</div>
        <Divider className="my-2" />
        <FormControl fullWidth>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrl} alt={this.state.imagePreviewUrl} />
                 </div>
               <div>
               {this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                 {"Select file"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove()}>
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
  
         
        </Grid>  
        </Grid>  }

        {this.state.actionType == "view"  && <Grid container  justify={this.props.data.usertype== "admin" ? "none" : "center"}>
        {this.props.data.usertype == "admin" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allData ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getWorkDone();this.setState({searchStudent:false,allData:true,selectedStandardId:''})}}>
                    <span>All</span>
                 
                  </ListItem>
                  <Divider />
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid> }
        <Grid item xs={12} md={8} lg={9}>
        <Grid container >
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Workdone
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.workdoneDetails.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          standrad: original.standrad,
          staff: original.staff_name,
          lesson:original.lesson,
          description:original.description,
          start_time:moment(moment().format("YYYY-MM-DD")+" "+original.start_time).format("hh:mm A"),
          end_time:moment(moment().format("YYYY-MM-DD")+" "+original.end_time).format("hh:mm A"),
          subject:original.subject_name,
          actions: (
            // we've added some custom button actions
            <div className="grouplist-actions">
              { /* use this button to add a like kind of action */ }
            
               <Tooltip
                id="tooltip-top"
                title="View"
                placement="top"
        
              >
                  <Button
                    simple
                    onClick={() => {this.setState({lesson:original.lesson,editWorkdonePanel:true,workdoneInfo:original, workdate:original.date,selectedStandardId:original.id_standard, description:EditorState.createWithContent(ContentState.createFromText(original.description))});this.getStandardSubjects(original.id_standard)}}
                    color="secondary"
                    className="edit"
                  >
                    <Edit  />
                  </Button>
              </Tooltip>
              {AuthHelper('Course Management','can_delete') &&
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
width: 80,
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Teacher",
  accessor: "staff",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Teacher"
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
placeholder="Search Staff"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "Start Time",
accessor: "start_time",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Time"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "End Time",
  accessor: "end_time",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Time"
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
{AuthHelper('Course Management','can_export') &&  <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"Assignments/excelAssignment?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>
        </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={3}></Grid>            
        </Grid>
        </Grid> 
        </Grid>
           }      

        <Drawer

          anchor="right"
          open={this.state.standardPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({standardPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({standardPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Select Section
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4">
          <CardContent>
          <StandardSectionsList
          board_id={this.props.data.selectedBoardId}
          type="sections"
          mappedstandards={this.state.selectedStandards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
          </CardContent>
          </Card>
        </div>
        </PerfectScrollbar>
        </Box>
        </Drawer>

       

<Drawer

anchor="right"
open={this.state.viewAssignmentPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignmentPanel:false})}>
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
<Grid container >
<Grid item xs={12} sm={10} md={4}>
    <strong>Start Time:</strong> {moment(this.state.start_time).format("HH:mm")}
</Grid>
<Grid item xs={12} sm={10} md={8}>
<strong>End Time:</strong> {moment(this.state.end_time).format("HH:mm")}
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
<Grid container >
<Grid item xs={12} sm={12} md={12}>
<strong>Lesson: </strong> {this.state.workdoneData.lesson}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container>
<Grid item xs={12} sm={12} md={12}>
<strong>Description: </strong> {this.state.workdoneData.details}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> {this.state.workdoneData.path}
</Grid>
</Grid>
</Card>

</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.editWorkdonePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({editWorkdonePanel:false,lesson:'',selectedStandardId:''})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({editWorkdonePanel:false,lesson:'',selectedStandardId:''})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Edit Workdone
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container spacing={4} justify="center">
<Grid item xs={12} md={10} lg={12}>
<Card className="card-box  mb-4 ">
<CardContent>
<Grid container>
          <Grid item xs={12} md={12} lg={4} className="customDiv">
          {this.StandardSectionsDropdown()}
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    disabled={this.props.data.usertype == "staff"?true:false}
                    className="m-1"
                    id="outlined-select-currency"
                    select
                    required
                    label="Select Staff"
                    value={this.state.workdoneInfo.staff}
                    onChange={(event, child) => this.updateStaff(event, child.props.id)}
                    variant="outlined">
                    {this.state.staffSuggestions.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 

            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                 
                    className="m-1"
                    id="outlined-select-currency"
                    select
                    required
                    label="Select Subject"
                    value={this.state.workdoneInfo.subject}
                    onChange={(event, child) => this.
                      updateSubject(event, child.props.id)}
                    variant="outlined">
                    {this.state.standardSubjects.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 
       
 
         
        </Grid>

        <Grid container>
        <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker 
        disableToolbar
        autoOk={true}
        variant="inline"
        inputVariant="outlined"
        format="dd/MM/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Date"
        value={this.state.workdate}
        onChange={this.handleUpdateDate}
        KeyboardButtonProps={{
        'aria-label': 'change date',
        }}
        />
        </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          className="mx-1"
          id="time-picker"
    label="Start time"
    inputVariant="outlined"
    value={this.state.workdate+' '+this.state.workdoneInfo.start_time}
    onChange={(x, event) => this.handleUpdateTime(x, "start_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12} lg={4} className="pickerGrid">
      <FormControl fullWidth>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardTimePicker
          margin="normal"
          className="mx-1"
          id="time-picker"
    label="End time"
    inputVariant="outlined"
    value={this.state.workdate+' '+this.state.workdoneInfo.end_time}
    onChange={(x, event) => this.handleUpdateTime(x, "end_time")}     
    KeyboardButtonProps={{
    'aria-label': 'change time', 
    }}
    /> </MuiPickersUtilsProvider>
      </FormControl>
      </Grid>
        <Grid item xs={12} lg={12} className="py-1">
            {this.renderTextInput("lesson","Lesson Name")}
        </Grid>
    </Grid>
   
      
   
        <Grid container>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.description}
          placeholder="Enter description here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateUpdate}
        />
        </Card>
        </Grid>
        </Grid>  
</CardContent>
<CardActions stats style={{marginTop:0}}>
<Grid container spacing={2}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" className="successBtnOutline" onClick={()=>this.updateWorkdone()}>
Update
</Button>
</Grid>
</Grid>
</CardActions>
</Card>
</Grid>  

</Grid>  



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

AddViewWorkdone.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToPros)(AddViewWorkdone);
