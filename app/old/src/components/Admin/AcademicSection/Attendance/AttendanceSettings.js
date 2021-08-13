import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {Paper,Grid,Chip,FormControlLabel,ButtonGroup,Dialog,Drawer,Toolbar,Card,CardContent,Checkbox,TextField,Button,Avatar,List,MenuItem,Slide,FormControl,Box,CardActions,IconButton,Typography,AppBar} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import { AuthHelper } from '@utils/AuthHelper.js';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Config from '../../../../config';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
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

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen:true,
      basicNotify:false,
      selected_category:0,
      attendance_type:"frequency",
      frequencySettings:[],
      approvalStandards:[],
      realtimeStandards:[],
      selectedFrequency:"",
      frequencyType:"",
      frequencySelected:"",
      categoryList:[],
      showStatus:'all'
    };

  }

  insertMaster = () => {
    let headingArray = [];
   
    let sCount = this.state.tags.length;
    let sText = "";
 
      if(sCount > 1){
        sText = "Expense Categories";
      }
      else{
        sText = "Expense Category";
      }
      this.state.tags.forEach(element => {
        headingArray.push(element);
      })
 
    const postData = {
      name: headingArray, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_parent:this.state.selected_category,
      id_user: this.props.data.UID
    };
    new Service().apiCall("Expenses/insertCategory",postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">{sCount + " "+ sText +"  Inserted!"}</h4>
            </div>
            </Dialog>
          ),
        });
    
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } else {
        this.setState({
          alert: (
            <SweetAlert
            style={{ display: "block", marginTop: "-100px",zIndex:999999 }}
            title={response}
            showConfirm={false}
          >
          </SweetAlert>
          ),
          
        });
        setTimeout(() => {
          this.setState({ alert:null,categorytags:[] });
        }, 2000)
      }
    }).catch(error => {
        //console.log(error); 
    });
  }
  
handleInputChange = (cellInfo, event) => {
  let data = [...this.state.categoryList];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lcategories = this.state.categoryList;
  if(estatus == true){
    lcategories[index].editable = false;
  }
  else{
    lcategories[index].editable = true;
  }
  this.setState({ categoryList:lcategories});
}
  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.categoryList[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl fullWidth>
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={cellValue}
          placeholder="S No"
          type="text" 
          onChange={event => this.handleInputChange(cellInfo,event)}
          />
      </FormControl>
    );
      
    }
    else{
      return cellValue;
    }
    
  };

  handleDeactive = (name,id,status) => {
    let headingStatus = name+" Activated!";
    if(status == 1){
      headingStatus = name+" Deactivated!";
    }
    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall("expenses/deleteCategory",postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">{headingStatus}</h4>
    </div>
  </Dialog>
          ),
        });
          this.getCategories();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  handleAddChip = (chip) => {
    this.setState(state => ({ tags: [...state.tags, chip] }));
  }

  handleDeleteChip = (chip,i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddSubChip = (chip) => {
    this.setState(state => ({ subtags: [...state.subtags, chip] }));
  }

  handleDeleteSubChip = (chip,i) => {
    const { subtags } = this.state;
    this.setState({
      subtags: subtags.filter((tag, index) => index !== i),
    });
  }

  handleRealStandardSelected = (standards) => {
    this.setState({realtimeStandards:standards}); 
  }

  handleApproveStandardSelected = (standards) => {
    this.setState({approvalStandards:standards}); 
  }

  selectCategory = (val,id) => {
    this.setState({selected_category:id});
  }

  refreshData = () => {  
      this.getCategories();
  }

  refreshSubData = () => {  
    this.getSubCategories();
}

handleFrequencyType = (val) => {
  console.log(val);
  this.setState({frequencySelected:val});
}

saveMessageSettings = () => {
  let lrealtimeStandards = this.state.realtimeStandards;
  let lapproveStandards = this.state.approvalStandards;
  let realtimeIds=[];
  let realTimeStdIds="";
  let approveStdIds="";
  let approveIds=[];
  lrealtimeStandards.map(element=>{
    realtimeIds.push(element.id);
   });

   lapproveStandards.map(element=>{
    approveIds.push(element.id);
   });

   realTimeStdIds = realtimeIds.join();
   approveStdIds = approveIds.join();

  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    type_realtime:"1",
    realtimeSelectedStandard:realTimeStdIds,
    type_approval:"1",
    approvalSelectedStandard:approveStdIds,
    attendance_marking:this.state.attendance_marking,
    sms_broadcast:this.state.sms_broadcast,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('Attendance/insertAttendanceMessage',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
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
            <h4 className="font-weight-bold mt-4">Settings Updated Successfully!</h4>

          </div>
        </Dialog>
        ),
      });
      this.getMessageSettings();
      setTimeout(() => {
        this.setState({ basicNotify:false});
      }, 2000) 
    }
  }).catch(error => {
    alert(error);
  });
}


