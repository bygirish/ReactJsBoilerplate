import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Tabs,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import {Animated} from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import ViewIcon from "@material-ui/icons/Visibility";  
import EditIcon from '@material-ui/icons/Edit';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
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

class WaitingVisitorManagement extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      actionType:'room_structure',
      loading:false,
      selectedBlockId:'',
      TabValue:0,
      checkAll:false,
      VisitorList:[],
      checked: [],
      holidays:[{id:1, name:'test'}],
      startdate:new Date(),
      enddate: new Date(),
      confirmPanel:false,
      activePanelType:true,  
      selectedTab:'',
      selectedSubTab:'', 
      error: '',
      activeSidebarTab:"room_structure",
      alert: null,
      roomholders: [{ block_name: '', no_of_floors: '' }],     
      loading:true,
      selectedBoard:'',
      basicNotify:false,
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
  }

  getVisitorData = (id,type) => {
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      type:type,
      id_board:this.state.selectedBoard,
      id_academicyear:this.state.selectedAcademicYear,
    };
    new Service().apiCall('VisitorManagement/getWaitingVisitorData',postData).then(response => { 
      console.log(response)
      if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
          return {...data, checked: false, editable: false};
        });
    
        this.setState({ VisitorList: data }); 
      }else{
        this.setState({ VisitorList: []});
      }
    }).catch(error => {
      console.log(error); 
    });
  }

  componentDidMount() {
   this.getVisitorData();
  }

    render(){
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
                                    <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/visitors-management")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Waiting Visitors
                                    </Typography>
                                </Grid>     
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
                        <div  className="pt-100"> 

                            <Grid container justify="center" spacing={4} className="sliderDiv">
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card className="card-box  mb-4 p-3 customNoData">
                                        <Grid container>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <div className="card-header pl-0">
                                                    <div className="card-header--title">
                                                        <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                            Visitors List
                                                        </h4>
                                                    </div>
                                                </div>

                                                <ReactTable
                                                    data={this.state.VisitorList.map((original,key) => {
                                                        return ({
                                                            slno: key+1,
                                                            id:original.id,
                                                            name: original.name,
                                                            type:original.type,
                                                            person:original.person,
                                                            person_type:original.person_type,
                                                            phone:original.phone,
                                                            age:original.age,
                                                            address:original.address,
                                                            date:original.date,
                                                            sex:original.sex,
                                                            purpose:original.purpose,
                                                            intime:original.intime,
                                                            entered_time:original.entered_time,
                                                            out_time:original.out_time,
                                                            remarks:original.remarks,
                                                            meeting_status:original.meeting_status,
                                                            accept:original.accept,
                                                            cancelled:original.cancelled,
                                                            cancelled_by:original.cancelled_by,
                                                            cancelled_remarks:original.cancelled_remarks,
                                                            notification:original.notification,
                                                            editable:original.editable,
                                                            status:original.status,
                                                            actions: (
                                                              // we've added some custom button actions
                                                              <div>                                                                   
                                                                            
                                                                {/* use this button to remove the data row */}
                                                                  <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                    <Button
                                                                      className="m-2"
                                                                      simple
                                                                      onClick={()=>this.props.history.push("/admin/view-visit-details/"+"Visitor/"+original.id)}
                                                                      color="secondary"
                                                                      className="view"
                                                                      >
                                                                      <ViewIcon/>
                                                                      </Button> 
                                                                  </Tooltip>                                                                  

                                                                  {original.cancelled == 0 &&
                                                                  <>
                                                                    <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                      <Button
                                                                        className="m-2"
                                                                        simple
                                                                        onClick={()=>this.props.history.push("/admin/edit-visit-detail/"+original.id)}
                                                                        color="secondary"
                                                                        className="edit"
                                                                        >
                                                                        <EditIcon/>
                                                                        </Button> 
                                                                    </Tooltip>

                                                                    <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                      <Button
                                                                        className="m-2"
                                                                        simple
                                                                        onClick={()=>this.props.history.push("/admin/cancel-visit/"+original.id)}
                                                                        color="secondary"
                                                                        className="edit"
                                                                        >
                                                                        <CloseIcon/>
                                                                        </Button> 
                                                                    </Tooltip>
                                                                  </>
                                                                  }
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
                                                  Header: "Visitor Name",
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
                                                  Header: "Phone",
                                                  accessor: "phone",
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
                                                  Header: "Visit Type",
                                                  accessor: "person_type",
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
                                                  placeholder="Search Name"
                                                  type="text" 
                                                  onChange={event => onChange(event.target.value)}
                                                  />
                                                  )
                                                },
                                                {
                                                  Header: "InTime",
                                                  accessor: "intime",
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
                                                  Header: "OutTime",
                                                  accessor: "out_time",
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
                                                  placeholder="Search Name"
                                                  type="text" 
                                                  onChange={event => onChange(event.target.value)}
                                                  />
                                                  )
                                                },
                                                {
                                                Header:"Actions",
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
                                            </Grid> 
                                        </Grid>

                                        <Grid container className="mt-2">
                                            <Grid item xs={12} sm={12} md={12} className="text-right">
                                                <Button className="m-2" variant="outlined" color="secondary" href={Config.url+"/VisitorManagement/excelWaitingVisitors?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                    
                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(WaitingVisitorManagement);
