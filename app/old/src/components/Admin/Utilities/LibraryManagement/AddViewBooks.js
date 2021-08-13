import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Chip,Paper, FormControlLabel,Switch} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
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
  KeyboardTimePicker,
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

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:AuthHelper('Library Management','can_create') ? 'create':'view',
      loading:false,
      imagePreviewUrl:defaultImage,
      booksList:[],
      genres:[],
      authors:[],
      publishers:[],
      languages:[],
      book_formats:['Hard Cover','Paper Back','Ebook'],
      title:'',
      ISBN:'',
      barcode:'',
      price:'',
      basicNotify:false,
      selectedFile:null,
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

    getBooksData = () => {
    this.setState({booksList:[]});
    const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_academicyear:this.props.data.selectedAcademicId,
    id_board:this.props.data.selectedBoardId,
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID
    };
    new Service().apiCall('Libraries/getBooksData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({booksList:response.data});
      } 
    }).catch(error => {
      this.showError(error.response.data)

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

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };


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

  getAuthors = () => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoard,   
    id_academicyear:this.state.selectedAcademicYear,  
    token:"abc",
    userrole: this.props.data.type,
    id_user: this.props.data.UID,
    role_id: this.props.data.role_id,
    };
    new Service().apiCall('Libraries/getAuthorData',postData).then(response => {
      console.log(response); 
      if (response.status==200 && response.data!='') {
        
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({authors:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({authors:newArray});
        }
        
      }
    }).catch(error => {
    //  this.showError(error.response.data)
    });
  }

  
getGenres = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoard,   
  id_academicyear:this.state.selectedAcademicYear,  
  token:"abc",
  userrole: this.props.data.type,
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  };
  new Service().apiCall('Libraries/getGenreData',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({genres:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({genres:newArray});
      }
      
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  });
}

getPublishers = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoard,   
  id_academicyear:this.state.selectedAcademicYear,    
  token:"abc",
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  };
  new Service().apiCall('Libraries/getPublishData',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({publishers:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({publishers:newArray});
      }
      
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  });
}

setPostData = (name,value) => {
  this.setState({[name]:value});
}

getLanguages = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoard,   
  id_academicyear:this.state.selectedAcademicYear,  
  token:"abc",
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  };
  new Service().apiCall('Libraries/getLanguageData',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({languages:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({languages:newArray});
      }
      
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  });
}



