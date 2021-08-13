import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import { Animated } from "react-animated-css";
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
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import Moment from "moment";
import axios from 'axios';

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

class RoomFeeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      dialogOpen: true,
      actionType: 'room_structure',
      loading: false,
      selectedBlockId: '',
      TabValue: 0,
      checkAll: false,
      blocksList: [],
      checked: [],
      holidays: [{ id: 1, name: 'test' }],
      startdate: new Date(),
      enddate: new Date(),
      confirmPanel: false,
      activePanelType: true,
      selectedTab: '',
      selectedSubTab: '',
      error: '',
      activeSidebarTab: "room_structure",
      alert: null,
      roomholders: [{ bill_date: '', bill_no: '', supplier: '', fuel_station: '', driver_name: '', discount: '0', adjustment: '0'
      , total: '',TDS:0,payment_date:0,transaction_id:'',paying_amount:'',paying_account_no:''}],
      getFuelDetailsWithVehicleId: [{ bill_date: '', bill_no: '', supplier: '', fuel_station: '', driver_name: '', discount: '0', adjustment: '0'
      , total: '',paid_status:'' }],
      total:'0',
      subTotal:'0',
      subTotalAmt:'0',
      balance:0,
      paidTillDate:0,
      expenseDetails:[{particular:'',base_amount:0,tax:0}],
      loading: true,
      selectedBoard: '',
      basicNotify: false,
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      selectedFile: null,
      imagePreviewUrl: defaultImage,
      
      paidStatus: false,
      PaymentMode:'',
      Bank:'',
      datePay: new Date(),
      selected: null,
      selectedPaidStatusId:'',
      paidStatusDrawer:false,
      PaymentDetails:[],
      UnpaidDetails:[{transaction_id:0,paying_amount:0,paying_account_no:0}],
      UnpaidPayment:false,

      PaymentModeUnpaid:null,
      BankUnpaid:null,
      datePayUnpaid: new Date(),
      unPaidTotal:0,
      tax:0,
    };
  }

  handleDeactive = (id, status) => {
    let headingStatus = "Block Activated!";
    if (status == 1) {
      headingStatus = "Block Deactivated!";
    }

    const postData = {
      id: id,
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/deleteVehicleMaintainanceDetails', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getDetails();
        setTimeout(() => {
          this.setState({ basicNotify: false });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  HandlePaidStatus=(paidStatus,id)=>{
    this.state.paidStatusDrawer?this.setState({paidStatusDrawer:false}):this.setState({paidStatusDrawer:true});
    console.log(this.state.paidStatusDrawer);
    if(id){
      // let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
      const postData = {
        id_organization: this.state.selectedOrganizationId,
        id_institute: this.state.selectedInstitutionId,
        token: "abc",
        id_user: this.props.data.UID,
        // type: type,
        id_board: this.state.selectedBoard,
        id_academicyear: this.state.selectedAcademicYear,
        id: id
      };
  
      new Service().apiCall('TransportationMasters/getVehiclePaymentDetails', postData).then(response => {
        console.log(response);
        if (response.status == 200 && response.data != ' ') {
          const visitorList = response.data.map((data) => {
            return { ...data, checked: false, editable: false};
          });
          this.setState({ PaymentDetails: visitorList });
        }
        else {
          this.setState({ PaymentDetails: [] });
        }
      }).catch(error => {
        alert(error);
      });
    }



   }

  insertBlock = () => {
   
    let headingStatus = "Block Inserted!";
    let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let datac = this.state.roomholders;
    let discount=  datac[0]['discount'];
    let adjustment=  datac[0]['adjustment'];
    let bill_date=  datac[0]['bill_date'];
    let bill_no=  datac[0]['bill_no'];
    let supplier=  datac[0]['supplier'];
    // let fuel_station=  datac[0]['fuel_station'];
    // let driver_name=  datac[0]['driver_name'];
    
    // let total=  this.state.total;

    let TDS=  datac[0]['TDS'];
    let transaction_id=datac[0]['transaction_id'];
    let paying_amount=datac[0]['paying_amount'];
    let paying_account_no=datac[0]['paying_account_no'];
    
    let total=  this.state.total;
    let paidTillDate=this.state.paidTillDate;
    
    let balance=this.state.balance;
    let datePay=this.state.datePay;
    let PaymentMode=this.state.PaymentMode;
    let Bank=this.state.Bank;

    let formData = new FormData();
    formData.append('id_board', this.state.selectedBoard);
    formData.append('id_academicyear', this.state.selectedAcademicYear);
    formData.append('id_organization', this.props.data.selectedOrganizationId);
    formData.append('id_institute', this.props.data.selectedInstitutionId);
    formData.append('token', 'abc');
    formData.append('id_user', this.props.data.UID);
    formData.append('path', this.state.selectedFile);
    formData.append('expenseDetails', JSON.stringify(this.state.expenseDetails));
    formData.append('id_vehicle', id_vehicle);
    formData.append('bill_date', bill_date);
    formData.append('bill_no', bill_no);
    formData.append('supplier', supplier);
    // formData.append('fuel_station', fuel_station);
    // formData.append('driver_name', driver_name);
    formData.append('discount', discount);
    formData.append('adjustment', adjustment);
    formData.append('total', total);

    formData.append('paidTillDate', paidTillDate);
    formData.append('balance', balance);
    formData.append('payment_date', datePay);
    formData.append('payment_mode', PaymentMode);
    formData.append('transaction_id', transaction_id);
    formData.append('bank_transaction_type', Bank);
    formData.append('paying_amount', paying_amount);
    formData.append('paying_account_no', paying_account_no);
    formData.append('TDS', TDS);

    // const postData = {
    //   id_organization: this.props.data.selectedOrganizationId,
    //   id_institute: this.props.data.selectedInstitutionId,
    //   id_board: this.props.data.selectedBoardId,
    //   id_academicyear: this.props.data.selectedAcademicId,
    //   expenseDetails: this.state.expenseDetails,
    //   id_vehicle:id_vehicle,
    //   bill_date:bill_date,
    //   bill_no:bill_no,
    //   odometer_reading:odometer_reading,
    //   fuel_station:fuel_station,
    //   driver_name:driver_name,
    //   discount:discount,
    //   adjustment:adjustment,
    //   total:total,
    //   token: "abc",
    //   id_user: this.props.data.UID
    // };
    console.log(formData);
    // new Service().apiCall('TransportationMasters/insertFuelData', postData).then(response => {
      new Service().apiCall('TransportationMasters/insertVehicleMaintainance', formData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getDetails();
        setTimeout(() => {
          this.setState({ basicNotify: false, roomholders: [{ bill_date: '', bill_no: '', odometer_reading: '', fuel_station: '', driver_name: '', discount: 0, adjustment: 0
          , total: 0 }],
          total:'0',
          subTotal:'0',
          subTotalAmt:'0',
          expenseDetails:[{particular:'',base_amount:0,tax:0}] });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }


  updateHeading = (id, index) => {
    let data = this.state.getFuelDetailsWithVehicleId;
 
    let bill_date = data[index].bill_date;
    let bill_no = data[index].bill_no;
    let total = data[index].total;
    let paid_status = data[index].paid_status;
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      id: id,
      bill_date: bill_date,
      bill_no: bill_no,
      total: total,
      paid_status: paid_status,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/updateVehicleMaintainance', postData).then(response => {
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">Block Updated</h4>
              </div>
            </Dialog>
          ),
        });
        this.getDetails();
        setTimeout(() => {
          this.setState({ basicNotify: false });
        }, 2000)
      } else {
        // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //console.log(error);
      //this.raiseLoginSignupErrorAlert("signup");

    });
  }

  insertBlockUnpaid = () => {
   
    let headingStatus = "Block Updated!";
    let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let datac = this.state.UnpaidDetails;
    let PaymentDetails=this.state.PaymentDetails;
   

    
    let transaction_id=datac[0]['transaction_id'];
    let paying_amount=datac[0]['paying_amount'];
    let paying_account_no=datac[0]['paying_account_no'];
    
    let total=  PaymentDetails[0]['total'];
    let id_vehicle_maintainance=  PaymentDetails[0]['id_vehicle_maintainance'];

    // let paidTillDate=this.state.paidTillDate;

    let balance=this.state.balance;
    let datePay=this.state.datePayUnpaid;
    let PaymentMode=this.state.PaymentModeUnpaid;
    let Bank=this.state.BankUnpaid;

    let formData = new FormData();
    formData.append('id_board', this.state.selectedBoard);
    formData.append('id_academicyear', this.state.selectedAcademicYear);
    formData.append('id_organization', this.props.data.selectedOrganizationId);
    formData.append('id_institute', this.props.data.selectedInstitutionId);
    formData.append('token', 'abc');
    formData.append('id_user', this.props.data.UID);
    
    formData.append('total', total);

   
    formData.append('balance', balance);
    formData.append('payment_date', datePay);
    formData.append('payment_mode', PaymentMode);
    formData.append('transaction_id', transaction_id);
    formData.append('bank_transaction_type', Bank);
    formData.append('paying_amount', paying_amount);
    formData.append('paying_account_no', paying_account_no);
    formData.append('id_vehicle_maintainance', id_vehicle_maintainance);
    formData.append('id', id_vehicle_maintainance);
    
    console.log(...formData);
    // new Service().apiCall('TransportationMasters/insertFuelData', postData).then(response => {
      new Service().apiCall('TransportationMasters/VehicleUnpaidTransactionDetails', formData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    ).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != '') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
              <div className="text-center p-5">
                <h4 className="font-weight-bold">{headingStatus}</h4>
              </div>
            </Dialog>
          ),
        });
        this.getDetails();
        this.getBalance();
        this.HandlePaidStatus("paidStatus",id_vehicle_maintainance);
        setTimeout(() => {
          this.setState({ basicNotify: false, roomholders: [{ bill_date: '', bill_no: '', odometer_reading: '', fuel_station: '', driver_name: '', discount: 0, adjustment: 0
          , total: 0,TDS:0,balance:0 }],
          total:'0',
          subTotal:'0',
          subTotalAmt:'0',
          expenseDetails:[{particular:'',base_amount:0,tax:0}] });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }


  addBlock = () => {
    let data = this.state.expenseDetails;
    let object = {particular:'',base_amount:0,tax:0};
    data.push(object);
    this.setState({ data });
    this.calculateTotal();
  }

  removeBlock = (index) => {
    const { expenseDetails } = this.state;
    this.setState({ expenseDetails: expenseDetails.filter((data, i) => i !== index) })
    this.calculateTotal();

  }
  

  // getBlocksData = (id, type) => {
  //   const postData = {
  //     id_organization: this.state.selectedOrganizationId,
  //     id_institute: this.state.selectedInstitutionId,
  //     token: "abc",
  //     id_user: this.props.data.UID,
  //     type: type,
  //     id_board: this.state.selectedBoard,
  //     id_academicyear: this.state.selectedAcademicYear,
  //   };
  //   new Service().apiCall('TransportationMasters/getFuelDetailsWithVehicleId', postData).then(response => {
  //     console.log(response)
  //     if (response.status == 200 && response.data != '') {
  //       const data = response.data.map((data) => {
  //         return { ...data, checked: false, editable: false, gross_rent: 0 };
  //       });

  //       this.setState({ blocksList: data });
  //     } else {
  //       this.setState({ blocksList: [] });
  //     }
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }





  rowEdit = (estatus, index) => {

    let blocks = this.state.getFuelDetailsWithVehicleId;
    if (estatus == true) {
      blocks[index].editable = false;
    }
    else {
      blocks[index].editable = true;
    }
    this.setState({ blocks });
  }
  handleChangeDataUnpaid = (index, name, value) => {
    let data = this.state.UnpaidDetails;
    data[index][name] = value;
    this.setState({ data });
    this.calculateTotal();
  };

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.getFuelDetailsWithVehicleId];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;
    this.setState({ data });
  };

  handleChangeData = (index, name, value) => {
    let data = this.state.roomholders;
    data[index][name] = value;
    this.setState({ data });
    this.calculateTotal();
  };
  handleChangeDataED = (index, name, value) => {
    let data = [...this.state.expenseDetails];
    data[index][name] = value;
    this.setState({ data });
    this.calculateTotal();
    // let datac = this.state.roomholders;

    // console.log(datac[0]['bill_date']);
  };
  calculateTotal = () => {
    let sum=0;
    let total=0;
    let discount=0;
    let adjustment=0;
    let subTotal=0;
    let tds=0;
    if(this.state.expenseDetails.length > 0){
       sum = this.state.expenseDetails.map(o => parseInt(o.tax) + parseInt(o.base_amount)).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
       let datac = this.state.roomholders;
        discount=  parseInt(datac[0]['discount']);
        adjustment=  parseInt(datac[0]['adjustment']);
        tds = parseInt(datac[0]['TDS']);
       total = (sum+ tds) - (discount + adjustment);

       subTotal = this.state.expenseDetails.map(o =>  o.base_amount).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
      //  console.log(discount);
      //  console.log(adjustment);

    }
    this.setState({ total:total,subTotal:subTotal,subTotalAmt:sum });
  }
  handleClickStatus=()=>{
    this.state.paidStatus?this.setState({paidStatus:false}):this.setState({paidStatus:true});
    console.log(this.state.paidStatus);
   }

  renderEditable = (cellInfo) => {

    const cellValue = this.state.getFuelDetailsWithVehicleId[cellInfo.index][cellInfo.column.id];
    if (cellInfo.original.editable) {
      return (
        <FormControl >
          <TextField
            inputProps={{
              autoComplete: 'off'
            }}
            id="document-type"
            value={cellValue}
            placeholder={"Block Name"}
            type="text"
            onChange={event => this.handleInputChange(cellInfo, event)}
          />
        </FormControl>
      );

    }
    else {
      return cellValue;
    }

  };
  getBalance = (type) => {
    let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      type: type,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      id_vehicle: id_vehicle
    };

    new Service().apiCall('TransportationRouteMasters/getBalance', postData).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != ' ') {
        const visitorList = response.data.map((data) => {
          // return { ...data, checked: false, editable: false};

          return data.balance;
        });
        this.setState({ balance: visitorList });
      }
      else {
        this.setState({ balance: 0 });
      }
    }).catch(error => {
      alert(error);
    });
  }
  getDetails = (type) => {
    let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,
      type: type,
      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
      id_vehicle: id_vehicle
    };

    new Service().apiCall('TransportationMasters/getVehicleMaintainanceWithId', postData).then(response => {
      console.log(response);
      if (response.status == 200 && response.data != ' ') {
        const visitorList = response.data.map((data) => {
          return { ...data, checked: false, editable: false};
        });
        this.setState({ getFuelDetailsWithVehicleId: visitorList });
      }
      else {
        this.setState({ getFuelDetailsWithVehicleId: [] });
      }
    }).catch(error => {
      alert(error);
    });
  }

  // onFileUpload = () => { 
  //   // Create an object of formData 
  //   const formData = new FormData(); 
   
  //   // Update the formData object 
  //   formData.append( 
  //     "myFile", 
  //     this.state.selectedFile, 
  //     this.state.selectedFile.name 
  //   ); 
   
  //   // Details of the uploaded file 
  //   console.log(this.state.selectedFile); 
   
  //   // Request made to the backend api 
  //   // Send formData object 
  //   axios.post("api/uploadfile", formData); 
  // }; 
  // onFileChange = event => { 
  //   // Update the state 
  //   this.setState({ selectedFile: event.target.files[0] }); 
  // }; 

  handleImageChange = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(event.target.files[0])
  };
  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile: null
    });
    fileInput.current.value = null;
  };

  componentDidMount() {
    // this.getBlocksData();
    this.getDetails();
    this.getBalance();
  }

  render() {
    const width = window.innerWidth;
    const width40p = width * (40 / 100) + "px";
    const width100p = width + "px";
    const level1 =  width * (60/100)+"px" ;
    return (
      <Fragment>
      <Drawer

anchor="right"
open={this.state.paidStatusDrawer}
variant="temporary"
elevation={4}
onClose={()=> this.setState({paidStatusDrawer:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:level1}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({paidStatusDrawer:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Payment Status
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={2}>
        <Grid xs={12} sm={6} md={12} lg={12}>
          
        <Grid container spacing={2}>
          
        <Grid xs={12} sm={12} md={12} lg={12}>
          
              {/* {this.props.data.organization[this.state.selectedOrgIndex].institutes.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes.map((instdata ,index)=>  */}
              {/* <Card className= "activeCard backgroundTransparent card-box  m-3 p-3">
                   <div className="font-weight-400" onClick={() => {}}>Aks</div>
              </Card> */}
              {/* )} */}
              <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.PaymentDetails.map((element, key) => (
                                            <Grid item xs={12} sm={12} lg={10}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                        {/* <Grid item xs={12} sm={12} lg={3}>
                                                            <h5>{key + 1}</h5>
                                                            <div><small>{element.block_name}</small></div>
                                                        </Grid> */}
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                                {/* <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.UID}</h5>
                                                                    <div><small>Student UID</small></div>
                                                                </Grid> */}
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5 style={ element.paid_status=='UNPAID'?
                                                                                            { color: 'rgb(255,140,0)', cursor: 'pointer' }:{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }
                                                                                        }>{element.paid_status}</h5>
                                                                    <div><small>Payment Status</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{Moment(element.payment_date).format('YYYY-MM-DD')}</h5>
                                                                    <div><small>Paid Date</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5 >{element.paying_amount}</h5>
                                                                    <div><small>Paid Amount</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.total}</h5>
                                                                    <div><small>Total</small></div>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.balance}</h5>
                                                                    <div><small>Balance</small></div>
                                                                </Grid>
                                                               
                                                                
                                                               
                                                                
                                                                {element.paid_status=='UNPAID' &&
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">  
                                                                    <Button variant="contained" color="secondary" onClick={() => {this.state.UnpaidPayment==false?this.setState({UnpaidPayment:true}):this.setState({UnpaidPayment:false})}}>Pay</Button>
                                                                </Grid>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                       {element.paid_status=='PAID' &&
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                           
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.payment_mode}</h5>
                                                                    <div><small>Payment Mode</small></div>
                                                                </Grid>
                                                                {element.payment_mode=='bank' &&
                                                                <>
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.bank_transaction_type}</h5>
                                                                    <div><small>Bank Transaction Type</small></div>
                                                                </Grid>
                                                                
                                                                <Grid item xs={12} sm={12} lg={2}>
                                                                    <h5>{element.transaction_id}</h5>
                                                                    <div><small>Transaction Id</small></div>
                                                                </Grid>
                                                                </>
                                                              }
                                                                </Grid>
                                                                </Grid>
                                                       }
                                                       {this.state.UnpaidPayment==true &&
                                                      
                                                       this.state.UnpaidDetails.map((originals, index) => (
                                                       <Card className="card-box mt-3 p-2" align='center'>
                              <Grid container spacing={4} >
                              <Grid item xs={12} md={5} lg={5}>
                              <h6 className=" mt-2 p-1">Payment Mode:</h6>
                              </Grid>

                              <Grid item xs={12} md={7} lg={7}>
                                                                <FormControl fullWidth className="pb-0">
                                                                    <RadioGroup row aria-label="position" name="PaymentMode" value={this.state.PaymentModeUnpaid} onChange={(event) => this.setState({PaymentModeUnpaid:event.target.value})} defaultValue="">
                                                                    <FormControlLabel value="cash" control={
                                                                        <Radio name="PaymentMode" color="primary"
                                                                            />} label="Cash"
                                                                            
                                                                             checked={this.state.PaymentModeUnpaid == 'cash'}/>
                                                                    <FormControlLabel value="bank" control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="Bank" checked={this.state.PaymentModeUnpaid == 'bank'}
                                                                  
                                                                   />
                                                     </RadioGroup>
                                           </FormControl>
                                       </Grid>
                                      {this.state.PaymentModeUnpaid=='bank' &&
                                       <Grid item xs={12} md={12} lg={12} className="text-center pt-0">
                                                                <FormControl >
                                                                    <RadioGroup row  name="PaymentMode" value={this.state.BankUnpaid} onChange={(event) => this.setState({BankUnpaid:event.target.value})} defaultValue="">
                                                                    <FormControlLabel value="cheque" 
                                                                    control={
                                                                        <Radio name="PaymentMode" color="primary"
                                                                            />}
                                                                   label="Cheque" checked={this.state.BankUnpaid == 'cheque'}
                                                                  
                                                                   />
                                                                    <FormControlLabel value="DD" 
                                                                    control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="DD" checked={this.state.BankUnpaid == 'DD'} 
                                                                  
                                                                  />
                                                                    <FormControlLabel value="online" 
                                                                  control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="Online" checked={this.state.BankUnpaid == 'online'}
                                                                 
                                                                  />
                                                                  <FormControlLabel value="POS" 
                                                                  control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="POS" checked={this.state.BankUnpaid == 'POS'}
                                                                 
                                                                   />
                                                     </RadioGroup>
                                           </FormControl>
                                       </Grid>
                                      }

                                       {/* ///// */}
                                       <Grid item xs={12} lg={4} className="py-1">
          <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          id="date-picker-dialog"
          label="Payment Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.datePayUnpaid}
          onChange={(val)=>this.handleDateUnpaid(index,'payment_date',val)}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
                              <Grid item xs={12} sm={10} md={4} className="py-1">
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeDataUnpaid(index, "transaction_id", event.target.value)}
                                    value={originals.transaction_id}
                                    id="document-type"
                                    label="Inst./Trans. ID"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={4} className="py-1">
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeDataUnpaid(index, "paying_amount", event.target.value)}
                                    value={originals.paying_amount}
                                    id="document-type"
                                    label="Amount Rs."
                                    type="number"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={7}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeDataUnpaid(index, "paying_account_no", event.target.value)}
                                    value={originals.paying_account_no}
                                    id="document-type"
                                    label="Paying from A/C No."
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertBlockUnpaid()}>Submit</Button>
                            </Grid>
                                                            
                              </Card>
                                                       
                                                       ))}
                                                       
                                                    </Grid>
                                                </div>
                                            </Grid>
                                          ))}

                                        </Grid>
                                   
            
        </Grid>  
     
        
        </Grid>
        </Grid>
        </Grid>

       
                  
