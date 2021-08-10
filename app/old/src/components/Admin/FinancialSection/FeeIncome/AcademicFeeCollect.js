import React, { Fragment } from 'react';
import {Dialog,Grid,Tabs,FormControlLabel,FormControl,IconButton,Typography,AppBar,Paper,Card,CardContent,Fab,CardActions,TextField,Button,Toolbar,Box,FormLabel,List,Tooltip,Slide,Checkbox,RadioGroup,Radio,InputAdornment,TabPanel,ButtonGroup,Table,TableBody,TableCell,TableContainer,TableHead,TableRow, ListItem, MenuItem} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Send from "@material-ui/icons/Send";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Remove from "@material-ui/icons/Remove";
import ViewIcon from "@material-ui/icons/Visibility";
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/placeholder.jpg";
import 'date-fns';
import moment from "moment";
import logo from "../../../../assets/images/egenius_logo.png";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
import Config from '../../../../config';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class AcademicFeeMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      loading:false,
      selectedStudent:'',
      receiptInfo:{org_info:'',student_info:'',payment_info:''},
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      basicNotify:false,
      viewSectionStudents:false,
      nonStudentCollectHolder:{name:"",mobile:"",address:"",collectionData:[{particulars:"",amount:""}]},
      nonStudentsCollectionAmt:0,
      nonStudentsFeeList:[],
      feeTotal:0,
      feePaid:0,
      studentInfo:"",
      feePaying:0,
      feeBalance:0,
      paymentHistory:[],
      studentData:[],
      collect_fee:true,
      payment_date: new Date(),
      fee_history:false,
      tabValue:0,
      paymentTabValue:0,
      academicMasterList:[],
      amount_collected_denomination:[{denomination:2000,pieces:0,amount:0},{denomination:500,pieces:0,amount:0},{denomination:200,pieces:0,amount:0},{denomination:100,pieces:0,amount:0},{denomination:50,pieces:0,amount:0},{denomination:20,pieces:0,amount:0},{denomination:10,pieces:0,amount:0}],
      amount_change_denomination:[{denomination:2000,pieces:0,amount:0},{denomination:500,pieces:0,amount:0},{denomination:200,pieces:0,amount:0},{denomination:100,pieces:0,amount:0},{denomination:50,pieces:0,amount:0},{denomination:20,pieces:0,amount:0},{denomination:10,pieces:0,amount:0}],
      tableData: [{
        id: '',
        name: '',
      }],
      totalAmountDenomination:0,
      totalChageDenomination:0,
      selectedStandardId:''
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);  
  }

  handleStudentSearch = (val) => {
    console.log(val);
    this.setState({selectedStudent:val.UID, selectedStudentSection:val.standard,studentInfo:val})
    this.getAcademicFeeHeadings("academic",val.UID,val.standard);
  }

  printReceipt = (id) => {
    window.open(Config.url+"/FeePayments/view_receipt/"+id);
  }

  downloadReceipt = (id) => {
    window.open(Config.url+"/FeePayments/download_receipt/"+id);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 
  selectJoiningStandard = (value) => {
    this.setState({joiningStandard:value});
  }
  getStateValue = (name) => {
    return this.state.name;
  }

  handleChangeNonStudentInput = (name,value) => {
    let Data = this.state.nonStudentCollectHolder;
    Data[name] = value;
    this.setState({Data});
}
  
  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id="document-type"   
          value={this.state[name]}
          label={label} 
          type="search" 
          onChange={(event) => this.handleChangeState(name,event.target.value)}
          className="m-2"
          inputRef={this.textInput} 
          variant="outlined" 
       />
       </FormControl>
      )
  }

  insertPayment = () => {
    const mList = this.state.academicMasterList.filter(x => x.paying_now != 0);
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id_section: this.state.selectedStudentSection,
      UID:this.state.selectedStudent,
      paid_info:mList,
      payment_mode: this.state.paymentMode,
      bank_name:this.state.bank_name,
      branch_name:this.state.branch_name,
      payment_date:moment(this.state.payment_date).format("YYYY-MM-DD"),
      cheque_dd_challan_pos_no:this.state.cheque_dd_challan_pos_no,
      re_cheque_dd_challan_pos_no:this.state.re_cheque_dd_challan_pos_no,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('FeePayments/insert_feepayment',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data==200) {
 
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Successfully Inserted</h4>
          </div>
        </Dialog>
          ),
        });
      
        setTimeout(() => {
         // window.location.reload()
        }, 2000)
      } else {
     //   this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
        //console.log(error);
     // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  getPaymentDetails = () => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      UID:this.state.selectedStudent,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('FeePayments/get_fee_details',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
           this.setState({paymentHistory:response.data});
      }else{
        this.setState({paymentHistory:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 
  verifyNumber = value => {
    var numberRex = new RegExp(/^\d*\.?\d*$/); 
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  getReceiptDetails = (id) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id:id,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('FeePayments/getReceiptInfo',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
           this.setState({receiptInfo:response.data});
      }else{
        this.setState({receiptInfo:[]});
      }
    }).catch(error => {
      console.log(error);
    });
  } 
  verifyNumber = value => {
    var numberRex = new RegExp(/^\d*\.?\d*$/); 
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  handleInputChange = (cellInfo, event, name) => {
    let data = [...this.state.academicMasterList];
    let total = 0;
    let paid = 0;
    let balance = 0;
    let paying = 0;
    data[cellInfo.index][name] = event.target.value;
    data[cellInfo.index].balance = (Math.ceil(data[cellInfo.index].total) - Math.ceil(data[cellInfo.index].academic_amount_paid)) - Math.ceil(data[cellInfo.index].paying_now);
    data.map((element)=>{
      total = total + Math.ceil(element.total);
      paid = paid + Math.ceil(element.academic_amount_paid);
      paying = paying + Math.ceil(element.paying_now);
      balance = balance + (Math.ceil(element.total) - Math.ceil(element.paying_now));
  })
     this.setState({feeTotal:total, feePaid:paid, feePaying:paying, feeBalance: (total - paid)-paying, data, paymentAmount:paying});  
  };

  renderPayingNow = (cellInfo) => {
    const cellValue = this.state.academicMasterList[cellInfo.index].paying_now;
      return (
        <FormControl fullWidth>
  <TextField 
          inputProps={{
           autoComplete: 'off'
           }} 
         onChange={(event)=> { if (this.verifyNumber(event.target.value)) {
          this.handleInputChange(cellInfo,event, "paying_now")
       }}}
         value={cellValue}
         type="text"  />
     
      </FormControl>
    );      
  };

  renderBalance = (cellInfo) => {
    const cellValue = this.state.academicMasterList[cellInfo.index].balance;
      return (
      <div>Rs. {cellValue}</div>
    );      
  };

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

  setValue = (index) => {
    this.setState({tabValue:index})
  }

  setPaymentValue = (index) => {
    this.setState({paymentTabValue:index})
  }

  setPaymentMode = (val) => {
    this.setState({paymentMode:val})
  }

  handleChangeEnabled = (value) => {
    this.setState({ selectedEnabled: value });
  };

  getAcademicFeeHeadings(type,uid,id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:type,
      UID:uid,
      count:"academicfeemaster",
      id_section:id_section,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data = response.data;
        let cArr=[];
        const newArr = data.map(v => ({...v, editable: false}));
        const mList = newArr.filter(x => x.type == type);
        let total=0;
        let paid=0;
        let paying=0;
        let balance=0;
        mList.map((element)=>{
            total = total + Math.ceil(element.total);
            paid = paid + Math.ceil(element.academic_amount_paid);
            balance = balance + Math.ceil(element.balance);
            paying = 0;
        })
        this.setState({feeTotal:total, feePaid:paid, feeBalance:balance, academicMasterList:mList});  
      }
    }).catch(error => {
      alert("error");

    });
  }

  handleAmountDenomination = (index,value) => {
    let amtDenom = this.state.amount_collected_denomination;
    amtDenom[index].pieces = value;
    this.setState({amtDenom});
    this.totalAmountDenomination();
  }


  totalAmountDenomination = () => {
    let sum=0;
    if(this.state.amount_collected_denomination.length > 0){
       sum = this.state.amount_collected_denomination.map(o => o.denomination * o.pieces).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    }
   
    this.setState({totalAmountDenomination:sum});
  }

  renderCdcpNo = () => {
    let label = "";
    if(this.state.paymentTabValue == 2){
      label = "Cheque Number"
    }
    else if(this.state.paymentTabValue == 3){
      label = "DD Number"
    }
    else if(this.state.paymentTabValue == 4){
      label = "Challan Number"
    }
    else if(this.state.paymentTabValue == 5){
      label = "Transaction Number"
    }
    return label;
  }

  handleChangeDenomination = (index,value) => {
    let amtDenom = this.state.amount_change_denomination;
    amtDenom[index].pieces = value;
    this.setState({amtDenom});
    this.totalChageDenomination();
  }

  renderPaymentModeInfo = () => {
    if(this.state.paymentMode == "Cash"){
      return "";
    }
    else if(this.state.paymentMode == "Cheque"){
      return "Cheque No. : "+this.state.cheque_dd_challan_pos_no+" * Bank : "+this.state.bank_name+" * Dated: "+moment(this.state.payment_date).format("DD/MM/YYYY");
    }
    else if(this.state.paymentMode == "DD"){
      return "DD No. : "+this.state.cheque_dd_challan_pos_no+" * Bank : "+this.state.bank_name+" * Dated: "+moment(this.state.payment_date).format("DD/MM/YYYY");
    }
    else if(this.state.paymentMode == "Challan"){
      return "Challan No. : "+this.state.cheque_dd_challan_pos_no+" * Bank : "+this.state.bank_name+" * Dated: "+moment(this.state.payment_date).format("DD/MM/YYYY");
    }
    else if(this.state.paymentMode == "POS"){
      return "Transaction No. : "+this.state.cheque_dd_challan_pos_no+" * Bank : "+this.state.bank_name+" * Dated: "+moment(this.state.payment_date).format("DD/MM/YYYY");
    }
    
  }

  viewPaymentModeInfo = () => {
    if(this.state.receiptInfo.payment_info.mode_of_payment == "Cash"){
      return "";
    }
    else if(this.state.receiptInfo.payment_info.mode_of_payment == "Cheque"){
      return "Cheque No. : "+this.state.receiptInfo.payment_info.cheque_dd_challan_pos_no+" * Bank : "+this.state.receiptInfo.payment_info.bank_name+" * Dated: "+moment(this.state.receiptInfo.payment_info.paid_date).format("DD/MM/YYYY");
    }
    else if(this.state.receiptInfo.payment_info.mode_of_payment == "DD"){
      return "DD No. : "+this.state.receiptInfo.payment_info.cheque_dd_challan_pos_no+" * Bank : "+this.state.receiptInfo.payment_info.bank_name+" * Dated: "+moment(this.state.receiptInfo.payment_info.paid_date).format("DD/MM/YYYY");
    }
    else if(this.state.receiptInfo.payment_info.mode_of_payment == "Challan"){
      return "Challan No. : "+this.state.receiptInfo.payment_info.cheque_dd_challan_pos_no+" * Bank : "+this.state.receiptInfo.payment_info.bank_name+" * Dated: "+moment(this.state.receiptInfo.payment_info.paid_date).format("DD/MM/YYYY");
    }
    else if(this.state.receiptInfo.payment_info.mode_of_payment == "POS"){
      return "Transaction No. : "+this.state.receiptInfo.payment_info.cheque_dd_challan_pos_no+" * Bank : "+this.state.receiptInfo.payment_info.bank_name+" * Dated: "+moment(this.state.receiptInfo.payment_info.paid_date).format("DD/MM/YYYY");
    }
    
  }

  handlePaymentDate = (date) => {
    this.setState({ payment_date: date })
  };

  totalChageDenomination = () => {
    let sum=0;
    if(this.state.amount_change_denomination.length > 0){
       sum = this.state.amount_change_denomination.map(o => o.denomination * o.pieces).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    }
   
    this.setState({totalChageDenomination:sum});
  }

  renderPreviewTotal = () => {
    let sum=0;
    if(this.state.academicMasterList.filter(x => x.paying_now != 0).length > 0){
      sum = this.state.academicMasterList.filter(x => x.paying_now != 0).map(o => o.paying_now).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    }
   
    this.setState({previewTotal:sum})
  }

  componentDidMount() {
    this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
    //this.getAcademicFeeHeadings("academic");
  }

