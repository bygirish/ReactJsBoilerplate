import React, { Fragment, createRef } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { PageTitle } from '../../../../layout-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ViewIcon from "@material-ui/icons/Visibility"; 
import {Dialog,Grid,Drawer,Box,IconButton,Typography,AppBar,Toolbar,Card,CardContent,FormControlLabel,Radio,Button,FormGroup,Checkbox,Tooltip,Switch,TextField,Slide,FormControl,CardActions,Paper,Chip} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';
import DateFnsUtils from '@date-io/date-fns';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const fileInputRef = createRef();
const fileInput = React.createRef();

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

const fileInputClicked = () => {
  fileInputRef.current.click();
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate:new Date(),
      examTimetableList:[],
      absentList:[],
      dialogOpen:true,
      basicNotify:false,
      viewExamTimetable:[],
      dashboardDetails:[],
      TotalStudentCount:0,
      boardDetails:[],

    };

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


  handleStudentSearch = (val) => {
    this.setState({id_section:val.standard, selectedStudent:val.name, selectedStudentId: val.UID});
    this.getStandardSubjects(val.standard);
  }

  selectSubject = (idx,status) => {
    let data = this.state.standardSubjects;
    data[idx].checked = !status;
    this.setState({data});
  }

  getExamTimetable = () => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoardId,
      role_id:this.props.data.role_id,
      usertype:this.props.data.usertype,
      id_academicyear:this.state.selectedAcademicId,
    };
    new Service().apiCall('ExamsTimetable/getMainTimetableDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
        if(this.state.showStatus == 'all'){
            this.setState({examTimetableList:newArr});
        }
        else{
           var newArray = newArr.filter(x => x.status == this.state.showStatus);
           this.setState({examTimetableList:newArray});
        }

      }
    }).catch(error => {
      alert(error);

    });
  }

  viewExamTimetable = (id) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,   
    id_academicyear:this.state.selectedAcademicId, 
    id:id, 
    token:"abc",
    id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsTimetable/getExamWiseTimetableDetails',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false}));
           this.setState({viewExamTimetable:response.data});
      }
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    this.getExamTimetable();
  }

  render() {
    const width = window.innerWidth;
    const width100p =  width +"px";
    const width40p =  width * (40/100)+"px";

  return (
    <Fragment>
       {this.state.basicNotify}
     
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/online-exam")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              View Exam Timetable
            </Typography>
               </Grid>
            
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                 View Exams
                </h4>
              </div>

            </div>

    
     
    <ReactTable

data={
this.state.examTimetableList.map((original,key) => {
return ({
  id: key+1,
  id_exam:original.id,
  name: original.name,
  standards:original.standards,
  standard_details:original.standard_details,
  student_count:original.student_count,
  from_date:moment(original.from_date).format('DD/MM/YYYY'),
  to_date:moment(original.to_date).format('DD/MM/YYYY'),
  id_section:original.id_section,
  editable:original.editable,
  status:original.status,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }

                
                {/* use this button to remove the data row */}
                <Tooltip
                id="tooltip-top"
                title="View"
                placement="top"
                >
                <Button
                simple
                onClick={()=> {this.setState({viewExamTimetablePanel:true,selectedTimetableId:original.id}); this.viewExamTimetable(original.id)}} 
                color="success"
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
  Header: "Exam Name",
  accessor: "name",
  width: 90,
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Exam Name"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
  {
    Header: "Standards",
    accessor: "exam_name",
    className: "center",
    Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search Standards"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    ),
    Cell: row=>(
      <Chip clickable color="secondary"  onClick={()=>this.setState({selectedExamName:row.original.exam_name, viewMappedStandardPanel:true,  mappedExamStandards:row.original.standard_details})} size="small" variant="outlined" 
       label={row.original.standards} />
    )
    },
{
Header: "Students Count",
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
Header: "From Date",
accessor: "from_date",
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
Header: "To Date",
accessor: "to_date",
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
    {AuthHelper('Online Exam','can_export') && <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/ExamsTimetable/exportOnlineExamTimetable?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card></Grid> 
        </Grid>  

      </div>
      </Animated>     
      </Dialog>
      <Drawer

anchor="right"
open={this.state.examPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({examPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({examPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View Exam Timetable
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                 View Exams
                </h4>
              </div>

            </div>

    
     
    <ReactTable

data={
this.state.viewExamTimetable.map((original,key) => {
return ({
  id: key+1,
  index:key,
  name: original.subject_name,
  id_subject_master:original.id_subject_master,
  duration:original.duration,
  max_marks:original.max_marks,
  pass_marks:original.pass_marks,
  exam_date:original.exam_date,
  exam_time:original.exam_time,
  exam_quetions:original.exam_quetions,
  invigilator:original.invigilator
})
})
}
minRows={0}
columns={[
  {
    Header: "S No",
    accessor: "id",
    width: 80,
    className: "center",
    },
    {
    Header: "Subject",
    accessor: "id_subject_master",
    className: "center",
    },
    
    {
      Header: "Exam date",
      accessor: "exam_date",
      className: "center",
      },
      {
        Header: "Exam time",
        accessor: "exam_time",
        className: "center",
        },
     
    
        {
          Header: "Duration",
          accessor: "duration",
          className: "center",
          },
          {
            Header: "No of questions",
            accessor: "exam_quetions",
            className: "center",
            },
          {
            Header: "Max Marks",
            accessor: "max_marks",
            className: "center",
            },
            {
              Header: "Pass Marks",
              accessor: "pass_marks",
              className: "center",
              },
                {
                  Header: "Invigilator",
                  accessor: "invigilator",
                  className: "center",
                  }
  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions stats style={{marginTop:0}}>
    {AuthHelper('Online Exam','can_export') && <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/ExamsTimetable/exportOnlineExamTimetable?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card></Grid> 
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