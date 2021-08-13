import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
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
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
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

class ScheduledVisitorManagement extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      loading:false,
      selectedBlockId:'',
      TabValue:0,
      checkAll:false,
      VisitorList:[],
      checked: [],
      startdate:new Date(),
      enddate: new Date(),
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'', 
      error: '',
      alert: null,  
      loading:true,
      selectedBoard:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

  getVisitorData = (type) => { 

    let function_name = '';

    const split = window.location.href.split("/"); 
    const visit_type= split[split.length - 2];
    const id = split[split.length - 1];

    if(visit_type == 'Scheduled'){
      function_name = 'getScheduledVisitorData';
    }else{
      function_name = 'getAllVisitorData';
    }

    this.setState({VisitType : visit_type});

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      Id:id,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };

    //console.log(postData);
    //return false;
    new Service().apiCall('VisitorManagement/'+function_name,postData).then(response => { 
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
        });
    
        this.setState({ VisitorList: data }); 
      }else{
        this.setState({ VisitorList: []});
      }
    }).catch(error => {
      console.log(error); 
    });
  }

  componentDidMount() {
    this.getVisitorData();
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
                                  {this.state.VisitType == "Scheduled" ? 
                                  <>
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/scheduled-visitors")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    
                                    <Typography variant="h4" className="p-12">
                                      Scheduled Visitor
                                    </Typography>
                                  </>
                                  :
                                  <>
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/view-visitor-data")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    
                                    <Typography variant="h4" className="p-12">
                                      Visitor Detail
                                    </Typography>
                                  </>
                                  }
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container justify="center" spacing={4} className="sliderDiv">
                                <Grid item xs={12} md={12} lg={5}>
                                    <Card className="card-box  mb-4 p-3 customNoData">
                                        <Grid container>
                                            <Grid item xs={12} md={12} lg={12}>
                                              <div className="card-header pl-0">
                                                  <div className="card-header--title">
                                                      <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                      {this.state.VisitType == "Scheduled" ? 'Scheduled Visitor Detail' : 'Visitor Detail' }
                                                      </h4>
                                                  </div>
                                              </div>

                                              {this.state.VisitorList.map((element,index) => 
                                                <>
                                                  <h6>{element.name} - {element.phone}</h6>
                                                  <p>{element.date} - {element.time}</p>
                                                  <p>To Visit : {element.person_type}</p>
                                                  <p>Visit To : {element.person}</p>
                                                  <p>Type of Visit : {element.type}</p>
                                                  <p>Purpose of Visit : {element.purpose}</p>
                                                  <p>Age of Visitor : {element.age}</p>
                                                  <p>Gender of Visitor : {element.sex}</p>
                                                  <p>Status : {element.status}</p>
                                                  <p>Address : {element.address}</p>
                                                </>
                                              )}
                                                
                                            </Grid> 
                                        </Grid>

                                        <Grid container className="mt-2">
                                            <Grid item xs={12} sm={12} md={12} className="text-right">
                                              {this.state.VisitType == "Scheduled" ?
                                                <Button className="m-2" variant="outlined" color="secondary" onClick={()=>this.props.history.push("/admin/scheduled-visitors")}>Close</Button>
                                                :
                                                <Button className="m-2" variant="outlined" color="secondary" onClick={()=>this.props.history.push("/admin/view-visitor-data")}>Close</Button>
                                              }
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(ScheduledVisitorManagement);
