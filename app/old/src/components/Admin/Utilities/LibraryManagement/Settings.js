import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,ListItem,FormControlLabel,Switch,FormControl,IconButton,Typography,AppBar,Divider,Card,MenuItem,Fab,CardActions,TextField,Button,Toolbar,Box,FormLabel,List,Tooltip,Slide,Checkbox,RadioGroup,Radio,InputAdornment,TabPanel,ButtonGroup} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Send from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import Remove from "@material-ui/icons/Remove";
import ViewIcon from "@material-ui/icons/Visibility";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import Genres from '../../../../components/Admin/Utilities/LibraryManagement/Genres.js';
import Authors from '../../../../components/Admin/Utilities/LibraryManagement/Authors.js';
import Publishers from '../../../../components/Admin/Utilities/LibraryManagement/Publishers.js';
import Languages from '../../../../components/Admin/Utilities/LibraryManagement/Languages.js';
import Penalty from '../../../../components/Admin/Utilities/LibraryManagement/Penalty.js';
import 'date-fns';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
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

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      actionType:'Genres',
      dialogOpen:true,
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
      basicNotify:false,
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
 


  componentDidMount() {
    
  }

render(){
  const width = (window.innerWidth) * (60/100)+"px";
  return (
    <Fragment>
      {this.state.basicNotify}
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={12} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/library-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Settings
            </Typography>
               </Grid>
        
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
      <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
          <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                
                  <ListItem button className={this.state.actionType =="Genres" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Genres"})}>
                    <span>Genres</span>
                  </ListItem>
                  <ListItem button className={this.state.actionType =="Authors" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Authors"})}>
                    <span>Authors</span>
                  </ListItem>
                  <ListItem button className={this.state.actionType =="Publishers" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Publishers"})}>
                    <span>Publishers</span>
                  </ListItem>
                  {/* <ListItem button className={this.state.actionType =="Suppliers" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Suppliers"})}>
                    <span>Suppliers</span>
                  </ListItem> */}
                  <ListItem button className={this.state.actionType =="Languages" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Languages"})}>
                    <span>Languages</span>
                  </ListItem>
                  <ListItem button className={this.state.actionType =="Penalty" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>this.setState({actionType:"Penalty"})}>
                    <span>Penalty</span>
                  </ListItem>
                </List>
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={9}>
          <Grid container justify="center">
          <Grid item xs={12} md={4} lg={8}>
            {this.state.actionType == "Genres" &&  <Genres {...this.props} />  }
            {this.state.actionType == "Authors" &&  <Authors {...this.props} />  }
            {this.state.actionType == "Publishers" &&  <Publishers {...this.props} />  }
            {this.state.actionType == "Languages" &&  <Languages {...this.props} />  }
            {this.state.actionType == "Penalty" &&  <Penalty {...this.props} />  }
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

export default connect(mapStateToProps, mapDispatchToPros)(Settings);
