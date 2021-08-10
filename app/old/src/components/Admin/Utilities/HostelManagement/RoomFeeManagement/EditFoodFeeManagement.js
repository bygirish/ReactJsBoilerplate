import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
import Config from '../../../../../config';
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

class EditHostelFoodFeeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:'room_structure',
      loading:false,
      TabValue:0,
      checkAll:false,
      groupName:'',
      groupRecipients:'',
      messageCenterSelectedSections:[],
      messageCenterSelectedSectionsIds:[],
      groupChecked:[],
      selectedStandards:[],
      checked: [],
      groupCount:[],
      holidays:[{id:1, food_type:'Veg'}, {id:2, food_type:'Non Veg'}],
      message: '',
      groupInsert :[],
      classwiseStudent : [],
      startdate:new Date(),
      enddate: new Date(),
      allChecked:false,
      allStaffChecked:false,
      allStudentChecked:false,
      staffAll:false,
      allstudentsChecked:false,
      staffTeaching:false,
      staffNonTeaching:false,
      classicModal:false,
      allSections:false,
      searchbyDateChecked:false,
      sectionCount:0,
      usersTotal:0,
      staffTotal:0,
      nonTeachingstaffTotal:0,
      teachingstaffTotal:0,
      viewRecipientsPanel:false,
      studentsTotal:0,
      isPaneOpen:false,
      studentPanel:false,
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'',
     reportMessageCenterPanel:false,
      selectedClass:'',
      selectedSection:'',
      selectedStandard:'',
      showSuggestions:false,
      showTextSuggestions:false,
      userTextInput:"",
      userInput:"",
      userSearchInput:"",
      group_members:[],
      studentsData:[],
      filteredSuggestions:[],
      groups:[],
      groupSelection:[],
      members:[],
      filterSections:[],
      fileUploadState:"",
      messageReceipntsData:[],
      messageData:[],
     customAssignStudents:[],
     customAssignUsers:[],
      checkedCount:0,
      load: false,
      error: '',
      activeSidebarTab:"room_structure",
      alert: null,
      messageCount:0,
      column_count: '',
      creditCount:1,
      classwiseAll:false,
      createGroupsBlock:true,
      updateGroupsBlock:false,
      listGroupsBlock:true,
      viewRecipientsBlock:false,
      standardSections:[],
      selectSections:[],
      roomholders: [{ block: '', floor: '' }],
      totalRecipents:0,
      totalConsumed:0,
      allSectionData:[],
      loading:true,
      boardDetails:[],
      messageHistoryDetails:[],
      tags: [],
      suggestions: [],
      messageusedcount:0,
      totalmessagecount:0,
      balancemessagecount:0,
      selectedBoard:'',
      lcontactnumber:'',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId,    
      lsearchname:'',
      searchtableData:[],
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
     this.reactTags = React.createRef()
  }
  onEditorStateChange = dailydairy_description => {
    this.setState({dailydairy_description})};
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

  exportGroupSample = (url) => {
    window.location.href = url;
  }

  setMessage = (value) => {
    this.setState({ message: value || '' });
    this.setState({ messageCount: value.length });
    let divideCount = Math.ceil(value.length/160);
    if(divideCount <= 1){
       this.setState({ creditCount: 1,creditText:'Credit' });
    }
    else{
      this.setState({ creditCount: divideCount,creditText:'Credits' });
    }
  }

  onDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }
 
  onAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  setTabValue = (index) => {
    this.setState({TabValue:index})
  }
  setTabMode = (val) => {
    this.setState({TabName:val})
  }


  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };

  handleStartDate = (startdate) => {
    this.setState({ startdate: startdate })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

  handleReadReceiptRequired = (value) =>{
    this.setState({ readReceipt: value });
  }
  handleSmsAlert = (value) =>{
    this.setState({ smsAlert: value });
  }

  renderStandardSectionCheckBox = (element,index,checked) =>{   
    const { classes } = this.props;
    return <div><Grid container><Grid item xs={12} sm={6} md={9} lg={3}>
         
    <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              onClick={() => this.handleStandard(element.standard_id,index,element.checked)}
              checked={element.checked}
            />
          }
          label= {element.standard_name} 
        />
          <Chip size="small" variant="outlined" color="secondary" label={element.standard_total_count} />
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={9} >
        <Grid container>
        {element.standards.map((sections,sindex) => (
         <div>
            <Grid item style={{width:150}}>
         <FormControlLabel
         control={
           <Checkbox
           className="ml-2"  
             tabIndex={-1}
             onClick={() => this.handleSection(sections.section_id,index,sindex,sections.checked)}
             checked={sections.checked}
            
           />
         }
      
         label= {<div>{sections.section_name}     {  <Chip size="small" variant="outlined" color="secondary" label={sections.active_student_count} />}</div>} 
       />
     
         
          </Grid>
          </div>
        ))} 
        </Grid>
      </Grid>
      </Grid>
      </div>
  }

  renderClassWiseStandardSectionCheckBox = (element,index,checked) =>{   
    const { classes } = this.props;
    return <div><Grid container><Grid item xs={12} sm={6} md={9} lg={3}>
         
   <Box className="mb-4">
   {element.standard_name}<Chip className="ml-2" clickable size="small" variant="outlined" color="secondary" label={element.standard_total_count} />
   </Box>
          
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={9} >
        <Grid container>
        {element.standards.map((sections,sindex) => (
         <div>
            <Grid item style={{width:150}}>

     <Box className="mb-3">{sections.section_name} <Chip  onClick={() => {this.setState({classwiseAll:false,selectedClass: sections.section_id, selectedSection:sections.section_name, selectedStandard:element.standard_name, studentPanel:true}); this.getStudentDetails(sections.section_id,"section");}} className="ml-2" clickable size="small" variant="outlined" color="secondary" label={sections.active_student_count} /></Box>
         
          </Grid>
          </div>
        ))} 
        </Grid>
      </Grid>
      </Grid>
      </div>
  }

  getGroupMembers(id) {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      group_id:id
    };
    new Service().apiCall('groupMembers/get_data',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
      this.setState({ group_members: response.data });
      }else{
        this.setState({ group_members: [] });
      }
    }).catch(error => {
      alert(error);
    });
  }

  handleGroupMembers = (id) => {
    const lUserData = this.props.data;
    let data = new FormData();
    const postData = {
      id_group:id,
      id_board: this.state.selectedBoard, 
      students:this.state.group_members,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('groupMembers/updateGroupMembers', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      console.log(response)
      if (response.status==200) {
         this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Group Members Updated</h4>
          </div>
        </Dialog>
          ),
        });
        setTimeout(() => {
           this.setState({ basicNotify:false});
           this.getGroups();
        }, 2000)
       
      } else {
        
      }
    }).catch(error => {
    

    });
  }

  handleGroupDelete(id, status){
    let statusText="";
    if(status == 1){
      statusText = "Group Deactivated!";
    }
    else{
      statusText = "Group Activated!";
    }
      const postData = {
        id:id,
        requestname: "delete_group",
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        token:"abc",
        id_user: this.props.data.UID
      };
      new Service().apiCall('messageGroups/deleteMessagegroup', postData,
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
              <h4 className="font-weight-bold">{statusText}</h4>
            </div>
          </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify:false});
            this.getGroups();
          },2000) 
        } else {
          this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
        this.raiseLoginSignupErrorAlert("signup");
      });
  }

  setGroup = (value) => {
    this.setState({ groupName: value });
  };
  setRecipients = (value) => {
    this.setState({ groupRecipients: value });
  };

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
    let checkedData = lstudents.filter(v=>v.checked == true && v.status == 1);

  this.setState({classwiseStudent:lstudents, checkAll: !this.state.checkAll,totalRecipents:checkedData.length,totalConsumed: (checkedData.length) * this.state.creditCount});

  }

  handleGroupMembersInsertion = () =>{
 
       const postData = {
         name:this.state.groupName,
         groupmembers:this.state.groupRecipients,
         type:"inputs",
         id_organization:this.state.selectedOrganizationId,
         id_institute:this.state.selectedInstitutionId,
         id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
         token:"abc",
         id_user: this.props.data.UID
       };
       new Service().apiCall('messageGroups/insertMessagegroup', postData,
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
            <h4 className="font-weight-bold">Group Members Inserted</h4>
          </div>
        </Dialog>
          ),
        });
           setTimeout(() => {
             this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
             this.getGroups();
           }, 2000)
         } else {
           //this.raiseLoginSignupErrorAlert("signup");
         }
       }).catch(error => {
         //this.raiseLoginSignupErrorAlert("signup");
       });
   }

   handleMessageCenter= () => {

    let data = new FormData();
    const postData = {
      type:this.state.selectedTab,
      to:this.state.selectedSubTab,
      todata:this.state.groupInsert,
      tostudent:["8374348452"],
      tostudentwise:this.state.messageCenterSelectedSectionsIds,
      toindividuals:this.state.tags,
      description:this.state.message,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('messageCenter/insertMessagecenter', postData,
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
            <h4 className="font-weight-bold">Group Members Inserted</h4>
          </div>
        </Dialog>
          ),
        });
        setTimeout(() => {
         window.location.reload()
        }, 2000)
      } else {
        this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.raiseLoginSignupErrorAlert("signup");
    });
  }

  removeCustomAssignedStudent = (uid) => {
    const { group_members } = this.state;
    this.setState({
      group_members: group_members.filter((element, index) => element.UID !== uid),
    });
  }

  getStandardSectionDetails() {
    const postData = {
      count:'student',
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
      let standard_count = [];
      if (response.status==200 && response.data!='') {
        let sectionDetails = response.data;
        var lStandardSections = []; 
        sectionDetails.forEach(element => {
              if(lStandardSections[element.standard_id]){
                  var lSection = {};
                  var lStandard = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.active_student_count = element.active_student_count;
                  lSection.checked = false;
                  lSection.count = 1;
                  lStandardSections[element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lStandard.standard_id = element.standard_id;
                  lStandard.standard_total_count = element.standard_active_student_count;
                  lStandard.checked = false;
                  lStandard.count = 1;
                  lSection.checked = false;
                  lSection.count = 1;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.active_student_count = element.active_student_count;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);
                  lStandardSections[element.standard_id] = lStandard;
              }
        });
      this.setState({ sectionCount:response.data.length,standardSections: lStandardSections,selectSections:lStandardSections,allSectionData:response.data,filterSections:response.data });
      }
    }).catch(error => {
      alert(error);
    });
  }

  handleAllStudent = (status) =>{
    let lstdsections = this.state.selectSections;
    if(status==true){
      this.state.totalRecipents=0;
    }else{
      this.state.totalRecipents=this.state.studentsTotal;
    }
    lstdsections.map((element,index)=>{
      lstdsections[index].checked = !status;
         element.standards.map((sections,sindex)=>{
           lstdsections[index].standards[sindex].checked = !status;
         });
    }); 
    this.setState({selectSections:lstdsections,allSections:!this.state.allSections,totalConsumed:this.state.totalRecipents*this.state.creditCount,totalRecipents:this.state.totalRecipents});
  }

  handleStandard = (standard_id,index,status) => {

    let lstdsections = this.state.selectSections;
    let selectedids=[];
    let selectedSectionsIds=0;
    lstdsections.map((element,index)=>{
       if(element.standard_id == standard_id){
         lstdsections[index].checked = !status;
         element.standards.map((sections,sindex)=>{
           lstdsections[index].standards[sindex].checked = !status;
         });
       }
    });
    lstdsections.map(element=>{
      element.standards.map((sections)=>{
        if(sections.checked == true){
          selectedSectionsIds = selectedSectionsIds + parseInt(sections.active_student_count);
        }
      })
    })

    
    this.setState({selectSections:lstdsections,totalRecipents:selectedSectionsIds,totalConsumed:selectedSectionsIds*this.state.creditCount});
   }

   searchInput = (e) => {

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
  let checkedData = lstudents.filter(v=>v.checked == true);

  this.setState({classwiseStudent:lstudents,totalRecipents:checkedData.length,totalConsumed: (checkedData.length) * this.state.creditCount});
}

   handleSection = (section_id,index,sindex,status) => {
    let lstdsections = this.state.selectSections;
    let selectedids=[];
    let selectedSectionsIds=0;
    lstdsections[index].standards[sindex].checked = !status;
    let total_sections = lstdsections[index].standards.length;
    let checked_count = 0;
    lstdsections[index].standards[sindex].count+=1;
    lstdsections[index].standards.map((sections)=>{
      if(sections.checked == true){
        checked_count++;
      }
      if(status==false){ 
        if(section_id==sections.section_id && sections.count%2==0 && lstdsections[index].count%2!=0){
          selectedids[sections.section_id] = this.state.totalRecipents+sections.active_student_count;
        }else{
          selectedids[sections.section_id] = 0;
          }       
       }
    });
    if(checked_count == total_sections){
      lstdsections[index].checked = true;
    }
    else{
      lstdsections[index].checked = false;
    }
    lstdsections.map(element=>{
      element.standards.map((sections)=>{
        if(sections.checked == true){
          selectedSectionsIds = selectedSectionsIds + parseInt(sections.active_student_count);
        }
      })
    })
    this.setState({selectSections:lstdsections,totalRecipents:selectedSectionsIds,totalConsumed:selectedSectionsIds*this.state.creditCount});
   }
   renderSelectedSections = () => {
    let lstdsections = this.state.selectSections;
    let selectedSections = "";
    let selectedSectionsIds = "";
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
    selectedSectionsIds = selectedids.join(',');
   }
   
   this.setState({messageCenterSelectedSectionsIds:selectedSectionsIds,messageCenterSelectedSections:selectedSections, displaySectionsPanel:false});

  }

