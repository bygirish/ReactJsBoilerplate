import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider, MenuItem,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6'; 
import CustomAutocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js"; 
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import  "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import Moment from 'moment';

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

class StaffAllocationManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        showStatus:'all',
        dialogOpen:true, 
        actionType:'overview',
        role:'',
        role_name:'',
        loading:false,
        TabValue:0,
        checkAll:false,
        shifttype:'full_time',
        Overview:[],
        RoleMaster:[],
        StaffToRole:[],
        selectedStaff:[],
        blockDetails:[],
        RoleMappingDetails:[],
        staffAllocationType : 'block_wise',
        load: false,
        error: '',
        activeSidebarTab:"overview",
        shiftHolders: [{ from_time: Moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), to_time: Moment(new Date()).format("YYYY-MM-DD HH:mm:ss") }],   
        monthDetails:[{month:'January', month_id:1},{month:'February', month_id:2},{month: 'March', month_id:3},{month: 'April', month_id:4},{month: 'May', month_id:5},{month: 'June', month_id:6},{month: 'July', month_id:7},{month:'August', month_id:8},{month: 'September', month_id:9},{month: 'October', month_id:10},{month: 'November', month_id:11},{month:'December', month_id:12}],
        shift_count:1,
        selectedBoard:'',
        lcontactnumber:'',
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId,    
        lsearchname:'',
        searchtableData:[],
        staffArr:[],
        basicNotify:false,
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId, 
        };
    }

    handleTimeChange(index, name, datevlaue){
        let timer = this.state.shiftHolders;
        timer[index][name] = Moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
        this.setState({ timer });
    };

    searchStaff = (event,values) => {
        console.log(values);
        //this.setState({selectedStaff:values})
        let data =[];
        if(values){
            const listItems = values.map((myList, index) =>  
                data.push(myList.UID)         
            ); 
        }
      
        this.setState({selectedStaff:values, staffArr:data})
        //console.log(staffArr)    
    }


    addShift = ()=>{
        let data = this.state.shiftHolders;
        let shift_count = this.state.shift_count + 1;
        let object={from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")};
        data.push(object);
        this.setState({data});
        this.setState({shift_count:shift_count});
    }

    removeShift = (index) =>{
        const {shiftHolders} = this.state;
        let shift_count = this.state.shift_count - 1;
        this.setState({ shiftHolders : shiftHolders.filter((data,i)=> i!==index)});
        this.setState({shift_count:shift_count});
    }

    insertRoleMaster = event =>{
        event.preventDefault();

        let headingStatus = "Role Inserted!"; 
        let shifttype = this.state.shifttype;
        let shift_count = this.state.shift_count;
        let role = this.state.role;

        for(var i =0; i< this.state.RoleMaster.length; i++ ) {
            if(this.state.RoleMaster[i].name === this.state.role) { 
                         
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                        <div className="text-center p-5">
                            <h4 className="font-weight-bold">{this.state.role+' already exists'}</h4>
                        </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    this.setState({ basicNotify:false, shift_count:'', role:''});
                },1000);
                return false; 
                break;           
            }
        }
    
        const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,   
        id_academicyear:this.props.data.selectedAcademicId,  
        shifts:this.state.shiftHolders,
        token:"abc",
        name : role,
        working_type : shifttype,
        no_of_shifts:shift_count,
        id_user: this.props.data.UID
        };
        // console.log(this.state.role);
        // return false;
        new Service().apiCall('HostelStaffAllocations/insertData',postData).then(response => {
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
            this.getRoleMaster();
            setTimeout(() => {
            this.setState({ basicNotify:false, shift_count:'', role:'', shiftHolders:[{from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")}]});
            }, 2000) 
        
        } else {
            //this.raiseLoginSignupErrorAlert("signup");
        }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    getRoleMaster = (type) => {
    
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
        new Service().apiCall('HostelStaffAllocations/getData',postData).then(response => {
        console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
        
            this.setState({ RoleMaster: data }); 
        }else{
            this.setState({ RoleMaster: []});
        }
        }).catch(error => {
            console.log(error);
        });
    }

    deleteStaff = (val) =>{
        console.log(val);
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
            console.log(error);
        });
    }

    //GET ALL BLOCKS
    getBlocks = (type) => {
    
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
            console.log(error);
        });
    }
    

