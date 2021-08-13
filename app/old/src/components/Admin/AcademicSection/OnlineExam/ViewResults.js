import React, { Fragment, createRef } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
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
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
import Config from '../../../../config';
import DateFnsUtils from '@date-io/date-fns';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
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
      studentsData:[],
      allStudents:[],
      standardsList:[],
      filteredResult:[],
      dashboardDetails:[],
      questionWiseReport:[],
      TotalStudentCount:0,
      boardDetails:[],

    };

  }

  
  getSectionInfo = (id) => {

    let standards = this.state.standardsList;
    let data = "";
    standards.forEach(element => {
      if (element.section_id === id) {
        data = element.section_name+" "+element.standard_name_text;
      }
  });
  return data;
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

    getStudentName = (id) => {

      let students = this.state.allStudents;
      let data = "";
      students.forEach(element => {
        if (element.student_UID == id) {
          data = element.name;
        }
    });
    return data;
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
      publish_type:1,
      id_user: this.props.data.UID,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
    };
    new Service().apiCall('ExamsTimetable/getExamWiseTimetableDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        
          const result = response.data.filter(item => item.student_appeared === 1);
          console.log(result);
           this.setState({examTimetableList:result, filteredResult:result});
      }
    }).catch(error => {
      alert(error);

    });
  }

  getStudentDetails = (id, id_subject, id_section) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,   
      id_academicyear:this.state.selectedAcademicId, 
      id_timetable:id, 
      id_timetable_subject:id_subject,
      type:"examwisemain1",
      token:"abc",
      id_user: this.props.data.UID, 
      id_section:id_section,
    };
    new Service().apiCall('ExamsOnline/getStudentResultRecord',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
       console.log(response.data);
        const studentsList = response.data.map((data) => {
          return {...data, checked: false};
      });
      this.setState({ studentsData: studentsList}); 
      }
      else{
        this.setState({  studentsData: []});
      }
    }).catch(error => {
      console.log(error);
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

  questionWiseReport = (uid) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,   
      id_academicyear:this.state.selectedAcademicId, 
      id_exam:this.state.id_exam,
      id_examtimetable:this.state.id_timetable, 
      id_examtimetable_subject:this.state.id_timetable_subject,
      token:"abc",
      UID: uid.toString(), 
      id_user: this.props.data.UID, 
      id_section:this.state.id_section,
    };
    //console.log(postData);return false;
    new Service().apiCall('ExamsOnlineReports/getOnlineExamsSubjectStandardReport',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
       console.log(response.data);
      
      this.setState({ questionWiseReport: response.data}); 
      }
      else{
        this.setState({  questionWiseReport: []});
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
              View Exam Results
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
this.state.filteredResult.map((original,key) => {
return ({
  id: key+1,
  id_exam:original.id,
  id_timetable:original.id_timetable,
  id_timetable_subject:original.id_subject_master,
  name: original.exam_name,
  standards:original.standards,
  standard_details:original.standard_details,
  student_count:original.student_count,
  exam_date:moment(original.exam_date).format('DD/MM/YYYY'),
  exam_time:moment(original.exam_date+" "+original.exam_time).format('hh:ss A'),
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
                onClick={()=>  {this.setState({selectedExam:original.exam_name, id_exam:original.id_exam, id_timetable:original.id_timetable, id_timetable_subject:original.id, id_exam:original.id_exam,id_section:original.id_section, viewClassWiseExams:true }); this.getStudentDetails(original.id_timetable, original.id, original.id_section)}}
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
    Header: "Standard",
    accessor: "id_section",
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
    ),
    Cell: row=>(
      <div>{ this.getSectionInfo(row.original.id_section)}</div>
    )
    },

{
Header: "Exam Date",
accessor: "exam_date",
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
Header: "Exam Time",
accessor: "exam_time",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Time"
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
    {/* {AuthHelper('Online Exam','can_export') && <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"/ExamsTimetable/exportOnlineExamTimetable?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid>
        </Grid>} */}
  </CardActions>

        </Card></Grid> 
        </Grid>  

      </div>
      </Animated>     
      </Dialog>
      <Drawer

anchor="right"
open={this.state.viewClassWiseExams}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewClassWiseExams:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewClassWiseExams:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {this.state.selectedExam}
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
                Students List
                </h4>
              </div>

            </div>

    
     
    <ReactTable

data={
this.state.studentsData.map((original,key) => {
return ({
  id: key+1,
            uid:original.UID,
            key:key,
            name: original.name,
            max_score:original.max_score,
            scored:original.scored,
            negative_marking:original.negative_marking,
            std_section:original.student_standard_division,
            standard:original.standard,
            actions: (
              // we've added some custom button actions
              <div className="grouplist-actions">
                { /* use this button to add a like kind of action */ }
                <Tooltip
          id="tooltip-top"
          title="View"
          placement="top"
          >
          <Button
                            simple
                            onClick={()=>  {this.setState({questionWisePanel:true,selectedUID:original.UID}); this.questionWiseReport(original.UID)}}
                            color="success"
                            className="edit"
                          >
                            <ViewIcon  />
                          </Button>
          </Tooltip>
                          
                          {/* use this button to remove the data row */}           
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
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="S No"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
    )
    },
    {
      Header: "UID",
      accessor: "uid",
      width: 90,
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search UID"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
      },
      {
        Header: "Student Name",
        accessor: "std_section",
        width: 90,
        className: "center",
        Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search UID"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
        ),
        Cell: row => (
          <div>{this.getStudentName(row.original.uid)}</div>
        )
        },
        {
          Header: "Max Marks",
          accessor: "max_score",
          width: 90,
          className: "center",
          Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Marks"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
          )
          },
          {
            Header: "Scored",
            accessor: "scored",
            width: 90,
            className: "center",
            Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Scored"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
            )
            },
            {
              Header: "Actions",
              accessor: "actions",
              width:125,
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
</PerfectScrollbar>
</Box>
</Drawer>


<Drawer

anchor="right"
open={this.state.questionWisePanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({questionWisePanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({questionWisePanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {this.state.selectedExam}
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
                Questions List
                </h4>
              </div>

            </div>

    
     
    <ReactTable

data={
this.state.questionWiseReport.map((original,key) => {
return ({
            id: key+1,
            uid:original.UID,
            key:key,
            right:original.key,
            given: original.answer,
            id_question:original.id_question,
            marks: original.marks_scored
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
      Header: "Question ID",
      accessor: "id_question",
      width: 90,
      className: "center",
      Filter: ({filter, onChange}) => (
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}         
    id="document-type"   
    value={filter ? filter.value : ''}
    placeholder="Search ID"
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
      },
      {
        Header: "Subject",
        accessor: "uid",
        width: 90,
        className: "center",
        Filter: ({filter, onChange}) => (
      <TextField 
      inputProps={{
      autoComplete: 'off'
      }}         
      id="document-type"   
      value={filter ? filter.value : ''}
      placeholder="Search Subject"
      type="text" 
      onChange={event => onChange(event.target.value)}
      />
        ),
        Cell: row => (
          <div>{this.getStudentName(row.original.uid)}</div>
        )
        },
        {
          Header: "Answer",
          accessor: "given",
          width: 90,
          className: "center",
          Filter: ({filter, onChange}) => (
        <TextField 
        inputProps={{
        autoComplete: 'off'
        }}         
        id="document-type"   
        value={filter ? filter.value : ''}
        placeholder="Search Answer"
        type="text" 
        onChange={event => onChange(event.target.value)}
        />
          )
          },
          {
            Header: "Key",
            accessor: "right",
            width: 90,
            className: "center",
            Filter: ({filter, onChange}) => (
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={filter ? filter.value : ''}
          placeholder="Search Key"
          type="text" 
          onChange={event => onChange(event.target.value)}
          />
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