getMessageSettings = () => {
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    // id_board:"13",
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('Attendance/getAttendanceMessage',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
      
    this.setState({ realtimeStandards: response.data[0].selectedstandards, approvalStandards: response.data[0].approvedstandards, attendance_marking: response.data[0].attendance_marking, sms_broadcast: response.data[0].sms_broadcast }); 
    }
  }).catch(error => {
    alert(error);
  });
}


handleStandard = (standard_id,index,status) => {
  let lstdsections = this.state.frequencySettings;
  lstdsections.map(element=>{
     if(element.standard_id == standard_id){
       lstdsections[index].checked = !status;
       element.standards.map((sections,sindex)=>{
         lstdsections[index].standards[sindex].checked = !status;
         lstdsections[index].standards[sindex].type = this.state.selectedFrequency;
       });  
     }
  }); 
  this.setState({frequencySettings:lstdsections});
  //this.renderSelectedSections();
}


handleSection = (section_id,index,sindex,status) => {
  let lstdsections = this.state.frequencySettings;
  lstdsections[index].standards[sindex].checked = !status;
  let total_sections = lstdsections[index].standards.length;
  let checked_count = 0;
  lstdsections[index].standards.map((sections)=>{
    if(sections.checked == true){
      checked_count++;
    }
  });
  if(checked_count == total_sections){
    lstdsections[index].checked = true;
    lstdsections[index].type = this.state.selectedFrequency;
  }
  else{
    lstdsections[index].type = "";
  }
  this.setState({frequencySettings:lstdsections});
  //this.updateSelectedSections();
  
 }

 updateSelectedSections = () => {
  let lstdsections = this.state.selectSections;
  let selectedSections = "";
  let selectedSectionIds = "";
  let selected=[];
  let selectedids=[];
  lstdsections.map(element=>{
      element.standards.map((sections,sindex)=>{ 
          if(sections.checked == true){
            selected.push(sections.standard_name+" "+sections.section_name);
            selectedids.push(sections.section_id);
          }
      });
 });
 if(selected.length > 0){ 
  selectedSections = selected.join(',');
  selectedSectionIds = selectedids.join(',');
 }
}


updateFrequencySettings = () => {
  this.setState({viewFrequencyPanel:false});
  let lstdsections = this.state.frequencySettings;
  let selectedSectionIds = "";
  let selectedids=[];
  lstdsections.map(element=>{
      element.standards.map((sections,sindex)=>{
          if(sections.checked == true && sections.type == this.state.selectedFrequency){
            selectedids.push(sections.section_id);
          }
      });
 });
 if(selectedids.length > 0){
  selectedSectionIds = selectedids.join(',');
 }

  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    type:this.state.selectedFrequency,
    selectedStandardIds: selectedSectionIds,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('Attendance/insertAttendanceFrequency',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
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
            <h4 className="font-weight-bold mt-4">Frequency Updated Successfully!</h4>

          </div>
        </Dialog>
        ),
      });
      this.getFreQuencySettings();
      setTimeout(() => {
        this.setState({ basicNotify:false, viewFrequencyPanel:false});
      }, 2000) 
    }
  }).catch(error => {
    alert(error);
  });
} 

