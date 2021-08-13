import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,FormControlLabel,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,Toolbar,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip,Table,TableBody,TableCell,TableContainer,TableHead,TableRow} from '@material-ui/core';
import ReactTable from 'react-table-6';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import ViewIcon from "@material-ui/icons/Visibility";
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
      selectedFrequency:'Annual',
      frequency:['Annual','Monthly','Quarterly'],
      sectionMasterList:[],
      headingStudents:[],
      sectionWiseList:[],
      sectioncategories:[],
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
  selectFrequency = (value) => {
    this.setState({selectedFrequency:value});
  }
  getStateValue = (name) => {
    return this.state.name;
  }

  getAcademicFeeHeadings() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"academic",
      count:"academicfeemaster",
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('FeesMasters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      //  console.log(response);
        let data = response.data;
        let cArr=[];
        const newArr = data.map(v => ({...v, editable: false}));
        const mList = newArr.filter(x => x.type == "academic");
   
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

  getAcademicMaster(id_header) {
    console.log(id_header);
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
    new Service().apiCall('FeesConfigs/getAcademicMaster',postData).then(response => {
      console.log(response.data);
      if (response.status==200 && response.data!='') {
          this.setState({sectionMasterList:response.data});
      }
    }).catch(error => {
      console.log("error");

    });
  }

  insertAcademicMaster = () => {
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
    new Service().apiCall('FeesConfigs/insert_feeconfig',postData).then(response => {
  
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
  
  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id={name}   
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

  handleSelecteSidebardSection = (id,name) => {
    this.setState({fee_sectionWise:true, selectedStandardId:id, selectedSidebarSection:name,fee_master:false,activeSuggestion:0 });
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
        const mList = newArr.filter(x => x.type == "academic");
   
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

  verifyNumber = value => {
    var numberRex = new RegExp(/^\d*\.?\d*$/); 
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  handleInputChange = (cellInfo, event, name) => {
    let data = [...this.state.sectionMasterList];
    data[cellInfo.index][name] = event.target.value;
    this.setState({ data });
};

  renderInstallments = (cellInfo) => {
    const cellValue = this.state.sectionMasterList[cellInfo.index].no_of_installments;
  
      return (
        <FormControl fullWidth>
  <TextField 
          inputProps={{
           autoComplete: 'off'
           }} 
         onChange={(event)=> { if (this.verifyNumber(event.target.value)) {
          this.handleInputChange(cellInfo,event, "no_of_installments")
       }}}
         value={cellValue}
         type="text"  />
     
      </FormControl>
    );      
  };

  handleChangeAmount = (idx,index,value) => {
    let data = this.state.sectionMasterList;
    data[idx].categories[index].amount = value.replace(/\D/g, "");
    this.setState({data});
  }



  renderFrequency = (cellInfo) => {
    const cellValue = this.state.sectionMasterList[cellInfo.index].frequency;
  
      return (
        <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id={"frequency"+cellInfo.index}
                    select
                    label="Select Frequency"
                    value={cellValue}
                    onChange={(event)=>    this.handleInputChange(cellInfo,event, "frequency")}
                    variant="outlined">
                    {this.state.frequency.map(option => (
                      <MenuItem key={option} name={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
        </FormControl>
    );      
  };

  
  handleDate = (cellInfo,x) => {
     let data = [...this.state.sectionMasterList];
     data[cellInfo.index].first_due = moment(x).format('YYYY-MM-DD');
     this.setState({ data });
  }

  renderDate = (cellInfo) => {
    const cellValue = this.state.sectionMasterList[cellInfo.index].first_due;
  
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          margin="normal"
          autoOk={true}
          id={"date"+cellInfo.index}
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

  getHeadingStudents(id) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      type:"academic",
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
  }

render(){
 
  const width = (window.innerWidth) * (40/100)+"px";
  return (
    <Fragment>
      {this.state.basicNotify}
     <Grid container >
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  <ListItem button className={this.state.selectedStandardId=='' && this.state.fee_master ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.getStudentDetails('',this.state.selectedBoard,this.state.selectedAcademicYear);this.setState({fee_master:true,fee_sectionWise:false, selectedStandardId:''})}}>
                    <span>Fee Master</span>
                  </ListItem>
                  <Divider />
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
      
        {this.state.fee_master && <Grid container>
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
  standard_count:original.academic_standard_count,
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
                onClick={()=>{this.setState({sectionMastersPanel:true}); this.getAcademicMaster(original.id)}}
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
id="srno"   
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
id="heading"   
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
id="count"   
value={filter ? filter.value : ''}
placeholder="Search Standard"
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
id="due"   
value={filter ? filter.value : ''}
placeholder="Search Total"
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
  id="paid"   
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
    id="academic-due"   
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
id="tooltip-view"
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
id="serialno"   
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
id="heading"   
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
id="scount"   
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
id="paid-amt"   
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
  id="total-amt"   
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

    <Grid container  justify="center" className="pt-100">
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
id="serno"   
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
id="sname"   
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
id="amount"   
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
  id="concession"   
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
id="amt-paid"   
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
  id="due-date"   
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
    <Grid container>
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
      <Grid container  justify="center" className="pt-100">
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
  standard: original.standard_name + " "+original.stream_name+" "+ original.section_name,
  no_of_installments:original.no_of_installments,
  frequency:original.frequency,
  first_due:original.first_due,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
                <Tooltip
id="tooltip-assign"
title={"Assign Fee"}
placement="top"
>
                <Button
                className="m-2"
                onClick={()=>this.setState({assignPanel:true, sectionIndex:key, sectioncategories:original.categories})}
                color="secondary"
                className="edit"
              >
                Assign Fee
              </Button> 

</Tooltip>
    </div>
  )
})
})
}
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
id="serial-number"   
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
id="standard-name"   
value={filter ? filter.value : ''}
placeholder="Search Standard"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
Header: "No of installments",
accessor: "no_of_installments",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="no-inst"   
value={filter ? filter.value : ''}
placeholder="Search installment"
type="text" 
onChange={event => onChange(event.target.value)}
/>
),
Cell: this.renderInstallments
},
{
  Header: "Frequency",
  accessor: "frequency",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="frequency"   
  value={filter ? filter.value : ''}
  placeholder="Search Frequency"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  ),
  Cell: this.renderFrequency
},
{
Header: "First_due",
width:200,
accessor: "first_due",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="first-due"   
value={filter ? filter.value : ''}
placeholder="Search Due"
type="text" 
onChange={event => onChange(event.target.value)}
/>
 
),
Cell: this.renderDate
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
    <Grid container >
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" className="successBtnOutline" onClick={()=> this.insertAcademicMaster()}>
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
      <Drawer
      anchor="right"
      open={this.state.assignPanel}
      variant="temporary"
      elevation={4}
      onClose={()=> this.setState({assignPanel:false})}>
      <Box className={"app-header-drawer bgColor"} style={{width:width}}>
        <PerfectScrollbar>
        <Grid container  justify="center" className="p-4">
                          <Grid item xs={12} md={10} lg={10}>
                          <Card className="card-box p-4">

                          <TableContainer>
      <Table className="denomTable"  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Fee Category</TableCell>
            <TableCell align="center">Amount Rs.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.sectioncategories.map((row,index) => (
            <TableRow key={row.id}>
              <TableCell align="center" component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center"> <TextField 
                              inputProps={{
                              autoComplete: "off",
                              pattern: "[a-z]"
                              }}
                              type="text" 
                              value={row.amount}
                              onChange={(event) => this.handleChangeAmount(this.state.sectionIndex,index,event.target.value)}
                              className="my-2"
                              /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                          </Card>
                          </Grid>
                          </Grid>
                          <Grid container justify="center" className="px-3">
                          <Grid item xs={12} md={12} lg={10} className="text-right">
                            <Button color="secondary" variant="contained" onClick={()=>this.setState({assignPanel:false})}>
                              Submit
                            </Button>
                          </Grid>  
                          </Grid>
        </PerfectScrollbar>
      </Box>
    </Drawer>  
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(AcademicFeeMaster);
