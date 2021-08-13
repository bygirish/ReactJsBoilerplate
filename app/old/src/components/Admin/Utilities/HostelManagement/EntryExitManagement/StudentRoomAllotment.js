import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NextIcon from '@material-ui/icons/NavigateNext';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../../config';
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

class StudentRoomAllotmentManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:'room_structure',
      loading:false,
      selectedBlockId:'',
      TabValue:0,
      checkAll:false,
      blocksList:[],
      checked: [],
      foodDetails: [],
      joining_data:new Date(),
      enddate: new Date(),
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'', 
      foodtype: 'Veg',
      error: '',
      activeSidebarTab:"room_structure",
      alert: null,
      articleholders: [{ articles: '', quantity: '' }],     
      loading:true,
      selectedBoard:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }


  getFoodData = (type) => { 
    //let id_block = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    const split = window.location.href.split("/");
    const id_block= split[split.length - 5];

    //console.log(floor_no);
    this.setState({ selectedBlock: id_block}); 

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      type:type,
      id_block:id_block,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    console.log(postData);
    new Service().apiCall('HostelFoodFees/getAllocationData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
      });      
          this.setState({ foodDetails: data }); 
      }else{
          this.setState({ foodDetails: []});
      }
    }).catch(error => {
      alert(error);
    });
  }

  setData = (name,value) => {
    this.setState({[name]:value});
  }


  handleJoiningDate = (x) => {
    //console.log(x);
    let data = moment(x).format("YYYY-MM-DD");
    this.setState({ joining_data : data })
  };


addArticle = ()=>{
    let data = this.state.articleholders;
    let object={articles: '', quantity: ''};
    data.push(object);
    this.setState({data});
}

removeArticle = (index) =>{
    const {articleholders} = this.state;
    this.setState({ articleholders : articleholders.filter((data,i)=> i!==index)})
}

