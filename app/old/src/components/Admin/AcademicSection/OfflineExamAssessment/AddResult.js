import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,MenuItem,Box,Tabs,ButtonGroup,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from "prop-types";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import 'date-fns';
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

class Addresult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      loading:false,
      examList:[],
      subjectList:[],
      marksList:[],
      SelectedSectionsIds:'',
      SelectedDepartmentIds:'', 
      basicNotify:false,
      selectedStandardId: '',
      selectedExam:'',
      selectedSubject:'',
      selectedSection: '',
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = description => {
    this.setState({description})};
 

  onEditorStateUpdate = event_description => {
    this.setState({event_description})};
  

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  handleChangeState = (name,value) => {
    this.setState({ [name]: value });
  }

  handleSelecteSidebardSection = (id,name) => {
    this.setState({selectedStandardId:id, selectedSidebarSection:name,examList:[],subjectList:[],marksList:[] });
    this.getExamsList(id);
  }

  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.searchStudent && this.state.allStudents ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }

  getMarks = e => {
    e.preventDefault();
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:this.state.selectedStandardId,
      id_exam:this.state.selectedExam,
      id_subject:this.state.selectedSubject,
      type:"offline",
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ExamDetails/getExamResults',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ marksList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  }


  handleUpdateChange = (cellInfo, event, name) => {
    let data = [...this.state.marksList];
    data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
    this.setState({ data });
  };

  handleChangeState = (cellInfo, event, name) => {
    let data = [...this.state.marksList];
    data[cellInfo.index][name] = event.target.value.replace(/\D/g, "");
    this.setState({ data });
  };

  handleAbsent = (cellInfo) => {
    const status = this.state.marksList[cellInfo.index].status;
    let data = [...this.state.marksList];
    
    if(status == 1){
      data[cellInfo.index].marks = "AB";
      data[cellInfo.index].status = 0;
    }
    else{
      data[cellInfo.index].marks = "";
      data[cellInfo.index].status = 1;
    }
    
    this.setState({ data });
  };

  renderMarks = (cellInfo) => {
    const cellValue = this.state.marksList[cellInfo.index].marks;
    const status = this.state.marksList[cellInfo.index].status;
      return (
      <FormControl fullWidth>
        <TextField 
          disabled={status == 0 ? true:false}
          inputProps={{
           autoComplete: 'off'
           }} 
         onChange={(event)=>this.handleUpdateChange(cellInfo,event, "marks")}
         value={cellValue}
         label="Marks" 
         type="search" 
         variant="outlined" />
     
      </FormControl>
    );      
  } 


  renderAbsent = (cellInfo) => {
    const cellValue = this.state.marksList[cellInfo.index].max_marks;
    const status = this.state.marksList[cellInfo.index].status;

      return (
        <FormControlLabel
        control={
          <Switch
            
            checked={status == 1 ? true:false}
            onChange={() => this.handleAbsent(cellInfo)}
            value="checkedA"
          
          />
        }
      
        label=""
      />
    );      
  
  };

  handleChangeType = (cellInfo, event,id, name) => {
    let data = [...this.state.timetableData];
    data[cellInfo.index][name] = id;
    this.setState({ data });
  };

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
        className="my-2"
        inputRef={this.textInput} 
        variant="outlined" 
     />
     </FormControl>
    )
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

insertMarks = () => {
  
  const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    id_board:this.state.selectedBoardId,
    id_academicyear:this.state.selectedAcademicYear,
    marks:this.state.marksList,
    token:"abc",
    role_id: this.props.data.role_id,
    id_user: this.props.data.UID,
  };
  new Service().apiCall('ExamDetails/insertExamResults',postData).then(response => {
    console.log()
    if (response.status==200 && response.data!='') {
      this.setState({
        basicNotify: (
          <Dialog open={true}>
  <div className="text-center p-5">
    <h4 className="font-weight-bold">Marks  Inserted</h4>
  </div>
</Dialog>
        ),
      });
     // this.getSettings();
      setTimeout(() => {
      window.location.reload()
      }, 2000) 
    }
  }).catch(error => {
    this.showError(error.response.data)
  });
}

  getExamsList(id_section) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      type:"offline",
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    new Service().apiCall('ExamDetails/getExamStandardWiseDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({ examList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
   
  } 

  getExamSubjects(id_section, id_exam) {
    this.setState({subjectList:[]})
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_section:id_section,
      id_exam:id_exam,
      token:"abc",
      role_id: this.props.data.role_id,    
      id_user: this.props.data.UID
    }
    //console.log(postData);return false;
    new Service().apiCall('ExamDetails/getExamSubjectDetails',postData).then(response => {
      console.log('subject'+response)
      if (response.status==200 && response.data!='') {
          this.setState({ subjectList:response.data})
      }
    }).catch(error => {
     // this.showError(error.response.data)
     console.log(error)
  
    });
  
  } 

  componentDidMount() {

  }

