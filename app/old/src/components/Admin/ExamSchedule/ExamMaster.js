import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import OutlinedDiv from "../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../layout-components/CustomComponents/StandardSectionsList.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
import  "../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Checkbox,Grid,Switch,FormControlLabel,ButtonGroup,Dialog,CardActions,Toolbar,Card,Radio,Avatar,TextField,Button,Paper,Chip,Drawer,Slide,FormControl,Box,Tooltip,IconButton,Typography,AppBar, List,ListItem,Divider} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js'
import Service from '../../../utils/Service';
import { AuthHelper } from '../../../utils/AuthHelper.js';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Config from '../../../config';
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
      standardSubjects:[],
      selectedbatchList:[],
      mappedExamBatches:[],
      batchStudents:[],
      mappedExamStandards:[],
      classwiseStudent : [],
      allStudents:[],
      batchList:[],
      examList:[],
      mappedBatchList:[],
      selectedStandards:[],
      selectedBatches:[],
      studentsData:[],
      mappedSelectedStandards:[],
      dialogOpen:true,
      menuLevel:1,
      basicNotify:false,
      selected_category:0,
      tags:[],
      subtags:[],
      category_type:"main",
      categoryList:[],
      examMasterType:'offline',
      batchName:'',
      showStatus:'all',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicId:this.props.data.selectedAcademicId, 
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

  saveBatch = () => {
    let filtered = this.state.customAssignStudents;
    let batchStudents=[];
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      name:this.state.batchName,
      mappedstudents: batchStudents,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamDetails/insertExamBatchDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Batch Added Successfully</h4>
            </div>
            </Dialog>
          ),
        });
        this.getBatchDetails();
        setTimeout(() => {
          this.setState({ basicNotify:false,batchName:""});
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  } 

  updateExamName = (id, index) => {
    let data = this.state.examList;
    let examName = data[index].name;
  
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      name:examName,
      id_exam:id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamDetails/updateExamNames',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Exam Updated</h4>
            </div>
            </Dialog>
          ),
        });
        this.getExamDetails(); 
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

 
  handleStandardDelete(i) {
    const { selectedStandards } = this.state;
    this.setState({
      selectedStandards: selectedStandards.filter((standard, index) => index !== i),
    });
  }

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards});
  }

  handleMappedSelected = (standards) => {
    this.setState({mappedSelectedStandards:standards});
  }

  handleMappedStandardSelected = (standards) => {
    this.setState({mappedExamStandards:standards});
  }
  