getFreQuencySettings = () => { 
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('Attendance/getAttendanceFrequency',postData).then(response => {
    if (response.status==200 && response.data!='') {
      var frequncyData = [];
      var onceadayCount = 0;
      var twiceaCount = 0;
      var periodwiseCount = 0;
      response.data.forEach(element => {
            if(frequncyData[element.standard_id]){
                var lSection = {};
                if(element.type){
                  lSection.type = element.type;
                  lSection.checked = true; 
                }
                else{
                  lSection.type = "";
                  lSection.checked = false; 
                }
                if(lSection.type == "onceaday"){
                  onceadayCount = onceadayCount + 1;
                  lSection.type = element.type;
                  lSection.fno = "orangeAvatar";
                }
                else if(lSection.type == "twiceaday"){
                  twiceaCount = twiceaCount + 1;
                  lSection.fno = "purpleAvatar"; 
                }
                else if(lSection.type == "periodwise"){
                  periodwiseCount = periodwiseCount + 1;
                  lSection.fno = "pinkAvatar";
                }
                else{
                  lSection.fno = "defaultAvatar";
                }
                lSection.section_id = element.section_id;
                lSection.section_name = element.section_name;
                lSection.standard_id = element.standard_id;
                lSection.standard_name = element.standard_name;
                lSection.all_subject_count = element.all_subject_count;
                lSection.assignment_count = element.assignment_count;
                lSection.board_id = element.board_id;
               
                frequncyData[element.standard_id].standards.push(lSection);
            }else{
                var lStandard = {};
                var lSection = {};
                if(element.type){
                  lSection.type = element.type;
                  lStandard.checked = true;
                  lStandard.type = element.type;
                  lSection.checked = true;
                }
                else{
                  lStandard.checked = false;
                  lSection.checked = false;
                  lSection.type = "";
                  lStandard.type = "";
                }
                if(lSection.type == "onceaday"){
                  onceadayCount = onceadayCount + 1;
                  lSection.fno = "orangeAvatar";
                }
                else if(lSection.type == "twiceaday"){
                  twiceaCount = twiceaCount + 1;
                  lSection.fno = "purpleAvatar";
                }
                else if(lSection.type == "periodwise"){
                  periodwiseCount = periodwiseCount + 1;
                  lSection.fno = "pinkAvatar";
                }
                else{
                  lSection.fno = "defaultAvatar";
                }
                if(onceadayCount > 0 && (twiceaCount == 0 || periodwiseCount == 0)){
                  
                }
                lStandard.standard_name = element.standard_name;
                lStandard.standard_id = element.standard_id;
                lSection.section_id = element.section_id;
                lSection.section_name = element.section_name;
                lSection.standard_id = element.standard_id;
                lSection.standard_name = element.standard_name;
                lSection.all_subject_count = element.all_subject_count;
                lSection.assignment_count = element.assignment_count;
                lSection.board_id = element.board_id;
                lStandard.standards = new Array();
                lStandard.standards.push(lSection);
                frequncyData[element.standard_id] = lStandard;   
            }
      }); 
      let allFrequencyCount = onceadayCount + twiceaCount + periodwiseCount;
      this.setState({ onceadayCount: onceadayCount, twiceaCount:twiceaCount, periodwiseCount:periodwiseCount, frequencySettings:frequncyData, allFrequencyCount:allFrequencyCount });
    }else{
      this.setState({ frequencySettings:[]});
    }
  }).catch(error => {
    alert(error);
  });
}

  componentDidMount() {
    this.getFreQuencySettings();
    this.getMessageSettings();
  }

  render() {
    const width = (window.innerWidth) * (40/100)+"px";
  const width30 = (window.innerWidth) * (30/100)+"px";
  return (
    <Fragment>
       {this.state.basicNotify}
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container className="sliderDiv">
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/attendance")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Attendance Settings
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.attendance_type == "frequency" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({attendance_type:"frequency"}); }}>
                  Frequency Settings
                </Button>
                <Button color="primary" size="small" variant={this.state.attendance_type == "message" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({attendance_type:"message"}); }}>
                Message Settings
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <div  className="pt-100"> 
       {this.state.attendance_type == "frequency" && <Grid container spacing={5} justify="center" className="sliderDiv">

        <Grid item xs={12} sm={6} lg={4}>
        <Card className="card-box  mb-2 p-3 customNoData">
          <Box>
          <Grid container className="sliderDiv">
          <Grid item xs={12} sm={12} md={8}> <Button style={{fontSize:'20px'}} color="transparent"><Avatar className="orangeAvatar">1</Avatar> Once a Day</Button></Grid> 
          <Grid xs={12} sm={12} md={4}   className="pickerGrid margin-auto">
          <Avatar style={{float:'right',marginRight:10}} onClick={()=>this.setState({selectedFrequency:'onceaday', viewFrequencyPanel:true})}> 
          <NavigateNext />
          </Avatar>
          </Grid> 
          </Grid>
          </Box>
          </Card>

          <Card className="card-box p-3 mb-2 customNoData">
          <Box>
          <Grid container className="sliderDiv">
          <Grid item xs={12} sm={12} md={8}> <Button style={{fontSize:'20px'}} color="transparent"><Avatar className="purpleAvatar">2</Avatar> Twice a Day</Button></Grid> 
          <Grid xs={12} sm={12} md={4}   className="pickerGrid margin-auto">
          <Avatar style={{float:'right',marginRight:10}} onClick={()=>this.setState({selectedFrequency:'twiceaday', viewFrequencyPanel:true})}> 
          <NavigateNext />
          </Avatar>
          </Grid> 
          </Grid>
          </Box>
          </Card>

          <Card className="card-box p-3 mb-2 customNoData">
          <Box>
          <Grid container>
          <Grid item xs={12} sm={12} md={8}> <Button style={{fontSize:'20px'}} color="transparent"><Avatar className="pinkAvatar">3</Avatar> Period Wise</Button></Grid> 
          <Grid xs={12} sm={12} md={4}   className="pickerGrid margin-auto">
          <Avatar style={{float:'right',marginRight:10}} onClick={()=>this.setState({selectedFrequency:'periodwise', viewFrequencyPanel:true})}> 
          <NavigateNext />
          </Avatar>
          </Grid> 
          </Grid>
          </Box>
        </Card>
        </Grid>
        </Grid>}

        {this.state.attendance_type == "message" && 
  
        <Grid container spacing={2} justify="center" className="sliderDiv">
      <Grid item xs={12} md={4} lg={6}>
          <Card className="card-box mb-4 p-3">
          <Grid container spacing={2} className="mb-4">
          <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">    
            Absent Message Broadcasting:
          </div>
          </Grid>
          </Grid>
           <Grid container  className="customDiv" justify="center">
           <Grid item xs={12} sm={12} md={5} className="mr-2">
           <OutlinedDiv label="Realtime Standards">
            <Paper component="ul">
            {this.state.realtimeStandards.length > 0 && this.state.realtimeStandards.map((data,i) => {
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
            <li onClick={()=>{this.setState({realStandardPanel:true});}}>
            <Chip
            variant="outline"
            color="secondary"
            label={this.state.realtimeStandards.length > 0 ? "Change Standard" : "Select Standard"}
            className="m-1"
            />
            </li>
             </Paper>
            </OutlinedDiv>   
            </Grid>

            <Grid item xs={12} sm={12} md={5}>
            <OutlinedDiv label="On Approval Standards">
            <Paper component="ul">
            {this.state.approvalStandards.length > 0 && this.state.approvalStandards.map((data,i) => {
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
            <li onClick={()=>{this.setState({approvalStandardPanel:true});}}>
            <Chip
            variant="outline"
            color="secondary"
            label={this.state.approvalStandards.length > 0 ? "Change Standard" : "Select Standard"}
            className="m-1"
            />
            </li>
             </Paper>
            </OutlinedDiv>      
            </Grid>
         
           </Grid>
           <Card className="card-box mt-4 mb-4 p-3">
          <Grid container spacing={2} className="mb-2">
          <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">    
          For periodwise/sessionwise (twice a day) attendance marking:
          </div>
          </Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={6} className="text-center">
          <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={this.state.attendance_marking == "periodwise" ? true : false}
                                 onClick={() => this.setState({attendance_marking:'periodwise'})}
                                
                               />
                             }
                           
                             label="Periodwise/Sessionwise"
           />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} className="text-center">
          <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={this.state.attendance_marking == "consolidated" ? true : false}
                                 onClick={() => this.setState({attendance_marking:'consolidated'})}
                                
                               />
                             }
                           
                             label="Consolidated at the day end"
           />
          </Grid>
          </Grid>  
          </Card>

          <Card className="card-box mt-4 mb-4 p-3">
          <Grid container spacing={2} className="mb-2">
          <Grid item xs={12} sm={6} lg={12} className="p-20">
          <div className="card-header--title font-size-md font-weight-bold ml-2">    
          Frequency of absent report broadcasting via SMS
          </div>
          </Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4} lg={4} className="text-center">
          <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={this.state.sms_broadcast == "daily" ? true : false}
                                 onClick={() => this.setState({sms_broadcast:'daily'})}
                                
                               />
                             }
                           
                             label="Daily"
           />
          </Grid>
          <Grid item xs={12} sm={4} lg={4} className="text-center">
          <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={this.state.sms_broadcast == "weekly" ? true : false}
                                 onClick={() => this.setState({sms_broadcast:'weekly'})}
                                
                               />
                             }
                           
                             label="Weekly"
           />
          </Grid>
          <Grid item xs={12} sm={4} lg={4} className="text-center">
          <FormControlLabel
                             control={
                               <Checkbox
                                 tabIndex={-1}
                                 checked={this.state.sms_broadcast == "monthly" ? true : false}
                                 onClick={() => this.setState({sms_broadcast:'monthly'})}
                                
                               />
                             }
                           
                             label="Monthly"
           />
          </Grid>
          </Grid>  
 
          </Card>
            <Grid container spacing={2} className="mt-1">
            {AuthHelper('Attendance','can_create') &&    <Grid item xs={12} sm={12} lg={12} className="text-right">
            <Button  className="successBtnOutline"  onClick={()=>this.saveMessageSettings()}>Submit</Button>                      
            </Grid>}
            </Grid>
          </Card> 

         
      </Grid>
     
        </Grid>}
