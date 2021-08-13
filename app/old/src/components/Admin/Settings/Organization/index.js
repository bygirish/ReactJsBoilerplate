import React, { Fragment, createRef } from 'react';
import { PageTitle } from '../../../../layout-components';
import { Dialog, Grid, Drawer, ListItem, FormControlLabel, Switch, FormControl, CardContent, IconButton, Typography, AppBar, Divider, Card, MenuItem, Fab, CardActions, TextField, Button, Toolbar, Box, FormLabel, List, Tooltip, Slide, Checkbox, RadioGroup, Radio, InputAdornment, TabPanel, ButtonGroup, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, DialogContent, DialogActions } from '@material-ui/core';
import ReactTable from 'react-table-6';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import 'react-table-6/react-table.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Send from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import { Animated } from "react-animated-css";
import Edit from "@material-ui/icons/Edit";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from '@material-ui/icons/Close';
import Remove from "@material-ui/icons/Remove";
import ViewIcon from "@material-ui/icons/Visibility";
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import 'date-fns';
import moment from "moment";
import ViewInstitutions from '../Institutions/ViewInstitutions';
import defaultImage from "@assetss/images/placeholder.jpg";
// import defaultImage from  "@assets/images/placeholder.jpg";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
import Service from '@utils/Service.js';
import Config from '@src/config';
import { withStyles } from '@material-ui/core/styles';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Apicore from '@utils/Apicore.js';

