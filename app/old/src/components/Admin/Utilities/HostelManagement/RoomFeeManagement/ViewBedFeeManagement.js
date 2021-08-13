import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem, MenuItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
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

class HostelBedFeeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      loading:false,
      TabValue:0,
      checkAll:false,
      roomsDetails:[],
      blockDetails:[{no_of_floors:''}],
      checked: [],
      id:'',
      roomType:["Boys", "Girls"],
      startdate:new Date(),
      enddate: new Date(),
      selectedTab:'',
      selectedSubTab:'', 
      load: false,
      error: '',
      activeSidebarTab:"floor_1",
      selectedFloor:1,
      roomholders: [{room_type: '', room_no: '', no_of_beds: '' }],
      loading:true,
      boardDetails:[],
      selectedBoard:'',
      lcontactnumber:'', 
      lsearchname:'',
      types:'',
      searchtableData:[],
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

handleDeactive = (id,status) => {
  let headingStatus = "Room Activated!";
  if(status == 1){
    headingStatus = "Room Deactivated!";
  }

  const postData = {
    id: id, 
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,  
    token:"abc",
    id_user: this.props.data.UID
  };
  new Service().apiCall('HostelRooms/deleteHostelRooms',postData).then(response => {
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
     this.getRoomData(this.state.selectedFloor);
      setTimeout(() => {
        this.setState({ basicNotify:false});
      }, 2000) 
 
    } else {
      //this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
   // this.raiseLoginSignupErrorAlert("signup"); 
  });
}

insertRooms = () => {
  let headingStatus = "Rooms Inserted!";
  let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  let floor_no = this.state.selectedFloor;
  let types = this.state.types;   
  const postData = {
    id_organization : this.props.data.selectedOrganizationId,
    id_institute : this.props.data.selectedInstitutionId,
    id_board : this.props.data.selectedBoardId,   
    id_academicyear : this.props.data.selectedAcademicId,  
    rooms : this.state.roomholders,
    token : "abc",
    block_id : blockid,
    floor_no : floor_no,
    types:types,
    id_user: this.props.data.UID
  };
  //console.log(postData);
  
  new Service().apiCall('HostelRooms/insertRoom',postData).then(response => {
    //console.log(response);
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
     this.getRoomData(this.state.selectedFloor); 
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

UpdateHeading = (id,index) => {
  let data = this.state.roomsDetails;
  let heading = data[index].room_type;
  let room_no = data[index].room_no;
  let no_of_beds = data[index].no_of_beds;
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,   
    id_academicyear:this.props.data.selectedAcademicId,  
    id:id,
    room_type:heading,
    room_no:room_no,
    no_of_beds:no_of_beds,
    token:"abc",
    id_user: this.props.data.UID
  };
  new Service().apiCall('HostelRooms/updateRoom',postData).then(response => {
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
          <div className="text-center p-5">
          <h4 className="font-weight-bold">Room Updated</h4>
          </div>
          </Dialog>
        ),
      });
     this.getRoomData(this.state.selectedFloor);
      setTimeout(() => {
        this.setState({ basicNotify:false});
      }, 2000) 
    } else {
     // this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
      //console.log(error);
    //this.raiseLoginSignupErrorAlert("signup");
  });
}

renderFloors = () =>{
  let total_floors = this.state.blockDetails[0].no_of_floors;
  //console.log(this.state.blockDetails && this.state.blockDetails[0].no_of_floors);
  let data =[];
  for(let i=1;i<=total_floors;i++){
     data.push(
        <ListItem button className={this.state.activeSidebarTab == "floor_"+i ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({activeSidebarTab:"floor_"+i,showStatus:'all',selectedFloor:i});this.getRoomData(i)}}>
          <span>Floor {i}</span>                                                        
      </ListItem>      
    )
  }
  return data;
}

addRoom = ()=>{
  let data = this.state.roomholders;
  let object={room_type:'', room_no:'', no_of_beds: ''};
  data.push(object);
  this.setState({data});
}

removeRoom = (index) =>{                                                  
  const {roomholders} = this.state;
  this.setState({ roomholders : roomholders.filter((data,i)=> i!==index)})
}

//selectRoomType = (index, value, id) => {
  // let Data = [...this.state.roomholders];
  // Data[index].room_type = value;
  // this.setState({Data});
//}

blocksList = (type) => {
  let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    block_id:blockid,
    type:type,
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
  };
  //console.log(postData);
  new Service().apiCall('HostelBlocks/getData',postData).then(response => {
    console.log(response)
    if (response.status==200 && response.data!='') {
      const data = response.data.map((data) => {
        return {...data, checked: false, editable: false};
    });
  
      this.setState({ blockDetails: data }); 
    }else{
      this.setState({ blockDetails: []});
    }
  }).catch(error => {
    alert(error);
  });
}

getRoomData = (id_floor) =>{ 
    this.setState({  roomsDetails: []});
    let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let floor_no = id_floor;   
    const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        block_id:blockid,
        floor_no:floor_no,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('HostelRooms/getData',postData).then(response => {
        console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
    
            this.setState({ roomsDetails: data }); 
        }else{
            this.setState({  roomsDetails: []});
        }
    }).catch(error => {
        console.log(error);
    });
}

rowEdit = (estatus,index) => {
  let rooms = this.state.roomsDetails;
  if(estatus == true){
    rooms[index].editable = false;
  }
  else{
    rooms[index].editable = true;
  }
  this.setState({ rooms });
}  

handleInputChange = (cellInfo, event) => {
  let data = [...this.state.roomsDetails];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};

handleChangeData = (index, name,value) => {
  let data = this.state.roomholders;
  data[index][name] = value;
  this.setState({ data });
};

renderEditable = (cellInfo) => {

   const cellValue = this.state.roomsDetails[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl >
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={cellValue}
          placeholder={"Room Type"}
          type="text" 
          onChange={event => this.handleInputChange(cellInfo,event)}
          />
        </FormControl>      
      );      
    }
    else{
      return cellValue;
    }
}

componentDidMount() {
  this.blocksList();
  this.getRoomData(this.state.selectedFloor);
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/room-fee-master")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        View Rooms For Block
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv">
                                <Grid item xs={12} md={8} lg={3}>
                                    <Card className="card-box ml-4 mb-4">
                                        <div className="text-center">
                                            <div className="pt-1">
                                                <List className="py-2">

                                                {this.renderFloors()}
                                                
                                                </List>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>  

                                <Grid item xs={12} md={8} lg={9}> 

                                    <Grid container spacing={0} justify="center" className="sliderDiv">
                                      
                                        {this.state.roomsDetails.map((element,key) => (

                                            <Grid item xs={12} sm={12} lg={9}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                        <Grid item xs={12} sm={12} lg={4}>
                                                            <h5>{key + 1}</h5>
                                                            <div><small>{element.room_type}</small></div>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} lg={8}>
                                                            <Grid container spacing={1} justify="center">
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.floor_no}</h5>
                                                                    <div><small>Floor No.</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.room_no}</h5>
                                                                    <div><small>Room No.</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.no_of_beds}</h5> 
                                                                    <div><small>Beds</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>0</h5>
                                                                    <div><small>Gross Rent</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">
                                                                    <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-room-fee-master/"+element.id_block+"/"+element.floor_no+"/"+element.id)}>Go</Button> 
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>                                      
                                
                                </Grid>
                
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(HostelBedFeeManagement);
