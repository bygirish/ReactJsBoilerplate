import React, { Fragment } from 'react';
import {
  Dialog, Grid, Switch, FormControlLabel, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Avatar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, Tooltip,
  Drawer, Toolbar
} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Animated } from "react-animated-css";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import NavigateNext from "@material-ui/icons/NavigateNext";
import ViewIcon from "@material-ui/icons/Visibility";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { ExampleWrapperSimple } from '../../../../layout-components';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete1 from "../../../../layout-components/CustomComponents/AutoComplete.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from "../../../../assets/images/placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
import Config from '../../../../config';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import DynamicTable from "../../../../layout-components/CustomComponents/DynamicTable/index.js";
import DynamicTable2 from "../../../../layout-components/CustomComponents/DynamicTable/DynamicTable";
const tables = require("../../../../layout-components/CustomComponents/DynamicTable/table-data.js");


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
const fileMotherInput = React.createRef();
const fileFatherInput = React.createRef();
const fileGuardInput = React.createRef();
const fileBirthInput = React.createRef();
const fileAadhaarInput = React.createRef();
const fileTransferInput = React.createRef();
const fileMarksInput = React.createRef();

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      loading: false,
      firstname: "",
      middlename: "",
      lastname: "",
      gender: "",
      bloodgroup: "",
      mothertongue: "",
      nationality: "",
      religion: "",
      caste: "",
      castecategory: "",
      phone_no: "",
      email: "",
      linkedin_id: "",
      facebook_id: "",
      address_line1: "",
      address_line2: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
      permanent_address1: "",
      permanent_address2: "",
      permanent_pincode: "",
      permanent_city: "",
      permanent_district: "",
      permanent_state: "",
      birth_certificate_no: "",
      aadhaar_no: "",
      passport_no: "",
      driving_license_no: "",
      selectedOptionalSubject: '',
      selectedOptionalSubjectIds: '',
      standardSubjects: [],
      subjects: [],
      individualAttachments: [{ student_photo: "", father_photo: "", mother_photo: "", guardian_photo: "", birth_certificate: "", aadhaar_card: "", latest_marks_card: "", transfer_certificate: "" }],
      individualAllData: [],
      individualPrevious: [],
      individualFees: [],
      phone1Checked: false,
      phone2Checked: false,
      bothChecked: false,
      studentData: [],
      individualData: [],
      individualSiblings: [],
      message_sent_to: '',
      messageCheck: false,
      formChanged: false,
      showTextSuggestions: false,
      textSuggestions: [],
      feeCategoryChecked: false,
      selectedFeeSection: false,
      selectedFeeSectionId: '',
      boardChecked: false,
      selectedFeeBoard: '',
      same_address: false,
      father_name: "",
      father_middle_name: "",
      father_last_name: "",
      father_phone_no: "",
      father_email_id: "",
      father_linkedin_id: "",
      father_facebook_id: "",
      mother_name: "",
      mother_middle_name: "",
      mother_last_name: "",
      mother_phone_no: "",
      mother_email_id: "",
      mother_linkedin_id: "",
      mother_facebook_id: "",
      guard_name: "",
      guard_middle_name: "",
      guard_last_name: "",
      guard_phone_no: "",
      guard_email_id: "",
      guard_linkedin_id: "",
      guard_facebook_id: "",
      guard_address_line1: "",
      guard_address_line2: "",
      guard_pincode: "",
      guard_city: "",
      guard_district: "",
      guard_state: "",
      primary_contact: "",
      primary_contact1: "",
      message_sent_to: "",
      activeAccordion: '',
      categoryName: '',
      lfeecategory: '',
      categoryData: [],
      classwiseSectionsDashboard: [],
      boardDetails: [],
      academicDetails: [],
      dashboardDetails: [],
      TotalStudentCount: 0,
      studentname: '',
      siblingHolders: [],
      awardHolders: [{ award_academic_year: '', area_of_achievement: '', award_remarks: '' }],
      siblingCount: '',
      awardCount: '',
      previouslyStudied: '',
      gender: '',
      dateOfBirth: new Date(),
      imagePreviewUrl: defaultImage,
      imageFatherPreviewUrl: defaultImage,
      imageMotherPreviewUrl: defaultImage,
      imageGuardPreviewUrl: defaultImage,
      imageBirthPreviewUrl: defaultImage,
      imageAadhaarPreviewUrl: defaultImage,
      imageMarksPreviewUrl: defaultImage,
      imageTransferPreviewUrl: defaultImage,
      defaultDisplayImage: defaultImage,
      error: '',
      genderArray: ['Male', 'Female', 'Others'],
      selectedFile: null,
      selectedFatherFile: null,
      selectedMotherFile: null,
      selectedGuardFile: null,
      selectedBirthFile: null,
      selectedAadhaarFile: null,
      selectedMarksFile: null,
      selectedTransferFile: null,
      alert: null,
      currentForm: 'student_details',
      sameInstitute: '',
      standardSections: [],
      sectionSuggestions: [],
      filterSections: [],
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '',
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      classwiseSections: [],
      userInput: "",
      userSiblingInput: "",
      studentSuggestions: [],
      activeSuggestion: 0,
      filteredSuggestions: [],
      activeStep: 0,
      joiningStandard: '',
      steps: ['Student Profiling', 'Sibling Profiling', 'Parents Profiling', 'Academic Profiling', 'Fee Configuration', 'Attachments'],
      requiredState: "",
      basicNotify: false,
      allStudents: true,
      searchStudent: false,
      ColumnsData: [],
      ColumnsDataAC: [],
      selectedSidebarSection:'',
      viewSidebarStudentClass: true,
      properties: {
        cols: [
          {
            Header: "Link",
            accessor: "link",
            Cell: {
              type: "LINK"
            }
          },
          {
            Header: "Date",
            accessor: "date",
            Cell: {
              type: "Date"
            }
          },
          {
            Header: "Input",
            accessor: "inp",
            Cell: {
              isRead: false
            }
          },
          {
            Header: "Image",
            accessor: "img",
            Cell: {
              type: "image",
              properties: {
                width: 40
              }
            },
            align: "center"
          },
          {
            Header: "Date Link",
            accessor: "date",
            Cell: {
              type: "text"
            },
            align: "right"
          },
          {
            Header: "Check",
            accessor: "check",
            Cell: {
              type: "checkBox"
            },
            align: "center"
          }
        ],
        rows: [
          {
            link: {
              value: "Row 1"
            },
            inp: {
              value: "Sample Value 1"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "01-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 2"
            },
            inp: {
              value: "Sample Value 2"
            },
            check: {
              value: true
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "02-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 3"
            },
            inp: {
              value: "Sample Value 3"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "03-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 4"
            },
            inp: {
              value: "Sample Value 4"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "04-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 5"
            },
            inp: {
              value: "Sample Value 5"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "05-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 6"
            },
            inp: {
              value: "Sample Value 6"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "06-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 7"
            },
            inp: {
              value: "Sample Value 7"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "07-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 8"
            },
            inp: {
              value: "Sample Value 8"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "08-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 9"
            },
            inp: {
              value: "Sample Value 9"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "09-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 10"
            },
            inp: {
              value: "Sample Value 10"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "10-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 11"
            },
            inp: {
              value: "Sample Value 11"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "11-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 12"
            },
            inp: {
              value: "Sample Value 12"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "12-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 13"
            },
            inp: {
              value: "Sample Value 13"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "13-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 14"
            },
            inp: {
              value: "Sample Value 14"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "14-Feb-2019"
            }
          },
          {
            link: {
              value: "Row 15"
            },
            inp: {
              value: "Sample Value 15"
            },
            check: {
              value: false
            },
            img: {
              value: "https://github.githubassets.com/favicon.ico",
              title: "GitHub"
            },
            date: {
              value: "15-Feb-2019"
            }
          }
        ]
      },
      TableType:'custom',
      URL:{'TableDataURL':'table-Data/Role','TableColumnURL':'table-Columns/Role'}
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
  handleFatherImageChange = event => {
    this.setState({
      selectedFatherFile: event.target.files[0]
    })
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imageFatherPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleMotherImageChange = event => {
    this.setState({
      selectedMotherFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageMotherPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleGuardImageChange = event => {
    this.setState({
      selectedGuardFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageGuardPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleBirthImageChange = event => {
    this.setState({
      selectedBirthFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageBirthPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleStudentSearch = (val) => {
    this.props.history.push("/admin/view-student-info/" + val.UID);
  }
  handleIndividualSearch = (val) => {
    this.setState({ 'id_user': val.UID, viewStudentPanel: true });
    setTimeout(() => {
      this.getIndividualStudentDetails(val.UID);
    }, 1500);
  }
  handleAadhaarImageChange = event => {
    this.setState({
      selectedAadhaarFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageAadhaarPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleMarksImageChange = event => {
    this.setState({
      selectedMarksFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageMarksPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };
  handleTransferImageChange = event => {
    this.setState({
      selectedTransferFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageTransferPreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };

  renderTextInput = (name, label) => {
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
          onChange={(event) => this.handleChangeState(name, event.target.value)}
          className="m-2"
          inputRef={this.textInput}
          variant="outlined"
        />
      </FormControl>
    )
  }
  getStudentKeys = () => {
    let studentData = this.state.studentData;
    let Header=this.state.Header;
    let data = [];
    // for (var i in studentData) {

    //   if (i == '0') {


    //     for (var l in studentData[0]) {
    //       console.log(l);
    //       if (l != 'id' && l != 'UID' && l != 'editable') {
    //         if (l == 'father_name' || l == 'primary_contact' || l == 'standard' || l == 'gender' || l == 'blood_group' || l == 'date_of_birth' ||
    //           l == 'mother_tongue' || l == 'religion' || l == 'caste' || l == 'email_id' || l == 'admission_date' || l == 'sts_number') {
    //           data.push(l);

    //         }
    //       }

    //     }
    //   }
    // }
    Object.entries(Header).map(([key,value])=>{
      if(value!='Id'&& value != 'UID' && value != 'Name'){
      data.push(value)
      }
    })
    console.log({ data });
    this.setState({ columnKey: data });
  }
  searchStudentColumns = (values) => {
    let Header=this.state.Header;
    let invisible = [];
    let data = [];
    console.log(values);
    values.map((element, index) => {
      data[element] = true;
    })
    Object.entries(Header).map(([key,value])=>{
      if(data[value]){
        invisible[key]=true;
      }
      else{
        invisible[key]=false;
      }
    })

    this.setState({invisible:invisible, ColumnsData: data, ColumnsDataAC: values });
   

  }

  removeAwardHolder(i) {
    const { awardHolders } = this.state;
    this.setState({
      awardHolders: awardHolders.filter((award, index) => index !== i),
    });
  }
  handleAddAwardholder = (c) => {
    let lawardholders = this.state.awardHolders;
    let lAwards = {};
    lAwards.award_academic_year = '';
    lAwards.area_of_achievement = '';
    lAwards.award_remarks = '';
    lawardholders.push(lAwards);
    this.setState({ awardHolders: lawardholders });
  }

  handleBoard = (type, name, status) => {
    if (type) {
      this.setState({ boardChecked: true, selectedFeeBoard: type });
    }
    else {
      this.setState({ boardChecked: false, selectedFeeBoard: '' });
    }
  }

  handleAwardChange = (pIndex, inputName, pValue) => {
    let lAwardHolders = this.state.awardHolders;
    lAwardHolders[pIndex][inputName] = pValue;
    this.setState({ awardHolders: lAwardHolders });
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

  handleFeeCategory = (type, name, status) => {
    if (type) {
      this.setState({ feeCategoryChecked: true, categoryName: name, lfeecategory: type });
    }
    else {
      this.setState({ feeCategoryChecked: false, categoryName: '', lfeecategory: '' });
    }
  }

  handleChangeInstitute = (idx, value) => {
    let lsiblingata = this.state.siblingHolders;
    lsiblingata.map((siblings, id) => {
      if (idx == id) {
        siblings.checked = value;
      }
    });
    this.setState({ siblingHolders: lsiblingata });
  };

  rendersiblings = () => {
    let siblingCount = this.state.siblingCount;

    let lsiblingholders = this.state.siblingHolders;
    if (siblingCount > 0) {
      for (let i = 0; i < siblingCount; i++) {
        lsiblingholders.push({ sibling_firstname: '', sibling_middlename: '', sibling_lastname: '', sibling_gender: '', sibling_dob: '', sibling_standard: '', sibling_board: '', sibling_school: '', checked: "" });
      }
      this.setState({ siblingHolders: lsiblingholders, siblingCount: this.state.siblingHolders.length });
    }
  }

  handlePreviouStudied = (value) => {
    this.setState({ previouslyStudied: value });
  }

  handleClick = (name) => {
    if (name == 'student') {
      fileInput.current.click();
    } else if (name == 'father') {
      fileFatherInput.current.click();
    } else if (name == 'mother') {
      fileMotherInput.current.click();
    } else if (name == 'guard') {
      fileGuardInput.current.click();
    } else if (name == 'birth') {
      fileBirthInput.current.click();
    } else if (name == 'aadhaar') {
      fileAadhaarInput.current.click();
    } else if (name == 'marks') {
      fileMarksInput.current.click();
    } else if (name == 'transfer') {
      fileTransferInput.current.click();
    }
  };

  handleRemove = (name) => {
    if (name == 'student') {
      this.setState({
        imagePreviewUrl: defaultImage, selectedFile: null
      });
      fileInput.current.value = null;
    } else if (name == 'father') {
      this.setState({
        imageFatherPreviewUrl: defaultImage, selectedFatherFile: null
      });
      fileFatherInput.current.value = null;
    } else if (name == 'mother') {
      this.setState({
        imageMotherPreviewUrl: defaultImage, selectedMotherFile: null
      });
      fileMotherInput.current.value = null;
    } else if (name == 'guard') {
      this.setState({
        imageGuardPreviewUrl: defaultImage, selectedGuardFile: null
      });
      fileGuardInput.current.value = null;
    } else if (name == 'birth') {
      this.setState({
        imageBirthPreviewUrl: defaultImage, selectedBirthFile: null
      });
      fileBirthInput.current.value = null;
    } else if (name == 'aadhaar') {
      this.setState({
        imageAadhaarPreviewUrl: defaultImage, selectedAadhaarFile: null
      });
      fileAadhaarInput.current.value = null;
    } else if (name == 'marks') {
      this.setState({
        imageMarksPreviewUrl: defaultImage, selectedMarksFile: null
      });
      fileMarksInput.current.value = null;
    } else if (name == 'transfer') {
      this.setState({
        imageTransferPreviewUrl: defaultImage, selectedTransferFile: null
      });
      fileTransferInput.current.value = null;
    }
  };

  handleSiblingData = (pIndex, inputName, pValue) => {
    let lSiblingHolders = this.state.siblingHolders;
    lSiblingHolders[pIndex][inputName] = pValue;
    this.setState({ siblingHolders: lSiblingHolders });
  }

  handleChangeState = (name, value) => {
    this.setState({ [name]: value });
  }

  handleAddress = (status) => {
    if (status == false) {
      this.setState({ permanent_address1: this.state.address_line1, permanent_address2: this.state.address_line2, permanent_pincode: this.state.pincode, permanent_city: this.state.city, permanent_district: this.state.district, permanent_state: this.state.state, same_address: !status })

    }
    else {
      this.setState({ permanent_address1: '', permanent_address2: '', permanent_pincode: '', permanent_city: '', permanent_district: '', permanent_state: '', same_address: !status })
    }
  }

  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };
  dataCount=(dataCount)=>{
    this.setState({dataCount:dataCount});
  }

  studentProfiling = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                Primary Information
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("firstname", "First Name")}
            </Grid>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("middlename", "Middle Name")}
            </Grid>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("lastname", "Last Name")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("gender", "Gender")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("bloodgroup", "Blood Group")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              <FormControl fullWidth>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date of birth"
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    value={this.state.dateOfBirth}
                    onChange={this.handleDateOfBirth}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("mothertongue", "Mother Tongue")}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                Contact Details
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("phone_no", "Phone Number")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("email", "Email")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("linkedin_id", "Linkedin ID")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("facebook_id", "Facebook ID")}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                Correspondance Address
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} className="py-1">
              {this.renderTextInput("address_line1", "Communication address line 1")}
            </Grid>
            <Grid item xs={12} lg={6} className="py-1">
              {this.renderTextInput("address_line2", "Communication address line 2")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("pincode", "Pincode")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("city", "Taluk/City")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("district", "District")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("state", "State")}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3} className="p-20  mt-3">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                Permanent Address
              </div>
            </Grid>

            <Grid item xs={12} sm={6} lg={9} className="p-20">
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    checked={this.state.same_address == true}
                    onClick={() => { this.handleAddress(this.state.same_address); this.setState({ same_address: !this.state.same_address }) }}
                  />
                }
                label="Same as above"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} className="py-1">
              {this.renderTextInput("permanent_address1", "Permanent address line 1")}
            </Grid>
            <Grid item xs={12} lg={6} className="py-1">
              {this.renderTextInput("permanent_address2", "Communication address line 2")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_pincode", "Pincode")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_city", "Taluk/City")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_district", "District")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_state", "State")}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                Supporting Documents References
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("birth_certificate_no", "Birth Certificate No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("aadhaar_no", "Aadhaar No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("passport_no", "Passport No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("driving_license_no", "Driving License No")}
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} lg={6} className="py-1">

              <Button
                disabled={this.state.activeStep === 0}
                onClick={() => this.handleBack()}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} lg={6} className="py-1 text-right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => this.handleNext()}
              >
                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </ExampleWrapperSimple>
      </Animated>
    )
  }

  siblingProfiling = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <Card className="card-box  mb-2 mt-2 py-3">
                <Grid container spacing={2} justify="center" className="align-center">
                  <Grid item xs={12} sm={6} lg={3} className="text-right">
                    <span className="mr-10">No of Siblings </span>
                    <input type='number' className="text-center mr-10 w-50"
                      value={this.state.siblingCount}
                      onChange={(event => this.setState({ siblingCount: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={1} className="m-0 pickerGrid">
                    <Avatar onClick={() => this.rendersiblings()}>
                      <NavigateNext />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={8} className="m-0"></Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          {this.state.siblingHolders.map((routeholder, idx) => (
            <Card className="card-box  mb-2 mt-2 py-3 px-3">
              <Grid container spacing={2} justify="center" className="align-center">
                <Grid item xs={12} sm={6} lg={6}>
                  <strong>Sibling {idx + 1} </strong>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  Studying in same institute?
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl component="fieldset">
                    <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                      <FormControlLabel value="end" control={
                        <Radio color="primary" checked={routeholder.checked == "Yes"}
                          onChange={() => { this.handleChangeInstitute(idx, "Yes") }} />} label="Yes" />
                      <FormControlLabel value="end" control={<Radio color="primary" checked={routeholder.checked == "No"}
                        onChange={() => { this.handleChangeInstitute(idx, "No") }} />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {routeholder.checked == "Yes" && <div>

              </div>
              }
              {routeholder.checked == "No" && <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_firstname}
                        label="First Name"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_firstname", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={4} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_middlename}
                        label="Middle Name"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_middlename", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />

                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={4} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_lastname}
                        label="Last Name"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_lastname", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={3} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_gender}
                        label="Gender"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_gender", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={3} className="py-1 dobGrid">
                    <FormControl fullWidth>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          margin="normal"
                          id="date-picker-dialog"
                          label="Date of birth"
                          inputVariant="outlined"
                          format="MM/dd/yyyy"
                          value={this.state.sibling_dob}
                          onChange={(val) => this.handleSiblingData(idx, "sibling_dob", val)}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={3} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_standard}
                        label="Studying Standard"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_standard", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={3} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_board}
                        label="Board"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_board", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={4} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_school}
                        label="School name"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_school", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={8} className="py-1">
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.sibling_school}
                        label="School full address"
                        type="search"
                        onChange={(event) => this.handleSiblingData(idx, "sibling_school_address", event.target.value)}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              }
            </Card>
          ))}
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} lg={6} className="py-1">

              <Button
                disabled={this.state.activeStep === 0}
                onClick={() => this.handleBack()}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} lg={6} className="py-1 text-right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => this.handleNext()}
              >
                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </ExampleWrapperSimple>
      </Animated>
    )
  }

  parentsProfiling = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={12} className="p-20">
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Fathers Primary Information
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("father_name", "First Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("father_middle_name", "Middle Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("father_last_name", "Last Name")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("father_phone_no", "Phone Number")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("father_email_id", "Email ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("father_linkedin_id", "Linkedin ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("father_facebook_id", "Facebook ID")}
              </Grid>
            </Grid>
          </Card>

          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={12} className="p-20">
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Mothers Primary Information
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("mother_name", "First Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("mother_middle_name", "Middle Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("mother_last_name", "Last Name")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("mother_phone_no", "Phone Number")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("mother_email_id", "Email ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("mother_linkedin_id", "Linkedin ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("mother_facebook_id", "Facebook ID")}
              </Grid>
            </Grid>
          </Card>

          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={12} className="p-20">
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Guardians(if any) Primary Information
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("guard_name", "First Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("guard_middle_name", "Middle Name")}
              </Grid>
              <Grid item xs={12} lg={4} className="py-1">
                {this.renderTextInput("guard_last_name", "Last Name")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("guard_phone_no", "Phone Number")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("guard_email_id", "Email ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("guard_linkedin_id", "Linkedin ID")}
              </Grid>
              <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("guard_facebook_id", "Facebook ID")}
              </Grid>
            </Grid>
          </Card>

          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} lg={6} className="py-1">

              <Button
                disabled={this.state.activeStep === 0}
                onClick={() => this.handleBack()}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} lg={6} className="py-1 text-right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => this.handleNext()}
              >
                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </ExampleWrapperSimple>
      </Animated>
    )
  }

  AcademicProfiling = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2} justify="center" className="align-center">

              <Grid item xs={12} sm={6} lg={6}>
                Previously studied?
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl component="fieldset">
                  <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                    <FormControlLabel value="end" control={
                      <Radio color="primary" checked={this.state.previouslyStudied == "Yes"}
                        onChange={() => { this.handlePreviouStudied("Yes") }} />} label="Yes" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl component="fieldset">
                  <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                    <FormControlLabel value="end" control={<Radio color="primary" checked={this.state.previouslyStudied == "No"}
                      onChange={() => { this.handlePreviouStudied("No") }} />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {this.state.previouslyStudied == "Yes" && <div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={12} className="p-20">
                  <div className="card-header--title font-size-md font-weight-bold ml-2">
                    Please mention latest passed out details
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_name", "School Name")}
                </Grid>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_address", "School Address")}
                </Grid>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_academic_year", "Academic Year")}
                </Grid>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_board", "Board")}
                </Grid>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_standard", "Standard")}
                </Grid>
                <Grid item xs={12} lg={4} className="py-1">
                  {this.renderTextInput("passed_grade", "Grade")}
                </Grid>
              </Grid>
            </div>
            }
          </Card>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={12} className="p-20">
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Awards and recognition (if any)
                </div>
              </Grid>
            </Grid>
            {this.state.awardHolders.map((awardholder, idx) => (
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.award_academic_year}
                        label="Academic Year"
                        type="search"
                        onChange={(event) => {
                          if (this.verifyNumber(event.target.value)) {
                            this.handleAwardChange(idx, "award_academic_year", event.target.value.replace(/\s/g, ''))
                          }
                        }}
                        inputRef={this.textInput}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.area_of_achievement}
                        label="Area of achievement"
                        type="search"
                        onChange={(event) => {
                          if (this.verifyNumber(event.target.value)) {
                            this.handleAwardChange(idx, "area_of_achievement", event.target.value.replace(/\s/g, ''))
                          }
                        }}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <FormControl fullWidth>
                      <TextField
                        inputProps={{
                          autoComplete: 'off'
                        }}
                        id="document-type"
                        value={this.state.award_remarks}
                        label="Remarks"
                        type="search"
                        onChange={(event) => {
                          if (this.verifyNumber(event.target.value)) {
                            this.handleAwardChange(idx, "award_remarks", event.target.value.replace(/\s/g, ''))
                          }
                        }}
                        variant="outlined" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={1}>
                    {(this.state.awardHolders.length - 1) == idx ? <div className="addHolderStyle inputMargin"><FormControl fullWidth >
                      <TextField

                        id="document-type"
                        onKeyPress={(data) => {
                          if (data.charCode === 13) {
                            this.handleAddAwardholder(); this.focusTextInput();
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
                        onClick={() => { this.handleAddAwardholder(); this.focusTextInput() }}
                        variant="outlined" />
                    </FormControl></div>
                      :
                      <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                        <TextField

                          onKeyPress={(data) => {
                            if (data.charCode === 13) {
                              this.removeAwardHolder(idx);
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
                          onClick={() => { this.removeAwardHolder(idx); }}
                          variant="outlined" />
                      </FormControl></div>
                    }
                  </Grid>
                </Grid>
              </div>
            ))}
          </Card>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} lg={6} className="py-1">
              <Button
                disabled={this.state.activeStep === 0}
                onClick={() => this.handleBack()}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} lg={6} className="py-1 text-right">
              <Button type="submit" variant="contained" color="primary" onClick={() => this.handleNext()}>
                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </ExampleWrapperSimple>
      </Animated>
    )
  }

  feeConfiguration = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} lg={12}>
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Select Category:
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {this.state.categoryData.length > 0 && this.state.categoryData.map((original, key) => (
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        checked={(original.id == this.state.lfeecategory) ? this.state.feeCategoryChecked : false}
                        onClick={() => { this.handleFeeCategory(original.id, original.name, this.state.feeCategoryChecked) }}
                      />
                    }
                    label={original.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Card>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} lg={3}>
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Select Board:
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {this.state.boardDetails.length > 0 && this.state.boardDetails.map((original, key) => (
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        checked={(original.id == this.state.selectedFeeBoard) ? this.state.boardChecked : false}
                        onClick={() => { this.handleBoard(original.id, original.name, this.state.boardChecked) }}
                      />
                    }
                    label={original.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Card>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">
            <Grid container spacing={2} justify="center" className="align-center">
              <Grid item xs={12} sm={12} lg={6} className="text-center">
                <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Joining Standard
                </div>
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  className="m-2"
                  id="outlined-select-currency"
                  select
                  label="Select Standard"
                  value={this.state.joiningStandard}
                  onChange={(event) => this.selectJoiningStandard(event.target.value)}
                  helperText="Please select joining standard"
                  variant="outlined">
                  {this.state.textSuggestions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Card>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} lg={6} className="py-1">

              <Button
                disabled={this.state.activeStep === 0}
                onClick={() => this.handleBack()}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} lg={6} className="py-1 text-right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => this.handleNext()}
              >
                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </ExampleWrapperSimple>
      </Animated>
    )
  }

  attachments = () => {
    return (
      <Animated animationIn="slideInRight" animationOut="slideOutLeft">
        <ExampleWrapperSimple sectionHeading={this.state.steps[this.state.activeStep]}>
          <Grid container spacing={4}>

            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Student Photo</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imagePreviewUrl} alt={this.state.selectedFile} />
                    </div>
                    <div>
                      {this.state.selectedFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('student')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('student')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('student')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Father Photo</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleFatherImageChange} ref={fileFatherInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageFatherPreviewUrl} alt={this.state.selectedFatherFile} />
                    </div>
                    <div>
                      {this.state.selectedFatherFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('father')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('father')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('father')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Mother Photo</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleMotherImageChange} ref={fileMotherInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageMotherPreviewUrl} alt={this.state.selectedMotherFile} />
                    </div>
                    <div>
                      {this.state.selectedMotherFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('mother')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('mother')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('mother')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Guardian Photo</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleGuardImageChange} ref={fileGuardInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageGuardPreviewUrl} alt={this.state.selectedGuardFile} />
                    </div>
                    <div>
                      {this.state.selectedGuardFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('guard')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('guard')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('guard')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Birth Certificate</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleBirthImageChange} ref={fileBirthInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageBirthPreviewUrl} alt={this.state.selectedBirthFile} />
                    </div>
                    <div>
                      {this.state.selectedBirthFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('birth')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('birth')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('birth')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Aadhaar Card</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleAadhaarImageChange} ref={fileAadhaarInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageAadhaarPreviewUrl} alt={this.state.selectedAadhaarFile} />
                    </div>
                    <div>
                      {this.state.selectedAadhaarFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('aadhaar')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('aadhaar')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('aadhaar')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Latest Marks Card</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleMarksImageChange} ref={fileMarksInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageMarksPreviewUrl} alt={this.state.selectedMarksFile} />
                    </div>
                    <div>
                      {this.state.selectedMarksFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('marks')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('marks')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('marks')}>
                            <i className="fas fa-times" /> Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Card className="card-box  mb-2 mt-2 py-3 px-3">
                <div className="font-weight-400 text-center display-4">Transfer Certificate</div>
                <Divider className="my-2" />
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                    <input type="file" onChange={this.handleTransferImageChange} ref={fileTransferInput} />
                    <div className={"img-circle"}>
                      <img className="w-100" src={this.state.imageTransferPreviewUrl} alt={this.state.selectedTransferFile} />
                    </div>
                    <div>
                      {this.state.selectedTransferFile === null ? (
                        <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick('transfer')}>
                          {"Add Photo"}
                        </Button>
                      ) : (
                        <span>
                          <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick('transfer')}>
                            Change
                          </Button>
                          {null}
                          <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove('transfer')}>
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
        </ExampleWrapperSimple>
      </Animated>
    )
  }
  handleDeactive = (id, status) => {
    let switchStatus = "";
    if (status == true) {
      switchStatus = "Student Deactivated";
    }
    else {
      switchStatus = "Student Activated Successfully";
    }
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      id_student: id,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('StudentDetails/deleteStudent', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{switchStatus}</h4>
              </div>
            </Dialog>
          ),
        });

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    }).catch(error => {
      alert(error);
    });
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return this.studentProfiling();
      case 1:
        return this.siblingProfiling();
      case 2:
        return this.parentsProfiling();
      case 3:
        return this.AcademicProfiling();
      case 4:
        return this.feeConfiguration();
      case 5:
        return this.attachments();
      default:
        return this.studentProfiling();
    }
  }


  handleStep = (step) => {
    this.setState({ activeStep: step });
  }



  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
    this.props.title(this.state.steps[this.state.activeStep + 1]);
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
    this.props.title(this.state.steps[this.state.activeStep - 1]);
  };

  getAllBoardDetails() {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('boards/get_data', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        if (response.data) {
          this.setState({ boardDetails: response.data });
        }
      }
    }).catch(error => {
      alert("error");

    });
  }

  getStandardSectionDetails() {
    const postData = {
      count: "student",
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear
    };
    new Service().apiCall('ClassDetails/getData', postData).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != '') {
        var lStandardSections = [];
        var lBoardDetails = [];
        response.data.forEach(element => {
          if (lStandardSections[element.standard_id]) {
            var lSection = {};
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.active_subject_count = element.active_subject_count;
            lSection.fee_remain_count = element.feeremaindetails;
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
            lSection.active_subject_count = element.active_subject_count;
            lSection.fee_remain_count = element.feeremaindetails;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);

            lStandardSections[element.standard_id] = lStandard;

          }

        });
        let data = [];
        lStandardSections.forEach((element, index) => {
          data.push({ id: index, value: element.standard_name });
        });
        console.log(data);
        this.setState({ classwiseSections: lStandardSections, standardSections: response.data, filterSections: response.data, textSuggestions: data });
      }
    }).catch(error => {
      alert(error);

    });

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
  //       console.log(response.data)
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
  //     this.setState({callTable:true});
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }
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
  //   new Service().apiCall('students/getTableData', postData).then(response => {
  //     if (response.status == 200 && response.data != '') {
       
  //       // this.setState({Header:response.data.Header,invisible:response.data.invisible});
  //       const newArr = response.data.initial_data.map(v => ({ ...v, editable: false }));
  //       if (this.state.showStatus == 'all') {
  //         this.setState({ studentData: newArr, studentSuggestions: newArr,Header:response.data.Header[0],invisible:response.data.invisible[0] });
  //       }
  //       else {
  //         var newArray = newArr.filter(x => x.status == this.state.showStatus);
  //         this.setState({ studentData: newArray, studentSuggestions: newArray,Header:response.data.Header[0],invisible:response.data.invisible[0] });
  //       }
  //     } else {
  //       this.setState({ studentData: [],Header:[],invisible:[] });
  //     }
  //     this.setState({callTable:true});
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }
  getStudentDetails = (id, id_board, id_academicyear) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      standard_id: id ? id : '',
      id_board: id_board ? id_board : this.state.selectedBoard,
      id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
    };
    new Service().laravelTmp('table-Data/Module', postData).then(response => {
      if (response.status == 200 && response.data != '') {
       console.log(response.data);
        // this.setState({Header:response.data.Header,invisible:response.data.invisible});
        const newArr = response.data.map(v => ({ ...v, editable: false }));
        if (this.state.showStatus == 'all') {
          this.setState({ studentData: newArr, studentSuggestions: newArr });
        }
        else {
          var newArray = newArr.filter(x => x.status == this.state.showStatus);
          this.setState({ studentData: newArray, studentSuggestions: newArray});
        }
      } else {
        this.setState({ studentData: [] });
      }
      this.setState({callTable:true});
    }).catch(error => {
      console.log(error);
    });
  }
  getStudentColumns = (id, id_board, id_academicyear) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      standard_id: id ? id : '',
      id_board: id_board ? id_board : this.state.selectedBoard,
      id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
    };
    new Service().laravelTmp('table-Columns/Module', postData).then(response => {
      if (response.status == 200 && response.data != '') {
       console.log(response.data);
       
        
          this.setState({ studentColumns: response.data });

        
       
       
      } else {
        this.setState({ studentColumns: [] });
      }
      
    }).catch(error => {
      console.log(error);
    });
  }

  handleSelecteSidebardSection = (id, name) => {
    console.log(id + name);
    this.setState({ selectedStandardId: id, selectedSidebarSection: name, allStudents: false, searchStudent: false, activeSuggestion: 0, filteredSuggestions: [], selectedStudentId: '', customAssignInput: "", customAssignStudents: [] });
    this.getStudentDetails(id, this.state.selectedBoard, this.state.selectedAcademicYear);
  }

  getTotalStudentCount = (count) => {
    console.log("c" + count);
    this.setState({ TotalStudentCount: count })
  }
  viewSidebarStudentClass=(state)=>{
    this.setState({viewSidebarStudentClass:state});
  }

  sidebarStandardSections = () => {
    return (
      <StandardSectionsList
        board_id={this.state.selectedBoard}
        type="sidebar"
        viewMapped={true}
        viewcount="student"
        institute_id={this.state.selectedInstitutionId}
        academic_id={this.state.selectedAcademicId}
        active={this.state.searchStudent || this.state.allStudents ? true : false}
        
        totalStudentCount={this.getTotalStudentCount}
        handleSelectedSection={this.handleSelecteSidebardSection}
        {...this.props}
      />
    )
  }

  componentDidMount() {
    console.log(this.props);
    this.getAllBoardDetails();
    this.getStandardSectionDetails();
    this.getStudentDetails('', this.props.data.selectedBoard, this.state.selectedAcademicYear);
    this.getStudentColumns();
  }

  render() {

    const width40p = (window.innerWidth) * (40 / 100) + "px";
    const width60p = (window.innerWidth) * (60 / 100) + "px";
    return (
      <Fragment>
        {this.state.basicNotify}
        <Grid container spacing={2} className="sliderDiv">
          {this.state.viewSidebarStudentClass != true &&
            <Grid item xs={12} md={1} lg={1} className="ml-5">
              <Fab size="medium" aria-label="edit" onClick={() => this.setState({ viewSidebarStudentClass: true })}>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={() => { this.setState({ viewSidebarStudentClass: true }); this.getStudentKeys() }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Fab>
            </Grid>
          }
          {this.state.viewSidebarStudentClass &&
            <Grid item xs={12} md={4} lg={3}>
              <Card className="card-box ml-4 mb-4">
                <div className="text-center">
                  <div className="pt-1">

                    <List className="py-2">
                      <ListItem button className={this.state.selectedStandardId == '' && this.state.searchStudent ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.getStudentDetails('', this.state.selectedBoard, this.state.selectedAcademicYear); this.setState({ searchStudent: true, allStudents: false, selectedStandardId: '' }) }}>
                        <span>Search Student</span>
                      </ListItem>
                      <ListItem button className={this.state.selectedStandardId == '' && this.state.allStudents ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.getStudentDetails('', this.state.selectedBoard, this.state.selectedAcademicYear); this.setState({ searchStudent: false, allStudents: true, selectedStandardId: '' }) }}>
                        <span>All Students</span>
                        <span className="ml-auto badge badge-warning">{this.state.TotalStudentCount}</span>
                      </ListItem>
                      <Divider />
                      {this.sidebarStandardSections()}
                    </List>
                  </div>
                </div>
              </Card>
            </Grid>
          }
          <Grid item xs={12} md={8} lg={9}>
            {this.state.searchStudent && <Grid container spacing={4}>
              <Grid item xs={12} md={8} lg={3}></Grid>
              <Grid item xs={12} md={8} lg={6}>
                <Autocomplete1
                  type="student"
                  SearchPlaceholderText="Enter name and select from suggestions"
                  suggestions={this.state.studentSuggestions}
                  onSelected={this.handleStudentSearch}
                  {...this.props}
                />
              </Grid>
            </Grid>}
            {!this.state.searchStudent &&
              <Grid container spacing={4}>
                <Grid item xs={12} md={8} lg={1}></Grid>
                <Grid item xs={12} md={8} lg={10}>
                 
                    {/* <DynamicTable properties={tables.tables} />, */}
                   {this.state.callTable && this.state.studentColumns &&
                    <DynamicTable2 
                    type={'api'}//custom/api/model
                    modelName={'Module'}//model name
                    URL={this.state.URL}
                    Tabledata={this.state.studentData} 
                    TableColumns={this.state.studentColumns}
                    Header={this.state.Header} 
                    invisible={this.state.invisible}
                    handleDeactive={this.handleDeactive}
                   
                    title={'Students List'}
                    viewSidebarStudentClass={this.viewSidebarStudentClass}
                   
                     />
                   }

                  
                  {/* </Card> */}
                </Grid>
              </Grid>}

          </Grid>
        </Grid>
        <Drawer

          anchor="right"
          open={this.state.viewStudentColumnPanel}
          variant="temporary"
          elevation={4}
          onClose={() => this.setState({ viewStudentColumnPanel: false })}>
          <Box className={"app-header-drawer bgColor"} style={{ width: width60p }}>
            <PerfectScrollbar>

              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => this.setState({ viewStudentColumnPanel: false })} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4">
                    
                    Student Demography Table{' ' + this.state.selectedSidebarSection!= undefined ? this.state.selectedSidebarSection : ''}
                  </Typography>
                </Toolbar>
              </AppBar>
        
              <div className="m-20">
                <Card className="card-box  mb-4 p-4">
                  <Grid container spacing={2} className="">
                    <Grid xs={12} sm={12} md={1}></Grid>
                    {this.state.Header &&
                    <Grid xs={12} sm={12} md={8} className="pl-1 pr-2  autocompleteDiv customChip">


                      <Autocomplete
                        multiple

                        options={this.state.columnKey}
                        variant="outlined"
                        className="inputTag"

                        value={this.state.ColumnsDataAC}
                        onChange={(event, newValue) => this.searchStudentColumns(newValue)}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        required
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="inputTag"
                            label="Search Columns"

                          />
                        )}
                      />


                    </Grid>
                    }
                    <Grid xs={12} sm={12} md={1}></Grid>
                    <Grid xs={12} sm={12} md={2} className="mt-1">
                      <Fab size="medium" className="customNavBtn" aria-label="edit" onClick={() => this.setState({ viewStudentColumnPanel: false })}>
                        <NavigateNext />
                      </Fab>

                    </Grid>
                  </Grid>
                </Card>
              </div>
            
            </PerfectScrollbar>
          </Box>
        </Drawer>


      </Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
