import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,ListItem,FormControlLabel,Switch,FormControl,IconButton,Typography,AppBar,Divider,Card,MenuItem,Fab,CardActions,TextField,Button,Toolbar,Box,FormLabel,List,Tooltip,Slide,Checkbox,RadioGroup,Radio,InputAdornment,TabPanel,ButtonGroup} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Send from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Remove from "@material-ui/icons/Remove";
import ViewIcon from "@material-ui/icons/Visibility";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../assets/custom.scss";
import Service from '../../../utils/Service';
import Config from '../../../config';

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

class Expense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      expense_date: new Date(),
      invoice_date: new Date(),
      expenses:true,
      view_expense:true,
      add_expense:false,
      loading:false,
      vendorInsertData:{name:'',email:'',mobile:'',gst:'',contact_person:'',address:''},
      vendorsList:[],
      expenseDetails:[],
      dialogOpen:true,
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      basicNotify:false,
      viewSectionStudents:false,
      expenseHolder:{collectionData:[{particulars:"",qty:0,amount:0}]},
      expenseAmt:0,
      discount:0,
      expenseUpdateAmt:0,
      nonStudentsFeeList:[],
      categoryList:[],
      subCategoryList:[],
      studentData:[],
      selectedCategoryId:'',
      selectedVendorId:'',
      collect_fee:true,
      fee_history:false,
      tabValue:0,
      academicMasterList:[],
      expenseList:[],
      tableData: [{
        id: '',
        name: '',
      }],
      selectedStandardId:''
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);  
  }

  handleStudentSearch = (val) => {
    
  }
  selectCategory = (event,id) => {
    this.setState({selectedCategory:event.target.value, selectedCategoryId:id});
    this.getSubCategories(id);
  }

  selectSubCategory = (event,id) => {
    this.setState({selectedSubCategory:event.target.value, selectedSubCategoryId:id});
  }

  UpdateCategory = (index,event,id) => {
    let data = this.state.expenseDetails;
    data[index].expense_category=event.target.value;
    data[index].expense_category_id=id;
    this.setState({data})
  }

  UpdateExpenseVendor = (index,event,id) => {
    let data = this.state.expenseDetails;
    data[index].expense_vendor=event.target.value;
    data[index].expense_vendor_id=id;
    this.setState({data})
  }

  selectVendor = (event,id) => {
    console.log(id);
    this.setState({selectedVendor:event.target.value, selectedVendorId:id})
  }

  calculateTotal = (dis) => {
    let sum=0;
    if(this.state.expenseHolder.collectionData.length > 0){
       sum = this.state.expenseHolder.collectionData.map(o => o.amount * o.qty).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    }
    if(dis){
      sum = sum - Math.ceil(dis)
    }
    this.setState({expenseAmt:sum});
  }

  updateTotal = (index,dis) => {
    let sum=0;
    if(this.state.expenseDetails[index].particulars.length > 0){
       sum = this.state.expenseDetails[index].particulars.map(o => o.amount * o.quantity).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    }
    if(dis){
      sum = sum - Math.ceil(dis)
    }
    this.setState({expenseUpdateAmt:sum});
  }

  setDiscount = (val) => {
    this.setState({discount:val});
    this.calculateTotal(val);
  }

  updateDiscount = (index,val) => {
    let data = this.state.expenseDetails;
    data[index].discount=val;
    this.setState({data})
    this.updateTotal(index,val);
  }



  handleAddHolder = () => {
    let Data = this.state.expenseHolder.collectionData;
    let lData = {};
    lData.particulars = '';
    lData.qty = '';
    lData.amount = '';
    Data.push(lData);
    this.setState({Data});
   // this.calculateTotal();
  }

  handleUpdateHolder = () => {
    let Data = this.state.expenseDetails[0].particulars;
    let lData = {};
    lData.particular = '';
    lData.quantity = '';
    lData.amount = '';
    Data.push(lData);
    this.setState({Data});
   // this.calculateTotal();
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

  handleChangeExpenseInput = (name,value) => {
    let Data = this.state.expenseHolder;
    Data[name] = value;
    this.setState({Data});
}

handleUpdateExpenseInput = (index,name,value) => {
  let Data = this.state.expenseDetails;
  Data[index][name] = value;
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

  handleExpenseDate = (dob) => {
    this.setState({ expense_date: dob })
  };

  handleInvoiceDate = (dob) => {
    this.setState({ invoice_date: dob })
  };

  handleChangeExpenseCollectFee = (index,name,value) => {
    let Data = [...this.state.expenseHolder.collectionData];
    Data[index][name] = value;
    this.setState({Data});
    this.calculateTotal();
  }

  handleUpdateExpenseCollectFee = (idx,index,name,value) => {
    let Data = this.state.expenseDetails;
    Data[idx].particulars[index][name] = value;
    this.setState({Data});
    this.updateTotal(idx,'');
  }

removeExpenseHolder(i) {
  let Data = this.state.expenseHolder.collectionData.filter((holder, index) => index !== i);
  var expHolder = this.state.expenseHolder;
  expHolder.collectionData = Data;
this.setState({expHolder});
this.calculateTotal();
  
}

removeExpenseInfoHolder(i,idx) {
  console.log(i,idx);
  let Data = this.state.expenseDetails[i].particulars.filter((holder, index) => index !== idx);
  console.log(Data);
  var expHolder = this.state.expenseDetails;
  expHolder[i].particulars = Data;
this.setState({expHolder});
this.updateTotal(i,'');
  
}

  getVendorsList() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('vendors/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, editable: false}));
          if(this.state.showStatus == 'all'){
              this.setState({vendorsList:newArr});
          }
          else{
             var newArray = newArr.filter(x => x.status == this.state.showStatus);
             this.setState({vendorsList:newArray});
          }
      }
    }).catch(error => {
      alert("error");
    });
  }

  showError = (error) => {
    this.setState({
      basicNotify: (
        <Dialog open={true}>
      <div className="text-center p-5">
        <h4 className="font-weight-bold">{error}</h4>
      </div>
    </Dialog>
      ),
    });
       setTimeout(() => {
         this.setState({ basicNotify:false});
        // window.location.reload()
       }, 2000)
    }

  getExpensesList() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getExpensesDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        
              this.setState({expenseList:response.data.data});
         
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  insertVendor = () => {
  
    const postData = {
      name: this.state.vendorInsertData.name, 
      mobile: this.state.vendorInsertData.mobile, 
      address: this.state.vendorInsertData.address, 
      email: this.state.vendorInsertData.email,
      gst: this.state.vendorInsertData.gst,
      contact_person: this.state.vendorInsertData.contact_person,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('vendors/insertVendor',postData).then(response => {
      if (response.status==200 && response.data!='') {
 
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Vendor Inserted</h4>
            </div>
            </Dialog>
          ),
        });
        this.getVendorsList();
        setTimeout(() => {
          this.setState({ basicNotify:false,vendorInsertData:{name:"",mobile:"",address:"",email:"",gst:"",contact_person:""} });
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
        //console.log(error);
      //this.raiseLoginSignupErrorAlert("signup");

    });
  }

  insertExpense = () => {
  
    const postData = {
      expense_date: moment(this.state.expense_date).format("YYYY-MM-DD"), 
      expense_category: this.state.selectedCategoryId, 
      expense_subcategory: this.state.selectedSubCategoryId, 
      expense_vendor: this.state.selectedVendorId, 
      total_amount:this.state.expenseAmt,
      discount:this.state.discount,
      invoice_no:this.state.invoice_no,
      invoice_date: moment(this.state.invoice_date).format("YYYY-MM-DD"), 
      notes:this.state.notes,
      collectionData: this.state.expenseHolder.collectionData,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('Expenses/insertExpense',postData).then(response => {
      if (response.status==200 && response.data!='') {
 
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Expense Inserted</h4>
            </div>
            </Dialog>
          ),
        });
        
        setTimeout(() => {
          window.location.reload()
        }, 2000)
       
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  updateVendor = () => {
    this.setState({EditVendorPanel:false});
    const postData = {
      id:this.state.selectedVendorInfo.id, 
      name: this.state.selectedVendorInfo.name, 
      mobile: this.state.selectedVendorInfo.mobile, 
      address: this.state.selectedVendorInfo.address, 
      email: this.state.selectedVendorInfo.email,
      gst: this.state.selectedVendorInfo.gst,
      contact_person: this.state.selectedVendorInfo.contact_person,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('vendors/updateFeeVendor',postData).then(response => {
      if (response.status==200 && response.data!='') {
 
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Vendor Updated</h4>
            </div>
            </Dialog>
          ),
        });
        this.getVendorsList();
        setTimeout(() => {
          this.setState({ basicNotify:false,selectedVendorInfo:{id:"",name:"",mobile:"",address:"",email:"",gst:"",contact_person:""} });
        }, 2000)
      } else {
       
      }
    }).catch(error => {
        //console.log(error);
     

    });
  }

  getCategories() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        
          const filterData = response.data.filter(x => x.id_parent == 0);
         
              this.setState({categoryList:filterData});
        
      }
    }).catch(error => {
     console.log("error");

    });

  }

  getSubCategories(id_parent) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        
          const filterData = response.data.filter(x => x.id_parent == id_parent);
         
              this.setState({subCategoryList:filterData});
        
      }
    }).catch(error => {
      console.log("error");

    });

  }

  viewExpenseInfo(id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id:id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getExpensesDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        let sum=0;
        response.data.data.map((element)=>{
         
            sum = element.particulars.map(o => o.amount * o.quantity).reduce((a, c) => { return Math.ceil(a) + Math.ceil(c) });
    
 
      sum = sum - Math.ceil(element.discount)

        
        })
        this.setState({expenseDetails:response.data.data, expenseUpdateAmt:sum});
      }
    }).catch(error => {
     // alert("error");

    });

  }

  handleVendorDelete = (id,status) => {
    let switchStatus = "";
       if(status == true){
          switchStatus = "Vendor Deactivated";
       }
       else{
          switchStatus = "Vendor Activated";
    }

    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id:id,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('vendors/deleteVendor',postData).then(response => {
      if (response.status==200) {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">{switchStatus}</h4>
    </div>
  </Dialog>
          ),
        });
        this.getVendorsList();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  }

  handleChangeVendorInput = (name,value) => {
    let Data = this.state.vendorInsertData;
    Data[name] = value;
    this.setState({Data});
  }

  handleChangeVendorUpdate = (name,value) => {
    let Data = this.state.selectedVendorInfo;
    Data[name] = value;
    this.setState({Data});
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

  getAcademicFeeHeadings(type) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:type,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let data = response.data;
        let cArr=[];
        const newArr = data.map(v => ({...v, editable: false}));
        const mList = newArr.filter(x => x.type == type);
   
        if(this.state.showStatus === 'all'){
            this.setState({academicMasterList:mList});
        }
         else{
            var newArray = mList.filter(x => x.status == this.state.showStatus);
            this.setState({academicMasterList:newArray});
         }
        
      }
    }).catch(error => {
      alert("error");

    });
  }


  componentDidMount() {
    this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
    this.getAcademicFeeHeadings("academic");
    this.getVendorsList();
    this.getCategories();
    this.getExpensesList();
  }

