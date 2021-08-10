import React, { Fragment, createRef } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { PageTitle } from '../../../../layout-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Dialog,Grid,Drawer,Box,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,CardActions,Paper,Chip} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';
import DateFnsUtils from '@date-io/date-fns';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const fileInputRef = createRef();
const fileInput = React.createRef();

const preventDefault = (e) => {
  e.preventDefault();
  // e.stopPropagation();
}

const dragOver = (e) => {
  preventDefault(e);
}

const dragEnter = (e) => {
  preventDefault(e);
}

const dragLeave = (e) => {
  preventDefault(e);
}


const toDataUrl = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
          callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};

const fileInputClicked = () => {
  fileInputRef.current.click();
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate:new Date(),
      imagePreviewUrl:defaultImage,
      standardSections:[],
      selectedStandards:[],
      selectedAlbumName:"",
      albumName:"",
      currentImage:0,
      viewerIsOpen:false,
      albumDescription:"",
      images:[],
      selectedFile:null,
      img_index:0,
      dialogOpen:true,
      basicNotify:false,
      albumData:[],
      tags:[],
      captions:[],
      dashboardDetails:[],
      TotalStudentCount:0,
      album_count:0,
      classwiseSectionsDashboard:[],
      boardDetails:[],

    };

  }


  openLightbox = (event,{photo,index}) => {
    console.log(index);
    this.setState({currentImage:index, viewerIsOpen:true})
  }

  closeLightbox = () => {
    this.setState({currentImage:0, viewerIsOpen:false})
  }



  getAlbumInfo = () => {

    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Gallery/getAlbumData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ albumData: response.data }); 
      }else{
        this.setState({ albumData: [] });
      }
    }).catch(error => {
      //alert(error);
    });
  }

  getAlbumImages = () => {
    const album_id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    this.setState({selectedalbumId:album_id});
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      id_album:album_id,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Gallery/getAlbumDataWithId',postData).then(response => {
   console.log(response);
      if (response.status==200 && response.data!='') {
        let images = [];
        let files = [];
        let captions = [];
        let tags = [];
        response.data[0].images.map(element=>{
          if(element.status == 1){
             images.push({src:Config.path+"writable/uploads/gallery/covers/images/"+element.path,width:1,height:1,caption:element.caption,tag:element.tag, id:element.id, status:element.status});
           // files.push(Config.path+"writable/uploads/gallery/covers/images/"+element.path);
            captions.push(element.caption ? element.caption : '');
            tags.push(element.tag ? element.tag : '');
            
          }
        });
      this.setState({ albumName:response.data[0].name,albumDescription:response.data[0].description, captions:captions, tags:tags, images:images, selectedStandards:response.data[0].selectedstandards, selectedDate:moment(response.data[0].album_date).format('YYYY-MM-DD'),selectedAlbumName:response.data[0],selectedFile:response.data[0].cover,imagePreviewUrl:response.data[0].cover?Config.path+"writable/uploads/gallery/covers/"+response.data[0].cover : this.state.imagePreviewUrl }); 
      }
    }).catch(error => {
      alert(error);
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
    this.getAlbumInfo();
    this.getAlbumImages();
  }

  render() {
    const width = window.innerWidth;
    const width40p =  width * (40/100)+"px";
    const width100p =  width +"px";

  return (
    <Fragment>
       {this.state.basicNotify}
       <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="View Gallery"
        showIcon={true}
        titleDescription=""
        {...this.props}
      /> 

      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container spacing={2} justify="center">
      <Grid item xs={12} md={4} lg={10}>
      <Gallery photos={this.state.images} onClick={this.openLightbox} />
      <ModalGateway>
        {this.state.viewerIsOpen ? (
          <Modal onClose={()=>this.closeLightbox()}>
            <Carousel
              currentIndex={this.state.currentImage}
              views={this.state.images}
            />
          </Modal>
        ) : null}
      </ModalGateway>
      </Grid>
      </Grid>

      </div>
      </Animated>     
 
     
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
