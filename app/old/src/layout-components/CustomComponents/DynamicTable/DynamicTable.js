import React from "react";
import ViewIcon from "@material-ui/icons/Visibility";
import {
    Dialog, Grid, Switch, FormControlLabel, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Avatar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, Tooltip,
    Drawer, Toolbar
} from '@material-ui/core';
import { AuthHelper } from '@src/utils/AuthHelper.js';
import Service from '@src/utils/Service';
import Config from '@src/config';
import "@assetss/custom.scss";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { mapStateToProps, mapDispatchToPros } from '@src/utils/MapStateDispatchProps.js';





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
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCount: 0,
            invisible:[],
            Tabledata:[],
            Header:[],
            showStatus:'all'
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

      getTableData = (modelName,id, id_board, id_academicyear) => {
        const postData = {
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
          standard_id: id ? id : '',
          id_board: id_board ? id_board : this.state.selectedBoard,
          id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
        };
        new Service().laravelTmp('table-Data/'+modelName, postData).then(response => {
          if (response.status == 200 && response.data != '') {
           console.log(response.data);
           
            const newArr = response.data.map((v,i) => ({ 'S No':i+1,...v, editable: false }));
            if (this.state.showStatus == 'all') {
              this.setState({ Tabledata: newArr, studentSuggestions: newArr });
            }
            else {
              var newArray = newArr.filter(x => x.status == this.state.showStatus);
              this.setState({ Tabledata: newArray, studentSuggestions: newArray});
            }
          } else {
            this.setState({ Tabledata: [] });
          }
          this.setState({callTable:true});
        }).catch(error => {
          console.log(error);
        });
      }
      getColumnsData = (modelName,id, id_board, id_academicyear) => {
        const postData = {
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
          standard_id: id ? id : '',
          id_board: id_board ? id_board : this.state.selectedBoard,
          id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
        };
        new Service().laravelTmp('table-Columns/'+modelName, postData).then(response => {
          if (response.status == 200 && response.data != '') {
           console.log(response.data);
           
            
            //   this.setState({ studentColumns: response.data });
            let newFirstElement='S No';
            let data='';
            data= [newFirstElement].concat(response.data)
            this.MappingHeader(data);
            
           
           
          } else {
            // this.setState({ studentColumns: [] });
          }
          
        }).catch(error => {
          console.log(error);
        });
      }

      getApiTableData = (URL,id, id_board, id_academicyear) => {
        const postData = {
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
          standard_id: id ? id : '',
          id_board: id_board ? id_board : this.state.selectedBoard,
          id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
        };
        new Service().laravelTmp(URL, postData).then(response => {
          if (response.status == 200 && response.data != '') {
           console.log(response.data);
           
            const newArr = response.data.map((v,i) => ({ 'S No':i+1,...v, editable: false }));
            if (this.state.showStatus == 'all') {
              this.setState({ Tabledata: newArr, studentSuggestions: newArr });
            }
            else {
              var newArray = newArr.filter(x => x.status == this.state.showStatus);
              this.setState({ Tabledata: newArray, studentSuggestions: newArray});
            }
          } else {
            this.setState({ Tabledata: [] });
          }
          this.setState({callTable:true});
        }).catch(error => {
          console.log(error);
        });
      }
      getApiColumnsData = (URL,id, id_board, id_academicyear) => {
        const postData = {
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
          standard_id: id ? id : '',
          id_board: id_board ? id_board : this.state.selectedBoard,
          id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
        };
        new Service().laravelTmp(URL, postData).then(response => {
          if (response.status == 200 && response.data != '') {
           console.log(response.data);
           
            
            //   this.setState({ studentColumns: response.data });
            let newFirstElement='S No';
            let data='';
            data= [newFirstElement].concat(response.data)
            this.MappingHeader(data);
            
           
           
          } else {
            // this.setState({ studentColumns: [] });
          }
          
        }).catch(error => {
          console.log(error);
        });
      }
      
      
    


    getColumns() {
        
       
              
             if(this.state.Tabledata.length>0){
               return Object.entries(this.state.Tabledata[0]).map(([key,value])=>{
                   
                return {
                    id:key,
                    Header: this.state.Header[key] != undefined ? this.state.Header[key] : key,
                    accessor: key,
                    show: this.state.invisible[key] != undefined ? this.state.invisible[key] : false,
                    Filter: ({ filter, onChange }) => (
                        <TextField
                            inputProps={{
                                autoComplete: 'off'
                            }}

                            value={filter ? filter.value : ''}
                            placeholder={"Search " + (this.state.Header[key] != undefined ? this.state.Header[key] : key)}
                            type="text"
                            onChange={event => onChange(event.target.value)}
                        />
                    ),
                    Cell: key=='actions'&&(
                         row => (
                       
                        // we've added some custom button actions
                        <div className="grouplist-actions">
                          
                          <Tooltip
                            id="tooltip-top"
                            title={"View"}
                            placement="top"
                          >
                            <Button className="m-2" simple 
                            onClick={() => this.props.history.push("/admin/view-student-info/" + row.original.UID)} 
                            color="secondary" className="edit" >
                              <ViewIcon />
                            </Button>
                          </Tooltip>
              
                          {/* use this button to remove the data row */}
                          {AuthHelper("Student Demography", "can_delete") && <Tooltip
                            id="tooltip-top"
                            title={row.original.status == 1 ? "Deactivate" : "Activate"}
                            placement="top"
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={row.original.status == 1 ? true : false}
                                  onChange={() => this.props.handleDeactive(row.original.id, row.original.status)}
                                  value="checkedA"
                                />} label=""
                            />
                          </Tooltip>}
              
                        </div>
                    ))
                }
            
            });
            }
       
    

       
    }
    getStudentKeys = () => {
       
        let Header=this.state.Header;
        let data = [];
        
        Object.entries(Header).map(([key,value])=>{
          if(value!='Id'&& value != 'UID' && value != 'Name'){
          data.push(value)
          }
        })
        console.log({ data });
        this.setState({ columnKey: data,Header:Header });
      }
      searchStudentColumns = (values) => {
        let Header=this.state.Header;
        let invisible = [];
        let data = [];
        let dataCount=this.state.dataCount;
        console.log(values);
        values.map((element, index) => {
          data[element] = true;
        })
        Object.entries(Header).map(([key,value])=>{
          if(data[value]){
            invisible[key]=true;
            dataCount++;
          }
          else{
            invisible[key]=false;
          }
        })
    
        this.setState({invisible:invisible, ColumnsData: data, ColumnsDataAC: values,dataCount });
       
    
      }
      ucwords = (str)=> {
        str = str.toLowerCase();
        return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            function($1){
                return $1.toUpperCase();
            });
    }
    MappingHeader=(TableColumns)=>{
        let invisible=[];
        let Header=[];
        let replacedValue=''
        Object.entries(TableColumns).map(([key,values])=>{

            invisible[values]=false;
           replacedValue= values.replace("_",' ');
            Header[values]=this.ucwords(replacedValue);
  
          })
  
          this.setState({invisible:invisible,Header:Header});
    }
    
      componentDidMount() {
        let dataCount=this.state.dataCount;
        
        if(this.props.type=='custom'){
            this.setState({Tabledata:this.props.Tabledata});
           
        this.MappingHeader(this.props.TableColumns);
       
       
        }
        else if(this.props.type=='api'){
            this.getApiTableData(this.props.URL['TableDataURL']);
            this.getApiColumnsData(this.props.URL['TableColumnURL']);
        }
        else if(this.props.type=='model'){
            this.getTableData(this.props.modelName);
            this.getColumnsData(this.props.modelName);
        }
        this.setState({dataCount:dataCount});
      }
    render() {
        let dataCount=this.state.dataCount;
        const width60p = (window.innerWidth) * (60 / 100) + "px";

        
     
        const columns = this.getColumns(dataCount);
        // this.props.dataCount(dataCount);
        // this.setState({dataCount:dataCount});
        console.log('columns'+JSON.stringify(columns));
      
        return (
           <>
            <div>
                 <Card className="card-box  mb-4 customNoData">
                 <div className="card-header">
                      <div className="card-header--title">
                        <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                          {this.props.title}
                        </h4>
                      </div>
                      {/* <div className="card-header--actions">
                        <Box>
                          <ButtonGroup size="small" className="m-2">
                            <Button color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 'all' }); this.getStudentDetails(this.state.selectedStandardId, this.state.selectedBoard, this.state.selectedAcademicYear) }}>
                              All
                            </Button>
                            <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 1 }); this.getStudentDetails(this.state.selectedStandardId, this.state.selectedBoard, this.state.selectedAcademicYear) }}>
                              Active
                            </Button>
                            <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 0 }); this.getStudentDetails(this.state.selectedStandardId, this.state.selectedBoard, this.state.selectedAcademicYear) }}>
                              InActive
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </div> */}
                      <div>
                      <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => { this.setState({ viewStudentColumnPanel: true }); this.getStudentKeys(); this.props.viewSidebarStudentClass(false) }}
                      >
                            Click here to choose Colunms
                          </Button>
                      <Tooltip
                            id="tooltip-top"
                            title='Click here to choose Columns'
                            placement="top"
                          >
                            
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={() => { this.setState({ viewStudentColumnPanel: true }); this.getStudentKeys(); this.props.viewSidebarStudentClass(false) }}
                        >
                        
                          <MoreVertIcon />
                        </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                   
                 { this.state.dataCount > 0 &&
                 <>
                <ReactTable
                    data={this.state.Tabledata}
                    filterable
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    filterable={true}
                    defaultFilterMethod={this.handleFilterChange}
                    showPaginationTop
                    showPaginationBottom={false}
                    minRows={0}

                />
                <CardActions stats style={{ marginTop: 0 }}>
                      {AuthHelper('Student Demography', 'can_export') && 
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4} lg={6}></Grid>
                        <Grid item xs={12} md={4} lg={6} className="text-right">
                          <Button variant="outlined" color="secondary" href={Config.url + "/StudentDetails/excelStudent?standard_id=" + this.state.selectedStandardId + "&id_institute=" + this.props.data.selectedInstitutionId + "&id_board=" + this.state.selectedBoard + "&id_academicyear=" + this.state.selectedAcademicYear}>
                            Export
                          </Button>
                        </Grid>
                      </Grid>}
                    </CardActions>
                    
                   </>
                 }
                <br />
            </Card>
            </div>
          
            <Drawer