const styles = theme => ({
  cssLabelRed: {
    color: 'red'
  },
  cssLabelBlue: {
    color: 'blue'
  },

  cssFocused: {},

  notchedOutlineRed: {
    borderColor: 'red !important'
  },
  notchedOutlineBlue: {
    borderColor: 'blue !important'
  },
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const fileInputRef = createRef();
const fileInput = React.createRef();
const fileInputRef1 = createRef();
const fileInput1 = React.createRef();


class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      dialogOpen: true,
      imagePreviewUrl: defaultImage,
      imagePreviewUrl1: defaultImage,
      name: '',
      orgInfo: {
        org_name: '', inst_name: '', inst_logo: '', inst_district: '', inst_state: '', inst_pincode: '', inst_address1: '', inst_address2: '', inst_taluk: '', inst_contact1: '', inst_contact2: '', inst_email1: '', inst_email2: '', inst_post_office: '',
        corp_district: '', corp_state: '', corp_pincode: '', corp_address1: '', corp_address2: '', corp_taluk: '', corp_contact1: '', corp_contact2: '', corp_email1: '', corp_email2: '', corp_post_office: ''
      },

      description: '',
      selectedFile: null,
      selectedFile1: null,
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      basicNotify: false,
      same_address: false,
      editStudent: false,
      pincodesArr: [],
      validatecolorEmail1: '',
      validatecolorEmail2: '',
      validatecolorContact1: '',
      validatecolorContact2: '',
      validatecolorCorpContact1: '',
      validatecolorCorpContact2: '',
      validatecolorCorpEmail1: '',
      validatecolorCorpEmail2: '',
      tasks: [],
    };
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }
  // getTasks=()=> {
  //   ApiCore.getAll().then((res) => {
  //     let arr = this._parseTasks(res.results.data);
  //     this.setState({tasks:arr});
  //   });
  // }

  // _parseTasks=(tasks)=> {
  //   return tasks.map((task) => {
  //     // Parse task information
  //     return task;
  //   });
  // }

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile: null
    });
    fileInput.current.value = null;
  };
  getAddressInfo(pincode, type) {
    let data = this.state.orgInfo;
    // data['inst_pincode'] = pincode;
    // console.log(pincode+type);
    this.setState({ data });
    // this.setState({ [type]: pincode });
    if (pincode && pincode.length == 6) {
      const postData = {
        pincode: pincode,
      }
      new Service().apiCall('Pincode/GetPincode', postData).then(response => {
        if (response.status == 200 && response.data != '') {
          if (response.data) {

            let newArr = response.data.filter(v => v.delivery == "Delivery");
            // console.log(newArr);
            this.setState({ pincodesArr: newArr, selectPOPanel: true, addressType: type })
          }
          else {
            this.setState({ pincodesArr: [] })
          }
        }
      }).catch(error => {
        //alert("error");  
      });
    }
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

  handleClick1 = () => {
    fileInput1.current.click();
  };
  handleRemove1 = () => {
    this.setState({
      imagePreviewUrl1: defaultImage, selectedFile1: null
    });
    fileInput1.current.value = null;
  };

  handleImageChange1 = event => {
    let file_size = event.target.files[0].size;
    if (file_size <= 6000) {
      // console.log(file_size);
      this.setState({
        selectedFile1: event.target.files[0]
      })
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          imagePreviewUrl1: reader.result
        });
      }
      reader.readAsDataURL(event.target.files[0])
    } else {

      this.setState({
        basicNotify: (
          <Dialog open={true}>
            <div className="text-center p-5">
              <h4 className="font-weight-bold">Please upload less than 5kb file</h4>
            </div>
          </Dialog>
        ),
      });
      setTimeout(() => {
        this.setState({ basicNotify: false });
      }, 2000)

    }
  };



  setDta = (name, value) => {
    let data = this.state.orgInfo;
    data[name] = value;
    this.setState({ data })
    if (name == 'inst_email1' || name == 'inst_email2' || name == 'corp_email1' || name == 'corp_email2') {

      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!filter.test(value)) {

        if (name == 'inst_email1') {
          this.setState({ validatecolorEmail1: 'red' });
        }
        if (name == 'inst_email2') {
          this.setState({ validatecolorEmail2: 'red' });
        }
        if (name == 'corp_email1') {
          this.setState({ validatecolorCorpEmail1: 'red' });
        }
        if (name == 'corp_email2') {
          this.setState({ validatecolorCorpEmail2: 'red' });
        }
      } else {

        if (name == 'inst_email1') {
          this.setState({ validatecolorEmail1: '' });
        }
        if (name == 'inst_email2') {
          this.setState({ validatecolorEmail2: '' });
        }
        if (name == 'corp_email1') {
          this.setState({ validatecolorCorpEmail1: '' });
        }
        if (name == 'corp_email2') {
          this.setState({ validatecolorCorpEmail2: '' });
        }
      }
    }
    else {
      // console.log('not checking');
    }
    if (name == 'inst_contact1' || name == 'inst_contact2' || name == 'corp_contact1' || name == 'corp_contact2') {
      console.log(value.length);
      if (value.length < 10) {
        if (name == 'inst_contact1') {
          this.setState({ validatecolorContact1: 'red' });
        }
        if (name == 'inst_contact2') {
          this.setState({ validatecolorContact2: 'red' });
        }
        if (name == 'corp_contact1') {
          this.setState({ validatecolorCorpContact1: 'red' });
        }
        if (name == 'corp_contact2') {
          this.setState({ validatecolorCorpContact2: 'red' });
        }
      }
      else {
        if (name == 'inst_contact1') {
          this.setState({ validatecolorContact1: '' });
        }
        if (name == 'inst_contact2') {
          this.setState({ validatecolorContact2: '' });
        }
        if (name == 'corp_contact1') {
          this.setState({ validatecolorCorpContact1: '' });
        }
        if (name == 'corp_contact2') {
          this.setState({ validatecolorCorpContact2: '' });
        }
      }
    }
    if (name == 'inst_pincode' || name == 'corp_pincode') {

      this.getAddressInfo(value, name);
    } else {
      // console.log('not pin' + name);
    }
  }


  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  }

  submit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('orgData', JSON.stringify(this.state.orgInfo));
    formData.append('org_logo', this.state.selectedFile);
    formData.append('fav_logo', this.state.selectedFile1);
    formData.append('id_user', this.props.data.UID);
    // console.log("test")
    // console.log(...formData);
    if (this.state.orgInfo.inst_contact1.length == 10 && this.state.orgInfo.inst_contact2.length == 10 && this.state.orgInfo.corp_contact1.length == 10 && this.state.orgInfo.corp_contact2.length == 10) {
      new Service().apiCall('AcademicSettings/updateOrgInfo', formData,
        {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
      ).then(response => {
        //  console.log(response);
        if (response.status == 200 && response.data != '') {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">Organization Details Updated</h4>
                </div>
              </Dialog>
            ),
          });
          this.storeOrganization();
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
            <div className="text-center p-5">
              <h4 className="font-weight-bold" style={{ color: 'red' }}>Contact Number length should be 10</h4>
            </div>
          </Dialog>
        ),
      });
      setTimeout(() => {

        this.setState({ basicNotify: false });

      }, 2000);
    }

  }

  storeOrganization = () => {
    let data = this.props.data;
    let updated = this.state.orgInfo;
    data.org_id = updated.org_id;
    data.org_name = updated.org_name;
    data.org_logo = updated.org_logo;
    data.inst_id = updated.inst_id;
    data.inst_logo = updated.inst_logo;
    data.inst_name = updated.inst_name;
    data.inst_district = updated.inst_district;
    data.inst_state = updated.inst_state;
    data.inst_pincode = updated.inst_pincode;
    data.inst_post_office = updated.inst_post_office;

    data.inst_taluk = updated.inst_taluk;
    data.inst_address1 = updated.inst_address1;
    data.inst_address2 = updated.inst_address2;
    data.inst_district = updated.inst_district;
    data.inst_state = updated.inst_state;
    data.inst_pincode = updated.inst_pincode;
    data.inst_contact1 = updated.inst_contact1;
    data.inst_contact2 = updated.inst_contact2;
    data.inst_email1 = updated.inst_email1;
    data.inst_email2 = updated.inst_email2;


    data.fav_logo = updated.fav_logo;
    data.corp_id = updated.corp_id;
    data.corp_logo = updated.corp_logo;
    data.corp_name = updated.corp_name;
    data.corp_district = updated.corp_district;
    data.corp_state = updated.corp_state;
    data.corp_pincode = updated.corp_pincode;
    data.corp_post_office = updated.corp_post_office;
    data.corp_taluk = updated.corp_taluk;
    data.corp_address1 = updated.corp_address1;
    data.corp_address2 = updated.corp_address2;
    data.corp_district = updated.corp_district;
    data.corp_state = updated.corp_state;
    data.corp_pincode = updated.corp_pincode;
    data.corp_contact1 = updated.corp_contact1;
    data.corp_contact2 = updated.corp_contact2;
    data.corp_email1 = updated.corp_email1;
    data.corp_email2 = updated.corp_email2;


    this.props.getOrganizationData(data);
  }

  getOrganizationData() {
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.state.selectedBoardId,
      id_academicyear: this.state.selectedAcademicYear,
    }
    new Service().apiCall('AcademicSettings/getOrgInfo', postData).then(response => {
      // console.log(response)
      if (response.status == 200 && response.data != '') {

        this.setState({ orgInfo: response.data, imagePreviewUrl: response.data.org_logo ? Config.path + "writable/uploads/organization_logo/" + response.data.org_logo : this.state.imagePreviewUrl1, selectedFile: response.data.org_logo, imagePreviewUrl1: response.data.fav_logo ? Config.path + "writable/uploads/fav_logo/" + response.data.fav_logo : this.state.imagePreviewUrl1, selectedFile1: response.data.fav_logo });

      }
    }).catch(error => {
      console.log(error)

    });
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
  replaceText = (str) => {
    let string = str.replace(" B.O", "");
    string = string.replace(" S.O", "");
    return string;
  }

  refreshData = () => {
    this.getExamProviders();
  }
  handleAddress = (status) => {
    let data = this.state.orgInfo;
    // data[name] = value;
    if (status == false) {
      data['corp_address1'] = this.state.orgInfo.inst_address1;
      data['corp_address2'] = this.state.orgInfo.inst_address2;
      data['corp_pincode'] = this.state.orgInfo.inst_pincode;
      data['corp_taluk'] = this.state.orgInfo.inst_taluk;
      data['corp_district'] = this.state.orgInfo.inst_district;
      data['corp_state'] = this.state.orgInfo.inst_state;
      data['corp_contact1'] = this.state.orgInfo.inst_contact1;
      data['corp_contact2'] = this.state.orgInfo.inst_contact2;
      data['corp_email1'] = this.state.orgInfo.inst_email1;
      data['corp_email2'] = this.state.orgInfo.inst_email2;
      data['corp_post_office'] = this.state.orgInfo.inst_post_office;
      // this.setState({orgInfo[corp_address1]:this.state.orgInfo.inst_address1,same_address:!status})
      this.setState({ data });
      this.setState({ same_address: !status });
    }
    else {
      data['corp_address1'] = '';
      data['corp_address2'] = '';
      data['corp_pincode'] = '';
      data['corp_taluk'] = '';
      data['corp_district'] = '';
      data['corp_state'] = '';
      data['corp_contact1'] = '';
      data['corp_contact2'] = '';
      data['corp_email1'] = '';
      data['corp_email2'] = '';
      data['corp_post_office'] = '';
      // this.setState({orgInfo[corp_address1]:this.state.orgInfo.inst_address1,same_address:!status})
      this.setState({ data });
      this.setState({ same_address: !status });
      // this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_city:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
    }
  }
  fillAddress = (po, taluk, district, state, event) => {


    event.preventDefault();
    let data = this.state.orgInfo;
    if (this.state.addressType == "inst_pincode") {
      data['inst_post_office'] = po;
      data['inst_taluk'] = taluk;
      data['inst_district'] = district;
      data['inst_state'] = state;

      this.setState({ data });
      this.setState({ selectPOPanel: false });
    }
    if (this.state.addressType == "corp_pincode") {

      data['corp_post_office'] = po;
      data['corp_taluk'] = taluk;
      data['corp_district'] = district;
      data['corp_state'] = state;

      this.setState({ data });
      this.setState({ selectPOPanel: false });
    }
    else {
      this.setState({ selectPOPanel: false });
      // this.setState({permanent_post_office:'',permanent_taluk:'',permanent_district:'',permanent_state:'', selectPOPanel:false});
    }
  }
  handleChangeAccordion = (value) => {
    if (this.state.activeAccordion === value) {
      this.setState({ activeAccordion: "", editStaff: false });
    }
    else {
      this.setState({ activeAccordion: value, editStaff: false });
    }
  }
  OrganizationProfile = () => {
    const { classes } = this.props;
    return (
      <Grid container spacing={2} justify="center" >
        <Grid item xs={12} md={12} lg={12}>
          <form
            onSubmit={this.submit.bind(this)}
            autoComplete="off">
            <Card className="card-box mb-4 pt-3 pb-3">
             
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} lg={3}>
                  <Card className="card-box ml-4 mb-4 p-2">
                    <Grid container style={{ height: '250px' }}>
                      <Grid item xs={12} sm={12} md={12}>
                        <h6 className="mt-2 text-center">Organization Logo</h6>
                        <FormControl fullWidth>
                          <div className="fileinput text-center">
                            <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                            <div className={"thumbnail"}>
                              <img style={{ maxHeight: 180, width: 'auto' }} src={this.state.imagePreviewUrl} alt="..." />
                            </div>
                            <div>
                              {this.state.editStudent && (
                                this.state.selectedFile === null ? (
                                  <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick()}>
                                    {"Select Logo"}
                                  </Button>
                                ) : (
                                  <span>
                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick()}>
                                      Change
                                    </Button>
                                    {null}
                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove()}>
                                      <i className="fas fa-times" /> Remove
                                    </Button>
                                  </span>
                                ))}
                            </div>
                          </div>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Card>

                  {/* <Grid item xs={12} md={12} lg={12}> */}
                  <Card className="card-box ml-4 mb-4 p-2">

                    <Grid container style={{ height: '200px' }}>
                      <Grid item xs={12} sm={12} md={12}>
                        <h6 className="mt-2 text-center">Fav Icon</h6>
                        <FormControl fullWidth>
                          <div className="fileinput text-center">
                            <input type="file" onChange={this.handleImageChange1} ref={fileInput1} />
                            <div className={"thumbnail"}>
                              <img style={{ maxHeight: 100, width: 'auto' }} src={this.state.imagePreviewUrl1} alt="..." />
                            </div>
                            <div>
                              {this.state.editStudent && (
                                this.state.selectedFile1 === null ? (
                                  <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick1()}>
                                    {"Select Logo"}
                                  </Button>
                                ) : (
                                  <span>
                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick1()}>
                                      Change
                                    </Button>
                                    {null}
                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove1()}>
                                      <i className="fas fa-times" /> Remove
                                    </Button>
                                  </span>
                                ))}
                            </div>
                          </div>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Card>

                  {/* </Grid>  */}
                </Grid>
                <Grid item xs={12} sm={12} md={9} className="margin-auto">
                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={10} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="document-type"
                          label="Organization Name"
                          type="search"
                          value={this.state.orgInfo.org_name}
                          onChange={(event) => this.setDta("org_name", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <Grid container  justify="center">
           <Grid item xs={12} sm={12} md={10} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  required
               className="m-2"
               id="document-type"   
               label="Instituition Name" 
               type="search" 
               value={this.state.orgInfo.inst_name}
               onChange={(event) => this.setDta("inst_name",event.target.value)}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid>
           </Grid> */}
                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={10} className="mt-3 p-2">
                      <div className="card-header--title font-size-md font-weight-bold ">
                        Registered Office
                      </div>
                    </Grid>
                  </Grid>


                  {/* <Grid container  justify="center">
           <Grid item xs={12} sm={12} md={5} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  required
               className="m-2"
               id="document-type"   
               label="Address 1" 
               type="search" 
               value={this.state.orgInfo.inst_address1}
               onChange={(event) => this.setDta("inst_address1",event.target.value)}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  required
               className="m-2"
               id="document-type"   
               label="Address 2" 
               type="search" 
               value={this.state.orgInfo.inst_address2}
               onChange={(event) => this.setDta("inst_address2",event.target.value)}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid>
           </Grid> */}
                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={10} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="Address"
                          label="Address 1"
                          type="search"
                          value={this.state.orgInfo.inst_address1}
                          onChange={(event) => this.setDta("inst_address1", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={10} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="document-type"
                          label="Address 2"
                          type="search"
                          value={this.state.orgInfo.inst_address2}
                          onChange={(event) => this.setDta("inst_address2", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="document-type"
                          label="Pincode"
                          type="search"
                          value={this.state.orgInfo.inst_pincode}
                          //  onChange={(event) => this.setDta("inst_pincode",event.target.value.replace(/\D/g, ""))}
                          onChange={(event) => this.setDta("inst_pincode", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                          }}
                        />

                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="Post Office"
                          type="search"
                          value={this.state.orgInfo.inst_post_office}
                          onChange={(event) => this.setDta("inst_post_office", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>




                  </Grid>

                  <Grid container justify="center">

                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="Taluk"
                          type="search"
                          value={this.state.orgInfo.inst_taluk}
                          onChange={(event) => this.setDta("inst_taluk", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="District"
                          type="search"
                          value={this.state.orgInfo.inst_district}
                          onChange={(event) => this.setDta("inst_district", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={12} md={5} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  required
               className="m-2"
               id="document-type"   
               label="Pincode" 
               type="search" 
               value={this.state.orgInfo.inst_pincode}
               onChange={(event) => this.setDta("inst_pincode",event.target.value.replace(/\D/g, ""))}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid> */}
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="State"
                          type="search"
                          value={this.state.orgInfo.inst_state}
                          onChange={(event) => this.setDta("inst_state", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorContact1,
                            },


                          }}
                          InputProps={{
                            maxLength: 10,
                            minLength: 10,
                            classes: {

                              notchedOutline: this.state.validatecolorContact1 && classes.notchedOutlineRed
                            }

                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Contact Number 1 "
                          type="search"
                          value={this.state.orgInfo.inst_contact1}
                          onChange={(event) => this.setDta("inst_contact1", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                          }}
                        />

                      </FormControl>
                    </Grid>

                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorContact2,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorContact2 && classes.notchedOutlineRed
                            }

                          }}
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Contact Number 2"
                          type="search"
                          value={this.state.orgInfo.inst_contact2}
                          onChange={(event) => this.setDta("inst_contact2", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                          }}
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorEmail1,
                            },

                            // classes: {
                            //     root: classes.cssLabelRed,
                            //     focused: classes.cssLabelRed,

                            //   }
                          }}
                          InputProps={{
                            classes: {
                              // root: classes.cssOutlinedInput,
                              // focused: classes.cssFocused,
                              notchedOutline: this.state.validatecolorEmail1 && classes.notchedOutlineRed
                            }
                            // inputMode: 'numeric'
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Email 1 "
                          type="email"
                          value={this.state.orgInfo.inst_email1}
                          onChange={(event) => this.setDta("inst_email1", event.target.value.replace(/\s|[A-Z]/g, ""))}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>

                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorEmail2,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorEmail2 && classes.notchedOutlineRed
                            }

                          }}
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Email 2"
                          type="email"
                          value={this.state.orgInfo.inst_email2}
                          onChange={(event) => this.setDta("inst_email2", event.target.value.replace(/\s|[A-Z]/g, ""))}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10"></Grid>
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mt-3 p-2">
                      <div className="card-header--title font-size-md font-weight-bold pl-20">
                        Corporate Office
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={5} className="mt-3">
                      {this.state.editStudent &&
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={this.state.same_address == true}
                              onClick={() => {
                                this.handleAddress(this.state.same_address);
                                // this.setState({same_address:!this.state.same_address})
                              }}
                            />
                          }
                          label="Same as above"
                        />
                      }
                    </Grid>
                  </Grid>



                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={10} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="Address"
                          label="Address 1"
                          type="search"
                          value={this.state.orgInfo.corp_address1}
                          onChange={(event) => this.setDta("corp_address1", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={10} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="document-type"
                          label="Address 2"
                          type="search"
                          value={this.state.orgInfo.corp_address2}
                          onChange={(event) => this.setDta("corp_address2", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          id="document-type"
                          label="Pincode"
                          type="search"
                          value={this.state.orgInfo.corp_pincode}
                          onChange={(event) => this.setDta("corp_pincode", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                          }}
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="Post Office"
                          type="search"
                          value={this.state.orgInfo.corp_post_office}
                          onChange={(event) => this.setDta("corp_post_office", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>



                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          id="document-type"
                          label="Taluk"
                          type="search"
                          value={this.state.orgInfo.corp_taluk}
                          onChange={(event) => this.setDta("corp_taluk", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="District"
                          type="search"
                          value={this.state.orgInfo.corp_district}
                          onChange={(event) => this.setDta("corp_district", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={12} md={5} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  required
               className="m-2"
               id="document-type"   
               label="Pincode" 
               type="search" 
               value={this.state.orgInfo.inst_pincode}
               onChange={(event) => this.setDta("inst_pincode",event.target.value.replace(/\D/g, ""))}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid> */}
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          inputProps={{
                            autoComplete: 'off',
                            style: { textTransform: 'capitalize' }
                          }}
                          required
                          disabled
                          className="m-2"
                          //  id="document-type"   
                          label="State"
                          type="search"
                          value={this.state.orgInfo.corp_state}
                          onChange={(event) => this.setDta("corp_state", event.target.value)}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorCorpContact1,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorCorpContact1 && classes.notchedOutlineRed
                            }

                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Contact Number 1 "
                          type="search"
                          value={this.state.orgInfo.corp_contact1}
                          onChange={(event) => this.setDta("corp_contact1", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                          }}
                        />

                      </FormControl>
                    </Grid>

                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorCorpContact2,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorCorpContact2 && classes.notchedOutlineRed
                            }

                          }}
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Contact Number 2"
                          type="search"
                          value={this.state.orgInfo.corp_contact2}
                          onChange={(event) => this.setDta("corp_contact2", event.target.value.replace(/\D/g, ""))}
                          variant="outlined"
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                          }}
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorCorpEmail1,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorCorpEmail1 && classes.notchedOutlineRed
                            }

                          }}
                          required
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Email 1 "
                          type="email"
                          value={this.state.orgInfo.corp_email1}
                          onChange={(event) => this.setDta("corp_email1", event.target.value.replace(/\s|[A-Z]/g, ""))}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>

                  </Grid>
                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="mb-10">
                      <FormControl fullWidth>
                        <TextField
                          InputLabelProps={{
                            style: {
                              color: this.state.validatecolorCorpEmail2,
                            },


                          }}
                          InputProps={{
                            classes: {

                              notchedOutline: this.state.validatecolorCorpEmail2 && classes.notchedOutlineRed
                            }

                          }}
                          disabled={this.state.editStudent ? false : true}
                          className="m-2"
                          //  id="document-type"   
                          label="Email 2"
                          type="email"
                          value={this.state.orgInfo.corp_email2}
                          onChange={(event) => this.setDta("corp_email2", event.target.value.replace(/\s|[A-Z]/g, ""))}
                          variant="outlined"
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="mb-10"></Grid>
                  </Grid>


                  <Grid container justify="center">
                    <Grid item xs={12} sm={12} md={5} className="text-left pl-2">
                      <Button variant="outlined" className="successBtnOutline " style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.props.history.push("/admin/add-institution")}>Add Institution</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} className="text-right pr-2">
                      {!this.state.editStudent &&
                        <>
                          <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
                          </Button>
                          {/* <Button variant="outlined" className="successBtnOutline " style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.props.history.push("/admin/add-institution")}>Add Institution</Button> */}
                        </>

                      }

                      {this.state.editStudent &&
                        <div>
                          <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                          <Button type="submit" variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }}  >Submit</Button>
                          {/* <Button variant="outlined" className="successBtnOutline " style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.props.history.push("/admin/add-institution")}>Add Institution</Button> */}
                        </div>
                      }
                      {/* <Button type="submit" className="successBtnOutline">Submit</Button>   */}
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid container  justify="center">
           <Grid item xs={12} sm={12} md={11} className="text-right pr-2">
             <div> 
                    <Button variant="outlined" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.props.history.push("/admin/add-institution")}>Add Institution</Button>

                    <Button type="submit" variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.props.history.push("/admin/view-Institution")} >View Institution</Button>
             </div>
           </Grid>
           </Grid> */}

                {/* <Grid item xs={12} md={4} lg={3}>
              <Card className="card-box mb-4 p-2 mr-4">
              <Grid container style={{height:'250px'}}>
                <Grid item xs={12} sm={12} md={12}>
                <h6 className="mt-2 text-center">Fav Icon</h6> 
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                     <input type="file" onChange={this.handleImageChange1} ref={fileInput1} />
                    <div className={"thumbnail"}>
                      <img style={{maxHeight:180,width:'auto'}} src={this.state.imagePreviewUrl1} alt="..." />
                    </div>
                  <div>
                  {this.state.selectedFile1 === null ? (
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick1()}>
                    {"Select Logo"}
                    </Button>
                    ) : (
                    <span>
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick1()}>
                    Change
                    </Button>
                    { null}
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove1()}>
                    <i className="fas fa-times" /> Remove
                    </Button>
                    </span>
                  )}
                  </div>
                  </div>
                 </FormControl> 
                </Grid>
                </Grid>
              </Card>  
              </Grid>  */}

              </Grid>
            </Card>
          </form>
        </Grid>
      </Grid>
    )
  }
  insList = () => {
    return (
      <Grid container spacing={2} justify="center" >
        <Grid item xs={12} md={12} lg={12}>
          <ViewInstitutions />
        </Grid>
      </Grid>
    )
  }
  getInstitutionApicore() {
    const postData = {
          id_organization: this.props.data.selectedOrganizationId,
          id_institute: this.props.data.selectedInstitutionId,
          id_board: this.state.selectedBoardId,
          id_academicyear: this.state.selectedAcademicYear,
        }
      new Apicore().GetInstitution(postData).then(response => {
          console.log({response})
          
        }).catch(error => {
          console.log(error)
    
        });
  
  }

  componentDidMount() {
    this.getOrganizationData();
    this.getInstitutionApicore();
  }

  render() {
    const { classes } = this.props;
    const width = (window.innerWidth) * (60 / 100) + "px";
    return (
      <Fragment>
        {this.state.basicNotify}
        {/* <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Organization Settings"
        titleDescription=""
        {...this.props}
      />  */}
        <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition} >
          <AppBar className="app-header" color="secondary" position="fixed">
            <Toolbar className="w-100">
              <Grid container>
                <Grid item xs={12} lg={12} className="d-flex">
                  <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/settings")} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4" className="p-12">
                    Organization
                  </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Animated animationOut="slideOutLeft">
            <div className={classes.root} className="pt-100 pl-5">


              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link color="inherit" href="/admin/dashboard"

                >
                  Home
                </Link>
                <Link color="inherit"
                  href="/admin/settings"

                >
                  Settings
                </Link>
                <Typography color="textPrimary">Organization/Institution</Typography>
              </Breadcrumbs>
            </div>
            <div className="pt-5">
              <Grid container spacing={2} justify="center" className="sliderDiv">
                <Grid item xs={12} md={4} lg={8}>
                  <ExpansionPanel
                    expanded={this.state.activeAccordion === 'profile'}
                    onChange={() => this.handleChangeAccordion("profile")}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography><h5>Organization</h5></Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {this.OrganizationProfile()}
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel
                    expanded={this.state.activeAccordion === 'ins_list'}
                    onChange={() => this.handleChangeAccordion("ins_list")}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header">
                      <Typography><h5>Institution List</h5></Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {this.insList()}
                    </ExpansionPanelDetails>
                  </ExpansionPanel>


                </Grid>
              </Grid>

            </div>
          </Animated>
        </Dialog>
        <Drawer

          anchor="right"
          open={this.state.selectPOPanel}
          variant="temporary"
          elevation={4}
          onClose={() => this.setState({ selectPOPanel: false })}>
          <Box className={"app-header-drawer bgColor"} style={{ width: width }}>
            <PerfectScrollbar>

              <AppBar className="app-header" color="secondary" position="relative">
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => this.setState({ selectPOPanel: false })} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4">
                    Select Address
                  </Typography>
                </Toolbar>
              </AppBar>

              <Grid container spacing={2} justify="center" className="mt-1">
                <Grid item xs={12} sm={12} lg={12}>
                  {this.state.pincodesArr.length > 0 && this.state.pincodesArr.map((element, index) => (
                    <Card className="card-box my-2 mx-4">
                      <div className="card-indicator bg-first" />
                      <CardContent className="px-4 py-3">
                        <div className="pb-2 d-flex justify-content-between">
                          <a href="#" onClick={(e) => this.fillAddress(this.replaceText(element.office), element.taluk, element.district, element.circle, e)}>
                            {this.replaceText(element.office)}
                          </a>
                        </div>
                        <div className="d-flex align-items-center justify-content-start">

                          <div className="font-size text-dark">
                            {"Taluk: " + element.taluk + "    District: " + element.district + "    State: " + element.circle}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </PerfectScrollbar>
          </Box>
        </Drawer>


      </Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToPros)(withStyles(styles)(withRouter(Organization)));
