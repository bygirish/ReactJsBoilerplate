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

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:'create',
      loading:false,
      dashboardDetails:[],
      leavetypeList:[],
      startdate: new Date(),
      enddate:  new Date(),
      staffSuggestions:[],
      selectedStandards:[],
      allData:true,
      subjects:[],
      selectedStandardId:'',
      selectedSidebarSection:'',
      standardSubjects:[],
      basicNotify:false,
      selectedFile:null,
      leave_description: EditorState.createEmpty(),
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
  onEditorStateChange = leave_description => {
    this.setState({leave_description})};
  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 
  
  
  getLeaveTypes() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('LeaveManagement/getLeaveTypes',postData).then(response => {
      if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, editable: false}));
          if(this.state.showStatus == 'all'){
              this.setState({leavetypeList:newArr});
          }
          else{
             var newArray = newArr.filter(x => x.status == this.state.showStatus);
             this.setState({leavetypeList:newArray});
          }
      }
    }).catch(error => {
     // alert("error");

    });

  }

  handleStartDate = (startdate) => {
    this.setState({ startdate: startdate })
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

  applyLeave = () => {
   
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      from_date:moment(this.state.startdate).format("YYYY-MM-DD"),
      to_date:moment(this.state.enddate).format("YYYY-MM-DD"),
      description:this.state.leave_description.getCurrentContent().getPlainText(),
      staff_id:this.props.data.UID,
      type:this.state.selectedTypeId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('LeaveApplications/insert_leaveapplication',postData).then(response => {
    console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Leave Created</h4>
    </div>
  </Dialog>
          ),
        });
     //   this.getExamTimetable();
        setTimeout(() => {
          window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
      alert(error);
    });
  } 


  componentDidMount() {
    this.getLeaveTypes();
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
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/leave-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Apply Leave
            </Typography>
               </Grid>
       
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

     <Grid container spacing={2} justify="center">
     
        <Grid item xs={12} md={8} lg={8}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 ">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Apply Leave
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                  
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Leave Type"
                    value={this.state.selectedTypeId}
                    onChange={(event, child) => this.setState({selectedTypeId:child.props.id})}
                    variant="outlined">
                    {this.state.leavetypeList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.leave_type}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 
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
        label="From date"
        value={this.state.startdate}
        onChange={this.handleStartDate}
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
            <KeyboardDatePicker 
            disableToolbar
            autoOk={true}
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="To date"
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
          editorState={this.state.leave_description}
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
        {AuthHelper('Course Management','can_create') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.applyLeave()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