renderFloors = () =>{
    
    let data =[];
    {this.state.blockDetails.map((element,index) => {
        
        let total_floors = this.state.blockDetails[index].no_of_floors;
        //console.log(total_floors);
       
        for(let j=1;j<=total_floors;j++){
            data.push(
                <Grid item xs={12} sm={12} lg={8}>
                    <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-3 text-center">
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} sm={12} lg={4}>
                                <h5>{element.block_name}</h5>
                                <div><small>{index + 1}</small></div>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={8}>
                                <Grid container spacing={1} justify="center">
                                    <Grid item xs={12} sm={12} lg={2}>
                                        <h5>{j}</h5>
                                        <div><small>Floors</small></div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={2}>
                                        <h5>{this.state.blockDetails[0].no_of_rooms}</h5>
                                        <div><small>Rooms</small></div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={2}>
                                        <h5>{this.state.blockDetails[0].no_of_beds}</h5>
                                        <div><small>Beds</small></div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={2}>
                                        <h5>{this.state.blockDetails[0].gross_rent}</h5>
                                        <div><small>Gross Rent</small></div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={2} justify="center">
                                        <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff-to-hostel-allocation/"+j+"/"+element.id+"/"+this.state.staffAllocationType)}>Go</Button> 
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            );            
        }
    })}

    return data;
}

    //ADD STAFF TO ROLE
    insertStafftoRole = () => {
        let headingStatus = "Role Inserted!";  
        let role = this.state.role_name;
    
        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId,  
            staffs:this.state.staffArr,
            token:"abc",
            id_role:role,
            id_user: this.props.data.UID
        };
        console.log(postData);
        //return false;
        new Service().apiCall('HostelStaffAllocations/insertStaffMapping',postData).then(response => {
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
            this.getStaffRoleMapping();
            setTimeout(() => {
            this.setState({ basicNotify:false, shiftHolders:[{from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")}]});
            }, 2000) 
        
        } else {
            //this.raiseLoginSignupErrorAlert("signup");
        }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    //GET ALL BLOCKS
    getStaffRoleMapping = (type) => {
    
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
        new Service().apiCall('HostelStaffAllocations/getStaffMapping',postData).then(response => {
        //console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
            return {...data, checked: false, editable: false};
        });
        
            this.setState({ RoleMappingDetails: data }); 
        }else{
            this.setState({ RoleMappingDetails: []});
        }
        }).catch(error => {
            console.log(error);
        });
    }

    handleMappingDelete = (id,status) => {
        let headingStatus = "Role Mapping Activated!";
        if(status == 1){
          headingStatus = "Role Mapping Deactivated!";
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
        new Service().apiCall('HostelStaffAllocations/deleteStaffRole',postData).then(response => {
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
           this.getStaffRoleMapping();
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

    overview = (id,status) => {
        let headingStatus = "Role Mapping Activated!";
        if(status == 1){
          headingStatus = "Role Mapping Deactivated!";
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
        new Service().apiCall('HostelStaffAllocations/getHostelStaffMapping',postData).then(response => {
            //console.log(response)
            if (response.status==200 && response.data!='') {
                const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
            
                this.setState({ Overview: data }); 
            }else{
                this.setState({ Overview: []});
            }
            }).catch(error => {
                console.log(error);
        });
    }

    handleOverviewDelete = (id, status) => {
        let headingStatus = "Staff Mapping Activated!";
        if(status == 1){
          headingStatus = "Staff Mapping Deactivated!";
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
        console.log(postData);
        
        new Service().apiCall('HostelStaffAllocations/deleteStaffMapping',postData).then(response => {
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
           this.getStaffRoleMapping();
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
    

    componentDidMount() {
        this.getRoleMaster();
        this.getStaffs();
        this.getBlocks();
        this.overview();
        this.getStaffRoleMapping();
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
                                    Staff Allocation
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
                                                
                                                    <ListItem button className={this.state.actionType == "overview" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"overview",showStatus:'all'});}}>
                                                        <span>Overview</span>                                                        
                                                    </ListItem>

                                                    <Divider />
                                                    <ListItem button className={this.state.actionType == "role_master" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"role_master",showStatus:'all'});}}>
                                                        <span>Role Master</span>
                                                    </ListItem>

                                                    <Divider />
                                                    <ListItem button className={this.state.actionType == "staff_to_role" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"staff_to_role",showStatus:'all'});}}>
                                                        <span>Staff To Role</span>
                                                    </ListItem>

                                                    <Divider />
                                                    <ListItem button className={this.state.actionType == "staff_to_hostel" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"staff_to_hostel",showStatus:'all'});}}>
                                                        <span>Staff To Hostel</span>
                                                    </ListItem>

                                                    <Divider />
                                                    <ListItem button className={this.state.actionType == "rostering" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"rostering",showStatus:'all'});}}>
                                                        <span>Rostering</span>
                                                    </ListItem>

                                                </List>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>  

                                <Grid item xs={12} md={8} lg={9}>
                                    {/* Leave Application Section */}
                                    {this.state.actionType == "overview" && <div>

                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Staff Allocation
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <ReactTable
                                                                data={this.state.Overview.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        block: original.block_name,
                                                                        floor: original.floor_no,
                                                                        emp_code: original.UID,
                                                                        contact: original.contact_no,
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                                        
                                                                            {/* use this button to remove the data row */}
                                                                                    
                                                                                <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                        <Switch
                                                                                            checked={original.status == "1" ? true:false}
                                                                                            onChange={() => this.handleOverviewDelete(original.id, original.status)}
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
                                                                        id="sl_no"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Search S No"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
                                                                    {
                                                                    Header: "Block Name",
                                                                    accessor: "block",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="block_name"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Block Name"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
                                                                    {
                                                                    Header: "Floor Name",
                                                                    accessor: "floor",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="floor_name"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Search Floor"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
                                                                    {
                                                                    Header: "Emp Code",
                                                                    accessor: "emp_code",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="emp_code"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Emp Code"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )              
                                                                    },
                                                                    {
                                                                    Header: "Contact",
                                                                    accessor: "contact",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="contact"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Contact"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
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
                                                                showPaginationTop={false}
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="m-2" variant="outlined" color="secondary"  href={Config.url+"HostelStaffAllocations/excelStaffAllocation?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>

                                            </Grid>
                                        </Grid>
                                    </div>}

                                    {/* Access Logs Section */}
                                    {this.state.actionType == "role_master" && <div>
                                        <Grid container spacing={6} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-4 customNoData">
                                                    <form  onSubmit={this.insertRoleMaster.bind(this)} autoComplete="off">
                                                        <Grid container>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Role Master
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={6}>
                                                                <FormControl fullWidth>
                                                                    <TextField 
                                                                    inputProps={{
                                                                    autoComplete: 'off',
                                                                    style: {textTransform: 'capitalize'} 
                                                                    }}
                                                                    value={this.state.role}
                                                                    onChange = {(event) => this.setState({role:event.target.value})}
                                                                    id="document-type"   
                                                                    label="Enter Role Name" 
                                                                    type="search" 
                                                                    variant="outlined" required/>
                                                                    </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} md={12} lg={6}>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup row aria-label="position" name="shiftType" value={this.state.shifttype} onChange={(event) => this.setState({shifttype:event.target.value})} defaultValue="top">
                                                                    <FormControlLabel value="full_time" control={
                                                                        <Radio name="shift_type" color="primary"
                                                                            />} label="Full Time" checked={this.state.shifttype == 'full_time'}/>
                                                                    <FormControlLabel value="shift" control={<Radio name="shift_type" color="primary"
                                                                                    />} label="Shift" checked={this.state.shifttype == 'shift'} />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>       

                                                    {this.state.shifttype == 'shift' && <>
                                                        {this.state.shiftHolders.map((element,index)=>(      
                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={1}>
                                                            <FormLabel component="legend" className="pt-3">Shift {index + 1}</FormLabel>
                                                            
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={5}> 
                                                            <FormControl fullWidth>
                                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <KeyboardTimePicker
                                                                margin="normal"
                                                                autoOk={true}
                                                                value={element.from_time}
                                                                shrink={true}
                                                                id={'from_time'+(index + 1)}
                                                                label="From Time"
                                                                inputVariant="outlined"
                                                                onChange={date => this.handleTimeChange(index, "from_time",date)} 
                                                                KeyboardButtonProps={{
                                                                'aria-label': 'change time', 
                                                                }} 
                                                                /> 
                                                                </MuiPickersUtilsProvider>
                                                            </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} md={12} lg={5}>
                                                            <FormControl fullWidth>
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardTimePicker
                                                                margin="normal"
                                                                autoOk={true}
                                                                value={element.to_time}
                                                                shrink={true}
                                                                id={'to_time'+(index + 1)}
                                                                label="To Time"
                                                                inputVariant="outlined"
                                                                onChange={(value)=>this.handleTimeChange(index, "to_time",value)}   
                                                                KeyboardButtonProps={{
                                                                'aria-label': 'change time', 
                                                                }} 
                                                                /> 
                                                            </MuiPickersUtilsProvider>
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
                                                                        <Add onClick={()=>this.addShift()} style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
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
                                                                    <Remove onClick={()=>this.removeShift(index)} style={{color:'rgb(248, 50, 69)', cursor:'pointer'}} />
                                                                    </InputAdornment>
                                                                    ),
                                                                    }}
                                                                    id="document-type" label="Del" variant="outlined" />
                                                            </FormControl>}
                                                            </Grid>
                                                        </Grid> 
                                                        ))}
                                                        <FormControl fullWidth>
                                                        <TextField 
                                                            inputProps={{
                                                            autoComplete: 'off',
                                                            style: {textTransform: 'capitalize'} 
                                                            }}
                                                            id="document-type"   
                                                            label="Shift Count" 
                                                            type="search" 
                                                            variant="outlined" 
                                                            value={this.state.shift_count}
                                                            onChange={event => this.setState({shift_count : event.target.value})} hidden/>
                                                        </FormControl>
                                                        </> 
                                                        }
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
                                                                    Roles List
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <ReactTable
                                                                data={this.state.RoleMaster.map((original,key) => {
                                                                    
                                                                        return ({
                                                                            slno: key+1,
                                                                            id:original.id,
                                                                            role_name: original.name,
                                                                            shift_type: original.working_type,
                                                                            emp_count: original.created_by
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
                                                                    Header: "Role Name",
                                                                    accessor: "role_name",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="role_name"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Role"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
                                                                    {
                                                                    Header: "Shift Type",
                                                                    accessor: "shift_type",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off'
                                                                        }}         
                                                                        id="shift_type"   
                                                                        value={filter ? filter.value : ''}
                                                                        placeholder="Shift Type"
                                                                        type="text" 
                                                                        onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    },
                                                                    {
                                                                    Header: "Employee Count",
                                                                    accessor: "emp_count",
                                                                    className: "center",
                                                                    Filter: ({filter, onChange}) => (
                                                                        <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off'
                                                                            }}         
                                                                            id="employee_count"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Employee Count"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                        />
                                                                    )
                                                                    }
                                                                ]}
                                                                defaultFilterMethod={filterCaseInsensitive}
                                                                defaultPageSize={10}
                                                                showPaginationTop={false}
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                        <Button className="m-2" variant="outlined" color="secondary"  href={Config.url+"HostelStaffAllocations/excelRoleMaster?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>

                                            </Grid>
                                        </Grid>
                                    </div>}

                                    {/* ASSIGN ROLES TO STAFF Section */}
                                    {this.state.actionType == "staff_to_role" && <div>
                                      <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={8}>
                                          <Card className="card-box  mb-4 p-3 customNoData">
                                            <Grid container>
                                              <Grid item xs={12} md={12} lg={12}>
                                                  <div className="card-header pl-0">
                                                      <div className="card-header--title">
                                                          <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                          Staff Role Mapping
                                                          </h4>
                                                      </div>
                                                  </div>
                                              </Grid>
                                            </Grid>

                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={12} lg={2}>
                                                    <FormControl component="fieldset">
                                                        <FormLabel component="legend" className="pt-2">Select Role:</FormLabel>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={5}>
                                                    <FormControl fullWidth>
                                                        <TextField                        
                                                            id="select_type"
                                                            select
                                                            label="Select Type"
                                                            variant="outlined"
                                                            value={this.state.role_name}
                                                            onChange={(event) => this.setState({role_name:event.target.value})}>
                                                            {this.state.RoleMaster.map(option => (
                                                            <MenuItem key={option.name} value={option.id} id={option.name}>
                                                                {option.name}
                                                            </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="autocompleteDiv">
                                              <Autocomplete
                                                multiple
                                                id="search_staff"
                                                options={this.state.StaffToRole}
                                                value={this.state.selectedStaff}
                                                onChange={this.searchStaff} 
                                                getOptionLabel={(option) => option.first_name}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="filterSelectedOptions"
                                                    placeholder="Favorites"
                                                />
                                                )}
                                            />
                                              </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="text-right">
                                                <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.insertStafftoRole()}>Submit</Button>
                                              </Grid>
                                            </Grid> 
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
                                                                    Staff Role Mapping List
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <ReactTable
                                                                data={this.state.RoleMappingDetails.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        role_name: original.role_name,
                                                                        name: original.name,
                                                                        emp_code: original.UID,
                                                                        contact: original.contact_no,
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                            { /* use this button to add a like kind of action */ }
                                                                            
                                                                                {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                    <Button
                                                                                        simple
                                                                                            onClick={() => {this.getRoleData(original.staff_applicable);this.setState({editHolidayPanel:true,title:original.title, startdate:new Date(original.start_date),enddate:new Date(original.end_date),staff_depts:original.staff_applicable,student_standards:original.student_applicable, id_holiday:original.id})}}
                                                                                            color="secondary"
                                                                                            className="edit"
                                                                                            >
                                                                                        <Edit  />
                                                                                    </Button>
                                                                                </Tooltip> */}
                                                                                        
                                                                            {/* use this button to remove the data row */}
                                                                                    
                                                                                <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                        <Switch
                                                                                            checked={original.status == "1" ? true:false}
                                                                                            onChange={() => this.handleMappingDelete(original.id,original.status)}
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
                                                                            id="Sl_no"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Search S No"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        Header: "Role Name",
                                                                        accessor: "role_name",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
                                                                            <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off'
                                                                            }}         
                                                                            id="Role_name"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Search Role"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        Header: "Name",
                                                                        accessor: "name",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
                                                                            <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off'
                                                                            }}         
                                                                            id="Name"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Search Name"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        Header: "Employee Code",
                                                                        accessor: "emp_code",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
                                                                            <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off'
                                                                            }}         
                                                                            id="emp_code"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Search Emp Code"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        Header: "Contact",
                                                                        accessor: "contact",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
                                                                            <TextField 
                                                                                inputProps={{
                                                                                autoComplete: 'off'
                                                                                }}         
                                                                                id="contact"   
                                                                                value={filter ? filter.value : ''}
                                                                                placeholder="Contact"
                                                                                type="text" 
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
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
                                                                showPaginationTop={false}
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="m-2" variant="outlined" color="secondary"  href={Config.url+"HostelStaffAllocations/excelRoleMapping?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>

                                            </Grid>
                                        </Grid>
                                    </div>}                                    

                                    {/* ASSIGN BLOCKS OR FLOOR TO STAFF SECTION */}
                                    {this.state.actionType == "staff_to_hostel" && <div>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={6} className="text-center">
                                                <FormControl component="fieldset">
                                                    <RadioGroup row aria-label="position" defaultValue="top" name="StaffHostelAllocationType" value={this.state.staffAllocationType} onChange={(event) => this.setState({staffAllocationType: event.target.value})}>
                                                        <FormControlLabel value="block_wise" control={<Radio name="staff_allocation" color="primary"
                                                                />} label="Block Wise" checked={this.state.staffAllocationType == 'block_wise'} />
                                                        <FormControlLabel value="floor_wise" control={<Radio name="staff_allocation" color="primary"
                                                                    />} label="Floor Wise" checked={this.state.staffAllocationType == 'floor_wise'}/>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        
                                        {this.state.staffAllocationType == 'block_wise' && <>
                                            {this.state.blockDetails.map((element, key) => (
                                                <>
                                                    <Grid container spacing={4} justify="center">
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
                                                                    <div><small>Floor No.</small></div>
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
                                                                    <h5>{element.allotted_staffs}</h5>
                                                                    <div><small>Allocated Staffs</small></div>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} lg={2} justify="center"> 
                                                                    <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff-to-hostel-allocation/"+element.id+"/"+this.state.staffAllocationType)}>Go</Button> 
                                                                    </Grid>
                                                                </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}</>
                                        }

                                        {this.state.staffAllocationType == 'floor_wise' && <>
                                            <Grid container spacing={4} justify="center">
                                                {this.renderFloors()}
                                            </Grid>
                                            </>
                                        } 
                                        

                                    </div>}

                                    {/* Room Change Section */}
                                    {this.state.actionType == "rostering" && <div>
                                    
                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Rostering
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            
                                                            <Grid container spacing={4}>
                                                                <Grid item xs={12} md={12} lg={12}>
                                                                <ReactTable
                                                                    data={this.state.monthDetails.map((original,key) => {
                                                                        return ({
                                                                            slno: key+1,
                                                                            month:original.month,
                                                                            processed:'Yes',

                                                                            actions: (
                                                                                // we've added some custom button actions
                                                                                <div>
                                                                                            
                                                                                    { /* use this button to add a like kind of action */ }

                                                                                    <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                                    <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={()=>this.props.history.push("/admin/view-rostering/"+original.month_id)}
                                                                                        color="secondary"
                                                                                        className="view"
                                                                                        >
                                                                                        <VisibilityIcon/>
                                                                                        </Button> 
                                                                                    </Tooltip>

                                                                                    { /* use this button to add a like kind of action */ }

                                                                                    <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                    <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={()=>this.props.history.push("/admin/view-rostering/"+original.month_id)}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                        >
                                                                                        <EditIcon/>
                                                                                        </Button> 
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
                                                                    filterable: false
                                                                },
                                                                {
                                                                    Header: "Month",
                                                                    accessor: "month",
                                                                    className: "center",
                                                                    filterable: false
                                                                },
                                                                {
                                                                    Header: "Processed?",
                                                                    accessor: "processed",
                                                                    className: "center",
                                                                    filterable: false
                                                                },
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
                                                                showPaginationTop={false}
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                                />
                                                                </Grid>
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>

                                                </Card>

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

export default connect(mapStateToProps, mapDispatchToPros)(StaffAllocationManagement);