</div>
    </Animated>
    </Dialog>



    <Drawer
anchor="right"
open={this.state.viewFrequencyPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewFrequencyPanel:false})}>
<Box className={"app-header-drawer "} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({viewFrequencyPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Select Frequency
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container spacing={2} justify="center" className="mt-1">
    <Grid item xs={12} sm={12} lg={12}>

    {this.state.frequencySettings.length > 0 && this.state.frequencySettings.map((element, index) => (
                      <Grid container className="mx-2">
                            <Grid item xs={12} sm={10} md={3}>
                     
                        {(this.state.selectedFrequency == element.type || element.type =="") ?   <FormControlLabel
                        
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={element.checked}
                              onClick={() => {this.handleStandard(element.standard_id,index,element.checked)}}
                             

                            />
                          }
                         
                          label={element.standard_name}
                        /> :   <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={element.checked}
                            onClick={() => {this.handleStandard(element.standard_id,index,element.checked)}}
                           
                          />
                        }
                       
                        label={element.standard_name}
                      />}
                    
                        </Grid>
                        {element.standards.map((sections,sindex) => (
                          <Grid xs={12} sm={10} md={3}>
                       
                            {(sections.type == this.state.selectedFrequency || sections.type =="") ? <div><FormControlLabel
                             
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  
                                  checked={sections.checked}
                                  onClick={() => this.handleSection(sections.section_id,index,sindex,sections.checked)}
                                 
                                />
                              }
                            
                              label={<Avatar className={sections.fno}>{sections.section_name}</Avatar>}
                            /></div> :
                           <div> <FormControlLabel
                            disabled
                            control={
                              <Checkbox
                                tabIndex={-1}
                                
                                checked={sections.checked}
                                onClick={() => this.handleSection(sections.section_id,index,sindex,sections.checked)}
                               
                              />
                            }
                           
                            label={<Avatar className={sections.fno}>{sections.section_name}</Avatar>}
                          />
                          
                          </div>
                          }
                           
                            </Grid>
                        ))} 
                        </Grid>
                    ))}

         
    </Grid>
    </Grid>
    <Grid container spacing={2} className="mt-1 p-3">
    {AuthHelper('Attendance','can_create') &&   <Grid item xs={12} sm={12} lg={12} className="text-right">
       <Button  className="successBtnOutline"  onClick={()=>this.updateFrequencySettings()}>Submit</Button>                      
    </Grid>}
    </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>

    <Drawer

anchor="right"
open={this.state.realStandardPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({realStandardPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({realStandardPanel:false})} aria-label="close">
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
mappedstandards={this.state.realtimeStandards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleRealStandardSelected}
{...this.props} 
/>
</CardContent>
<CardActions>
<Grid container spacing={4}>

<Grid item xs={12} md={4} lg={12} className="text-right">
{AuthHelper('Attendance','can_create') &&  <Button   variant="outlined" color="secondary" onClick={()=>this.setState({realStandardPanel:false})}>
  Submit
</Button>}
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
open={this.state.approvalStandardPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({approvalStandardPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({approvalStandardPanel:false})} aria-label="close">
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
mappedstandards={this.state.approvalStandards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleApproveStandardSelected}
{...this.props} 
/>
</CardContent>
<CardActions>
<Grid container spacing={4}>
<Grid item xs={12} md={12} lg={12} className="text-right">
{AuthHelper('Attendance','can_create') &&  <Button   variant="outlined" color="secondary" onClick={()=>this.setState({approvalStandardPanel:false})}>
  Submit
</Button>}
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
