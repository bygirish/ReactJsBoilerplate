import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, MenuItem, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../layout-components/CustomComponents/AutoComplete.js";
import AutocompleteMaterial from '@material-ui/lab/Autocomplete';
import 'react-table-6/react-table.css';
import { withRouter } from 'react-router-dom';
import { Animated } from "react-animated-css";
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
import "@assetss/custom.scss";
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

class ClassMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      dialogOpen: true,
      selectedDate: new Date(),
      enddate: new Date(),
      selectedSection: '',
      selectedStandard: '',
      studentInfo: '',
      tags: [],
      standardDetails:[],
      selectedStandard_id:'',
      mapclassDetails: [],
      filterSections: [],
      lstandardSections: [],
      streamDetails: [],
      standardSections: [],
      standardSuggestions: [],
      classmasterDetails: [],
      academicsetting: [],
      documentInfo: '',
      edit_standard:'',
      edit_section:'',
      edit_stream_id:'',
      classholders: [{ standards: '', sections: '', streams: '', academics: '' }],
      stream: [{ stream: '' }],
      documentHolders: [{ type: '', no_of_sheets: '', unique_no: '' }],
      suggestions: [],
      studentSuggestions: [],
      studentDocuments: [],
      basicNotify: false,
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      AllStream: [],
      selectedStaff: [],
      staffArr: []
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
    this.setState({ joiningStandard: value });
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



  getAcademicSettingData() {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/getData', postData).then(response => {
      //console.log(response)
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


  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  handleClassMasterData = (pIndex, inputName, pValue) => {
    let lclassholders = this.state.classholders;
    lclassholders[pIndex][inputName] = pValue;

    this.setState({ classholders: lclassholders });
    console.log(this.state.classholders)

  }
  searchStaff = (event, values) => {
    let data = this.state.staffArr;

    let dataV = [];
    if (values) {
      const listItems = values.map((myList, key) =>
        dataV.push(myList.id)
      );
    }
    data = dataV;
    this.setState({ staffArr: data });
    console.log(this.state.staffArr)

    this.setState({ selectedStaff: values })
    // this.setState({selectedStaff:values, staffArr:data})


    // console.log( dataV )   
    // console.log(values) 
  }
  handleClassMasterDataStream = (pIndex, inputName, pValue) => {
    let lclassholders = this.state.stream;
    lclassholders[pIndex][inputName] = pValue;
    this.setState({ stream: lclassholders });
  }

  removeHolder(i) {
    const { classholders } = this.state;
    this.setState({
      classholders: classholders.filter((holder, index) => index !== i),
    });
  }
  removeHolderStream(i) {
    const { stream } = this.state;
    this.setState({
      stream: stream.filter((holder, index) => index !== i),
    });
  }

  handleAddHolder = () => {
    let data = this.state.classholders;
    let addStream = this.state.staffArr;
    let lData = {};
    lData.standards = '';
    lData.sections = '';
    lData.streams = '';
    lData.academics = '';
    data.push(lData);
    this.setState({ data });
  }
  handleAddHolderStream = () => {
    let data = this.state.stream;
    let lData = {};
    lData.stream = '';

    data.push(lData);
    this.setState({ data });
  }

  handleDocumentChange = (pIndex, inputName, pValue) => {
    let data = this.state.classholders;
    data[pIndex][inputName] = pValue;
    this.setState({ data });
  }

  // getStudentDetails = (id, id_board, id_academicyear) => {
  //   const postData = {
  //     id_organization: this.state.selectedOrganizationId,
  //     id_institute: this.state.selectedInstitutionId,
  //     token: "abc",
  //     id_user: this.props.data.UID,
  //     standard_id: id ? id : '',
  //     id_board: id_board ? id_board : this.state.selectedBoard,
  //     id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
  //   };
  //   new Service().apiCall('students/getData', postData).then(response => {
  //     if (response.status == 200 && response.data != '') {
  //       const newArr = response.data.map(v => ({ ...v, editable: false }));
  //       if (this.state.showStatus == 'all') {
  //         this.setState({ studentData: newArr, studentSuggestions: newArr });
  //       }
  //       else {
  //         var newArray = newArr.filter(x => x.status == this.state.showStatus);
  //         this.setState({ studentData: newArray, studentSuggestions: newArray });
  //       }
  //     } else {
  //       this.setState({ studentData: [] });
  //     }
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }

  // getStudentDocuments = (uid) => {
  //   this.setState({ studentDocuments: [] });
  //   const postData = {
  //     id_organization: this.state.selectedOrganizationId,
  //     id_institute: this.state.selectedInstitutionId,
  //     token: "abc",
  //     id_user: this.props.data.UID,
  //     id_student: uid,
  //     id_board: this.state.selectedBoard,
  //     id_academicyear: this.state.selectedAcademicYear
  //   };
  //   new Service().apiCall('DocumentManagements/getDocumentDetails', postData).then(response => {
  //     if (response.status == 200 && response.data != '') {

  //       this.setState({ studentDocuments: response.data });

  //     }
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }

  getStandardSectionDetails() {
    const postData = {
      count: "subject",
      type: "cstr",
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
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
      alert(error);

    });

  }
  getStream = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    console.log(postData);
    new Service().apiCall('ClassMasters/AllStreamSelect', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ AllStream: data });
      } else {
        this.setState({ AllStream: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  handleClassMasterDelete = (id, status) => {
    const postData = {
      id: id,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('ClassMasters/deleteClassMaster', postData,
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
                <h4 className="font-weight-bold">{status == 1 ? "Class Deactivated" : "Class Activated"}</h4>
              </div>
            </Dialog>
          ),
        });
        setTimeout(() => {
          this.getClassmasterDetails(this.state.selectedBoard);
          this.setState({ basicNotify: false });

        }, 2000)
      } else {
        //  this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      console.log(error)
      // this.raiseLoginSignupErrorAlert("signup");
    });
  }

  showError = (error, status) => {
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
      this.setState({ basicNotify: false });
      if (status == 401) {
        this.props.removeUserData();
        this.props.history.push("/login");
      }
    }, 2000)
  }

  handleClass = e => { 
    e.preventDefault();   

    for(var i =0; i< this.state.classmasterDetails.length; i++ ) {
      for(var j= 0; j< this.state.classholders.length;j++) {
        if(this.state.classmasterDetails[i].standard === this.state.classholders[j].standards && this.state.classmasterDetails[i].section === this.state.classholders[j].sections && this.state.classmasterDetails[i].streams === this.state.classholders[j].streams) {          
          this.state.classholders.splice(j,1);
          break;            
        }
      }
    }

    //console.log('data'+this.state.classholders.length);return false;

    if(this.state.classholders.length >= 1){
      const postData = {
        classholders: this.state.classholders,
        id_academicyear: this.state.selectedAcademicYear,
        id_board: this.state.selectedBoard,
        id_organization: this.props.data.selectedOrganizationId,
        id_institute: this.props.data.selectedInstitutionId,
        role_id: this.props.data.role_id,
        token: "abc",
        id_user: this.props.data.UID,
      };
      new Service().apiCall('ClassMasters/insertData', postData,
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
                  <h4 className="font-weight-bold">Class Inserted</h4>
                </div>
              </Dialog>
            ),
          }); 
          setTimeout(() => {
            // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
            window.location.reload()
          }, 2000)
        } else {
          console.log(response.data);
          //this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
        if (error.response.status == 500 && error.response.data != "") {
          this.showError(error.response.data, error.response.status)
        }
        else if (error.response.status == 401) {
          this.showError('Invalid Auth token. Redirecting to login', error.response.status)
        }
        else {          
          console.log(error)
        }
      });
    }else{
      this.setState({classholders: [{ standards: '', sections: '', streams: '', academics: '' }]});
      return false;
    }
  }

  
  handleClassStream = e => {
    e.preventDefault();
    const postData = {
      stream: this.state.stream,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID,
    };
    console.log(postData)
    new Service().apiCall('ClassMasters/insertStream', postData,
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
                <h4 className="font-weight-bold">Stream Inserted</h4>
              </div>
            </Dialog>
          ),
        });
        setTimeout(() => {
          // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
          window.location.reload()
        }, 2000)
      } else {
        console.log(response.data);
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      if (error.response.status == 500 && error.response.data != "") {
        this.showError(error.response.data, error.response.status)
      }
      else if (error.response.status == 401) {
        this.showError('Invalid Auth token. Redirecting to login', error.response.status)
      }
      else {
        console.log(error)
      }
    });
  }

  updateStreamData = (streamSelections) => {
    const postData = {
      streamSelections: streamSelections,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id: this.props.data.role_id,
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
      if (response.status == 200 && response.data != '') {
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
      if (error.response.status == 500 && error.response.data != "") {
        this.showError(error.response.data, error.response.status)
      }
      else if (error.response.status == 401) {
        this.showError('Invalid Auth token. Redirecting to login', error.response.status)
      }
      else {
        console.log(error)
      }
    });
  }

  updateClass = e => {
    e.preventDefault();
    const postData = {
      id: this.state.selectedStandardId,
      standard:this.state.edit_standard,
      section:this.state.edit_section,
      stream_id:this.state.edit_stream_id,
      id_academicyear: this.state.selectedAcademicYear,
      id_board: this.state.selectedBoard,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID,
    };
    // console.log('postdata'+JSON.stringify(postData)); return false;
    new Service().apiCall('ClassMasters/updateStandardDetails', postData,
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
                <h4 className="font-weight-bold">Standard Details Updated</h4>
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
      if (error.response.status == 500 && error.response.data != "") {
        this.showError(error.response.data, error.response.status)
      }
      else if (error.response.status == 401) {
        this.showError('Invalid Auth token. Redirecting to login', error.response.status)
      }
      else {
        console.log(error)
      }
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

  renderStatusPanel = (status, id, data) => {
    if (status == "incustody") {
      this.setState({ custodyPanel: true, id_document: id, documentInfo: data })
    }
    else if (status == "returned") {
      this.setState({ returnPanel: true, id_document: id, documentInfo: data })
    }
    else if (status == "disposed") {
      this.setState({ disposePanel: true, id_document: id, documentInfo: data })
    }
  }

  // handleStudentSearch = (val) => {
  //   this.setState({ studentInfo: val });
  //   this.getStudentDocuments(val.UID);
  // }

  handleStreamChecked(standard, idx, id, status) {
    let lstreams = this.state.streamDetails;
    lstreams[idx].streams[id].checked = !status;
    this.setState({ streamDetails: lstreams });
  }


  getClassmasterDetails(id_board, id_academicyear) {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      role_id: this.props.data.role_id,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassMasters/getClassMasterDetails', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        //console.log('classes'+JSON.stringify(response));
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
      if (error.response.status == 500 && error.response.data != "") {
        this.showError(error.response.data, error.response.status)
      }
      else if (error.response.status == 401) {
        this.showError('Invalid Auth token. Redirecting to login', error.response.status)
      }
      else {
        console.log(error)
      }
    });
  }

  handleMapClass(accyr, board, standard) {
    const lUserData = this.props.data;
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_academicyear: accyr,
      id_board: board,
      standard: standard,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('ClassMasters/getMapClassDetails', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          var lStreams = [];
          var lDetails = [];
          response.data.forEach((element, idx) => {
            var lStandard = {};
            var lStream = {};
            lStandard.id = element.id;
            lStandard.standard = element.standard;
            lStandard.streams = new Array();
            lStreams.push(lStandard);
            if (element.stream) {
              element.stream.forEach((ele, id) => {
                var lStream = {};
                if (element.selectedstream && element.selectedstream.includes(ele)) {
                  lStream.checked = true;
                } else {
                  lStream.checked = false;
                }
                lStream.stream = ele;
                lStream.id = id + 1;
                lStandard.streams.push(lStream);
                lStreams[idx] = lStandard;
              })
            }
          })
          this.setState({ mapclassDetails: response.data, streamDetails: lStreams });
        }
      }
    }).catch(error => {
      console.log("error");
    });
  } 

  //GET INDIVIDUAL STANDARD DETAIL 
  getStandardSectionDetails = (id) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id: id,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('ClassMasters/getStandardWithId', postData).then(response => {
      console.log('individual standard_ '+JSON.stringify(response));
      if (response.status == 200 && response.data != '') {
  
        this.setState({ standardDetails: response.data, edit_standard: response.data[0].standard, edit_section:response.data[0].section,edit_stream_id:response.data[0].stream_id});
  
      }else{
        this.setState({ standardDetails: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }


  componentDidMount() {
    this.getAcademicSettingData();
    this.getClassmasterDetails();
    // this.getStudentDetails('', this.props.data.selectedBoard, this.state.selectedAcademicYear);
    this.getStandardSectionDetails();
    this.getStream();
  }

  render() {
    const width = window.innerWidth;
    const width40p = width * (40 / 100) + "px";
    const width50p = width * (50 / 100) + "px";
    const width100p = width + "px";
    return (
      <Fragment>
        {this.state.basicNotify}
        <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
          <AppBar className="app-header" color="secondary" position="fixed">
            <Toolbar className="w-100">
              <Grid container>
                <Grid item xs={12} lg={12} className="d-flex">
                  <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/cstrmodule")} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4" className="p-12">
                    Class Master
            </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Animated animationIn="slideInRight" animationOut="slideOutLeft">
            <div className="pt-100">
              {/* Add stream */}
              {/* {AuthHelper('CSTR', 'can_create') && <Grid container justify="center">

                <Grid item xs={12} md={6} lg={6}>
                  <Card className="card-box  mb-4 p-3">
                    <form
                      onSubmit={this.handleClassStream.bind(this)}
                      autoComplete="off">
                      <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                          <div className="card-header pl-0">
                            <div className="card-header--title">
                              <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                Create Stream
                            </h4>
                            </div>
                          </div>
                          {this.state.stream.map((holder, idx) => (
                            <Grid container spacing={2} justify='center'>

                              <Grid item xs={12} sm={10} md={5} >
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    required
                                    onChange={(event) =>
                                      this.handleClassMasterDataStream(idx, "stream", event.target.value)
                                    }
                                    value={holder.standards}
                                    id={"stream" + idx}
                                    label="Stream"
                                    type="search"
                                    inputRef={this.textInput}
                                    variant="outlined" />
                                </FormControl>
                              </Grid>



                              <Grid item xs={12} sm={6} lg={1}>
                                {idx == 0 ? <div className="addHolderStyle inputMargin">
                                  <TextField

                                    id="document-type"
                                    onKeyPress={(data) => {
                                      if (data.charCode === 13) {
                                        this.handleAddHolderStream(); this.focusTextInput();
                                      }
                                    }}
                                    InputProps={{
                                      autoComplete: 'off',
                                      readOnly: true,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Add style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                        </InputAdornment>
                                      ),
                                    }}
                                    label="Add"
                                    onClick={() => { this.handleAddHolderStream(); this.focusTextInput() }}
                                    variant="outlined" />
                                </div>
                                  :
                                  <div className="removeHolderStyle inputMargin">
                                    <TextField

                                      onKeyPress={(data) => {
                                        if (data.charCode === 13) {
                                          this.removeHolderStream(idx);
                                        }
                                      }}
                                      id="document-type"
                                      InputProps={{
                                        autoComplete: 'off',
                                        readOnly: true,
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <Remove style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      label="Del"
                                      onClick={() => { this.removeHolderStream(idx); }}
                                      variant="outlined" />
                                  </div>
                                }
                              </Grid>
                            </Grid>
                          ))}

                        </Grid>
                      </Grid>

                      {AuthHelper('CSTR', 'can_create') && <Grid container className="mt-2">

                        <Grid item xs={12} sm={12} md={12} className="text-right">
                          <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
                        </Grid>
                      </Grid>}
                    </form>
                  </Card></Grid></Grid>} */}

              {/* end stream */}
              {AuthHelper('CSTR', 'can_create') && <Grid container justify="center">

                <Grid item xs={12} md={10} lg={10} justify='center'>
                  <Card className="card-box  mb-4 p-3" justify='center'>
                    <form
                      onSubmit={this.handleClass.bind(this)}
                      autoComplete="off" justify='center'>
                      <Grid container justify='center'>
                        <Grid item xs={12} md={12} lg={12}>
                          <div className="card-header pl-0">
                            <div className="card-header--title">
                              <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                Create Class
                           </h4>
                            </div>
                          </div>
                          {this.state.classholders.map((holder, idx) => (
                            <Grid container spacing={2}>

                              <Grid item xs={12} sm={10} md={3}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    required
                                    onChange={(event) =>
                                      // this.handleClassMasterData(idx, "standards", event.target.value.replace(/[^a-zA-Z0-9\.,]/g, ''))
                                      this.handleClassMasterData(idx, "standards", event.target.value)
                                    }
                                    value={holder.standards}
                                    id={"standard" + idx}
                                    label="Standard"
                                    type="search"
                                    inputRef={this.textInput}
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={4}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    required
                                    onChange={(event) =>
                                      this.handleClassMasterData(idx, "sections", event.target.value.replace(/[^a-zA-Z0-9\.,]/g, ''))
                                    }
                                    id={"section" + idx}
                                    label="Sections (separated by comma)"
                                    value={holder.sections}
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>

                            


                             
                              <Grid item xs={12} md={3} lg={3}>
                                <FormControl fullWidth>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select Stream"
                                    variant="outlined"
                                    value={holder.streams}
                                    onChange={(event) =>
                                      this.handleClassMasterData(idx, "streams", event.target.value)
                                    }
                                    required
                                  >
                                  
                                    {this.state.AllStream.map(option => (
                                      <MenuItem key={option.stream} value={option.id} id={option.stream}>
                                        {option.stream}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  
                                </FormControl>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} lg={1}>
                                {idx == 0 ? <div className="addHolderStyle inputMargin">
                                  <TextField

                                    id="document-type"
                                    onKeyPress={(data) => {
                                      if (data.charCode === 13) {
                                        this.handleAddHolder(); this.focusTextInput();
                                      }
                                    }}
                                    InputProps={{
                                      autoComplete: 'off',
                                      readOnly: true,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Add style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                        </InputAdornment>
                                      ),
                                    }}
                                    label="Add"
                                    onClick={() => { this.handleAddHolder(); this.focusTextInput() }}
                                    variant="outlined" />
                                </div>
                                  :
                                  <div className="removeHolderStyle inputMargin">
                                    <TextField

                                      onKeyPress={(data) => {
                                        if (data.charCode === 13) {
                                          this.removeHolder(idx);
                                        }
                                      }}
                                      id="document-type"
                                      InputProps={{
                                        autoComplete: 'off',
                                        readOnly: true,
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <Remove style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      label="Del"
                                      onClick={() => { this.removeHolder(idx); }}
                                      variant="outlined" />
                                  </div>
                                }
                              </Grid>
                            </Grid>
                          ))}

                        </Grid>
                      </Grid>

                      {AuthHelper('CSTR', 'can_create') && <Grid container className="mt-2">

                        <Grid item xs={12} sm={12} md={12} className="text-right">
                          <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
                        </Grid>
                      </Grid>}
                    </form>
                  </Card></Grid></Grid>}

              <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                  <Card className="card-box  mb-4 customNoData">
                    <div className="card-header">
                      <div className="card-header--title">
                        <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                          Class List
                </h4>
                      </div>
                    </div>
                    <ReactTable

                      data={
                        this.state.classmasterDetails.map((original, key) => {
                          return ({
                            slno: key + 1,
                            id: original.id,
                            standard: original.standard,
                            section: original.section,
                            // stream: original.selected_stream,
                            stream: original.stream,
                            status: original.status,
                            actions: (
                              <div>
                                {/* {AuthHelper('CSTR', 'can_edit') && <Tooltip
                                  id="tooltip-top"
                                  title="Map section to stream"
                                  placement="top"
                                >
                                  <Button
                                    simple
                                    onClick={() => { this.setState({ mapSectionStreamPanel: true }); this.handleMapClass(this.state.selectedAcademicYear, this.state.selectedBoard, original.standard); }}
                                    color="secondary"
                                    className="edit"
                                  >
                                    <GroupWork />
                                  </Button>
                                </Tooltip>} */}

                                {original.status == "1" && <>
                                  {AuthHelper('CSTR','can_edit') && <Tooltip
                                    id="tooltip-top"
                                    title="Map section to stream"
                                    placement="top"
                                    >
                                    <Button
                                    simple 
                                    onClick={() => { this.setState({ editStandardPanel: true, selectedStandardId: original.id}); this.getStandardSectionDetails(original.id)}}
                                    color="secondary"
                                    className="edit"
                                    >
                                    <Edit />
                                    </Button>
                                    </Tooltip>}
                                </>
                                }

                                {AuthHelper('CSTR', 'can_delete') && <Tooltip
                                  id="tooltip-top"
                                  title={original.status == "1" ? "Deactivate" : "Activate"}
                                  placement="top"
                                >
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={original.status == "1" ? true : false}
                                        onChange={() => this.handleClassMasterDelete(original.id, original.status)}
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
                          Filter: ({ filter, onChange }) => (
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
                          Header: "Standard",
                          accessor: "standard",
                          className: "center",
                          Filter: ({ filter, onChange }) => (
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
                        {
                          Header: "Section",
                          accessor: "section",
                          width: 90,
                          className: "center",
                          Filter: ({ filter, onChange }) => (
                            <TextField
                              inputProps={{
                                autoComplete: 'off'
                              }}
                              id="section"
                              value={filter ? filter.value : ''}
                              placeholder="Search Section"
                              type="text"
                              onChange={event => onChange(event.target.value)}
                            />
                          )
                        },
                        {
                          Header: "Assigned Streams",
                          accessor: "stream",
                          className: "center",
                          Filter: ({ filter, onChange }) => (
                            <TextField
                              inputProps={{
                                autoComplete: 'off'
                              }}
                              id="stream"
                              value={filter ? filter.value : ''}
                              placeholder="Search Stream"
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
                    <CardActions stats style={{ marginTop: 0 }}>

                    </CardActions>

                  </Card></Grid>
              </Grid>

              <Drawer

                anchor="right"
                open={this.state.academicSettingsPanel}
                variant="temporary"
                elevation={4}
                onClose={() => this.setState({ academicSettingsPanel: false })}>
                <Box className={"app-header-drawer bgColor"} style={{ width: width40p }}>
                  <PerfectScrollbar>
                    <AppBar className="app-header" color="secondary" position="relative">
                      <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => this.setState({ academicSettingsPanel: false })} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h5">
                          Academic Calendar Settings
                        </Typography>

                      </Toolbar>
                    </AppBar>
                    <div className="m-20">
                      {this.state.academicsetting.annual &&
                        <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.academicSettingId == this.state.academicsetting.annual.id}
                                    onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', this.state.academicsetting.annual.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: this.state.academicsetting.annual.id }) }}
                                  />
                                }
                                label="Annual"
                              />
                            </Grid>
                          </Grid>
                        </Card>
                      }
                      <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                        {this.state.academicsetting.semester && this.state.academicsetting.semester.map((element) => (

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.academicSettingId == element.id}
                                    onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: element.id }) }}
                                  />
                                }
                                label={element.name}
                              />
                            </Grid>
                          </Grid>

                        ))}
                      </Card> 

                      <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                        {this.state.academicsetting.trimester && this.state.academicsetting.trimester.map((element) => (

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={10} md={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    checked={this.state.academicSettingId == element.id}
                                    onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: element.id }) }}
                                  />
                                }
                                label={element.name}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Card>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={10} md={12} className="text-right">
                          <Button color="secondary" variant="contained" onClick={() => this.setState({ academicSettingsPanel: false })}>Submit</Button>
                        </Grid>
                      </Grid>
                    </div>
                  </PerfectScrollbar>
                </Box>
              </Drawer>

              <Drawer
                anchor="right"
                open={this.state.mapSectionStreamPanel}
                variant="temporary"
                elevation={4}
                onClose={() => this.setState({ mapSectionStreamPanel: false })}>
                <Box className={"app-header-drawer bgColor"} style={{ width: width100p }}>
                  <PerfectScrollbar>
                    <AppBar className="app-header" color="secondary" position="relative">
                      <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => this.setState({ mapSectionStreamPanel: false })} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h5">
                          Map Section to Stream
                        </Typography>
                      </Toolbar>
                    </AppBar>

                    <div className="m-20">
                      <Grid container spacing={2} justify="center">
                        <Grid item xs={12} sm={10} md={6}>
                          <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                            <div className="card-header pl-0">
                              <div className="card-header--title">
                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                  Map Section to Stream
                                </h4>
                              </div>
                            </div>
                            {this.state.streamDetails.map((element, idx) => (
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={10} md={2} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  <Box>{element.standard}</Box>
                                </Grid>
                                {element.streams.map((ele, id) => (
                                  <Grid item xs={12} sm={10} md={2}>

                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          tabIndex={-1}
                                          checked={ele.checked}
                                          onClick={() => this.handleStreamChecked(element.id, idx, id, ele.checked)}

                                        />
                                      }

                                      label={ele.stream}
                                    />

                                  </Grid>
                                ))}
                              </Grid>
                            ))}
                            {AuthHelper('CSTR', 'can_edit') && <Grid container spacing={4}>
                              <Grid item xs={12} sm={12} md={12} className="text-right mb-2">
                                <Button className="successBtnOutline" onClick={() => this.renderSelectedStreams()}>Submit</Button>
                              </Grid>
                            </Grid>}
                          </Card>

                        </Grid>
                      </Grid>
                    </div>
                  </PerfectScrollbar>
                </Box>
              </Drawer>

              <Drawer
                anchor="right"
                open={this.state.editStandardPanel}
                variant="temporary"
                elevation={4}
                onClose={() => this.setState({ editStandardPanel: false })}>
                <Box className={"app-header-drawer bgColor"} style={{ width: width50p }}>
                  <PerfectScrollbar>
                    <AppBar className="app-header" color="secondary" position="relative">
                      <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => this.setState({ editStandardPanel: false })} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h5">
                          Edit Standard
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <div className="m-20">
                      <Grid container justify="center">

                        <Grid item xs={12} md={12} lg={12} justify='center'>
                          <Card className="card-box  mb-4 p-3" justify='center'>
                          <div className="card-header pl-0">
                              <div className="card-header--title">
                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                  Edit Standard
                                </h4>
                              </div> 
                            </div>
                            <form onSubmit={this.updateClass.bind(this)} autoComplete="off" justify='center'>
                              <Grid container justify='center'>
                                  <Grid item xs={12} sm={10} md={4}>
                                    <FormControl fullWidth>
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off',
                                          style: { textTransform: 'capitalize' }
                                        }}
                                        required
                                        className="m-2"
                                        onChange={(event) =>this.setState({edit_standard: event.target.value})}
                                        value={this.state.edit_standard}
                                        id={"standard_name"}
                                        label="Standard"
                                        type="search"
                                        variant="outlined" />
                                    </FormControl>
                                  </Grid>

                                  <Grid item xs={12} sm={10} md={4}>
                                    <FormControl fullWidth>
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off',
                                          style: { textTransform: 'capitalize' }
                                        }}
                                        required
                                        className="m-2"
                                        onChange={(event) =>this.setState({edit_section: event.target.value})}
                                        id={"section_name"}
                                        label="Section"
                                        value={this.state.edit_section}
                                        type="search"
                                        variant="outlined" />
                                    </FormControl>
                                  </Grid>
                                  
                                  <Grid item xs={12} md={3} lg={4}>
                                    <FormControl fullWidth>
                                      <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Select Type"
                                        variant="outlined"
                                        className="m-2"
                                        value={this.state.edit_stream_id}
                                        onChange={(event) => this.setState({edit_stream_id: event.target.value})}
                                        required
                                      >                                    
                                        {this.state.AllStream.map(option => (
                                          <MenuItem key={option.stream} value={option.id} id={option.stream}>
                                            {option.stream}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                      
                                    </FormControl>
                                  </Grid>
                              </Grid>
                              <Grid container className="mt-2">
                                <Grid item xs={12} sm={12} md={12} className="text-right">
                                  <Button type="submit" className="successBtnOutline" variant="outlined">Update</Button>
                                </Grid>
                              </Grid>
                            </form>
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