insertBook = () => {
  const lUserData = this.props.data;

  let data = new FormData();
  let formData = new FormData();
  formData.append('id_board',this.state.selectedBoard);
  formData.append('id_academicyear',this.state.selectedAcademicYear);
  formData.append('id_section',this.state.selectedStandardId);
  formData.append('title',this.state.title);
  formData.append('ISBN',this.state.ISBN);
  formData.append('barcode',this.state.barcode);
  formData.append('book_cover',this.state.selectedFile);
  formData.append('id_language',this.state.id_language);
  formData.append('id_author',this.state.id_author);
  formData.append('id_genre',this.state.id_genre);
  formData.append('id_publisher',this.state.id_publisher);
  formData.append('price',this.state.price);
  formData.append('format',this.state.format);
  formData.append('id_organization',this.props.data.selectedOrganizationId);
  formData.append('id_institute',this.props.data.selectedInstitutionId);
  formData.append('token','abc');
  formData.append('role_id',this.props.data.role_id);
  formData.append('id_user',this.props.data.UID);
  new Service().apiCall('Libraries/insertLibraryBooks', formData,
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
    <h4 className="font-weight-bold">Book Inserted</h4>
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



  selectStaff = (event,id) => {
    this.setState({selectedStaffId:id});
  }

  selectSubject = (event,id) => {
    this.setState({selectedSubjectId:id});
  }
  
  componentDidMount() {
    this.getBooksData();
    this.getGenres();
    this.getAuthors();
    this.getPublishers();
    this.getLanguages();
  }

render(){
  const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/library-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Add/View Books
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               {AuthHelper('Library Management','can_create') &&    <div className="card-header--actions text-right">
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
                  Add Book
                </h4>
              </div>
         
        </div>
        <CardContent>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={6}>
        <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                className="mx-1"
                id="document-type"   
                onChange={(event) => this.setPostData("title",event.target.value)}
                value={this.state.title}
                label="Title" 
                type="search" 
                variant="outlined" />
               
                </FormControl>
            </Grid> 
  
          <Grid item xs={12} sm={6} lg={3}>
        <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                className="mx-1"
                id="document-type"   
                onChange={(event) => this.setPostData("ISBN",event.target.value)}
                value={this.state.ISBN}
                label="ISBN" 
                type="search" 
                variant="outlined" />
               
                </FormControl>
            </Grid> 
            <Grid item xs={12} sm={6} lg={3}>
               <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                className="mx-1"
                id="document-type"   
                onChange={(event) => this.setPostData("barcode",event.target.value)}
                value={this.state.barcode}
                label="Barcode" 
                type="search" 
                variant="outlined" />
                </FormControl>
            </Grid> 
        
          <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Language"
                    value={this.state.id_language}
                    onChange={(event, child) => this.setState({id_language:child.props.id})}
                    variant="outlined">
                    {this.state.languages.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.language}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 

            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Author"
                    value={this.state.id_author}
                    onChange={(event, child) => this.setState({id_author:child.props.id})}
                    variant="outlined">
                    {this.state.authors.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 

            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Genre"
                    value={this.state.id_genre}
                    onChange={(event, child) => this.setState({id_genre:child.props.id})}
                    variant="outlined">
                    {this.state.genres.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 

            <Grid item xs={12} sm={6} lg={6}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Publisher"
                    value={this.state.id_publisher}
                    onChange={(event, child) => this.setState({id_publisher:child.props.id})}
                    variant="outlined">
                    {this.state.publishers.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.publisher}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 
            <Grid item xs={12} sm={6} lg={2}>
               <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                id="document-type"   
                onChange={(event) => this.setPostData("price",event.target.value)}
                value={this.state.price}
                label="Price" 
                type="search" 
                variant="outlined" />
                </FormControl>
            </Grid> 
            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Format"
                    value={this.state.format}
                    onChange={(event, child) => this.setState({format:event.target.value})}
                    variant="outlined">
                    {this.state.book_formats.map(option => (
                      <MenuItem key={option} name={option} id={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> 
 
         
        </Grid>

        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Library Management','can_create') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}></Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.insertBook()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </Card>
        </Grid>  
        <Grid item xs={12} md={8} lg={4}>
        <Card className="card-box p-4">
        <div className="font-weight-400 text-center font-size-lg">Upload Cover</div>
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

        {this.state.actionType == "view"  && <Grid container spacing={4}  justify="center">
     
        <Grid item xs={12} md={8} lg={8}>
        <Grid container spacing={4}>  
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Books List
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.booksList.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          standrad: original.standrad,
          staff: original.staff_name,
          lesson:original.lesson,
          description:original.description,
          start_time:moment(moment().format("YYYY-MM-DD")+" "+original.start_time).format("hh:mm A"),
          end_time:moment(moment().format("YYYY-MM-DD")+" "+original.end_time).format("hh:mm A"),
          subject:original.subject_name,
          actions: (
            // we've added some custom button actions
            <div className="grouplist-actions">
              { /* use this button to add a like kind of action */ }
            
               <Tooltip
                id="tooltip-top"
                title="View"
                placement="top"
        
              >
                  <Button
                    simple
                    onClick={()=>  this.setState({addTimetablePanelll:true})}
                    color="secondary"
                    className="edit"
                  >
                    <ViewIcon  />
                  </Button>
              </Tooltip>
              {AuthHelper('Library Management','can_delete') &&
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
  Header: "Teacher",
  accessor: "staff",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Teacher"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Subject",
accessor: "subject",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Staff"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "Start Time",
accessor: "start_time",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Time"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "End Time",
  accessor: "end_time",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Time"
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
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Library Management','can_export') &&  <Grid container spacing={4}>
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

        {/* <Drawer

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
          type="sections"
          mappedstandards={this.state.selectedStandards}
          academic_id={this.props.data.selectedAcademicId}
          onSelected={this.handleStandardSelected}
          {...this.props} 
          />
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
    <strong>Start Time:</strong> {moment(this.state.start_time).format("HH:mm")}
</Grid>
<Grid item xs={12} sm={10} md={8}>
<strong>End Time:</strong> {moment(this.state.end_time).format("HH:mm")}
</Grid>
</Grid>
</Card>

<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Lesson: </strong> {this.state.workdoneData.lesson}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Description: </strong> {this.state.workdoneData.details}
</Grid>
</Grid>
</Card>
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>
<Grid item xs={12} sm={12} md={12}>
<strong>Attachments: </strong> {this.state.workdoneData.path}
</Grid>
</Grid>
</Card>

</div>
</PerfectScrollbar>
</Box>
</Drawer> */}


</div>
</Animated>
</Dialog>


    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
