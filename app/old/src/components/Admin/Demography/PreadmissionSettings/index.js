import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
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
      bornStartDate: new Date(),
      enddate:  new Date(),
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
                    "name":"SelectedSectionsIds",
                    "title" : "Standards",
                    "isMandatory":true,
                    "minLength":"",
                    "maxLength":"",
                },
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
    this.setState({ startdate: startdate})
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
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
            style: {textTransform: 'capitalize'},
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


handlePreadmissionSetting = () => {
   
  const lUserData = this.props.data; 
  let data = new FormData();
  let formData = new FormData();
  if(this.validateForm('Settings') == true){

    formData.append('id_board', this.state.selectedBoard);
    formData.append('id_academicyear', this.state.selectedAcademicYear);
    formData.append('id_standard', this.state.SelectedSectionsIds);
    formData.append('start_date', this.state.startdate?moment(this.state.startdate).format("YYYY-MM-DD"):'');
    formData.append('end_date', this.state.enddate?moment(this.state.enddate).format("YYYY-MM-DD"):'');
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
    
    new Service().apiCall('Preadmissions/insertPreadmissionSetting', formData, {
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
                <h4 className="font-weight-bold">Preadmission Settings Inserted</h4>
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
              Preadmission Settings
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
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} lg={8} className="customDiv">
              <OutlinedDiv label="Select Standard">
              <Paper component="ul">
              {this.state.selectedStandards.length > 0 && this.state.selectedStandards.map((data,i) => {
                let icon="";
              return (
              <li key={data.id}>
              <Chip
              icon={icon}
              variant="outline"
              color="primary"
              label={data.name}
              className="m-1"
              />
              </li>
              );
              })}
          
              <li>
              <Chip
              onClick={()=>this.setState({standardPanel:true})}
              variant="outline"
              color="secondary"
              label={this.state.selectedStandards.length > 0?"Change Standard":"Select Standard"}
              className="m-1"
              />
              </li>
              </Paper>
              </OutlinedDiv>
            </Grid>
              
            <Grid item xs={12} md={4} lg={4}>
              <Chip onClick={()=> this.setState({createElligibilityPanel:true})} label="Set Elligibility Criteria" variant="outline" color="secondary" size="medium" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} className="py-1">
              {this.renderTextInput("short_description","Short description(Max 60 characters)")}
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
                  value={this.state.startdate}
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
            value={this.state.enddate}
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
        </Card>
        </Grid>
        </Grid>  

        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Preadmission','can_create') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handlePreadmissionSetting()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </Card>
        </Grid>  

        </Grid>  
  
       

        <Grid container spacing={4} justify="center" className="sliderDiv">
  
        <Grid item xs={12} md={9} lg={9}>
        
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Application Settings List
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.settingDetails.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          standard:original.standard,
          description:original.description,
          start_date: original.start_date,
          end_date:original.end_date,
          prestatus:original.prestatus,
          status:original.status,
          actions: (
            // we've added some custom button actions
            <div className="grouplist-actions">
              { /* use this button to add a like kind of action */ }
            
              {original.status == "1" && <>
                {AuthHelper('Preadmission','can_edit') && <Tooltip
                  id="tooltip-top"
                  title="Preadmission Setting"
                  placement="top"
                  > 
                  <Button
                  simple 
                  onClick={() => { this.props.history.push("/admin/edit-preadmission/"+original.id)}}
                  color="secondary"
                  className="edit"
                  >
                  <Edit />
                  </Button>
                  </Tooltip>}
              </>
              } 

               <Tooltip
                id="tooltip-top"
                title="View"
                placement="top"        
              >
                <Button
                    simple
                    onClick={()=> this.OpenSettingsDetail(original.id)}
                    color="secondary"
                    className="view"
                  >
                    <ViewIcon  />
                </Button>
              </Tooltip>

              <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                  <FormControlLabel
                      control={
                        <Switch
                        checked={original.status == "1" ? true:false}
                        onChange={() => this.handleDeactive(original.id,original.status)}
                        value="checkedA"
                    />
                      }
              
                  label=""/>
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
  Header: "Description",
  accessor: "description",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Description"
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
placeholder="Search Standard"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "Open date",
accessor: "start_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Date"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Close Time",
  accessor: "end_date",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Date"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
  {
    Header: "Status",
    accessor: "prestatus",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Status"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    ),
    Cell: row => ( 
      <div>
        {row.original.prestatus == "Future" &&  <Button
                  simple
                  onClick={()=> {this.setState({viewStudentFeePanel:true})}}
                  color="warning"
                  className="edit"
                >
                  Future
                </Button>}
                {row.original.prestatus == "Running" &&  <Button
                  simple
                  onClick={()=> {this.setState({viewStudentFeePanel:true})}}
                  color="success"
                  className="edit"
                >
                  Running 
                </Button>}
                {row.original.prestatus == "Expired" &&  <Button
                  simple
                  onClick={()=> {this.setState({viewStudentFeePanel:true})}}
                  color="danger"
                  className="edit"
                >
                  Closed
                </Button>}        
      </div>
    ),
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
{AuthHelper('Course Management','can_export') && <Grid container spacing={4}>
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
        </Grid>
               
        {/* GET STANDARD PANEL */}
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
              type="checkbox"
              mappedstandards={this.state.selectedStandards}
              academic_id={this.props.data.selectedAcademicId}
              onSelected={this.handleStandardSelected}
              {...this.props} 
            />
          </CardContent>

          <CardActions>
            <Grid container spacing={4}>
              <Grid item xs={12} md={12} lg={12} className="text-right">
                <Button   variant="outlined" color="secondary" onClick={()=>this.setState({standardPanel:false})}>
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

        {/* GET SETTINGS PANEL */}
        <Drawer

          anchor="right"
          open={this.state.addSettingsPanelll}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({addSettingsPanelll:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={()=> this.setState({addSettingsPanelll:false})} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h5">
                  Settings Detail
                  </Typography>
                
                </Toolbar>
              </AppBar>

              <div className="m-20">
                <Card className="card-box mb-4 p-4">
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={12} lg={12}>
                      {this.state.SettingsDetailHolder.map((element)=>
                        <>
                          <h5 className="my-3">Settings Information</h5>
                          <h6>Standard</h6>
                          <p>{element.standard}</p>
                          <h6>Description</h6>
                          <p>{element.description}</p>
                          <h6>Instruction</h6>
                          <p>{element.instructions}</p>
                          <h6>Application Open</h6>
                          <p><span>{element.start_date}</span> To <span>{element.end_date}</span></p>
                          <h6>Settings Status</h6>
                          <p>{element.setting_status}</p>
                          <h5 className="my-3">Elligibility Criteria</h5>
                          <h6>Born Between</h6>
                          <p><span>{element.born_start_date}</span> To <span>{element.born_send_date}</span></p>
                          <h6>Overall Minimum Marks</h6>
                          <p>{element.overall_minmarks}</p>
                          <h6>Overall Minimum Percentage</h6>
                          <p>{element.overall_minpercentage}</p>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Card>
                  
                {/* <Grid container spacing={4}>
                  <Grid item xs={12} md={12} lg={12} className="text-right m-2">
                    <Button   variant="outlined" color="secondary" onClick={()=>this.setState({addSettingsPanelll:false})}>
                      Submit
                    </Button>
                  </Grid>
                </Grid> */}

              </div>
            </PerfectScrollbar>
          </Box>
        </Drawer>

       
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
                          disableFuture={true}
                          inputProps={{ readOnly: true }}
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
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off',
                        style: {textTransform: 'capitalize'}
                        }}
                        onChange={(event)=>this.handleInputChangeState("overallminMarks", event.target.value)}
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
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off',
                        style: {textTransform: 'capitalize'}
                        }}
                        onChange={(event)=>this.handleInputChangeState("overallminPercentage", event.target.value)}
                        //onChange={(event)=>this.setState({overallminPercentage:event.target.value})}
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
