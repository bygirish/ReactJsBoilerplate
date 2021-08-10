import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Checkbox,Grid,Switch,FormControlLabel,ButtonGroup,Dialog,CardActions,Toolbar,Card,Radio,Avatar,TextField,Button,Paper,Chip,Drawer,Slide,FormControl,Box,Tooltip,IconButton,Typography,AppBar, List,ListItem,Divider} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
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

class Publishers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen:true,
      basicNotify:false,
      tags:[],
      reserved_due_days:'',
      return_due_days:'',
      max_issue_book_limit:'',
      max_reserve_book_limit:'',
      book_due_reminder:'',
      penalty_per_day:'',
      showStatus:'all',
      publishers:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicId:this.props.data.selectedAcademicId, 
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

 

  addPenalty = () => {

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id:this.state.penalty_id,
      reserved_due_days:this.state.reserved_due_days,
      return_due_days:this.state.return_due_days,
      max_issue_book_limit:this.state.max_issue_book_limit,
      max_reserve_book_limit:this.state.max_reserve_book_limit,
      book_due_reminder:this.state.book_due_reminder,
      penalty_per_day:this.state.penalty_per_day,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Libraries/insertPenalty',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Penalty Settings  Added</h4>
    </div>
  </Dialog>
          ),
        });
        
        setTimeout(() => {
          window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
  //    this.showError(error.response.data)
    });
  } 


getPenalty = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,   
  id_academicyear:this.state.selectedAcademicId,  
  token:"abc",
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  };
  new Service().apiCall('Libraries/getPenaltyData',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
          this.setState({penalty_id:response.data.id,reserved_due_days:response.data.reserved_due_days,return_due_days:response.data.return_due_days,max_issue_book_limit:response.data.max_issue_book_limit,max_reserve_book_limit:response.data.max_reserve_book_limit,book_due_reminder:response.data.book_due_reminder,penalty_per_day:response.data.penalty_per_day});
     
      
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  });
}

setPostData = (name,value) => {
  this.setState({[name]:value});
}

  componentDidMount() {
      this.getPenalty();
  }

  render() {
    const width = window.innerWidth;
    const width30p =  width * (30/100)+"px";
    const width50p =  width * (50/100)+"px";
    const width100p =  width +"px";

  return (
    <Fragment>
       {this.state.basicNotify}

    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 


    <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={12}>
        {AuthHelper('Library Management','can_create') &&    <Card className="card-box  mb-3 mt-2 p-3">
  
              <Grid container>
              <Grid item xs={12} sm={12} md={4}>
              <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off'
              }}
              className="m-2"
              id="document-type"   
              onChange={(event) => this.setPostData("reserved_due_days",event.target.value)}
              value={this.state.reserved_due_days}
              label="Default Issue/Reserve Due Days" 
              type="search" 
              inputRef={this.textInput} 
              variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4} className="inputMargin">
                <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                className="m-2"
                id="document-type"   
                onChange={(event) => this.setPostData("return_due_days",event.target.value)}
                value={this.state.return_due_days}
                label="Default Return Due Days" 
                type="search" 
                variant="outlined" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={4} className="inputMargin">
                <FormControl fullWidth>
                <TextField 
                inputProps={{
                autoComplete: 'off'
                }}
                className="m-2"
                id="document-type"   
                onChange={(event) => this.setPostData("max_issue_book_limit",event.target.value)}
                value={this.state.max_issue_book_limit}
                label="Max Issue Books Limit" 
                type="search" 
                variant="outlined" />
               
                </FormControl>
              </Grid>
              </Grid>

              <Grid container> 
              <Grid item xs={12} sm={12} md={4} className="inputMargin">
               <FormControl fullWidth>
              <TextField 
              inputProps={{
              autoComplete: 'off'
              }}
              className="m-2"
              id="document-type"   
              value={this.state.max_reserve_book_limit}
              label="Max Reserve Books Limit" 
              type="search" 
              onChange={(event) => this.setPostData("max_reserve_book_limit",event.target.value)}
              inputRef={this.textInput} 
              variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4} className="inputMargin">
               <FormControl fullWidth>
               <TextField 
              inputProps={{
              autoComplete: 'off'
              }}
              className="m-2"
              id="document-type"   
              value={this.state.book_due_reminder}
              onChange={(event) => this.setPostData("book_due_reminder",event.target.value)}
              label="Book Due Reminder Before Days" 
              type="search" 
              inputRef={this.textInput} 
              variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4} className="inputMargin">
               <FormControl fullWidth>
               <TextField 
              inputProps={{
              autoComplete: 'off'
              }}   
              className="m-2"          
              id="document-type"   
              onChange={(event) => this.setPostData("penalty_per_day",event.target.value)}
              value={this.state.penalty_per_day}
              label="Penalty Per Day" 
              type="search" 
              inputRef={this.textInput} 
              variant="outlined" />
                </FormControl>
              </Grid>
              </Grid>

           
           
             

               {AuthHelper('Library Management','can_create') &&   <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={12} className="text-right mt-4">
        <Button className="successBtnOutline" variant="outlined" onClick={()=>this.addPenalty()}>
              Submit
            </Button>
        </Grid>
        </Grid>}
      
        </Card>}

        </Grid>

        </Grid>

    </Animated>
   
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Publishers));
