import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Paper,Grid,Chip,FormControlLabel,ButtonGroup,Dialog,Drawer,Toolbar,Card,CardContent,Radio,TextField,Button,Avatar,List,Tooltip,Slide,FormControl,Box,CardActions,IconButton,Typography,AppBar} from '@material-ui/core';
import ViewIcon from "@material-ui/icons/Visibility"; 
import { withRouter } from 'react-router-dom';
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import Config from '../../../../config';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
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

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen:true,
      basicNotify:false,
      from_date: new Date(),
      to_date:new Date(),
      frequencySettings:[],
      mappedAttendance:[],
      attendanceHistory:[],
      showStatus:'all',
      viewType:'student',
      PFrequency:'',
      Pselectedstandard:''
    };

  }

  handleFromDateChange = date => {
    this.setState({from_date:date})
  }

  handleToDateChange = date => {
    this.setState({to_date:date})
  }
  
handleInputChange = (cellInfo, event) => {
  let data = [...this.state.categoryList];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lcategories = this.state.categoryList;
  if(estatus == true){
    lcategories[index].editable = false;
  }
  else{
    lcategories[index].editable = true;
  }
  this.setState({ categoryList:lcategories});
}
  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.categoryList[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl fullWidth>
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={cellValue}
          placeholder="S No"
          type="text" 
          onChange={event => this.handleInputChange(cellInfo,event)}
          />
      </FormControl>
    );
      
    }
    else{
      return cellValue;
    }
    
  };



  handleAddChip = (chip) => {
    this.setState(state => ({ tags: [...state.tags, chip] }));
  }

  handleDeleteChip = (chip,i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddSubChip = (chip) => {
    this.setState(state => ({ subtags: [...state.subtags, chip] }));
  }

  handleDeleteSubChip = (chip,i) => {
    const { subtags } = this.state;
    this.setState({
      subtags: subtags.filter((tag, index) => index !== i),
    });
  }

  handleRealStandardSelected = (standards) => {
    this.setState({realtimeStandards:standards}); 
  }

  handleApproveStandardSelected = (standards) => {
    this.setState({approvalStandards:standards}); 
  }

handleFrequencyType = (val) => {
  console.log(val);
  this.setState({frequencySelected:val});
}

getHistory = () => {

  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    from_date:moment(this.state.from_date).format("YYYY-MM-DD"),
    to_date:moment(this.state.to_date).format("YYYY-MM-DD"),
    type:this.state.viewType,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('AttendanceDetails/getViewHistoryDetails',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
      
    this.setState({ attendanceHistory: response.data }); 
    }
  }).catch(error => {
    alert(error);
  });
}
exportAttendance = () => {

  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    from_date:moment(this.state.from_date).format("YYYY-MM-DD"),
    to_date:moment(this.state.to_date).format("YYYY-MM-DD"),
    type:this.state.viewType,
    token:"abc",
    id_user: this.props.data.UID,
  };
  new Service().apiCall('AttendanceDetails/getExportViewHistoryDetails',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
      
    // this.setState({ attendanceHistory: response.data }); 
    }
  }).catch(error => {
    alert(error);
  });
}