render(){
  const width = (window.innerWidth) * (60/100)+"px";

  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/expense-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Add/View Expenses
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.add_expense ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({add_expense:true, view_expense:false}); }}>
                  Create
                </Button>
                <Button color="primary" size="small" variant={this.state.view_expense ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({add_expense:false, view_expense:true});this.getExpensesList() }}>
                View
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  <ListItem button className={this.state.expenses ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({expenses:true,vendors:false})}>
                    <span>Expenses</span>
                  </ListItem>
                  <ListItem button className={this.state.vendors ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({vendors:true,expenses:false});this.getVendorsList()}}>
                    <span>Vendors</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>

        {this.state.expenses && this.state.add_expense && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={2}></Grid>  
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData py-2">
        <Grid container spacing={4} className="p-4">
        <Grid  xs={12} sm={12} md={3} className="pl-2">
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          
          id="date-picker-dialog"
          label="Expense Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.expense_date}
          onChange={this.handleExpenseDate}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Category"
                    value={this.state.selectedCategory}
                    onChange={(event, child) => this.selectCategory(event, child.props.id)}
                    variant="outlined">
                    {this.state.categoryList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  

            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Sub Category"
                    value={this.state.selectedSubCategory}
                    onChange={(event, child) => this.selectSubCategory(event, child.props.id)}
                    variant="outlined">
                    {this.state.subCategoryList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  
        
          <Grid item xs={12} sm={6} lg={6}  style={{padding:10}}>
          <FormControl fullWidth>
            <TextField
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Vendor"
                    value={this.state.selectedVendor}
                    onChange={(event, child) => this.selectVendor(event, child.props.id)}
                    variant="outlined">
                    {this.state.vendorsList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  
            <Grid xs={12} sm={12} md={3}>
            <FormControl fullWidth>
          <TextField 
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
            value={this.state.invoice_no}
          id="document-type"   
          label="Invoice No." 
          className="mx-2 mt-2"
          type="search" 
          onChange={(event) => this.setState({invoice_no:event.target.value})}
          variant="outlined" />
          </FormControl>
            </Grid>

        <Grid  xs={12} sm={12} md={3} className="pl-2">
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          
          id="date-picker-dialog"
          label="Invoice Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={this.state.invoice_date}
          onChange={this.handleInvoiceDate}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
        
            <Grid xs={12} sm={12} md={12}>
            <FormControl fullWidth>
          <TextField 
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
            value={this.state.notes}
          id="document-type"   
          label="Notes" 
          className="mx-2"
          type="search" 
          multiline
          rows={2}
          onChange={(event) => this.handleChangeExpenseInput("notes",event.target.value)}
          inputRef={this.textInput} 
          variant="outlined" />
          </FormControl>
            </Grid>
          </Grid>
          {this.state.expenseHolder.collectionData.map((ele, idx) => (
        <div>
           <Grid container spacing={4}  className="px-3">
            <Grid item xs={12} sm={6} lg={6}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.particulars}
              label="Particulars" 
              type="search" 
              onChange={(event) => this.handleChangeExpenseCollectFee(idx, "particulars",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={2}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.qty}
              label="Quantity" 
              type="search" 
              onChange={(event) => this.handleChangeExpenseCollectFee(idx, "qty",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={3}>
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
              onChange={(event) => this.handleChangeExpenseCollectFee(idx, "amount",event.target.value)}
              variant="outlined" />
              </FormControl>
            </Grid>  
     
            <Grid item xs={12} sm={6} lg={1}>
          
            <Remove onClick={()=>this.removeExpenseHolder(idx)} style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} />
           
            </Grid>  
           </Grid>
        </div>
      ))}
      <Grid container spacing={4} className="mt-4">
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
       <Grid container spacing={4} className="mt-5">
                <Grid xs={12} sm={12} md={7}>
                
                </Grid>
                <Grid xs={12} sm={12} md={4}  className="text-center">
                <b>Total Rs. {this.state.expenseAmt}</b>
                </Grid>
      </Grid>
          <CardActions stats style={{marginTop:0}}>
          <Grid container spacing={4} className="mt-4">
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
          <Button className="mr-2"  variant="outlined" color="secondary" onClick={()=> this.handleAddHolder()}>
          Add Row
          </Button>  
          <Button className="mr-2 successBtnOutline"   onClick={()=>{ this.insertExpense(); }}>
          Submit
          </Button>
          </Grid>
          </Grid>
          </CardActions>
          </Card></Grid> 
        </Grid>}   

        {this.state.expenses && this.state.view_expense && <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <ReactTable
    
    data={
    this.state.expenseList.map((original,key) => {
    return ({
      slno: key+1,
      expense_date: original.expense_date,
      expense_category:original.expense_category,
      expense_vendor:original.expense_vendor,
      total_amount:original.total_amount,
      editable:original.editable,
      actions: (
        // we've added some custom button actions
        <div className="grouplist-actions">
          { /* use this button to add a like kind of action */ }
        
                    <Tooltip
    id="tooltip-top"
    title={"View"}
    placement="top"
    >
                    <Button
                     disabled={original.status == 0 ? true:false}
                    className="m-2"
                    simple
                    onClick={()=> {this.setState({viewExpensePanel:true}); this.viewExpenseInfo(original.id)}}
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
    accessor: "slno",
    width: 90,
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
    )
    },
    {
      Header: "Expense Date",
      accessor: "expense_date",
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search date"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
    },
    {
    Header: "Expense Category",
    accessor: "expense_category",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Category"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
    {
      Header: "Expense Vendor",
      accessor: "expense_vendor",
      className: "center",
      Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Vendor"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
      )
      },
      {
        Header: "Amount",
        accessor: "total_amount",
        className: "center",
        Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Amount"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
        )
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

        {this.state.vendors && <div><Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
            <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Vendor Registration
                </h4>
              </div>
            </div>
       
            <Grid container spacing={4} className="px-4 pb-3">
            <Grid xs={12} sm={12} md={8} className="py-1">
                  <FormControl fullWidth>
                  <TextField 
                  inputProps={{
                  style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                  }}
                  id="document-type"   
                  className="m-2"
                  label="Vendor Name" 
                  value={this.state.vendorInsertData.name}
                  type="search" 
                  onChange={(event) => this.handleChangeVendorInput("name",event.target.value)}
                  inputRef={this.textInput} 
                  variant="outlined" />
                  </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={4}  className="py-1">
                <FormControl fullWidth>
                <TextField 
                inputProps={{
                  style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                  }}
                id="document-type"   
                label="Mobile" 
                className="m-2"
                value={this.state.vendorInsertData.mobile}
                type="search" 
                onChange={(event) => this.handleChangeVendorInput("mobile",event.target.value)}
                inputRef={this.textInput} 
                variant="outlined" />
                </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={4} className="py-1">
              <FormControl fullWidth>
              <TextField 
              inputProps={{
                style: {textTransform: 'capitalize'},
                autoComplete: "off",
                pattern: "[a-z]"
                }}
              id="document-type"   
              label="GST No" 
              className="m-2"
              type="search" 
              value={this.state.vendorInsertData.gst}
              onChange={(event) => this.handleChangeVendorInput("gst",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={4} className="py-1">
              <FormControl fullWidth>
              <TextField 
              inputProps={{
                style: {textTransform: 'capitalize'},
                autoComplete: "off",
                pattern: "[a-z]"
                }}
              id="document-type"   
              label="Contact Person" 
              className="m-2"
              type="search" 
              value={this.state.vendorInsertData.contact_person}
              onChange={(event) => this.handleChangeVendorInput("contact_person",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={4} className="py-1">
                <FormControl fullWidth>
                <TextField 
                inputProps={{
                  style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                  }}
                id="document-type"   
                label="Email ID" 
                className="m-2"
                type="search" 
                value={this.state.vendorInsertData.email}
                onChange={(event) => this.handleChangeVendorInput("email",event.target.value)}
                inputRef={this.textInput} 
                variant="outlined" />
                </FormControl>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
                <FormControl fullWidth>
                <TextField 
                inputProps={{
                  style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                  }}
                id="document-type"   
                label="Address" 
                className="m-2"
                multiline
                rows={2}
                value={this.state.vendorInsertData.address}
                type="search" 
                onChange={(event) => this.handleChangeVendorInput("address",event.target.value)}
                inputRef={this.textInput} 
                variant="outlined" />
                </FormControl>
            </Grid>
            </Grid> 
          <CardActions className="mr-2 mb-1">
          <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={12} className="text-right">
          <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.insertVendor()}>
          Submit
          </Button>
          </Grid>
          </Grid>
          </CardActions>     
        </Card>
        </Grid>
        </Grid>
        
        <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={12} lg={10}>
        <Card className="card-box  mb-4 customNoData">
            <div className="card-header">
                  <div className="card-header--title">
                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                    Registered Vendors List
                    </h4>
                  </div>
                
                <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.getVendorsList()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1});  this.getVendorsList()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0});  this.getVendorsList()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
              </div>      
        <ReactTable
    
    data={
    this.state.vendorsList.map((original,key) => {
    return ({
      slno: key+1,
      name: original.name,
      header_count:original.header_count,
      status:original.status,
      editable:original.editable,
      actions: (
        // we've added some custom button actions
        <div className="grouplist-actions">
          { /* use this button to add a like kind of action */ }
        
                    <Tooltip
    id="tooltip-top"
    title={"View"}
    placement="top"
    >
                    <Button
                     disabled={original.status == 0 ? true:false}
                    className="m-2"
                    simple
                    onClick={()=> this.setState({EditVendorPanel:true, selectedVendorInfo:{id:original.id,name:original.name,email:original.email,gst:original.gst,contact_person:original.contact_person, address:original.address, mobile:original.mobile}})}
                    color="secondary"
                    className="edit"
                  >
                    <EditIcon />
                  </Button> 
    
    </Tooltip>
                    
                    {/* use this button to remove the data row */}
                    <Tooltip
            id="tooltip-top"
            title={original.status == 1 ? "Deactivate":"Activate"}
            placement="top"
         
          >
               <FormControlLabel
                          control={
                            <Switch
                            checked={original.status == 1 ? true:false}
                            onChange={() => this.handleVendorDelete(original.id, original.status)}
                              value="checkedA"
                            />
                          }
                          label=""
                        />
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
    width: 90,
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
    )
    },
    {
      Header: "Vendor Name",
      accessor: "name",
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search vendor"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
    },
    {
    Header: "No of Headings",
    accessor: "header_count",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Count"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
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
        <Button   variant="outlined" color="secondary">
            Export
            </Button>
            </Grid>
            </Grid>
      </CardActions>
    
            </Card>
        </Grid>
        </Grid>
        </div>}

        </Grid>  
        </Grid>  
      </div>
      </Animated>
      </Dialog>
      <Drawer

anchor="right"
open={this.state.viewExpensePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewExpensePanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width}}>
  <PerfectScrollbar>
    
    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({viewExpensePanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        View Expense
        </Typography>
      </Toolbar>
    </AppBar>
    <Grid container spacing={4} className="mt-2">
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData py-2">
        {this.state.expenseDetails.map((element,idx)=>(
        <div>
     
        <Grid container spacing={4} className="p-4">
        <Grid  xs={12} sm={12} md={4} className="pl-2 mt-2">
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          disabled
          id="date-picker-dialog"
          label="Expense Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={element.expense_date}
          onChange={this.handleExpenseDate}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    disabled
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Category"
                    value={element.expense_category_id}
                    onChange={(event, child) => this.UpdateCategory(idx,event, child.props.id)}
                    variant="outlined">
                    {this.state.categoryList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  
        
            <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    disabled
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Sub Category"
                    value={element.expense_subcategory_id}
                    onChange={(event, child) => this.selectSubCategory(event, child.props.id)}
                    variant="outlined">
                    {this.state.subCategoryList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  
        
          <Grid item xs={12} sm={6} lg={6}  style={{padding:10}}>
          <FormControl fullWidth>
            <TextField
                    disabled
                    className="mx-1"
                    id="outlined-select-currency"
                    select
                    label="Select Vendor"
                    value={element.expense_vendor_id}
                    onChange={(event, child) => this.selectVendor(event, child.props.id)}
                    variant="outlined">
                    {this.state.vendorsList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  
            <Grid xs={12} sm={12} md={3}>
            <FormControl fullWidth>
          <TextField 
          disabled
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
            value={element.invoice_no}
          id="document-type"   
          label="Invoice No." 
          className="mx-2 mt-2"
          type="search" 
          onChange={(event) => this.handleChangeExpenseInput("invoice_no",event.target.value)}
          variant="outlined" />
          </FormControl>
            </Grid>

        <Grid  xs={12} sm={12} md={3} className="pl-2">
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          autoOk
          margin="normal"
          disabled
          id="date-picker-dialog"
          label="Invoice Date"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={element.invoice_date}
          onChange={this.handleInvoiceDate}   
          KeyboardButtonProps={{
          'aria-label': 'change date',
          }}
          />
          </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
        
            <Grid xs={12} sm={12} md={12}>
            <FormControl fullWidth>
          <TextField 
          disabled
           inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'}
            }}
            value={this.state.notes}
          id="document-type"   
          label="Notes" 
          className="mx-2"
          type="search" 
          multiline
          rows={2}
          onChange={(event) => this.handleUpdateExpenseInput(idx,"notes",event.target.value)}
          inputRef={this.textInput} 
          variant="outlined" />
          </FormControl>
            </Grid>
          </Grid>
          {element.particulars.map((ele, index) => (
        <div>
           <Grid container spacing={4}  className="px-3">
            <Grid item xs={12} sm={6} lg={6}>
              <FormControl fullWidth>
              <TextField 
              disabled
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.particular}
              label="Particulars" 
              type="search" 
              onChange={(event) => this.handleUpdateExpenseCollectFee(idx,index, "particular",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={2}>
              <FormControl fullWidth>
              <TextField 
              disabled
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.quantity}
              label="Quantity" 
              type="search" 
              onChange={(event) => this.handleUpdateExpenseCollectFee(idx,index, "quantity",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
            </Grid>  
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
              <TextField 
              disabled
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={ele.amount}
              label="Amount" 
              type="search" 
              onChange={(event) => this.handleUpdateExpenseCollectFee(idx,index, "amount",event.target.value)}
              variant="outlined" />
              </FormControl>
            </Grid>  
     
            <Grid item xs={12} sm={6} lg={1}>
          
            {/* <Remove onClick={()=>this.removeExpenseInfoHolder(idx,index)} style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} /> */}
           
            </Grid>  
           </Grid>
        </div>
      ))}
      <Grid container spacing={4} className="mt-4">
                <Grid xs={12} sm={12} md={8}>
                
                </Grid>
                <Grid xs={12} sm={12} md={3}  className="text-center">
                <FormControl fullWidth>
              <TextField 
              disabled
              inputProps={{
              autoComplete: 'off',
              style: {textTransform: 'capitalize'}
              }}
              id="document-type"   
              value={this.state.expenseDetails[0].discount}
              label="Discount" 
              className="ml-3 mr-4"
              type="search" 
              onChange={(event) => this.updateDiscount(idx,event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
              </FormControl>
                </Grid>
      </Grid>
      </div>
         ))}
       <Grid container spacing={4} className="mt-5">
                <Grid xs={12} sm={12} md={7}>
                
                </Grid>
                <Grid xs={12} sm={12} md={4}  className="text-center">
                <b>Total Rs. {this.state.expenseUpdateAmt}</b>
                </Grid>
      </Grid>
          <CardActions stats style={{marginTop:0}}>
          <Grid container spacing={4} className="mt-4">
          {/* <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
          <Button className="mr-2"  variant="outlined" color="secondary" onClick={()=> this.handleUpdateHolder()}>
          Add Row
          </Button>  
          <Button className="mr-2 successBtnOutline"   onClick={()=>{ this.updateExpense(); }}>
          Update
          </Button>
          </Grid> */}
          </Grid>
          </CardActions>
          </Card></Grid> 
        </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(Expense);
