import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import 'react-table-6/react-table.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '@utils/AuthHelper.js';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js"; 
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class EditPreadmissionSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      edit_start_date: new Date(),
      bornStartDate: new Date(),
      edit_end_date:  new Date(),
      bornEndDate:  new Date(),      
      dialogOpen:true,
      overallminMarks:'',
      overallminPercentage:'',
      actionType:AuthHelper('Course Management','can_create') ? 'create':'view',
      subjectHolders: [{subject: '', min_mark: ''}],
      loading:false,
      dashboardDetails:[],
      settingDetails:[],
      staffSuggestions:[],
      selectedStandards:[],
      SettingsDetailHolder:[],
      allData:true,
      subjects:[],
      selectedStandardId:'',
      SelectedSectionsIds:'',
      selectedSidebarSection:'',
      short_description:'',
      preadmission_description:'',
      standardSubjects:[],
      basicNotify:false,
      start_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_time:  moment().format("YYYY-MM-DD HH:mm:ss"),
      selectedFile:null,
      editorState: EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      workdoneData:'',
      workdoneDetails:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      forms : {
        "Settings":{
            fields:[
                {
                    "name":"short_description",
                    "title" : "Short Description",
                    "isMandatory":true,
                    "minLength":2,
                    "maxLength":60,
                },
                {
                  "name":"overallminMarks",
                  "title" : "Overall Minimum Marks",
                  "isMandatory":false,
                  "minLength":"",
                  "maxLength":"",
                },
                {
                  "name":"overallminPercentage",
                  "title" : "Overall Maximum Percentage",
                  "isMandatory":false,
                  "minLength":"",
                  "maxLength":"",
                }
              ] 
        }
      }
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  } 

  
  validateForm = (formName) =>{ 
    let selectedForm = this.state.forms[formName];
    let errorMessage = [];
    let isFormValid = true;
    selectedForm.fields.forEach((field , index) =>{
      let fieldValue = this.state[field.name];
      var lFieldErrorMessage = this.validateField(field,fieldValue);
      if(!lFieldErrorMessage == ""){
        isFormValid = false;
        errorMessage.push(lFieldErrorMessage);
      }        
    })
    this.setState({errorMessageArray:errorMessage});
    // alert(errorMessage);
    {isFormValid == false &&
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="p-5">
            <h6 className="font-weight-bold"> 
              {errorMessage.map((element) => 
                <div style={{color:'red', fontSize:13, marginBottom:10}}><Brightness1Icon style={{fontSize:12}} /> {element}</div>
              )}
            </h6>

            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        )
      });
    }
    return isFormValid;
  }

  validateField = (field,FieldValue) => {
    let errorString = "";
    // if(FieldValue.length < field.minLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.minLength;
    // if(FieldValue.length > field.maxLength)
    //     errorString = errorString + "<br>" + field.name + " minimum length should be " + field.maxLength;
    if(FieldValue == '' && field.isMandatory == true){
      errorString = errorString + field.title + " should not be empty";
    }else if(field.maxLength !== ""){
      if(FieldValue.length > field.maxLength){
        errorString = errorString + field.title + " maximum length should be " + field.maxLength;
      }
    }
    
    return errorString;
  }

  handleClose =() =>{
    this.setState({basicNotify:false});
  }


  onEditorStateChange = editorState => {
    this.setState({editorState})
  };

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 
  // selectJoiningStandard = (value) => {
  //   this.setState({joiningStandard:value});
  // }
  // getStateValue = (name) => {
  //   return this.state.name;
  // }

  handleStartDate = (startdate) => {
    this.setState({ edit_start_date: startdate})
  };
  handleEndDate = (enddate) => {
    this.setState({ edit_end_date: enddate })
  };

  handleBornStartDate = (startdate) => {
    this.setState({ bornStartDate:  startdate})
  };
  handleBornEndDate = (enddate) => {
    this.setState({ bornEndDate:  enddate })
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

  getSettingsDetail = (id) => {    
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id:id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('Preadmissions/getData',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({SettingsDetailHolder:response.data});
      } 
    }).catch(error => {
      console.log(error);

    });
  }
  

  // handleClick = () => {
  //   fileInput.current.click(); 
  // };
  // handleRemove = () => {
  //   this.setState({
  //     imagePreviewUrl: defaultImage, selectedFile:null
  //   });
  //   fileInput.current.value = null;
  // };


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

    handleChangeState = (name,value) => {
      this.setState({ [name]: value });
    }

    // Acivate OR Deactivate Settings

    handleDeactive = (id,status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Settings Deactivated";
       }
       else{
          switchStatus = "Settings Activated";
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
      new Service().apiCall('Preadmissions/deletePreadmissionSetting',postData).then(response => {
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
          this.getPreadmissionSettingDetails(); 
          setTimeout(() => {
            this.setState({ basicNotify:false});
          }, 2000) 
        }
      }).catch(error => {
        console.log(error);
      });
    }

    getPreadmissionSettingDetails() { 
      let setting_id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
      const postData = {
        id:setting_id,
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

            const html = response.data[0].instructions;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              this.state = {editorState};
            }
            
            
            this.setState({ settingDetails: response.data, instructions:response.data[0].instructions, edit_start_date:response.data[0].edit_start_date, edit_end_date:response.data[0].edit_end_date, short_description:response.data[0].description, bornStartDate:response.data[0].edit_born_start_date, bornEndDate:response.data[0].edit_born_end_date, overallminMarks:response.data[0].overall_minmarks, overallminPercentage:response.data[0].overall_minpercentage});
          }
        }
      }).catch(error => { 
        console.log("error");
    
      });
    }

    
  // handleSelecteSidebardSection = (id,name) => {
  //   this.getWorkDone(id);
  // }

  handleStandardSelected = (standards) => {
    
    let stdIds = [];
    standards.map((element,index) =>{
       stdIds.push(element.id);
    });
    let selectedStandardId = stdIds.join(",");
    this.setState({SelectedSectionsIds:selectedStandardId, selectedStandards:standards})
  }


