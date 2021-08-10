import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
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
import { AuthHelper } from '../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import logo from "../../../assets/images/egenius_logo.png";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../assets/custom.scss";
import Service from '../../../utils/Service';
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

class ClassMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      selectedDate:new Date(),
      enddate: new Date(),
      selectedSection:'',
      selectedStandard:'',
      allSections:false,
      studentInfo:'',
      tags: [],
      mapclassDetails:[],
      AssignedSubjectSections: [],
      filterSections: [],
      stdSectionArr: [],
      lstandardSections: [],
      sType: '',
      subjectTypeChecked: false,
      subjectSections:[],
      streamDetails:[],
      subjectData: [],
      standardSections: [],
      standardSuggestions:[],
      classmasterDetails:[],
      academicsetting: [],
      documentInfo:'',
      classholders: [{ standards: '', sections: '', streams: '', academics: '' }],
      subjectholders: [{ name: 'Compulsary Part A', type: 'mandatory', substate: '1', tags: [] }, { name: 'Compulsary Part B', type: 'mandatory', substate: '2', tags: [] }, { name: 'Optional Group 1', type: 'optional', tags: [], substate: '1' }],
      sectionsData: [{
        id: '',
        name: '',
      }],
      emptySectionsData: [{
        id: '',
        name: '',
      }],
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

  handleAdd(tagindex, tag) {

    if (this.state.sectionsData.some(subject => subject.name === tag)) {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
            <div className="text-center p-5">
              <h4 className="font-weight-bold">Subject Already Exists</h4>
            </div>
          </Dialog>
        ),
      });
      setTimeout(() => {
        this.setState({ basicNotify: false });
      }, 2000)
    } else {
   
      let allow = true;
  
      this.state.subjectholders.map((element, index) => {
        if (this.state.subjectholders[index].tags.some(stag => stag.text == tag)) {
          allow = false;
        }
      });

      if (this.state.suggestions.some(subject => subject.text === tag)) {
        if (allow) {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Subject Already Exists</h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
          }, 2000)
        }
        else {
          this.setState({ 
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Subject Already Exists</h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
          }, 2000)
        }
      } else {
        let subjectholder = this.state.subjectholders;
        let capitalize = tag.charAt(0).toUpperCase() + tag.slice(1);
        const regex = /[A-Za-z]/;
        const chars = capitalize.split('');
        const char = chars.pop();
        if (!regex.test(char)) {
          // capitalize = chars.join('');
          // console.log(`${char} is not a valid character.`);
        }else{          
          subjectholder[tagindex].tags.push(capitalize.replace(/[^A-Za-z]/ig, ''));
        }
        //alert('capi'+capitalize);this.setState({ [name]: value.replace(/[^A-Za-z]/ig, '') });
        //subjectholder[tagindex].tags.push(capitalize.replace(/[^a-zA-Z0-9\.,]/g, ''));
        
        //const newSuggestionList = this.state.suggestions.filter((suggestion, index) => suggestion.text !== tag.text);
        this.setState({ subjectholder });

      }


    }
  }

  updateSubject = () => {

    let sectionArray = [];
    let arr=[];
    this.state.subjectSections.forEach(element => {
      arr.push(element);
    })
    arr.forEach(element => {
      if (element.standards) {
        element.standards.map(el=>{
          if(el.checked == true){
            sectionArray.push(el.section_id);
          }
        })
       
      }
    })

    const postData = {
      id: this.state.selectedMasterId,
      name: this.state.selectdMasterSubject,
      sections: sectionArray,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId, 
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id:this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    };


    new Service().apiCall('subjectMasters/update_subjectmaster', postData).then((response) => {
      if (response.status == 200) {
           this.setState({
            basicNotify: (
              <Dialog open={true}>
      <div className="text-center p-5">
        <h4 className="font-weight-bold">Subject Updated</h4>
      </div>
    </Dialog>
            ),
          });
        setTimeout(() => {
          window.location.reload()
        }, 2000)
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

  setMasterSubject = (value) => {
    this.setState({ selectdMasterSubject: value });
  }

  getSectionsSubjectwise = (id, name, type, selectedSetions) => {

    this.setState({ sType: type, selectedSetions: selectedSetions, updateSubjectPanel: true, selectdMasterSubject: name});
  }

  handleSubjectType = (name) => {
 
      this.setState({ sType: name });
   
  }

  handleAllStudent = (status) => {
    
    let lstdsections = this.state.subjectSections;

    lstdsections.map((element, index) => {
      lstdsections[index].checked = !status;
      element.standards.map((sections, sindex) => {
        lstdsections[index].standards[sindex].checked = !status;
      });
    });
    this.setState({ subjectSections: lstdsections, allSections: !status });
  }

  handleDelete(ri,tagindex) {
    let subjectholder = this.state.subjectholders;
    const newList = subjectholder[tagindex].tags.filter((tag, index) => index !== tagindex);
 
    this.setState({
      subjectholders: this.state.subjectholders.map((person, index) => {
        if (tagindex !== index) {
          return person; // not person we are targeting, don't change it
        } else {
          return {
            ...person,
            tags: person.tags.filter((v, i) => i !== ri),
          }
        }
      })
    });

  }

  renderRemoveButton = (type,index)=>{
    if(type == 'optional' && index > 2){
      return (
        <div  id={"remove"+index}><Remove onClick={()=>this.removeHolder(index)} style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} /></div>
      )
    }
  }

  removeHolder(i) {
    const { subjectholders } = this.state;
    this.setState({
      subjectholders: subjectholders.filter((author, index) => index !== i),
    });
  }

  handleMasterDelete = (id, status) => {
    let subjectStatus = "Subject Activated!";
    if (status == "Active") {
      subjectStatus = "Subject Deactivated!";
    }
    const postData = {
      id: id,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID
    };

    new Service().apiCall('subjectMasters/deleteSubjectmaster', postData).then((response) => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">{subjectStatus}</h4>
    </div>
  </Dialog>
          ),
        });
        this.getMasterDetails();
        setTimeout(() => {
          this.setState({ basicNotify: false});
        
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    });
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

    updateSubjectSection(subject_id, selectedSectionsIds) {
      //console.log(selectedSectionsIds);return false;
    const postData = {
      subject_id: subject_id,
      subject_type: this.state.sType,
      subject_name: this.state.selectdMasterSubject,
      selectedSections: selectedSectionsIds,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id:this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('SubjectStandards/insertSubject', postData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
    //  console.log(response)
      if (response.status == 200 && response.data != '') {

        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Subject Mapped to Class</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
          window.location.reload()
         // window.location.reload()
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
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

  renderSelectedSections = (updateState) => {
    let lstdsections = this.state.subjectSections;

    let selectedSections = "";
    let selectedSectionsIds = "";
    let selected = [];
    let selectedids = [];
    lstdsections.map(element => {
      element.standards.map((sections, sindex) => {
        if (sections.checked == true) {
          selected.push(sections.standard_name + " " + sections.section_name);
          selectedids.push(sections.section_id);
        }
      });
    });
    if (selected.length > 0) {
      selectedSectionsIds = selectedids.join(',');
    }

    this.setState({ SelectedSectionsIds: selectedSectionsIds });
    if (updateState == 1 || updateState == 2) {
      this.updateSubjectSection(this.state.selectedMasterId, selectedSectionsIds);
    } else {
      this.updateStaffSection(this.state.selectedTeacher, selectedSectionsIds);
    }

  }

  handleSubject = () => {
    const lUserData = this.props.data;
    let subjectArray = [];
    let lSubjectHolders = this.state.subjectholders;
    let sarray = [];
    lSubjectHolders.forEach((element, index) => {
      // if(lSubjectHolders[index].tags){
      //   lSubjectHolders[index].tags.forEach((telement, index) => {
      //     sarray.push(telement)
      //   })
      // }
      subjectArray.push({ subject_id: lSubjectHolders[index].tags, type: element.type, substate: element.substate });
    })
    const postData = {
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      subjectmapping: subjectArray,
      id_organization: lUserData.selectedOrganizationId,
      id_institute: lUserData.selectedInstitutionId,
      role_id:this.props.data.role_id,
      token: "abc",
      id_user: lUserData.UID
    };
    new Service().apiCall('SubjectMasters/insertSubjectmaster', postData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Subject Inserted</h4>
    </div>
  </Dialog>
          ),
        });
        setTimeout(() => {
         window.location.reload()
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
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

  getStandardSectionData(selectedSetions) {

  
    const postData = {
      count: 'student',
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId, 
    };
    new Service().apiCall('ClassDetails/getData', postData).then(response => {
      let standard_count = [];
      if (response.status == 200 && response.data != '') {
        let sectionDetails = response.data;
        var lStandardSections = [];
        sectionDetails.forEach(element => {
          if (lStandardSections[element.standard_id]) {
            var lSection = {};
            var lStandard = {};
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.active_student_count = element.active_student_count;
            lSection.checked = false;
            if (selectedSetions && selectedSetions.includes(element.section_id)) {
              lSection.checked = true;
            }
            lSection.count = 1;
            lStandardSections[element.standard_id].standards.push(lSection);
          } else {
            var lStandard = {};
            var lSection = {};
            lStandard.standard_name = element.standard_name;
            lStandard.standard_id = element.standard_id;
            lStandard.standard_total_count = element.standard_active_student_count;
            lStandard.checked = false;
            lStandard.count = 1;
            lSection.checked = false;
            if (selectedSetions && selectedSetions.includes(element.section_id)) {
              lSection.checked = true;
            }
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

        let sectionsList =[];
        lStandardSections.map(ele=>{
          sectionsList.push(ele)
        })
       console.log(sectionsList);
        this.setState({ subjectSections: sectionsList, sectionCount: response.data.length, standardSectionsSubject: sectionsList, allSectionData: response.data });
      }
    }).catch(error => {
      alert(error);
    });
  }

  handleStandard = (standard_id, index, status) => {
    let lstdsections = this.state.subjectSections;

    let selectedids = [];
    let selectedSectionsIds = 0;
    lstdsections.map((element, index) => {
      if (element.standard_id == standard_id) {
        lstdsections[index].checked = !status;
        element.standards.map((sections, sindex) => {
          lstdsections[index].standards[sindex].checked = !status;
          lstdsections[index].count += 1;
          if (status == false) {
            if (element.count % 2 == 0) {
              selectedids[sections.section_id] = element.standard_total_count;
            } else {
              selectedids[sections.section_id] = 0;
            }
          }
        });
      }
    });
    if (selectedids) {
      for (var i = 0, n = selectedids.length; i < n; i++) {
        if (selectedids[i] > 0) {
          selectedSectionsIds += selectedids[i];
        }
      }
    }
    this.setState({ subjectSections: lstdsections, totalRecipents: selectedSectionsIds });
  }
  handleSection = (section_id, index, sindex, status) => {
    let lstdsections = this.state.subjectSections;
    let selectedids = [];
    let selectedSectionsIds = 0;
    lstdsections[index].standards[sindex].checked = !status;
    let total_sections = lstdsections[index].standards.length;
    let checked_count = 0;
    lstdsections[index].standards[sindex].count += 1;
    lstdsections[index].standards.map((sections) => {
      if (sections.checked == true) {
        checked_count++;
      }
      if (status == false) {
        if (section_id == sections.section_id && sections.count % 2 == 0 && lstdsections[index].count % 2 != 0) {
          selectedids[sections.section_id] = this.state.totalRecipents + sections.active_student_count;
        } else {
          selectedids[sections.section_id] = 0;
        }
      }
    });
    if (checked_count == total_sections) {
      lstdsections[index].checked = true;
      this.state.totalRecipents = 0;
    }
    else {
      lstdsections[index].checked = false;
    }
    if (selectedids) {
      for (var i = 0, n = selectedids.length; i < n; i++) {
        if (selectedids[i] > 0) {
          selectedSectionsIds += selectedids[i];
        }
      }
    }
    this.setState({ subjectSections: lstdsections, totalRecipents: selectedSectionsIds });
  }

  getAllDetails(id, standard_name) {
    let sectionData = this.state.lstandardSections;
    sectionData.map((element, index) => {
      sectionData[index].checked = false;
    })
    let standardSections = this.state.lstandardSections;
    let sectionsArr = [];
    standardSections.map((element, index) => {
      if (element.standard_name == standard_name) {
        sectionsArr.push({ section_id: element.section_id, section_name: element.section_name, standard_name: element.standard_name, checked: false });
      }
    })
    this.setState({ stdSectionArr: sectionsArr });
    let sectionArray = [];
    sectionArray.push(id);
    const postData = {
      standard_id: sectionArray,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID
    }

    new Service().apiCall('subjectStandards/get_data', postData).then((response) => {

      if (response.status == 200 && response.data != "") {
        let activeDta = [];
        let InactiveData = [];
        let excelData = [];
        response.data.forEach(element => {
          let status = '';
          let assigned = element.assigned;
          if (element.assigned === undefined) {
            assigned = 'Not Assigned';
          }


          if (element.status == 1) {
            status = 'Active';
            activeDta.push({ id: element.id, name: element.name, status: status, assigned: assigned, type: element.subject_type });
          }
          else {
            status = 'InActive';
            InactiveData.push({ id: element.id, name: element.name, status: status, assigned: assigned, type: element.subject_type });
          }
          excelData.push({ id: element.id, name: element.name, assigned: assigned, status: status, type: element.subject_type });

        })
        this.setState({ sectionsData: excelData });
      }
      else {
        this.setState({ sectionsData: this.state.emptySectionsData });
      }

    });

  }

  
  renderMasterSelectedSections = (element, index, checked) => {
    const { classes } = this.props;
    let parentStandardCount = 0;
    let childStandardCount = element.standards.length;//3
    let childStandardCheckedCount = 0;
    let parentStandardCheckedCount = 0;
    element.standards.forEach((item) => {if(item.checked) childStandardCheckedCount++; })
    if(childStandardCount == childStandardCheckedCount) element.checked = true;
    this.state.subjectSections.forEach((item) => { parentStandardCount++; if(item.checked) parentStandardCheckedCount++; })
    if(parentStandardCount == (parentStandardCheckedCount+1)) {
      this.state.allSections = true;
    }else{
      this.state.allSections = false;
    }
    return <div><Grid container><Grid item xs={12} sm={6} md={9} lg={2}>

      <FormControlLabel
        control={
          <Checkbox
            tabIndex={-1}
            onClick={() => { this.handleStandard(element.standard_id, index, element.checked) }}
            checked={element.checked}
           
          />
        }
       
        label={element.standard_name}
      />
    </Grid>
    
          {element.standards.map((sections, sindex) => (
        
              <Grid item xs={12} sm={6} md={9} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      tabIndex={-1}
                      onClick={() => { this.handleSection(sections.section_id, index, sindex, sections.checked) }}
                      checked={sections.checked}
                     
                    />
                  }
                
                  label={sections.section_name}
                />
              </Grid>
        
          ))}
        
    </Grid>
    </div>
  }

  handleAddSubjectholder = () => {
    let lSubjectHolders = this.state.subjectholders;
    let lSubject = {};
    lSubject.type = 'optional';
    lSubject.name = 'Optional Group ' + (lSubjectHolders.length - 1);
    lSubject.tags = [];
    lSubject.substate = (lSubjectHolders.length - 1);
    lSubjectHolders.push(lSubject);
    this.setState({ subjectholders: lSubjectHolders });
  }

  getStandardSectionDetails() {
    const postData = {
      count: "subject",
      type:"cstr",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId, 
    };
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
      alert(error);

    });

  }

  getMasterDetails() {

    const postData = {
      id_board:this.props.data.selectedBoardId, 
      id_academicyear:this.props.data.selectedAcademicId, 
      standardmapping: "standardmapping",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id: this.props.data.role_id,
      token: "",
      id_user: this.props.data.UID
    }
    new Service().apiCall('subjectMasters/getData', postData).then((response) => {
      let sMaster = [];
      let activeDta = [];
      let InactiveData = [];
      let excelData = [];
      if (response.status == 200 && response.data != "") {
        response.data.forEach(element => {
          let status = '';
          let assigned = element.assigned;
          if (element.assigned === undefined) {
            assigned = 'Not Assigned';
          }
          if (element.sections === undefined) {
            element.sections = [];
          }
          else {
            const lsectionList = element.sections.map((data) => {
              return { ...data, checked: false };
            });
            element.sections = lsectionList;
          }

          if (element.status == 1) {
            status = 'Active';
          
          }
          else {
            status = 'InActive';
           
          }
        
          excelData.push({ id: element.id, name: element.name, assigned: assigned, status: status, sections: element.sections, type: element.type, selectedsections: element.selectedsections, subject_type: element.subject_type });
          sMaster.push({ id: element.id, text: element.name });
        })
   
        this.setState({ subjectData: excelData, column_count: response.data.length, suggestions: sMaster });
      } else {

        this.setState({ subjectData: [], column_count: 0, suggestions: []});
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




  componentDidMount() {
   this.getStandardSectionDetails();
   this.getMasterDetails()
   this.getStandardSectionData();
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
              Subject Master
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

     

      {AuthHelper('CSTR','can_create') && <Grid container  justify="center">
        <Grid item xs={12} md={10} lg={10}>
        <Card className="card-box  mb-4 p-3">
        <Grid container>
        <Grid item xs={12} md={12} lg={12}>
       
        {this.state.subjectholders.map((subjectholder, idx) => (
          <div>
            <Grid container>
              <Grid item xs={12} sm={12} md={3} className="margin-auto text-center">
                <FormControl fullWidth>
                  <Box>
                    {subjectholder.name}
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} lg={8} className="outlinedInput customChip">
                <FormControl fullWidth>
                    <ChipInput
                    inputProps={{
                      autoComplete: 'off',
                      style: {textTransform: 'capitalize'}
                      }}  
                    variant="outlined"
                    id={"subject"+idx}
                    className="inputTag m-2"
                    label={"Add subject name here and press 'Enter' to add multiple"}
                    value={this.state.subjectholders[idx].tags}
                    onAdd={(chip) => this.handleAdd(idx,chip)}
                    onDelete={(chip, index) => this.handleDelete(index,idx)}
                    />
                </FormControl> 
              </Grid>
              <Grid item xs={12} sm={10} md={1} className="margin-auto">{this.renderRemoveButton(this.state.subjectholders[idx].type,idx)}</Grid >
            </Grid>
            {this.state.subjectholders[idx].tags.length > 0 && <Grid container>
              <Grid item xs={12} sm={12} md={3}>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <span style={{ color: '#AAAAAA', fontWeight: 400, fontSize: '13px' }}>
                  Inserted <span style={{ color: 'red' }}>{this.state.subjectholders[idx].tags.length}</span> {this.state.subjectholders[idx].tags.length == 1 ? "subject." : "subjects."} </span>
              </Grid>
            </Grid>}
          </div>
        ))}
   
        </Grid>
        </Grid>

      <Grid container className="mt-2">
      <Grid item xs={12} sm={12} md={1}></Grid>     
      <Grid item xs={12} sm={12} md={5} className="text-left">
             <Button color="secondary" variant="outlined" onClick={()=>this.handleAddSubjectholder()}>Add More Optional Group</Button>
        </Grid>            
        <Grid item xs={12} sm={12} md={5} className="text-right">
          {this.state.subjectholders[0].tags.length >0  && <Button className="successBtnOutline" variant="outlined" onClick={()=>this.handleSubject()}>Submit</Button>}
        </Grid>
        <Grid item xs={12} sm={12} md={1} className="mr-2"></Grid>  
        </Grid>
     </Card></Grid></Grid>}

       <Grid container  justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Subjects List
                </h4>
              </div>
        </div>
    <ReactTable

data={
  this.state.subjectData.map((original,key) => {
    return ({
      slno: key + 1,
      id: original.id,
      name: original.name,
      type: original.type,
      assigned: original.assigned,
      selectedsections: original.selectedsections,
      subject_type: original.subject_type,
      actions: (
        <div>
        {AuthHelper('CSTR','can_edit') &&   <Tooltip
          id="tooltip-top"
          title="Edit"
          placement="top"
          >
          <Button
          disabled={original.status == "Active" ? false : true}
          simple
          color="secondary"
          className="edit"
          onClick={() => { this.getStandardSectionData(original.selectedsections); this.getSectionsSubjectwise(original.id, original.name, original.type); this.setState({selectedMasterId:original.id}) }}
          >
          <Edit  />
          </Button>
          </Tooltip>}

          {AuthHelper('CSTR','can_delete') &&   <Tooltip
            id="tooltip-top"
            title={original.status == "Active" ? "Deactivate" : "Activate"}
            placement="top"
            >
            <FormControlLabel
            control={
            <Switch
            checked={original.status == "Active" ? true : false}
            onChange={() => this.handleMasterDelete(original.id, original.status)}
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
id="sno"   
value={filter ? filter.value : ''}
placeholder="S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
  Header: "Subject Name",
  accessor: "name",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="subject"   
value={filter ? filter.value : ''}
placeholder="Search Subject"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
// {
//   Header: "Type",
//   accessor: "type",
// className: "center",
// Filter: ({filter, onChange}) => (
// <TextField 
// inputProps={{
// autoComplete: 'off'
// }}         
// id="document-type"   
// value={filter ? filter.value : ''}
// placeholder="Search Type"
// type="text" 
// onChange={event => onChange(event.target.value)}
// />
// )
// },
{
Header: "Assigned Classes",
accessor: "assigned",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="assigned-classes"   
value={filter ? filter.value : ''}
placeholder="Search Classes"
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
<CardActions  style={{marginTop:0}}>
    <Grid container>
      <Grid item xs={12} md={12} lg={12} className="text-right">
        {/* <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button> */}
        </Grid>
        </Grid>
  </CardActions>

        </Card></Grid> 
        </Grid>

        <Drawer

          anchor="right"
          open={this.state.custodyPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({custodyPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({custodyPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Return or Dispose Documents
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4 p-3">
        <Grid container spacing={2} justify="center">
           
    
              <Grid item xs={12} sm={12} md={6} className="text-center margin-auto"> 
              
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "returned"}
                          onChange={() => this.setState({changeTo:'returned'})}
                          value="fulltime"
                          name="radio button enabled"
                          aria-label="B"
                        
                        />
                      }
                    
                      label="Return"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "disposed"}
                        onChange={() => this.setState({changeTo:'disposed'})}
                          value="shift"
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label="Dispose"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="margin-auto">
                    <Button className="successBtnOutline" onClick={()=>this.updateStatus()}>
                        Submit
                    </Button>
                  </Grid>
              </Grid>
          </Card>
          </div>
        </PerfectScrollbar>
        </Box>
        </Drawer>

        <Drawer

anchor="right"
open={this.state.academicSettingsPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({academicSettingsPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({academicSettingsPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Academic Calendar Settings
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
{this.state.academicsetting.map(element => element.type == 'annual' ? (
              <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={10} md={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={this.state.academicChecked}
                              onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({academicChecked:!this.state.academicChecked}) }}
                            />
                          }
                          label={element.name}
                        />
                    </Grid>
                  </Grid>
              </Card>
            ) : '')}
<Card className="card-box  mb-4 pt-2 pb-1 px-3">
{this.state.academicsetting.map(element => element.type == 'semester' ? (

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={10} md={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={this.state.academicChecked}
                              onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({academicChecked:!this.state.academicChecked}) }}
                            />
                          }
                          label={element.name}
                        />
                    </Grid>
                  </Grid>
             
            ) : '')}
 </Card>

 <Card className="card-box  mb-4 pt-2 pb-1 px-3">
{this.state.academicsetting.map(element => element.type == 'trimester' ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={10} md={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={this.state.academicChecked}
                              onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({academicChecked:!this.state.academicChecked}) }}
                            />
                          }
                          label={element.name}
                        />
                    </Grid>
                  </Grid>
             
            ) : '')}
 </Card>

 <Grid container spacing={2}>
    <Grid item xs={12} sm={10} md={12} className="text-right">
      <Button color="secondary" variant="contained" onClick={()=>this.setState({academicSettingsPanel:false})}>Submit</Button>
    </Grid>
</Grid>  
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer

anchor="right"
open={this.state.updateSubjectPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({updateSubjectPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({updateSubjectPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Update Subject
  </Typography>
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">
  <Grid item xs={12} sm={10} md={8}>
  <Card className="card-box  mb-4 pt-2 pb-1 px-3">
  <div className="card-header pl-0">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                Update Subject
                </h4>
              </div>
        </div>

        <Grid container>
                        <Grid item xs={12} sm={12} md={1}></Grid>
                        <Grid item xs={12} sm={12} md={4}>
                         
                          <FormControl fullWidth>
                          <TextField
                          className="m-2"
                          id="subject-name"   
                          label="Subject Name"
                          value={this.state.selectdMasterSubject}
                          onChange={(event) =>  this.setMasterSubject(event.target.value)}
                          variant="outlined" />
                         
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <Grid container>
                            <Grid item xs={12} sm={6} md={2} lg={4}>
                             
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.sType == 'Theory' ? true : false}
                                    onClick={() => { this.handleSubjectType('Theory') }}
                                   
                                  />
                                }
                               
                                label="Theory"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2} lg={4}>
                             
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.sType == 'Practical' ? true : false}
                                    onClick={() => { this.handleSubjectType('Practical') }}
                                  
                                  />
                                }
                              
                                label="Practical"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2} lg={4}>
                             
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.sType == 'Both' ? true : false}
                                    onClick={() => { this.handleSubjectType('Both') }}
                                   
                                  />
                                }
                              
                                label="Both"
                              />
                            </Grid>

                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container>

                        <Grid item xs={12} sm={12} md={1}></Grid>
                        <Grid item xs={12} sm={12} md={10}>
                          <Grid container>
                            <Grid item xs={12} sm={6} md={12} lg={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.allSections}
                                    onClick={() => { this.handleAllStudent(this.state.allSections); }}
                                   
                                  />
                                }
                              
                                label="All"
                              />
                            </Grid>
                          </Grid>
                          {this.state.subjectSections.length > 0 && this.state.subjectSections.map((element, index) => {
                            if (this.state.allSections)
                              return this.renderMasterSelectedSections(element, index, true);
                            else
                              return this.renderMasterSelectedSections(element, index, false);
                          })}
                        </Grid>

                      </Grid>
                      <Grid container>

                        <Grid item xs={12} sm={12} md={1}></Grid>
                        <Grid item xs={12} sm={12} md={10}>
                          <span style={{ color: 'red' }}><strong>IMPORTANT: Please be extra cautious while making any changes. Even a single change may impact many modules.</strong></span>
                        </Grid>
                      </Grid>
                      {AuthHelper('CSTR','can_edit') && <Grid container>
                        <Grid item xs={12} sm={12} md={1}></Grid>
                        <Grid item xs={12} sm={12} md={10} className="text-right">
                          <Button className="warningBtnOutline" onClick={() => this.setState({ updateSubjectPanel: false})}>Close</Button>
                          <Button className="successBtnOutline" onClick={() => this.renderSelectedSections(1)} style={{ margin: '10px' }}>Update</Button>
                        </Grid>

                      </Grid>}
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

export default connect(mapStateToProps, mapDispatchToPros)(withRouter(ClassMaster));
