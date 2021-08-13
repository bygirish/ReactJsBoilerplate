import React, { Fragment } from 'react';
import {Dialog,Grid,Switch,FormControlLabel,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,Toolbar,Box,ButtonGroup,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip, Drawer, GridList} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import ViewIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/placeholder.jpg";
import 'date-fns';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
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
      academicMasterList:[],
      sectionMasterList:[],
      headingStudents:[],
      vendorsList:[],
      sectionWiseList:[],
      vendorInsertData:{name:'',email:'',mobile:'',gst:'',contact_person:'',address:''},
      selectedVendorInfo:{id:'',name:'',email:'',gst:'',contact_person:'',mobile:'', address:''},
      view_vendors:false,
      fee_master:true,
      selectedStandardId:''
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

  handleDate = (cellInfo,x) => {
    let data = [...this.state.sectionMasterList];
    data[cellInfo.index].due_date = moment(x).format('YYYY-MM-DD');
    this.setState({ data });
 }

 renderDate = (cellInfo) => {
   const cellValue = this.state.sectionMasterList[cellInfo.index].due_date;
 
     return (
       <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <KeyboardDatePicker
         margin="normal"
         autoOk={true}
        id="date-picker-dialog"
         label="Select Date"
         inputVariant="outlined"
         value={cellValue}
         onChange={(x, event) => this.handleDate(cellInfo,x)}   
         KeyboardButtonProps={{
           'aria-label': 'change date',
         }}
       /></MuiPickersUtilsProvider>
   );      
 };

  handleInputChange = (cellInfo, event, name) => {
    let data = [...this.state.sectionMasterList];
    data[cellInfo.index][name] = event.target.value;
    this.setState({ data });
};

  renderAmount = (cellInfo) => {
    const cellValue = this.state.sectionMasterList[cellInfo.index].amount;
  
      return (
        <FormControl fullWidth>
  <TextField 
          inputProps={{
           autoComplete: 'off'
           }} 
         onChange={(event)=> { if (this.verifyNumber(event.target.value)) {
          this.handleInputChange(cellInfo,event, "amount")
       }}}
         value={cellValue}
         type="text"  />
     
      </FormControl>
    );      
  };

  getNonAcademicMaster(id_header) {
    this.setState({selectedAcademicHeading:id_header})
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id_heading:id_header,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesConfigs/getNonAcademicMaster',postData).then(response => {
      console.log(response.data);
      if (response.status==200 && response.data!='') {
          this.setState({sectionMasterList:response.data});
      }
    }).catch(error => {
      console.log("error");

    });
  }

  getAcademicFeeHeadings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"nonacademic",
      count:"nonacademicmaster",
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      //  console.log(response);
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
      console.log("error");

    });
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
      console.log("error");
    });
  }

  getAllBoardDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,  
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('boards/get_data',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          this.setState({ boardDetails: response.data });
        }
      }
    }).catch(error => {
      console.log("error");
    });
  }

  getStandardSectionDetails() {
    const postData = {
    count:"student",
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear
    };
    new Service().apiCall('ClassDetails/getData',postData).then(response => {
    
      if (response.status==200 && response.data!='') {
        var lStandardSections = [];
        var lBoardDetails =[];
        response.data.forEach(element => {
              if(lStandardSections[element.standard_id]){
                  var lSection = {};
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandardSections[element.standard_id].standards.push(lSection);
              }else{
                  var lStandard = {};
                  var lSection = {};
                  lStandard.standard_name = element.standard_name;
                  lSection.section_id = element.section_id;
                  lSection.section_name = element.section_name;
                  lSection.standard_id = element.standard_id;
                  lSection.standard_name = element.standard_name;
                  lSection.all_subject_count = element.all_subject_count;
                  lSection.active_subject_count = element.active_subject_count;
                  lSection.fee_remain_count = element.feeremaindetails;
                  lStandard.standards = new Array();
                  lStandard.standards.push(lSection);

                  lStandardSections[element.standard_id] = lStandard;

              }

        });
        let data =  [];  
           lStandardSections.forEach((element,index )=> {
            data.push({id:index,value:element.standard_name});
        });
        
        this.setState({ classwiseSections:lStandardSections,standardSections:response.data,filterSections:response.data, textSuggestions:data});
      }
    }).catch(error => {
      console.log(error);

    });

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

  handleSelecteSidebardSection = (id,name) => {
    this.setState({fee_sectionWise:true, selectedStandardId:id, selectedSidebarSection:name,view_vendors:false,fee_master:false,activeSuggestion:0 });
    this.getSectionwiseDetails(id);
  }

  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewMapped={true}
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.fee_master  ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  getSectionwiseDetails(id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"academic",
      id_section:id,
      count:"academicfeemastersection",
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        console.log(response);
        let data = response.data;
        let cArr=[];
        const newArr = data.map(v => ({...v, editable: false}));
        const mList = newArr.filter(x => x.type == "nonacademic");
   
        if(this.state.showStatus === 'all'){
            this.setState({sectionWiseList:mList});
        }
         else{
            var newArray = mList.filter(x => x.status == this.state.showStatus);
            this.setState({sectionWiseList:newArray});
         }
        
      }
    }).catch(error => {
      console.log("error");

    });
  }

  insertVendor = e => {
    e.preventDefault();
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
       
      }
    }).catch(error => {
        console.log(error);

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
  
  verifyNumber = value => {
    var numberRex = new RegExp(/^\d*\.?\d*$/); 
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  
  insertNonAcademicMaster = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id_header:this.state.selectedAcademicHeading,
      masters:this.state.sectionMasterList,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesConfigs/insert_nonacademic_feeconfig',postData).then(response => {
  
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
              <div className="avatar-icon-wrapper rounded-circle m-0">
                <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-success text-success m-0 d-130">
                  <FontAwesomeIcon
                    icon={['fas', 'check']}
                    className="d-flex align-self-center display-3"
                  />
                </div>
              </div>
              <h4 className="font-weight-bold mt-4">Fee Master Added Successfully!</h4>

            </div>
          </Dialog>
          ),
        });
        setTimeout(() => {
         window.location.reload();
       }, 2000)
      }
    }).catch(error => {
      console.log("error");

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
       
      }
    }).catch(error => {
     console.log(error)

    });
  }

  getHeadingStudents(id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"nonacademic",
      id_header:id,
      token:"abc",
      filter:[{"columname":"id_academicyear","operator":"=","columnvalue":this.props.data.selectedAcademicId},{"columname":"id_board","operator":"=","columnvalue":this.props.data.selectedBoardId},{"columname":"type","operator":"=","columnvalue":"academic"},{"columname":"id_section","operator":"=","columnvalue":this.state.selectedStandardId}],
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getHeaderwiseStudentDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
            let data = response.data;
            this.setState({headingStudents:data, viewSectionStudents:true});
      }
    }).catch(error => {
      console.log("error");
    });
  }

  componentDidMount() {
   this.getAllBoardDetails();
   this.getStandardSectionDetails();
   this.getStudentDetails('',this.props.data.selectedBoard,this.state.selectedAcademicYear);
   this.getAcademicFeeHeadings();
   this.getVendorsList();
  }

