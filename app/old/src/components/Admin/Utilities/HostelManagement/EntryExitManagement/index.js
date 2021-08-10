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
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

class EntryExitManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      changeArticle:'d-none',
      dialogOpen:true,
      actionType:'entry_process',
      loading:false,
      TabValue:0,
      checkAll:false,     
      hostelData:[],
      articlesList:[],
      studentsData:[],
      activeSidebarTab:"entry_process",
      standardSections:[],
      hostelstudentSuggestions:[],
      suggestions: [],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId,    
      lsearchname:'',
      searchtableData:[],
      selectedStudent:'',
      selectedHostelStudent:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

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
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({studentData:newArr,studentSuggestions:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({studentData:newArray,studentSuggestions:newArray});
        }
      }else{
        this.setState({studentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 

  getHostelStudentDetails = (id,id_board,id_academicyear) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      standard_id:id?id:'',
      id_board:id_board ? id_board : this.state.selectedBoard,
      id_academicyear:id_academicyear? id_academicyear: this.state.selectedAcademicYear
    };
    //console.log(postData);return false;
    new Service().apiCall('students/getHostelStudentData',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({hostelstudentData:newArr,hostelstudentSuggestions:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({hostelstudentData:newArray,hostelstudentSuggestions:newArray});
        }
      }else{
        this.setState({hostelstudentData:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 

  getStudentHostelData = (student, type) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      student:student,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };

    new Service().apiCall('HostelRooms/getStudentHostelData',postData).then(response => {
      //console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
        });
    
        this.setState({ hostelData: data }); 
      }else{
        this.setState({ hostelData: []});
      }
    }).catch(error => {
      console.log(error); 
    });
  }

  handleStudentSearch = (val) => {
    //console.log(val);
    // const lHostelData = this.state.hostelData;
    // let lStudentFound = false;
    // let lStudentMatchData = null;
    // lHostelData.forEach((element,index) => {
    //     if(element.UID == val.UID){
    //       console.log("User Found");
    //       console.log(element.UID);
    //       console.log(element);
    //       
    //     }
    // });
    if(val == ""){
      this.setState({
        selectedStudent:"",
        selectedStudentSection:"",
        studentInfo:""
      });
    }else{
      this.getStudentHostelData(val.UID);
      this.setState({
        selectedStudent:val.UID,
        selectedStudentSection:val.standard,
        studentInfo:val
      });
    }  

    //console.log(this.state.selectedStudentSection);
  }

  handleHostelStudentSearch = (val) => {

    if(val == ""){
      this.setState({
        selectedHostelStudent:"",
        selectedHostelStudentSection:"",
        studentInfo:""
      });
    }else{
      this.getStudentHostelData(val.UID);
      this.getArticleData(val.UID);
      this.setState({
        selectedHostelStudent:val.UID,
        selectedHostelStudentSection:val.standard,
        studentInfo:val
      });
    }
    // console.log(this.state.selectedHostelStudent);
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
      //console.log(response)
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

  getArticleData = (student,type) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      student:student,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('Students/getArticlesData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false, gross_rent:0};
        });
    
        this.setState({ articlesList: data }); 
      }else{
        this.setState({ articlesList: []});
      }
    }).catch(error => {
      console.log(error); 
    });
  }

  handleChangeData = (index, name,value) => {
    let data = this.state.articlesList;
    data[index][name] = value;
    this.setState({ data });
  };

  handlerarticlesList = (Index,inputName,Value) => {
    let NarticlesList = this.state.articlesList;
    NarticlesList[Index][inputName] = Value;
    this.setState({articlesList:NarticlesList});
  }

  updateArticles = () =>{
    let headingStatus = "Articles Updated!";

    const postData = {
      id_organization : this.props.data.selectedOrganizationId,
      id_institute : this.props.data.selectedInstitutionId,
      id_board : this.props.data.selectedBoardId,   
      id_academicyear : this.props.data.selectedAcademicId,  
      articles : this.state.articlesList,
      token : "abc",
      id_user: this.props.data.UID
    };
    console.log(postData);
    
    new Service().apiCall('HostelRooms/updateArticles',postData).then(response => {
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
        this.getArticleData(this.state.selectedHostelStudent); 
        setTimeout(() => {
          this.setState({ basicNotify:false, articlesList:[]});
        }, 2000) 
      
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });
  }


  componentDidMount() { 
    this.getStudentHostelData();
    this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
    this.getBlocksData(); 
    this.getHostelStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);  
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
                                      Entry Process/Exit Process
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
                                                <ListItem button className={this.state.actionType == "entry_process" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"entry_process",showStatus:'all'});}}>
                                                    <span>Entry Process</span>
                                                    
                                                </ListItem>
                                                <Divider />
                                                <ListItem button className={this.state.actionType == "exit_process" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"exit_process",showStatus:'all'});}}> 
                                                    <span>Exit Process</span>
                                                </ListItem>
                                                </List>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>     
 
                                <Grid item xs={12} md={8} lg={9}>
                                  {/* Room Structure section */} 
                                  {this.state.actionType == "entry_process" && 
                                    <div>
                                      <Grid container spacing={4} justify="center" className = "mb-5">
                                          <Grid item xs={12} md={12} lg={8}>
                                          <Autocomplete
                                              type="student"
                                              showValue={true}
                                              SearchPlaceholderText="Enter name and select from suggestions"
                                              suggestions={this.state.studentSuggestions}
                                              onSelected={this.handleStudentSearch}
                                              {...this.props}
                                          /> 
                                          </Grid>
                                      </Grid>

                                      {this.state.selectedStudent!='' && 
                                        <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.hostelData.find(o => o.UID === this.state.selectedStudent)?
                                            <Grid item xs={12} sm={12} lg={9}>
                                              <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                <Grid container spacing={2} justify="center">
                                                  <Grid item xs={12} sm={12} lg={3}>
                                                    <h5>{1}</h5>
                                                    <div><small>{this.state.hostelData[0].block_name}</small></div>
                                                  </Grid>
                                                  <Grid item xs={12} sm={12} lg={9}>
                                                    <Grid container spacing={1} justify="center">
                                                      <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{this.state.hostelData[0].floor_no}</h5>
                                                        <div><small>Floor No.</small></div>
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{this.state.hostelData[0].room_no}</h5>
                                                        <div><small>Room No.</small></div>
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{this.state.hostelData[0].bed_no}</h5>
                                                        <div><small>Bed No.</small></div>
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{this.state.hostelData[0].fee_per_annum}</h5>
                                                        <div><small>Fee Per Annum</small></div>
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} lg={2}>
                                                        <h5>{this.state.hostelData[0].gross_total}</h5>
                                                        <div><small>Gross Rent</small></div>
                                                      </Grid>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                            </Grid>
                                            : 
                                            <>
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
                                                          <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/student-room-allocation/"+element.id+"/"+this.state.selectedStudent)}>Go</Button> 
                                                        </Grid>
                                                      </Grid>
                                                    </Grid>
                                                  </Grid>
                                                </div>
                                              </Grid>
                                            ))}
                                            </>
                                          }                   
                                        </Grid>
                                      }
                                    </div>
                                  }

                                  {/* Room Rent section */}
                                  {this.state.actionType == "exit_process" && 
                                    <div>
                                      <Grid container spacing={4} justify="center" className="mb-4">
                                          <Grid item xs={12} sm={12} lg={8}>
                                              <Autocomplete
                                                  type="student"
                                                  showValue={true}
                                                  SearchPlaceholderText="Enter name and select from suggestions"
                                                  suggestions={this.state.hostelstudentSuggestions}
                                                  onSelected={this.handleHostelStudentSearch}
                                                  {...this.props}
                                              /> 
                                          </Grid>
                                      </Grid>

                                      {this.state.selectedHostelStudent!='' && 
                                        <Grid container spacing={0} justify="center" className="sliderDiv">
                                          <Grid item xs={12} sm={12} lg={6}>
                                            <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                              <Grid container spacing={2} justify="center"> 
                                                <Grid item xs={12} sm={12} lg={3}>
                                                  <h5>{1}</h5>
                                                  <div><small>{this.state.hostelData[0].block_name}</small></div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} lg={9}>
                                                  <Grid container spacing={1} justify="center">
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                      <h5>{this.state.hostelData[0].floor_no}</h5>
                                                      <div><small>Floor No.</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                      <h5>{this.state.hostelData[0].room_no}</h5>
                                                      <div><small>Room No.</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={2}>
                                                      <h5>{this.state.hostelData[0].bed_no}</h5>
                                                      <div><small>Bed No.</small></div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={4} justify="center" className="mt-2">
                                                      <Button variant="contained" color="secondary" onClick={()=>{this.setState({changeArticle:'d-block'});}}>Start Exit</Button> 
                                                    </Grid>                                                  
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                            </div>
                                          </Grid>
                                        </Grid>
                                      }

                                      <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={8} className={this.state.changeArticle}>
                                          <Card className="card-box mb-4 p-3">
                                            <Grid container>
                                              <Grid xs={12} md={12} lg={12}>
                                                <TableContainer>
                                                  <Table className="mb-4" aria-label="simple table">
                                                    <TableHead>
                                                      <TableRow>
                                                        <TableCell>#</TableCell>
                                                        <TableCell align="right">Articles</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">Returning</TableCell>
                                                        <TableCell align="right">Penalty</TableCell>
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                      {this.state.articlesList.map((element, index) => 
                                                      <>
                                                        <TableRow key="">
                                                          <TableCell component="th" scope="row">
                                                            {index + 1}
                                                          </TableCell>
                                                          <TableCell align="right">{element.articles}</TableCell>
                                                          <TableCell align="right">{element.quantity}</TableCell> 
                                                          <TableCell align="right">
                                                            <FormControl component="fieldset">
                                                            <RadioGroup row aria-label="position" defaultValue="top">
                                                              <FormControlLabel checked={element.returnType === "Yes"} onChange={(event) => this.handlerarticlesList(index,"returnType",'Yes')} control={<Radio />} label="yes" />
                                                              <FormControlLabel checked={element.returnType === "No"} onChange={(event) => this.handlerarticlesList(index,"returnType",'No')} control={<Radio />} label="No" />
                                                            </RadioGroup>

                                                            </FormControl>
                                                          </TableCell>
                                                          
                                                          <TableCell align="right">
                                                            {element.returnType == 'No' &&
                                                              <FormControl fullWidth>
                                                                <TextField 
                                                                inputProps={{
                                                                  autoComplete: 'off',
                                                                  style: {textTransform: 'capitalize'}
                                                                }}
                                                                onChange={(event)=>this.handleChangeData(index,"penalty",event.target.value)}
                                                                value={element.penalty}
                                                                id="document-type"   
                                                                label="Penalty Rs." 
                                                                type="search" 
                                                                variant="outlined" required/>
                                                              </FormControl>
                                                            }
                                                          </TableCell>
                                                          
                                                        </TableRow>
                                                        </>
                                                      )}
                                                    </TableBody>
                                                  </Table>
                                                </TableContainer>
                                              </Grid>
                                            
                                              <Grid xs={12} md={12} lg={12} className="text-right">
                                                <Button className="successBtnOutline" variant="outlined" color="secondary" onClick={()=>this.updateArticles()}>Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(EntryExitManagement);
