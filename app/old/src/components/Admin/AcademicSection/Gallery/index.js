import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Tooltip,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardSections:[],
      dialogOpen:false,
      basicNotify:false,
      albumData:[],
      dashboardDetails:[],
      TotalStudentCount:0,
      album_count:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],

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

  getDashboardDetails = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Gallery/getDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ album_count: response.data.albums, photo_count: response.data.photographs }); 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  

  getAlbumInfo = () => {

    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Gallery/getAlbumData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ albumData: response.data }); 
      }else{
        this.setState({ albumData: [] });
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  deactivateAlbum = (id,status) => {
    let switchStatus = "";
     if(status == 1){
        switchStatus = "Album Deactivated";
     }
     else{
        switchStatus = "Album Activated";
     }
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id: id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Gallery/deleteGalleryData',postData).then(response => {
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
        this.getAlbumInfo();
       // this.getAlbumImages(id);
        setTimeout(() => {
          this.setState({  basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  getStandardSectionDetailsDashboard(id_board,id_academicyear) {
    const postData = {
    count:"student",
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        var lStandardSections = [];
        response.data.forEach(element => {
                if(lStandardSections[element.board_id]){
                  var lStandard = {};
                  lStandard.standard_name = element.standard_name;
                  lStandard.standard_id = element.standard_id;
                }else{
                  var lBoard = {};
                  var lStandard = {};
                  lBoard.board_name = element.board_name;
                  lStandard.standard_name = element.standard_name;
                  lStandard.standard_id = element.standard_id;
                  lStandardSections[element.board_id] = lBoard;
                }
                if(lStandardSections[element.board_id][element.standard_id]){
                  var lSection = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_student_count = element.all_student_count;
                  lSection.active_student_count = element.active_student_count;
                  lStandardSections[element.board_id][element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_student_count = element.all_student_count;
                  lSection.active_student_count = element.active_student_count;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);
                  lStandardSections[element.board_id][element.standard_id] = lStandard;
              } 
        });
        this.setState({ classwiseSectionsDashboard:lStandardSections,loading:false});
      }
    }).catch(error => {
      alert(error);

    });

  }


  componentDidMount() {
   // console.log(this.props.data);
    this.getDashboardDetails();
    this.getAlbumInfo();
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Gallery"
        titleDescription=""
        {...this.props}
      /> 
      <Grid container spacing={4} justify="center">
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.album_count}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    Albums
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={4}></Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/add-gallery")}>
          Add Album
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}></Grid>
      </Grid>

      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        {this.state.albumData.length > 0 && this.state.albumData.map((element, index) => (  
               <Card className="card-box mb-4">
        <List className="pb-0">
          <ListItem className="py-4">
            <div className="d-flex flex-column flex-sm-row align-items-start">
              <div>
                <Card className="card-transparent mb-3 mb-sm-0">
                  <a
                    href="#/"
                    onClick={e => e.preventDefault()}
                    className="card-img-wrapper rounded">
                    <div className="img-wrapper-overlay">
                      <div className="overlay-btn-wrapper">
                        <Fab
                          size="small"
                          color="secondary"
                          className="mx-auto d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={['fas', 'eye']}
                            className="font-size-lg"
                          />
                        </Fab>
                      </div>
                    </div>
                    <img
                      alt="..."
                      className="card-img-top rounded"
                      src={Config.path+"writable/uploads/gallery/covers/"+element.cover}
                      style={{ width: 160, height:100 }}
                    />
                  </a>
                </Card>
              </div>
              <div className="pl-0 pl-sm-4">
                <div className="mb-1">
                  <a
                    className="font-size-lg"
                    href="#/"
                    onClick={e => e.preventDefault()}>
                   {element.name}
                  </a>
                </div>
                <div>
                 
                  <div className="text-danger badge badge-neutral-danger">
                  {moment(element.album_date).format('DD-MM-YYYY')}
                  </div>
                </div>
                <p className="mb-0 mt-2 text-black-50">
                {element.description}
                </p>
              </div>
            </div>
          </ListItem>
        
          <ListItem className="bg-secondary d-block text-center p-3">
            <Tooltip arrow title="View">
              <Button disabled={element.status == 1 ? false : true} color="default" className="text-facebook" onClick={()=>this.props.history.push("/admin/view-gallery/"+element.id)}>
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'eye']} />
                </span>
              </Button>
            </Tooltip>
          
            <Tooltip arrow title="Edit">
              <Button disabled={element.status == 1 ? false : true} color="default" className="text-twitter" onClick={()=>this.props.history.push("/admin/edit-gallery/"+element.id)}>
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'pen']} />
                </span>
              </Button>
            </Tooltip>
            <Tooltip arrow title={element.status == 1 ? "Disable" : "Enable"}>
              <Button color="default" className="text-dribbble mr-2 ml-2" onClick={()=>this.deactivateAlbum(element.id,element.status)}>
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'trash']} />
                </span>
              </Button>
            </Tooltip>
          </ListItem>
        </List>
        </Card>
        ))}
        </Grid>
      </Grid>

      </Animated>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
