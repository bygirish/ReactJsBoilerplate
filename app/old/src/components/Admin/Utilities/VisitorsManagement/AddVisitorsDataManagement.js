import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider, MenuItem,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6'; 
import CustomAutocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
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
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
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

class AddVisitorsDataManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        //time: new Date().toLocaleTimeString(),
        waitingtime:'',
        full_name:'',
        phone:'',
        age:'',
        showStatus:'all',
        dialogOpen:true,
        selectedStudent:'',
        selectedStaff:'',
        others:'',
        othervisitor:'',
        loading:false,
        TabValue:0,
        checkAll:false,
        gender:'male',
        PersonType:["Student","Staff","Principal","President","Others"],
        VisitorType:["Parent","Vendor","Others"],
        todayDate : moment(new Date()).format("DD/MM/YYYY"),
        load: false,
        error: '',
        selectedBoard:'',
        lcontactnumber:'',
        selectedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId,    
        lsearchname:'',
        searchtableData:[],
        basicNotify:false
        
        };
        
        //LIVE TIME
        //this.countingSecond = this.countingSecond.bind(this)
    }
    //LIVE TIME
    // countingSecond() {
    //     let d = new Date()
    //     this.setState({
    //       time: d.toLocaleTimeString()
    //     })
    // }     

    // countingWaitingSecond() {
    //     let d = '10:32:46';
    //     this.setState({
    //       waitingtime: d.toLocaleTimeString()
    //     })
    // }     
    
    //Get Student Autocomplete Value
    handleStudentSearch = (val) => {
        //console.log(val);
        if(val == ""){
            this.setState({selectedStudent:""});
        }else{
            this.setState({selectedStudent : val.UID});
        }            
        //console.log(this.state.selectedStudent);        
    }

    insertVisitorMaster = event =>{
        event.preventDefault();

        let headingStatus = "Visitor Data Inserted!";
        
        let full_name = this.state.full_name;
        let phone = this.state.phone;
        let age = this.state.age;
        let address = this.state.address;
        let gender = this.state.gender;
        let persontomeet = this.state.persontomeet;
        let person ='';
        let visit_by='';

        if(persontomeet == "Student"){
            person = this.state.selectedStudent;
        }else if(persontomeet == "Staff"){
            person = this.state.selectedStaff;
        }else if(persontomeet == "Others"){
            person = this.state.others;
        }else{
            person = this.state.persontomeet;
        }
        
        let visit_purpopse = this.state.visit_purpopse;
        let visitortype = this.state.visitortype;

        if(visitortype == "Others"){
            visit_by = this.state.othervisitor;
        }else{
            visit_by = this.state.visitortype;
        }
        
        let todayDate = this.state.todayDate;
        let time = moment(new Date()).format("HH:mm:ss A");

        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,    
            id_academicyear:this.props.data.selectedAcademicId,  
            full_name:full_name, 
            phone:phone, 
            age:age, 
            address:address, 
            gender:gender, 
            person_type:persontomeet, 
            person:person, 
            visit_purpopse:visit_purpopse, 
            type:visitortype, 
            othervisitor:visit_by, 
            todayDate:todayDate,
            time:time,
            token:"abc",
            id_user: this.props.data.UID
        };
        console.log(postData);
        //return false;
        new Service().apiCall('VisitorManagement/insertData',postData).then(response => {
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
                //this.getRoleMaster();
                setTimeout(() => {
                this.setState({ basicNotify:false, role:''});
                }, 2000) 
            
            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");

        });
    }
    
    //GET STUDENT LISTS
    getStudentDetails = (id,id_board,id_academicyear) => {
        const postData = {
            id_organization:this.state.selectedOrganizationId,
            id_institute:this.state.selectedInstitutionId,
            token:"abc",
            id_user: this.props.data.UID,
            standard_id:id?id:'',
            id_board:id_board ? id_board : this.state.selectedBoard,
            id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('students/getData',postData).then(response => {
            //console.log(response);
            if (response.status==200 && response.data!='') {
                const data = response.data.map((data) => {
                    return {...data, checked: false, editable: false};
                });
            
                this.setState({ studentData: data , studentSuggestions:data}); 
            }else{
                this.setState({studentData:[]});
            }
        }).catch(error => {
            console.log(error);
        });
    }

    //GET ALL STAFFS
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
            
                this.setState({ StaffToRole: data , staffSuggestions:data}); 
            }else{
                this.setState({ StaffToRole: []});
            }
        }).catch(error => {
            console.log(error);
        });
    }     
    
    handleStaffSearch = (val) => {
        if(val == ""){
            this.setState({selectedStaff:""});
        }else{
            this.setState({selectedStaff:val.UID});
        }
        //console.log(this.state.selectedStaff);
    }

    handleChangeState = (name,value) => {
        let allowNumberLimit = ["phone", "age"];

        if(allowNumberLimit.includes(name)){
          if (this.verifyNumberLength(value, 11)){
            this.setState({ [name]: value });
          }
        }
        else{
          this.setState({ [name]: value });
        }
      }

    verifyNumberLength = (value, length) => {
    
        var numberRex = new RegExp("^[0-9]+$");
        if(value){
          console.log(value.length,length);  
        if (value.length < length && numberRex.test(value)){
           return true;
         }
         return false;
        }
        else{
          console.log("error");
          return true;
        }
    };

    renderTextInput = (name,label, required) => {
        return (
        <FormControl fullWidth>
        <TextField 
            inputProps={{
            style: {textTransform: 'capitalize'},
            autoComplete: "off"
            }}
            id="document-type"   
            value={this.state[name]}
            label={label} 
            type="search" 
            onChange={(event) => this.handleChangeState(name,event.target.value)}
            className="m-2"
            variant="outlined" required
        />
        </FormControl>
        )
    }


    componentDidMount() {
        //setInterval(this.countingSecond, 1000);
        this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
        this.getStaffs();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/visitors-management")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                    Add Visitors
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv" justify="center">

                                <Grid item xs={12} md={8} lg={9}> 
                                    <Card className="card-box  mb-4 p-4 customNoData">

                                        <form  onSubmit={this.insertVisitorMaster.bind(this)} autoComplete="off">

                                            <Grid container spacing={6} justify="center">
                                                <Grid item xs={12} md={12} lg={6}>
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Visitor Details
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4}> 
                                                        <Grid item xs={12} md={12} lg={12} className="m-2">                                                            
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.full_name}
                                                                onChange = {(event) => this.setState({full_name:event.target.value})}
                                                                id="document-type"   
                                                                label="Enter Full Name" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12}>
                                                            {this.renderTextInput("phone","Enter Phone", "required")}
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12}>
                                                            
                                                            {this.renderTextInput("age","Enter Age", "required")}
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.address}
                                                                onChange = {(event) => this.setState({address:event.target.value})}
                                                                id="document-type"   
                                                                label="Enter Address" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl component="fieldset">
                                                                <RadioGroup row aria-label="position" name="gender" value={this.state.gender} onChange={(event) => this.setState({gender:event.target.value})} defaultValue="top">
                                                                    <FormControlLabel value="male" control={
                                                                        <Radio name="gender" color="primary"
                                                                            />} label="Male" checked={this.state.gender == 'male'}/>
                                                                    <FormControlLabel value="female" control={<Radio name="gender" color="primary"
                                                                                />} label="Female" checked={this.state.gender == 'female'} />
                                                                    <FormControlLabel value="others" control={<Radio name="gender" color="primary"
                                                                                />} label="Others" checked={this.state.gender == 'others'} />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid> 
                                                </Grid> 

                                                <Grid item xs={12} md={12} lg={6}>
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Meeting Details
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl fullWidth>
                                                                <TextField                        
                                                                    id="outlined-select-currency"
                                                                    select
                                                                    label="Person To Meet"
                                                                    variant="outlined"
                                                                    value={this.state.persontomeet}
                                                                    onChange={(event) => this.setState({persontomeet:event.target.value})} required>
                                                                    {this.state.PersonType.map(option => (
                                                                    <MenuItem key={option} value={option} id={option}>
                                                                        {option}
                                                                    </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl> 
                                                        </Grid>

                                                        {/* STUDENT LIST */}
                                                        {this.state.persontomeet == 'Student' && 
                                                            <Grid item xs={12} md={12} lg={12} className="m-2">                                                                
                                                                <CustomAutocomplete
                                                                    type="student"
                                                                    view="custom"
                                                                    showValue={true}
                                                                    SearchPlaceholderText="Enter name and select from suggestions"
                                                                    suggestions={this.state.studentSuggestions}
                                                                    onSelected={this.handleStudentSearch}
                                                                    {...this.props}
                                                                />
                                                            </Grid>
                                                        }

                                                        {/* STAFF LIST */}
                                                        {this.state.persontomeet == 'Staff' && 
                                                            <Grid item xs={12} md={12} lg={12} className="m-2">
                                                                <CustomAutocomplete
                                                                    type="staff"
                                                                    view="custom"
                                                                    showValue={true}
                                                                    SearchPlaceholderText="Enter name and select from suggestions"
                                                                    suggestions={this.state.staffSuggestions}
                                                                    onSelected={this.handleStaffSearch}
                                                                    {...this.props}
                                                                />
                                                            </Grid>
                                                        }

                                                        {/* OTHERS INPUT */}
                                                        {this.state.persontomeet == 'Others' && 
                                                            <Grid item xs={12} md={12} lg={12} className="m-2">
                                                                <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.others}
                                                                onChange = {(event) => this.setState({others:event.target.value})}
                                                                id="document-type"   
                                                                label="Others name" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                                </FormControl>
                                                            </Grid>
                                                        }

                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.visit_purpopse}
                                                                onChange = {(event) => this.setState({visit_purpopse:event.target.value})}
                                                                id="document-type"   
                                                                label="Purpose Of Visit" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl fullWidth>
                                                                <TextField                        
                                                                    id="outlined-select-currency"
                                                                    select
                                                                    label="Type Of Visitor"
                                                                    variant="outlined"
                                                                    value={this.state.visitortype}
                                                                    onChange={(event) => this.setState({visitortype:event.target.value})} required>
                                                                    {this.state.VisitorType.map(option => (
                                                                    <MenuItem key={option} value={option} id={option}>
                                                                        {option}
                                                                    </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Grid>

                                                        

                                                        {/* OTHERS VISITOR INPUT */}
                                                        {this.state.visitortype == 'Others' && 
                                                            <Grid item xs={12} md={12} lg={12} className="m-2">
                                                                <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.othervisitor}
                                                                onChange = {(event) => this.setState({othervisitor:event.target.value})}
                                                                id="document-type"   
                                                                label="Others name" 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                                </FormControl>
                                                            </Grid>
                                                        }

                                                        <Grid item xs={12} md={12} lg={12} className="m-2">
                                                            <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                autoComplete: 'off',
                                                                style: {textTransform: 'capitalize'} 
                                                                }}
                                                                value={this.state.todayDate}
                                                                id="document-type"   
                                                                label="Date" 
                                                                type="search" 
                                                                variant="outlined" readOnly/>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid> 
                                                </Grid>
                                            </Grid>
                                            
                                            <Grid container className="mt-2">
                                                <Grid item xs={12} sm={12} md={12} className="m-2 text-right">
                                                    <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
                                                </Grid>
                                            </Grid>
                                        </form>
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

export default connect(mapStateToProps, mapDispatchToPros)(AddVisitorsDataManagement);
