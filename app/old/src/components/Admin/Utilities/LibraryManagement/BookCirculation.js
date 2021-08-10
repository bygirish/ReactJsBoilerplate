import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import logo from "../../../../assets/images/egenius_logo.png";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
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

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      selectedDate:new Date(),
      enddate: new Date(),
      selectedSection:'',
      selectedStandard:'',
      studentInfo:'',
      tags: [],
      documentInfo:'',
      documentHolders:[{type:'', no_of_sheets:'', unique_no:''}],
      suggestions:[],
      studentSuggestions:[],
      studentBooks:[],
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
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

  handleDateChange = (date) => {
    this.setState({ selectedDate: date })
  };
  handleEndDate = (enddate) => {
    this.setState({ enddate: enddate })
  };

  


  verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  verifyInput = value => {
    var numberRex = new RegExp("^[A-Za-z]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };


  handleDateOfBirth = (dob) => {
    this.setState({ dateOfBirth: dob })
  };

  removeDocumentHolder(i) {
    const { documentHolders } = this.state;
    this.setState({
      documentHolders: documentHolders.filter((holder, index) => index !== i),
    });
  }

  handleAddDocumentholder = () => {
    let ldocumentHolders = this.state.documentHolders;
    let lDocument = {};
    lDocument.type = '';
    lDocument.no_of_sheets = '';
    lDocument.unique_no = '';
    ldocumentHolders.push(lDocument);
    this.setState({documentHolders:ldocumentHolders});
  }

  handleDocumentChange = (pIndex,inputName,pValue) => {
    let data = this.state.documentHolders;
    data[pIndex][inputName] = pValue;
    this.setState({data});
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

  getIssuedBooks = (uid) => {
    this.setState({studentDocuments:[]});
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_student:uid,
      id_board:this.state.selectedBoard,
      role_id: this.props.data.role_id,
      id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('Libraries/getIssuedBooks',postData).then(response => {
 
      if (response.status==200 && response.data!='') {
            this.setState({studentBooks:response.data});
      }
    }).catch(error => {
      this.showError(error.response.data)
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


  insertDocument = () =>{
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      documentList:this.state.documentHolders,
      submitted_on: moment(this.state.selectedDate).format("YYYY-MM-DD"),
      UID: this.state.studentInfo.UID,
      role_id:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('DocumentManagements/insertDocumentDetails', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
  
      if (response.status==200 && response.data!='') {
             this.setState({
       basicNotify: (
         <Dialog open={true}>
       <div className="text-center p-5">
         <h4 className="font-weight-bold">Documents Inserted</h4>
       </div>
     </Dialog>
       ),
     });
        setTimeout(() => {
         // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
          window.location.reload()
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data);
    });
}

updateStatus = () =>{
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    id_document:this.state.id_document,
    status:this.state.changeTo,
    token:"abc",
    id_user: this.props.data.UID
  };
  new Service().apiCall('DocumentManagements/UpdateDocumentStatus', postData,
  {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  ).then(response => {
  
    if (response.status==200 && response.data!='') {
           this.setState({
     basicNotify: (
       <Dialog open={true}>
     <div className="text-center p-5">
       <h4 className="font-weight-bold">Status Updated</h4>
     </div>
   </Dialog>
     ),
   });
      setTimeout(() => {
       // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
       window.location.reload()
      }, 2000)
    } else {
      //this.raiseLoginSignupErrorAlert("signup");
    }
  }).catch(error => {
    //this.raiseLoginSignupErrorAlert("signup");
  });
}

renderStatusPanel = (status,id, data) => {
  if(status == "incustody"){
      this.setState({custodyPanel:true, id_document:id, documentInfo:data})
  }
  else  if(status == "returned"){
    this.setState({returnPanel:true, id_document:id, documentInfo:data})
  } 
  else  if(status == "disposed"){
    this.setState({disposePanel:true, id_document:id, documentInfo:data})
  }
}

  handleStudentSearch = (val) => {
    this.setState({ studentInfo: val});
    this.getIssuedBooks(val.UID);
  }


  componentDidMount() {
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
  }

render(){
  const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  const width50p =  width * (50/100)+"px";
  const width100p =  width +"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/library-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
            Issue/Return Books
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

      <Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={10}>
        <Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={6}>  
        <Autocomplete
          type="student"
          showValue={true}
          SearchPlaceholderText="Search Student Name"
          suggestions={this.state.studentSuggestions}
          onSelected={this.handleStudentSearch}
          {...this.props}
          />
          </Grid>
          </Grid>
        </Grid> 
        </Grid>

        {this.state.studentInfo!='' &&  AuthHelper('Library Management','can_create') &&  <div><Grid container spacing={4} justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 p-3">
        <Grid container>
        <Grid item xs={12} md={12} lg={12}>
        <div className="card-header pl-0">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                Fresh Issuance
                </h4>
              </div>
        </div>
        {this.state.documentHolders.map((holder, idx) => (
      <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={1} className="text-center">
      <TextField 
id="document-type"   
onKeyPress={(data) => {
if (data.charCode === 13) {
this.handleAddDocumentholder(); this.focusTextInput();
}
}}
InputProps={{
autoComplete: 'off',
readOnly: true,
startAdornment: (
<InputAdornment position="start">
{idx+1}
</InputAdornment>
),
}}
label="Add" 
variant="outlined" />
      </Grid>
      <Grid item xs={12} sm={10} md={5}>
             <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                style: {textTransform: 'capitalize'}
                }}
                onChange={(event) => 
                  this.handleDocumentChange(idx,"type",event.target.value)
                  }
                value={holder.type}
               id="document-type"   
               label="Document type" 
               type="search" 
               inputRef={this.textInput} 
               variant="outlined" />
               </FormControl>
        </Grid>
        <Grid item xs={12} sm={10} md={2}>
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                style: {textTransform: 'capitalize'}
                }}
                onChange={(event) => 
                  this.handleDocumentChange(idx,"no_of_sheets",event.target.value)
                  }
               id="document-type"   
               label="No of sheets" 
               value={holder.no_of_sheets}
               type="search" 
               variant="outlined" />
               </FormControl>
        </Grid>
        <Grid item xs={12} sm={10} md={3}>
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off',
                style: {textTransform: 'capitalize'}
                }}
                onChange={(event) => 
                  this.handleDocumentChange(idx,"unique_no",event.target.value)
                  }
                value={holder.unique_no}
               id="document-type"   
               value={holder.unique_no}
               label="Unique No" 
               type="search" 
               variant="outlined" />
               </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={1}>
            { idx == 0 ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
            <TextField 

            id="document-type"   
            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.handleAddDocumentholder(); this.focusTextInput();
            }
            }}
            InputProps={{
            autoComplete: 'off',
            readOnly: true,
            startAdornment: (
            <InputAdornment position="start">
            <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
            </InputAdornment>
            ),
            }}
            label="Add" 
            onClick={()=>{this.handleAddDocumentholder(); this.focusTextInput()}}
            variant="outlined" />
            </FormControl></div>
            :
            <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
            <TextField 

            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.removeDocumentHolder(idx); 
            }
            }}
            id="document-type"   
            InputProps={{
            autoComplete: 'off',
            readOnly: true,
            startAdornment: (
            <InputAdornment position="start">
            <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} />
            </InputAdornment>
            ),
            }}
            label="Del" 
            onClick={()=>{this.removeDocumentHolder(idx);}}
            variant="outlined" />
            </FormControl></div>
            }
            </Grid> 
        </Grid>
        ))}
   
        </Grid>
        </Grid>

      <Grid container className="mt-2">
      
        <Grid item xs={12} sm={12} md={12} className="text-right">
             <Button className="successBtnOutline" variant="outlined" onClick={()=>this.insertDocument()}>Submit</Button>
        </Grid>
        </Grid>
     </Card></Grid></Grid></div>}

       {this.state.studentBooks.length > 0 && <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={10} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Issued Books
                </h4>
              </div>
        </div>
    <ReactTable

data={
  this.state.studentBooks.map((original,key) => {
    return ({
      slno: key+1,
      id:original.id,
      id_book:original.id,
      name: original.student_name,
      barcode:original.barcode,
      ISBN:original.ISBN,
      title:original.title,
      price:original.price,
      issued_date:original.issued_date,
      returning_date:original.returning_date,
      status:original.book_status,
      penalty:original.penalty,
      actions: (
        <div>
            <Tooltip
            id="tooltip-top"
            title="View Document"
            placement="top"
            >
            <Button  color="secondary"
            simple
            className="edit"
            onClick={()=>this.renderStatusPanel(original.document_status,original.id_document, original)}
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
  Header: "Name",
  accessor: "name",
className: "center",
Filter: ({filter, onChange}) => (
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
)
},

    {
      Header: "Status",
      accessor: "status",
      className: "center",
      Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Status"
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

  </CardActions>

        </Card></Grid> 
        </Grid>}

        <Drawer

          anchor="right"
          open={this.state.custodyPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({custodyPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({custodyPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Return or Dispose Documents
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Card className="card-box  mb-4 p-3">
        <Grid container spacing={2} justify="center">
           
    
              <Grid item xs={12} sm={12} md={6} className="text-center margin-auto"> 
              
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "returned"}
                          onChange={() => this.setState({changeTo:'returned'})}
                          value="fulltime"
                          name="radio button enabled"
                          aria-label="B"
                        
                        />
                      }
                    
                      label="Return"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                        checked={this.state.changeTo === "disposed"}
                        onChange={() => this.setState({changeTo:'disposed'})}
                          value="shift"
                          name="radio button enabled"
                          aria-label="B"
                         
                        />
                      }
                    
                      label="Dispose"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="margin-auto">
                    <Button className="successBtnOutline" onClick={()=>this.updateStatus()}>
                        Submit
                    </Button>
                  </Grid>
              </Grid>
          </Card>
          </div>
        </PerfectScrollbar>
        </Box>
        </Drawer>

        <Drawer

anchor="right"
open={this.state.returnPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({returnPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width50p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({returnPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View Documents
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4 p-3">
<div class="invoice-box">    
            <table style={{fontSize:'12px'}}>
            <tr className="information header">
                <td colspan="3">
                    <table>
                        <tr>
                        <td className="title">
                              <img style={{maxWidth:'60px'}} src={logo} alt="logo"  />
                        </td>
                        <td style={{textAlign:'center'}}>
                       eGenius<br />  
                     
                        Rajajinagar, Karnataka Bengaluru - 560010<br />
                        <strong>DOCUMENT RETURNED MEMORANDUM</strong><br />
                        <strong>DOCKET NO: 100001</strong>
                        </td>
                            <td style={{minWidth:'90px'}}>
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
                                Date: <strong>{moment(this.state.documentInfo.submitted_on).format("DD/MM/YYYY")}</strong><br />
                                Student Name: <strong>{this.state.documentInfo.name+" "+this.state.documentInfo.last_name}</strong><br />
                                Father Name: <strong>{this.state.documentInfo.father_name}</strong><br />
                                
                            </td>
                            
                            <td>
                                Contact No: <strong>{this.state.documentInfo.father_name}</strong><br />
                                Standard: <strong>{this.state.documentInfo.standard+" "+this.state.documentInfo.section}</strong><br />
                                UID: <strong>{this.state.documentInfo.UID}</strong><br />
        
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
                      Particulars
                      </td>
                      
                      <td style={{width:"150px"}}>
                      No of Sheets
                      </td>
                      <td style={{width:"150px"}}>
                      Unique No.
                      </td>
                      </tr>
                      {this.state.documentInfo.documents && this.state.documentInfo.documents.map((ele,i)=>(
                          <tr className="item">
                          <td style={{textAlign:"center",width:"50px"}}>
                             {i+1}
                          </td>
                          
                          <td style={{textAlign:"left"}}>
                             {ele.type}
                          </td>
                       
                          <td style={{width:"150px"}}>{ele.no_of_sheets}</td>
                          <td style={{width:"150px"}}>{ele.unique_no}</td>
                      </tr>
                      ))}
                      
                       
                    </table>
                </td>
            </tr>
       
                       
            <tr className="item">
                        <td colspan="1" style={{textAlign:'center'}}>
                      <strong>Yes I received all above documents in good condition.</strong>

                        </td>
                       
                        </tr>

                        <br /><br />
                        <tr>
                <td  colspan="2">
                    <table>
                    
                        <tr>
                            <td style={{textAlign:"left",padding:"0 !important"}}>
                            <strong>Recipients Signature</strong>
                            </td>
                            <td style={{textAlign:"right",padding:"0 !important"}}>
                            <strong>Authorized Signatory</strong>
                            </td>
                           
                        </tr>
                       
                    </table>
                </td>
            </tr>
                  
        </table>
        </div>
</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>

        
</div>
</Animated>
</Dialog>

    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
