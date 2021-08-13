import React, { Fragment } from 'react';
import {Dialog,Grid,Switch,FormControlLabel,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip} from '@material-ui/core';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {Animated} from "react-animated-css";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import NavigateNext from "@material-ui/icons/NavigateNext"; 
import ViewIcon from "@material-ui/icons/Visibility";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import { AuthHelper } from '@utils/AuthHelper.js';
import { ExampleWrapperSimple } from '../../../../layout-components';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from  "@assetss/images/placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "@assetss/custom.scss";
import Service from '@utils/Service';
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

const fileInput = React.createRef();
const fileMotherInput = React.createRef();
const fileFatherInput = React.createRef();
const fileGuardInput = React.createRef();
const fileBirthInput = React.createRef();
const fileAadhaarInput = React.createRef();
const fileTransferInput = React.createRef();
const fileMarksInput = React.createRef();

class ViewApplicationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      loading:false,     
      applicationData:[],
      studentData:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId, 
      basicNotify:false,
    };
    
  }

  


    handleDeactive = (id, status) => {
      let switchStatus = "";
       if(status == true){
          switchStatus = "Application Deactivated";
       }
       else{
          switchStatus = "Application Activated Successfully";
       }
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        id: id,
        token:"abc",
        id_user: this.props.data.UID,
      };
      new Service().apiCall('Preadmissions/deletePreadmissionProfile',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({
            basicNotify: (
              <Dialog open={true}>
                <div className="text-center p-5">
                  <h4 className="font-weight-bold">{switchStatus}</h4>
                </div>
              </Dialog>
            ),
          });
        
          setTimeout(() => {
           window.location.reload()
          }, 2000) 
        }
      }).catch(error => {
        alert(error);
      });
    }

    getApplication = () =>{  
        let id_setting = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,
            id_academicyear:this.props.data.selectedAcademicId,
            token:"abc",
            id_setting:id_setting,
            id_user: this.props.data.UID
        };
        new Service().apiCall('Preadmissions/getPreadmissionData',postData).then(response => {
            //console.log(response);
            if (response.status==200 && response.data!='') {
              this.setState({applicationData : response.data});
            } 
        }).catch(error => {
            console.log(error);
      
        });
    }
  

    componentDidMount() {
        this.getApplication();   
    }

render(){
 

  return (
    <Fragment>
        {this.state.basicNotify}
        <Grid container spacing={2} justify="center" className="sliderDiv">
            <Grid item xs={12} md={8} lg={10}>
                <Card className="card-box  mb-4 customNoData">
                    <ReactTable

                        data={
                            this.state.applicationData.map((original,key) => {
                                return ({
                                    slno: key+1,
                                    id : original.id,
                                    uid : original.UID,
                                    name : original.name,
                                    father_name : original.father_name,
                                    primary_contact : original.primary_contact,
                                    standard : original.standard,
                                    status : original.status,
                                    application_status : original.application_status,
                                    actions: (
                                        // we've added some custom button actions
                                        <div className="grouplist-actions">
                                            { /* use this button to add a like kind of action */ }
                                            
                                            <Tooltip
                                                id="tooltip-top"
                                                title={"View"}
                                                placement="top"
                                                >
                                                <Button
                                                    className="m-2"
                                                    simple
                                                    onClick={()=>this.props.history.push("/admin/preadmission-student-info/"+original.UID)}
                                                    color="secondary"
                                                    className="view"
                                                >
                                                    <ViewIcon />
                                                </Button> 
                                            </Tooltip>
                                                
                                            {/* use this button to remove the data row */}
                                            {AuthHelper('Student Demography','can_delete') &&  <Tooltip
                                                    id="tooltip-top"
                                                    title={original.status == 1 ? "Deactivate":"Activate"}
                                                    placement="top"
                                                >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                        checked={original.status == 1 ? true:false}
                                                        onChange={() => this.handleDeactive(original.id, original.status)}
                                                        value="checkedA"
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </Tooltip>}
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
                        Header: "Father Name",
                        accessor: "father_name",
                        className: "center",
                        Filter: ({filter, onChange}) => (
                        <TextField 
                        inputProps={{
                        autoComplete: 'off'
                        }}         
                        id="document-type"   
                        value={filter ? filter.value : ''}
                        placeholder="Search Father Name"
                        type="text" 
                        onChange={event => onChange(event.target.value)}
                        />
                        
                        )
                        },
                        {
                        Header: "Contact No",
                        accessor: "primary_contact",
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
                        )
                        },
                        {
                        Header: "Standard/Section",
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
                        {AuthHelper('Student Demography','can_export') && <Grid container spacing={4}>
                            <Grid item xs={12} md={4} lg={12} className="text-right">
                                <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
                                    Export
                                </Button>
                            </Grid>
                        </Grid>}
                    </CardActions>

                </Card>
            </Grid>     
        </Grid>
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(ViewApplicationDashboard);