render(){
 

  return (
    <Fragment>
      {this.state.basicNotify}
      <Grid container spacing={2} justify="center">
      <Grid item xs={12} md={8} lg={6}>
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

   {this.state.selectedStudent!='' && <Grid container spacing={2} justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8}>
      <Card className="card-box mb-4 customTab ">
            <div className="card-header p-1 m-3">
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} md={8} lg={8}>
              
                <Tabs
                  value={this.state.tabValue}
                  indicatorColor="default"
                  textColor="secondary"
                  >
                    <ButtonGroup  color="secondary" aria-label="outlined secondary button group" className="buttonGroup">
                  <Button variant={this.state.tabValue == 0 ?"contained":"outlined"} onClick={()=>{this.setValue(0);this.getAcademicFeeHeadings("academic",this.state.selectedStudent,this.state.selectedStudentSection)}}>ACADEMIC</Button>
                  {/* <Button variant={this.state.tabValue == 1 ?"contained":"outlined"} onClick={()=>{this.setValue(1);this.getAcademicFeeHeadings("nonacademic")}}>NON ACADEMIC</Button> */}
                  <Button variant={this.state.tabValue == 2 ?"contained":"outlined"} onClick={()=>{this.setValue(2);this.getAcademicFeeHeadings("academic")}}>CONCESSION/ADDITIONAL</Button>
                  <Button variant={this.state.tabValue == 3 ?"contained":"outlined"} onClick={()=>{this.setValue(3);this.getPaymentDetails()}}>PAYMENT HISTORY</Button>
                  </ButtonGroup>
                </Tabs>
              
              </Grid>
              </Grid>
            </div>
            <CardContent className="p-1 m-3">
              <Typography
              component="div"
              role="tabpanel"
              >
              {this.state.tabValue == 0 && <Box p={0}> <div className="card-header--title text-center font-size-lg my-2">
              Collecting Academic fee for the AY 2020-2021
          </div>
          <Grid container spacing={2} justify="center" >
             <Grid item xs={12} md={8} lg={12}>
               <Card className="card-box p-4 customNoData">
               <ReactTable
              
              data={
                this.state.academicMasterList.map((original,key) => {
                  return ({
                    id: key+1,
                    name: original.name,
                    total:original.total,
                    paying:"",
                    paid:original.academic_amount_paid,
                    concession:"",
                    balance:"",
                  })
                })
              }
              filterable
              minRows={0}
              columns={[
                {
                  Header: "S No",
                  accessor: "id",
                  width: 80,
                  className: "center",
                  sortable: false,
                  filterable: false,
                 
                },
                {
                  Header: "Fee Heading",
                  accessor: "name",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Footer: (
                    <span>
                      <strong>Total</strong>
                    </span>
                  )
                },
                {
                  Header: "Total",
                  accessor: "total",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Footer: (
                    <span>
                      <strong>Rs. {this.state.feeTotal}</strong>
                    </span>
                  )
                },
                {
                  Header: "Paid",
                  accessor: "paid",
                  className: "center",
                  sortable: false,
                  filterable: false,
                 
                  Footer: (
                    <span>
                      <strong>Rs. {this.state.feePaid}</strong>
                    </span>
                  )
                },
                {
                  Header: "Paying Now ",
                  accessor: "paying",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: this.renderPayingNow,
                  Footer: (
                       <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={3} className="currencyBlock">
                      <FormLabel>
                       <strong style={{color:'#000000'}}>Rs.</strong>
                      </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={9} className="inputFeeCollection">
                    <FormControl fullWidth>
                        <TextField 
                        disabled
                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={this.state.feePaying}
                        type="text" 
                        />
                        </FormControl>
                    </Grid>
                  </Grid>
                   
                  )
                },
               
                {
                  Header: "Balance",
                  accessor: "balance",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: this.renderBalance,
                  Footer: (
                    <span>
                      <strong>Rs. {this.state.feeBalance}</strong>
                    </span>
                  )
                },
               
              ]}
              showPaginationTop={false}
              showPaginationBottom={false}
              className="-striped -highlight"
            />
                </Card></Grid></Grid>
          </Box>}
              {this.state.tabValue == 1 && <Box p={0}>  <div className="card-header--title text-center font-size-lg my-2"> 
              Collecting Non Academic fee for the AY 2020-2021
          </div><Grid container spacing={2} justify="center" >
             <Grid item xs={12} md={8} lg={12}>
               <Card className="card-box p-4 customNoData">
             
               <ReactTable
              
              data={
                this.state.academicMasterList.map((original,key) => {
                  return ({
                    id: key+1,
                    name: original.name,
                    Due_amount:"",
                    paying:"",
                    paid_details:"",
                    concession:"",
                    balance:"",
    
                   
                  })
                })
              }
              filterable
              minRows={0}
              columns={[
                {
                  Header: "S No",
                  accessor: "id",
                  width: 80,
                  className: "center",
                  sortable: false,
                  filterable: false,
                 
                },
                {
                  Header: "Fee Heading",
                  accessor: "name",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Footer: (
                    <span>
                      <strong>Total</strong>
                    </span>
                  )
                },
                {
                  Header: "Total",
                  accessor: "total",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>
                     Rs. 1000 </div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
                {
                  Header: "Paid",
                  accessor: "paid",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>Rs. 1000</div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
                {
                  Header: "Paying Now ",
                  accessor: "paying",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={3} className="currencyBlock">
                      <FormLabel>
                      <strong style={{color:'#000000'}}>Rs.</strong>
                      </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={9} className="inputFeeCollection">
                      <FormControl fullWidth>
                        <TextField 

                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={''}
                        type="text" 
                        />
                        </FormControl>
                    </Grid>
                  </Grid>
        
                  ),
                  Footer: (
                       <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={3} className="currencyBlock">
                      <FormLabel>
                       <strong style={{color:'#000000'}}>Rs.</strong>
                      </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={9} className="inputFeeCollection">
                    <FormControl fullWidth>
                        <TextField 
                        disabled
                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={''}
                        type="text" 
                        />
                        </FormControl>
                    </Grid>
                  </Grid>
                   
                  )
                },
               
                {
                  Header: "Balance",
                  accessor: "balance",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>Rs. 1000</div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
               
              ]}
              showPaginationTop={false}
              showPaginationBottom={false}
              className="-striped -highlight"
            />
                </Card></Grid></Grid></Box>}
              {this.state.tabValue == 2 && <Box p={0}><div className="card-header--title text-center font-size-lg my-2">
              Assign Concession/Additional fee for the AY 2020-2021
          </div>
          <Grid container spacing={2} justify="center" >
             <Grid item xs={12} md={8} lg={12}>
               <Card className="card-box p-4 customNoData">
               <ReactTable
              
              data={
                this.state.academicMasterList.map((original,key) => {
                  return ({
                    id: key+1,
                    name: original.name,
                    Due_amount:"",
                    paying:"",
                    paid_details:"",
                    concession:"",
                    balance:"",
    
                   
                  })
                })
              }
              filterable
              minRows={0}
              columns={[
                {
                  Header: "S No",
                  accessor: "id",
                  width: 80,
                  className: "center",
                  sortable: false,
                  filterable: false,
                 
                },
                {
                  Header: "Fee Heading",
                  accessor: "name",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Footer: (
                    <span>
                      <strong>Total</strong>
                    </span>
                  )
                },
                {
                  Header: "Total",
                  accessor: "due_amount",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>
                     Rs. 1000 </div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
                {
                  Header: "Paid",
                  accessor: "paid",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>Rs. 1000</div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
                {
                  Header: "Concession",
                  accessor: "paid",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={3} className="currencyBlock">
                      <FormLabel>
                      <strong style={{color:'#000000'}}>Rs.</strong>
                      </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={9} className="inputFeeCollection">
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={''}
                        type="text" 
                        />
                        </FormControl>
                    </Grid>
                  </Grid>
        
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
                {
                  Header: "Additional",
                  accessor: "paid",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={3} className="currencyBlock">
                      <FormLabel>
                      <strong style={{color:'#000000'}}>Rs.</strong>
                      </FormLabel>
                    </Grid>
                    <Grid xs={12} sm={12} md={9} className="inputFeeCollection">
                      <FormControl fullWidth>
                        <TextField 
                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={''}
                        type="text" 
                        />
                        </FormControl>
                    </Grid>
                  </Grid>
        
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
          
               
                {
                  Header: "Balance",
                  accessor: "balance",
                  className: "center",
                  sortable: false,
                  filterable: false,
                  Cell: row => (
                    <div>Rs. 1000</div>
                  ),
                  Footer: (
                    <span>
                      <strong>Rs. 1000</strong>
                    </span>
                  )
                },
               
              ]}
              showPaginationTop={false}
              showPaginationBottom={false}
              className="-striped -highlight"
            />
                </Card></Grid></Grid></Box>}
              {this.state.tabValue == 3 && <Box p={0}>
                {this.state.paymentHistory.map((element)=>(
                
               
                  <Card className="card-box mb-4 d-flex flex-row flex-wrap justify-content-center">
              <div className="py-3 px-3 d-flex align-items-center text-center">
          <div>
            <span className="font-weight-bold font-size-md">
              {element.name}
            </span>
            <span className="d-block opacity-7">fee type</span>
          </div>
        </div>
        <div className="py-3 px-4 d-flex align-items-center  text-center">
          <div>
            <span className="font-weight-bold font-size-md">
              <small className="opacity-6 pr-1">$</small>  {element.paid_amt}
            </span>
            <span className="d-block opacity-7">Amount paid</span>
          </div>
        </div>
        <div className="py-3 px-4 d-flex align-items-center  text-center">
          <div>
            <span className="font-weight-bold font-size-md">
            {element.paid_date}
            </span>
            <span className="d-block opacity-7">paid date</span>
          </div>
        </div>
        <div className="py-3 px-4 d-flex align-items-center text-center">
          <div>
            <span className="font-weight-bold font-size-md">
              2020-21/{element.receipt_no}
            </span>
            <span className="d-block opacity-7">receipt number</span>
          </div>
        </div>
        <div className="py-3 px-4 d-flex align-items-center r text-center">
          <div>
            <Tooltip
            id="tooltip-top"
            title={"Cancel Receipt"}
            placement="top"
            >
            <Button size="small" className="mr-2 dangerBtnOutline" variant="contained">
              <span className="d-none d-xl-block">Open dialog</span>
              <span className="btn-wrapper--icon d-block d-xl-none">
                <FontAwesomeIcon icon={['fas', 'times']} />
              </span>
            </Button>
            </Tooltip>
            <Tooltip
            id="tooltip-top"
            title={"Send Message"}
            placement="top"
            >
            <Button size="small" className="mr-2 warningBtnContained" variant="contained" >
              <span className="d-none d-xl-block">Open dialog</span>
              <span className="btn-wrapper--icon d-block d-xl-none">
              <Send />
              </span>
            </Button>
            </Tooltip>
            <Tooltip
            id="tooltip-top"
            title={"Download Receipt"}
            placement="top"
            >
            <Button size="small" className="mr-2" variant="contained" color="primary" onClick={()=>this.downloadReceipt(element.id)}>
              <span className="d-none d-xl-block">Open dialog</span>
              <span className="btn-wrapper--icon d-block d-xl-none">
                <FontAwesomeIcon icon={['fas', 'cloud-download-alt']} />
              </span>
            </Button>
            </Tooltip>
            <Tooltip
            id="tooltip-top"
            title={"Print Receipt"}
            placement="top"
            >
            <Button size="small" className="mr-2 successBtnContained" onClick={()=>this.printReceipt(element.id)}>
              <span className="d-none d-xl-block">Open dialog</span>
              <span className="btn-wrapper--icon d-block d-xl-none">
                <FontAwesomeIcon icon={['fas', 'print']} />
              </span>
            </Button>
            </Tooltip>
            <Tooltip
            id="tooltip-top"
            title={"View Receipt"}
            placement="top"
            >
            <Button size="small" className="mr-2" variant="contained" color="info" onClick={()=>{this.setState({viewReceipt:true}); this.getReceiptDetails(element.id)}}>
              <span className="d-none d-xl-block">Open dialog</span>
              <span className="btn-wrapper--icon d-block d-xl-none">
                <FontAwesomeIcon icon={['fas', 'chevron-right']} />
              </span>
            </Button>
            </Tooltip>
          </div>
        </div>
        
      </Card>
       ))}
      </Box>}
              </Typography>
            </CardContent>
          {(this.state.tabValue == 0  || this.state.tabValue == 1) && <CardActions>
            <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={12} className="text-right">
                      <Button className="mb-3 mx-4 " color="secondary" variant="outlined" onClick={()=>this.setState({paymentDialog:true})}>Proceed to pay</Button>
                    </Grid>
            </Grid>        
            </CardActions>}

            {this.state.tabValue == 2 &&  <CardActions>
            <Grid container spacing={2}>
                    <Grid xs={12} sm={12} md={12} className="text-right">
                      <Button className="mb-3 mx-4 " color="secondary" variant="outlined" onClick={()=>this.setState({paymentDialog:true})}>Send for approval</Button>
                    </Grid>
            </Grid>        
            </CardActions>}
        </Card>    
      </Grid>
      </Grid>}
      <Dialog fullScreen open={this.state.paymentDialog} className="bgColor" onClose={()=>this.setState({paymentDialog:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.setState({paymentDialog:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Fee Payment
            </Typography>
               </Grid>
              
            </Grid>
      
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100"> 
     
      <Grid container spacing={2} justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8}>
      <Card className="card-box mb-4 customTab ">
            <div className="card-header p-1 m-3">
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} md={8} lg={12}>
                    
                <Tabs
                  value={this.state.tabValue}
                  indicatorColor="default"
                  textColor="secondary"
                  >
                    <ButtonGroup  color="secondary" aria-label="outlined secondary button group" className="buttonGroup">
                  <Button variant={this.state.paymentTabValue == 0 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(0);this.setPaymentMode("Online")}}>PAYMENT GATEWAY</Button>
                  <Button variant={this.state.paymentTabValue == 1 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(1);this.setPaymentMode("Cash")}}>CASH</Button>
                  <Button variant={this.state.paymentTabValue == 2 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(2);this.setPaymentMode("Cheque")}}>CHEQUE</Button>
                  <Button variant={this.state.paymentTabValue == 3 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(3);this.setPaymentMode("DD")}}>DEMAND DRAFT</Button>
                  <Button variant={this.state.paymentTabValue == 4 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(4);this.setPaymentMode("Challan")}}>CHALLAN</Button>
                  <Button variant={this.state.paymentTabValue == 5 ?"contained":"outlined"} onClick={()=>{this.setPaymentValue(5);this.setPaymentMode("POS")}}>POS</Button>
                  </ButtonGroup>
                </Tabs>
                </Grid>
            </Grid>  
                </div>
                <CardContent className="p-1 m-3">
              <Typography
              component="div"
              role="tabpanel"
              >
              {this.state.paymentTabValue == 0 && <Box p={0}>
              Please Contact your Relationship Manager for online payment gateway activation.
              </Box>}  
              {this.state.paymentTabValue == 1 && <Box p={0}>
              <div className="card-header--title text-center font-size-lg my-2">
              Collecting fee amount Rs. {this.state.feePaying}
          </div>
               {/* <Grid container spacing={2} justify="center" >
               <Grid item xs={12} sm={6} md={6} className="text-center">
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.selectedEnabled === "WithoutDenominations"}
                          onChange={() => this.handleChangeEnabled("WithoutDenominations")}
                          value="Without Denominations"
                          name="radio button enabled"
                        />
                      }
                      label="Without Denominations"
                    />
              
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}  className="text-center">
                 
                    <FormControlLabel
                      control={
                        <Radio
                          checked={this.state.selectedEnabled === "WithDenominations"}
                          onChange={() => this.handleChangeEnabled("WithDenominations")}
                          value="With Denominations"
                          name="radio button enabled"
                        />
                      }
                      label="With Denominations"
                    />
                  </Grid>
             
                
               </Grid> */}
            
                      <Grid container spacing={2} justify="center" >
                        <Grid item xs={12} sm={6} md={4} className="text-center">
                              <FormControl fullWidth>
                              <TextField 
                              disabled
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.paymentAmount}
                              label="Enter Amount"
                              onChange={(event) => this.setState({paymentAmount: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                              </FormControl>
                        </Grid>
                      </Grid>
               
                    
                    {this.state.selectedEnabled === "WithDenominations" && <Box p={0}>
                          <Grid container spacing={2} justify="center" >
                          <Grid item xs={12} md={8} lg={6}>
                          <Card className="card-box p-4">
                          <div className="card-header--title text-center font-size-lg my-2">
              Amount Collected
          </div>
                          <TableContainer>
      <Table className="denomTable"  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Denomination</TableCell>
            <TableCell align="center">No of Pieces</TableCell>
            <TableCell align="center">Amount Rs.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.amount_collected_denomination.map((row,index) => (
            <TableRow key={row.denomination}>
              <TableCell align="center" component="th" scope="row">
                {row.denomination}
              </TableCell>
              <TableCell align="center"> <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              type="text"
                              id="document-type"   
                              value={row.pieces}
                              onChange={(event) => this.handleAmountDenomination(index,event.target.value)}
                              className="my-2"
                              /></TableCell>
              <TableCell align="center">{row.denomination * row.pieces}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align="right"><b>Total</b></TableCell>
            <TableCell align="center"><b>{this.state.totalAmountDenomination}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
                          </Card>
                          </Grid>
                          <Grid item xs={12} md={8} lg={6}>

                          <Card className="card-box p-4">
                          <div className="card-header--title text-center font-size-lg my-2">
              Change to be paid
          </div>
                          <TableContainer>
      <Table  className="denomTable" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Denomination</TableCell>
            <TableCell align="center">No of Pieces</TableCell>
            <TableCell align="center">Amount Rs.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.amount_change_denomination.map((row,index) => (
            <TableRow key={row.denomination}>
              <TableCell align="center" component="th" scope="row">
                {row.denomination}
              </TableCell>
              <TableCell align="center"> <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              type="text"
                              id="document-type"   
                              value={row.pieces}
                              onChange={(event) => this.handleChangeDenomination(index,event.target.value)}
                              className="my-2"
                              /></TableCell>
              <TableCell align="center">{row.denomination * row.pieces}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align="right"><b>Total</b></TableCell>
            <TableCell align="center"><b>{this.state.totalChageDenomination}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
                          </Card>
                          </Grid>
                          </Grid>
                    </Box>}  
                    <Grid container spacing={2}>
                       <Grid item xs={12} sm={12} md={12} className="mt-2 text-right">
                         <Button className="successBtnOutline" onClick={() => this.setState({feeReceiptPreview:true})}>
                           Preview & Pay
                         </Button>
                       </Grid>
                      </Grid>
              </Box>}  

              {(this.state.paymentTabValue == 2 || this.state.paymentTabValue == 3 || this.state.paymentTabValue == 4 || this.state.paymentTabValue == 5 )  && <Box p={0}>
              <div className="card-header--title text-center font-size-lg my-2">
              Collecting fee amount Rs. {this.state.feePaying}
          </div>
               <Grid container spacing={2} justify="center" >
               <Grid item xs={12} sm={6} md={4}>
                       <FormControl fullWidth>
                              <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.bank_name}
                              label="Bank Name"
                              onChange={(event) => this.setState({bank_name: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                        </FormControl>          
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                              <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.branch_name}
                              label="Branch Name"
                              onChange={(event) => this.setState({branch_name: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                        </FormControl>              
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
               <FormControl fullWidth>
                              <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.cheque_no}
                              label={this.renderCdcpNo()}
                              onChange={(event) => this.setState({cheque_dd_challan_pos_no: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                        </FormControl>          
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
               <FormControl fullWidth>
                              <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.re_cheque_no}
                              label={"Re Enter "+this.renderCdcpNo()}
                              onChange={(event) => this.setState({re_cheque_dd_challan_pos_no: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                        </FormControl>          
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                      autoOk
                      margin="normal"
                      
                      id="date-picker-dialog"
                      label="Date"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={this.state.payment_date}
                      onChange={this.handlePaymentDate}   
                      KeyboardButtonProps={{
                      'aria-label': 'change date',
                      }}
                      />
                      </MuiPickersUtilsProvider>
                      </FormControl>      
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
               <FormControl fullWidth>
                              <TextField 
                              disabled
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              id="document-type"   
                              value={this.state.paymentAmount}
                              label="Amount Rs."
                              onChange={(event) => this.setState({paymentAmount: event.target.value})}
                              className="my-2"
                              variant="outlined"
                              />
                        </FormControl>          
                </Grid>
               </Grid>
               <Grid container spacing={2}>
                       <Grid item xs={12} sm={12} md={12} className="text-right">
                         <Button className="successBtnOutline"  onClick={() => this.setState({feeReceiptPreview:true})}>
                           Preview & Pay
                         </Button>
                       </Grid>
                      </Grid>
               </Box>}
            
              </Typography>
              </CardContent>
               
            
            </Card>
       </Grid> 
       </Grid>
      </div>
      </Animated>
      </Dialog>
      <Dialog fullScreen open={this.state.feeReceiptPreview} className="bgColor" onClose={()=>this.setState({feeReceiptPreview:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.setState({feeReceiptPreview:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Fee Receipt
            </Typography>
               </Grid>
              
            </Grid>
      
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100"> 
     
      <Grid container spacing={2} justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8}>
      <Card className="card-box mb-4 customTab ">
      {/* <div style={{width:"100%", textAlign:'center',paddingBottom:'10px'}}><span style={{fontSize:'20px',color:'green',fontWeight:500}}>Fee Receipt Generated Successfully.</span></div> */}
          <div class="invoice-box">    
            <table>
            <tr className="information header">
                <td colspan="3">
                    <table>
                        <tr>
                        <td className="title">
                               <img style={{maxWidth:'90px'}} src={logo} alt="logo"  /> 
                        </td>
                        <td style={{textAlign:'center'}}>  
                        <strong>eGenius</strong><br />
                        Bengaluru, Karnataka<br />
                        <strong>FEE RECEIPT</strong>
                        </td>
                            <td style={{minWidth:'150px'}}>
                            <strong>Academic Year</strong><br />
                            <strong>2020-21</strong>
                               
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr className="information">
                <td  colspan="2">
                    <table>
                        <tr>
                            <td>
                                Student Name: <strong>{this.state.studentInfo.name?this.state.studentInfo.name:""}</strong><br />
                                Standard: <strong>{this.state.studentInfo.class_name?this.state.studentInfo.class_name:""}</strong>
                            </td>
                            
                            <td>
                                Receipt No.: <strong>NA</strong><br />
                                Date: <strong>{moment(this.state.payment_date).format("DD-MM-YYYY")}</strong><br />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr className="">
                <td  colspan="4" style={{padding:0}}>
                    <table>
                      <tr className="heading">
                      <td style={{textAlign:"center",width:"50px"}}>
                      S No
                      </td>

                      <td style={{textAlign:"left"}}>
                      Particular
                      </td>
                     
                      <td style={{width:"150px"}}>
                      Amount Rs.
                      </td>
                    
                     
                      </tr>
                      {this.state.academicMasterList.filter(x => x.paying_now != 0).map((element,index)=>
                       <tr className="item">
                       <td style={{textAlign:"center",width:"50px"}}>
                          {index+1}
                       </td>
                       
                       <td style={{textAlign:"left"}}>
                          {element.name}
                       </td>
                    
                       <td style={{width:"150px"}}>
                          {element.paying_now}
                       </td>
                     
                   </tr>
               
                      )}
                       
                    </table>
                </td>
            </tr>
            <tr className="">
                <td  colspan="3">
                    <table>
                    
                        <tr className="item">
                            
                            <td style={{textAlign:"right",padding:0}}>
                               <strong>Total Rs.</strong>
                            </td>
                         
                            <td style={{width:"150px",padding:0}}><strong>{this.state.previewTotal}</strong></td>
                        </tr>
                       
                    </table>
                </td>
            </tr>
          
           
                        {/* <tr className="item">
                      
                        <td colspan="1" style={{textAlign:'center'}}>
                        Amount Paid in Words : Thirty Six Thousands Eight Hundred Rupees Only 
                        </td>
                        </tr> */}
                        <tr className="item">
                        <td colspan="1" style={{textAlign:'center'}}>
                        Paid through : {this.state.paymentMode} * {this.renderPaymentModeInfo()}
                        </td>
                        </tr>
                        <tr className="item">
                        <td colspan="1" style={{textAlign:'center'}}>
                        <strong>Fee once paid will not be refunded.</strong>
                        </td>
                       
                        </tr>
                       
                        <br /><br />
                        <tr>
                <td  colspan="2">
                    <table>
                    
                        <tr>
                            
                            <td style={{textAlign:"left",padding:"0 !important"}}>
                               {/* <strong>Balance fee Rs. 10000 will be due on OCT 31, 2018 </strong> */}
                            </td>
                            <td style={{textAlign:"right",padding:"0 !important"}}>
                            <strong>Authorized Signature</strong>
                            </td>
                           
                        </tr>
                       
                    </table>
                </td>
            </tr>
                  
        </table>
        </div>
        <CardActions>
            <Grid container spacing={5}>
                    <Grid xs={12} sm={12} md={12} className="text-right">
                      <Button className="successBtnOutline  m-4"  onClick={()=>this.insertPayment()}>Complete Transaction</Button>
                    </Grid>
            </Grid>        
            </CardActions> 
      </Card>
      </Grid>
      </Grid>
      </div>
      </Animated>
      </Dialog>  
      <Dialog fullScreen open={this.state.viewReceipt} className="bgColor" onClose={()=>this.setState({feeReceiptPreview:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.setState({viewReceipt:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Fee Receipt
            </Typography>
               </Grid>
              
            </Grid>
      
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100"> 
     
      <Grid container spacing={2} justify="center" className="mt-4">
      <Grid item xs={12} md={8} lg={8}>
      <Card className="card-box mb-4 customTab ">
          <div className="invoice-box">    
            <table>
            <tr className="information header">
                <td colspan="3">
                    <table>
                        <tr>
                        <td className="title" style={{textAlign:'center'}}>
                        <img style={{maxWidth:'90px'}} src={logo} alt="logo"  /> 
                        </td>
                        <td style={{textAlign:'center'}}>
                       <p>eGenius</p>
                     
                        <p>Rajajinagar, Karnataka Bengaluru - 560010</p>
                        <p><strong>FEE RECEIPT</strong></p>
                        </td>
                            <td>
                            <p><strong>Academic Year</strong></p>
                            <p><strong>2020-21</strong></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>  
            
            <tr className="information">
                <td  colspan="2">
                    <table>
                        <tr>
                            <td>
                                Student Name: <strong>{this.state.receiptInfo.student_info.name?this.state.receiptInfo.student_info.name:""}</strong><br />
                                Standard: <strong></strong>
                            </td>
                            
                            <td>
                                Receipt No.: <strong>{this.state.receiptInfo.payment_info.receipt_no}</strong><br />
                                Date: <strong>{moment(this.state.receiptInfo.payment_info.paid_date).format("DD-MM-YYYY")}</strong><br />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr className="">
                <td  colspan="4" style={{padding:0}}>
                    <table>
                      <tr className="heading">
                      <td style={{textAlign:"center",width:"50px"}}>
                      S No
                      </td>

                      <td style={{textAlign:"left"}}>
                      Particular
                      </td>
                     
                      <td style={{width:"150px"}}>
                      Amount Rs.
                      </td>
                    
                     
                      </tr>
                      {this.state.receiptInfo.payment_info.particulars && this.state.receiptInfo.payment_info.particulars.map((element,index)=>
                       <tr className="item">
                       <td style={{textAlign:"center",width:"50px"}}>
                          {index+1}
                       </td>
                       
                       <td style={{textAlign:"left"}}>
                          {element.fee_master}
                       </td>
                    
                       <td style={{width:"150px"}}>
                          {element.paid_amt}
                       </td>
                     
                   </tr>
               
                      )}
                       
                    </table>
                </td>
            </tr>
            <tr className="">
                <td  colspan="3">
                    <table>
                    
                        <tr className="item">
                            
                            <td style={{textAlign:"right",padding:0}}>
                               <strong>Total Rs.</strong>
                            </td>
                         
                            <td style={{width:"150px",padding:0}}><strong>{this.state.previewTotal}</strong></td>
                        </tr>
                       
                    </table>
                </td>
            </tr>
          
           
                        <tr className="item">
                        <td colspan="1" style={{textAlign:'center'}}>
                        Paid through : {this.state.receiptInfo.payment_info.mode_of_payment} * {this.viewPaymentModeInfo()}
                        </td>
                        </tr>
                        <tr className="item">
                        <td colspan="1" style={{textAlign:'center'}}>
                        <strong>Fee once paid will not be refunded.</strong>
                        </td>
                       
                        </tr>
                       
                        <br /><br />
                        <tr>
                <td  colspan="2">
                    <table>
                    
                        <tr>
                            
                            <td style={{textAlign:"left",padding:"0 !important"}}>
                               {/* <strong>Balance fee Rs. 10000 will be due on OCT 31, 2018 </strong> */}
                            </td>
                            <td style={{textAlign:"right",padding:"0 !important"}}>
                            <strong>Authorized Signature</strong>
                            </td>
                           
                        </tr>
                       
                    </table>
                </td>
            </tr>
                  
        </table>
        </div>
       
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

export default connect(mapStateToProps, mapDispatchToPros)(AcademicFeeMaster);
