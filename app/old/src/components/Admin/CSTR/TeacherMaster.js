import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import { withRouter } from 'react-router-dom';
import {Animated} from "react-animated-css";
import GroupWork from "@material-ui/icons/GroupWork";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import logo from "@assetss/images/egenius_logo.png";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../config';
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

class TeacherMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      selectedDate:new Date(),
      enddate: new Date(),
      selectedSection:'',
      selectedStandard:'',
      classInfo:'',
      standardSuggestions:[],
      staffData:[],
      studentInfo:'',
      activestandardSubjects:[],
      standardSubjects:[],
      roommasterDetails: [],
      tags: [],
      mapclassDetails:[],
      filterSections: [],
      lstandardSections: [],
      streamDetails:[],
      standardSections: [],
      standardSuggestions:[],
      classmasterDetails:[],
      academicsetting: [],
      documentInfo:'',
      classholders: [{ standards: '', sections: '', streams: '', academics: '' }],
      roomholders: [{ floor: '', roomno: '', roomname: '' }],
      suggestions:[],
      studentSuggestions:[],
      studentDocuments:[],
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

  handleDateChange = (date) => {
    this.setState({ selectedDate: date })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

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

  getAcademicSettingData() {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          this.setState({ academicsetting: response.data });
        }
      }
    }).catch(error => {
      console.log(error)

    });
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

  handleStaffSubject = (id, index, status) => {
    let lboards = this.state.activestandardSubjects;
    lboards.map(element => {
      if (element.id == id) {
        lboards[index].checked = !status;
      }
    });
    this.setState({ activestandardSubjects: lboards });
  }


  getStandardSectionDetails() {
    const postData = {
      count: "subject",
      type:"cstr",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    };
    console.log(postData);
    new Service().apiCall('ClassDetails/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        let sectionDetails = response.data;
        const lsectionList = response.data.map((data) => {
          return { ...data, checked: false };
        });
        var lStandardSections = [];
        sectionDetails.forEach(element => {
          if (lStandardSections[element.standard_id]) {
            var lSection = {};
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.active_teacher_count = element.active_teacher_count;
            lSection.active_subject_count = element.active_subject_count;
            lStandardSections[element.standard_id].standards.push(lSection);
          } else {
            var lStandard = {};
            var lSection = {};
            lStandard.standard_name = element.standard_name;
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.active_teacher_count = element.active_teacher_count;
            lSection.active_subject_count = element.active_subject_count;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);

            lStandardSections[element.standard_id] = lStandard;

          }

        });

        this.setState({ lstandardSections: sectionDetails, filterSections: sectionDetails, sectionList: lsectionList, masterSectionList: lsectionList, standardSections: lStandardSections });
      } else {
        this.setState({ lstandardSections: [], filterSections: [], sectionList: [], masterSectionList: [], standardSections: [] });
      }
    }).catch(error => {
      console.log(error);

    });

  }

  getClassmasterDetails(id_board, id_academicyear) {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassMasters/getClassMasterDetails', postData).then(response => {
      
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          let data = [];

          response.data.forEach(element => {
            data.push({ id: element.id, value: element.standard + " " + element.section });
          });
        
          this.setState({ standardSuggestions: data, classmasterDetails: response.data });
        }
      } else {
        this.setState({ standardSuggestions: [], classmasterDetails: [], activeclassmasterDetails: [], inactiveclassmasterDetails: [], allClassmasterDetails: [] });
      }
    }).catch(error => {
      this.showError(error.response.data);

    });
  }


updateStreamData = (streamSelections) =>{
  const postData = {
    streamSelections: streamSelections,
    id_academicyear: this.state.selectedAcademicYear,
    id_board: this.state.selectedBoard,
    id_organization: this.props.data.selectedOrganizationId,
    id_institute: this.props.data.selectedInstitutionId,
    role_id:this.props.data.role_id,
    token: "abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ClassMasters/updateStreamDetails', postData,
  {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  ).then(response => {
    if (response.status==200 && response.data!='') {
           this.setState({
     basicNotify: (
       <Dialog open={true}>
     <div className="text-center p-5">
       <h4 className="font-weight-bold">Streams Inserted</h4>
     </div>
   </Dialog>
     ),
   });
      setTimeout(() => {
       // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
       window.location.reload()
      }, 2000)
    } else {
      //this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
    this.showError(error.response.data);
  });
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
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({staffData:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({staffData:newArray});
      }

    }else{
      this.setState({staffSuggestions:[],staffData:[]});
    }  
  }).catch(error => {
    console.log(error);

  });
}