getMappedAttendance = (standard_id,date) => {
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
  id_institute:this.props.data.selectedInstitutionId,
  token:"abc",
  id_board:this.props.data.selectedBoardId,
  id_academicyear:this.props.data.selectedAcademicId,
  selectedstandard:standard_id,
  date:date,
  // type:"student",
  type:this.state.viewType,
  id_user: this.props.data.UID
  };
  new Service().apiCall('AttendanceDetails/getAttendanceMappedDetailsNew',postData).then(response => {
    console.log(response);
    if (response.status==200 && response.data!='') {
      const newArr = response.data.map(v => ({...v, status: v.attendance_status == 1 ? true : false}));
      this.setState({mappedAttendance:newArr});
    }
  }).catch(error => {
    console.log(error);

  });
}


  componentDidMount() {

  }

  render() {
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/attendance")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Attendance History
            </Typography>
               </Grid>
             
            </Grid>
          </Toolbar>
        </AppBar>
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <div  className="pt-100"> 
    

        <Grid container spacing={2} justify="center" className="sliderDiv">
      <Grid item xs={12} md={4} lg={10}>
          <Card className="card-box mb-4 p-3">
          <Grid container spacing={2} className="sliderDiv">
          <Grid item xs={12} md={4} lg={2}  className="pickerGrid">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="From date"
                inputProps={{ readOnly: true }}
                value={this.state.from_date}
                onChange={this.handleFromDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={4} lg={2}  className="pickerGrid">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker 
                disableToolbar
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="To date"
                inputProps={{ readOnly: true }}
                value={this.state.to_date}
                onChange={this.handleToDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
                />
                </MuiPickersUtilsProvider>
          </Grid>
         
          <Grid item xs={12} sm={12} md={5}>
          <FormControlLabel
                     control={
                       <Radio
                         checked={this.state.viewType === "student"}
                         onChange={() => this.setState({viewType:'student',attendanceHistory:[]})}
                         value="block_wise"
                         name="radio button enabled"
                         aria-label="B"
                        
                       />
                     }
                   
                     label="Student"
                   />
                 
       
                   <FormControlLabel
                     control={
                       <Radio
                       checked={this.state.viewType === "staff"}
                       onChange={() => this.setState({viewType:'staff',attendanceHistory:[]})}
                         value="floor_wise"
                         name="radio button enabled"
                         aria-label="B"
                        
                       />
                     }
                    
                     label="Staff"
                   />   
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button className="successBtnOutline" onClick={()=>this.getHistory()}>Submit</Button>
          </Grid>
          </Grid>
 
          </Card>

          <Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Attendance History
                </h4>
              </div>
        </div>
        {this.state.viewType=='student'?
        <ReactTable
    data={this.state.attendanceHistory.map((original,key) => {
        return ({
          slno: key+1,
          id_section:original.id_section,
          standard:original.standard,
          frequency: original.frequency,
          attendance_date:original.attendance_date,
          date:original.date,
          total_count:original.total_count,
          absent_count:original.absent_count,
          percentage:original.percentage,
          actions: (
            // we've added some custom button actions
            <div>
                       
                    <Tooltip
      id="tooltip-top"
      title="View"
      placement="top"
    >
          <Button variant="outlined" color="secondary"
                            simple
                            className="edit"
                            onClick={()=>{this.getMappedAttendance(original.id_section,original.attendance_date); this.setState({viewStudentsPanel:true,PFrequency:original.frequency,Pattendance_date:original.attendance_date,Pselectedstandard:original.id_section})}}
                          >
                          <ViewIcon  />
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
width: 80,
className: "center",
Filter: ({filter, onChange}) => (
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
  Header: "Date",
  accessor: "date",
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
  )
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
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Frequency"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Total Count",
    accessor: "total_count",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Total Count"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },
    {
      Header: "Present Count",
      accessor: "absent_count",
      className: "center",
      Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Present Count"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
      },
      {
        Header: "Percentage",
        accessor: "percentage",
        className: "center",
        Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Percentage"
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
/>:
    <ReactTable
    data={this.state.attendanceHistory.map((original,key) => {
        return ({
          slno: key+1,
          id_section:original.id_section,
          standard:original.standard,
          frequency: original.frequency,
          attendance_date:original.attendance_date,
          date:original.date,
          total_count:original.total_count,
          absent_count:original.absent_count,
          percentage:original.percentage,
          actions: (
            // we've added some custom button actions
            <div>
                       
                    <Tooltip
      id="tooltip-top"
      title="View"
      placement="top"
    >
          <Button variant="outlined" color="secondary"
                            simple
                            className="edit"
                            onClick={()=>{this.getMappedAttendance(original.id_section,original.attendance_date); this.setState({viewStudentsPanel:true,PFrequency:original.frequency,Pattendance_date:original.attendance_date})}}
                          >
                          <ViewIcon  />
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
width: 80,
className: "center",
Filter: ({filter, onChange}) => (
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
  Header: "Date",
  accessor: "date",
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
  )
  },


  {
    Header: "Total Count",
    accessor: "total_count",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Total Count"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
    },
    {
      Header: "Present Count",
      accessor: "absent_count",
      className: "center",
      Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Present Count"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
      },
      {
        Header: "Percentage",
        accessor: "percentage",
        className: "center",
        Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Percentage"
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
  }
<CardActions stats style={{marginTop:0}}>
{AuthHelper('Attendance','can_export') &&    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    {/* <Button className="mr-2"  variant="outlined" color="secondary" onClick={()=> this.exportAttendance(this.state.viewType)}>
        Export
        </Button> */}
         <Button className="mr-2" variant="outlined" color="secondary" 
         href={Config.url+"AttendanceDetails/getExportViewHistoryDetails?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId+"&from_date="+moment(this.state.from_date).format("YYYY-MM-DD")+"&to_date="+moment(this.state.to_date).format("YYYY-MM-DD")+"&type="+this.state.viewType}>
           Export</Button>

     
        </Grid>
        </Grid>}
  </CardActions>
        </Card>
        </Grid>
        </Grid>
           
        
    </Grid>
    </Grid>
       
</div>
    </Animated>
    </Dialog>

    <Drawer

anchor="right"
open={this.state.viewStudentsPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewStudentsPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewStudentsPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View Attendance History
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">   
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  View Attendance History
                </h4>
              </div>
        </div>
        {this.state.viewType=='student' &&
        <ReactTable
     
    data={this.state.mappedAttendance.map((original,key) => {
      
        return ({
          slno: key+1,
          id:original.id,
          roll_no:original.UID,
          name: original.name,
          parent_name:original.father_name,
          
          contact:original.contact_number,
          status:original.attendance_status,
          frequency:(
          
          original.frequency=='periodwise' && original.period || original.frequency=='twiceaday' && original.session || original.frequency=='onceaday' && 'onceaday'
          
          ),
         
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
Filter: ({filter, onChange}) => (
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
  Header: "Roll No",
  accessor: "roll_no",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Roll No"
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
  Header: "Parent Name",
  accessor: "parent_name",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Parent Name"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Contact No"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
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
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Contact No"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
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
        placeholder="Search Contact No"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
      Cell: row=>(
        <div>{row.original.status == "1" ? "Present":"Absent"}</div>
      )
      },
    // {
    //   Header: "Percentage",
    //   accessor: "percentage",
    //   className: "center",
    //   Filter: ({filter, onChange}) => (
    //     <TextField 
    //     inputProps={{
    //     autoComplete: 'off'
    //     }}         
    //     id="document-type"   
    //     value={filter ? filter.value : ''}
    //     placeholder="Search Percentage"
    //     type="text" 
    //     onChange={event => onChange(event.target.value)}
    //     />
    //   )
    //   }
   
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
}
{this.state.viewType=='staff' &&
        <ReactTable
     
    data={this.state.mappedAttendance.map((original,key) => {
        return ({
          slno: key+1,
          id:original.id,
          roll_no:original.UID,
          name: original.first_name,
          parent_name:original.father_name,
          contact:original.phone_no,
          status:original.attendance_status,
         
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
Filter: ({filter, onChange}) => (
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
  Header: "Roll No",
  accessor: "roll_no",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Roll No"
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
  Header: "Parent Name",
  accessor: "parent_name",
  className: "center",
  Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Parent Name"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
  ),
  },
  {
    Header: "Contact No",
    accessor: "contact",
    className: "center",
    Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Contact No"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
    ),
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
        placeholder="Search Contact No"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
      ),
      Cell: row=>(
        <div>{row.original.status == "1" ? "Present":"Absent"}</div>
      )
      },
    // {
    //   Header: "Percentage",
    //   accessor: "percentage",
    //   className: "center",
    //   Filter: ({filter, onChange}) => (
    //     <TextField 
    //     inputProps={{
    //     autoComplete: 'off'
    //     }}         
    //     id="document-type"   
    //     value={filter ? filter.value : ''}
    //     placeholder="Search Percentage"
    //     type="text" 
    //     onChange={event => onChange(event.target.value)}
    //     />
    //   )
    //   }
   
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
}
<CardActions stats style={{marginTop:0}}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    {/* <Button className="mr-2"  variant="outlined" color="secondary">
        Export
        </Button> */}
        <Button className="mr-2" variant="outlined" color="secondary" 
         href={Config.url+"AttendanceDetails/getExportViewHistoryDetailsInside?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.props.data.selectedBoardId+"&id_academicyear="+this.props.data.selectedAcademicId+"&from_date="+moment(this.state.from_date).format("YYYY-MM-DD")+"&to_date="+moment(this.state.to_date).format("YYYY-MM-DD")+"&type="+this.state.viewType+"&frequency="+this.state.PFrequency+"&attendace_date="+this.state.Pattendance_date+"&selectedstandard="+this.state.Pselectedstandard}>
           Export</Button>
       
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>
        </Grid>
</div>
</PerfectScrollbar>
</Box>
</Drawer>  

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