render(){
  const width = (window.innerWidth) * (40/100)+"px";
  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container>
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.fee_master ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);this.setState({fee_master:true,fee_sectionWise:false, view_vendors:false, selectedStandardId:''})}}>
                    <span>Fee Master</span>
                  </ListItem>
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.view_vendors ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);this.setState({view_vendors:true,fee_master:false,fee_sectionWise:false, selectedStandardId:''})}}>
                    <span>Vendors</span>
                  </ListItem>
                  <Divider />
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
      
        {this.state.fee_master && <Grid container >
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Fee Headings
                </h4>
              </div>
            </div>

    
     
   
            <ReactTable

data={
this.state.academicMasterList.map((original,key) => {
return ({
  slno: key+1,
  name: original.name,
  id_header:original.id,
  standard_count:original.non_standard_count,
  total_amount:original.total,
  academic_due:Math.ceil(original.total) - Math.ceil(original.academic_amount_paid),
  academic_amount_paid:original.academic_amount_paid,
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
                className="m-2"
                simple
                onClick={()=>{this.setState({sectionMastersPanel:true}); this.getNonAcademicMaster(original.id)}}
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
  Header: "Heading",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Heading"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Standard",
accessor: "standard_count",
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
Header: "Total",
accessor: "total_amount",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Due"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
  Header: "Paid",
  accessor: "academic_amount_paid",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Paid"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
   
  )
  },
  {
    Header: "Due",
    accessor: "academic_due",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Due"
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
    <Grid container>
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
         
        {this.state.fee_sectionWise && <Grid container>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Fee Headings
                </h4>
              </div>
            </div>

    <ReactTable

data={
this.state.sectionWiseList.map((original,key) => {
return ({
  slno: key+1,
  name: original.name,
  student_count:original.student_count,
  paid:original.paid,
  total:original.total,
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
                className="m-2"
                simple
                onClick={()=>{this.setState({selectedHeading:original.name}); this.getHeadingStudents(original.id)}}
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
  Header: "Heading",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Heading"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Students",
accessor: "student_count",
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
Header: "Paid",
accessor: "paid",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Paid"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
  Header: "Total",
  accessor: "total",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Total"
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
    <Grid container>
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

        {this.state.view_vendors && <div><Grid container>
        <Grid item xs={12} md={8} lg={1}></Grid>  
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <form
        onSubmit={this.insertVendor.bind(this)}
        autoComplete="off">
            <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Vendor Registration
                </h4>
              </div>
            </div>
       
            <Grid container className="px-4 pb-3">
            <Grid xs={12} sm={12} md={8} className="py-1">
                  <FormControl fullWidth>
                  <TextField 
                  inputProps={{
                  style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                  }}
                  required
                  id="document-type"   
                  className="m-2"
                  label="Vendor Name" 
                  value={this.state.vendorInsertData.name}
                  type="search" 
                  onChange={(event) => this.handleChangeVendorInput("name",event.target.value.replace(/[^a-zA-Z\.,]/g, ''))}
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
                  pattern: "[a-z]",
                  maxLength: 10
                  }}
                  required
                id="document-type"   
                label="Mobile" 
                className="m-2"
                value={this.state.vendorInsertData.mobile}
                type="search" 
                onChange={(event) => this.handleChangeVendorInput("mobile",event.target.value.replace(/\D/g, ""))}
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
                required
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
                required
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
                  required
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
          <Grid container>
          <Grid item xs={12} md={12} lg={12} className="text-right">
          <Button  type="submit" variant="outlined" className="successBtnOutline">
          Submit
          </Button>
          </Grid>
          </Grid>
          </CardActions>    
          </form> 
        </Card>
        </Grid>
        </Grid>
        
        <Grid container justify="center">
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
    // {
    // Header: "No of Headings",
    // accessor: "header_count",
    // className: "center",
    // Filter: ({filter, onChange}) => (
    // <TextField 
    // inputProps={{
    // autoComplete: 'off'
    // }}         
    // id="document-type"   
    // value={filter ? filter.value : ''}
    // placeholder="Search Count"
    // type="text" 
    // onChange={event => onChange(event.target.value)}
    // />
    // )
    // },
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
        <Grid container >
          <Grid item xs={12} md={4} lg={6}></Grid>
          <Grid item xs={12} md={4} lg={6} className="text-right">
        {/* <Button   variant="outlined" color="secondary">
            Export
            </Button> */}
            </Grid>
            </Grid>
      </CardActions>
    
            </Card>
        </Grid>
        </Grid>
        </div>
        }
        </Grid>  
        </Grid>  
        <Dialog fullScreen open={this.state.viewSectionStudents} className="bgColor" onClose={()=>this.setState({editRolePanel:false})} TransitionComponent={Transition}>
    
    <AppBar className="app-header" color="secondary" position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({viewSectionStudents:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
           {this.state.selectedHeading + " - "+this.state.selectedSidebarSection}
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container justify="center" className="pt-100">
    <Grid item xs={12} sm={12} lg={8}>
    <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Students List
                </h4>
              </div>
            </div>

    <ReactTable

data={
this.state.headingStudents.map((original,key) => {
return ({
  slno: key+1,
  amount: original.amount,
  concession_amount:original.concession_amount,
  student:original.student,
  paid_amt:original.paid_amt,
  due_date:original.due_date
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
  Header: "Student",
  accessor: "student",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Student"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
Header: "Amount Rs",
accessor: "amount",
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
  Header: "Concession Rs",
  accessor: "concession_amount",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Concession"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
{
Header: "Paid Rs",
accessor: "paid_amt",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Paid"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
)
},
{
  Header: "Due Date",
  accessor: "due_date",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="document-type"   
  value={filter ? filter.value : ''}
  placeholder="Search Date"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
   
  ),
  Cell: row => (
    <div>{moment(row.original.due_date).format("Do MMMM YYYY")}</div>
  )
  }
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
  <CardActions stats style={{marginTop:0}}>
    <Grid container >
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    {/* <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button> */}
        </Grid>
        </Grid>
  </CardActions>

        </Card>
    </Grid>
    </Grid>
    </Dialog>  
    <Drawer
    anchor="right"
    open={this.state.EditVendorPanel}
    variant="temporary"
    elevation={4}
    onClose={()=> this.setState({EditVendorPanel:false})}>
    <Box className={"app-header-drawer "} style={{width:width}}>
    <PerfectScrollbar>

    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({EditVendorPanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Update Vendor Details
        </Typography>
      </Toolbar>
    </AppBar>
    <Grid container>
        <Grid item xs={12} md={8} lg={12}>
        
            <Grid container className="px-4 pb-3 pt-40">
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
                  value={this.state.selectedVendorInfo.name}
                  type="search" 
                  onChange={(event) => this.handleChangeVendorUpdate("name",event.target.value)}
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
                value={this.state.selectedVendorInfo.mobile}
                type="search" 
                onChange={(event) => this.handleChangeVendorUpdate("mobile",event.target.value)}
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
              value={this.state.selectedVendorInfo.gst}
              onChange={(event) => this.handleChangeVendorUpdate("gst",event.target.value)}
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
              value={this.state.selectedVendorInfo.contact_person}
              onChange={(event) => this.handleChangeVendorUpdate("contact_person",event.target.value)}
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
                value={this.state.selectedVendorInfo.email}
                onChange={(event) => this.handleChangeVendorUpdate("email",event.target.value)}
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
                value={this.state.selectedVendorInfo.address}
                type="search" 
                onChange={(event) => this.handleChangeVendorUpdate("address",event.target.value)}
                inputRef={this.textInput} 
                variant="outlined" />
                </FormControl>
            </Grid>
            </Grid> 
          <CardActions className="mr-2 mb-1">
          <Grid container>
          <Grid item xs={12} md={12} lg={12} className="text-right">
          <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.updateVendor()}>
          Update
          </Button>
          </Grid>
          </Grid>
          </CardActions>     
       
        </Grid>
        </Grid>
    </PerfectScrollbar>
    </Box>
    </Drawer>
    <Dialog fullScreen open={this.state.sectionMastersPanel} className="bgColor" onClose={()=>this.setState({sectionMastersPanel:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.setState({sectionMastersPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Assign Fee
            </Typography>
               </Grid>
              
            </Grid>
      
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-70 inputPadding"> 
      <Grid container justify="center" className="pt-100">
    <Grid item xs={12} sm={12} lg={8}>
    <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Standard List
                </h4>
              </div>
            </div>

    <ReactTable

data={
this.state.sectionMasterList.map((original,key) => {
return ({
  slno: key+1,
  standard: original.standard_name + " "+ original.stream_name +" "+original.section_name,
  amount:original.amount,
  due_date:original.due_date,
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
  Header: "Standard",
  accessor: "standard",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Standard"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
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
placeholder="Search Amount"
type="text" 
onChange={event => onChange(event.target.value)}
/>
),
Cell: this.renderAmount
},

{
Header: "Due Date",
width:200,
accessor: "due_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Date"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
),
Cell: this.renderDate
}
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
  <CardActions stats style={{marginTop:0}}>
    <Grid container>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" className="successBtnOutline" onClick={()=> this.insertNonAcademicMaster()}>
        Submit
        </Button>
        </Grid>
        </Grid>
  </CardActions>
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