handleInputChange = (cellInfo, event) => {
  let data = [...this.state.examList];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lheadings = this.state.examList;
  if(estatus == true){
    lheadings[index].editable = false;
  }
  else{
    lheadings[index].editable = true;
  }
 // console.log(lheadings);
  this.setState({ examList:lheadings});
}
  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.examList[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl fullWidth>
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="sno"   
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

  handleDeactive = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Exam Deactivated";
     }
     else{
        switchStatus = "Exam Activated Successfully";
     }
     const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id_exam: id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamDetails/deleteExamMaster',postData).then(response => {
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
        this.getExamDetails();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  updateExamStandards = () => {
    let filtered = this.state.mappedExamStandards;
    let standards=[];
    filtered.map(element=>{
      standards.push(element.id);
    });
    let mapped = standards.join(",");
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id_exam:this.state.selectedExamId,
      selected_standards: mapped,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    console.log(postData);
    new Service().apiCall('ExamDetails/updateExamStandards',postData).then(response => {
     
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Standards Updated</h4>
    </div>
  </Dialog>
          ),
        });
        this.getExamDetails();
        setTimeout(() => {
          this.setState({ viewAssignedExamClasses:false, basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  } 

  createExam = () => {
    let lstandards = this.state.selectedStandards;
    let standards=[];
    lstandards.map(element=>{
      standards.push(element.id);
    });
    let lbatches = this.state.batchList;
    let batches=[];
    lbatches.map(element=>{
      if(element.checked == true){
        batches.push(element.id);
      }
    });   
   let standardids = standards.join(",");
   let batchids = batches.join(",");
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      type:this.state.examMasterType,
      name:this.state.tags,
      selected_standards: standardids,
      selected_batches:batchids, 
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ExamDetails/insertExamDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Exam  Created</h4>
    </div>
  </Dialog>
          ),
        });
        
        setTimeout(() => {
          window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  } 

  handleSelectedBatch = (index, status)=>{
    let batches = this.state.batchList;
    batches[index].checked = !status;
    let selected = [];
    batches.map(element=>{
      if(element.checked){
        selected.push(element);
      }
    })
    this.setState({batchList:batches, selectedBatches:selected});
  }

  handleSelectedExamBatch = (index, status)=>{
    let batches = this.state.mappedExamBatches;
    batches[index].checked = !status;
    this.setState({mappedExamBatches:batches});
  }

  getBatchMapped = (id) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicId,
    id_batch:id,
    token:"abc",
    id_user: this.props.data.UID,
    type:"ams"
    };
    new Service().apiCall('ExamDetails/getExamBatchesMappedDetails',postData).then(response => {
    //  console.log(response);
      if (response.status==200 && response.data!='') {
       
        const newArr = response.data.map(v => ({...v, checked: false}));
        this.setState({mappedBatchList:newArr});
        console.log(newArr);
      }
      else{
        this.setState({mappedBatchList:[]});
      }
 
    }).catch(error => {
      console.log(error);

    });
  }

  getMappedExamBatches = (batches) => { 
      let mapped = batches.split(",");
      console.log(mapped);
      let batchList = this.state.batchList;
      batchList.map((element,index)=>{
        if(mapped){
          if (mapped.some(stdid => stdid === element.id)) {
            element.checked = true;
          }
          else{
            element.checked = false;
          }
        }
      })
      this.setState({mappedExamBatches:batchList});
  }

  handleAddChip = (chip) => {
    if(this.state.examList.some(v => v.name.toLowerCase() == chip.toLowerCase())){
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Exam Already Exists</h4>
  </div>
</Dialog>
        ),
      });
      
      setTimeout(() => {
        this.setState({basicNotify:false})
      }, 2000) 
    }
    else{
      let capitalize = chip.charAt(0).toUpperCase() + chip.slice(1);
      this.setState(state => ({ tags: [...state.tags, capitalize.replace(/[^a-zA-Z0-9\.,]/g, '')] }));
    }
  
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

  selectCategory = (val,id) => {
    this.setState({selected_category:id});
  }

  refreshData = () => {  
      this.getExamDetails();
  }

  refreshSubData = () => {  
    this.getSubCategories();
}
setLevel = (val) =>{
  this.setState({menuLevel:val})
}

getBatchDetails = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,
  id_academicyear:this.state.selectedAcademicId,
  token:"abc",
  userrole: this.props.data.type,
  id_user: this.props.data.UID,
  type:"ams"
  };
  new Service().apiCall('ExamDetails/getExamBatchesDetails',postData).then(response => {
    if (response.status==200 && response.data!='') {
      console.log(response.data);
      const newArr = response.data.map(v => ({...v, checked: false}));
      this.setState({batchList:newArr});
    }

  }).catch(error => {
    console.log(error);

  });
}

getStudentInfo = (id) => {
  let students = this.state.allStudents;
  console.log(id)
  let data = "";
  students.forEach(element => {
    if (element.UID === id) {
      data = element.name+" "+String.fromCharCode(9679)+" "+element.UID+" "+String.fromCharCode(9679)+" "+element.standard_name+" "+element.section_name;
    }
});
return data;
}

getExamDetails = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,   
  id_academicyear:this.state.selectedAcademicId,  
  token:"abc",
  userrole: this.props.data.type,
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  type:'offline'
  };
  new Service().apiCall('ExamDetails/getExamDetails',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({examList:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({examList:newArray});
      }
      
    }
  }).catch(error => {
    this.showError(error.response.data)
  });
}

