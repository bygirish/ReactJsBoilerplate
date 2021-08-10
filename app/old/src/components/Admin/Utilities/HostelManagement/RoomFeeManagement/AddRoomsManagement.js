import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem, MenuItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import DialogActions from '@material-ui/core/DialogActions';
import Brightness1Icon from '@material-ui/icons/Brightness1';
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
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
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

class AddRoomsManagement extends React.Component {
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
      roomType:["Boys","Girls"],
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


  
handleClose =() =>{
  this.setState({basicNotify:false});
}


insertRooms = event => { 
  event.preventDefault();

  let headingStatus = "Rooms Inserted!";
  let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  let floor_no = this.state.selectedFloor;
  let types = this.state.types;   

  if(types === ""){
    this.setState({
      basicNotify: (
        <Dialog open={true}>
        <div className="p-5">
          <h6 className="font-weight-bold"> 
            <div style={{color:'red', fontSize:13, marginBottom:10}}><Brightness1Icon style={{fontSize:12}} /> Please Select Type</div>
          </h6>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      )
    });
    return false;
  }

  for(var i =0; i< this.state.roomsDetails.length; i++ ) {
    for(var j= 0; j< this.state.roomholders.length;j++) {
      if(this.state.roomsDetails[i].id_block === blockid && this.state.roomsDetails[i].room_no === this.state.roomholders[j].room_no && this.state.roomsDetails[i].type === types) {          
        this.state.roomholders.splice(j,1);
        break;            
      }
    }
  }

  //console.log(this.state.roomholders);
  //return false;
  
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

getBlockData = (type) => {
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
    //console.log(response)
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

verifyNumber = value => {
  var numberRex = new RegExp("^[0-9]+$");
  if (numberRex.test(value)) {
    return true;
  }
  return false;
};

handleChangeData = (index, name,value) => {
  let data = this.state.roomholders;
  let numberCheck = ["room_no","no_of_beds"];

  if(numberCheck.includes(name)){
    if (this.verifyNumber(value)){
      data[index][name] = value;
    }
  }
  else{
    data[index][name] = value;
  }
  
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
  this.getBlockData();
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
                                        Create and View Rooms
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
                                    {/* Room Structure section */}
                                        <Grid container spacing={4} justify="center">
                                            
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                  <form  onSubmit={this.insertRooms.bind(this)} autoComplete="off">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Room for Floor {this.state.selectedFloor}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} sm={10} md={4}>  
                                                            <FormControl fullWidth>
                                                                <TextField                        
                                                                    id="outlined-select-currency"
                                                                    select
                                                                    label="Select Type"
                                                                    variant="outlined"
                                                                    value={this.state.types}
                                                                    onChange={(event) => this.setState({types:event.target.value})} required>
                                                                    {this.state.roomType.map(option => (
                                                                      <MenuItem key={option} value={option} id={option}>
                                                                        {option}
                                                                      </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Grid>
                                                      </Grid>

                                                {this.state.roomholders.map((element,index)=>(                                                
                                                    <Grid container spacing={4}>                                                        
                                                        <Grid item xs={12} sm={10} md={4}> 
                                                            {/* <FormControl fullWidth>
                                                                <TextField
                        
                                                                    id="outlined-select-currency"
                                                                    select
                                                                    label="Select Room Type"
                                                                    variant="outlined"
                                                                    value={this.element}
                                                                    onChange={(event, child) => this.selectRoomType(index,event.target.value,child.props.id)}>
                                                                    {this.state.roomType.map(option => (
                                                                        <MenuItem key={option} value={option} id={option}>
                                                                        {option}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl> */}
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'}
                                                                }}
                                                                onChange={(event)=>this.handleChangeData(index,"room_type", event.target.value)}
                                                                value={element.room_type}
                                                                id={"room_type"+(index + 1)}   
                                                                label="Room Type" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                                </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} sm={10} md={4}>
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'}
                                                                }}
                                                                onChange={(event)=>this.handleChangeData(index,"room_no", event.target.value)}
                                                                value={element.room_no}
                                                                id={"room_no"+(index + 1)}
                                                                
                                                                label="Room No." 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                                </FormControl>
                                                        </Grid>                                                        

                                                        <Grid item xs={12} sm={10} md={3}>
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'}
                                                                }}
                                                                onChange={(event)=>this.handleChangeData(index,"no_of_beds", event.target.value)}
                                                                value={element.no_of_beds}
                                                                id={"no_of_beds"+(index + 1)} 
                                                                label="No. of Beds" 
                                                                type="search" 
                                                                variant="outlined" required/>
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
                                                                    <Add onClick={()=>this.addRoom()} style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
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
                                                                <Remove onClick={()=>this.removeRoom(index)} style={{color:'rgb(248, 50, 69)', cursor:'pointer'}} />
                                                                </InputAdornment>
                                                                ),
                                                                }}
                                                                id="document-type" label="Del" variant="outlined" />
                                                        </FormControl>}
                                                        </Grid>
                                                    </Grid>
                                                    ))}

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
                                                        </Grid>
                                                    </Grid>
                                                  </form>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Rooms Details
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <ReactTable
                                                                data={this.state.roomsDetails.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        room_type: original.room_type,
                                                                        room_no:original.room_no,
                                                                        no_of_beds:original.no_of_beds,
                                                                        type : original.type,
                                                                        editable:original.editable,
                                                                        status:original.status,
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div> 
                                                                                { /* use this button to add a like kind of action */ }

                                                                                <Tooltip id="tooltip-top" title={original.editable ? "Update":"Edit"} placement="top" > 
                                                                                    {original.editable ?<Button className="m-2" simple onClick={()=> {this.setState({selectedHeading:original.name}); this.UpdateHeading(original.id,key);}} color="secondary" className="edit">
                                                                                    <CheckCircleOutline />
                                                                                    </Button> :
                                                                                    <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={()=> {this.setState({selectedHeading:original.name}); this.rowEdit(original.editable,key);}}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                        >
                                                                                        <EditIcon />
                                                                                    </Button>
                                                                                    }
                                                                                </Tooltip>
                                                                                        
                                                                            {/* use this button to remove the data row */}
                                                                                    
                                                                                <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                          <Switch
                                                                                          checked={original.status == "1" ? true:false}
                                                                                          onChange={() => this.handleDeactive(original.id,original.status)}
                                                                                          value="checkedA"
                                                                                      />
                                                                                        }
                                                                                
                                                                                    label=""/>
                                                                                </Tooltip>
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
                                                                id="slno"   
                                                                value={filter ? filter.value : ''}
                                                                placeholder="Search S No"
                                                                type="text" 
                                                                onChange={event => onChange(event.target.value)}
                                                                />
                                                                )
                                                              }, 
                                                              {
                                                                Header: "Type",
                                                                accessor: "type",
                                                                className: "center",
                                                                Filter: ({filter, onChange}) => (
                                                                  <TextField 
                                                                  inputProps={{
                                                                  autoComplete: 'off'
                                                                  }}         
                                                                  id="type"   
                                                                  value={filter ? filter.value : ''}
                                                                  placeholder="Search Type"
                                                                  type="text" 
                                                                  onChange={event => onChange(event.target.value)}
                                                                  />
                                                                ),
                                                                //Cell:this.renderTypeEditable
                                                              },
                                                              {
                                                                Header: "Room Type",
                                                                accessor: "room_type",
                                                                className: "center",
                                                                Filter: ({filter, onChange}) => (
                                                                  <TextField 
                                                                  inputProps={{
                                                                  autoComplete: 'off'
                                                                  }}         
                                                                  id="room_type"   
                                                                  value={filter ? filter.value : ''}
                                                                  placeholder="Room Type"
                                                                  type="text" 
                                                                  onChange={event => onChange(event.target.value)}
                                                                  />
                                                                ),
                                                                Cell:this.renderEditable
                                                              },
                                                              {
                                                                Header: "Room No.",
                                                                accessor: "room_no",
                                                                className: "center",
                                                                Filter: ({filter, onChange}) => (
                                                                  <TextField 
                                                                  inputProps={{
                                                                  autoComplete: 'off'
                                                                  }}         
                                                                  id="room_no"   
                                                                  value={filter ? filter.value : ''}
                                                                  placeholder="Room No"
                                                                  type="text" 
                                                                  onChange={event => onChange(event.target.value)}
                                                                  />
                                                                ),
                                                                Cell:this.renderEditable
                                                              },
                                                              {
                                                                Header: "No. of Beds",
                                                                accessor: "no_of_beds",
                                                                className: "center",
                                                                Filter: ({filter, onChange}) => (
                                                                  <TextField 
                                                                  inputProps={{
                                                                    autoComplete: 'off'
                                                                  }}         
                                                                  id="no_of_beds"   
                                                                  value={filter ? filter.value : ''}
                                                                  placeholder="Bed No"
                                                                  type="text" 
                                                                  onChange={event => onChange(event.target.value)}
                                                                  />
                                                                ),
                                                                Cell:this.renderEditable
                                                              },
                                                              // {
                                                              //   Header: "Occupants",
                                                              //   accessor: "occupants",
                                                              //   className: "center",
                                                              //   Filter: ({filter, onChange}) => (
                                                              //     <TextField 
                                                              //     inputProps={{
                                                              //     autoComplete: 'off'
                                                              //     }}         
                                                              //     id="document-type"   
                                                              //     value={filter ? filter.value : ''}
                                                              //     placeholder="Search Name"
                                                              //     type="text" 
                                                              //     onChange={event => onChange(event.target.value)}
                                                              //     />
                                                              //   )
                                                              // },
                                                              {
                                                                Header:"Actions",
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
                                                        </Grid>
                                                    </Grid>

                                                    
                                                </Card>
                                            </Grid>
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

export default connect(mapStateToProps, mapDispatchToPros)(AddRoomsManagement);
