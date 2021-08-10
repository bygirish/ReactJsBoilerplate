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

class RoomReallocationManagement extends React.Component { 
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
            holidays:[{id:1, name:'test'}],
            startdate:new Date(),
            enddate: new Date(),
            confirmPanel:false,
            activePanelType:true,  
            selectedTab:'',
            selectedSubTab:'', 
            error: '',
            activeSidebarTab:"room_structure",
            alert: null,
            roomholders: [{ block_name: '', no_of_floors: '' }],     
            loading:true,
            selectedBoard:'',
            basicNotify:false,
            selectedOrganizationId:this.props.data.selectedOrganizationId,
            selectedInstitutionId:this.props.data.selectedInstitutionId,
            selectedBoard:this.props.data.selectedBoardId,
            selectedAcademicYear:this.props.data.selectedAcademicId, 
        };
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
          console.log(response)
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

    componentDidMount() {
       this.getBlocksData();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/hostel-management")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Allocated History
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv" justify="center">

                                <Grid item xs={12} md={8} lg={8}>                                    

                                    {/* Room Rent section */}
                                    <Grid container spacing={0} justify="center" className="sliderDiv">
                                      
                                        {this.state.blocksList.map((element,key) => (

                                            <Grid item xs={12} sm={12} lg={9}>
                                            <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                <Grid container spacing={2} justify="center">
                                                <Grid item xs={12} sm={12} lg={3}>
                                                    <h5>{key + 1}</h5>
                                                    <div><small>{element.block_name}</small></div> 
                                                </Grid>
                                                <Grid item xs={12} sm={12} lg={9}>
                                                    <Grid container spacing={1} justify="center">
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{element.no_of_floors}</h5>
                                                        <div><small>Floors</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{element.no_of_rooms}</h5>
                                                        <div><small>Rooms</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{element.no_of_beds}</h5>
                                                        <div><small>Beds</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{element.gross_fee}</h5>
                                                        <div><small>Gross Rent</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2} justify="center">   
                                                        <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-block-rooms-master/"+element.id)}>Go</Button> 
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

export default connect(mapStateToProps, mapDispatchToPros)(RoomReallocationManagement);
