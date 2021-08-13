import React, { Fragment } from 'react';
import clsx from 'clsx';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {FormControlLabel,Grid,Drawer,Box,Dialog,Typography,AppBar,Toolbar,Card,CardActions,IconButton,TextField,Button,Radio,List,ListItem,Divider,CardContent,Checkbox} from '@material-ui/core';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { PageTitle } from '../../../layout-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseIcon from '@material-ui/icons/Close';
import StandardSectionsList from "../../../layout-components/CustomComponents/StandardSectionsList.js";
import ShowError from "../../../layout-components/CustomComponents/ShowError.js";
import PerfectScrollbar from 'react-perfect-scrollbar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';   
import { withRouter } from 'react-router-dom';
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import ReactTable from 'react-table-6';
import moment from "moment";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import 'react-table-6/react-table.css';
import Config from '../../../config';

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: '#eaf6ff'
    }
  });



const locales = {
  'en-US': require('date-fns/locale/en-US')
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const now = new Date();

class EventsCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events:[],
      roleData:[],
      selectedStandards:[],
      startdate: new Date(),
      enddate:  new Date(),
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
    };

  }

  showError = (error,status) => {
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
         if(status == 401){
          this.props.removeUserData();
          this.props.history.push("/login");
        }
       }, 2000)
    }

  getEventDetails(id_section,type,id_dept){
    const postData = { 
      id_section:id_section,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      role_id: this.props.data.role_id,
      id_dept:id_dept
    };
    console.log(postData)
    new Service().apiCall('EventDetails/getEventDetails',postData).then(response => {
      console.log('EventDetails  '+response)
      if (response.status==200 && response.data!='') {
        let data = [];
        response.data.map(element =>{
      
          let start = element.start_date.replaceAll("-", ","); 
          let end = element.end_date.replaceAll("-", ","); 
          data.push({id:element.id,title:element.title,start_date:element.start_date,end_date:element.end_date,start:start,end:end, staff_applicable:element.staff_applicable, student_applicable:element.student_applicable, event_description:element.description})
        })
        this.setState({ events: data });
      }else{
        this.setState({ events: [] });
      }
    }).catch(error => {
      if(error.response.status == 500 && error.response.data!=""){
        this.showError(error.response.data,error.response.status)
      }
      else if(error.response.status == 401){
        this.showError('Invalid Auth token. Redirecting to login',error.response.status)
      }
      
    });
    
  }

  getRoleData(selectedDepartment) {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('StaffDetails/getRoleData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        let depatmentDetails = response.data;
        var lDepartments = []; 
        depatmentDetails.forEach(element => {
          var lDepartment = {};
          lDepartment.id = element.id;
          lDepartment.name = element.name;
          lDepartment.status = element.status;
          lDepartment.checked = element.checked;
          if (selectedDepartment && selectedDepartment.includes(element.id)) {
            lDepartment.checked = true;
          }
          lDepartments.push(lDepartment);
        })
        if(response.data){
          this.setState({ roleData: lDepartments });
        }
  
      }
    }).catch(error => {
    console.log(error);
  
    });
  
  } 

  renderDepartmentsCheckBox = (element,index,checked) =>{   
    const { classes } = this.props;
    return <div>
        <Grid container>
            <Grid item xs={12} sm={6} md={3} lg={12}>
         <FormControlLabel
         control={
           <Checkbox
             disabled
             tabIndex={-1}
             onClick={() => this.handleDepartment(element.id,index,element.checked)}
             checked={element.checked}
           />
         }
         label= {element.name} 
       />
          </Grid>
      </Grid>
      </div>
  }

  getEventInfo = (event) => {
    this.setState({editEventPanel:true,title:event.title, startdate:new Date(event.start_date),enddate:new Date(event.end_date),staff_depts:event.staff_applicable,student_standards:event.student_applicable, id_event:event.id,event_description:event.event_description})
    this.getRoleData(event.staff_applicable);
  }

  componentDidMount() {
    if(this.props.data.usertype == "student"){
      this.getEventDetails(this.props.data.standard,'student','');
    }
    if(this.props.data.usertype == "staff"){
      this.getEventDetails('','staff','');
    }
    else{
      this.getEventDetails();
    }

  }

  render() {
    const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Events Calendar"
        titleDescription=""
        {...this.props}
      /> 
   

   <div className="app-inner-content-layout--main bg-white p-0 card-box">
          <div className="app-inner-content-layout--main__header rounded-0 card-header bg-white p-4 border-bottom">
          </div>
          <PerfectScrollbar>
            <div className="p-4">
    <Calendar
      popup
      localizer={localizer}
      views={allViews}
      step={60}
      showMultiDayTimes
      defaultDate={new Date()}
      components={{
        timeSlotWrapper: ColoredDateCellWrapper,
      }}
      events={this.state.events}
      startAccessor="start"
      endAccessor="end"
      onSelectEvent={(event) => this.getEventInfo(event)}
      style={{ minHeight: 650 }}
    />
    </div>
     </PerfectScrollbar>
        </div>



      <Drawer

anchor="right"
open={this.state.editEventPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({editEventPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({editEventPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  View Event
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container spacing={4} justify="center">
<Grid item xs={12} md={10} lg={12}>



<Card className="card-box my-3 p-3">
<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1">
  <strong>Title</strong> : {this.state.title}
</Grid>
</Grid>
</Card>

<Card className="card-box my-3 p-3">
<Grid container spacing={2}>
<Grid item xs={12} lg={6} className="py-1">
  <strong>Start date</strong> : {moment(this.state.startdate).format("DD/MM/YYYY")}
</Grid>
<Grid item xs={12} lg={6} className="py-1">
<strong>End date</strong> : {moment(this.state.enddate).format("DD/MM/YYYY")}
</Grid>
</Grid>
</Card>

<Card className="card-box my-3 p-3">
<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1">

  <strong>Description</strong> : {this.state.event_description}
</Grid>
</Grid>
</Card>

<Card className="card-box my-3 p-3">
<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1">
<h4 className="font-size-lg mb-0 py-3 pl-3 font-weight-bold">
        Applicable To:
      </h4>
</Grid>
</Grid>

<Grid container spacing={2}>
<Grid item xs={12} lg={12} className="py-1 pl-4">
<FormControlLabel
            control={
              <Checkbox
              disabled
                tabIndex={-1}
                checked={this.state.allDepartments}
                onClick={() => {this.handleAllDepartment(this.state.allDepartments);}}
               
               
              />
            }
           
            label="All Staff"
          />
</Grid>
<Grid item xs={12} lg={12} className="py-1 pl-4">
{this.state.roleData.length>0 && this.state.roleData.map((element, index) => {
             if(this.state.allDepartments)
                return this.renderDepartmentsCheckBox(element,index,true);
               else 
                 return this.renderDepartmentsCheckBox(element,index,false);  
        })}
</Grid>
<Divider />
<Grid item xs={12} lg={12} className="py-1">
<StandardSectionsList
board_id={this.props.data.selectedBoardId}
label={"All Students"}
type="checkbox"
disable={true}
mappedstandards={this.state.selectedStandards}
selectedSections={this.state.student_standards}
academic_id={this.props.data.selectedAcademicId}
onSelected={this.handleStandardSelected}
{...this.props} 
/>
</Grid>
</Grid>


</Card>
</Grid>  

</Grid>  

</div>
</PerfectScrollbar>
</Box>
</Drawer>
</Animated>
    </Fragment>
  );
}
}



export default connect(mapStateToProps, mapDispatchToPros)(withRouter(EventsCalendar));
