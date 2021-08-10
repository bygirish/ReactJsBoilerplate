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
      dialogOpen:true,
      actionType:AuthHelper('Course Management','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      staffSuggestions:[],
      selectedStandards:[],
      statusList:["Approved","Rejected","Pending"],
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
      applicationsList:[],
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

  

  handleChangeStatus = (cellInfo, event,id, name) => {
    let data = [...this.state.applicationsList];
    data[cellInfo.index][name] = event.target.value;
    this.setState({ data });
  };

  getApplications = () => {
    this.setState({applicationsList:[]});
    const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_board:this.props.data.selectedBoardId,
    usertype: this.props.data.usertype,
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('LeaveManagement/get_data',postData).then(response => {
      if (response.status==200 && response.data!='') {  
        this.setState({applicationsList:response.data});
      } 
    }).catch(error => {
      console.log(error);

    });
  }

  renderStatus = (cellInfo) => {
    const cellValue = this.state.applicationsList[cellInfo.index].leave_status;
  if(this.props.data.usertype == "admin"){
      return (
        <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="outlined-select-currency"
                    select
                    label="Change Status"
                    value={cellValue}
                    onChange={(event,child)=>    this.handleChangeStatus(cellInfo,event,child.props.id, "leave_status")}
                    variant="outlined">
                    {this.state.statusList.map(option => (
                      <MenuItem key={option} name={option} id={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
        </FormControl>
    ); 
   }
   else{
     return cellValue;
   }    
  };

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
          this.getApplications();
          setTimeout(() => {
            this.setState({ basicNotify:false});
          }, 2000) 
        }
      }).catch(error => {
        console.log(error);
      });
    }



  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
  }

  handleSelecteSidebardSection = (id,name) => {
    this.getApplications(id);
  }

  handleStandardSelected = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,standardPanel:false, allData:false });
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
    this.getApplications();
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/leave-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              View Applications
            </Typography>
               </Grid>
  
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
   

        <Grid container spacing={4}  justify="center">

        <Grid item xs={12} md={8} lg={8}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
               Leave Applications
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.applicationsList.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          UID:original.UID,
          name: original.name,
          from_date: original.from_date,
          to_date:original.to_date,
          type:original.type,
          description:original.description,
          posting_date:moment(original.posting_date).format("DD/MM/YYYY"),
          leave_status:original.leave_status,
          subject:original.subject_name,
         
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
  Header: "UID",
  accessor: "UID",
  show:this.props.data.usertype == "admin"?true:false,
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
  Header: "Staff Name",
  accessor: "name",
  show:this.props.data.usertype == "admin"?true:false,
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
Header: "Leave Type",
accessor: "type",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Type"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "From Date",
accessor: "from_date",
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
  Header: "To Date",
  accessor: "to_date",
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
    accessor: "leave_status",
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
    Cell:this.renderStatus
    }
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Leave Management','can_export') &&  <Grid container spacing={4}>
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
          <CardActions>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
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
