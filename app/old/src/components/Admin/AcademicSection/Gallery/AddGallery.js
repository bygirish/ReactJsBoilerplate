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


  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };

  handleStandardSelected = (standards) => {
    this.setState({selectedStandards:standards}); 
  }

  fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
        this.handleFiles(files);
    }
  }

  handleCapture = ({ target }) => {
    const fileReader = new FileReader();
    const name = 'images';
    const captions = 'captions';
    const tags = 'tags';
 
    let files = target.files;

      if (files.length) {
        for(let i = 0; i < files.length; i++) {
        this.setState((prevState) => ({
            [name]: [...prevState[name], files[i]]
        }));
        this.setState((prevState) => ({
          [captions]: [...prevState[captions], '']
      }));
      this.setState((prevState) => ({
        [tags]: [...prevState[tags], '']
    }));
      }
      }
   
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

createAlbum = () => {
  let selectedFiles = this.state.images;
  let captions = this.state.captions;
  let formData = new FormData();
 // console.log(captions);

  let tags = this.state.tags;
  let newArr = [];
   selectedFiles.map((element,index) =>{
    var lKey ="gallery_image"+index;
    formData.append(lKey,element);
     newArr.push({caption:captions[index],tag:tags[index]});
   });

   let stdIds = [];
  this.state.selectedStandards.map((element,index) =>{
    stdIds.push(element.id);
   });
  
  let selectedStandardId = stdIds.join(",");

  formData.append('id_board',this.props.data.selectedBoardId);
  formData.append('id_academicyear',this.props.data.selectedAcademicId);
  formData.append('name',this.state.albumName);
  formData.append('description',this.state.albumDescription);
  formData.append('standards',selectedStandardId);
  formData.append('album_images',JSON.stringify(newArr));
  formData.append('album_date',moment(this.state.selectedDate).format('YYYY-MM-DD'));
  formData.append('cover',this.state.selectedFile);
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc'); 
  formData.append('role_id',this.props.data.role_id);
  formData.append('id_user',this.props.data.UID);

  new Service().apiCall('Gallery/InsertAlbum', formData,
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
            <div className="avatar-icon-wrapper rounded-circle m-0">
              <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-success text-success m-0 d-130">
                <FontAwesomeIcon
                  icon={['fas', 'check']}
                  className="d-flex align-self-center display-3"
                />
              </div>
            </div>
            <h4 className="font-weight-bold mt-4">Album Created Successfully!</h4>

          </div>
        </Dialog>
        ),
      });
      setTimeout(() => {
        this.setState({ basicNotify:false});
        this.props.history.push("/admin/gallery");
      }, 2000) 
    }
  }).catch(error => {
    this.showError(error.response.data)
  });
} 

setCaption = (caption) => {
    
  let lCaptions = this.state.captions;
  lCaptions[this.state.img_index] = caption;
  console.log(lCaptions);
  this.setState({captions: lCaptions});
}

