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

class StudentRoomManagement extends React.Component {
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

blocksList = (type) => {
  //let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  const split = window.location.href.split("/");
  const blockid= split[split.length - 2];

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
    //let blockid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const split = window.location.href.split("/");
    const blockid= split[split.length - 2];
    const student_UID = split[split.length - 1];

    this.setState({studentUID : student_UID});

    let floor_no = id_floor;   
    const postData = {
        id_organization: this.state.selectedOrganizationId,
        id_institute: this.state.selectedInstitutionId,
        token: "abc",
        id_block: blockid,
        floor_no: floor_no,
        id_user: this.props.data.UID,
        id_board: this.state.selectedBoard,
        id_academicyear: this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('HostelRooms/getRoomAllocatedData',postData).then(response => {
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
                                  <Grid container spacing={4} justify="center"> 
                                    <Grid item xs={12} sm={12} lg={10}>
                                        <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3">
                                          <Grid container>
                                              <Grid item xs={12} md={12} lg={12}>
                                                  <div className="card-header pl-0">
                                                      <div className="card-header--title">
                                                          <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                              Room Details
                                                          </h4>
                                                      </div>
                                                  </div>

                                                  <ReactTable
                                                    data={this.state.roomsDetails.map((original,key) => {
                                                      
                                                      return ({
                                                        slno: key+1,
                                                        id: original.id,
                                                        id_room: original.id_room,
                                                        block_id: original.id_block,
                                                        floor_no: original.floor_no,
                                                        bed_no: original.bed_no,
                                                        no_of_installments: original.no_of_installments, 
                                                        deposit: original.deposit,                                                        
                                                        status: original.status,
                                                        room_no: original.room_no,
                                                        occupied_by: original.occupied_by,
                                                        occupied: original.occupied,
                                                        actions: (
                                                          // we've added some custom button actions
                                                          <div>
                                                                    
                                                            {/* use this button to remove the data row */}
                                                                
                                                            {original.occupied == '' && <Tooltip id="tooltip-top" title="Select" placement="top">
                                                              <FormControlLabel
                                                                value="end"
                                                                control={<Checkbox color="primary" onClick={()=>this.props.history.push("/admin/student-room-joining/"+original.id_block+"/"+original.floor_no+"/"+original.id_room+"/"+original.bed_no+"/"+this.state.studentUID)} />}
                                                                label=""
                                                                labelPlacement="end"
                                                              />
                                                              </Tooltip>}
                                                              {!original.occupied == '' && original.occupied}
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
                                                  filterable: false
                                                  },
                                                  {
                                                  Header: "Room No.",
                                                  accessor: "room_no",
                                                  className: "center",
                                                  filterable: false
                                                  },
                                                  {
                                                  Header: "Bed No.",
                                                  accessor: "bed_no",
                                                  className: "center",
                                                  filterable: false                                                          
                                                  },
                                                  {
                                                  Header: "Occupied By",
                                                  accessor: "occupied_by",
                                                  className: "center",
                                                  filterable: false,
                                                  },
                                                  {
                                                  Header:"Select", 
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
                                          
                                        </div>
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

export default connect(mapStateToProps, mapDispatchToPros)(StudentRoomManagement);