renderStaffSubject = () => {
  let lboards = this.state.activestandardSubjects;
  let selectedSatffSubjectIds = "";
  let selectedids = [];
  lboards.map(element => {
    if (element.checked == true) {
      selectedids.push(element.id);
    }
  });
  if (selectedids.length > 0) {
    selectedSatffSubjectIds = selectedids.join(',');
  }
  // this.getSubjectDetails(thselectedSectionsIds);
  this.updateStaffData(this.state.selectedStaffId, this.state.classInfo.id, selectedSatffSubjectIds);
  this.setState({ roomSubjectSelectedIds: selectedSatffSubjectIds });
}
updateStaffData(id_staff, id_section, selectedSatffSubjectIds) {
  const postData = {
    id_staff: id_staff,
    id_section: id_section,
    selectedSatffSubjectIds: selectedSatffSubjectIds,
    id_academicyear: this.state.selectedAcademicYear,
    id_board: this.state.selectedBoard,
    id_organization: this.props.data.selectedOrganizationId,
    id_institute: this.props.data.selectedInstitutionId,
    role_id:this.props.data.role_id,
    token: "abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('SubjectStandardStaffs/staffSubjectMap', postData,
    {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
  ).then(response => {
    console.log(response)
    if (response.status == 200 && response.data != '') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
        <div className="text-center p-5">
          <h4 className="font-weight-bold">Subjectwise Staff Alloted</h4>
        </div>
      </Dialog>
        ),
      });
      setTimeout(() => {
        this.setState({ basicNotify: false });
        window.location.reload()
      }, 2000)
    } else {
     // this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
    this.showError(error.response.data);
  });
}