getBlocksData = (id,type) => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    type:type,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
  };
  new Service().apiCall('HostelBlocks/getData',postData).then(response => {
    //console.log(response)
    if (response.status==200 && response.data!='') {
      const data = response.data.map((data) => {
        return {...data, checked: false, editable: false, gross_rent:0};
      });
  
      this.setState({ blocksList: data }); 
    }else{
      this.setState({ blocksList: []});
    }
  }).catch(error => {
    console.log(error); 
  });
}

  handleChangeData = (index, name,value) => {
    let data = this.state.articleholders;
    data[index][name] = value;
    this.setState({ data });
  };

  insertStudentAllotment = () =>{ 
    let headingStatus = "Room Allotment Inserted!";

    const split = window.location.href.split("/");
    const blockid= split[split.length - 5];
    const floor_no = split[split.length - 4];
    const id_room = split[split.length - 3];
    const bed_no = split[split.length - 2];
    const studentUID = split[split.length - 1];

    let food_type = this.state.foodtype; 
    let joining_date = this.state.joining_data;  

    const postData = {
      id_organization : this.props.data.selectedOrganizationId,
      id_institute : this.props.data.selectedInstitutionId,
      id_board : this.props.data.selectedBoardId,   
      id_academicyear : this.props.data.selectedAcademicId,  
      articleDetails : this.state.articleholders,
      studentDetails : this.state.articleholders,
      token : "abc",
      block_id : blockid,
      floor_no : floor_no,
      id_room : id_room,
      bed_no : bed_no,
      studentUID : studentUID,
      food_type : food_type, 
      joining_date: joining_date,
      id_user: this.props.data.UID,
    };
    //console.log(postData);
    
    new Service().apiCall('HostelRooms/insertStudentRoomAllotment',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        }); 
        //this.getRoomData(this.state.selectedFloor); 
        this.props.history.push("/admin/student-room-allocation-recipt/"+studentUID);
        setTimeout(() => {
          this.setState({ basicNotify:false, roomholders:[{room_type: '', room_no: '', no_of_beds: ''}], types:''});
        }, 2000) 
      
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });
  }

  componentDidMount() {
   this.getBlocksData();
   this.getFoodData();
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
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/hostel-entry-exit")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Room Allocation To Student
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} justify="center" className="sliderDiv">                                

                                <Grid item xs={12} md={12} lg={9}>
                                    {/* Room Structure section */}
                                    {this.state.actionType == "room_structure" && <div>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box mb-4 p-4">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Joining date and food type
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-body">   
                                                                            <Grid container spacing={0}>                                                                         
                                                                                <Grid item xs={12} sm={10} md={5}>
                                                                                    <FormControl component="fieldset">
                                                                                        <FormLabel component="legend">Joining Date:</FormLabel>
                                                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                                            <KeyboardDatePicker
                                                                                            autoOk
                                                                                            margin="normal"
                                                                                            id="date-picker-dialog"
                                                                                            format="MM/dd/yyyy"
                                                                                            value={this.state.joining_data}
                                                                                            onChange={(x)=>this.handleJoiningDate(x)} 
                                                                                            KeyboardButtonProps={{
                                                                                            'aria-label': 'change date',
                                                                                            }} />
                                                                                        </MuiPickersUtilsProvider> 
                                                                                    </FormControl>                                                                                    
                                                                                </Grid>

                                                                                <Grid item xs={12} sm={10} md={7}>
                                                                                    <FormControl component="fieldset">
                                                                                        <FormLabel component="legend">Food Type:</FormLabel>
                                                                                        <RadioGroup row aria-label="position" name="foodtype" defaultValue="top" value={this.state.foodtype} onChange={(e)=>this.setData("foodtype", e.target.value)}>
                                                                                            {this.state.foodDetails.map((original,key) => (
                                                                                               <FormControlLabel value={original.food_type} control={<Radio color="primary" />} checked={original.food_type == this.state.foodtype} label={original.food_type+" -Rs."+ original.fee_per_annum}
                                                                                               />                  
                                                                                            ))}
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container>
                                                                    <Grid item xs={12} md={12} lg={12}>
                                                                        <div className="card-body">   
                                                                        {this.state.articleholders.map((element,index)=>(
                                                
                                                                            <Grid container spacing={4}>

                                                                                <Grid item xs={12} sm={10} md={7}> 
                                                                                    <FormControl fullWidth>
                                                                                        <TextField 
                                                                                        inputProps={{
                                                                                            autoComplete: 'off',
                                                                                            style: {textTransform: 'capitalize'}
                                                                                        }}
                                                                                        onChange={(event)=>this.handleChangeData(index,"articles",event.target.value)}
                                                                                        value={element.articles}
                                                                                        id="document-type"   
                                                                                        label="Articles" 
                                                                                        type="search" 
                                                                                        variant="outlined" />
                                                                                        </FormControl>
                                                                                </Grid> 

                                                                                <Grid item xs={12} sm={10} md={4}>
                                                                                    <FormControl fullWidth>
                                                                                        <TextField 
                                                                                        inputProps={{
                                                                                        autoComplete: 'off',
                                                                                        style: {textTransform: 'capitalize'}
                                                                                        }}
                                                                                        onChange={(event)=>this.handleChangeData(index,"quantity", event.target.value)}
                                                                                        value={element.quantity}
                                                                                        id="document-type"   
                                                                                        label="Quantity" 
                                                                                        type="search" 
                                                                                        variant="outlined" />
                                                                                        </FormControl>
                                                                                </Grid>

                                                                                <Grid item xs={12} sm={12} lg={1}>
                                                                                {index == 0 ?  <FormControl fullWidth>
                                                                                        <TextField 
                                                                                        InputProps={{
                                                                                            autoComplete: 'off',
                                                                                            readOnly: true,
                                                                                            startAdornment: (
                                                                                            <InputAdornment position="start">
                                                                                            <Add onClick={()=>this.addArticle()} style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
                                                                                            </InputAdornment>
                                                                                            ),
                                                                                            }}
                                                                                            id="document-type" label="Add" variant="outlined" />
                                                                                    </FormControl>:
                                                                                    <FormControl fullWidth>
                                                                                    <TextField 
                                                                                    InputProps={{
                                                                                        autoComplete: 'off',
                                                                                        readOnly: true,
                                                                                        startAdornment: (
                                                                                        <InputAdornment position="start">
                                                                                        <Remove onClick={()=>this.removeArticle(index)} style={{color:'rgb(248, 50, 69)', cursor:'pointer'}} />
                                                                                        </InputAdornment>
                                                                                        ),
                                                                                        }}
                                                                                        id="document-type" label="Add" variant="outlined" />
                                                                                </FormControl>}
                                                                                </Grid>
                                                                            </Grid>
                                                                            ))}
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>  
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        
                                        <Grid container justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                    {this.state.foodDetails.map((element,key) => (
                                                        <>
                                                          {element.food_type == this.state.foodtype &&
                                                        <Grid item xs={12} sm={12} lg={10}>
                                                            <Grid container spacing={1} justify="center">
                                                            
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.deposit}</h5>
                                                                    <div><small>Deposit</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.fee_per_annum}</h5>
                                                                    <div><small>Rent Per Annum</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.fee_per_annum}</h5>
                                                                    <div><small>Food Per Annum</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.no_of_installments}</h5>
                                                                    <div><small>Installments</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.fee_per_annum}</h5>
                                                                    <div><small>Per Month</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.first_due}</h5>
                                                                    <div><small>First Due</small></div>
                                                                </Grid>
                                                                    
                                                            </Grid>
                                                        </Grid>
                                                        }
                                                       </>
                                                        ))}
                                                        
                                                        <Grid item xs={12} sm={12} lg={2}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12} sm={12} lg={12} className="text-right">
                                                                    <Button className="successBtnOutline" variant="outlined" onClick={()=>this.insertStudentAllotment()}>Submit</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>}

                                    
                                    </Grid>
                
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentRoomAllotmentManagement);
