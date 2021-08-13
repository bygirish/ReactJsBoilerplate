import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,MenuItem,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel, Hidden} from '@material-ui/core';
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
import moment from "moment";
import Config from '../../../../../config';
      
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
        actionType:'room_structure',
        roomDetails:[],
        frequencyHolders:["Monthly","Yearly"],
        activeSidebarTab:"room_structure",
        tedOrganizationId:this.props.data.selectedOrganizationId,
        selectedInstitutionId:this.props.data.selectedInstitutionId,
        selectedBoard:this.props.data.selectedBoardId,
        selectedAcademicYear:this.props.data.selectedAcademicId,    
        lsearchname:'',
        searchtableData:[],
        basicNotify:false,
        selectedBlock:'',
        selectedFloor:'',
        selectedRoom:''
    };
  }
  
  handleStartDate = (index,name,x) => {
    let data = this.state.roomDetails;
    data[index][name] = moment(x).format("YYYY-MM-DD");
    this.setState({ data })
  };

  getRoomData = (type) => { 
    const split = window.location.href.split("/");
    const id_block= split[split.length - 3];
    const floor_no= split[split.length - 2];
    const roomid = split[split.length - 1];
    //console.log(floor_no);
    this.setState({ selectedBlock: id_block,  selectedFloor: floor_no, selectedRoom: roomid}); 
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      room_id:roomid,
      type:type,
      block_id:id_block,
      floor_no:floor_no,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('HostelRooms/getAllocationData',postData).then(response => {
        console.log(response)
        if (response.status==200 && response.data!='') {
          const data = response.data.map((data) => {
            return {...data, checked: false, editable: false};
        });      
            this.setState({ roomDetails: data }); 
        }else{
            this.setState({ roomDetails: []});
        }
    }).catch(error => {
      alert(error);
    });
  }

    insertRoomFee = () => {
        let headingStatus = "Room Rent Inserted!";
        const split = window.location.href.split("/");
        const id_block= split[split.length - 3];
        const floor_no= split[split.length - 2];
        const roomid = split[split.length - 1];
   
        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId,  
            floor_no:floor_no,
            id_block:id_block,
            id_room:roomid,
            token:"abc",
            details:this.state.roomDetails,
            id_user: this.props.data.UID
        };
        console.log(postData);
        new Service().apiCall('HostelRents/insertRoomRent',postData).then(response => {
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
                this.getRoomData();
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
    let data = this.state.roomDetails;
    data[index][name] = value;
    this.setState({ data });
  };

  handleRoomRentDeactivate = (id,status) => {
    let headingStatus = "Room Rent Activated!";
    if(status == 1){
      headingStatus = "Room Rent Deactivated!";
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
    new Service().apiCall('HostelRents/deleteHostelRoomRents',postData).then(response => {
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
       this.getRoomData();
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
        this.getRoomData();
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/view-block-rooms-master/"+this.state.selectedBlock)} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Room Rent Structure
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
                                        <Grid item xs={12} md={12} lg={12}>
                                            <Card className="card-box  mb-4 p-3">
                                                <Grid container>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                Room Rent Details
                                                                </h4>
                                                            </div>
                                                        </div>

                                                        <ReactTable
                                                                data={this.state.roomDetails.map((original,key) => {
                                                                    const split = window.location.href.split("/");
                                                                    const blockid= split[split.length - 3];
                                                                    const floor_no= split[split.length - 2];
                                                                    const roomid = split[split.length - 1];
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        block_id:blockid,
                                                                        floor_no: floor_no,
                                                                        room_id: roomid,
                                                                        bed_no: original.bed_no,
                                                                        no_of_installments:original.no_of_installments,
                                                                        deposit:original.deposit,
                                                                        fee_per_annum:original.fee_per_annum,
                                                                        first_due:original.first_due,
                                                                        frequency:original.frequency,
                                                                        start_date:original.start_date,
                                                                        status:original.status,

                                                                        deposite:(<div> 
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"deposit"+(key + 1)} placeholder="Deposit" type="text" value={original.deposit} onChange={(event)=>this.handleChangeData(key,"deposit",event.target.value)} disabled={this.state.edit_form ? false : true} />
                                                                        </div>),

                                                                        fee_per_annum:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"fee_per_annum"+(key + 1)} placeholder="Fee Per Annum" type="text" value={original.fee_per_annum} onChange={(event)=>this.handleChangeData(key,"fee_per_annum",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        no_of_installment:(<div>
                                                                            <TextField inputProps={{ autoComplete: 'off' }} id={"no_of_installment"+(key + 1)} placeholder="Installment No" type="text" value={original.no_of_installments} onChange={(event)=>this.handleChangeData(key,"no_of_installments",event.target.value)} disabled={this.state.edit_form ? false : true}/>
                                                                        </div>),

                                                                        frequency:(<div>
                                                                            <FormControl fullWidth>
                                                                                <TextField                        
                                                                                    id={"frequency"+(key + 1)}
                                                                                    select
                                                                                    label="Select Frequency"
                                                                                    variant="outlined"
                                                                                    value={original.frequency}
                                                                                    onChange={(event)=>this.handleChangeData(key,"frequency",event.target.value)} 
                                                                                    disabled={this.state.edit_form ? false : true}>
                                                                                    {this.state.frequencyHolders.map(option => (
                                                                                    <MenuItem key={option} value={option} id={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </FormControl>
                                                                            {/* <TextField inputProps={{ autoComplete: 'off' }} id={"frequency"+(key + 1)} placeholder="Frequency" type="text" value={original.frequency} onChange={(event)=>this.handleChangeData(key,"frequency",event.target.value)} disabled={this.state.edit_form ? false : true}/> */}
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
                                                                            }}  disabled={this.state.edit_form ? false : true}
                                                                            />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>),

                                                                        first_due:((<div>
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
                                                                            }}  disabled={this.state.edit_form ? false : true}
                                                                            />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>)),

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
                                                                                                onChange={() => this.handleRoomRentDeactivate(original.id, original.status)}
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
                                                            Header: "Floor No.",
                                                            accessor: "floor_no",
                                                            className: "center",
                                                            filterable: false
                                                            },
                                                            {
                                                            Header: "Room No.",
                                                            accessor: "room_id",
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
                                                            Header: "Deposite",
                                                            accessor: "deposite",
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
                                                        <Button className="m-2" variant="outlined" color="secondary" href={Config.url+"HostelRents/excelRoomRent?block_id="+this.state.selectedBlock+"&floor_no="+this.state.selectedFloor+"&room_id="+this.state.selectedRoom+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                                                        { !this.state.edit_form && <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.setState({edit_form:true})}>Edit</Button>}
                                                        { this.state.edit_form && <Button className="m-2" variant="contained" color="secondary" onClick={()=>this.setState({edit_form:false})}>Cancel</Button> } 
                                                        { this.state.edit_form && <Button className="m-2 successBtnOutline" variant="outlined"  onClick={()=>this.insertRoomFee()}>Submit</Button>}
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