</div>
  </PerfectScrollbar>
</Box>
</Drawer>      

        {this.state.basicNotify}
        <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
          <AppBar className="app-header" color="secondary" position="fixed">
            <Toolbar className="w-100">
              <Grid container>
                <Grid item xs={12} lg={12} className="d-flex">
                  <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/Fleet-management")} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h4" className="p-12">
                    Add maintainance expenses
                                    </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Animated animationIn="slideInRight" animationOut="slideOutLeft">
            <div className="pt-100">

              <Grid container spacing={2} className="sliderDiv" justify="center">


                <Grid item xs={12} sm={8} md={8} lg={8} >
                  {/* Room Structure section */}
                  <div>
                    <Grid container justify="center">
                      <Grid item xs={12} md={8} lg={11}>
                      {this.state.roomholders.map((element, index) => (
                        <Card className="card-box  mb-4 p-3">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Add Vehicle Maintainance
                                                                    </h4>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                          
                            <Grid container spacing={4}>

                              <Grid item xs={12} sm={10} md={4}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "bill_date", event.target.value)}
                                    value={element.bill_date}


                                    id="document-type"
                                    label="Bill date"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>


                              <Grid item xs={12} sm={10} md={3}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "bill_no", event.target.value)}
                                    value={element.bill_no}
                                    id="document-type"
                                    label="Bill no"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={5}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}

                                    onChange={(event) => this.handleChangeData(index, "supplier", event.target.value)}
                                    value={element.supplier}
                                    id="document-type"
                                    label="Supplier/Garage Name"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              {/* <Grid item xs={12} sm={10} md={6}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "fuel_station", event.target.value)}
                                    value={element.fuel_station}
                                    id="document-type"
                                    label="Fuel Station Name"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={6}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "driver_name", event.target.value)}
                                    value={element.driver_name}
                                    id="document-type"
                                    label="Driver Name"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                             */}
                            </Grid>
                         


                          <Grid item xs={12} sm={12} md={12}>
                            <br /><br />
                            <h5>Expense Details</h5>
                          </Grid>
                          {this.state.expenseDetails.map((element, index) => (

                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={10} lg={1} align="center">
                                <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                  {index + 1}
                                </FormControl>
                              </Grid>


                              <Grid item xs={12} sm={10} md={4}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeDataED(index, "particular", event.target.value)}
                                    value={element.particular}
                                    id="document-type"
                                    label="Particular"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>


                              <Grid item xs={12} sm={10} md={3}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeDataED(index, "base_amount", event.target.value)}
                                    value={element.base_amount}
                                    id="document-type"
                                    label="Base Amount Rs."
                                    type="number"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={3}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => {this.handleChangeDataED(index, "tax", event.target.value);
                                               this.setState({tax:event.target.value})}}
                                    value={ element.tax }
                                    id="document-type"
                                    label="Tax Rs."
                                    type="number"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                             



                              <Grid item xs={12} sm={12} lg={1}>
                                {index == 0 ? <FormControl fullWidth>
                                  <TextField

                                    InputProps={{
                                      autoComplete: 'off',
                                      readOnly: true,
                                      startAdornment: (
                                        <InputAdornment position="start" >
                                          <Add onClick={() => this.addBlock()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer', marginLeft: "-8px" }} />
                                        </InputAdornment>
                                      ),
                                    }}
                                    id="document-type" label="Add" variant="outlined" />
                                </FormControl> :
                                  <FormControl fullWidth>
                                    <TextField
                                      InputProps={{
                                        autoComplete: 'off',
                                        readOnly: true,
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <Remove onClick={() => this.removeBlock(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer', marginLeft: "-8px" }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      id="document-type" label="Add" variant="outlined" />
                                  </FormControl>}
                              </Grid>
                            </Grid>
                          ))}
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={10} lg={1} ></Grid>
                            <Grid item xs={12} sm={10} md={4} >
                              <FormControl fullWidth >
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}

                                  value="Sub Total Rs."
                                  id="document-type"
                                  // label="" 
                                  type="text"
                                  variant="outlined" disabled />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={3} >
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}

                                  value={this.state.subTotal}
                                  id="document-type"
                                  // label="" 
                                  type="text"
                                  variant="outlined" disabled />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={3} >
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}

                                  value={this.state.subTotalAmt}
                                  id="document-type"
                                  // label="1180" 
                                  // type="text" 
                                  variant="outlined" disabled />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={6} >

                            </Grid>

                            <Grid item xs={12} sm={10} md={2} align="right">
                              <FormControl fullWidth>
                                <h6>Discount</h6>

                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={3} >
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}
                                  onChange={(event) => this.handleChangeData(index, "discount", event.target.value)}
                                    value={element.discount}
                                  id="document-type"
                                  label="Rs."
                                  type="text"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={10} md={6} >

                            </Grid>
                            <Grid item xs={12} sm={10} md={2} align="right">
                              <FormControl fullWidth>
                                <h6>Adjustment</h6>

                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={3} >
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}
                                  onChange={(event) => this.handleChangeData(index, "adjustment", event.target.value)}
                                    value={element.adjustment}
                                  id="document-type"
                                  label="Rs."
                                  type="text"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={6} >

                            </Grid>

                            <Grid item xs={12} sm={10} md={2} align="right">
                              <FormControl fullWidth>
                                <h6>Total Rs.</h6>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={10} md={3} >
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}

                                  value={this.state.total}
                                  id="document-type"
                                  // label="Rs." 
                                  type="text"
                                  disabled />
                              </FormControl>
                            </Grid>






                          </Grid>









                          <Grid container spacing={4}>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                              <Card className="card-box " style={{ padding: "15px" }}>
                                <Grid container spacing={4}>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='center'>
                                    <FormControl fullWidth>
                                      <h6 style={{ marginBottom: "0px" }}> Payment Status:</h6>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='center'>
                                  <FormControl fullWidth >
                                      <h6 style={{ marginBottom: "0px",color: 'rgb(255,0,0)' }} onClick={() => { this.handleClickStatus()  }}> UNPAID</h6>
                                    

                                    </FormControl>
                                  </Grid>
                                </Grid>

                              </Card>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <Card className="card-box " style={{ padding: "15px" }}>
                                <Grid container spacing={4}>
                                  <Grid item lg={8} md={8} sm={12} xs={12}>
                                    <FormControl fullWidth>
                                      <h6 style={{ marginBottom: "0px" }}>Add Receipt Scan Copy:</h6>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={3} md={3} sm={6} xs={6}>
                                    <FormControl fullWidth>
                                  
                                      {/* <InputAdornment position="start" align='center' >
                                     
                                        <Add onClick={() => this.onFileUpload()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer', marginBottom: "0px", marginTop: "15px" }} />
                                      </InputAdornment> */}
                                      <div className="fileinput text-center">
                              <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                              <div className={"img-circle"}>
                                {/* <img className="w-100" src={this.state.imagePreviewUrl} alt={this.state.imagePreviewUrl} /> */}
                              </div>
                              <div>
                                {this.state.selectedFile === null ? (
                                  <div>
                                  {/* <Button color="secondary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                                    {"Select file"}
                                  </Button> */}
                                  <InputAdornment position="start" align='center' >
                                     
                                     <Add onClick={() => this.handleClick()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer', marginBottom: "0px", marginTop: "15px" }} />
                                   </InputAdornment>
                                 </div> 
                                ) : (
                                  <span>
                                    <Button color="primary" className="m-2" variant="contained" onClick={() => this.handleClick()}>
                                      Change
                                  </Button>
                                    { null}
                                    <Button color="danger" className="m-2 text-danger" variant="contained" onClick={() => this.handleRemove()}>
                                      <i className="fas fa-times" /> Remove
                               </Button>
                                  </span>
                                )}
                              </div>
                            </div>
                          

                             

                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Card>
                            </Grid>
                          </Grid>

                          {this.state.paidStatus==true && 
                          <Grid container spacing={4} align='center'>
                         
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                              <Card className="card-box " style={{ padding: "15px" }}>
                                <Grid container spacing={4} >
                                  <Grid item lg={12} md={12} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth>
                                      <h6 style={{ marginBottom: "0px" }}><b> Summary</b></h6>
                                      

                                    </FormControl>
                                  </Grid>
                                  
                                </Grid>
                                <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                      + Base Amount Rs.
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                    {this.state.subTotal}
                                      

                                    </FormControl>
                                  </Grid>
                                
                                </Grid>
                                <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                      + GST Rs.
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                  
                                    {/* { element.tax } */}
                                    {this.state.tax}
                                   
                                    </FormControl>
                                  </Grid>
                                
                                </Grid>
                                {/* <Divider/> */}
                                {/* <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    + GST Rs.
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                       10000
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid> */}
                                {/* /////// */}
                                <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    <b>Sub Total Rs.</b>
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                    {this.state.subTotal}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                {/* ///////// */}
                                <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    - Discount Rs.
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                    {element.discount}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                 {/* ///////// */}
                                 <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    +/- Adjustment Rs.
                                      

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                    {element.adjustment}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                 {/* ///////// */}
                                 <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    - TDS Rs.

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                       {element.TDS}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                 {/* ///////// */}
                                 <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    <b>Total Bill Value Rs.</b>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                       {this.state.total}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                 {/* ///////// */}
                                 {/* <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    <b>- Paid Till Date Rs.</b>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                       {this.state.paidTillDate}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid> */}
                                {/* ///////// */}
                                <Grid container spacing={4} >
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='left'>
                                    <FormControl fullWidth  style={{ paddingLeft: "15px" }} >
                                    <b>Balance.</b>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} align='right'>
                                    <FormControl fullWidth style={{ paddingRight: "15px" }}>
                                       {this.state.balance}
                                      

                                    </FormControl>
                                  </Grid>
                               
                                </Grid>
                                

                              </Card>
                            </Grid>
                            
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <Card className="card-box " style={{ padding: "15px" }} align='center'>
                                <Grid container spacing={4}>
                                  <Grid item lg={7} md={7} sm={12} xs={12}>
                                    <FormControl fullWidth>
                                      <h6 style={{ marginBottom: "0px" }}>TDS</h6>

                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={5} md={5} sm={6} xs={6}>
                                  <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize', textAlign: 'right' }
                                  }}
                                  onChange={(event) => this.handleChangeData(index, "TDS", event.target.value)}
                                    value={element.TDS}
                                  id="document-type"
                                  label="Rs."
                                  type="text"
                                  variant="outlined" />
                              </FormControl>
                                  </Grid>
                                </Grid>
                              </Card>
                              {/* /////// */}
                             
                             
                             
                              <Card className="card-box mt-3 p-2" align='center'>
                              <Grid container spacing={4} >
                              <Grid item xs={12} md={5} lg={5}>
                              <h6 className=" mt-2 p-1">Payment Mode:</h6>
                              </Grid>

                              <Grid item xs={12} md={7} lg={7}>
                                                                <FormControl fullWidth className="pb-0">
                                                                    <RadioGroup row aria-label="position" name="PaymentMode" value={this.state.PaymentMode} onChange={(event) => this.setState({PaymentMode:event.target.value})} defaultValue="">
                                                                    <FormControlLabel value="cash" control={
                                                                        <Radio name="PaymentMode" color="primary"
                                                                            />} label="Cash"
                                                                            
                                                                             checked={this.state.PaymentMode == 'cash'}/>
                                                                    <FormControlLabel value="bank" control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="Bank" checked={this.state.PaymentMode == 'bank'}
                                                                  
                                                                   />
                                                     </RadioGroup>
                                           </FormControl>
                                       </Grid>
                                      {this.state.PaymentMode=='bank' &&
                                       <Grid item xs={12} md={12} lg={12} className="text-center pt-0">
                                                                <FormControl fullWidth>
                                                                    <RadioGroup row  name="PaymentMode" value={this.state.Bank} onChange={(event) => this.setState({Bank:event.target.value})} defaultValue="">
                                                                    <FormControlLabel value="cheque" 
                                                                    control={
                                                                        <Radio name="PaymentMode" color="primary"
                                                                            />}
                                                                   label="Cheque" checked={this.state.Bank == 'cheque'}
                                                                  
                                                                   />
                                                                    <FormControlLabel value="DD" 
                                                                    control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="DD" checked={this.state.Bank == 'DD'} 
                                                                  
                                                                  />
                                                                    <FormControlLabel value="online" 
                                                                  control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="Online" checked={this.state.Bank == 'online'}
                                                                 
                                                                  />
                                                                  <FormControlLabel value="POS" 
                                                                  control={<Radio name="PaymentMode" color="primary"
                                                                  />} label="POS" checked={this.state.Bank == 'POS'}
                                                                 
                                                                   />
                                                     </RadioGroup>
                                           </FormControl>
                                       </Grid>
                                      }

                                       {/* ///// */}
                                       <Grid item xs={12} lg={4} className="py-1">
          <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          id="date-picker-dialog"
          label="Payment Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.datePay}
          onChange={(val)=>this.handleDate(index,'payment_date',val)}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
                              <Grid item xs={12} sm={10} md={4} className="py-1">
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "transaction_id", event.target.value)}
                                    value={element.transaction_id}
                                    id="document-type"
                                    label="Inst./Trans. ID"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={4} className="py-1">
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "paying_amount", event.target.value)}
                                    value={element.paying_amount}
                                    id="document-type"
                                    label="Amount Rs."
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={10} md={7}>
                                <FormControl fullWidth>


                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "paying_account_no", event.target.value)}
                                    value={element.paying_account_no}
                                    id="document-type"
                                    label="Paying from A/C No."
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>
                                  </Grid>
                                                            
                              </Card>
                             
                            {/* </Grid> */}
                            {/* /////// */}
                            </Grid>
                            
                          </Grid>
                         }

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={10} className="text-left">
                              <h6 style={{ color: 'red' }}>*Instruction: The expenses booked here automatically posted in EXPENSES under Financial Section Module. Please DO NOT enter this particular transaction in Financial Section Module again.</h6>
                            </Grid>

                            <Grid item xs={12} sm={12} md={2} className="text-right">
                              <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertBlock()}>Submit</Button>
                            </Grid>
                          </Grid>
                        </Card>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid container justify="center">
                      <Grid item xs={12} md={12} lg={11}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Vehicle Maintainance Expenses
                                                                    </h4>
                                </div>
                              </div>

                              <ReactTable
                                data={this.state.getFuelDetailsWithVehicleId.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    vehicle_no: original.vehicle_no,
                                    bill_date: original.bill_date,
                                    bill_no:original.bill_no,
                                    total:original.total,
                                    // paid_status:original.paid_status,
                                    paid_status:(<Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => { this.HandlePaidStatus( original.paid_status,original.id );  }}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                        style={ original.paid_status=='UNPAID'?
                                                                                            { color: 'rgb(255,140,0)', cursor: 'pointer' }:{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }
                                                                                        }
                                                                                    >{original.paid_status}</Button>),
                                    
                                    editable: original.editable,
                                    checked: original.checked,
                                    status: original.status,
                                    actions: (
                                      // we've added some custom button actions
                                      <div>


                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                          {original.editable ? <Button
                                            className="m-2"
                                            simple
                                            onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id, key); }}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <CheckCircleOutline />
                                          </Button> : <Button
                                            className="m-2"
                                            simple
                                            onClick={() => { this.setState({ selectedHeading: original.name }); this.rowEdit(original.editable, key); }}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <EditIcon />
                                          </Button>}
                                        </Tooltip>

                                        {/* use this button to remove the data row */}

                                        <Tooltip id="tooltip-top" title={original.status == "1" ? "Deactivate" : "Activate"} placement="top">
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                checked={original.status == "1" ? true : false}
                                                onChange={() => this.handleDeactive(original.id, original.status)}
                                                value="checkedA"
                                              />
                                            }

                                            label="" />
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
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search S No"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Vehicle No",
                                    accessor: "vehicle_no",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    // Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Bill Date.",
                                    accessor: "bill_date",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Bill No",
                                    accessor: "bill_no",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Amount Rs.",
                                    accessor: "total",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Payment Status",
                                    accessor: "paid_status",
                                    className: "center",
                                    // Filter: ({ filter, onChange }) => (
                                    //   <TextField
                                    //     inputProps={{
                                    //       autoComplete: 'off'
                                    //     }}
                                    //     id="document-type"
                                    //     value={filter ? filter.value : ''}
                                    //     placeholder="Search Name"
                                    //     type="text"
                                    //     onChange={event => onChange(event.target.value)}
                                    //   />
                                    // ),
                                    // Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Actions",
                                    accessor: "actions",
                                    className: "center",
                                    sortable: false,
                                    filterable: false,
                                  }
                                ]}
                                defaultFilterMethod={filterCaseInsensitive}
                                defaultPageSize={10}
                                showPaginationTop
                                showPaginationBottom={false}
                                className="-striped -highlight"
                              />
                            </Grid>
                          </Grid>


                        </Card>
                      </Grid>
                    </Grid>
                  </div>



                  {/* End */}
                </Grid>

              </Grid>

            </div>
          </Animated>
        </Dialog>

      </Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToPros)(RoomFeeManagement);
