import React, { Fragment } from 'react';
import {Dialog,Grid,Tabs,FormControlLabel,FormControl,IconButton,Typography,AppBar,Paper,Card,CardContent,Fab,CardActions,TextField,Button,Toolbar,Box,FormLabel,List,Tooltip,Slide,Checkbox,RadioGroup,Radio,InputAdornment,TabPanel,ButtonGroup,Table,TableBody,TableCell,TableContainer,TableHead,TableRow, ListItem, MenuItem} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
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
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      basicNotify:false,
      viewSectionStudents:false,
      nonStudentCollectHolder:{name:"",mobile:"",address:"",collectionData:[{particulars:"",amount:""}]},
      nonStudentsCollectionAmt:0,
      nonStudentsFeeList:[],
      academicMasterList:[],
      paymentTabValue:0,
      discount:0,
      collect_fee:true,
      fee_history:false,
      selectedStandardId:''
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);  
  }

  getNonAcademicFeeHeadings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"nonacademic",
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data = response.data;
        let cArr=[];
        const newArr = data.map(v => ({...v, editable: false}));
        const mList = newArr.filter(x => x.type == "nonacademic");
   
        if(this.state.showStatus === 'all'){
            this.setState({academicMasterList:mList});
        }
         else{
            var newArray = mList.filter(x => x.status == this.state.showStatus);
            this.setState({academicMasterList:newArray});
         }
        
      }
    }).catch(error => {
    //  alert("error");

    });
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
  

  nonStudentsFeeCollection() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeeCollectionNonStudents/getNonStudenFeeDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
           this.setState({nonStudentsFeeList:response.data.data});      
      }
    }).catch(error => {
      alert("error");
    });
  }

  insertNonStudentCollection = () => {
   
  
    const postData = {
      name: this.state.nonStudentCollectHolder.name, 
      mobile: this.state.nonStudentCollectHolder.mobile, 
      address: this.state.nonStudentCollectHolder.address, 
      collectionData:this.state.nonStudentCollectHolder.collectionData, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      payment_mode: this.state.paymentMode,
      discount:this.state.discount,
      bank_name:this.state.bank_name,
      branch_name:this.state.branch_name,
      payment_date:moment(this.state.payment_date).format("YYYY-MM-DD"),
      cheque_dd_challan_pos_no:this.state.cheque_dd_challan_pos_no,
      re_cheque_dd_challan_pos_no:this.state.re_cheque_dd_challan_pos_no,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('FeeCollectionNonStudents/insertData',postData).then(response => {
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
        this.nonStudentsFeeCollection();
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
     //   this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
        //console.log(error);
     // this.raiseLoginSignupErrorAlert("signup");

    });
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

  setDiscount = (val) => {
    this.setState({discount:val});
    this.calculateTotal(val);
  }

  handleChangeNonStudentCollectFee = (index,name,value) => {
    let Data = [...this.state.nonStudentCollectHolder.collectionData];
    Data[index][name] = value;
    this.setState({Data});
    this.calculateTotal();
}

selectParticular = (index,event,id) => {
  let Data = [...this.state.nonStudentCollectHolder.collectionData];
  Data[index].particulars = id;
  this.setState({Data});
  this.calculateTotal();
}

setPaymentValue = (index) => {
  this.setState({paymentTabValue:index})
}

setPaymentMode = (val) => {
  this.setState({paymentMode:val})
}

handleAddNotStudentHolder = () => {
  let Data = this.state.nonStudentCollectHolder.collectionData;
  let lData = {};
  lData.particulars = '';
  lData.amount = '';
  Data.push(lData);
  this.setState({Data});
  this.calculateTotal();
}

removeHolder(i) {
  let Data = this.state.nonStudentCollectHolder.collectionData.filter((holder, index) => index !== i);
  var nonStudentCollectHolder = this.state.nonStudentCollectHolder;
  nonStudentCollectHolder.collectionData = Data;
this.setState({nonStudentCollectHolder});
this.calculateTotal();
  
}

calculateTotal = (dis) => {
  let sum=0;
  if(this.state.nonStudentCollectHolder.collectionData.length > 0){
     sum = this.state.nonStudentCollectHolder.collectionData.map(o => o.amount).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
  }
  if(dis){
    sum = sum - Math.ceil(dis)
  }
  this.setState({nonStudentsCollectionAmt:sum});
}


  componentDidMount() {
    this.getNonAcademicFeeHeadings();
  }

render(){
 

  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  <ListItem button className={this.state.collect_fee ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({collect_fee:true,fee_history:false})}>
                    <span>Collect Fee</span>
                  </ListItem>
                  <ListItem button className={this.state.fee_history ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({fee_history:true,collect_fee:false}); this.nonStudentsFeeCollection()}}>
                    <span>Fee History</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>

        {this.state.fee_history && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <ReactTable
          
          data={
            this.state.nonStudentsFeeList.map((original,key) => {
              return ({
                id: key+1,
                name: original.name,
                name:original.name,
                paid_on:original.paid_on,
                receipt_no:original.receipt_no,
                amount:original.amount,
                discount:original.discount,
                actions: (
                  // we've added some custom button actions
                  <div>
                    { /* use this button to add a like kind of action */ }
                  
                    <Tooltip
                    id="tooltip-top"
                    title="View Receipt"
                    placement="top"
                    >
                    <Button
                    simple
                    onClick={()=> this.setState({nonStudentFeeHistoryPane:true})}
                    color="secondary"
                    className="edit"
                    >
                    <ViewIcon />
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
              accessor: "id",
              width: 80,
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="S No"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
            },
            {
              Header: "Paid By",
              accessor: "name",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="Paid By"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
            },
            {
              Header: "Paid On",
              accessor: "paid_on",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="Paid On"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
            },
            {
              Header: "Receipt No",
              accessor: "receipt_no",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="Receipt No"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
            },
            {
              Header: "Amount",
              accessor: "amount",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="Amount"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
            },
            {
              Header: "Discount",
              accessor: "discount",
              className: "center",
              Filter: ({filter, onChange}) => (
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}         
                id="document-type"   
                value={filter ? filter.value : ''}
                placeholder="Discount"
                type="text" 
                onChange={event => onChange(event.target.value)}
                />
              ),
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
          <CardActions stats style={{marginTop:0}}>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
          {/* <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
          Export
          </Button> */}
          </Grid>
          </Grid>
          </CardActions>
          </Card></Grid> 
        </Grid>  }

        {this.state.collect_fee && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={2}></Grid>  
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData py-2">
        <Grid container spacing={4} className="p-4">
          <Grid xs={12} sm={12} md={6}>
          <FormControl fullWidth>
          <TextField 
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
          id="document-type"   
          label="Name" 
          className="mx-2"
          type="search" 
          onChange={(event) => this.handleChangeNonStudentInput("name",event.target.value)}
          inputRef={this.textInput} 
          variant="outlined" />
          </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={6}>
            <FormControl fullWidth>
          <TextField 
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
          id="document-type"   
          label="Mobile" 
          type="search" 
          className="mx-2"
          onChange={(event) => this.handleChangeNonStudentInput("mobile",event.target.value)}
          inputRef={this.textInput} 
          variant="outlined" />
          </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={12} style={{marginTop:20}}>
            <FormControl fullWidth>
          <TextField 
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
          id="document-type"   
          label="Address" 
          className="mx-2"
          type="search" 
          multiline
          rows={2}
          onChange={(event) => this.handleChangeNonStudentInput("address",event.target.value)}
          inputRef={this.textInput} 
          variant="outlined" />
          </FormControl>
            </Grid>
          </Grid>
          {this.state.nonStudentCollectHolder.collectionData.map((ele, idx) => (
        <div>
           <Grid container spacing={4}  className="px-3">
            <Grid item xs={12} sm={6} lg={7}>
             
              <FormControl fullWidth>
            <TextField
                    
                    id="outlined-select-currency"
                    select
                    label="Select Particular"
                    value={this.state.fee_standard}
                    onChange={(event,child) => this.selectParticular(idx,event.target.value,child.props.id)}
                    variant="outlined">
                    {this.state.academicMasterList.map(option => (
                      <MenuItem key={option.value} value={option.id} id={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.amount}
              label="Amount" 
              type="search" 
              onChange={(event) => this.handleChangeNonStudentCollectFee(idx, "amount",event.target.value)}
              variant="outlined" />
              </FormControl>
            </Grid>  
     
            <Grid item xs={12} sm={6} lg={1}>
          
           
            <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} onClick={()=>this.removeHolder(idx)} />
           
    
            </Grid>  
           </Grid>
        </div>
      ))}
          <Grid container spacing={4} className="mt-4 mb-2">
                <Grid xs={12} sm={12} md={8}>
                
                </Grid>
                <Grid xs={12} sm={12} md={3}  className="text-center">
                <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={this.state.discount}
              label="Discount" 
              className="ml-3 mr-4"
              type="search" 
              onChange={(event) => this.setDiscount(event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
                </Grid>
      </Grid>
       <Grid container spacing={4} className="mt-4">
                <Grid xs={12} sm={12} md={7}>
                
                </Grid>
                <Grid xs={12} sm={12} md={4}  className="text-center">
                <b>Total Rs. {this.state.nonStudentsCollectionAmt}</b>
                </Grid>
      </Grid>
          <CardActions stats style={{marginTop:0}}>
          <Grid container spacing={4} className="mt-4">
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
          <Button className="mr-2"  variant="outlined" color="secondary" onClick={()=> this.handleAddNotStudentHolder()}>
          Add Row
          </Button>  
          <Button className="mr-2" color="secondary" variant="outlined" onClick={()=>this.setState({paymentDialog:true})}>Proceed to pay</Button>
          </Grid>
          </Grid>
          </CardActions>
          </Card></Grid> 
        </Grid>}

        </Grid>  
        </Grid>  

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
                              value={this.state.nonStudentsCollectionAmt}
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
                         <Button className="successBtnOutline" onClick={() => this.insertNonStudentCollection()}>
                           Complete transaction
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
                              value={this.state.nonStudentsCollectionAmt}
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
                         <Button className="successBtnOutline"  onClick={() => this.insertNonStudentCollection()}>
                           Complete Transaction
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
 
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(AcademicFeeMaster);
