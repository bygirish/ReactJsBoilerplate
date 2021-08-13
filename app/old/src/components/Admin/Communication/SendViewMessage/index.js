import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,MenuItem,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '@utils/AuthHelper.js';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
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
      actionType:'compose',
      loading:false,
      TabValue:0,
      selectedFile:'',
      selectedFileName:'',
      checkAll:false,
      groupName:'',
      groupRecipients:'',
      messageCenterSelectedSections:[],
      messageCenterSelectedSectionsIds:[],
      groupChecked:[],
      selectedStandards:[],
      checked: [],
      groupCount:[],
      message: '',
      messagecontent:'',
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
      TemplateArray:[],
      sender_id:'ERELGO',
      entity_id:'1701158107050838436',
      template:'',
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
      activeSidebarTab:"compose",
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
    this.setState({ tags, totalRecipents:tags.length, totalConsumed: (tags.length) * this.state.creditCount,selectedTab:'Individuals' })
  }

  onInput (tag) {
    if(tag.toString().length > 2){
      console.log(123)
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      input:tag,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('Users/searchUser',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
      this.setState({ suggestions: response.data });
      }else{
        this.setState({ suggestions: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  }

  setTabValue = (index) => {
    this.setState({TabValue:index, tags:[], totalRecipents:0, totalConsumed:0})
  }
  setTabMode = (val) => {
    this.setState({TabName:val, selectedTab:val})
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
    return <div>
            <Grid container>
              <Grid item xs={12} sm={6} md={9} lg={3}>
         
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
    return <div>
            <Grid container>
              <Grid item xs={12} sm={6} md={9} lg={3}>         
                <Box className="mb-4">
                  {element.standard_name}
                  <Chip className="ml-2" clickable size="small" variant="outlined" color="secondary" label={element.standard_total_count} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={9} >
                <Grid container>
                  {element.standards.map((sections,sindex) => (
                    <div>
                      <Grid item style={{width:150}}>
                        <Box className="mb-3">{sections.section_name} 
                          <Chip  onClick={() => {this.setState({classwiseAll:false,selectedClass: sections.section_id, selectedSection:sections.section_name, selectedStandard:element.standard_name, studentPanel:true}); this.getStudentDetails(sections.section_id,"section");}} className="ml-2" clickable size="small" variant="outlined" color="secondary" label={sections.active_student_count} />
                        </Box>
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
      console.log(error);
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

  handleImageChange = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    })
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };

  handleGroupsUpload = e =>{
    e.preventDefault();
    let formData = new FormData();
   formData.append('id_organization',this.props.data.selectedOrganizationId);
   formData.append('id_institute',this.props.data.selectedInstitutionId);
   formData.append('id_board',this.props.data.selectedBoardId);
   formData.append('id_academicyear',this.props.data.selectedAcademicId);
   formData.append('insertFile',this.state.selectedFile);
   formData.append('name',this.state.groupName);
   formData.append('id_user',this.props.data.UID);
  
    new Service().apiCall('messageGroups/excelGroupsUpload', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
         this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Group Created</h4>
          </div>
        </Dialog>
          ),
        });
        this.getGroups();
        setTimeout(() => {
          this.setState({ basicNotify:false,selectedFile:'',selectedFileName:'',groupName:''});
        }, 2000) 
       
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  handleGroupMembersInsertion = e =>{
    e.preventDefault();
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

   fileUploadButton = () => {
    document.getElementById('fileButton').click();
    document.getElementById('fileButton').onchange = () =>{      
    this.setState({
        fileUploadState:document.getElementById('fileButton').value, fileUploadName:document.getElementById('fileButton').name
            });
        }
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
  
   handleMessageCenter= () => { 

    let data = new FormData();
    let message = this.state.message.trim();
    let template = this.state.template.trim();
    
    const postData = {
      template_id : template,
      sender_id : this.state.sender_id,
      entity_id : this.state.entity_id,
      type : this.state.selectedTab,
      to : this.state.selectedSubTab,
      todata : this.state.groupInsert,
      // tostudent : ["8374348452"],
      tostudent : this.state.classwiseStudent,
      tostudentwise : this.state.messageCenterSelectedSectionsIds,
      toindividuals : this.state.tags,
      message : message,
      id_organization : this.state.selectedOrganizationId,
      id_institute : this.state.selectedInstitutionId,
      id_board : this.state.selectedBoard,
      id_academicyear : this.state.selectedAcademicYear,
      token : "abc",
      role_id : this.props.data.role_id,
      id_user : this.props.data.UID
    };
    // return false;
    new Service().apiCall('messageCenter/insertMessagecenter', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      // console.log(JSON.stringify(response)); return false;
      if (response.status==200 && response.data!='') {
      
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Message Sent</h4>
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
      console.log(error);
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
          id={name}   
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
      console.log(error);

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
      console.log(error);
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
      console.log('onClick_'+this.state.staffTeaching);
      if(status == false){
        if(this.state.staffTeaching == true){
          this.setState({ staffNonTeaching:true,staffAll:true ,totalRecipents:this.state.nonTeachingstaffTotal, totalConsumed: this.state.nonTeachingstaffTotal * this.state.creditCount });
        }
        else{
          this.setState({ staffNonTeaching: true,staffAll:false,totalRecipents:this.state.nonTeachingstaffTotal, totalConsumed: this.state.nonTeachingstaffTotal * this.state.creditCount });
        }     
      }
      else{
        if(this.state.staffTeaching == true){
          this.setState({ staffNonTeaching:false,staffAll:false ,totalRecipents:this.state.nonTeachingstaffTotal, totalConsumed: this.state.nonTeachingstaffTotal * this.state.creditCount });
        }
        else{
          this.setState({ staffNonTeaching:false,staffAll:false ,totalRecipents:0, totalConsumed: 0  });
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
    // console.log(postData);
    new Service().apiCall('dashboards/get_dashboard_data',postData).then(response => {
      console.log(response.data);
      if (response.status==200 && response.data!='') {
        this.setState({ teachingstaffTotal:response.data.teaching_staff_count,nonTeachingstaffTotal:response.data.non_teaching_staff_count,staffTotal: response.data.staff_count, studentsTotal:response.data.student_count , usersTotal: response.data.user_count });   
      }
    }).catch(error => {
      console.log(error);
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
      console.log(error);
    });
  }

  getMessageTemplates = (react_getTemplate) => {
    
    let formData = new FormData();
    formData.append('sender_id', this.state.sender_id);
    formData.append('react_getTemplate',react_getTemplate);
    
    axios.post('https://egenius.in/message_provider/get_message_template.php', formData).then(response => {
      // console.log('template'+response.data);
      if (response.status==200 && response.data!='') {
        const templateList = response.data.map((data) => {
          return {...data};         
        });
        console.log(templateList)
        this.setState({ TemplateArray: templateList }); 
      }
      else{
        this.setState({  TemplateArray: []});
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getTemplateConetent = (id) =>{
    let template_id = id;
    let sender_id = this.state.sender_id;

    let formData = new FormData();
    formData.append('react_template_id',template_id);
    formData.append('sender_id',sender_id);

    axios.post('https://egenius.in/message_provider/get_message_template.php', formData).then(response => {
      //console.log('template'+response.data);
      this.setState({message: response.data, template:id});
    }).catch(error => {
      console.log(error);
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


  componentDidMount() {
   this.getStandardSectionDetails();
   this.getGroups();
   this.getUserCount();
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
   this.getMessageTemplates('react_getTemplate');
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/messagecenter")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Send/View Message
            </Typography>
               </Grid>
     
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  


      <Grid container>
        <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                  <ListItem button className={this.state.actionType == "compose" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"compose",showStatus:'all'});this.getGroups()}}>
                    <span>Compose Message</span>
                    
                  </ListItem>
                  {/* <Divider />
                  <ListItem button className={this.state.actionType == "group" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"group",showStatus:'all'});this.getGroups()}}>
                    <span>Group Module</span>
                  </ListItem> */}
                  <Divider />
                  <ListItem button className={this.state.actionType == "search" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"search",showStatus:'all'});this.getGroups()}}>
                    <span>Advanced Search</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </Card>
          </Grid>  
        <Grid item xs={12} md={8} lg={9}>
          {this.state.actionType == "compose" && <div>

        <Grid container justify="center" className="mt-4">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box mb-4 customTab ">
        <div className="card-header--title mx-3 font-size-lg my-3">
              Compose Message
          </div>  
          <Grid item xs={12} md={12} lg={12} className="m-3">
            <FormControl fullWidth>
              <TextField                        
                id="outlined-select-currency"
                select
                label="Select Template"
                variant="outlined"
                value={this.state.template}
                onChange={(event) => {this.getTemplateConetent(event.target.value); this.setState({template:event.target.value});}} >
                {this.state.TemplateArray.map(option => (
                <MenuItem key={option.id} value={option.id} id={option.id}>
                    {option.name}
                </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12} lg={12} className="m-3">
            <FormControl fullWidth>
              <TextField
                    inputProps={{
                     autoComplete: 'off'
                    }}
                   id="message"
                   label="Type your message here."
                   placeholder="Type your message here."
                   value = {this.state.message}
                   onChange={(event) => this.setMessage(event.target.value)}
                   variant="outlined"
                   multiline
                   rows={4}
              />
            </FormControl>
            {this.state.messageCount > 0 && <span style={{color:'#AAAAAA',fontWeight:400, fontSize:'13px'}}>
             Character Count: <span style={{color:'red'}}>{this.state.messageCount}</span>/160 characters. Consuming  <span style={{color:'red'}}>{this.state.creditCount} </span>{this.state.creditText} per recipient.
                </span>}
        </Grid>
        </Card>
        </Grid>
      
        </Grid>         
          <Grid container  justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8}>
      <Card className="card-box mb-4 customTab ">
            <div className="card-header p-1 m-3">
                <Grid container spacing={2} justify="center">
                    <Grid item xs={12} md={8} lg={12}>
                        
                        <Tabs
                        value={this.state.tabValue}
                        indicatorColor="default"
                        textColor="secondary"
                        >
                            <ButtonGroup  color="secondary" aria-label="outlined secondary button group" className="buttonGroup">
                                <Button variant={this.state.TabValue == 0 ?"contained":"outlined"} onClick={()=>{this.setTabValue(0);this.setTabMode("All")}}>ALL</Button>
                                <Button variant={this.state.TabValue == 1 ?"contained":"outlined"} onClick={()=>{this.setTabValue(1);this.setTabMode("Staff")}}>STAFF</Button>
                                <Button variant={this.state.TabValue == 2 ?"contained":"outlined"} onClick={()=>{this.setTabValue(2);this.setTabMode("Students")}}>STUDENTS</Button>
                                <Button variant={this.state.TabValue == 3 ?"contained":"outlined"} onClick={()=>{this.setTabValue(3);this.setTabMode("Classwise Students")}}>CLASSWISE STUDENTS</Button>
                                <Button variant={this.state.TabValue == 4 ?"contained":"outlined"} onClick={()=>{this.setTabValue(4);this.setTabMode("Groups")}}>GROUPS</Button>
                                <Button variant={this.state.TabValue == 5 ?"contained":"outlined"} onClick={()=>{this.setTabValue(5);this.setTabMode("Individuals")}}>INDIVIDUALS</Button>
                            </ButtonGroup>
                        </Tabs>
                    </Grid>
                </Grid>  
            </div>

            <CardContent className="p-1 m-3 customStyle">
                <Typography
                component="div"
                role="tabpanel"
                >
                {this.state.TabValue == 0 && 
                    <Box p={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={4}>
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        tabIndex={-1}
                                        checked={this.state.allChecked}
                                        onClick={() => {this.handleAllTab('all',this.state.allChecked,this.state.usersTotal);this.setState({selectedTab:'All',selectedSubTab:'All'});}}
                                    />
                                    }                   
                                    label={"All"} 
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.usersTotal} />
                            </Grid>
                            <Grid item xs={12} sm={10} md={4}>
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        tabIndex={-1}
                                        checked={this.state.allStaffChecked}
                                        onClick={() => {this.handleAllTab('staff',this.state.allStaffChecked,this.state.staffTotal);this.setState({selectedTab:'All',selectedSubTab:'Staff'});}}
                                    
                                    />
                                    }
                                
                                    label={"Staff"}
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.staffTotal} />
                            </Grid>
                            <Grid item xs={12} sm={10} md={4}>
                        
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        tabIndex={-1}
                                        checked={this.state.allStudentChecked}
                                        onClick={() => {this.handleAllTab('student',this.state.allStudentChecked,this.state.studentsTotal);this.setState({selectedTab:'All',selectedSubTab:'Student'});}}
                                    
                                    />
                                    }
                                
                                    label={"Students"}
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.studentsTotal} />
                        
                            </Grid>
                        </Grid>
                    </Box>
                }

                {this.state.TabValue == 1 && 
                    <Box p={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={4}>               
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        tabIndex={-1}
                                        checked={this.state.staffAll}
                                        onClick={() => {this.handleStaffTab('all',this.state.staffAll);this.setState({selectedTab:'Staff',selectedSubTab:'All'});}}
                                        
                                        />
                                    }                                
                                    label="All"
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.staffTotal} />            
                            </Grid>

                            <Grid item xs={12} sm={10} md={4}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.staffTeaching}
                                    onClick={() => {this.handleStaffTab('teaching',this.state.staffTeaching);this.setState({selectedTab:'Staff',selectedSubTab:'Teaching'});}}
                                    
                                    />
                                }
                            
                                label="Teaching Staff"
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.teachingstaffTotal} />
                            </Grid>

                            <Grid item xs={12} sm={10} md={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        tabIndex={-1}
                                        checked={this.state.staffNonTeaching}
                                        onClick={() => {this.handleStaffTab('nonteaching',this.state.staffNonTeaching);this.setState({selectedTab:'Staff',selectedSubTab:'NonTeaching'});}}
                                        
                                        />
                                    }                                
                                    label="Non Teaching Staff"
                                />
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.nonTeachingstaffTotal} />
                            </Grid>
                        </Grid>
                    </Box>
                }  

                {this.state.TabValue == 2   && 
                    <Box p={0}>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={12} lg={12}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.allSections}
                                    onClick={() => {this.handleAllStudent(this.state.allSections);this.setState({selectedTab:'StudentWise',selectedSubTab:'StudentWise'});}}
                                    />
                                }
                                label="All"
                                />
                
                                <Chip size="small" variant="outlined" color="secondary" label={this.state.studentsTotal} />
                            </Grid>
                        </Grid>  
                        {this.state.selectSections.length > 0 && this.state.selectSections.map((element, index) => {
                            if(this.state.allSections)
                                return this.renderStandardSectionCheckBox(element,index,true);
                              else 
                                return this.renderStandardSectionCheckBox(element,index,false);
                        })}
                    </Box>}


              {this.state.TabValue == 3   && 
                <Box p={0}>
                  <Grid container>
                    <Grid item xs={12} sm={6} md={12} lg={12} className="mb-3">{"All"} 
                      <Chip className="ml-2" clickable  size="small" variant="outlined" color="secondary" label={this.state.studentsTotal}  onClick={() => {this.setState({classwiseAll:true,  studentPanel:true,selectedTab:'classWise'});this.getAllStudentDetails();}} />
                    </Grid>
                  </Grid>

                  {this.state.selectSections.length > 0 && this.state.selectSections.map((element, index) => {
                    if(this.state.allSections)
                      return this.renderClassWiseStandardSectionCheckBox(element,index,true);
                    else 
                      return this.renderClassWiseStandardSectionCheckBox(element,index,false);
                  })}
                </Box>
              }

              {this.state.TabValue == 4   && <Box p={0}>
              <Grid container spacing={2}>
                  {this.state.groupSelection.map((element, index) => (
                       <Grid item xs={12} sm={6} md={4} lg={4}>
                       <FormControlLabel
                       control={
                         <Checkbox
                           tabIndex={-1}
                           checked={element.checked}
                           onClick={() => {this.handleGroupTab('groups',element.id,index,element.checked,element.member_count);this.setState({selectedTab:'Group',selectedSubTab:element.id});}}
                          
                         />
                       }
                       
                       label={element.name}
                     />
                      <Tooltip
      id="tooltip-top"
      title="View group members"  
      placement="top"
    >
                            <Chip clickable  onClick={()=> {this.getGroupMembers(element.id);this.setState({viewRecipientsPanel:true,group_id:element.id});}} size="small" variant="outlined" color="secondary" label={element.member_count} /></Tooltip>
                   </Grid>
                  ))}
                  </Grid>
                  <Grid container>
                  <Grid item xs={12} sm={6} md={12} lg={12} className="text-right">
                       <Button color="secondary" variant="outlined" onClick={() => {this.setState({actionType:"group"});this.getGroups();}}>Create New Group</Button>
                  </Grid>
                  </Grid>
               </Box>}

               {this.state.TabValue == 5   && <Box p={0}>
                 <div className="w-100">
                    <ReactTags
                      ref={this.reactTags}
                      tags={this.state.tags}
                      placeholderText="Search name"
                      removeButtonText="Click to remove"
                      allowNew={true}
                      suggestions={this.state.suggestions}
                      onDelete={this.onDelete.bind(this)}
                      onInput={this.onInput.bind(this)}
                      delimiters={['Enter']}
                      onAddition={this.onAddition.bind(this)} />  
                  </div>  
               </Box>}
            
              </Typography>
              </CardContent>
               
            
            </Card>
       </Grid> 
       </Grid>

       <Grid container  justify="center" className="mt-4">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box mb-4 customTab ">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={4} className="text-center">
          <div className="py-3 px-3 d-flex align-items-center text-center">
          <div className="w-100">
          <span className="d-block opacity-7">sending to</span>
            <span className="font-weight-bold font-size-md">
            {this.state.totalRecipents}
            </span>
            <span className="d-block opacity-7">recipients</span>
          </div>
        </div>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
          <div className="py-3 px-3 d-flex align-items-center text-center">
          <div className="w-100">
          <span className="d-block opacity-7">consuming</span>
            <span className="font-weight-bold font-size-md">
            {this.state.totalRecipents * this.state.creditCount}
            </span>
            <span className="d-block opacity-7">credits</span>
          </div>
        </div>          
          </Grid>
          <Grid item xs={12} md={4} lg={4} className="margin-auto">
          <div className="py-3 px-3 d-flex align-items-center text-center ">
          {this.state.totalConsumed > 0 && this.state.message!="" && <Button color="primary" variant="outlined" size="large" onClick={()=>{this.renderSelectedSections();this.renderSelectedGroups();this.setState({confirmPanel:true,totalRecipents:this.state.totalRecipents,selectedTab:this.state.selectedTab})}}>Confirm</Button>}
        </div>           
          </Grid>
        </Grid>            
        </Card>
        </Grid>
        </Grid>  
            </div>}

            {this.state.actionType == "group" && <div>
            <Grid container justify="center">
          <Grid item xs={12} sm={12} md={8}>
          <Card className="card-box mb-4 p-3">
          <form
        onSubmit={this.state.selectedFile == "" ? this.handleGroupMembersInsertion.bind(this) : this.handleGroupsUpload.bind(this)}
        autoComplete="off">
              <div className="card-header--title mx-3 font-size-lg my-2">
              Create Group
          </div>  
           
                <Grid container>
                <Grid item xs={12} sm={12} md={3} className="margin-auto">
                <FormControl fullWidth>
                    <div>
                      Group Name
                    </div>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={10} md={8}>
                    <FormControl fullWidth>
                    <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}
                    required
                    id="group-name"   
                    value={this.state.groupName}
                    label="Group Name" 
                    type="search" 
                    className="m-2"
                    onChange={(event) => this.setGroup(event.target.value)}
                    inputRef={this.textInput} 
                    variant="outlined" />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container>
                <Grid item xs={12} sm={12} md={3} className="margin-auto">
                <FormControl fullWidth>
                    <div>
                      Group Recipients
                    </div>
                </FormControl>
                </Grid> 
                <Grid item xs={12} sm={10} md={8}>
                <FormControl fullWidth>
                   <TextField 
                    inputProps={{
                    autoComplete: 'off'
                    }}
                    required={this.state.selectedFile === ""?true:false}
                    id="select-recipient"   
                    value={this.state.groupRecipients}
                    label="Select recipients" 
                    placeholder="name,email,phone and enter to insert multiple"
                    type="search" 
                    className="m-2"
                    onChange={(event) => this.setRecipients(event.target.value)}
                    inputRef={this.textInput} 
                    multiline
                    rows={5}
                    variant="outlined" />

                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container className="mt-4">
                <Grid item xs={12} sm={12} md={6} className="text-left">
                  <Button variant="outlined" color="secondary" onClick={()=>this.exportGroupSample(Config.url+"/MessageCenter/excelMessageGroup?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard)}>Sample Excel Format</Button>
                  &nbsp;&nbsp; <input id="fileButton" type="file" onChange={this.handleImageChange} ref={fileInput} hidden />
                  <Button variant="outlined" color="secondary"  onClick={()=>this.handleClick()}>Import</Button>{this.state.selectedFileName}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} className="text-right">
                   <Button type="submit" variant="outlined" className="successBtnOutline" >Submit</Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>

        <Grid container  justify="center">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Groups List
                </h4>
              </div>
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.getGroups()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.getGroups()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.getGroups()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.groups.map((original,key) => {
return ({
  slno:key+1,
  id: original.id,
  name: original.name,
  member_count: original.member_count,
  created_date: original.created_on,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
                <Tooltip
id="tooltip-top"
title={"View"}
placement="top"
>
                <Button
                className="m-2"
                simple
                onClick={()=> {this.getGroupMembers(original.id);this.setState({viewRecipientsPanel:true,group_id:original.id});}}
                color="secondary"
                className="edit"
              >
                <ViewIcon />
              </Button> 

</Tooltip>
                
                {/* use this button to remove the data row */}
                <Tooltip
        id="tooltip-top"
        title={original.status == 1 ? "Deactivate":"Activate"}
        placement="top"
     
      >
           <FormControlLabel
                      control={
                        <Switch
                          checked={original.status == 1 ? true:false}
                          onChange={() => this.handleGroupDelete(original.id, original.status)}
                          value="checkedA"
                        />
                      }
                      label=""
                    />
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
Header: "Group Name",
accessor: "name",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="groupname"   
value={filter ? filter.value : ''}
placeholder="Search Group Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
Header: "No of Recipients",
accessor: "member_count",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="member-count"   
value={filter ? filter.value : ''}
placeholder="Search Recipient Count"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
Header: "Created Date",
accessor: "created_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="created-date"   
value={filter ? filter.value : ''}
placeholder="Search Created Date"
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
    <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid>
        </Grid>
  </CardActions>

        </Card></Grid> 
        </Grid>
            </div>}

            {this.state.actionType == "search" && <div>
            <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={12} md={10}>
          <Card className="card-box mb-4 p-3">
              <div className="card-header--title mx-3 font-size-lg my-2">
              Messages History
          </div>  
          <Grid container spacing={2}>
               <Grid item xs={12} sm={12} md={6}> 
               
             </Grid>
         
             <Grid item xs={12} sm={12} md={6}>              
             
             </Grid>
           </Grid>
<Grid container className="inputMargin searchMessageGrid mx-3">
<Grid item xs={12} sm={12} md={3} className="margin-auto text-left"> 
                 <div onClick={()=> this.setState({searchbyDateChecked: !this.state.searchbyDateChecked})}>
                 <FormControlLabel
                   control={
                     <Radio
                       checked={this.state.searchbyDateChecked}

                       value="Yes"
                       name="radio button enabled"
                       aria-label="A"
                      
                     />
                   }
                 
                   label=""
                 />
          
                 Search by Date
                 </div></Grid>

<Grid item xs={12} sm={12} md={3} className="pickerGrid" className="text-center margin-auto">

{this.state.searchbyDateChecked &&     <FormControl fullWidth>
             <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            className="mx-2"
            id="from-date"
            label="From date"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={this.state.startdate}
            onChange={this.handleStartDate}   
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
      </MuiPickersUtilsProvider>
              </FormControl>}
            </Grid>

        <Grid item xs={12} sm={12} md={3} className="pickerGrid" className=" text-center margin-auto">
        {this.state.searchbyDateChecked &&   <FormControl fullWidth>
             <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
             disabled={this.state.searchbyDateChecked?false:true}
             className="mx-2"
            id="to-date"
            label="To date"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={this.state.enddate}
            onChange={this.handleEndDate}   
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
      </MuiPickersUtilsProvider>
              </FormControl>}
            </Grid>
            <Grid item xs={12} sm={12} md={3} className="text-center margin-auto"> 
               <Button color="primary" variant="outlined"  onClick={() => {this.getMessageHistorySearchDetails(this.state.startdate,this.state.enddate,this.state.userSearchInput,this.state.customTextAssignInput);}}>Search</Button>
           </Grid>
           </Grid>
          </Card>
          </Grid>
          </Grid>

          <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={10} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Messages History
                </h4>
              </div>
        </div>
    <ReactTable

data={
  this.state.searchtableData.map((original,key) => {
    return ({
      slno: key+1,
      id:original.id,
      to: original.type+" , "+original.to,
      description:original.description,
      sent_date:original.date,
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
id="slno"   
value={filter ? filter.value : ''}
placeholder="S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
  Header: "Name",
  accessor: "to",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="to"   
value={filter ? filter.value : ''}
placeholder="Search Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Mobile No",
  accessor: "to",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="mobile"   
value={filter ? filter.value : ''}
placeholder="Search Sento to"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
Header: "Message",
accessor: "description",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="description"   
value={filter ? filter.value : ''}
placeholder="Search Message"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Sent Date & Time",
  accessor: "sent_date",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="sent-date"   
  value={filter ? filter.value : ''}
  placeholder="Search Sent Date"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
  {
    Header: "Delivered Date & Time",
    accessor: "sent_date",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="delivery-date"   
    value={filter ? filter.value : ''}
    placeholder="Search Delivered Date"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    }
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions stats style={{marginTop:0}}>

  </CardActions>

        </Card></Grid> 
        </Grid>
          </div>}
        </Grid> 
        </Grid>
           

        <Drawer

          anchor="right"
          open={this.state.viewRecipientsPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({viewRecipientsPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewRecipientsPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Recipients List
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Autocomplete
          type="student"
          SearchPlaceholderText="Enter name"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          />         

            {this.state.group_members.length > 0 && 
            <div>
            <Grid container className="mt-4">
              <Grid item xs={12} sm={12} md={1}></Grid>
            <Grid item xs={12} sm={12} md={10}>
            <Card className="card-box mb-4">
            <ul className="suggestions" style={{boxShadow:'none',padding:0}}> 
            {this.state.group_members.map((element,index) => {
               return(
                <li key={element.id} className="py-2">
                  {index+1}.  {element.name} <span style={{float:'right'}}>  <Button style={{padding:0,margin:0,minWidth:'auto'}}
                          simple
                          round
                          onClick={()=>  this.removeCustomAssignedStudent(element.UID)}
                          className="dangerBtnOutline"
                        >
                          <Clear />
                        </Button></span>
                </li>
               ) 
            })}
            </ul>
     
         
            </Card>
            <Grid container className="mt-2">
            <Grid item xs={12} sm={12} md={12} className="text-right">
            
            <Button className="successBtnOutline text-right" variant="outlined" size="small" onClick={ () => {
                    this.setState({ viewRecipientsPanel:false});
                   this.handleGroupMembers(this.state.group_id);
                } }>Submit</Button>
          
           </Grid>
           </Grid>
            </Grid>
          </Grid>
        
          </div>
            }  
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
<Grid container spacing={4}>
<Grid item xs={12} md={8} lg={3}>
   <Card className="card-box ml-4 mb-4">
    <div className="text-center">
      <div className="pt-1">
        <List className="py-2">
        <ListItem button className={this.state.classwiseAll ?"my-2 activeSidebarColor":"my-2"} onClick={ () => {
                   this.setState({ classwiseAll:true,selectedClass:''});  this.getAllStudentDetails();
              }}>
              <span>All Recipients</span>
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
<Grid container spacing={4}>
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
id="uid"   
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
id="contact-no"   
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
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" onClick={()=>this.setState({studentPanel:false})}>
        Close
        </Button>
        </Grid>
        </Grid>
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
open={this.state.confirmPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({confirmPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({confirmPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Confirm Recipients
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Card className="card-box mb-4 mt-2 ">
<Grid container spacing={2} justify="center">  
        <Grid item xs={12} md={12} lg={10} className="m-3">
        <FormControl fullWidth>
                   <TextField
                   disabled
                   inputProps={{
                    autoComplete: 'off'
                    }}
                   value={this.state.message}
                   id="message"
                   label="Message Content"
                   placeholder="Message Content"
                   variant="outlined"
                   multiline
                   rows={4}
                   />
                  </FormControl>
                  {this.state.messageCount > 0 && <span style={{color:'#AAAAAA',fontWeight:400, fontSize:'13px'}}>
              Consuming  <span style={{color:'red'}}>{this.state.creditCount} </span>{this.state.creditText} per recipient.
                </span>}
               
                </Grid>
        </Grid>
        </Card>

        <Grid container spacing={2} justify="center" className="mt-4">         
        <Card className="card-box mb-4 mt-2 p-3">
        Recipients type: <span style={{fontWeight:500}}>{this.state.selectedTab?this.state.selectedTab:"Individuals"}</span>
        </Card>
        </Grid>   

        <Grid container spacing={2} justify="center" className="mt-4">
        <Grid item xs={12} md={10} lg={10}>
        <Card className="card-box mb-4 customTab ">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={4} className="text-center">
          <div className="py-3 px-3 d-flex align-items-center text-center">
          <div className="w-100">
          <span className="d-block opacity-7">sending to</span>
            <span className="font-weight-bold font-size-md">
            {this.state.totalRecipents}
            </span>
            <span className="d-block opacity-7">recipients</span>
          </div>
        </div>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
          <div className="py-3 px-3 d-flex align-items-center text-center">
          <div className="w-100">
          <span className="d-block opacity-7">consuming</span>
            <span className="font-weight-bold font-size-md">
            {this.state.totalRecipents * this.state.creditCount}
            </span>
            <span className="d-block opacity-7">credits</span>
          </div>
        </div>          
          </Grid>
          <Grid item xs={12} md={4} lg={4} className="margin-auto">
          <div className="py-3 px-3 d-flex align-items-center text-center ">
          {this.state.totalConsumed > 0 && this.state.message!="" && AuthHelper('Message Center','can_export') && <Button className="successBtnOutline" size="large" onClick={()=>this.handleMessageCenter()}>Send</Button>}
        </div>           
          </Grid>
        </Grid>            
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);