getAllStudentDetails = () => {  
  const postData = {
  id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  token:"abc",
  id_user: this.props.data.UID,
  id_board:this.state.selectedBoardId,
  id_academicyear:this.state.selectedAcademicId,
  };
  new Service().apiCall('students/getData',postData).then(response => {
    if (response.status==200 && response.data!='') {
      const studentsList = response.data.map((data) => {
        return {...data, checked: this.state.mappedBatchList.some(d => d.id_user === data.UID)?true:false};
    });
      this.setState({ allStudents:studentsList,studentsData: studentsList, studentsTotal: response.data.length  });
    }
    else{
      this.setState({  allStudents:[],studentsData: []})
    } 
  }).catch(error => {
    alert(error);

  });
}

sidebarStandardSections = () => {
  return(
    <StandardSectionsList
    board_id={this.state.selectedBoard}
    type="sidebar"
    viewMapped={true}
    showBadge={true}
    viewcount="student" 
    institute_id={this.state.selectedInstitutionId}
    academic_id={this.state.selectedAcademicId}
    active={this.state.searchStudent ? true : false}
    handleSelectedSection={this.handleSelecteSidebardSection}
    {...this.props}
  /> 
  )
}

updateBatch = () => {
  let filtered = this.state.studentsData;
  let batchMapped=[];
  filtered.map(element=>{
    if(element.checked == true){
      batchMapped.push(element.UID);
    }
  });

  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicId,
    mappedstudents: batchMapped, 
    token:"abc",
    id_batch: this.state.selectedBatchId,
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ExamDetails/updateBatchStudents',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Batch Updated</h4>
  </div>
</Dialog>
        ),
      });
      this.getBatchDetails();
      this.getBatchMapped(this.state.selectedBatchId);
      setTimeout(() => {
        this.setState({ basicNotify:false,  createBatchPanel:false, studentPanel:false});
      }, 2000) 
    }
  }).catch(error => {
    alert(error);
  });
} 

selectAll = () => {   
  let lstudents = this.state.studentsData;
  lstudents.map((element,index) => {
    if(this.state.checkAll){
      lstudents[index].checked = false;
    }
    else{
      lstudents[index].checked = true;
    }
     
  });
  this.setState({classwiseStudent:lstudents, checkAll: this.state.checkAll});
}

