import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
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

class AddViewCircular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:AuthHelper('Circulars','can_create') ? 'create':'view',
      loading:false,
      dashboardDetails:[],
      selectedStandards:[],
      subjects:[],
      roleData:[],
      SelectedSectionsIds:'',
      SelectedDepartmentIds:'',
      markSubmitted:'',
      lfeedback:'',
      filterReadReceipients:[],
      circularsData:[],
      circularsDataIdData:[],
      circularsDataMapData:[],
      circularsIdData:[],
      circularsMapData:[],
      readcircularsMapData:[],
      unreadcircularsMapData:[],
      circularsNotesData:[],
      readCount:0,
      unReadCount:0,
      allCount:0,
      SelectedSectionsIds:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      classwiseSections:[],
      basicNotify:false,
      allStudents:true,
      searchStudent:false,
      startdate: new Date(),
      currentDate:new Date(),
      enddate:  new Date(),
      selectedFile:null,
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '',
      selectedEnabled:'',
      gradeMarksSelected:'',
      assignmentname: '',
      lstaff:'',
      lnote:'',
      lfeedback:'',
      lmarks:'',
      lsubject:'',
      lchapter:'',
      ltype:'',
      lenabled:'',
      lgrademarks:'',
      lgrade:'',
      staff_depts:'',
      lsubmission:'',
      readReceipt:'',
      smsAlert:'',
      gradeData:[],
      description: EditorState.createEmpty(),
      circular_description: EditorState.createEmpty(),
      imagePreviewUrl:defaultImage,
      assignmentsData:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      imagePreviewUrlStudent:defaultImage,
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = circular_description => {
    this.setState({circular_description})
  
  };

    onEditorStateUpdate = description => {
    
      this.setState({description})
    console.log({description});
    };

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

  handleStartDate = (startdate) => {
    (moment(startdate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
    this.setState({ startdate: startdate }) )
  };
  handleEndDate = (enddate) => {
    (moment(enddate).format("YYYY-MM-DD") >=moment(this.state.currentDate).format("YYYY-MM-DD")&&
    this.setState({ enddate: enddate }) )
  };

  handleChangeEnabledGrade = (value) => {
    this.setState({ lgrade: value });
  };

  handleChangeEnabledSubmission = (value) => {
      this.setState({ lsubmission: value }); 
  };
  handleChangeEnabled = (value) => {
    this.setState({ lenabled: value });
  };

  handleGradingRequired = (value) => {     
       this.setState({ gradeRequired: value });
  };
  handleGradeMarksSelected = (value) => {
      this.setState({ ltype: value }); 
  };

  setGrademarks = (value) =>{
    this.setState({ lgrademarks: value });
  }
  handleReadReceiptRequired = (value) =>{
    this.setState({ readReceipt: value });
  }
  handleSmsAlert = (value) =>{
    this.setState({ smsAlert: value });
  }

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards}); 
    let stdIds = [];
    standards.map((element,index) =>{
      stdIds.push(element.id);
     });
     let selectedStandardId = stdIds.join(",");
     this.getSubjectDetails(selectedStandardId);
     this.setState({SelectedSectionsIds:selectedStandardId})
     console.log({selectedStandardId});
     console.log({standards});
  }
  handleStudentSearch = (val) => {
    this.props.history.push("/admin/view-student-info/"+val.UID);
  }
  handleIndividualSearch = (val) => {
    this.setState({'id_user':val.UID,viewStudentPanel:true});
    setTimeout(() => {
      this.getIndividualStudentDetails(val.UID);
    }, 1500);
  }  
  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
        disabled={this.props.data.usertype == "student"? true:false}
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

  getSubjectDetails(id_section){
    const postData = { 
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      type:"assignment",
      standard_id:[id_section],
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('subjectStandards/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ subjects: response.data });
      }else{
        this.setState({ subjects: [] });
      }
    }).catch(error => {
      alert("error.response.data.message");

    });
  }

  handleSubjectSelection= (type,name,status) => {
    if(type){  
      this.setState({subjectChecked:true,subjectName:name,lsubject:type, subjectPanel:false});	 
      }
      else{
      this.setState({ subjectChecked:false,subjectName:'',lsubject:'', subjectPanel:false });
      } 
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

    handleDepartment = (id,index,status) => {
      let ldepartments = this.state.roleData;
      let departmentids=[];
      let selectedDepartmentsIds='';
      let selectedDepartmentIds=0;
      ldepartments[index].checked = !status;
      ldepartments[index].count+=1;
      ldepartments.map((element,index)=>{
         if(element.id == id){
          ldepartments[index].checked = !status;
         }
      });
      ldepartments.map(element=>{
        if(element.checked == true){
          departmentids.push(element.id);
        }
  });
  if(departmentids.length > 0){
  selectedDepartmentsIds = departmentids.join(',');
  }
      this.setState({roleData:ldepartments,SelectedDepartmentIds:selectedDepartmentsIds});
      console.log({selectedDepartmentsIds});
      console.log({ldepartments});
     }

    renderDepartmentsCheckBox = (element,index,checked) =>{   
      const { classes } = this.props;
      return <div>
          <Grid container>
              <Grid item xs={12} sm={6} md={3} lg={12}>
           <FormControlLabel
           control={
             <Checkbox
               disabled={this.props.data.usertype == "student"? true:false}
               tabIndex={-1}
               onClick={() => this.handleDepartment(element.id,index,element.checked)}
               checked={element.checked}
             />
           }
           label= {element.name} 
         />
            </Grid>
        </Grid>
        </div>
    }

    handleAllDepartment = (status) =>{
      let ldepartments = this.state.roleData;
      let departmentids=[];
      let selectedDepartmentsIds='';
      ldepartments.map((element,index)=>{
        ldepartments[index].checked = !status;
      }); 
      ldepartments.map(element=>{
        if(element.checked == true){
          departmentids.push(element.id);
        }
  });
      if(departmentids.length > 0){
        selectedDepartmentsIds = departmentids.join(',');
        }
        console.log(selectedDepartmentsIds)
      this.setState({roleData:ldepartments,allDepartments:!this.state.allDepartments,SelectedDepartmentIds:selectedDepartmentsIds});
    }

    handleCircular = () => {
      const lUserData = this.props.data;
   
      let data = new FormData();
      let formData = new FormData();
      formData.append('id_board',this.state.selectedBoard);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      formData.append('id_section',this.state.SelectedSectionsIds?this.state.SelectedSectionsIds:this.state.selectedStandardId);
      formData.append('id_staff_dept',this.state.SelectedDepartmentIds?this.state.SelectedDepartmentIds:'');
      formData.append('start_date',moment(this.state.startdate).format("YYYY-MM-DD"));
      formData.append('end_date',moment(this.state.enddate).format("YYYY-MM-DD"));
      formData.append('name',this.state.lname);
      // formData.append('details',this.state.id_circular!=''?this.state.description.getCurrentContent().getPlainText():this.state.circular_description.getCurrentContent().getPlainText());
      formData.append('details',this.state.circular_description.getCurrentContent().getPlainText());
      formData.append('read_receipt',this.state.readReceipt);
      formData.append('sms_alert',this.state.smsAlert);
      formData.append('path',this.state.selectedFile);
      formData.append('requestname',"insert_circular");
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('role_id',this.props.data.role_id);
      formData.append('id_user',this.props.data.UID);
     console.log(...formData);
      new Service().apiCall('circulars/insertCircular', formData,
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
        <h4 className="font-weight-bold">Circular Inserted</h4>
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
        this.showError(error.response.data)
  
      });
    }
    handleEvent(circular_id){
      const lUserData = this.props.data;
   
      let data = new FormData();
      let formData = new FormData();
      formData.append('id_board',this.state.selectedBoard);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      // formData.append('id_section',this.state.student_standards);
      // formData.append('id_section',this.state.SelectedSectionsIds!=''?this.state.SelectedSectionsIds:this.state.student_standards);
      formData.append('id_section',this.state.SelectedSectionsIds);
      formData.append('id_staff_dept',this.state.SelectedDepartmentIds);
      // formData.append('id_staff_dept',this.state.SelectedDepartmentIds?this.state.SelectedDepartmentIds:this.state.staff_depts);
      formData.append('start_date',moment(this.state.startdate).format("YYYY-MM-DD"));
      formData.append('end_date',moment(this.state.enddate).format("YYYY-MM-DD"));
      formData.append('circular_id',this.state.id_circular);
      formData.append('name',this.state.lname);
      // formData.append('details',this.state.id_circular!=''?this.state.description.getCurrentContent().getPlainText():this.state.circular_description.getCurrentContent().getPlainText());
      formData.append('details',this.state.description.getCurrentContent().getPlainText());
      formData.append('path',this.state.selectedFile != null && this.state.selectedFile != '' ? this.state.selectedFile : this.state.path );
      // formData.append('read_receipt',this.state.readReceipt);
      // formData.append('sms_alert',this.state.smsAlert);
      // formData.append('path',this.state.selectedFile);
      // formData.append('requestname',"insert_circular");
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('role_id',this.props.data.role_id);
      formData.append('id_user',this.props.data.UID);
     console.log(...formData);
      new Service().apiCall('circulars/updateCircular', formData,
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
        <h4 className="font-weight-bold">Circular Updated</h4>
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
        this.showError(error.response.data)
  
      });
    }
    handleImageChangeStudent = event => {
      this.setState({
        selectedFile: event.target.files[0]
      })
      let reader = new FileReader();
       
      reader.onloadend = () => {
        this.setState({
          imagePreviewUrlStudent: reader.result
        });
      }
   
      reader.readAsDataURL(event.target.files[0])
    };
    handleClickStudent = () => {
      fileInput.current.click();
    };
    handleRemoveStudent = () => {
      this.setState({
        imagePreviewUrlStudent: defaultImage, selectedFile:null
      });
      fileInput.current.value = null;
    };

    getCircularData(id_section) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_section:this.props.data.usertype == "student"?this.props.data.standard:id_section,
        id_board:this.state.selectedBoard,
        usertype:this.props.data.usertype,
        role_id: this.props.data.role_id,
      };
      new Service().apiCall('circulars/getData',postData).then(response => {
        console.log({response})
        if (response.status==200 && response.data!='') {
      

               this.setState({ circularsData:response.data});
        }else{
          this.setState({ circularsData:[]});
        }
      }).catch(error => {
        console.log(error)
        //this.showError(error.response.data)
  
      });
  
    }
    getCircularMappedData(id_section,id) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_section:id_section,
        id:id
      };
      new Service().apiCall('circulars/getStudentCircularMap',postData).then(response => {
        if (response.status==200 && response.data!='') {
          var lCirculars = [];
          var lReadCirculars = [];
          var lUnReadCirculars = [];
          response.data.forEach(element => {
                    var lCircular = {};
                    var lReadCircular = {};
                    var lUnReadCircular = {};
                    lCircular.id                  = element.id;
                    lCircular.view_count          = element.view_count;
                    lCircular.studentname         = element.studentname;
                    lCircular.email               = element.email;
                    lCircular.contact             = element.contact;
                    lCircular.roll_no             = element.roll_no;
                    lCircular.id_user             = element.id_user;
                    lCircular.id_circular         = element.id_circular;
                    lCircular.id_section          = element.id_section;
                    lCirculars.push(lCircular);
                    if(element.view_count==1){
                      lReadCircular.id = element.id;
                      lReadCircular.studentname         = element.studentname;
                      lReadCircular.view_count         = element.view_count;
                      lReadCircular.contact             = element.contact;
                      lReadCirculars.push(lReadCircular);
                    }
                    if(element.view_count==0){
                      lUnReadCircular.id = element.id;
                      lUnReadCircular.studentname         = element.studentname;
                      lUnReadCircular.view_count         = element.view_count;
                      lUnReadCircular.contact             = element.contact;
                      lUnReadCirculars.push(lUnReadCircular);
                    }
                });
                this.setState({ filterReadReceipients:lCirculars,receipientSuggestions:lCirculars,circularsMapData:lCirculars,readcircularsMapData:lReadCirculars,unreadcircularsMapData:lUnReadCirculars,readCount:lReadCirculars.length,unReadCount:lUnReadCirculars.length,allCount:lCirculars.length});
          
        }
      }).catch(error => {
        alert(error);
  
      });
  
    }
    handleReciepients(readReciepients){
      if(readReciepients=='read'){
        this.setState({circularsMapData:this.state.readcircularsMapData,filterReadReceipients:this.state.readcircularsMapData,receipientSuggestions:this.state.readcircularsMapData});
      }else if(readReciepients=='unread'){
        this.setState({circularsMapData:this.state.unreadcircularsMapData,filterReadReceipients:this.state.unreadcircularsMapData,receipientSuggestions:this.state.unreadcircularsMapData});
      }else if(readReciepients=='all'){
        this.setState({circularsMapData:this.state.circularsMapData,filterReadReceipients:this.state.circularsMapData,receipientSuggestions:this.state.circularsMapData});
      }
  
    }
    getNoteData(id){
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_circular:id
      };
      new Service().apiCall('circulars/getNoteData',postData).then(response => {
        if (response.status==200 && response.data!='') {
          var lAssignments = [];
          this.setState({ circularsNotesData:response.data});
        }
      }).catch(error => {
        alert(error);
  
      });
    }
    getCircularIdData(id_section,id) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_section:id_section,
        id:id
      };
      new Service().apiCall('circulars/getDataWithId',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.getNoteData(id);
          var lAssignments = [];
          this.setState({ circularsIdData:response.data});
        }
      }).catch(error => {
        alert(error);
  
      });
  
    }
    getMappdedDataWithId(id){
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id:id
      };
      new Service().apiCall('circulars/getMappedDataWithId',postData).then(response => {
        if (response.status==200 && response.data!='') {
          var lAssignments = [];
          this.setState({ circularsMappedData:response.data});
        }
      }).catch(error => {
        alert(error);
  
      });
    }
  

  getStandardSectionDetails() {
    const postData = {
    count:"student",
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        var lStandardSections = [];
        var lBoardDetails =[];
        response.data.forEach(element => {
              if(lStandardSections[element.standard_id]){
                  var lSection = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandardSections[element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);

                  lStandardSections[element.standard_id] = lStandard;

              }

        });
        let data =  [];  
           lStandardSections.forEach((element,index )=> {
            data.push({id:index,value:element.standard_name});
        });
        console.log(data);
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      alert(error);

    });
  }


  handleMarkCompleted = (value) =>{
    this.setState({ markCompleted : value }) 
  }

  getStudentDetails = (id,id_board,id_academicyear) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      standard_id:id?id:'',
      id_board:id_board ? id_board : this.state.selectedBoard,
      id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('students/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({studentData:newArr,studentSuggestions:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({studentData:newArray,studentSuggestions:newArray});
        }
      }else{
        this.setState({studentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 

  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,allStudents:false,searchStudent:false,activeSuggestion:0,filteredSuggestions:[],selectedStudentId:'',customAssignInput:"",customAssignStudents:[] });
    this.getCircularData(id);
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
      active={this.state.searchStudent ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  getRoleData(selectedDepartment) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getRoleData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let depatmentDetails = response.data;
        var lDepartments = []; 
        depatmentDetails.forEach(element => {
          var lDepartment = {};
          lDepartment.id = element.id;
          lDepartment.name = element.name;
          lDepartment.status = element.status;
          lDepartment.checked = element.checked;
          if (selectedDepartment && selectedDepartment.includes(element.id)) {
            lDepartment.checked = true;
          }
          lDepartments.push(lDepartment);
        })
        if(response.data){
          this.setState({ roleData: lDepartments });
        }
  
      }
    }).catch(error => {
    console.log(error);
  
    });
  
  } 
  

  componentDidMount() {
   this.getStandardSectionDetails();
   this.getSubjectDetails();
   this.getCircularData();
   this.getRoleData();
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
          <Toolbar className="w-100" className="sliderDiv">
            <Grid container  className="sliderDiv">
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/circular")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              {this.props.data.usertype == "admin" ? "Add/View Circular":"View Circulars"}
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Circulars','can_create') &&    <div className="card-header--actions text-right">
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
     <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={1}>
         
        </Grid>
        
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 ">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Circular
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} className="customDiv">
            <OutlinedDiv label="Add Recipients">
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
             {this.state.roleData.length > 0 && this.state.roleData.map((data,i) => { 
               let icon="";
               
                 
              
            return (
              data.checked==true &&
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
            label={(this.state.selectedStandards.length > 0 || this.state.SelectedDepartmentIds!='')?"Add more recipients":"Add recipients"}
            className="m-1"
            />
            </li>
            </Paper>
            </OutlinedDiv>
          </Grid>
       
 
         
        </Grid>

        <Grid container spacing={2}>
      
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
      <Grid item xs={12} lg={6} className="py-1">
            {this.renderTextInput("lname","Title")}
        </Grid>
    </Grid>
   
      
   
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.circular_description}
          placeholder="Enter description here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Card>
        </Grid>
        </Grid>  

        {/* <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
           <Card className="card-box my-2 py-2">
           <Grid container>  
                  <Grid xs={12} sm={12} md={12}>
                  <Grid container>
                  <Grid xs={12} sm={6} md={6} className="text-center">
                    <Grid container>
                    <Grid xs={12} sm={6} md={12} className="text-center">  
                    
            <FormLabel>
                    Read receipt from recipients required?
                  </FormLabel></Grid>
              
             <Grid xs={12} sm={6} md={12} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.readReceipt=== 1}
                          onChange={() => this.handleReadReceiptRequired(1)}
                          value="Online"
                          id = "readreceipt"
                          inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                      label="Yes"
                    />
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.readReceipt === 0}
                          onChange={() => this.handleReadReceiptRequired(0)}
                          value="No"
                          id = "readreceipt"
                          inputRef={el => this.readreceipt = el} 
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                      label="No"
                    />
                  </Grid>
                    </Grid>
                  </Grid>
         
                  <Grid xs={12} sm={6} md={6} className="text-center">
                    <Grid>
                    <Grid xs={12} sm={6} md={12} className="text-center">  
                    
            <FormLabel>
                    SMS alert to recipients required?<span style={{fontSize:'10px', margin:'auto', paddingLeft:'5px'}}>*cost may apply</span>  
                  </FormLabel></Grid>
              
             <Grid xs={12} sm={6} md={12} className="text-center">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.smsAlert === 1}
                          onChange={() => this.handleSmsAlert(1)}
                          value="Online"
                          id = "smsalert"
                          inputRef={el => this.smsalert = el} 
                          name="radio button enabled"
                          aria-label="A"
                         
                        />
                      }
                    
                      label="Yes"
                    />
                
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.smsAlert === 0}
                          onChange={() => this.handleSmsAlert(0)}
                          id = "smsalert"
                          inputRef={el => this.smsalert = el}
                          value="No"
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label="No"
                    />
                 
                  </Grid>
                    </Grid>
                  </Grid>
                  </Grid>
                  </Grid>
                  </Grid>  
                  </Card>
                  </Grid>
                  </Grid> */}
        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Circulars','can_create') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handleCircular()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
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

        {(this.state.actionType == "view" || this.state.actionType == "assessment") && <Grid container spacing={4}  justify={this.props.data.usertype!= "student" ? "none" : "center"}>
        {this.props.data.usertype!= "student" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                 
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.allStudents ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getCircularData();this.setState({searchStudent:false,allStudents:true,selectedStandardId:''})}}>
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
        <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Circulars
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.circularsData.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          name: original.name,
          id_section: original.id_section,
          details:original.details,
          path:original.path,
          id_staff_dept:original.id_staff_dept,
          start_date:original.start_date,
          end_date:original.end_date
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
  Header: "Title",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Title"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
Header: "Valid Upto",
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
  Header: "View",
  accessor: "sent_date",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Assessed"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  Cell: row => (
    <div> <span style={{marginLeft:'10px'}}> <Tooltip
    id="tooltip-top"
    title={this.state.actionType=="view"? "View" : "Assess"}
    placement="top"
    >
                      <Button style={{padding:0}}
                      simple
                      onClick={() => {this.getRoleData(row.original.id_staff_dept);this.setState({editCircularPanel:true,lname:row.original.name, startdate:new Date(row.original.start_date),enddate:new Date(row.original.end_date),staff_depts:row.original.id_staff_dept,SelectedDepartmentIds: row.original.id_staff_dept,student_standards:row.original.id_section,SelectedSectionsIds:row.original.id_section, id_circular:row.original.id, path:row.original.path, description:EditorState.createWithContent(ContentState.createFromText(row.original.details))
                        ,imagePreviewUrlStudent:Config.path+'writable/uploads/circular/'+row.original.path})}}
                      color="secondary"
                      className="edit"
                    >
                    {this.state.actionType=="view"? <ViewIcon /> : <Edit  />}
                    </Button>
    </Tooltip></span></div>
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
{AuthHelper('circulars','can_export') &&  <Grid container spacing={4}>
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
            Select Recipients
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4">
          <CardContent>
          <Grid container spacing={2}>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          checked={this.state.allDepartments}
                          onClick={() => {this.handleAllDepartment(this.state.allDepartments);}}
                         
                         
                        />
                      }
                     
                      label="All Staff"
                    />
         </Grid>
         <Grid item xs={12} lg={12} className="py-1 pl-4">
         {this.state.roleData.length>0 && this.state.roleData.map((element, index) => {
                       if(this.state.allDepartments)
                          return this.renderDepartmentsCheckBox(element,index,true);
                         else 
                           return this.renderDepartmentsCheckBox(element,index,false);  
                  })}
        </Grid>
        <Divider />
        <Grid item xs={12} lg={12} className="py-1">
        <StandardSectionsList
          board_id={this.props.data.selectedBoardId}
          label={"All Students"}
          type="checkbox"
          mappedstandards={this.state.selectedStandards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
          </Grid>
        </Grid>
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
    <strong>Start Date:</strong> {this.state.circularsIdData.start_date}
</Grid>
<Grid item xs={12} sm={10} md={8}>
<strong>End Date:</strong> {this.state.circularsIdData.end_date}
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Title: </strong> {this.state.circularsIdData.name}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Description: </strong> {this.state.circularsIdData.details}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> {this.state.circularsIdData.path}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Note to: </strong> {this.state.standard}
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
{this.state.circularsNotesData.map((element, idx) => (
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Note: </strong> {element.note}
</Grid>
<Grid item xs={12} sm={12} md={12}>
<strong>Added on: </strong> {element.note_created}
</Grid>
</Grid>
 ))}
</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.editCircularPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({editCircularPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({editCircularPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {this.props.data.usertype == "student"? "View Circular":"Edit Circular"} 
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container spacing={4} justify="center">
<Grid item xs={12} md={10} lg={10}>
<Card className="card-box  mb-4 ">
<CardContent>


<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1">
  {this.renderTextInput("lname","Title")}
</Grid>
<Grid item xs={12} md={12} lg={6} className="pickerGrid">
<FormControl fullWidth>
<MuiPickersUtilsProvider utils={DateFnsUtils}>
<KeyboardDatePicker 
 disabled={this.props.data.usertype == "student"? true:false}
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
<Grid item xs={12} md={12} lg={6} className="pickerGrid">
<FormControl fullWidth>
<MuiPickersUtilsProvider utils={DateFnsUtils}>
  <KeyboardDatePicker 
   disabled={this.props.data.usertype == "student"? true:false}
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
//  disabled={this.props.data.usertype == "student"? true:false}
//  disable={this.props.data.usertype == "student"? true:false}
 readOnly={this.props.data.usertype == "student"? true:false}
editorState={this.state.description}
placeholder="Enter description"
toolbarClassName="toolbarClassName"
wrapperClassName="wrapperClassName"
editorClassName="editorClassName"
onEditorStateChange={this.onEditorStateUpdate}
/>
</Card>
</Grid>
</Grid>

<Card className="card-box  mb-4 p-3">
<Grid container spacing={2} justify="center">
<Grid item xs={12} sm={12} md={8} lg={8}>
<strong>Attachments: </strong> 
<a target="_blank" href={Config.path+"writable/uploads/circular/"+this.state.path}>{this.state.path}</a>

{/* <div className="font-weight-400 text-center font-size-lg">Upload Attachment</div> */}
        <Divider className="my-2" />
        <FormControl fullWidth height={100}>
               <div className="fileinput text-center">
                  <input type="file" onChange={this.handleImageChangeStudent} ref={fileInput} />
                 <div className={"img-circle"}>
                   <img className="w-100" src={this.state.imagePreviewUrlStudent} alt={this.state.imagePreviewUrlStudent} />
                 </div>
               <div>
               {this.props.data.usertype != "student"? 
               this.state.selectedFile === null ? (
                 <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 {"Select file"}
                 </Button>
                 ) : (
                 <span>
                 <Button  color="primary" className="m-2" variant="contained" onClick={() => this.handleClickStudent()}>
                 Change
                 </Button>
                 { null}
                 <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemoveStudent()}>
                 <i className="fas fa-times" /> Remove
                 </Button>
                 </span>
               ) : ''}
               </div>
               </div>
              </FormControl> 
           

</Grid>
</Grid>
</Card>

<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1">
<h4 className="font-size-lg mb-0 py-3 pl-3 font-weight-bold">
        Applicable To:
      </h4>
</Grid>
</Grid>

<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1 pl-4">
<FormControlLabel
            control={
              <Checkbox
              disabled={this.props.data.usertype == "student"? true:false}
                tabIndex={-1}
                checked={this.state.allDepartments}
                onClick={() => {this.handleAllDepartment(this.state.allDepartments);}}
               
               
              />
            }
           
            label="All Staff"
          />
</Grid>

<Grid item xs={12} lg={12} className="py-1 pl-4">
 
{this.state.roleData.length>0 && this.state.roleData.map((element, index) => {
//  { console.log(this.state.roleData)  }
             if(this.state.allDepartments)
                return this.renderDepartmentsCheckBox(element,index,true);
               else 
                 return this.renderDepartmentsCheckBox(element,index,false);  
        })}
</Grid>
<Divider />
<Grid item xs={12} lg={12} className="py-1">
  {console.log('this.state.selectedStandards'+JSON.stringify(this.state.selectedStandards))}
  {console.log('this.state.student_standards'+JSON.stringify(this.state.student_standards))}
<StandardSectionsList
board_id={this.props.data.selectedBoardId}
label={"All Students"}
type="checkbox"
disable={this.props.data.usertype == "student"? true:false}
// disabled={this.props.data.usertype == "student"? true:false}

mappedstandards={this.state.selectedStandards}
selectedSections={this.state.student_standards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleStandardSelected}
{...this.props} 
/>
</Grid>
</Grid>
</CardContent>
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Circulars','can_create') &&<Grid container spacing={2}>
<Grid item xs={12} md={4} lg={6}></Grid>
<Grid item xs={12} md={4} lg={6} className="text-right">
<Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handleEvent()}>
Submit
</Button>
</Grid>
</Grid>}
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

export default connect(mapStateToProps, mapDispatchToPros)(AddViewCircular);
