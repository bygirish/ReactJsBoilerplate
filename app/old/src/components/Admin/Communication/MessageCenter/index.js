import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,Drawer,Box,Tooltip,Typography,AppBar,Toolbar,Card,CardActions,IconButton,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import moment from "moment";
import 'react-table-6/react-table.css';
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
      messageReceipntsData:[],
      messageData:[],
      boardDetails:[],
      messageHistoryDetails:[],
      sender_id:'ERELGO',
      SelectedMessageID:'',
      messageusedcount:0,
      totalmessagecount:0,
      balancemessagecount:0,
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
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

  getDashboardDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
      filter:[{"columname":"id_board","operator":"=","columnvalue":this.state.selectedBoard}]
    }
    new Service().apiCall('messageCenter/getDataMessageCenter',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          let data =  [];  
          response.data["messagedata"].forEach(element => {
            data.push({id:element.id, value:element.description});
        });
          this.setState({messageusedcount:response.data['messageusedcount'],totalmessagecount:response.data['totalmessage']?response.data['totalmessage']:0,balancemessagecount:response.data['balancemessage'],messageData: response.data["messagedata"], textSuggestions:data, loading:false});
        }
      }
      else{
        this.setState({messageData:[], loading:false});
      }
    }).catch(error => {
      this.showError(error.response.data)
    });

  }

  getMessageHistoryDetails() {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
      filter:[{"columname":"id_board","operator":"=","columnvalue":this.state.selectedBoard}]
    }
    new Service().apiCall('messageCenter/getDataMessageCenter',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
          let data =  [];  
          response.data["messagedata"].forEach(element => {
            data.push({id:element.id,value:element.description});
        });
          this.setState({messageusedcount:response.data['messageusedcount'],totalmessagecount:response.data['totalmessage'],balancemessagecount:response.data['balancemessage'],messageData: response.data["messagedata"], textSuggestions:data, loading:false});
        }
      }
      else{
        this.setState({messageData:[], loading:false});
      }
    }).catch(error => {
      alert("error");
    });
  }

  getDataMessageCenterWithId = (id) => {  
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
      token:"abc",
      id_user: this.props.data.UID,
      id:id,
      sender_id:this.state.sender_id,
    };
    new Service().apiCall('messageCenter/getDataMessageCenterWithId',postData).then(response => {
      
      if (response.status==200 && response.data!='') {
        this.setState({ messageReceipntsData: response.data });
        console.log(response.data)
      }
      else{
        this.setState({ messageReceipntsData:[] })
      }
    }).catch(error => {
      console.log(error);

    });
  }

  componentDidMount() {
    this.getDashboardDetails();
    this.getMessageHistoryDetails();
  }

  render() {
    const width = window.innerWidth;
  const width100p =  width +"px";
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Message Center"
        titleDescription=""
        {...this.props}
      /> 
      {/* <Grid container spacing={4}>
           <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.totalmessagecount}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Allocated Credits
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.messageusedcount}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Used Credits
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.balancemessagecount}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                  Balance Credits
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">

                  <Button variant="outlined"  className="successBtnOutline">Buy Now</Button>
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                 Additional Credits
                 
                  </div>
                </div>
              </div>
            </Grid>
      </Grid> */}

      {AuthHelper('Message Center','can_create') &&    <Grid container spacing={2} justify="center">
     
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/send-view-message")}>
          Send/View Message
          </Button>
        </Grid>
     
      </Grid>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Messages History
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.messageData.map((original,key) => {
        return ({
            slno: key+1,
            id:original.id,
            to: original.type+" , "+original.to,
            description:original.description,
            sent_date:original.date,
            sent_time:original.time,
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
              color="secondary"
              className="edit" 
              onClick={()=>{this.getDataMessageCenterWithId(original.id);this.setState({reportMessageCenterPanel:true, SelectedMessageID:original.id,messageDescription:original.description,messageSentDate:original.date,messageSentTime:original.time});}}
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
  Header: "Sent to",
  accessor: "to",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Sent To"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Message",
accessor: "description",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Message"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},

{
Header: "Sent Date & Time",
accessor: "sent_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Sent Date"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "No of Recipients",
  accessor: "recipients",
  show:false,
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
    {/* <Button   variant="outlined" color="secondary" href={Config.url+"Assignments/excelAssignment?id_section="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
        Export
        </Button> */}
        </Grid>
        </Grid>
  </CardActions>
        </Card>
        </Grid>          
        </Grid>

      </Animated>

      <Drawer

anchor="right"
open={this.state.reportMessageCenterPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({reportMessageCenterPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({reportMessageCenterPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Recipients List
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={8}>
          <Card className="card-box  mb-4 p-3">
            <Card className="card-box  mb-4 p-3">
             <Grid container>
               <Grid item xs={12} sm={12} md={8}>
                  {this.state.messageDescription}
               </Grid>
               <Grid item xs={12} sm={12} md={4} style={{textAlign:'center'}}>
                <p>Sent on: </p>
                <p style={{marginTop:'10px',marginBottom:'10px'}}>{this.state.messageSentDate}</p>
                <p>{this.state.messageSentTime}</p>
               </Grid>
             </Grid>
            </Card>
            <Card className="card-box  mb-4 p-3">
             <Grid container>
               <Grid item xs={12} sm={12} md={6} className="text-center">
               Recipients: <strong>{this.state.messageReceipntsData.length}</strong>
               </Grid>
               <Grid item xs={12} sm={12} md={6} className="text-center">
               {/* Credits consumed: <strong>400</strong> */}
               </Grid>
            </Grid>   

          </Card>
      </Card>
    </Grid>
</Grid>  
<Grid container spacing={4} justify="center">  
        <Grid item xs={12} md={8} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                Recipients List
                </h4>
              </div>
        </div>
        <ReactTable
    data={this.state.messageReceipntsData.map((original,key) => {
        return ({
          slno: key+1,
          name:original.name, 
          message: original.message,
          sent_to: original.sent_to,
          sent_date: original.sent_date+" "+original.sent_time,
          status:original.status,
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
placeholder="Search Message"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Contact Number",
accessor: "sent_to",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Contact Number"
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
  Header: "Delivered Date & Time",
  accessor: "sent_date",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Sent Date"
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
{AuthHelper('Message Center','can_export') &&  <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
    <Button   variant="outlined" color="secondary" href={Config.url+"MessageCenter/messageCenterReport?id="+this.state.SelectedMessageID+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard}>
        Export
        </Button>
        </Grid>
        </Grid>}
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
