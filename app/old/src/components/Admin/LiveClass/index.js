import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {Badge,Link,Switch,Tooltip,Grid,Dialog,FormControlLabel,MenuItem,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import i18n from '../../../i18n';

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class LiveClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections:[],
      liveClassDetails:[],
      individualStudentData:[],
      textSuggestions:[],
      dialogOpen:false,
      basicNotify:false,
      categoryLength:0,
      column_count: '',
      class_link:'',
      joiningStandardName:'',
      academicLength:0,
      nonacademicLength:0,
      dashboardDetails:[],
      TotalStudentCount:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,  
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

//   getDashboardDetails() {
//     const postData = {
//       id_organization:this.props.data.selectedOrganizationId,
//       id_institute:this.props.data.selectedInstitutionId,
//       id_board:this.props.data.selectedBoardId,   
//       id_academicyear:this.props.data.selectedAcademicId,  
//       role_id:this.props.data.role_id,
//       token:"abc",
//       id_user: this.props.data.UID
//     }
//     new Service().apiCall('ClassMasters/getDashboardDetails',postData).then(response => {
//       if (response.status==200 && response.data!='') {
//         if(response.data){
//           this.setState({ dashboardDetails: response.data });
//         }
//       }
//     }).catch(error => {
//       this.showError(error.response.data);
//     });

//   }
selectJoiningStandard = (event,id) => {
  this.setState({joiningStandard:id, joiningStandardName:event.target.value});
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
    //console.log(JSON.stringify(response));
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
                lStandard.section_name = element.section_name;
                lStandard.stream_name = element.stream_name;
                lStandard.standard_id = element.standard_id;
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
      response.data.forEach((element,index )=> { 
        if(element.stream_name != null){
          data.push({id:element.section_id, value:element.standard_name+" "+element.stream_name+" "+element.section_name});
        }else{
          data.push({id:element.section_id, value:element.standard_name+" "+element.section_name});
        }
        
      });

      //console.log(data);
      this.setState({classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
    }
  }).catch(error => {
   // alert(error);

  });

}

  
  getRoundedValue = (v1,v2) => {
    if(v1 == 0 && v2 == 0){
        return 0;
    }
    else{
      let numberToRound = ((v1 - v2)/v2) * 100;
      let per =  numberToRound.toFixed(2);
      return per;
    }

  }

  getLiveClassData = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID,
      type: this.props.data.type
    };
    new Service().apiCall('LiveClass/getData',postData).then(response => {
        //console.log('post'+JSON.stringify(response));
        if (response.status===200 && response.data!=='') {
            this.setState({ liveClassDetails: response.data});
        }else{
          this.setState({liveClassDetails:[]});
        }  
    }).catch(error => {
      console.log(error);

    });
  }

  getIndividualClassData = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID,
      type: this.props.data.type
    };
    new Service().apiCall('LiveClass/getIndividualData',postData).then(response => {
        //console.log('post'+JSON.stringify(response));
        if (response.status===200 && response.data!=='') {
            this.setState({ individualStudentData: response.data});
        }else{
          this.setState({individualStudentData:[]});
        }  
    }).catch(error => {
      console.log(error);

    });
  }

  insertLinks = (e) =>{
    e.preventDefault();
    const postData = {
      standard_id : this.state.joiningStandard,
      classlink : this.state.class_link,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      token:"abc",
      id_user: this.props.data.UID,
      type: this.props.data.type
    }
    new Service().apiCall('LiveClass/insertData',postData).then(response => {
      //console.log('post'+JSON.stringify(response));
      if (response.status===200 && response.data!=='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold mt-4">Link Saved Successfully!</h4>
              </div>
            </Dialog>
          ),
        });
        setTimeout(() => {
          this.setState({ basicNotify:false});
          this.getLiveClassData();
        }, 2000)
      }else{
        //this.setState({liveClassDetails:[]});
      }  
  }).catch(error => {
    console.log(error);

  });
  }

  handleDeactive = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Link Deactivated";
     }
     else{
        switchStatus = "Link Activated Successfully";
     }
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id: id,
      status:status,
      token:"abc",
      id_user: this.props.data.UID,
    }
    new Service().apiCall('LiveClass/deleteLiveClass',postData).then(response => {
      console.log(response);
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
      
        setTimeout(() => {
         window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
      alert(error);
    });
  }


  componentDidMount() {
      //console.log('data'+(this.props.data.type));
    this.getStandardSectionDetails();
    this.getLiveClassData();
    this.getIndividualClassData();
  }

  render() { 
    const {dashboardDetails} = this.state;
  
    return (
        <Fragment>
            {this.state.basicNotify}
            <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 

                <Grid container spacing={4} justify="center">

                    {this.props.data.type === "3" && <>
                        {this.state.individualStudentData.map(original => (
                            <Grid item xs={12} md={8} lg={8} justify="center">
                                <div className="text-center mt-5">
                                    <h2>Click below Button to Join the Live Class</h2>
                                    <Button color="primary" variant="contained" onClick={()=> window.open(original.url, "_blank")}> Join Class </Button>
                                </div>                                
                            </Grid>
                        ))}
                    </>
                    } 
                </Grid>  

                    {(this.props.data.type === "2" || this.props.data.type === "1") && <>
                      <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={10} lg={6}>
                          <Card className="card-box  mb-4 customNoData">
                            <div className="card-header">
                                <div className="card-header--title">
                                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                                    Add Live Class Links
                                    </h4>
                                </div>
                            </div>
                            <form  onSubmit={this.insertLinks.bind(this)} autoComplete="off">
                              
                              <Grid container spacing={4} className="p-3">
                                <Grid item xs={12} sm={12} md={12}>  
                                  <FormControl fullWidth>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select Standard"
                                    value={this.state.joiningStandardName}
                                    onChange={(event,child) => this.selectJoiningStandard(event,child.props.id)}
                                    variant="outlined" multiple required>
                                    {this.state.textSuggestions.map(option => (
                                    <MenuItem key={option.value} value={option.value} id={option.id}>
                                      {option.value}
                                    </MenuItem>
                                    ))}
                                  </TextField>
                                  </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                  <FormControl fullWidth>
                                    <TextField 
                                      inputProps={{
                                      autoComplete: "off",
                                      }}
                                      id="document-type"   
                                      value={this.state.class_link}
                                      label="Class Link" 
                                      type="search" 
                                      onChange={(event) => this.setState({class_link:event.target.value})}
                                      variant="outlined" required
                                  />
                                  </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                  <Button type="submit" className="successBtnOutline mx-2" variant="outlined">Submit</Button>
                                </Grid>
                              </Grid>
                            </form>
                          </Card>
                        </Grid>
                      </Grid>

                      <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={10} lg={6}>
                            <Card className="card-box  mb-4 customNoData">
                            <div className="card-header">
                                <div className="card-header--title">
                                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                                    Class List
                                    </h4>
                                </div>
                            </div>

                                <ReactTable

                                    data={this.state.liveClassDetails.map((original,key) => {
                                        return ({
                                            slno: key+1,
                                            standardname: original.standard+" "+original.stream+" "+original.section,
                                            url:original.url,
                                            status:original.status,
                                            link: (
                                                // we've added some custom button actions
                                                <Button color="primary" variant="contained" onClick={()=> window.open(original.url, "_blank")}> Join Class </Button>
                                            ),
                                            actions: (
                                              
                                              <Tooltip
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
                                              </Tooltip>
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
                                            filterable: false,
                                        },{
                                            Header: "Class",
                                            accessor: "standardname",
                                            width: 250,
                                            className: "center",
                                            filterable: false,
                                        },{
                                            Header: "Link",
                                            accessor: "link",
                                            className: "center",
                                            filterable: false,
                                        },{
                                          Header: "Action",
                                          accessor: "actions",
                                          className: "center",
                                          filterable: false,
                                      }
                                    ]}
                                    defaultFilterMethod={false}
                                    defaultPageSize={10}
                                    showPaginationTop
                                    showPaginationBottom={false}
                                    className="-striped -highlight"
                                />
                            </Card>
                        </Grid>
                      </Grid>
                      </>  
                    }
            </Animated>

        </Fragment>
    );
    }
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(LiveClass));
