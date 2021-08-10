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

class HostelRoomFeeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true, 
      foodDetails:[],     
      holidays:[{id:1, food_type:'Veg'}, {id:'2', food_type:'Non Veg'}],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId,    
      lsearchname:'',
      searchtableData:[],
      basicNotify:false
    };
  }

  getFoodData = (type) => { 
    let id_block = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    //console.log(floor_no);
    this.setState({ selectedBlock: id_block}); 

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      type:type,
      id_block:id_block,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear, 
    };
    console.log(postData);
    new Service().apiCall('HostelFoodFees/getAllocationData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
      });      
          this.setState({ foodDetails: data }); 
      }else{
          this.setState({ foodDetails: []});
      }
    }).catch(error => {
      alert(error);
    });
  }
  
  handleStartDate = (index,name,x) => {
    let data = this.state.foodDetails;
    data[index][name] = moment(x).format("YYYY-MM-DD");
    this.setState({ data })
  };

  insertFoodFee = () => {
    let id_block = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let headingStatus = "Food Fee Inserted!";
    const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,   
        id_academicyear:this.props.data.selectedAcademicId,  
        id_block:id_block,
        token:"abc",
        details:this.state.foodDetails,
        id_user: this.props.data.UID
    };
    console.log(postData);
    new Service().apiCall('HostelFoodFees/insertRoomFood',postData).then(response => {
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
            this.getFoodData();
            setTimeout(() => {
            this.setState({ basicNotify:false, edit_form: false});
            }, 2000) 
  
        } else {
            //this.raiseLoginSignupErrorAlert("signup");
        }
    }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");
    });
}

handleChangeData = (index, name,value) => {
  let data = this.state.foodDetails;
  data[index][name] = value;
  this.setState({ data });
};

handleFoodFeeDeactivate = (id,status) => {
  let headingStatus = "Food Fee Activated!";
  if(status == 1){
    headingStatus = "Food Fee Deactivated!";
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
  new Service().apiCall('HostelFoodFees/deleteHostelRoomFood',postData).then(response => {
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
     this.getFoodData();
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
   this.getFoodData();
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
                                        Food Fee Structure  
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container spacing={4} className="sliderDiv"> 

                                <Grid item xs={12} md={8} lg={12}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={11}>
                                            <Card className="card-box  mb-4 p-3">
                                                <Grid container>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Food Fee Details
                                                                </h4>
                                                            </div>
                                                        </div>

                                                        <ReactTable
                                                                data={this.state.foodDetails.map((original,key) => {
                                                                    return ({
                                                                        slno: key + 1,
                                                                        id: original.id,
                                                                        food_type: original.food_type,
                                                                        fee_per_annum: original.fee_per_annum,
                                                                        frequency: original.frequency,
                                                                        id_block: original.id_block,
                                                                        no_of_installments: original.no_of_installments,
                                                                        first_due: original.first_due,
                                                                        start_date: original.start_date,
                                                                        status: original.status,
                                                                        deposit: original.deposit,

                                                                        deposit:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"deposit"+(key + 1)} placeholder="Deposit" type="text" value={original.deposit} onChange={(event)=>this.handleChangeData(key,"deposit",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        fee_per_annum:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"fee_per_annum"+(key + 1)} placeholder="Fee Per Annum" type="text" value={original.fee_per_annum} onChange={(event)=>this.handleChangeData(key,"fee_per_annum",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        no_of_installment:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"no_of_installment"+(key + 1)} placeholder="Installment No" type="text" value={original.no_of_installments} onChange={(event)=>this.handleChangeData(key,"no_of_installments",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        frequency:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"frequency"+(key + 1)} placeholder="Frequency" type="text" value={original.frequency} onChange={(event)=>this.handleChangeData(key,"frequency",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        start_date:(<div>
                                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                            <KeyboardDatePicker
                                                                            autoOk
                                                                            margin="normal"
                                                                            id={"start_date"+(key + 1)}
                                                                            format="MM/dd/yyyy"
                                                                            value={original.start_date}
                                                                            onChange={(event,x)=>this.handleStartDate(key,"start_date",x)}     
                                                                            KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                            }} disabled = {this.state.edit_form ? false :true}
                                                                            />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>),

                                                                        first_due:(<div>
                                                                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                            <KeyboardDatePicker
                                                                            autoOk
                                                                            margin="normal"
                                                                            id={"first_due"+(key + 1)}
                                                                            format="MM/dd/yyyy"
                                                                            value={original.first_due}
                                                                            onChange={(event,x)=>this.handleStartDate(key,"first_due",x)}     
                                                                            KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                            }} disabled={this.state.edit_form ? false : true}
                                                                            />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>),

                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                                        
                                                                            {/* use this button to remove the data row */}
                                                                            {original.id == '' ? 'No Data' : <>       
                                                                                <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                        <Switch
                                                                                            checked={original.status == "1" ? true:false}
                                                                                            onChange={() => this.handleFoodFeeDeactivate(original.id,original.status)}
                                                                                            value="checkedA"
                                                                                        />
                                                                                        }
                                                                                
                                                                                    label=""/>
                                                                                </Tooltip> 
                                                                                </>
                                                                                }
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
                                                            Header: "Food Type",
                                                            accessor: "food_type",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Deposit",
                                                            accessor: "deposit",
                                                            className: "center",
                                                            filterable: false,
                                                            },
                                                            {
                                                            Header: "Fee Per Annum",
                                                            accessor: "fee_per_annum",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "No. of Installment",
                                                            accessor: "no_of_installment",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Frequency",
                                                            accessor: "frequency",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Start Date",
                                                            accessor: "start_date",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "First Due",
                                                            accessor: "first_due",
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
                                            
                                                <Grid container className="mt-2">
                                                    <Grid item xs={12} sm={12} md={12} className="text-right">
                                                      <Button className="m-2" variant="outlined" color="secondary" href={Config.url+"HostelFoodFees/excelFoodFee?block_id="+this.state.selectedBlock+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear} >Export</Button>
                                                      {!this.state.edit_form && <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.setState({edit_form:true})}>Edit</Button>}
                                                      { this.state.edit_form && <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.setState({edit_form:false})}>Cancel</Button> }
                                                      {this.state.edit_form && <Button className="m-2 successBtnOutline" variant="outlined" onClick={()=>this.insertFoodFee()}>Submit</Button> }
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

export default connect(mapStateToProps, mapDispatchToPros)(HostelRoomFeeManagement);