anchor="right"
open={this.state.viewStudentColumnPanel}
variant="temporary"
elevation={4}
onClose={() => this.setState({ viewStudentColumnPanel: false })}>
<Box className={"app-header-drawer bgColor"} style={{ width: width60p }}>
  <PerfectScrollbar>

    <AppBar className="app-header" color="secondary" position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => this.setState({ viewStudentColumnPanel: false })} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
          
          Student Demography Table{' ' + this.state.selectedSidebarSection!= undefined ? this.state.selectedSidebarSection : ''}
        </Typography>
      </Toolbar>
    </AppBar>

    <div className="m-20">
      <Card className="card-box  mb-4 p-4">
        <Grid container spacing={2} className="">
          <Grid xs={12} sm={12} md={1}></Grid>
          {this.state.Header &&
          <Grid xs={12} sm={12} md={8} className="pl-1 pr-2  autocompleteDiv customChip">


            <Autocomplete
              multiple

              options={this.state.columnKey}
              variant="outlined"
              className="inputTag"

              value={this.state.ColumnsDataAC}
              onChange={(event, newValue) => this.searchStudentColumns(newValue)}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              required
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="inputTag"
                  label="Search Columns"

                />
              )}
            />


          </Grid>
          }
          <Grid xs={12} sm={12} md={1}></Grid>
          <Grid xs={12} sm={12} md={2} className="mt-1">
            <Fab size="medium" className="customNavBtn" aria-label="edit" onClick={() => this.setState({ viewStudentColumnPanel: false })}>
              <NavigateNext />
            </Fab>

          </Grid>
        </Grid>
      </Card>
    </div>
  
  </PerfectScrollbar>
</Box>
</Drawer>

          </>
        );
      
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(withRouter(App));