addBlock = ()=>{
    let data = this.state.roomholders;
    let object={block:'',floor:''};
    data.push(object);
    this.setState({data});
}

removeBlock = (index) =>{
    const {roomholders} = this.state;
    this.setState({ roomholders : roomholders.filter((data,i)=> i!==index)})

}

  groupChecked(id) {
    return this.state.checked.indexOf(id) > -1
}

handleStudentSearch = (val) => {
  this.setState(state => ({ group_members: [...state.group_members, val] }));
}

handleGroupTab = (type,group_id,index,status,count) => {
  let lgroupdata = this.state.groupSelection;
  let selectedids=[];
  let selectedGroupIds = 0;
  lgroupdata.map((groups)=>{ 
    if(groups.id == group_id){
      groups.count+=1;
      groups.checked = !status;   
    }
      if(groups.count%2==0){
        selectedids[groups.id] = groups.member_count;
      }
  });
  console.log(selectedids);
  if(selectedids){ 
    for(var i=0, n=selectedids.length; i < n; i++) 
    { 
      if(selectedids[i]>0){
        selectedGroupIds += selectedids[i]; 
      }
    }
   }
  this.setState({groupSelection:lgroupdata,totalRecipents:selectedGroupIds,totalConsumed:selectedGroupIds*this.state.creditCount});
 }
 renderSelectedGroups = () => {
  let lgroupdata = this.state.groupSelection;
  let selectedGroupIds = "";
  let selectedids=[];
    lgroupdata.map((groups,gindex)=>{
          if(groups.checked == true){
            selectedids.push(groups.id);
          }
      });
 if(selectedids.length > 0){
  selectedGroupIds = selectedids.join(',');
 } 
 this.setState({groupInsert:selectedGroupIds});
}

  renderClassWiseCheckBox = (element,index,checked) =>{  
    
    const { classes } = this.props;
    return <div><Grid container style={{margin:'10px -15px'}}><Grid item xs={12} sm={6} md={9} lg={2}>
      
        <Chip style={{marginRight:15}}
        variant="outlined"
        label={this.renderLabel(element.standard_name, element.standard_total_count)}
        clickable
        onClick={() => {this.setState({classwiseAll:false, selectedStandard:element.standard_name, studentPanel:true});this.getStudentDetails(index,"standard");}}
        color="primary"
      />
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={10}>
       {element.standards.map(sections => (
       
       <Chip style={{marginRight:15}}
       variant="outlined"
       label={this.renderLabel(sections.section_name, sections.active_student_count)}
       clickable
       onClick={() => {this.setState({classwiseAll:false,selectedClass: sections.section_id, selectedSection:sections.section_name, selectedStandard:element.standard_name, studentPanel:true}); this.getStudentDetails(sections.section_id,"section");}}
       color="primary"
     />
        ))} 
      </Grid>
      </Grid>
      </div>
  }
   
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

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  handleStandardSelected = (standards) => {
    console.log(standards);
    this.setState({selectedStandards:standards}); 
    let stdIds = [];
    standards.map((element,index) =>{
      stdIds.push(element.id);
     });
     let selectedStandardId = stdIds.join(",");
     this.getSubjectDetails(selectedStandardId);
     this.setState({SelectedSectionsIds:selectedStandardId})
  }

  getAllStudentDetails = () => {  
    const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('students/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const studentsList = response.data.map((data) => {
          return {...data, checked: false};
      });
        this.setState({ studentsData: studentsList });
      }
      else{
        this.setState({  studentsData: []})
      }
    }).catch(error => {
      alert(error);

    });
  }

  getGroups() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('messageGroups/get_data',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const groupList = response.data.map((data) => {
          return {...data, checked: false,email:"",mobile:"",editable: false,count:1};
      });
      if(this.state.showStatus == 'all'){
        this.setState({ groups: groupList,groupSelection:groupList});
    }
    else{
       var newArray = groupList.filter(x => x.status == this.state.showStatus);
       this.setState({ groups: newArray,groupSelection:newArray});
    }
      
      }
    }).catch(error => {
      alert(error);
    });
  }



  handleAllTab = (type,status,count) => {
    if(type == "all"){
      if(status == false){
      this.setState({allChecked:true, allStaffChecked: true, allStudentChecked:true, totalRecipents:this.state.usersTotal, totalConsumed: count * this.state.creditCount });	 
      }
      else{
      this.setState({ allChecked:false, allStaffChecked: false, allStudentChecked:false, totalRecipents:0, totalConsumed: 0 });
      }
    }
    else if(type == "staff"){
      if(status == false){
      if(this.state.allStaffChecked == true){
          this.setState({ allStaffChecked: true, allChecked:true, totalRecipents:this.state.staffTotal, totalConsumed: this.state.staffTotal * this.state.creditCount });
        }
        else{
          this.setState({ allStaffChecked: true,allChecked:false, totalRecipents:count, totalConsumed: count * this.state.creditCount });
        }	 
      } 
      else{
        if(this.state.allStaffChecked == true){
          this.setState({  allStaffChecked: false,allChecked:false, totalRecipents:0, totalConsumed: 0 });
        }
        else{
          this.setState({ allStaffChecked: false,allChecked:false, totalRecipents:0, totalConsumed: 0});
        }    
      }
    }
    else if(type == "student"){
      if(status == false){
        if(this.state.allStaffChecked == true){
          this.setState({ allStudentChecked:true,allChecked:true, totalRecipents:this.state.usersTotal, totalConsumed: this.state.usersTotal * this.state.creditCount  });
        }
        else{
          this.setState({ allStudentChecked:true,allChecked:false, totalRecipents:this.state.studentsTotal, totalConsumed: this.state.studentsTotal * this.state.creditCount  });
        }     
      }
      else{
        if(this.state.allStaffChecked == true){
          this.setState({ allStudentChecked:false,allChecked:false, totalRecipents:this.state.staffTotal, totalConsumed: this.state.staffTotal * this.state.creditCount  });
        }
        else{
          this.setState({ allStudentChecked:false,allChecked:false, totalRecipents:0, totalConsumed: 0  });
        }  
      }
    }else{
      this.setState({ allStudentChecked:false,allChecked:false, totalRecipents:0, totalConsumed: 0  });
    }
  }

  handleStaffTab = (type,status) => {
    if(type == "all"){
      if(status == false){
      this.setState({staffAll:true, staffTeaching: true, staffNonTeaching:true ,totalRecipents:this.state.staffTotal, totalConsumed: this.state.staffTotal * this.state.creditCount});	 
      }
      else{
      this.setState({ staffAll:false, staffTeaching: false, staffNonTeaching:false, totalRecipents:0, totalConsumed: 0 });
      }
    }
    else if(type == "teaching"){
      if(status == false){  
      if(this.state.staffNonTeaching == true){
          this.setState({ staffTeaching: true, staffAll:true ,totalRecipents:this.state.teachingstaffTotal, totalConsumed: this.state.teachingstaffTotal * this.state.creditCount});
        }
        else{
          this.setState({ staffTeaching: true,staffAll:false,totalRecipents:this.state.teachingstaffTotal, totalConsumed: this.state.teachingstaffTotal * this.state.creditCount });
        }	 
      } 
      else{
        if(this.state.staffNonTeaching == true){
          this.setState({  staffTeaching: false,staffAll:false ,totalRecipents:this.state.teachingstaffTotal, totalConsumed: this.state.teachingstaffTotal * this.state.creditCount});
        }
        else{
          this.setState({ staffTeaching: false,staffAll:false ,totalRecipents:0, totalConsumed: 0});
        }    
      }
    }
    else if(type == "nonteaching"){
      if(status == false){
        if(this.state.staffTeaching == true){
          this.setState({ staffNonTeaching:true,staffAll:true ,totalRecipents:this.state.nonTeachingstaffTotal, totalConsumed: this.state.nonTeachingstaffTotal * this.state.creditCount });
        }
        else{
          this.setState({ staffNonTeaching:true,staffAll:false,totalRecipents:0, totalConsumed: 0  });
        }     
      }
      else{
        if(this.state.staffTeaching == true){
          this.setState({ staffNonTeaching:false,staffAll:false ,totalRecipents:this.state.nonTeachingstaffTotal, totalConsumed: this.state.nonTeachingstaffTotal * this.state.creditCount });
        }
        else{
          this.setState({ staffNonTeaching:false,staffAll:false  });
        }  
      }
    }  
  }

  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
  }

  getUserCount() {
    const postData = {
      count:'student',
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    console.log(postData);
    new Service().apiCall('dashboards/get_dashboard_data',postData).then(response => {
      console.log(response.data);
      if (response.status==200 && response.data!='') {
        this.setState({ teachingstaffTotal:response.data.teaching_staff_count,nonTeachingstaffTotal:response.data.non_teaching_staff_count,staffTotal: response.data.staff_count, studentsTotal:response.data.student_count , usersTotal: response.data.user_count });   
      }
    }).catch(error => {
      alert(error);
    });
  } 

  getStudentDetails = (id,type) => {
    const postData = {
      standard_id:id,
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('students/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const studentsList = response.data.map((data) => {
          return {...data, checked: false};
      });
      this.setState({ studentsData: studentsList }); 
      }
      else{
        this.setState({  studentsData: []});
      }
    }).catch(error => {
      alert(error);
    });
  }

  handleSelecteSidebardSection = (id,name) => {
    console.log(id,name);
    this.setState({selectedStandardId:id, selectedSidebarSection:name,classwiseAll:false});
    this.getStudentDetails(id,"section");
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

  handleAddHolder = () => {
    let data = this.state.classholders;
    let lData = {};
    lData.standards = '';
    lData.sections = '';
    lData.streams = '';
    lData.academics = '';
    data.push(lData);
    this.setState({data});
  }


  componentDidMount() {
   this.getStandardSectionDetails();
   this.getGroups();
   this.getUserCount();
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/hostel-management")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Edit Food Fee Details
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4}> 

                                <Grid item xs={12} md={12} lg={12}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={10}>
                                            <Card className="card-box  mb-4 p-3">
                                                <Grid container>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                Edit Food Fee Details
                                                                </h4>
                                                            </div>
                                                        </div>

                                                        <ReactTable
                                                                data={this.state.holidays.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        food_type: original.food_type,

                                                                        deposite:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"Deposit"+(key + 1)} placeholder="Deposit" type="text" />
                                                                        </div>),

                                                                        fee_per_annum:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"fee_per_annum"+(key + 1)} placeholder="Fee Per Annum" type="text" />
                                                                        </div>),

                                                                        no_of_installment:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"document-type"+(key + 1)} placeholder="Installment No" type="text" />
                                                                        </div>),

                                                                        frequency:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"document-type"+(key + 1)} placeholder="Frequency" type="text" />
                                                                        </div>),

                                                                        start_date:(<div>
                                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                            <KeyboardDatePicker
                                                                            autoOk
                                                                            margin="normal"
                                                                            id={"startdate"+(key + 1)}
                                                                            format="MM/dd/yyyy"
                                                                            value={this.state.startdate}
                                                                            onChange={this.handleStartDate}   
                                                                            KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                            }}
                                                                            />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>)
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
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Food Type",
                                                            accessor: "food_type",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Deposite",
                                                            accessor: "deposite",
                                                            className: "center",
                                                            filterable: false,
                                                            },
                                                            {
                                                            Header: "Fee Per Annum",
                                                            accessor: "fee_per_annum",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "No. of Installment",
                                                            accessor: "no_of_installment",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Frequency",
                                                            accessor: "frequency",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Date Effective From",
                                                            accessor: "start_date",
                                                            className: "center",
                                                            filterable: false
                                                            }
                                                            ]}
                                                            defaultFilterMethod={filterCaseInsensitive}
                                                            defaultPageSize={10}
                                                            showPaginationTop={false}
                                                            showPaginationBottom={false}
                                                            className="-striped -highlight"
                                                            />

                                                    </Grid>
                                                </Grid>
                                            
                                                <Grid container className="mt-2">
                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                        <Button className="m-2 successBtnOutline" variant="outlined" onClick={()=>this.handleClass()}>Submit</Button> 
                                                    </Grid>
                                                </Grid>

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

export default connect(mapStateToProps, mapDispatchToPros)(EditHostelFoodFeeManagement);
