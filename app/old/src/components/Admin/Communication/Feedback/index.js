import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PageTitle } from '../../../../layout-components';
import {Dialog,Grid,CardContent,Box,Tooltip,Typography,AppBar,Toolbar,Card,CardActions,IconButton,TextField,Button,FormControl,MenuItem,List,ListItem,Slide,ButtonGroup,Chip,Drawer} from '@material-ui/core';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '@utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import moment from "moment";
import 'react-table-6/react-table.css';
import Config from '../../../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails:[],
      fileUploadState:"",
      visibility:'none',
      statusText:'Feedback Received - All',
      feedbacksData:[],
      tableData:[],
      openfeedbacksData:[],
      closedfeedbacksData:[],
      filterfeedbacksData:[],
      noteDetails:[],
       allStatus:true,
       severityArr:['High','Moderate','Low'],
       caseid:'',
       openStatus:'',
       viewType:'',
       closedStatus:'',
       feedback_description:'',
       selectedFileName:null,
       path:'',
       closefeedback:0,
       severity:'',
       subject:'',
       feedback_description: EditorState.createEmpty(),
       reply_content: EditorState.createEmpty(),
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
    };

  }

  getFeedbackNoteDetails(id) {
    const postData = {
      id:id,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_academicyear:2,
      token:"abc",
      id_user: this.props.data.UID  
    };
    new Service().apiCall('feedbacks/getNoteData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        console.log(response)
        this.setState({ noteDetails:response.data,notestatus:1, loading:false});
      }else{
        this.setState({ noteDetails:[], loading:false});
      }
    }).catch(error => {
      console.log(error);

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

    getFeedbackDashboardDetails() {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.state.selectedAcademicYear,
        token:"abc",
        id_user: this.props.data.UID
      };
      new Service().apiCall('feedbacks/getFeedbackDashboardDetails',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ dashboardDetails:response.data,allStatus:true, loading:false});
        }
        else{
          this.setState({loading:false})
        }
      }).catch(error => {
        console.log(error);
  
      });
  
    }

    handleFeedbackNote(id,statetype){
      const lUserData = this.props.data;
      let data = new FormData();
      let formData = new FormData();
      formData.append('id',id);
      formData.append('statetype',statetype);
      formData.append('note',this.state.reply_content.getCurrentContent().getPlainText());
      formData.append('path',this.state.selectedFile);
      formData.append('requestname','insert_note');
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedInstitutionId);
      formData.append('token','abc');
      formData.append('id_user',this.props.data.UID);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
    
      new Service().apiCall('feedbacks/insertNote', formData,
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
        <h4 className="font-weight-bold">Feedback Note Inserted</h4>
      </div>
    </Dialog>
            ),
          });
          this.getFeedBackData();
          this.getFeedbackNoteDetails(id);
          setTimeout(() => {
            this.setState({ basicNotify:null, replyPanel:false});
          }, 2000)
         
        } else {
          this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
        this.raiseLoginSignupErrorAlert("signup");
  
      });
    }

    handleCloseFeedback(id){
      const lUserData = this.props.data;
      let data = new FormData();
      const postData = {
        id:id,
        created_by: lUserData.UID, 
        requestname: "close_feedback",
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
        id_academicyear:2
      };
      new Service().apiCall('feedbacks/closeFeedback', postData,
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
              <h4 className="font-weight-bold">Feedback Closed</h4>
              </div>
              </Dialog>
            ),
          });
          this.getFeedBackData();
          this.getFeedbackDashboardDetails();
          setTimeout(() => {
            this.setState({ alert:null});
             window.location.reload()
          }, 2000)
         
        } else {
         // this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
       console.log(error);
  
      });
    }

    insertFeedback(){
      let data = new FormData();
      let formData = new FormData();
      formData.append('type',this.state.supportType);
      formData.append('module',this.state.selectedModule);
      formData.append('severity',this.state.severity);
      formData.append('subject',this.state.subject);
      formData.append('description',this.state.feedback_description.getCurrentContent().getPlainText());
      formData.append('path',this.state.selectedFile);
      formData.append('requestname',"insert_note");
      formData.append('id_organization',this.props.data.selectedOrganizationId);
      formData.append('id_institute',this.props.data.selectedOrganizationId);
      formData.append('token',"abc");
      formData.append('id_user',this.props.data.UID);
      formData.append('id_academicyear',this.state.selectedAcademicYear);
      new Service().apiCall('feedbacks/insertFeedback', formData,
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
        <h4 className="font-weight-bold">Feedback Inserted</h4>
      </div>
    </Dialog>
            ),
          });

          setTimeout(() => {
            window.location.reload()
          }, 2000)
         
        } else {
        //  this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
       console.log(error);
      });
    }

    getModuleDetails() {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_academicyear:this.state.selectedAcademicYear,
        id_board:this.props.data.selectedBoardId,
        token:"abc",
        id_user: this.props.data.UID  
      };
      console.log(postData);
      new Service().apiCall('ModulesChecklist/getData',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ modulesList:response.data});
        }else{
          this.setState({ modulesList:[]});
        }
      }).catch(error => {
        console.log(error);
  
      });
  
    }
    filterRecords = (type, status)=>{
      let feedback = this.state.feedbacksData;
     let filterData =  feedback.filter(v=> v.type == type && v.statusdata == status);
      this.setState({tableData:filterData});
    }

    handleImageChange = event => {
      this.setState({
        selectedFile: event.target.files[0],
        selectedFileName: event.target.files[0].name
      })
      let reader = new FileReader();
       
      reader.onloadend = () => {
        this.setState({
          imagePreviewUrl: reader.result
        });
      }
      reader.readAsDataURL(event.target.files[0])
    };
  
    handleClick = () => {
      fileInput.current.click();
    };

    getFeedBackData() {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:2,
        token:"abc",
        id_user: this.props.data.UID
      };
      new Service().apiCall('feedbacks/get_data',postData).then(response => {
        if (response.status==200 && response.data!='') {
          var lFeedbacks = [];
          var lOpenedFeedbacks = [];
          var lClosedFeedbacks = [];
          response.data.forEach(element => {
                    var lFeedback = {};
                    var lOpenedFeedback = {};
                    var lClosedFeedback = {};
                    lFeedback.id                 = element.id;
                    lFeedback.type               = element.type;
                    lFeedback.created_on         = element.created_on;
                    lFeedback.created             = element.created_on;
                    lFeedback.subject            = element.subject;
                    lFeedback.description        = element.description;
                    lFeedback.aging              = element.aging;
                    if(element.status=='1'){
                      lFeedback.statusdata = 'Open';
                      lOpenedFeedback.id                 = element.id;
                      lOpenedFeedback.type               = element.type;
                      lOpenedFeedback.created_on          = element.created_on;
                      lOpenedFeedback.created             = element.created_on;
                      lOpenedFeedback.subject             = element.subject;
                      lOpenedFeedback.description         = element.description;
                      lOpenedFeedback.aging               = element.aging;
                      lOpenedFeedback.statusdata = 'Open';
                      lOpenedFeedbacks.push(lOpenedFeedback);
                    }else if(element.status=='0'){
                      lFeedback.statusdata = 'Close';
                      lClosedFeedback.id                 = element.id;
                      lClosedFeedback.type               = element.type;
                      lClosedFeedback.created_on          = element.created_on;
                      lClosedFeedback.created              = element.created_on;
                      lClosedFeedback.subject             = element.subject;
                      lClosedFeedback.description         = element.description;
                      lClosedFeedback.aging               = element.aging;
                      lClosedFeedback.statusdata = 'Close';
                      lClosedFeedbacks.push(lClosedFeedback);
                    }
                    lFeedbacks.push(lFeedback);
                });
          this.setState({ tableData:lFeedbacks,feedbacksData:lFeedbacks,openfeedbacksData:lOpenedFeedbacks,closedfeedbacksData:lClosedFeedbacks});
        }else{
          this.setState({tableData:[]});
        }
      }).catch(error => {
        console.log(error);
  
      });
  
    }

    onEditorStateChange = feedback_description => {
      this.setState({feedback_description})};

      onEditorReplyStateChange = reply_content => {
        this.setState({reply_content})};

    searchModule = (event, values) => {
      if(values){
        this.setState({ selectedModule:values.name});
      }
    }

    errorDialog = () => {
      this.setState({
        basicNotify: (
      <Dialog open={true}>
      <div className="text-center p-5">
        <div className="avatar-icon-wrapper rounded-circle m-0">
          <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130">
            <FontAwesomeIcon
              icon={['fas', 'times']}
              className="d-flex align-self-center display-3"
            />
          </div>
        </div>
        <h4 className="font-weight-bold mt-4">
          Are you sure you want to close feedback?
        </h4>
        <div className="pt-4">
          <Button
            onClick={()=>this.setState({basicNotify:false})}
            variant="outlined"
            color="secondary"
            className="mx-1">
            <span className="btn-wrapper--label">Cancel</span>
          </Button>
          <Button
            onClick={()=>this.handleCloseFeedback(this.state.caseid)}
            color="primary"
            variant="contained"
            className="mx-1">
            <span className="btn-wrapper--label">Close</span>
          </Button>
        </div>
      </div>
    </Dialog>
        ),
      });
    }

  componentDidMount() {
      this.getFeedbackDashboardDetails();
      this.getModuleDetails();
      this.getFeedBackData();
  }

  render() {
    const width = window.innerWidth;
  const width100p =  width +"px";
  const width40p =  width * (40/100)+"px";
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Feedback"
        titleDescription=""
        {...this.props}
      /> 


<Grid container spacing={4} justify="center">
    <Grid item xs={12} lg={10}>
    <Grid container spacing={4} justify="center">
        <Grid item xs={12} lg={6}>
          <Card className=" mb-4">
            <div className="card-header bg-white pr-1 pt-3">
              <div className="text-center">
                <h6 className="font-weight-bold font-size-lg mb-1 text-black">
                Technical Feedback
                </h6>
              </div>
            </div>
            <div className="divider" />
            <List>
              <ListItem className="py-4 d-block">
              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                <div className="text-center pr-3 pl-3 cursor-pointer">
                      <span className={this.state.viewType == 'technical_open'?"font-weight-bold font-size-lg text-danger":"font-weight-bold font-size-lg text-black"} onClick={()=>{this.filterRecords('Technical','Open'); this.setState({viewType:'technical_open', statusText:'Technical Feedback - Open'})}}>
                      {this.state.dashboardDetails.technicalopen}
                      </span>
                      <span  onClick={()=>{this.filterRecords('Technical','Open'); this.setState({viewType:'technical_open', statusText:'Technical Feedback - Open'})}} className={this.state.viewType == 'technical_open'?"d-block text-danger":"d-block text-black-50"}>open</span>
                </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                <div className="text-center pr-3 pl-3 cursor-pointer">
                <span  className={this.state.viewType == 'technical_closed'?"font-weight-bold font-size-lg text-success":"font-weight-bold font-size-lg text-black"} onClick={()=>{this.filterRecords('Technical','Close');this.setState({viewType:'technical_closed', statusText:'Technical Feedback - Closed'})}}>
                      {this.state.dashboardDetails.technicalclosed}
                      </span>
                      <span  onClick={()=>{this.filterRecords('Technical','Close');this.setState({viewType:'technical_closed', statusText:'Technical Feedback - Closed'})}} className={this.state.viewType == 'technical_closed'?"d-block text-success":"d-block text-black-50"}>closed</span>
                </div>
                </Grid>
              </Grid>    
              </ListItem>
            </List>
            <div className="divider" />
            <div className="card-footer d-flex justify-content-between">
                <span onClick={()=> this.setState({createFeedback:true,supportType:'Technical'})}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Create Feedback
                </span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card className=" mb-4">
            <div className="card-header bg-white pr-1 pt-3">
              <div className="text-center">
                <h6 className="font-weight-bold font-size-lg mb-1 text-black">
                General Feedback
                </h6>
              </div>
            </div>
            <div className="divider" />
            <List>
              <ListItem className="py-4 d-block">
              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                <div className="text-center pr-3 pl-3 cursor-pointer">
                      <span className={this.state.viewType == 'general_open'?"font-weight-bold font-size-lg text-danger":"font-weight-bold font-size-lg text-black"} onClick={()=>{this.filterRecords('General','Open'); this.setState({viewType:'general_open', statusText:'General Feedback - Open'})}}>
                      {this.state.dashboardDetails.generalopen}
                      </span>
                      <span  onClick={()=>{this.filterRecords('General','Open'); this.setState({viewType:'general_open', statusText:'General Feedback - Open'})}} className={this.state.viewType == 'general_open'?"d-block text-danger":" d-block text-black-50"}>open</span>
                </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                <div className="text-center pr-3 pl-3 cursor-pointer">
                <span  className={this.state.viewType == 'general_closed'?"font-weight-bold font-size-lg text-success":"font-weight-bold font-size-lg text-black"} onClick={()=>{this.filterRecords('General','Close');this.setState({viewType:'general_closed', statusText:'General Feedback - Closed'})}}>
                      {this.state.dashboardDetails.technicalclosed}
                      </span>
                      <span  onClick={()=>{this.filterRecords('General','Close');this.setState({viewType:'general_closed', statusText:'General Feedback - Closed'})}} className={this.state.viewType == 'general_closed'?" d-block text-success":" d-block text-black-50"}>closed</span>
                </div>
                </Grid>
              </Grid>    
              </ListItem>
            </List>
            <div className="divider" />
            <div className="card-footer d-flex justify-content-between">
                <span onClick={()=> this.setState({createFeedback:true,supportType:'General'})}
                  className="font-size-sm text-black-50 px-2 cursor"
                  title="Total downloads">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} className="mr-1" />
                  Create Feedback
                </span>
            </div>
          </Card>
        </Grid>
        </Grid>
        </Grid>
        </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={1}></Grid>    
        <Grid item xs={12} md={8} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                {this.state.statusText}
                </h4>
                </div>
                <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={(this.state.allStatus && this.state.viewType=='') ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => this.setState({openStatus:false, allStatus:true,closedStatus:false,tableData:this.state.feedbacksData, viewType:'', statusText:'Feedback Received - All'})}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={(this.state.openStatus || this.state.viewType == 'technical_open' || this.state.viewType == 'general_open') ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => this.setState({openStatus:true, allStatus:false,closedStatus:false,tableData:this.state.openfeedbacksData, viewType:'',statusText:'Feedback Received - Open'})}>
                  Open
                </Button>
                <Button color="secondary" size="small" variant={(this.state.closedStatus || this.state.viewType == 'technical_closed' || this.state.viewType == 'general_closed') ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => this.setState({openStatus:false, allStatus:false,closedStatus:true,tableData:this.state.closedfeedbacksData, viewType:'',statusText:'Feedback Received - Closed'})}>
                  Closed
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
        </div>
        <ReactTable
    data={this.state.tableData.map((original,key) => {
        return ({
          slno: key+1,
            id: original.id,
            type: original.type,
            created_on:moment(original.created_on).format('DD/MM/YYYY'),
            created:original.created,
            subject:original.subject,
            description:original.description,
            created_by:original.created_by,
            status:original.statusdata,
            editable:original.editable,
            aging:original.aging,
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
id="sno"   
value={filter ? filter.value : ''}
placeholder="Search S No"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Case ID",
  accessor: "id",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="case-id"   
value={filter ? filter.value : ''}
placeholder="Search Case ID"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },
{
Header: "Type",
accessor: "type",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="type"   
value={filter ? filter.value : ''}
placeholder="Search Type"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Created Date",
  accessor: "created_on",
  className: "center",
  Filter: ({filter, onChange}) => (
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}         
  id="date"   
  value={filter ? filter.value : ''}
  placeholder="Search Date"
  type="text" 
  onChange={event => onChange(event.target.value)}
  />
  )
  },
{
  Header: "Ageing",
  accessor: "aging",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="ageing"   
value={filter ? filter.value : ''}
placeholder="Search Ageing"
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Subject",
  accessor: "subject",
className: "center",
Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="subject"   
value={filter ? filter.value : ''}
placeholder="Search Subject"
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
id="status"   
value={filter ? filter.value : ''}
placeholder="Search Status"
type="text" 
onChange={event => onChange(event.target.value)}
/>
),
Cell: row => (
  <div><Tooltip
  id="tooltip-top"
  title={"View"}
  placement="top"
  >
    {row.original.status == "Close" ?
    <Chip className="successBtnOutline"
    onClick={()=> {this.getFeedbackNoteDetails(row.original.id);this.setState({viewTicket:true,caseid:row.original.id,'subject':row.original.subject,'status':row.original.status,'description':row.original.description,'createdon':row.original.created});} }
    label="Closed"
    size="small"
    variant="outlined"
    /> : 
    <Chip 
    className="dangerBtnOutline"
    onClick={()=> {this.getFeedbackNoteDetails(row.original.id);this.setState({viewTicket:true,caseid:row.original.id,subject:row.original.subject,status:row.original.status,description:row.original.description,createdon:row.original.created});} }
    label="Open"
    size="small"
    variant="outlined"
    />}
  </Tooltip></div>
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

      <Dialog fullScreen open={this.state.viewTicket} className="bgColor" onClose={()=>this.setState({viewTicket:false,caseid:'',subject:'',status:'',description:'',created_on:''})} TransitionComponent={Transition}>
    
    <AppBar className="app-header" color="secondary" position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({viewTicket:false,caseid:'',subject:'',status:'',description:'',created_on:''})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Case ID: {this.state.caseid+' Subject: '+this.state.subject}
        </Typography>
      </Toolbar>
    </AppBar>
    <div className="pt-100">    
    <Grid container spacing={4} justify="center">
    <Grid item xs={12} sm={12} lg={6}>
    <Card>
    <CardContent className="p-3">
    <Grid container spacing={4}>
        <Grid item md={12} sm={12} lg={12}>
          <div className="timeline-list timeline-list-offset mb-4">
            {this.state.noteDetails && this.state.noteDetails.map((ele)=>(
                          <div className="timeline-item timeline-item-icon">
                          <div className="timeline-item--content">
                            <div className="timeline-item--icon-wrapper bg-primary text-white d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon icon={['far', 'gem']} />
                            </div>
                            <h4 className="timeline-item--label mb-2 font-weight-bold">
                              {ele.description}
                            </h4>
                            <small className="mt-2 d-block">
                             <FontAwesomeIcon icon={['far', 'clock']} className="mr-1" />
                             {moment(ele.created_on).format("Do MMMM, YYYY")}  
                             </small>
                          
                          </div>
                      </div>
            ))}

          </div>
          <Grid container spacing={4} className="m-4">
            <Grid item md={12} sm={12} lg={10} className="text-right">
            <Button 
            className="mr-2"
            variant="outlined"
            onClick={()=>this.setState({replyPanel:true})}
            size="small"
            color="secondary"
            >
              Reply
            </Button>
            <Button 
            onClick={()=>this.errorDialog()}
            className="mr-2"
            variant="outlined"
            clickable
            size="small"
            className="successBtnOutline"
            >
              Close
            </Button>
            </Grid>
          </Grid>
          </Grid>
          </Grid>
          </CardContent>
          </Card>
        
    </Grid>
    </Grid>
    </div>
    </Dialog>


    <Dialog fullScreen open={this.state.createFeedback} className="bgColor" onClose={()=>this.setState({createFeedback:false})} TransitionComponent={Transition}>
    
    <AppBar className="app-header" color="secondary" position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({createFeedback:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
        Create Feedback
        </Typography>
      </Toolbar>
    </AppBar>
    <div className="pt-100">    
    <Grid container spacing={4} justify="center">
    <Grid item xs={12} sm={12} lg={6}>
    <Card className="card-box  mb-4 ">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Create Feedback
                </h4>
              </div>
         
        </div>
        <CardContent>
        {this.state.supportType == "Technical" &&   <Grid container spacing={2}>
          <Grid item xs={12} sm={12} lg={12}  className="autocompleteDiv">
          <Autocomplete
                        id="modules-list"
                        onChange={this.searchModule}   
                        options={this.state.modulesList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Search module affected" variant="outlined" />} 
                        />
          </Grid>
         </Grid>  }
        <Grid container spacing={2}>
         
        {this.state.supportType == "Technical" &&  <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth>
            <TextField
                    disabled={this.props.data.usertype == "staff"?true:false}
                    className="mx-1"
                    id="severity"
                    select
                    label="Select Severity"
                    value={this.state.severity}
                    onChange={(event, child) => this.setState({severity: child.props.id})}
                    variant="outlined">
                    {this.state.severityArr.map(option => (
                      <MenuItem key={option} name={option} id={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid> }

            <Grid item xs={12} sm={8} lg={8}>
          <FormControl fullWidth>
          <TextField 
             inputProps={{
             autoComplete: 'off'
             }}
             id="subject-name"   
             value={this.state.subject}
             label="Enter Subject" 
             type="search" 
             onChange={(event) => this.setState({subject:event.target.value})}
             variant="outlined" />
             </FormControl>
            </Grid> 
        </Grid>


      
   
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.feedback_description}
          placeholder="Enter description here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        </Card>
        </Grid>
        </Grid>  

        </CardContent>
        <CardActions stats style={{marginTop:0}}>
        {AuthHelper('Feedback','can_create') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}>
        <input style={{display: this.state.visibility }} type="file" onChange={this.handleImageChange} ref={fileInput} />
                  <div>
                  <Button variant="outlined" color="primary" onClick={() => this.handleClick()}>
                    {"Attachment"}
                    </Button>{this.state.selectedFileName} 
                  </div>
        </Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.insertFeedback()}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
        </Card>
    </Grid>
    </Grid>
    </div>
    </Dialog>  

    <Drawer

anchor="right"
open={this.state.replyPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({replyPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width40p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({replyPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {'Case ID-'+this.state.caseid}
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Card className="card-box  mb-4 p-3">
<Grid container spacing={2}>

        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 py-2">
        <Editor
          editorState={this.state.reply_content}
          placeholder="Enter description here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorReplyStateChange}
        />
        </Card>
        </Grid>
</Grid> 
<CardActions stats style={{marginTop:0}}>
        {AuthHelper('Feedback','can_edit') &&   <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={6}>
        <input style={{display: this.state.visibility }} type="file" onChange={this.handleImageChange} ref={fileInput} />
                  <div>
                  <Button variant="outlined" color="primary" onClick={() => this.handleClick()}>
                    {"Attachment"}
                    </Button>{this.state.selectedFileName} 
                  </div>
        </Grid>
        <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" className="successBtnOutline" onClick={()=>this.handleFeedbackNote(this.state.caseid,this.state.statetype)}>
        Submit
        </Button>
        </Grid>
        </Grid>}
        </CardActions>
</Card>
</div>
</PerfectScrollbar>
</Box>
</Drawer>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