setTags = (tag) => {
  let lTags = this.state.tags;
  lTags[this.state.img_index] = tag;
  this.setState({tags: lTags});
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

  renderImage = () => {
    let img = null;
    if(this.state.images.length > 0){
      img =  URL.createObjectURL(this.state.images[this.state.img_index]);
    }
    return img;
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

  handleDateChange = (date) => {
    this.setState({selectedDate:date});
  };

  removeFile(i) {
    const { images } = this.state;
    this.setState({
      images: images.filter((file, index) => index !== i),
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
      console.log(error);

    });

  }


  componentDidMount() {

  }

  render() {
    const width = window.innerWidth;
    const width40p =  width * (40/100)+"px";

  return (
    <Fragment>
       {this.state.basicNotify}
     
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/gallery")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Add Album
            </Typography>
               </Grid>
            
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container  justify="center">
      <Grid item xs={12} md={4} lg={10}>
          <Card className="card-box mb-4 pt-3">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} lg={3}>
              <Card className="card-box ml-4 mb-4 p-2">
              <Grid container style={{height:'250px'}}>
                <Grid item xs={12} sm={12} md={12}>
                <h6 className="mt-2 text-center">ADD ALBUM COVER</h6> 
                <FormControl fullWidth>
                  <div className="fileinput text-center">
                     <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                    <div className={"thumbnail"}>
                      <img style={{maxHeight:180,width:'auto'}} src={this.state.imagePreviewUrl} alt="..." />
                    </div>
                  <div>
                  {this.state.selectedFile === null ? (
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick()}>
                    {"Select file"}
                    </Button>
                    ) : (
                    <span>
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick()}>
                    Change
                    </Button>
                    { null}
                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove()}>
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
              </Grid>  
              <Grid item  xs={12} sm={12} md={6} className="margin-auto">
           <Grid container>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           <Grid item xs={12} sm={12} md={8} className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
               id="document-type"   
               label="Album Name" 
               type="search" 
               onChange={(event) => this.setState({albumName:event.target.value})}
               variant="outlined" 
               />
               
               </FormControl>
                  </Grid>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           </Grid>
           <Grid container>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           <Grid item xs={12} sm={12} md={8}  className="mb-10">
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
                label="Album date"
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
                </FormControl>
                </Grid>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           </Grid>
           <Grid container>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           <Grid item xs={12} sm={12} md={8}  className="outlinedInput"  className="mb-10">
                  <FormControl fullWidth>
               <TextField 
                 inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
               multiline
               rows={2}
               id="document-type"   
               label="Description" 
               type="search" 
               onChange={(event) => this.setState({albumDescription:event.target.value})}
               variant="outlined" 
               inputProps={{ minLength: 5 }}
               />
               
               </FormControl>
                  </Grid>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           </Grid>
           <Grid container  className="customDiv">
           <Grid item  xs={12} sm={12} md={2}></Grid>
           <Grid item xs={12} sm={12} md={8}  className="mt-2">
           <OutlinedDiv label="Select Audience">
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
            <li onClick={()=>{this.setState({standardPanel:true});}}>
            <Chip
            variant="outline"
            color="secondary"
            label={this.state.selectedStandards.length > 0 ? "Change Audience" : "Select Audience"}
            className="m-1"
            />
            </li>
             </Paper>
            </OutlinedDiv>    
            </Grid>
           <Grid item  xs={12} sm={12} md={2}></Grid>
           </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Card className="card-box ml-4 mb-4 pt-3 mr-4">
   
              <Grid container style={{height:'250px'}}>
                <Grid item xs={12} sm={12} md={12} className="margin-auto">
                <div 
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={this.fileDrop}
                    onClick={fileInputClicked}
                >
                    <div className="drop-message">
                        <div className="upload-icon"></div>
                        Click to select
                        <br /> or <br /> Drag & Drop
                    </div>
                    <input
                    multiple
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    id="icon-button-photo"
                    onChange={this.handleCapture}
                    type="file"
                />
                </div>
                </Grid>
                </Grid>
       
            </Card>
          </Grid>
            </Grid>  
          </Card> 
      </Grid>
      </Grid>
      <Grid container  justify="center">
      {this.state.images.map((data, i) =>   
      <Grid item xs={6} sm={4} md={2} lg={2}>
          <Card className="card-transparent mb-4">
            <div className="card-img-wrapper">
              <div className="card-badges card-badges-top cursor-pointer"  onClick={() => this.removeFile(i)}>
                <div className="badge badge-danger badge-pill" >Remove</div>
              </div>
              <img src={URL.createObjectURL(data)} className="card-img-top rounded" alt="..." />
            </div>
            <div className="card-body text-center">
              <Button
                onClick={()=>this.setState({imageDetailsPanel:true, img_index:i})}
                size="small"
                variant="outlined"
                color="primary"
                className="mt-1">
               {this.state.captions[i]!='' ? <span style={{color:'green'}}>Details Added</span> : "Add Details"}
              </Button> 
            </div>
          </Card>
        </Grid>
      )}
      </Grid>  
      {this.state.images.length > 0 &&   <Grid container  justify="center">
        <Grid item xs={12} sm={12} lg={4}></Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.createAlbum()}>
          Create Album
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}></Grid>
      </Grid>}
      </div>
      </Animated>     
      </Dialog>
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
  Select Section
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4">
<CardContent>
<StandardSectionsList
board_id={this.props.data.selectedBoardId}
type="checkbox"
mappedstandards={this.state.selectedStandards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleStandardSelected}
{...this.props} 
/>
</CardContent>
<CardActions>
<Grid container >
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
<Dialog  maxWidth="lg" open={this.state.imageDetailsPanel} onClose={()=>this.setState({imageDetailsPanel:false})}>
              <Grid container >
                <Grid item  style={{width:'660px',backgroundColor:'black',height:'520px', textAlign:'center',position:'relative'}}>
                  <div className="hero-wrapper bg-composed-wrapper bg-plum-plate h-100">
                    <div className="flex-grow-1 w-100 d-flex align-items-center">
                      <div
                        className="bg-composed-wrapper--image "
                      />
                      <div className="bg-composed-wrapper--bg bg-second opacity-5" />
                      <div className="bg-composed-wrapper--content p-5">
                      <img style={{height:'auto',maxHeight:'100%', width:'auto', maxWidth:'100%', position:'absolute',top:0, left:0, right:0, bottom:0, margin:'auto'}}  src={this.renderImage()} />
                   
                      </div>
                    </div>
                 
                  </div>
                </Grid>
                <Grid item  style={{width:'360px'}}>
                  <div className="bg-white ">
                  <Grid container  justify="center">
                  <Grid item  xs={12} sm={12} md={12}>
                                <div className="card-header d-flex flex-row">
                                 <a className="pmd-avatar-list-img">
                                  <img src={this.state.imagePreviewUrl} alt="" width="40" height="40" />
                                  </a>
                                  <div class="media-body1">
                                  <h3 class="card-title" className="mt-0">{this.state.album_name}</h3> 
                                  </div>
                                  </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8}>
                                <FormControl fullWidth>
                                <TextField 
                                  inputProps={{
                                    style: {textTransform: 'capitalize'},
                                     autoComplete: "off",
                                    }}
                                id="document-type"   
                                value={this.state.captions.length > 0 ? this.state.captions[this.state.img_index] : ""}
                                label="Image Caption" 
                                className="m-2"
                                type="search" 
                                onChange={(event) => this.setCaption(event.target.value)}
                                variant="outlined" 
                 
                                />

                                </FormControl>
                                </Grid>
                                <Grid xs={12} sm={12} md={8}>
                                <FormControl fullWidth>
                                <TextField 
                                 inputProps={{
                                  style: {textTransform: 'capitalize'},
                                   autoComplete: "off",
                                  }}
                                id="document-type"   
                                value={this.state.tags.length > 0 ? this.state.tags[this.state.img_index] : ""}
                                label="Tag" 
                                className="m-2"
                                type="search" 
                                onChange={(event) => this.setTags(event.target.value)}
                                variant="outlined" 
      
                                />

                                </FormControl>
                                </Grid>
                  </Grid>  
                  <Grid container spacing={4} className="mt-2">
                                    <Grid item   xs={12} sm={12} md={12} className="text-center">
                                     {this.state.images.length > (this.state.img_index+1) && <Button size="small" variant="outlined" color="primary" onClick={()=>this.setState({img_index : this.state.img_index + 1})}>
                                      Save & Continue
                                     </Button> }
                                      <Button size="small" variant="outlined"  className="mr-2" color="primary" onClick={()=>this.setState({imageDetailsPanel:false})}>
                                      Close
                                      </Button> 
                                    </Grid>
                  </Grid>
                  </div>
                </Grid>
              </Grid>
            </Dialog>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
