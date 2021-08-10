import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
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

class StafftoHostelAllocationManagement extends React.Component {
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
        checked: [],
        Roles:[],
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
        };
    }


    searchStaff = (values,index) => {

        const Roles = this.state.Roles;
     //   if(values){            
            // values.map((myList) =>  {
            //     if(Roles[index].staffs.includes(myList.UID)){
                    
            //     }
            //     else{
                    Roles[index].staffs = values;
            //     }
            // }); 
       // }
        console.log(Roles);
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
            
            let roles_arr=[];
            data.map(e=>{
                roles_arr.push({id:e.id,name:e.name,staffs:[]})
            })
        
            this.setState({ Roles : roles_arr }); 
        }else{
            this.setState({ Roles : [] });
        }
        console.log(this.state.Roles);
        }).catch(error => {
            console.log(error);
        });
    }

    //ADD STAFF TO ROLE
    insertStafftoRole = () => { 
        let headingStatus = "Role Mapping Inserted!";  
        
        const split = window.location.href.split("/");
        const type= split[split.length - 1];
        if(type == 'block_wise'){
            this.state.id_block = split[split.length - 2];
        }else{
            this.state.id_block = split[split.length - 2];
            this.state.floor_no = split[split.length - 3];
        }
    
        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId,  
            details:this.state.Roles,
            token:"abc",
            type:type,
            floor_no:this.state.floor_no,
            id_block:this.state.id_block,
            id_user: this.props.data.UID
        };
        //console.log(postData);
        //return false;
        new Service().apiCall('HostelStaffAllocations/insertHostelStaff',postData).then(response => {
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
                this.props.history.push("/admin/staff-allocation");
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

    componentDidMount(){
        this.getStaffs();
        this.getRoleMaster();
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

                            <Grid container spacing={4} className="sliderDiv" justify="center">
                                

                                <Grid item xs={12} md={8} lg={9}>

                                    {/* Mapping Roles */}
                                    

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
                                                    </Grid>
                                                </Grid>

                                                {this.state.Roles.map((element, index) => ( <>
                                                <Grid container spacing={4}> 
                                                    <Grid item xs="12" md={12} lg={2} >
                                                        <FormControl component="fieldset">
                                                        <FormLabel component="legend">{element.name}</FormLabel>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs="12" md={12} lg={10} className="autocompleteDiv">
                                                    <Autocomplete
                                                        multiple
                                                        id="tags-outlined"
                                                        value={this.state.Roles[index].staffs}
                                                        options={this.state.StaffToRole}
                                                        onChange={(event,value)=>this.searchStaff(value,index)}
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
                                                </>))}
                                                

                                                <Grid container spacing={4}>
                                                    <Grid item xs="12" md={12} lg={12} className="text-right">
                                                        <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.insertStafftoRole()}>Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(StafftoHostelAllocationManagement);
