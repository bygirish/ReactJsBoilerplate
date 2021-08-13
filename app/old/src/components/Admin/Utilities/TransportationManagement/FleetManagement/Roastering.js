import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
  KeyboardTimePicker,
  KeyboardDatePicker,
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

class ViewRosteringManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        showStatus:'all',
        dialogOpen:true,
        actionType:'overview',
        loading:false,
        TabValue:0,
        checkAll:false,
        id_block:'',
        floor_no:'',
        messageCenterSelectedSections:[],
        messageCenterSelectedSectionsIds:[],
        groupChecked:[],
        selectedStandards:[],
        selectedStaff:[],
        monthDetails:[],
        checked: [],
        RoleDetails:[],
        RosteringDetails:[],
        StaffToRole:[],
        selectedBoard:'',
        lcontactnumber:'',
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId,    
        lsearchname:'',
        searchtableData:[],
        basicNotify:false,
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId, 
        tableColumns : [
            {
                Header: "S No",
                accessor: "slno",
                width: 80,
                className: "center",
                filterable: false
            },
            {
                Header: "Role",
                accessor: "role",
                className: "center",
                filterable: false
            },
            {
                Header: "Type",
                accessor: "type",
                className: "center",
                filterable: false
            },
            {
                Header: "Start Time",
                accessor: "start_time",
                className: "center",
                filterable: false
            },
            {
                Header:"Months",
                accessor: "month",
                className: "center",
                sortable: false,
                filterable: false,
            }
            ]
        };
    }


    searchStaff = (values,index) => {
        //console.log(values);
        const Roles = this.state.Roles;
        values.map((myList) =>  {
            if(Roles[index].staffs.includes(myList.UID)){
                
            }
            else{
                Roles[index].staffs.push(myList.UID);
            }
        }); 
        //console.log(Roles);
        this.setState({Roles});
        
    }

    getStaffs = (type) => {
    
        const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        type:type,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        };
        //console.log(postData);
        new Service().apiCall('Staffs/getData',postData).then(response => {
        //console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
            return {...data, checked: false, editable: false};
        });
        
            this.setState({ StaffToRole: data }); 
        }else{
            this.setState({ StaffToRole: []});
        }
        }).catch(error => {
        alert(error);
        }); 
    }

    getStaffs = (type) => {
    
        const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        type:type,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        };
        //console.log(postData);
        new Service().apiCall('Staffs/getData',postData).then(response => {
        //console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
            return {...data, checked: false, editable: false};
        });
        
            this.setState({ StaffToRole: data }); 
        }else{
            this.setState({ StaffToRole: []});
        }
        }).catch(error => {
        alert(error);
        }); 
    }

    getRoleMaster = (month, type) => {
    
        const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        type:type,
        month:month,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        };
        //console.log(postData);
        new Service().apiCall('HostelStaffAllocations/getShiftData',postData).then(response => {
        //console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
            
            
            this.setState({ RoleDetails : data }); 
        }else{
            this.setState({ RoleDetails : [] });
        }
        
        }).catch(error => {
            console.log(error);
        });
    }

    getRosteringData = (month, type) => {
    
        const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        type:type,
        month:month,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        };
        console.log(postData);
        new Service().apiCall('HostelStaffAllocations/getRosteringData',postData).then(response => {
        console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
            
            
            this.setState({ RosteringDetails : data }); 
        }else{
            this.setState({ RosteringDetails : [] });
        }
        
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount(){
        let month = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        this.getStaffs();
        this.getRoleMaster(month);
        this.getData();
        this.getRosteringData(month);
    }

    getData(){
        let month = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        //console.log('days'+ moment(new Date().getFullYear()+"-="+month, "YYYY-MM").daysInMonth());
        let numberOfDays = moment(new Date().getFullYear()+"-="+month, "YYYY-MM").daysInMonth();
        let lColumnsList = this.state.tableColumns;
        for(var i=0; i < numberOfDays ; i++){
            
            var j = i+1;
            let lColumn = {};
            lColumn.Header = "Day" + j;
            lColumn.accessor = "actions";
            lColumn.className = "center";
            lColumn.sortable = false;
            lColumn.filterable = false;
            lColumnsList.push(lColumn);
        }
        this.setState({tableColumns : lColumnsList});
        
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/staff-allocation")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Rostering
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} justify="center">
                                <Grid item xs={12} md={12} lg={11}>
                                    <Card className="card-box  mb-4 p-3 customNoData">
                                        <Grid container>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <div className="card-header pl-0">
                                                    <div className="card-header--title">
                                                        <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                            Rostering
                                                        </h4>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid> 


                                        <ReactTable style={{"overflow-x":"scroll"}}

                                            data={this.state.RoleDetails.map((original, key) => {
                                                let month = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);                                              
                                                let numberOfDays = moment(new Date().getFullYear()+"-="+month, "YYYY-MM").daysInMonth();
                                                return ({
                                                    slno: key+1,
                                                    role:original.name,
                                                    type:original.working_type,
                                                    start_time:original.start_time, 
                                                    month:'jan',
                                                    actions: (
                                                        // we've added some custom button actions
                                                        
                                                        <div>
                                                            <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                <Button
                                                                    className="m-2"
                                                                    simple
                                                                    onClick={()=>this.props.history.push("/admin/get-rostering/")}
                                                                    color="secondary"
                                                                    className="Edit"
                                                                    >
                                                                    <AddCircleIcon/>
                                                                    </Button> 
                                                            </Tooltip> 
                                                        </div>
                                                    )
                                                                                                  
                                                })
                                            })
                                            }
                                            
                                            

                                            filterable
                                            minRows={0}
                                            columns={this.state.tableColumns}
                                            defaultFilterMethod={filterCaseInsensitive}
                                            defaultPageSize={10}
                                            showPaginationTop={false}
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />
                                        

                                        <Grid container spacing={4}>
                                            <Grid item xs="12" md={12} lg={12} className="text-right">
                                                <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.insertStafftoRole()}>Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(ViewRosteringManagement);
