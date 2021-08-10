import React, { Fragment } from 'react';
import "../../../../assets/custom.scss";
import { Animated } from "react-animated-css";
import {
  FormControl, FormControlLabel, Grid, Radio, Dialog, Card, TextField, InputAdornment, Button, DialogContent, DialogActions, FormLabel, MenuItem,
  Switch, Tooltip, Drawer, Box, AppBar, Toolbar, IconButton, Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import { PageTitle } from '../../../../layout-components';
import ClearIcon from '@material-ui/icons/Clear';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import Config from '../../../../config';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';

import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable1 from 'react-draggable';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ReactTable from 'react-table-6';
import ViewIcon from "@material-ui/icons/Visibility";
import { DragDropContext,Droppable,Draggable  } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

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

class AcademicSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateData: 0,
      name: '',
      id: '',
      type: 'annual',
      academicData: false,
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      semesterHolders: [{ name: '', start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD") }],
      trimesterHolders: [{ name: '', start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD") }],
      annualHolders: [],
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      CourseDataid: [],
      preSemesterHolders: [],
      academicDataView: [],
      TermViewId: [],
      courseId: '',
      calendarTypeNew: "term",
      calendarType: 'new',
      preAcademic: 0,
      open: false,
      characters:''
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
      this.setState({ basicNotify: false });
      // window.location.reload()
    }, 2000)
  }
  PaperComponent(props) {
    return (
      <Draggable1 handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable1>
    );
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleCalendarTypeChangedNew = (value) => {
    this.setState({ calendarTypeNew: value });
  };

  handleAnnualChanged = (value) => {
    this.setState({ annualSelected: value });
  };
  handleCalendarTypeChanged = (value) => {
    this.setState({ calendarType: value, semesterHolders: this.state.preSemesterHolders });
  };
  handleSemesterChanged = (value) => {
    this.setState({ semesterSelected: value });
  };
  handleTrimesterChanged = (value) => {
    this.setState({ trimesterSelected: value });
  };
  addSemesterHolder = () => {
    let lsemesterHolders = this.state.semesterHolders;
    let lSemsters = {};
    // lSemsters.id = 1000+lsemesterHolders.length;
    // lSemsters.id=lSemsters.id.toString();
    lSemsters.id = '';
    lSemsters.name = '';
    lSemsters.start_date = new Date();
    lSemsters.end_date = new Date();
    // var someDate = new Date();
    // var numberOfDaysToAdd = 365;
    // someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
    // lSemsters.end_date = someDate;

    lsemesterHolders.push(lSemsters);
    console.log({lsemesterHolders});
    this.setState({ semesterHolders: lsemesterHolders });
  }
  removeSemesterHolder(i) {
    const { semesterHolders } = this.state;
    this.setState({
      semesterHolders: semesterHolders.filter((holder, index) => index !== i),
    });
  }
  addTermHolder = () => {
    let lsemesterHolders = this.state.TermViewId;
    let lSemsters = {};
    lSemsters.id = '';
    lSemsters.name = '';
    lSemsters.start_date = new Date();
    lSemsters.end_date = new Date();
    // var someDate = new Date();
    // var numberOfDaysToAdd = 365;
    // someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
    // lSemsters.end_date = someDate;

    lsemesterHolders.push(lSemsters);
    this.setState({ TermViewId: lsemesterHolders });
  }
  removeTermHolder(i) {
    const { TermViewId } = this.state;
    this.setState({
      TermViewId: TermViewId.filter((holder, index) => index !== i),
    });
  }
  addTrimesterHolder = () => {
    let ltrimesterHolders = this.state.trimesterHolders;
    let lTrimesters = {};
    lTrimesters.id = '';
    lTrimesters.name = '';
    lTrimesters.start_date = new Date();
    lTrimesters.end_date = new Date();
    ltrimesterHolders.push(lTrimesters);
    this.setState({ trimesterHolders: ltrimesterHolders });
  }
  removeTrimesterHolder(i) {
    const { trimesterHolders } = this.state;
    this.setState({
      trimesterHolders: trimesterHolders.filter((holder, index) => index !== i),
    });
  }

  handleSemesterData = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.semesterHolders;
    lSemesterHolders[pIndex][inputName] = pValue;
    this.setState({ semesterHolders: lSemesterHolders });
  }
  handleTermData = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.TermViewId;
    lSemesterHolders[pIndex][inputName] = pValue;
    this.setState({ TermViewId: lSemesterHolders });
  }

  handleTrimesterData = (pIndex, inputName, pValue) => {
    let lTrimesterHolders = this.state.trimesterHolders;
    lTrimesterHolders[pIndex][inputName] = pValue;
    this.setState({ trimesterHolders: lTrimesterHolders });
  }
  handleAnnualData = (value) => {
    this.setState({ name: value, type: 'annual' });
  }
  handleStartDate = (startdate) => {
    this.setState({ start_date: startdate })
  };
  handleEndDate = (enddate) => {
    this.setState({ end_date: enddate })
  };
  handleSemStartDate = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.semesterHolders;
    // lSemesterHolders[pIndex][inputName] = pValue?pValue.format('YYYY-MM-DD'):'';
    lSemesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');
    this.setState({ semesterHolders: lSemesterHolders });
  }
  handleSemEndDate = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.semesterHolders;

    lSemesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');


    moment(pValue).format('YYYY-MM-DD') > moment(lSemesterHolders[pIndex]['start_date']).add(32, 'days').format('YYYY-MM-DD') &&
      moment(pValue).format('YYYY-MM-DD') <= moment(lSemesterHolders[pIndex]['start_date']).add(365, 'days').format('YYYY-MM-DD') &&
      this.setState({ semesterHolders: lSemesterHolders });
  }
  handleTermStartDate = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.TermViewId;
    // lSemesterHolders[pIndex][inputName] = pValue?pValue.format('YYYY-MM-DD'):'';
    lSemesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');
    this.setState({ TermViewId: lSemesterHolders });
  }
  handleTermEndDate = (pIndex, inputName, pValue) => {
    let lSemesterHolders = this.state.TermViewId;

    lSemesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');


    moment(pValue).format('YYYY-MM-DD') > moment(lSemesterHolders[pIndex]['start_date']).add(32, 'days').format('YYYY-MM-DD') &&
      moment(pValue).format('YYYY-MM-DD') <= moment(lSemesterHolders[pIndex]['start_date']).add(365, 'days').format('YYYY-MM-DD') &&
      this.setState({ TermViewId: lSemesterHolders });
  }
  handleTriStartDate = (pIndex, inputName, pValue) => {
    let lTrimesterHolders = this.state.trimesterHolders;
    lTrimesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');
    this.setState({ trimesterHolders: lTrimesterHolders });
  }
  handleTriEndDate = (pIndex, inputName, pValue) => {
    let lTrimesterHolders = this.state.trimesterHolders;
    lTrimesterHolders[pIndex][inputName] = moment(pValue).format('YYYY-MM-DD');
    this.setState({ trimesterHolders: lTrimesterHolders });
  }


  getAcademicSettings(id_course) {
    const postData = {
      id_academicyear: this.props.data.selectedAcademicId,
      id_board: this.props.data.selectedBoardId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_course: id_course,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        // this.setState({ updateData:1,academicData:true,id:response.data.annual.id,type:response.data.annual.type,name:response.data.annual.name,start_date:response.data.annual.start_date,end_date:response.data.annual.end_date, 
        //   semesterHolders:response.data.term?response.data.term:[{name:'',start_date:moment().format("YYYY-MM-DD"),end_date:moment().format("YYYY-MM-DD")}], trimesterHolders:response.data.trimester});
        this.setState({
          updateData: 1, academicData: true,
          semesterHolders: response.data.term ? response.data.term : [{ name: '', start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD") }]
        });

        console.log(this.state.academicData);
      } else {
        this.setState({
          updateData: 0, academicData: false
        });
      }
    }).catch(error => {
      console.log(error)

    });
  }
  getPreAcademicSettingsCount(id_course) {
    const postData = {
      id_academicyear: this.props.data.selectedAcademicId,
      id_board: this.props.data.selectedBoardId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_course: id_course,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/checkPreAcademic', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        //  console.log(JSON.stringify(response.data)+'len '+response.data.length);
        this.setState({ preAcademic: 1, preSemesterHolders: response.data.term });
      } else {
        this.setState({
          preAcademic: 0, preSemesterHolders: []
        });
      }
    }).catch(error => {
      console.log(error)

    });
  }

  getPreAcademicDataView() {
    const postData = {
      id_academicyear: this.props.data.selectedAcademicId,
      id_board: this.props.data.selectedBoardId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,

      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/academicDataView', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        //  console.log(JSON.stringify(response.data)+'len '+response.data.length);
        this.setState({ academicDataView: response.data });
      } else {
        this.setState({
          academicDataView: []
        });
      }
    }).catch(error => {
      console.log(error)

    });
  }
  getAcademicDataViewID(id_course, id_academicyear) {
    this.setState({ Termid_academicyear: id_academicyear, Termid_course: id_course });
    const postData = {
      id_academicyear: id_academicyear,
      id_board: this.props.data.selectedBoardId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_course: id_course,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/getData', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        //  console.log(JSON.stringify(response.data)+'len '+response.data.length);
        this.setState({ academicDataViewID: response.data, TermViewId: response.data.term ? response.data.term : [{ name: '', start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD") }] });
      } else {
        this.setState({
          academicDataViewID: [], TermViewId: []
        });
      }
    }).catch(error => {
      console.log(error)

    });
  }

  insertSettings = () => {
    const postData = {
      type: this.state.type,
      id: this.state.id,
      name: this.state.name,
      update: this.state.updateData,
      start_date: moment(this.state.start_date).format("YYYY-MM-DD"),
      end_date: moment(this.state.end_date).format("YYYY-MM-DD"),
      semesterHolders: this.state.semesterHolders,
      trimesterHolders: this.state.trimesterHolders,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_academicyear: this.props.data.selectedAcademicId,
      id_board: this.props.data.selectedBoardId,
      id_course: this.state.courseId,
      calendarType: this.state.calendarType,
      calendarTypeNew: this.state.calendarTypeNew,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/insertData', postData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      console.log(response);

      if (response.status == 200 && response.data != '') {
        if (response.data == 202) {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Last academic year settings do not exist. Please create New </h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
            //   window.location.reload()
          }, 2000)
        }
        else {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Settings Updated</h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
            window.location.reload()
          }, 2000)
        }
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");
    });
  }
  insertSettingsTermId = () => {
    const postData = {
      type: this.state.type,
      id: this.state.id,
      name: this.state.name,
      update: this.state.updateData,
      start_date: moment(this.state.start_date).format("YYYY-MM-DD"),
      end_date: moment(this.state.end_date).format("YYYY-MM-DD"),
      semesterHolders: this.state.TermViewId,

      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_academicyear: this.state.Termid_academicyear,
      id_board: this.props.data.selectedBoardId,
      id_course: this.state.Termid_course,
      calendarType: this.state.calendarType,
      calendarTypeNew: this.state.calendarTypeNew,
      token: "abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('AcademicSettings/insertData', postData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      console.log(response);

      if (response.status == 200 && response.data != '') {
        if (response.data == 202) {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Last academic year settings do not exist. Please create New </h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
            //   window.location.reload()
          }, 2000)
        }
        else {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Settings Updated</h4>
                </div>
              </Dialog>
            ),
          });
          setTimeout(() => {
            this.setState({ basicNotify: false });
            window.location.reload()
          }, 2000)
        }
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");
    });
  }
  getCourseInfo() {
    const postData = {
      id: this.props.data.selectedInstitutionId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      boardId: this.props.data.selectedBoardId,

      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/getCourseInfo', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        console.log(response)
        if (response.data) {
          let data = [];



          this.setState({ CourseDataid: response.data });
        }
      } else {
        this.setState({ CourseDataid: [] });
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
  deleteTermHolder = (id) => {
    this.handleClose();

    let newId = this.state.Termid;
    const postData = {
      id: newId,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      boardId: this.props.data.selectedBoardId,

      token: "abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('AcademicSettings/deleteTermHolder', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        console.log(response)
        if (response.data) {
          let data = [];

          this.getAcademicSettings(this.state.courseId);

          // this.setState({ CourseDataid: response.data });
        }
      } else {
        // this.setState({CourseDataid:[]});
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
  handleCourseDataid = (inputName, pValue) => {


    this.setState({ courseId: pValue });
    this.getAcademicSettings(pValue);
    this.getPreAcademicSettingsCount(pValue);


  }
   handleOnDragEnd=(result)=> {
     console.log(result);
    if (!result.destination) return;
     let items = this.state.semesterHolders;
const [reorderedItem] = items.splice(result.source.index, 1);
items.splice(result.destination.index, 0, reorderedItem);

  this.setState({semesterHolders:items});
  }

  componentDidMount() {
    // this.getAcademicSettings();
    this.getCourseInfo();
    this.getPreAcademicDataView();
  }

  render() {
    const width = window.innerWidth;
    const width40p = width * (40 / 100) + "px";
    return (
      <Fragment>
        {this.state.basicNotify}

        <Animated animationIn="slideInRight" animationOut="slideOutLeft">
          <PageTitle
            onSelectedNav={this.onSelected}
            titleHeading="Academic Calendar Settings"
            titleDescription=""
            {...this.props}
          />
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} lg={8} className="py-1 ">
              <Card className="card-box my-2 px-2 pt-2 pb-1">

                <div className="card-header">
                  <div className="card-header--title">
                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                      Set New Calender
                    </h4>
                  </div>
                </div>
                <Grid container spacing={4}>

                  <Grid item xs={12} md={2} lg={2}>
                  </Grid>
                  <Grid item xs={12} md={5} lg={3}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" className="pt-3 pb-3" style={{ color: 'black' }}><h5>Select Course :</h5></FormLabel>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={5} lg={5} className=" my-2 px-2 pt-3 pb-3">
                    <FormControl fullWidth>
                      <TextField
                        // id="outlined-select-currency"
                        select
                        label="Select Course"
                        variant="outlined"
                        value={this.state.courseId}
                        onChange={(event) =>
                          this.handleCourseDataid("Course", event.target.value)
                        }

                      >

                        {this.state.CourseDataid.map(option => (
                          <MenuItem key={option.course} value={option.id} id={option.course}>
                            {option.course}
                          </MenuItem>
                        ))}
                      </TextField>

                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          {this.state.courseId &&
            !this.state.academicData && this.state.preAcademic > 0 &&
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} lg={8} className="py-1 text-center">
                <Card className="card-box my-2 px-2 pt-2 pb-1">
                  {/* <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.calendarType === "new"}
                          onChange={() => this.handleCalendarTypeChanged("new")}
                          value="new"
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                     
                      label="Create new"
                    /> */}
                  {this.state.preAcademic > 0 &&
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.calendarType === "copy"}
                          onChange={() => this.handleCalendarTypeChanged("copy")}
                          value="copy"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }

                      label="Copy from last academic year"
                    />
                  }
                </Card>
              </Grid>
            </Grid>}
          {this.state.courseId &&
            (this.state.calendarType == "new" || this.state.academicData) &&
            <div>
              <>
                {/* <Grid container spacing={2} justify="center">
        <Grid item xs={12} lg={8} className="py-1 text-center">
        <Card className="card-box my-2 px-2 pt-2 pb-1">
                 <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.calendarTypeNew === "anual"}
                          onChange={() => this.handleCalendarTypeChangedNew("anual")}
                          value="anual"
                          name="radio button enabled"
                          aria-label="A"
                        />
                      }
                     
                      label="Anual"
                    />
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.calendarTypeNew === "semester"}
                          onChange={() => this.handleCalendarTypeChangedNew("semester")}
                          value="semester"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                     
                      label="Semester"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.calendarTypeNew === "trimester"}
                          onChange={() => this.handleCalendarTypeChangedNew("trimester")}
                          value="trimester"
                          name="radio button enabled"
                          aria-label="B"
                        />
                      }
                     
                      label="Trimester"
                    />
        </Card>  
        </Grid>
   </Grid>
      */}
                <Grid container spacing={2} justify="center">
                  <Grid item xs={12} lg={8} className="py-1 text-center">
                    <Card className="card-box my-2 p-2">
                      {this.state.calendarTypeNew == "anual" &&
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={12} lg={12} className="py-1 text-center">

                            <Card className="card-box my-2 px-2 pt-2 pb-1">
                              <Grid container>
                                <Grid item xs={12} sm={10} md={3} style={{ margin: 'auto' }}>
                                  <h6 className="headingStyle" style={{ margin: 0 }}>Annual Calendar</h6>
                                </Grid>
                                <Grid item xs={12} sm={10} md={3} className="outlinedInput">
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off'
                                    }}
                                    className="m-2"
                                    id="type-name"
                                    value={this.state.name}
                                    shrink={true}
                                    label="Type Name"
                                    type="search"
                                    onChange={(event) => this.handleAnnualData(event.target.value)}
                                    variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} className="pickerGrid">
                                  <FormControl fullWidth>

                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                      <KeyboardDatePicker
                                        className="m-2"
                                        autoOk={true}
                                        id="start-date"
                                        label="Start Date"
                                        inputVariant="outlined"
                                        format="MM/dd/yyyy"
                                        value={this.state.start_date}
                                        onChange={this.handleStartDate}
                                        KeyboardButtonProps={{
                                          'aria-label': 'change date',
                                        }}
                                      />
                                    </MuiPickersUtilsProvider>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} className="pickerGrid">
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      className="m-2"
                                      autoOk={true}
                                      id="end-date"
                                      label="End Date"
                                      inputVariant="outlined"
                                      format="MM/dd/yyyy"
                                      value={this.state.end_date}
                                      onChange={this.handleEndDate}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                      }}
                                    />
                                  </MuiPickersUtilsProvider>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        </Grid>}
                      {this.state.calendarTypeNew == "semester" &&
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={12} lg={12} className="py-1 text-center">
                            <Card className="card-box my-2 px-2 pt-2 pb-1">
                              {this.state.semesterHolders.map((semesterHolder, idx) => (
                                <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                                  <Grid item xs={12} sm={10} md={2} style={{ margin: 'auto' }}>
                                    <h6 className="headingStyle" style={{ margin: 0 }}>Semester {idx + 1}</h6>
                                  </Grid>

                                  <Grid item xs={12} sm={10} md={3}>
                                    <TextField
                                      inputProps={{
                                        autoComplete: 'off'
                                      }}
                                      className="m-2"
                                      id={"semester" + idx}
                                      value={semesterHolder.name}
                                      label="Type Name"
                                      type="search"
                                      onChange={(event) => this.handleSemesterData(idx, "name", event.target.value)}
                                      variant="outlined" />
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"start" + idx}
                                          label="Start Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.start_date}
                                          onChange={(event) => this.handleSemStartDate(idx, "start_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"end" + idx}
                                          label="End Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.end_date}
                                          // onChange={this.handleSemEndDate.bind(this,idx,"end_date")}   
                                          onChange={(event) => this.handleSemEndDate(idx, "end_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                    {idx == 0 ?
                                      <div className="addHolderStyle"><FormControl fullWidth >
                                        <TextField
                                          disabled={this.state.editStudent ? false : true}
                                          id={"add" + idx}
                                          onKeyPress={(data) => {
                                            if (data.charCode === 13) {
                                              this.addSemesterHolder();
                                            }
                                          }}
                                          className="m-2"
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
                                          onClick={() => { this.addSemesterHolder(); }}
                                          variant="outlined" />
                                      </FormControl></div>
                                      :
                                      <div className="removeHolderStyle"> <FormControl fullWidth>
                                        <TextField
                                          className="m-2"
                                          onKeyPress={(data) => {
                                            if (data.charCode === 13) {
                                              this.removeSemesterHolder(idx);
                                            }
                                          }}
                                          id={"remove" + idx}
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
                                          onClick={() => this.removeSemesterHolder(idx)}
                                          variant="outlined" />
                                      </FormControl></div>}
                                  </Grid>
                                </Grid>

                              ))}
                            </Card>
                          </Grid>
                        </Grid>
                      }
                      {this.state.calendarTypeNew == "trimester" &&
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={12} lg={12} className="py-1 text-center">
                            <Card className="card-box my-2 px-2 pt-2 pb-1">
                              {this.state.trimesterHolders.map((trimesterHolder, idx) => (
                                <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                                  <Grid item xs={12} sm={10} md={2} style={{ margin: 'auto' }}>
                                    <h6 className="headingStyle" style={{ margin: 0 }}>Trimester {idx + 1}</h6>
                                  </Grid>

                                  <Grid item xs={12} sm={10} md={3}>
                                    <TextField
                                      inputProps={{
                                        autoComplete: 'off'
                                      }}
                                      className="m-2"
                                      id={"type" + idx}
                                      value={trimesterHolder.name}
                                      label="Type Name"
                                      type="search"
                                      onChange={(event) => this.handleTrimesterData(idx, "name", event.target.value)}
                                      variant="outlined" />
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"start_date" + idx}
                                          label="Start Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={trimesterHolder.start_date}
                                          onChange={this.handleTriStartDate.bind(this, idx, "start_date")}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"end-date" + idx}
                                          label="End Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={trimesterHolder.end_date}
                                          onChange={this.handleTriEndDate.bind(this, idx, "end_date")}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                    {idx == 0 ? <div className="addHolderStyle"><FormControl fullWidth >
                                      <TextField
                                        disabled={this.state.editStudent ? false : true}
                                        id={"add1" + idx}
                                        onKeyPress={(data) => {
                                          if (data.charCode === 13) {
                                            this.addTrimesterHolder();
                                          }
                                        }}
                                        className="m-2"
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
                                        onClick={() => { this.addTrimesterHolder(); }}
                                        variant="outlined" />
                                    </FormControl></div>
                                      :
                                      <div className="removeHolderStyle"> <FormControl fullWidth>
                                        <TextField
                                          className="m-2"
                                          onKeyPress={(data) => {
                                            if (data.charCode === 13) {
                                              this.removeTrimesterHolder(idx);
                                            }
                                          }}
                                          id={"remove1" + idx}
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
                                          onClick={() => this.removeTrimesterHolder(idx)}
                                          variant="outlined" />
                                      </FormControl></div>}
                                  </Grid>
                                </Grid>

                              ))}
                            </Card>
                          </Grid>
                        </Grid>
                      }
                      {this.state.calendarTypeNew == "term" &&
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={12} lg={12} className="py-1 text-center">
                          <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                <Droppable droppableId="characters">
                                {(provided) => (
                            <Card className="card-box my-2 px-2 pt-2 pb-1 characters"  {...provided.droppableProps} ref={provided.innerRef}>
                              
                              {this.state.semesterHolders.map((semesterHolder, idx) => (
                                <Draggable key={idx.toString()} draggableId={idx.toString()} index={idx}>
                                  {(provided) => (
                                <Grid container style={{ marginTop: 10, marginBottom: 10 }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto' }}>
                                  <DragIndicatorIcon/>
                                  </Grid>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto' }}>
                                    <h6 className="headingStyle" style={{ margin: 0 }}>Term {idx + 1}</h6>
                                  </Grid>

                                  <Grid item xs={12} sm={10} md={3}>
                                    <TextField
                                      inputProps={{
                                        autoComplete: 'off'
                                      }}
                                      className="m-2"
                                      id={"semester" + idx}
                                      value={semesterHolder.name}
                                      label="Type Name"
                                      type="search"
                                      onChange={(event) => this.handleSemesterData(idx, "name", event.target.value)}
                                      variant="outlined" />
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"start" + idx}
                                          label="Start Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.start_date}
                                          onChange={(event) => this.handleSemStartDate(idx, "start_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"end" + idx}
                                          label="End Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.end_date}
                                          // onChange={this.handleSemEndDate.bind(this,idx,"end_date")}   
                                          onChange={(event) => this.handleSemEndDate(idx, "end_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                    {semesterHolder.id ?

                                      <div className="addHolderStyle">
                                        <FormControl fullWidth >
                                          <TextField
                                            disabled={this.state.editStudent ? false : true}
                                            id={"add" + idx}
                                            onKeyPress={(data) => {
                                              if (data.charCode === 13) {
                                                // this.addSemesterHolder(); 
                                                this.handleClickOpen();
                                                this.setState({ Termid: semesterHolder.id });
                                                // this.deleteTermHolder(semesterHolder.id);
                                              }
                                            }}
                                            className="m-2"
                                            InputProps={{
                                              autoComplete: 'off',
                                              readOnly: true,
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <ClearIcon style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                                </InputAdornment>
                                              ),
                                            }}
                                            label="Rem"
                                            onClick={() => {
                                              this.handleClickOpen();
                                              this.setState({ Termid: semesterHolder.id });
                                              // this.deleteTermHolder(semesterHolder.id);
                                              // this.addSemesterHolder();
                                            }}
                                            variant="outlined" />
                                        </FormControl>
                                      </div>

                                      :
                                      (
                                        <div className="removeHolderStyle">
                                          {this.state.semesterHolders.length != 1 &&
                                            <FormControl fullWidth>
                                              <TextField
                                                className="m-2"
                                                onKeyPress={(data) => {
                                                  if (data.charCode === 13) {
                                                    this.removeSemesterHolder(idx);
                                                  }
                                                }}
                                                id={"remove" + idx}
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
                                                onClick={() => this.removeSemesterHolder(idx)}
                                                variant="outlined" />
                                            </FormControl>
                                          }
                                        </div>
                                      )
                                    }
                                  </Grid>
                                </Grid>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Card>
                                )}
                            </Droppable>
                              </DragDropContext>
                          </Grid>
                        </Grid>

                      }
                      <Grid container spacing={2} justify="center">
                        <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
                          <Button className="mr-2" variant="outlined" color="secondary" onClick={() => this.addSemesterHolder()}>
                            Add Term
                          </Button>
                          <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertSettings()}>Submit</Button>
                          {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
        Open form dialog
      </Button> */}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </>
            </div>}
          {this.state.courseId &&
            (this.state.calendarType == "copy") &&
            <div>
              <>
                <Grid container spacing={2} justify="center">
                  <Grid item xs={12} lg={8} className="py-1 text-center">
                    <Card className="card-box my-2 p-2">
                      {this.state.calendarTypeNew == "term" &&
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={12} lg={12} className="py-1 text-center">
                            <Card className="card-box my-2 px-2 pt-2 pb-1">
                              {this.state.semesterHolders.map((semesterHolder, idx) => (
                                <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                                  <Grid item xs={12} sm={10} md={2} style={{ margin: 'auto' }}>
                                    <h6 className="headingStyle" style={{ margin: 0 }}>Term {idx + 1}</h6>
                                  </Grid>

                                  <Grid item xs={12} sm={10} md={3}>
                                    <TextField
                                      inputProps={{
                                        autoComplete: 'off'
                                      }}
                                      className="m-2"
                                      id={"semester" + idx}
                                      value={semesterHolder.name}
                                      label="Type Name"
                                      type="search"
                                      onChange={(event) => this.handleSemesterData(idx, "name", event.target.value)}
                                      variant="outlined" />
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"start" + idx}
                                          label="Start Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.start_date}
                                          onChange={(event) => this.handleSemStartDate(idx, "start_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                    <FormControl fullWidth>

                                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                          className="m-2"
                                          autoOk={true}
                                          id={"end" + idx}
                                          label="End Date"
                                          inputVariant="outlined"
                                          format="MM/dd/yyyy"
                                          value={semesterHolder.end_date}
                                          // onChange={this.handleSemEndDate.bind(this,idx,"end_date")}   
                                          onChange={(event) => this.handleSemEndDate(idx, "end_date", event)}
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                    {semesterHolder.id ?

                                      <div className="addHolderStyle">
                                        <FormControl fullWidth >
                                          <TextField
                                            disabled={this.state.editStudent ? false : true}
                                            id={"add" + idx}
                                            onKeyPress={(data) => {
                                              if (data.charCode === 13) {
                                                // this.addSemesterHolder(); 
                                                this.handleClickOpen();
                                                this.setState({ Termid: semesterHolder.id });
                                                // this.deleteTermHolder(semesterHolder.id);
                                              }
                                            }}
                                            className="m-2"
                                            InputProps={{
                                              autoComplete: 'off',
                                              readOnly: true,
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <ClearIcon style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                                </InputAdornment>
                                              ),
                                            }}
                                            label="Rem"
                                            onClick={() => {
                                              this.handleClickOpen();
                                              this.setState({ Termid: semesterHolder.id });
                                              // this.deleteTermHolder(semesterHolder.id);
                                              // this.addSemesterHolder();
                                            }}
                                            variant="outlined" />
                                        </FormControl>
                                      </div>

                                      :
                                      (
                                        <div className="removeHolderStyle">
                                          {this.state.semesterHolders.length != 1 &&
                                            <FormControl fullWidth>
                                              <TextField
                                                className="m-2"
                                                onKeyPress={(data) => {
                                                  if (data.charCode === 13) {
                                                    this.removeSemesterHolder(idx);
                                                  }
                                                }}
                                                id={"remove" + idx}
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
                                                onClick={() => this.removeSemesterHolder(idx)}
                                                variant="outlined" />
                                            </FormControl>
                                          }
                                        </div>
                                      )
                                    }
                                  </Grid>
                                </Grid>

                              ))}
                            </Card>
                          </Grid>
                        </Grid>
                      }
                      <Grid container spacing={2} justify="center">
                        <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
                          <Button className="mr-2" variant="outlined" color="secondary" onClick={() => this.addSemesterHolder()}>
                            Add Term
                          </Button>
                          <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertSettings()}>Submit</Button>
                          {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
        Open form dialog
      </Button> */}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </>
            </div>
          }
          <div>
            <>
              <Grid container spacing={2} justify="center">
                <Grid item xs={12} lg={8} className="py-1">
                  <Card className="card-box my-2 p-2 customNoData">
                    <div className="card-header">
                      <div className="card-header--title">
                        <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                          View Calender
                        </h4>
                      </div>
                    </div>
                    <ReactTable

                      data={
                        this.state.academicDataView.map((original, key) => {
                          return ({
                            slno: key + 1,
                            id: original.id,
                            label: original.label,
                            course: original.course,

                            status: original.combination_status,



                            view: (
                              <div> <span style={{ marginLeft: '10px' }}> <Tooltip
                                id="tooltip-top"
                                title='View'
                                placement="top"
                              >
                                <Button style={{ padding: 0 }}
                                  simple
                                  onClick={() => { this.setState({ selectAcademicDataViewPanel: true, label: original.label, course: original.course }); this.getAcademicDataViewID(original.course_id, original.id_academicyear) }}
                                  color="secondary"
                                  className="edit"
                                >
                                  <ViewIcon />
                                </Button>
                              </Tooltip></span></div>
                            ),
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
                          Header: "Academic Year",
                          accessor: "label",
                          className: "text-left",
                          Filter: ({ filter, onChange }) => (
                            <TextField
                              inputProps={{
                                autoComplete: 'off'
                              }}
                              // id="standard"
                              value={filter ? filter.value : ''}
                              placeholder="Search Academic Year"
                              type="text"
                              onChange={event => onChange(event.target.value)}
                            />
                          )
                        },
                        {
                          Header: "Course",
                          accessor: "course",
                          className: "text-left",
                          Filter: ({ filter, onChange }) => (
                            <TextField
                              inputProps={{
                                autoComplete: 'off'
                              }}
                              // id="standard"
                              value={filter ? filter.value : ''}
                              placeholder="Search Course"
                              type="text"
                              onChange={event => onChange(event.target.value)}
                            />
                          )
                        },




                        {
                          Header: "View",
                          accessor: "view",
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
                  </Card>
                </Grid>
              </Grid>
            </>
          </div>

        </Animated>
        <div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            PaperComponent={this.PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              <h5>Delete</h5>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <h5 color="black">Are you sure you want to delete this Term setting?</h5>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleClose
                , this.deleteTermHolder
              } color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

        </div>






        <Drawer

          anchor="right"
          open={this.state.selectAcademicDataViewPanel}
          variant="temporary"
          elevation={4}
          onClose={() => this.setState({ selectAcademicDataViewPanel: false })}>
          <Box className={"app-header-drawer bgColor"} style={{ width: width }}>
            <PerfectScrollbar>

              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => this.setState({ selectAcademicDataViewPanel: false })} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4">
                    View Academic Calendar
                  </Typography>
                </Toolbar>
              </AppBar>
              <Grid container spacing={2} justify="center">
                <Grid item xs={12} lg={8} className="py-1 ">
                  <Card className="card-box my-5 px-2 pt-2 pb-1">

                    <div className="card-header">
                      <div className="card-header--title">
                        <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                          AY {this.state.label} Course {this.state.course}
                        </h4>
                      </div>
                    </div>
                    <Grid container spacing={2} justify="center">
                      <Grid item xs={12} lg={12} className="py-1 text-center">
                        <Card className="card-box my-2 px-2 pt-2 pb-1">
                          {this.state.TermViewId.map((semesterHolder, idx) => (
                            <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                              <Grid item xs={12} sm={10} md={2} style={{ margin: 'auto' }}>
                                <h6 className="headingStyle" style={{ margin: 0 }}>Term {idx + 1}</h6>
                              </Grid>

                              <Grid item xs={12} sm={10} md={3}>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off'
                                  }}
                                  className="m-2"
                                  id={"semester" + idx}
                                  value={semesterHolder.name}
                                  label="Type Name"
                                  type="search"
                                  onChange={(event) => this.handleTermData(idx, "name", event.target.value)}
                                  disabled={this.state.editStudent ? false : true}
                                  variant="outlined" />
                              </Grid>
                              <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                <FormControl fullWidth>

                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      className="m-2"
                                      autoOk={true}
                                      id={"start" + idx}
                                      label="Start Date"
                                      inputVariant="outlined"
                                      format="MM/dd/yyyy"
                                      value={semesterHolder.start_date}
                                      onChange={(event) => this.handleTermStartDate(idx, "start_date", event)}
                                      disabled={this.state.editStudent ? false : true}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                      }}
                                    />
                                  </MuiPickersUtilsProvider>
                                </FormControl>
                              </Grid>
                              <Grid xs={12} sm={12} md={3} className="pickerGrid">

                                <FormControl fullWidth>

                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      className="m-2"
                                      autoOk={true}
                                      id={"end" + idx}
                                      label="End Date"
                                      inputVariant="outlined"
                                      format="MM/dd/yyyy"
                                      value={semesterHolder.end_date}
                                      // onChange={this.handleSemEndDate.bind(this,idx,"end_date")}   
                                      onChange={(event) => this.handleTermEndDate(idx, "end_date", event)}
                                      disabled={this.state.editStudent ? false : true}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                      }}
                                    />
                                  </MuiPickersUtilsProvider>
                                </FormControl>
                              </Grid>
                              {this.state.editStudent &&
                                <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                  {semesterHolder.id ?

                                    <div className="addHolderStyle">
                                      <FormControl fullWidth >
                                        <TextField
                                          disabled={this.state.editStudent ? false : true}
                                          id={"add" + idx}
                                          onKeyPress={(data) => {
                                            if (data.charCode === 13) {
                                              // this.addSemesterHolder(); 
                                              this.handleClickOpen();
                                              this.setState({ Termid: semesterHolder.id });
                                              // this.deleteTermHolder(semesterHolder.id);
                                            }
                                          }}
                                          className="m-2"
                                          InputProps={{
                                            autoComplete: 'off',
                                            readOnly: true,
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <ClearIcon style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                              </InputAdornment>
                                            ),
                                          }}
                                          label="Rem"
                                          onClick={() => {
                                            this.handleClickOpen();
                                            this.setState({ Termid: semesterHolder.id });
                                            // this.deleteTermHolder(semesterHolder.id);
                                            // this.addSemesterHolder();
                                          }}
                                          variant="outlined" />
                                      </FormControl>
                                    </div>

                                    :
                                    (
                                      <div className="removeHolderStyle">
                                        {this.state.TermViewId.length != 1 &&
                                          <FormControl fullWidth>
                                            <TextField
                                              className="m-2"
                                              onKeyPress={(data) => {
                                                if (data.charCode === 13) {
                                                  this.removeTermHolder(idx);
                                                }
                                              }}
                                              id={"remove" + idx}
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
                                              onClick={() => this.removeTermHolder(idx)}
                                              disabled={this.state.editStudent ? false : true}
                                              variant="outlined" />
                                          </FormControl>
                                        }
                                      </div>
                                    )
                                  }
                                </Grid>
                              }
                            </Grid>

                          ))}
                        </Card>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} justify="center">
                      <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
                        {!this.state.editStudent &&
                          <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
                          </Button>
                        }
                        {this.state.editStudent &&
                          <>
                            <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>
                            <Button className="mr-2" variant="outlined" color="secondary" onClick={() => this.addTermHolder()}>
                              Add Term
                            </Button>
                            <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertSettingsTermId()}>Submit</Button>
                          </>
                        }
                        {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
        Open form dialog
      </Button> */}
                      </Grid>
                    </Grid>

                  </Card>
                </Grid>
              </Grid>


            </PerfectScrollbar>
          </Box>
        </Drawer>

      </Fragment>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToPros)(withRouter(AcademicSettings));
