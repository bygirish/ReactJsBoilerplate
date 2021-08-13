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

class EditScheduledDataManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        waitingtime:'',
        showStatus:'all',
        VisitorList:[],
        dialogOpen:true,
        selectedStudent:'',
        selectedStaff:'',
        existingPerson:'',
        others:'',
        othervisitor:'',
        loading:false,
        TabValue:0,
        checkAll:false,
        gender:'male',
        PersonType:["Student","Staff","Principal","President","Others"],
        VisitorType:["Parent","Vendor","Others"],
        todayDate : moment(new Date()).format("YYYY-MM-DD"),
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
    }
    
    handleTimeChange(datevlaue){
        let time = this.state.time;
        time = moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
        this.setState({ time });
    };
  
    handleStartDate = (x) => {
        let todayDate = this.state.todayDate;
        todayDate = moment(x).format("YYYY-MM-DD");
        this.setState({ todayDate })
    };
    
    //Get Student Autocomplete Value
    handleStudentSearch = (val) => {
        console.log(val);
        if(val == ""){
            this.setState({selectedStudent:""});
        }else{
            this.setState({selectedStudent : val.UID});
        }            
        this.setState({existingPerson:''});            
    }

    updateVisitorMaster = event =>{
        event.preventDefault();

        let headingStatus = "Visitor Data Updated!";

        let id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        
        let full_name = this.state.full_name;
        let phone = this.state.phone;
        let age = this.state.age;
        let address = this.state.address;
        let gender = this.state.gender;
        let persontomeet = this.state.persontomeet;
        let person ='';
        let visitor_relation='';
        let time='';

        if(this.state.existingPerson == ''){
            if(persontomeet == "Student"){
                person = this.state.selectedStudent;
            }else if(persontomeet == "Staff"){
                person = this.state.selectedStaff;
            }else if(persontomeet == "Others"){
                person = this.state.others;
            }else{
                person = this.state.persontomeet;
            }
        }else{
            person = this.state.existingPerson;
        }
        
        let visit_purpopse = this.state.visit_purpopse;
        let visitortype = this.state.visitortype;

        if(visitortype == "Others"){
            visitor_relation = this.state.othervisitor;
        }else{
            visitor_relation = this.state.visitortype;
        }
        
        let todayDate = this.state.todayDate;

        if(this.state.time <= currentTime){ 
            this.setState({
                basicNotify: (
                    <Dialog open={true}>
                        <div className="text-center p-5">
                            <h4 className="font-weight-bold">Time should be greater than current time</h4>
                        </div>
                    </Dialog>
                )
            });
            
            setTimeout(() => {
                this.setState({ basicNotify:false});
            }, 2000) 
            return false;
        }else{
            time = this.state.time;
        }        

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
            visitor_relation:visitor_relation, 
            todayDate:todayDate,
            time:time,
            token:"abc",
            Id:id,
            id_user: this.props.data.UID
        };
        console.log(postData);
        //return false;
        new Service().apiCall('VisitorManagement/updateScheduledData',postData).then(response => {
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
                this.getVisitorData();
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
            console.log(response);
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
            console.log(response)
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

    getVisitorData = (type) => { 
    
        const split = window.location.href.split("/"); 
        const id = split[split.length - 1];    
    
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
        new Service().apiCall('VisitorManagement/getScheduledVisitorData',postData).then(response => { 
          console.log(response)
          if (response.status==200 && response.data!='') {
              //console.log(response.data[0].type);
            const data = response.data.map((data) => {
                return {...data, checked: false, editable: false};
            });
            
            this.setState({ 
                VisitorList: data , 
                full_name:response.data[0].name, 
                phone:response.data[0].phone, 
                age:response.data[0].age, 
                address:response.data[0].address, 
                gender:response.data[0].sex, 
                person:response.data[0].person,
                existingPerson:response.data[0].person_name,
                selectedStudent:response.data[0].person_name,
                selectedStaff:response.data[0].person_name,
                visitortype:response.data[0].type, 
                persontomeet:response.data[0].person_type, 
                others:response.data[0].person, 
                todayDate:moment(response.data[0].date).format("YYYY-MM-DD"), 
                time: moment(response.data[0].date+' '+response.data[0].time).format("YYYY-MM-DD HH:mm:ss"), 
                visit_purpopse:response.data[0].purpose, 
                othervisitor:response.data[0].visitor_relation
            }); 
          }else{
            this.setState({ VisitorList: []});
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
        this.setState({existingPerson:''});      
    }

    componentDidMount() {
        this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear); 
        this.getStaffs();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/scheduled-visitors")} aria-label="close">
                                      <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Edit Visitors
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

                                        <form  onSubmit={this.updateVisitorMaster.bind(this)} autoComplete="off">

                                            <Grid container spacing={6} justify="center">
                                                {this.state.VisitorList.map((element, index) =>
                                                    <>
                                                        <Grid item xs={12} md={12} lg={6}>
                                                            <Grid container>
                                                                <Grid item xs={12} md={12} lg={12}>
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
                                                                <Grid item xs={12} md={12} lg={12}>
                                                                    <FormControl fullWidth>
                                                                        <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: {textTransform: 'capitalize'} 
                                                                            }}
                                                                            value={this.state.existingPerson}
                                                                            onChange = {(event) => this.setState({existingPerson:this.state.existingPerson})}
                                                                            id="document-type"   
                                                                            label="" 
                                                                            type="search" 
                                                                            variant="outlined" hidden/>  

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
                                                                    <FormControl fullWidth>
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: {textTransform: 'capitalize'} 
                                                                        }}
                                                                        value={this.state.phone}
                                                                        onChange = {(event) => this.setState({phone:event.target.value})}
                                                                        id="document-type"   
                                                                        label="Enter Phone" 
                                                                        type="search" 
                                                                        variant="outlined" required/>
                                                                    </FormControl>
                                                                </Grid>

                                                                <Grid item xs={12} md={12} lg={12}>
                                                                    <FormControl fullWidth>
                                                                        <TextField 
                                                                        inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: {textTransform: 'capitalize'} 
                                                                        }}
                                                                        value={this.state.age}
                                                                        onChange = {(event) => this.setState({age:event.target.value})}
                                                                        id="document-type"   
                                                                        label="Enter Age" 
                                                                        type="search" 
                                                                        variant="outlined" required/>
                                                                    </FormControl>
                                                                </Grid>

                                                                <Grid item xs={12} md={12} lg={12}>
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

                                                                <Grid item xs={12} md={12} lg={12}>
                                                                    <FormControl component="fieldset">
                                                                        <RadioGroup row aria-label="position" name="gender" value={this.state.gender} onChange={(event) => this.setState({gender:event.target.value})} defaultValue="top">
                                                                            <FormControlLabel value="male" control={<Radio name="gender" color="primary"
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
                                                                <Grid item xs={12} md={12} lg={12}>
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
                                                                <Grid item xs={12} md={12} lg={12}>
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
                                                                    <Grid item xs={12} md={12} lg={12}>                                                                
                                                                        <CustomAutocomplete
                                                                            type="student"
                                                                            view="custom"
                                                                            showValue={true}
                                                                            SearchPlaceholderText="Enter student name and select from suggestions"
                                                                            suggestions={this.state.studentSuggestions}
                                                                            onSelected={this.handleStudentSearch}
                                                                            value={this.state.selectedStudent}
                                                                            {...this.props}
                                                                        />
                                                                    </Grid>
                                                                }

                                                                {/* STAFF LIST */}
                                                                {this.state.persontomeet == 'Staff' && 
                                                                    <Grid item xs={12} md={12} lg={12} className="autocompleteDiv">
                                                                        <CustomAutocomplete
                                                                            type="staff"
                                                                            view="custom"
                                                                            showValue={true}
                                                                            SearchPlaceholderText="Enter staff name and select from suggestions"
                                                                            suggestions={this.state.staffSuggestions}
                                                                            onSelected={this.handleStaffSearch}
                                                                            value={this.state.selectedStaff}
                                                                            {...this.props}
                                                                        />
                                                                    </Grid>
                                                                }

                                                                {/* OTHERS INPUT */}
                                                                {this.state.persontomeet == 'Others' && 
                                                                    <Grid item xs={12} md={12} lg={12}>
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

                                                                <Grid item xs={12} md={12} lg={12}>
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

                                                                <Grid item xs={12} md={12} lg={12}>
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
                                                                    <Grid item xs={12} md={12} lg={12}>
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

                                                                <Grid item xs={12} md={12} lg={12}>
                                                                    <FormControl fullWidth>
                                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                            <KeyboardDatePicker
                                                                            autoOk
                                                                            margin="normal"
                                                                            id="date-picker-dialog"
                                                                            format="MM/dd/yyyy"
                                                                            inputVariant="outlined"
                                                                            value={this.state.todayDate}
                                                                            onChange={(x)=>this.handleStartDate(x)}     
                                                                            KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                            }}
                                                                            />
                                                                        </MuiPickersUtilsProvider>
                                                                    </FormControl>
                                                                </Grid> 

                                                                <Grid item xs={12} md={12} lg={12}>
                                                                
                                                                    <FormControl fullWidth>
                                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                        <KeyboardTimePicker
                                                                        margin="normal"
                                                                        autoOk={true}
                                                                        value={this.state.time}
                                                                        shrink={true}
                                                                        id="time-picker"
                                                                        label="From Time"
                                                                        inputVariant="outlined"
                                                                        onChange={date => this.handleTimeChange(date)} 
                                                                        KeyboardButtonProps={{
                                                                        'aria-label': 'change time', 
                                                                        }} 
                                                                        /> 
                                                                        </MuiPickersUtilsProvider>
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid> 
                                                        </Grid>
                                                    </>
                                                )}

                                            </Grid>
                                            
                                            <Grid container className="mt-2">
                                                <Grid item xs={12} sm={12} md={12} className="text-right">
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

export default connect(mapStateToProps, mapDispatchToPros)(EditScheduledDataManagement);