handleStudent(key,status){

  let lstudents = this.state.studentsData;
  let count = 0;
  lstudents[key].checked = !status;
  lstudents.map((element,index) => {
        if(element.checked == true){
          count++;
        }
  });
  if(count == this.state.studentsTotal){
    this.setState({checkAll:true});
  }
  else{
    this.setState({checkAll:false});
  }
  this.setState({classwiseStudent:lstudents});
}

  componentDidMount() {
      this.getBatchDetails();
      this.getExamDetails();
    this.getAllStudentDetails();
  }

  render() {
    const width = window.innerWidth;
    const width30p =  width * (30/100)+"px";
    const width50p =  width * (50/100)+"px";
    const width100p =  width +"px";
    const level1 = this.state.menuLevel == 1 ? width30p : "";
    const level2 = this.state.menuLevel == 2 ? width50p : "";
    const Inst1 = this.state.menuLevel == 1 ? 12: "";
    const Inst2 = this.state.menuLevel == 2 ? 6 : "";
  return (
    <Fragment>
       {this.state.basicNotify}
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/exam-schedule")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">  
              Exam Master
            </Typography>  
               </Grid>
             
            </Grid>
          </Toolbar>
        </AppBar>
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <div  className="pt-100"> 

    <Grid container  justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        {AuthHelper('Exam Scheduling','can_create') &&   
        //  <Card className="card-box  mb-3 mt-2 p-3">
        <Card className="card-box  mb-4 customNoData">
           <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Create Exam
                </h4>
              </div>
              </div>
        {/* <Grid container >
                      <Grid item xs={12} sm={1} md={1}></Grid>
                        <Grid item  xs={12} sm={1} md={2} className="margin-auto">
                        <h5 className="headingStyle" style={{marginTop:0}}>Exam Type</h5>
                        </Grid>
                        <Grid item  xs={12} sm={1} md={2} className="margin-auto">
                     
                         <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.examMasterType === "Online"}
                          onChange={() => this.setState({examMasterType:'Online'})}
                          id="cleaner"
                          name="cleaner"
                          inputRef={el => this.submission = el} 
                          value="cleaner"
                          name="radio button enabled"
                          aria-label="B"
                        
                        />
                      }
                    
                      label="Online"  
                    />
              
                  </Grid>
                  <Grid GridItem xs={12} sm={6} md={2} className="text-left margin-auto">
                       
                         <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.examMasterType === "offline"}
                          onChange={() => this.setState({examMasterType:'offline'})}
                          id="cleaner"
                          name="cleaner"
                          inputRef={el => this.submission = el} 
                          value="cleaner"
                          name="radio button enabled"
                          aria-label="B"
                        
                        />
                      }
                     
                      label="Offline"  
                    />
             
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} className="text-left"></Grid> 
                        </Grid> */}
                        
        { this.state.examMasterType!="" && <Grid container justify="center" className="p-2">
        <Grid item xs={12} sm={12} lg={12} className="outlinedInput customChip">
        <FormControl fullWidth>
              <ChipInput
              variant="outlined"
              className="inputTag"
              label={"Add Exam Name and press 'Enter'"}
              value={this.state.tags}
              onAdd={(chip) => this.handleAddChip(chip)}
              onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
              />
        </FormControl> 
        </Grid>
       
        </Grid>}

        { this.state.tags.length > 0 &&  <Grid container>
               <Grid item xs={12} sm={12} md={12} className="mt-4 p-2 customDiv">
               <OutlinedDiv label="Select standard">
                 <Paper component="ul">
                 {this.state.selectedStandards.map((data,i) => {
              let icon="";
            return (
            <li key={data.id}>
            <Chip
            className="mr-2"
            icon={icon}
            variant="outline"
            color="secondary"
            onDelete={()=>this.handleStandardDelete(i)}
            label={data.name}
            />
            </li>
            );
            })}
            <li onClick={()=>{this.setState({addStandardsPanel:true});}}>
            <Chip
            className="mr-2"
            variant="outline"
            color="primary"
            label={this.state.selectedStandards.length > 0 ? "Change Standard" : "Select Standard"}
            />
            </li>
                 </Paper>
               </OutlinedDiv>
               </Grid>
               </Grid>}  

               { this.state.tags.length > 0 &&  this.state.examMasterType == "Online" && <Grid container>
               <Grid item xs={12} sm={12} md={12} className="mt-4 customDiv">
               <OutlinedDiv label="Select batch">
                 <Paper component="ul">
                 {this.state.selectedBatches.map((data,i) => {
              let icon="";
            return (
            <li key={data.id}>
            <Chip
            className="mr-2"
            icon={icon}
            variant="outline"
            color="secondary"
            label={data.name}
            />
            </li>
            );
            })}
            <li onClick={()=>{this.setState({createBatchPanel:true});}}>
            <Chip
            className="mr-2"
            variant="outline"
            color="primary"
            label={this.state.selectedBatches.length > 0 ? "Change Batch" : "Select Batch"}
            />
            </li>
                 </Paper>
               </OutlinedDiv>
               </Grid>
               </Grid>}        

               {AuthHelper('Exam Scheduling','can_create') &&   <Grid container justify="center">
        <Grid item xs={12} sm={12} lg={12} className="text-right mt-4 p-2">
        {this.state.tags.length > 0 && (this.state.selectedStandards.length > 0 || this.state.batchList.length > 0) &&  <Button className="successBtnOutline" variant="outlined" onClick={()=>this.createExam()}>
              Submit
            </Button>}
        </Grid>
        </Grid>}
      
        </Card>}

        </Grid>

        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Exams List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.refreshData()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.refreshData()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.refreshData()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.examList.map((original,key) => {
return ({
  slno: key+1,
  exam_id:original.id,
  name: original.name,
  standardcount:original.standardcount,
  batchcount:original.selected_batches.split(",").length,
  status:original.status,
  type:original.type,
  editable:original.editable,
  selected_batches:original.selected_batches,
  selectedstandard:original.selectedstandard,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
      {AuthHelper('Exam Scheduling','can_edit') &&  <Tooltip
        id="tooltip-top"
        title={original.editable ? "Save":"Edit"}
        placement="top"
    
      >
         { original.editable ?  <Button disabled={original.status == 0}
                           
                            simple
                            onClick={()=> {this.setState({selectedHeading:original.name}); this.updateExamName(original.id,key);}}
                            color="secondary"
                            className="edit"
                          >
                            <CheckCircleOutline  />
                          </Button>
                          :
                          <Button disabled={original.status == 0}
                        
                          simple
                          onClick={()=> {this.setState({selectedHeading:original.name}); this.rowEdit(original.editable,key);}}
                          color="secondary"
                          className="edit"
                        >
                          <Edit  />
                        </Button> }

      </Tooltip>}
                          
                          {/* use this button to remove the data row */}
                         
                          {AuthHelper('Exam Scheduling','can_delete') &&    <Tooltip
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
width: 90,
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="s-no"   
value={filter ? filter.value : ''}
placeholder="S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Exam Name",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="exam-name"   
value={filter ? filter.value : ''}
placeholder={"Search Exam Name"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderEditable
},
{
  Header: "Assigned Classes",
  accessor: "standardcount",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="assigned-classes"   
value={filter ? filter.value : ''}
placeholder="Search Assigned Classes"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell: row => (
    <div><Chip clickable style={{backgroundColor:'white'}}  size="small" variant="outlined"  disabled={row.original.status == 0} className={row.original.type == "Online" ? "warningBtnOutline" : "successBtnOutline"}  onClick={()=>this.setState({selectedExamName:row.original.name, selectedExamId:row.original.exam_id, viewAssignedExamClasses:true, examType:row.original.type, mappedExamStandards:row.original.selectedstandard})}
     label={row.original.standardcount?row.original.standardcount:'Not Assigned'} />
    </div>
  )
  },
  // {
  //   Header: "Assigned Batches",
  //   accessor: "batchcount",
  //   className: "center",
  //   Filter: ({filter, onChange}) => (
  // <TextField 
  // inputProps={{
  // autoComplete: 'off'
  // }}         
  // id="document-type"   
  // value={filter ? filter.value : ''}
  // placeholder="Search Assigned Batches"
  // type="text" 
  // onChange={event => onChange(event.target.value)}
  // />
  //   ),
  //   Cell: row => (
  //     <div><Chip clickable style={{backgroundColor:'white'}}  size="small" variant="outlined"  disabled={row.original.status == 0} className={row.original.type == "Online" ? "successBtnOutline" : "warningBtnOutline"}  onClick={()=> {this.setState({selectedExamName:row.original.name, selectedExamId:row.original.exam_id, viewAssignedBatches:true}); this.getMappedExamBatches(row.original.selected_batches)}}
  //      label={row.original.selected_batches == "" ? 'Not Assigned' :row.original.selected_batches.split(",").length} />
  //     </div>
  //   )
  //   },
  {
    Header: "Actions",
    accessor: "actions",
    show:(AuthHelper('Exam Scheduling','can_edit') || AuthHelper('Exam Scheduling','can_delete'))?true:false,
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
    {AuthHelper('Exam Scheduling','can_export') && <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" color="secondary" href={Config.url+"/ExamDetails/excelExamData?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId+"&type=offline"}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card>
        </Grid>
        </Grid>

</div>
    </Animated>
    </Dialog>
    <Drawer

anchor="right"
open={this.state.addStandardsPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({addStandardsPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({addStandardsPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
<StandardSectionsList
        board_id={this.state.selectedBoardId}
        type="checkbox"
        institute_id={this.state.selectedInstitutionId}
        academic_id={this.state.selectedAcademicId}
        mappedstandards={this.state.selectedStandards}
        onSelected={this.handleStandardSelected}
        {...this.props} 
      />
</Card> 
{AuthHelper('Exam Scheduling','can_create') && <Grid container>
<Grid item xs={12} md={12} lg={12} className="text-right">
<Button color="secondary" variant="outlined" onClick={()=>{this.setState({ addStandardsPanel: false});}}>
  Submit
</Button>
</Grid>
</Grid>  }     
</div>
</PerfectScrollbar>
</Box>
</Drawer> 

<Drawer

anchor="right"
open={this.state.createBatchPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({createBatchPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: level1+level2}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({createBatchPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Create Batch
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container>
          <Grid item sm={Inst1+Inst2} md={Inst1+Inst2} lg={Inst1+Inst2}>
          
          <Card className="card-box p-3  mb-4 customNoData">
          <Grid container>
          <Grid item xs={12} sm={12} md={1}></Grid>
          <Grid item xs={12} sm={12} md={8}>  
          <FormControl fullWidth>
               <TextField 
              inputProps={{
                autoComplete: 'off'
              }}
               id="batch-name"   
               value={this.state.batchName} 
               label="Create new batch" 
               type="search" 
               onChange={(event) => this.setState({batchName:event.target.value})}
               variant="outlined" 
            
               />
               
               </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={2}  className="pickerGrid margin-auto"> 
        {this.state.batchName!="" &&  <Avatar onClick={()=>this.saveBatch()}>
                <NavigateNext />
                </Avatar>}
            </Grid>
          </Grid>  
     
          </Card>    
        
          {this.state.batchList.map((data,i) => (
              <Card className="card-box p-3  mb-4 customNoData">
            
              <Grid container>
              <Grid item xs={12} sm={12} md={2}>
              <FormControlLabel
                          control={
                            <Checkbox
                            
                              tabIndex={-1}
                              onChange={()=>this.handleSelectedBatch(i, data.checked)}
                              checked={data.checked}
                            />
                          }
                          label=""
                        />
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{margin:'auto'}}>
                   <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}> {data.name}</div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="textRight" style={{margin:'auto'}}>
              <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}><Chip size="small" variant="outlined" color="secondary" label={data.count} /></div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="pickerGrid" style={{margin:'auto'}}>
              <Avatar style={{cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}>  
                <NavigateNext />
                </Avatar>
              </Grid>
              </Grid>

              </Card>
               
          ))}
          <Card className="card-box p-3  mb-4 customNoData">
             
          {AuthHelper('Exam Scheduling','can_create') &&    <Grid container>
               <Grid item xs={12} sm={12} md={12} className="textRight">
                 <Button className="successBtnOutline" variant="outlined" size="small" onClick={()=>this.setState({createBatchPanel:false})}>Submit</Button>
               </Grid>
               </Grid>}
               
               </Card>
          </Grid>
         {this.state.navPanel && <Grid item sm={6} md={6} lg={6}>
         <Grid container>
         <Grid item xs={12} sm={12} md={12}>
         <Card className="card-box p-3  mb-4 customNoData">
         
                <div><Button color="primary" variant="outlined" style={{width:'100%'}}  onClick={() => {this.setState({studentPanel:true});this.getAllStudentDetails();}}>{this.state.mappedBatchList.length > 0 ? "Add more students" : "Add Students"}</Button></div>
         
          </Card>  
         </Grid>
        </Grid>  
         {this.state.mappedBatchList.length > 0 && 
            <div>
            <Grid container>
            <Grid item xs={12} sm={12} md={12}>
            <Card className="card-box p-3  mb-4 customNoData">
            <ul className="suggestions" style={{boxShadow:'none',padding:0}}> 
            {this.state.mappedBatchList.map((element,index) => {
               return(
                <li key={element.id}>
                  {index+1}.  { this.getStudentInfo(element.id_user)} 
                </li>
               ) 
            })}
            </ul>
        
           
            </Card>
            </Grid>
          </Grid>
        
          </div>
            }
          </Grid>}
          </Grid>

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
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({studentPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Classwise Students
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container >
<Grid item xs={12} md={8} lg={3}>
   <Card className="card-box ml-4 mb-4">
    <div className="text-center">
      <div className="pt-1">
        <List className="py-2">
        <ListItem button className={this.state.classwiseAll ?"my-2 activeSidebarColor":"my-2"} onClick={ () => {
                   this.setState({ classwiseAll:true,selectedClass:''});  this.getAllStudentDetails();
              }}>
              <span>All</span>
              <span className="ml-auto badge badge-warning">{this.state.studentsTotal}</span>
            </ListItem>
          <Divider />
          {this.sidebarStandardSections()}
        </List>
      </div>
    </div>
  </Card>
  </Grid>  
<Grid item xs={12} md={8} lg={9}>
<Grid container >
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Students List
                </h4>
              </div>
   
            </div>

    
     
    <ReactTable

data={
this.state.studentsData.map((original,key) => {
return ({
  slno: key+1,
  id:original.UID,
  key:key,
  name: original.name+" "+original.last_name,
  father_name:original.father_name+" "+original.father_last_name,
  primary_contact:original.primary_contact,
  standard:original.standard_name+" "+original.section_name,
  checked:original.checked,
  
})
})
}
filterable
minRows={0}
columns={[
  {
    Header: "Select All",
    accessor: "",
    className: "center",
    Filter: ({filter, onChange}) => (
      <FormControlLabel
      control={
        <Checkbox
          tabIndex={-1}
          checked={this.state.checkAll}
          onClick={() =>{ this.selectAll(); this.setState({checkAll:!this.state.checkAll}) }}
         
        />
      }
    
      label=""
    />
    ),
    sortable: false,
    Cell: row => (
      <div>
          <FormControlLabel
                 control={
                   <Checkbox
                     tabIndex={-1}
                     checked={row.original.checked}
                     onClick={() => this.handleStudent(row.original.key,row.original.checked)}
                    
                   />
                 }
               
                 label=""
               />
      </div>

    ),
  },
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
id="srno"   
value={filter ? filter.value : ''}
placeholder="S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "UID",
  accessor: "id",
  width: 90,
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="userid"   
value={filter ? filter.value : ''}
placeholder="Search UID"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Student Name",
accessor: "name",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="student-name"   
value={filter ? filter.value : ''}
placeholder="Search Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
Header: "Parent Name",
accessor: "father_name",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="father-name"   
value={filter ? filter.value : ''}
placeholder="Search Father Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
Header: "Contact No",
accessor: "primary_contact",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="contact"   
value={filter ? filter.value : ''}
placeholder="Search Contact No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Standard/Section",
  accessor: "standard",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="standard"   
value={filter ? filter.value : ''}
placeholder="Search Standard"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },

  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions stats style={{marginTop:0}}>
    {AuthHelper('Exam Scheduling','can_edit') && <Grid container >
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button className="successBtnOutline" onClick={()=>this.updateBatch()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card></Grid> 
        </Grid>
</Grid>
</Grid>

</div>
</PerfectScrollbar>
</Box>
</Drawer>  

<Drawer

anchor="right"
open={this.state.viewAssignedExamClasses}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignedExamClasses:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignedExamClasses:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
Select Standard
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box p-3  mb-4 customNoData">
<StandardSectionsList
                    board_id={this.state.selectedBoardId}
                    type="checkbox"
                    institute_id={this.state.selectedInstitutionId}
                    academic_id={this.state.selectedAcademicId}
                    onSelected={this.handleMappedStandardSelected}
                    mappedstandards={this.state.mappedExamStandards}
                    {...this.props} 
                    />

{AuthHelper('Exam Scheduling','can_edit') && <Grid container spacing={4}>
<Grid item xs={12} md={12} lg={12} className="text-right">
<Button color="secondary" variant="outlined" onClick={()=>this.updateExamStandards()}>
  Update
</Button>
</Grid>
</Grid>  }  
</Card> 
    
</div>
</PerfectScrollbar>
</Box>
</Drawer> 

<Drawer

anchor="right"
open={this.state.viewAssignedBatches}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewAssignedBatches:false})}>
<Box className={"app-header-drawer bgColor"} style={{width: level1+level2}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewAssignedBatches:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View/Edit Batch
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container>
          <Grid item sm={Inst1+Inst2} md={Inst1+Inst2} lg={Inst1+Inst2}>
          
     
        
          {this.state.mappedExamBatches.map((data,i) => (
              <Card className="card-box p-3  mb-4 customNoData">
            
              <Grid container>
              <Grid item xs={12} sm={12} md={2}>
              <FormControlLabel
                          control={
                            <Checkbox
                            
                              tabIndex={-1}
                              onChange={()=>this.handleSelectedExamBatch(i, data.checked)}
                              checked={data.checked}
                            />
                          }
                          label=""
                        />
              </Grid>
              <Grid item xs={12} sm={12} md={6} style={{margin:'auto'}}>
                   <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}> {data.name}</div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="textRight" style={{margin:'auto'}}>
              <div style={{display:'block', cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}><Chip size="small" variant="outlined" color="secondary" label={data.count} /></div>
              </Grid>
              <Grid item xs={12} sm={12} md={2} className="pickerGrid" style={{margin:'auto'}}>
              <Avatar style={{cursor:'pointer'}} onClick={() => {this.setState({ navPanel: true, selectedBatchId:data.id }); this.setLevel(2); this.getBatchMapped(data.id)}}>  
                <NavigateNext />
                </Avatar>
              </Grid>
              </Grid>

              </Card>
               
          ))}
          <Card className="card-box p-3  mb-4 customNoData">
             
          {AuthHelper('Exam Scheduling','can_create') &&   <Grid container>
               <Grid item xs={12} sm={12} md={12} className="textRight">
                 <Button className="successBtnOutline" variant="outlined" size="small" onClick={()=>this.setState({createBatchPanel:false})}>Submit</Button>
               </Grid>
               </Grid>}
               
               </Card>
          </Grid>
         {this.state.navPanel && <Grid item sm={6} md={6} lg={6}>
         <Grid container>
         <Grid item xs={12} sm={12} md={12}>
         <Card className="card-box p-3  mb-4 customNoData">
         
                <div><Button color="primary" variant="outlined" style={{width:'100%'}}  onClick={() => {this.setState({studentPanel:true});this.getAllStudentDetails();}}>{this.state.mappedBatchList.length > 0 ? "Add more students" : "Add Students"}</Button></div>
         
          </Card>  
         </Grid>
        </Grid>  
         {this.state.mappedBatchList.length > 0 && 
            <div>
            <Grid container>
            <Grid item xs={12} sm={12} md={12}>
            <Card className="card-box p-3  mb-4 customNoData">
            <ul className="suggestions" style={{boxShadow:'none',padding:0}}> 
            {this.state.mappedBatchList.map((element,index) => {
               return(
                <li key={element.id}>
                  {index+1}.  { this.getStudentInfo(element.id_user)} 
                </li>
               ) 
            })}
            </ul>
        
           
            </Card>
            </Grid>
          </Grid>
        
          </div>
            }
          </Grid>}
          </Grid>

</div>
</PerfectScrollbar>
</Box>
</Drawer>
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