handlePreadmissionSetting = (id) => {
   
  const lUserData = this.props.data; 
  let data = new FormData();
  let formData = new FormData();
  if(this.validateForm('Settings') == true){
    formData.append('id', id);
    formData.append('id_board', this.state.selectedBoard);
    formData.append('id_academicyear', this.state.selectedAcademicYear);
    formData.append('start_date', this.state.edit_start_date?moment(this.state.edit_start_date).format("YYYY-MM-DD"):'');
    formData.append('end_date', this.state.edit_end_date?moment(this.state.edit_end_date).format("YYYY-MM-DD"):'');
    formData.append('born_start_date', this.state.bornStartDate?moment(this.state.bornStartDate).format("YYYY-MM-DD"):'');
    formData.append('born_end_date', this.state.bornEndDate?moment(this.state.bornEndDate).format("YYYY-MM-DD"):'');
    formData.append('overall_minmarks', this.state.overallminMarks);
    formData.append('overall_minpercentage', this.state.overallminPercentage);
    formData.append('description',this.state.short_description);
    formData.append('instructions',draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
    formData.append('created_by',lUserData.UID);
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('token','abc');
    formData.append('id_user',this.props.data.UID);
    
    new Service().apiCall('Preadmissions/updatePreadmissionSetting', formData, {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      // console.log(response);
      
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">Preadmission Settings Updated</h4>
              </div>
            </Dialog>
          ),
        });
        
        setTimeout(() => {
          this.props.history.push('/admin/preadmission-settings');
        }, 2000)
      
      } else {
      // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
    // this.raiseLoginSignupErrorAlert("signup");

    });
  }else{
    return false;
  }
}

 
  // sidebarStandardSections = () => {
  //   return(
  //     <StandardSectionsList
  //     board_id={this.state.selectedBoard}
  //     type="sidebar"
  //     viewMapped={true}
  //     viewcount="student" 
  //     institute_id={this.state.selectedInstitutionId}
  //     academic_id={this.state.selectedAcademicId}
  //     active={this.state.allData == false ? true : false}
  //     handleSelectedSection={this.handleSelecteSidebardSection}
  //     {...this.props}
  //   /> 
  //   )
  // }

  selectStaff = (event,id) => {
    this.setState({selectedStaffId:id});
  }

  selectSubject = (event,id) => {
    this.setState({selectedSubjectId:id});
  }

  addSubject = ()=>{
    let data = this.state.subjectHolders;
    let object={subject:'', min_mark:''};
    data.push(object);
    this.setState({data});
  }
  
  removeSubject = (index) =>{                                                  
    const {subjectHolders} = this.state;
    this.setState({ subjectHolders : subjectHolders.filter((data,i)=> i!==index)})
  }  
  
  handleChangeData = (index, name,value) => {
    let data = this.state.subjectHolders;
    data[index][name] = value;
    this.setState({ data });
  };

  //Open SeetingsDetail
  OpenSettingsDetail = (id) => {
    this.getSettingsDetail(id);
    this.setState({addSettingsPanelll:true})
  }
  
  verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  handleInputChangeState = (name,value) => {
    let numberCheck = ["overallminPercentage","overallminMarks"];

    if(numberCheck.includes(name)){
      if (this.verifyNumber(value)){
        this.setState({ [name]: value });
      }
    }else{
      this.setState({ [name]: value });
    }
  }

  componentDidMount() {
    this.getPreadmissionSettingDetails();
    //this.getStaffDetails();
    //this.getWorkDone(this.state.selectedStandardId);
  // this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  const { editorState } = this.state;
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
              Edit Preadmission Settings 
            </Typography>
               </Grid>
          
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
        <div  className="pt-100">
          <Grid container spacing={4} justify="center" className="sliderDiv">
            <Grid item xs={12} md={9} lg={9}>
              <Card className="card-box  mb-4 ">
                <div className="card-header">
                  <div className="card-header--title">
                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                    Create invitation for new applications
                    </h4>
                  </div>
                </div>

                {this.state.settingDetails.map((element,index) => 
                <>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8} lg={8} className="customDiv">
                        <OutlinedDiv label="Select Standard">
                          <Paper component="ul">                        
                            <li key={element.standard}>
                            <Chip
                            variant="outline"
                            color="primary"
                            label={element.standard}
                            className="m-1"
                            /></li>
                          </Paper>
                        </OutlinedDiv>
                      </Grid>
                        
                      <Grid item xs={12} md={4} lg={4}>
                        <Chip onClick={()=> this.setState({createElligibilityPanel:true})} label="Set Elligibility Criteria" variant="outline" color="secondary" size="medium" />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6} className="py-1">
                      <FormControl fullWidth>
                        <TextField 
                          inputProps={{
                            style: {textTransform: 'capitalize'},
                          autoComplete: "off",
                          pattern: "[a-z]"
                          }}
                          id="document-type"   
                          value={this.state.short_description}
                          label="Short description(Max 60 characters)" 
                          type="search" 
                          onChange={(event) => this.setState({short_description:event.target.value})}
                          className="my-2"
                          variant="outlined" 
                        />
                      </FormControl>
                      </Grid>

                      <Grid item xs={12} md={12} lg={3} className="pickerGrid">
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
                            label="Start date"
                            inputProps={{ readOnly: true }}
                            value={this.state.edit_start_date}
                            onChange={this.handleStartDate}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                            />
                          </MuiPickersUtilsProvider>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={12} lg={3} className="pickerGrid">
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
                            label="End date"
                            inputProps={{ readOnly: true }}
                            value={this.state.edit_end_date}
                            onChange={this.handleEndDate}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                            />
                          </MuiPickersUtilsProvider>
                        </FormControl>
                      </Grid>          
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={12} className="py-1">
                        <Card className="card-box my-2 py-2">
                          <Editor
                            editorState={this.state.editorState}
                            placeholder="Enter description here"
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                          />
                          {/* <textarea
                            disabled
                            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                          /> */}
                        </Card>
                      </Grid>
                    </Grid> 
                  </CardContent>

                  <CardActions stats style={{marginTop:0}}>
                    {AuthHelper('Preadmission','can_create') &&   
                      <Grid container spacing={2} justify="center">            
                        <Grid item xs={12} md={12} lg={12} className="text-right">
                          <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handlePreadmissionSetting(element.id)}>Update</Button>
                        </Grid>
                      </Grid>
                    }
                  </CardActions>
                
                </>
                )}
              </Card>
            </Grid>  
          </Grid>  

       
        {/* ELLIGIBILITY PANEL */} 
        <Drawer anchor="right" open={this.state.createElligibilityPanel} variant="temporary" elevation={5} onClose={()=> this.setState({createElligibilityPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
            <PerfectScrollbar>
              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={()=> this.setState({createElligibilityPanel:false})} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h5">
                    Eligibility criteria
                  </Typography>
                </Toolbar>
              </AppBar>

              <div className="m-20">
                <Card className="card-box mb-4 p-3">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="secondary" />}
                        label="Born Between"
                        labelPlacement="end"
                        checked="true"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={4}>
                      <FormControl fullWidth>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                          autoOk
                          margin="normal"
                          id="dob"
                          label="Start Date"
                          inputVariant="outlined"
                          format="MM/dd/yyyy"
                          inputProps={{ readOnly: true }}                          
                          disableFuture={true}
                          value={this.state.bornStartDate}
                          onChange={this.handleBornStartDate}   
                          KeyboardButtonProps={{
                          'aria-label': 'change date',
                          }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={4}>
                      <FormControl fullWidth>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                          autoOk
                          margin="normal"
                          id="dob"
                          label="End Date"
                          inputVariant="outlined"
                          format="MM/dd/yyyy"
                          inputProps={{ readOnly: true }}
                          disableFuture={true}
                          value={this.state.bornEndDate}
                          onChange={this.handleBornEndDate}   
                          KeyboardButtonProps={{
                          'aria-label': 'change date',
                          }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Card> 

                {/* TO-DO */}
                {/* <Card className="card-box  mb-4 p-3">
                  <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={12}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="secondary" />}
                        label="Subjectwise Marks"
                        labelPlacement="end"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                      {this.state.subjectHolders.map((element,index)=>(
                        
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12} md={5}>
                                <FormControl fullWidth>
                                    <TextField 
                                    inputProps={{
                                    autoComplete: 'off',
                                    style: {textTransform: 'capitalize'}
                                    }}
                                    onChange={(event)=>this.handleChangeData(index, "subject", event.target.value)}
                                    value={element.subject}
                                    id="document-type"   
                                    label="Subject" 
                                    type="search" 
                                    variant="outlined" required/>
                                    </FormControl>
                            </Grid>                                                        

                            <Grid item xs={12} sm={12} md={3}>
                                <FormControl fullWidth>
                                    <TextField 
                                    inputProps={{
                                    autoComplete: 'off',
                                    style: {textTransform: 'capitalize'}
                                    }}
                                    onChange={(event)=>this.handleChangeData(index,"min_mark", event.target.value)}
                                    value={element.no_of_beds}
                                    id="document-type"   
                                    label="Min Marks" 
                                    type="search" 
                                    variant="outlined" required/>
                                    </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} lg={2} className="text-center">
                              {index == 0 ?  <FormControl fullWidth>
                                    <TextField 
                                    InputProps={{
                                        autoComplete: 'off',
                                        readOnly: true,
                                        startAdornment: (
                                        <InputAdornment position="start">
                                        <Add onClick={()=>this.addSubject()} style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
                                        </InputAdornment>
                                        ),
                                        }}
                                        id="document-type" label="Add" variant="outlined" />
                                </FormControl>:
                                <FormControl fullWidth>
                                <TextField 
                                InputProps={{
                                    autoComplete: 'off',
                                    readOnly: true,
                                    startAdornment: (
                                    <InputAdornment position="start">
                                    <Remove onClick={()=>this.removeSubject(index)} style={{color:'rgb(248, 50, 69)', cursor:'pointer'}} />
                                    </InputAdornment>
                                    ),
                                    }}
                                    id="document-type" label="Remove" variant="outlined" />
                            </FormControl>}
                            </Grid>
                        </Grid>
                      ))}
                    </Grid>

                  </Grid>
                </Card> */}

                <Card className="card-box  mb-4 p-3">
                  <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={4}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="secondary" />}
                        label="Overall min marks"
                        labelPlacement="end"
                        checked={this.state.overallminMarks <= 0 ? false:true}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off',
                        style: {textTransform: 'capitalize'}
                        }}
                        onChange={(event)=>this.setState({overallminMarks:event.target.value})}
                        //onChange={(event)=>this.handleInputChangeState("overallminMarks", event.target.value)}
                        value={this.state.overallminMarks}
                        id="document-type"   
                        label="Min Marks" 
                        type="search" 
                        variant="outlined" required/>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Card>

                <Card className="card-box  mb-4 p-3">
                  <Grid container spacing={2}>
                    
                    <Grid item xs={12} sm={12} md={4}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="secondary" />}
                        label="Overall min percentage"
                        labelPlacement="end"
                        checked={this.state.overallminPercentage <= 0 ? false:true}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off',
                        style: {textTransform: 'capitalize'}
                        }}
                        onChange={(event)=>this.setState({overallminPercentage:event.target.value})}
                        value={this.state.overallminPercentage}
                        id="document-type"   
                        label="Min Percentage" 
                        type="search" 
                        variant="outlined" required/>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Card>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12} className="text-right m-2">
                    <Button   variant="outlined" color="secondary" onClick={()=>this.setState({createElligibilityPanel:false})}>
                      Submit
                    </Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(EditPreadmissionSetting);