render(){
  const width = window.innerWidth;
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
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/offline-exam-assessment")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
            Add Result
            </Typography>
               </Grid>
       
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

      <Grid container  justify={this.props.data.usertype == "admin" ? "none" : "center"}>
      {this.props.data.usertype == "admin" &&  <Grid item xs={12} md={8} lg={3}>
      <Card className="card-box ml-4 mb-4">
        <div className="text-center">
       {this.sidebarStandardSections()}
       </div>
       </Card>
      </Grid>}
      <Grid item xs={12} md={8} lg={9}>
      <Grid container  justify="center">
       <Grid item xs={12} md={8} lg={10}>
       {this.props.data.usertype == "admin" && <div>

      <Grid container  justify="center">
      <Grid item xs={12} sm={12} lg={10}>
      <Card className="card-box  mb-4 p-3">
      <form
        onSubmit={this.getMarks.bind(this)}
        autoComplete="off">
         <Grid container  justify="center">
          <Grid item xs={12} sm={12} lg={4}>
          <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="staff-list"
                    select
                    required
                    // SelectProps={{ 
                    //   native: true
                    // }}
                    label="Select Exam"
                    value={this.state.selectedExam}
                    onChange={(event,child)=>{this.setState({selectedExam:child.props.id, marksList:[]}); this.getExamSubjects(this.state.selectedStandardId,child.props.id)}}
                    variant="outlined">
                    {this.state.examList && this.state.examList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                    
                  </TextField>
        </FormControl>
          </Grid>  
          <Grid item xs={12} sm={12} lg={4}>
               <FormControl fullWidth>
                 <TextField
                    className="m-2"
                    id="staff-list"
                    select
                    required={true}
                    isRequired="true"
                    label="Select Subject"
                    value={this.state.selectedSubject}
                    onChange={(event,child)=>    this.setState({selectedSubject:child.props.id, selectedSubjectName:child.props.name, marksList:[]})}
                    variant="outlined">
                    {this.state.subjectList && this.state.subjectList.map(option => (
                      <MenuItem key={option.id} name={option.name} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} lg={2} className="m-2">
              <Button color="primary" variant="outlined" type="submit">Submit</Button>
          </Grid>
         </Grid> 
         </form> 
      </Card>
      </Grid>
      </Grid>  

   {this.state.marksList.length > 0  &&  <Grid container  justify="center">
       <Grid item xs={12} sm={12} lg={10} >
        <Card className="card-box  mb-4 p-3 customNoData customPadding">
 
    <ReactTable

data={
  this.state.marksList.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  name: original.name,
  marks: original.marks,
  status:original.status
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
    id="sno"   
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
    id="exam-name"   
    value={filter ? filter.value : ''}
    placeholder={"Search Exam"}
    type="text" 
    onChange={event => onChange(event.target.value)}
    />
      )
    },
{
  Header: this.state.selectedSubjectName,
  accessor: "marks",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="exam-name"   
value={filter ? filter.value : ''}
placeholder={"Search Exam"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderMarks
},
  {
    Header: "Absent",
    accessor: "status",
    className: "center",
    Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="staff-name"   
  value={filter ? filter.value : ''}
  placeholder="Search Staff"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
    ),
    Cell:this.renderAbsent
    }

]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={this.state.marksList.length}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    <Grid container>
      <Grid item xs={12} md={12} lg={12} className="text-right">
        <Button className="successBtnOutline" onClick={()=>this.insertMarks()}>
        Submit
        </Button> 
        </Grid>
        </Grid>
  </CardActions>

        </Card>
        </Grid>
       </Grid>}
       </div>
              }

          </Grid>
          </Grid> 
      </Grid>
      </Grid>  

</div>
</Animated>
</Dialog>


    </Fragment>
  );
};

}
Addresult.propTypes = {
  classes: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToPros)(Addresult);