renderSelectedStreams = () => {
  const lUserData = this.props.data;
  let lstdstreams = this.state.streamDetails;
  let selectedSectionIds = "";
  let selectedSection = "";
  let selected = [];
  let selectedids = [];
  lstdstreams.map(element => {
    selected[element.id] = new Array();
    element.streams.map((stream, sindex) => {
      var ldata = {};
      if (stream.checked == true) {
        selected[element.id].push(stream.stream);
      }
    });
    if (selected[element.id].length > 0) {
      selectedids[element.id] = selected[element.id].join(',');
    }

  });
  //if(selected.length > 0){
  // selectedSectionIds = selected.join(',');
  // selectedSection = selectedids;
  //}
  this.setState({ streamSelections: selectedids });
  this.updateStreamData(selectedids);


}



  handleClassSearch = (val) => {
    this.setState({ classInfo: val});
    this.getSectionSubjectDetails(val.id);
    this.getStaffSubjectsWithId(val.id,this.state.selectedStaffId);
  }

  getStaffSubjectsWithId(id_section,id_staff) {
    const postData = {
      id_section: id_section,
      id_staff:id_staff,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('SubjectStandardStaffs/getTeacherSubjectsClassWise', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          let sub = [];
          response.data.map(ele=>{
            sub.push(ele.id_subject);
          })
          console.log(sub)
          this.setState({ selectedSubjects:sub });
          this.getSectionSubjectDetails(id_section,sub);
        }
      } else {
        this.setState({ selectedSubjects: [] });
      }
    }).catch(error => {
      console.log("error");

    });
  } 


  handleStreamChecked(standard, idx, id, status) {
    let lstreams = this.state.streamDetails;
    lstreams[idx].streams[id].checked = !status;
    this.setState({ streamDetails: lstreams });
  }


  getSectionSubjectDetails(id_section, selectedSubjects, selectedStaffSection) {
    const postData = {
      type: 'cstr',
      standard_id: id_section,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('SubjectStandards/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        var lAllSubjectStandards = [];
        var lActiveSubjectStandards = [];
        var lInActiveSubjectStandards = [];
        response.data.forEach(element => {
          console.log(''+element.id)
          var lAllSubjectStandard = {};
          lAllSubjectStandard.id = element.id;
          lAllSubjectStandard.smid = element.smid;
          lAllSubjectStandard.name = element.name;
          lAllSubjectStandard.status = element.status;
          lAllSubjectStandard.type = element.type;
          lAllSubjectStandard.teacher_count = element.teacher_count;
          lAllSubjectStandard.checked = false;
          if (selectedSubjects && selectedSubjects.includes(element.id)) {
            lAllSubjectStandard.checked = true;
          }
          if (selectedStaffSection && selectedStaffSection.includes(element.id)) {
            lAllSubjectStandard.checked = true;
          }
          lAllSubjectStandards.push(lAllSubjectStandard);
          if (element.status == 1) {
            var lActiveSubjectStandard = {};
            lActiveSubjectStandard.id = element.id;
            lActiveSubjectStandard.name = element.name;
            lActiveSubjectStandard.status = element.status;
            lActiveSubjectStandard.type = element.type;
            lActiveSubjectStandard.teacher_count = element.teacher_count;
            lActiveSubjectStandard.checked = false;
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
              lActiveSubjectStandard.checked = true;
            }
            if (selectedStaffSection && selectedStaffSection.includes(element.id)) {
              lActiveSubjectStandard.checked = true;
            }
            lActiveSubjectStandards.push(lActiveSubjectStandard);
          }
          if (element.status == 0) {
            var lInActiveSubjectStandard = {};
            lInActiveSubjectStandard.id = element.id;
            lInActiveSubjectStandard.name = element.name;
            lInActiveSubjectStandard.status = element.status;
            lInActiveSubjectStandard.type = element.type;
            lInActiveSubjectStandard.checked = false;
            lInActiveSubjectStandard.teacher_count = element.teacher_count;
            if (selectedSubjects && selectedSubjects.includes(element.id)) {
              lInActiveSubjectStandard.checked = true;
            }
            lInActiveSubjectStandards.push(lInActiveSubjectStandard);
          }

        })
        this.setState({ standardSubjects: response.data, allstandardSubjects: lAllSubjectStandards, activestandardSubjects: lActiveSubjectStandards, inactivestandardSubjects: lInActiveSubjectStandards });
      } else {
        this.setState({ standardSubjects: [], allstandardSubjects: [], activestandardSubjects: [], inactivestandardSubjects: [] });
      }
    }).catch(error => {
      console.log("error.response.data.message");

    });
  }


  componentDidMount() {
   this.getClassmasterDetails();
   this.getStaffDetails();
   this.getStandardSectionDetails();
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
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/cstrmodule")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
             Teacher Master
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
     

       <Grid container justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Staff List
                </h4>
              </div>
        </div>
    <ReactTable

data={
  this.state.staffData.map((original,key) => {
    return ({
      slno: key+1,
      uid:original.UID,
      name: original.first_name+" "+original.last_name,
      board:original.board,
      designation: original.designation_data,
      phone_no:original.phone_no,
      assigned:original.assigned,
      actions: (
        <div>
         {AuthHelper('CSTR','can_edit') && <Tooltip
          id="tooltip-top"
          title="Map staff to standard"
          placement="top"
          >
          <Button
          simple="true"
          onClick={() => { this.setState({selectedStaffId:original.UID, roomMapPanel: true, standardSubjects:[], classInfo:'' }); }}
          color="secondary"
          className="edit"
          >
          <Edit />
          </Button>
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
    width: 90,
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="sno"   
    value={filter ? filter.value : ''}
    placeholder="S No"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
    {
      Header: "UID",
      accessor: "uid",
      width: 90,
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="uid"   
    value={filter ? filter.value : ''}
    placeholder="Search UID"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
      },
    {
    Header: "Name",
    accessor: "name",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="name"   
    value={filter ? filter.value : ''}
    placeholder="Search Name"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
    
    {
    Header: "Contact No",
    accessor: "phone_no",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="conatct"   
    value={filter ? filter.value : ''}
    placeholder="Search Contact No"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
    {
      Header: "Designation",
      accessor: "designation",
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="designation"   
    value={filter ? filter.value : ''}
    placeholder="Search Designation"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
      },
{
Header: "Actions",
width: 90,
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
    <CardActions  style={{marginTop:0}}>

  </CardActions>

        </Card></Grid> 
        </Grid>

 
<Drawer
anchor="right"
open={this.state.roomMapPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({roomMapPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({roomMapPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {this.state.selectedRoomName}
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10}>
          <Autocomplete
          type="room"
          SearchPlaceholderText="Search Class "
          suggestions={this.state.standardSuggestions}
          onSelected={this.handleClassSearch}
          {...this.props}
          /> 
        </Grid>
        </Grid>
        {this.state.standardSubjects.length > 0 &&    
        <Card className="card-box  mb-4 mt-4">
<CardContent>
<Grid container spacing={4}>
<Grid item xs={12} md={6} lg={6}>
<Typography variant="h5">
  Standard: {this.state.classInfo.value}
  </Typography>                                   
</Grid>  
<Grid item xs={12} md={6} lg={6}>

</Grid>  
</Grid>
      <Grid container  spacing={4} >
      {this.state.activestandardSubjects.map((element, idx) => (
      <Grid item xs={12} sm={12} md={6}><FormControlLabel
      control={
      <Checkbox
      tabIndex={-1}
      checked={element.checked}
      onClick={() => { this.handleStaffSubject(element.id, idx, element.checked) }}

      />
      }

      label={element.name}
      /></Grid>

      ))}
      </Grid>
</CardContent>
</Card>  }
      <Grid container spacing={4} justify="center" className="studentSearch">
        <Grid item xs={12} md={8} lg={10} className="text-right">
          <Button color="secondary" variant="contained" onClick={()=>this.renderStaffSubject()}>Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(withRouter(TeacherMaster));
