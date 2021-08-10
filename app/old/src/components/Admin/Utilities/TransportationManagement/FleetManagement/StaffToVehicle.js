import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer,MenuItem, Toolbar, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
// import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'react-table-6/react-table.css';
import ReactTags from 'react-tag-autocomplete'
import Clear from "@material-ui/icons/Clear";
import { Animated } from "react-animated-css";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NextIcon from '@material-ui/icons/NavigateNext';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import StandardSectionsList from "../../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../../utils/MapStateDispatchProps.js';
import defaultImage from "../../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import "../../../../../assets/custom.scss";
import Service from '../../../../../utils/Service';
import Config from '../../../../../config';
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

class StaffToVehicle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: 'all',
            dialogOpen: true,
            actionType: 'room_structure',
            loading: false,
            selectedBlockId: '',
            TabValue: 0,
            checkAll: false,
            blocksList: [],
            checked: [],
            holidays: [{ id: 1, name: 'test' }],
            startdate: new Date(),
            enddate: new Date(),
            confirmPanel: false,
            activePanelType: true,
            selectedTab: '',
            selectedSubTab: '',
            error: '',
            activeSidebarTab: "room_structure",
            alert: null,
            roomholders: [{ block_name: '', no_of_floors: '' }],
            loading: true,
            selectedBoard: '',
            basicNotify: false,
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
            role_name:'',
            
            RoleMaster: [],
            selectedStaff:[],
            StaffToRole: [],
        };
    }

    handleDeactive = (id, status) => {
        let headingStatus = "Block Activated!";
        if (status == 1) {
            headingStatus = "Block Deactivated!";
        }

        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('HostelBlocks/deleteHostelBlocks', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{headingStatus}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }

    insertBlock = () => {
        let headingStatus = "Block Inserted!";

        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            floors: this.state.roomholders,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('HostelBlocks/insertBlock', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{headingStatus}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false, roomholders: [{ block_name: '', no_of_floors: '' }] });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }
    getRoleMaster = (id, type) => {
        const postData = {
          id_organization: this.state.selectedOrganizationId,
          id_institute: this.state.selectedInstitutionId,
          token: "abc",
          id_user: this.props.data.UID,
    
          id_board: this.state.selectedBoard,
          id_academicyear: this.state.selectedAcademicYear,
        };
        // console.log(postData);
        new Service().apiCall('TransportationMasters/getRoleDataNew', postData).then(response => {
          console.log(response)
          if (response.status == 200 && response.data != '') {
            const data = response.data.map((data) => {
              return { ...data, checked: false, editable: false, gross_rent: 0 };
            });
    
            this.setState({ RoleMaster: data });
          } else {
            this.setState({ RoleMaster: [] });
          }
        }).catch(error => {
          console.log(error);
        });
      }

      insertStafftoRole = () => {
        let headingStatus = "Role Inserted!";  
        let role = this.state.role_name;
        let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    
        const postData = {
            id_organization:this.props.data.selectedOrganizationId,
            id_institute:this.props.data.selectedInstitutionId,
            id_board:this.props.data.selectedBoardId,   
            id_academicyear:this.props.data.selectedAcademicId,  
            staffs:this.state.staffArr,
            token:"abc",
            id_vehicle:id_vehicle,
            id_role:role,
            // details:
            id_user: this.props.data.UID
        };
        console.log(postData);
        //return false;
        new Service().apiCall('TransportationMasters/insertTransportationStaffNew',postData).then(response => {
            console.log(response);
        if (response.status==200 && response.data!='') {
            this.setState({
            basicNotify: (
                <Dialog open={true}>
                <div className="text-center p-5">
                    <h4 className="font-weight-bold">{headingStatus}</h4>
                </div>
                </Dialog>
            ),
            });
            this.getBlocksData();
            setTimeout(() => {
            this.setState({ basicNotify:false, });
            }, 2000) 
        
        } else {
            //this.raiseLoginSignupErrorAlert("signup");
        }
        }).catch(error => {
        // this.raiseLoginSignupErrorAlert("signup");
  
        });
    }


    updateHeading = (id, index) => {
        let data = this.state.blocksList;
        let heading = data[index].block_name;
        let floor = data[index].no_of_floors;
        let fee = data[index].fee;
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            id: id,
            block_name: heading,
            no_of_floors: floor,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('HostelBlocks/updateBlock', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Block Updated</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false });
                }, 2000)
            } else {
                // this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            //console.log(error);
            //this.raiseLoginSignupErrorAlert("signup");

        });
    }


    addBlock = () => {
        let data = this.state.roomholders;
        let object = { block_name: '', no_of_floors: '' };
        data.push(object);
        this.setState({ data });
    }

    removeBlock = (index) => {
        const { roomholders } = this.state;
        this.setState({ roomholders: roomholders.filter((data, i) => i !== index) })

    }

    getBlocksData = (id, type) => {
        let id_vehicle = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            type: type,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            id_vehicle:id_vehicle,
        };
        new Service().apiCall('TransportationMasters/getStaffMappingWithVehicleId', postData).then(response => {
            console.log(response)
            if (response.status == 200 && response.data != '') {
                const data = response.data.map((data) => {
                    return { ...data, checked: false, editable: false, gross_rent: 0 };
                });

                this.setState({ blocksList: data });
            } else {
                this.setState({ blocksList: [] });
            }
        }).catch(error => {
            console.log(error);
        });
    }
    getStaffs = (type) => {
    
        const postData = {
        id_organization:this.state.selectedOrganizationId,
        id_institute:this.state.selectedInstitutionId,
        token:"abc",
        type:type,
        id_user: this.props.data.UID,
        id_board:this.state.selectedBoard,
        id_academicyear:this.state.selectedAcademicYear,
        };
        //console.log(postData);
        new Service().apiCall('Staffs/getData',postData).then(response => {
        //console.log(response)
        if (response.status==200 && response.data!='') {
            const data = response.data.map((data) => {
            return {...data, checked: false, editable: false};
        });
        
            this.setState({ StaffToRole: data }); 
        }else{
            this.setState({ StaffToRole: []});
        }
        }).catch(error => {
            console.log(error);
        });
    }

    searchStaff = (event,values) => {
        // console.log(values);
        //this.setState({selectedStaff:values})
        let data =[];
        if(values){
            const listItems = values.map((myList, index) =>  
                data.push(myList.UID)         
            ); 
        }
        
      
        this.setState({selectedStaff:values, staffArr:data})
        console.log(data)    
    }



    rowEdit = (estatus, index) => {

        let blocks = this.state.blocksList;
        if (estatus == true) {
            blocks[index].editable = false;
        }
        else {
            blocks[index].editable = true;
        }
        this.setState({ blocks });
    }

    handleInputChange = (cellInfo, event) => {
        let data = [...this.state.blocksList];
        data[cellInfo.index][cellInfo.column.id] = event.target.value;
        this.setState({ data });
    };

    handleChangeData = (index, name, value) => {
        let data = this.state.roomholders;
        data[index][name] = value;
        this.setState({ data });
    };

    renderEditable = (cellInfo) => {

        const cellValue = this.state.blocksList[cellInfo.index][cellInfo.column.id];
        if (cellInfo.original.editable) {
            return (
                <FormControl >
                    <TextField
                        inputProps={{
                            autoComplete: 'off'
                        }}
                        id="document-type"
                        value={cellValue}
                        placeholder={"Block Name"}
                        type="text"
                        onChange={event => this.handleInputChange(cellInfo, event)}
                    />
                </FormControl>
            );

        }
        else {
            return cellValue;
        }

    };

    componentDidMount() {
        this.getBlocksData();
        this.getRoleMaster();
        this.getStaffs();
    }

    render() {
        const width = window.innerWidth;
        const width40p = width * (40 / 100) + "px";
        const width100p = width + "px";
        return (
            <Fragment>
                {this.state.basicNotify}
                <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
                    <AppBar className="app-header" color="secondary" position="fixed">
                        <Toolbar className="w-100">
                            <Grid container>
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/Fleet-management")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Staff To Vehicle Mapping
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                        <div className="pt-100">

                            <Grid container spacing={2} className="sliderDiv" justify="center">


                                <Grid item xs={12} sm={8} md={8} lg={8} >
                                    {/* Room Structure section */}
                                   <div>


                                        <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={8}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Staff Role Mapping
                            </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    {/* <Grid container spacing={4}>
                                                        <Grid item xs={12} md={12} lg={2}>
                                                            <p>Driver: </p>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={10}>
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    id="document-type"
                                                                    label="Add staff name here separated by comma to insert multiple"
                                                                    type="search"
                                                                    variant="outlined" />
                                                            </FormControl>

                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4}>
                                                    <Grid item xs={12} md={12} lg={2}>
                                                            <p>Aaya: </p>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={10}>
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    id="document-type"
                                                                    label="Add staff name here separated by comma to insert multiple"
                                                                    type="search"
                                                                    variant="outlined" />
                                                            </FormControl>

                                                        </Grid>


                                                    </Grid> */}

                                                    
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={12} lg={2}>
                                                    <FormControl component="fieldset">
                                                        <FormLabel component="legend" className="pt-2">Select Role:</FormLabel>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={5}>
                                                    <FormControl fullWidth>
                                                        <TextField                        
                                                            id="outlined-select-currency"
                                                            select
                                                            label="Select Type"
                                                            variant="outlined"
                                                            value={this.state.role_name}
                                                            onChange={(event) => this.setState({role_name:event.target.value})}>
                                                            {this.state.RoleMaster.map(option => (
                                                            <MenuItem key={option.name} value={option.id} id={option.name}>
                                                                {option.name}
                                                            </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="autocompleteDiv" >
                                              <Autocomplete
                                                multiple
                                                id="tags-outlined"
                                                options={this.state.StaffToRole}
                                                value={this.state.selectedStaff}
                                                onChange={this.searchStaff} 
                                                getOptionLabel={(option) => option.first_name}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="filter Selected Options"
                                                    placeholder="Favorites"
                                                />
                                                )}
                                            />
                                              </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="text-right">
                                                <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.insertStafftoRole()}>Submit</Button>
                                              </Grid>
                                            </Grid> 
                                        

                                                    {/* <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={10} className="text-right">
                                                            <Button className="m-2" variant="contained" color="default" onClick={() => this.handleClass()}>Reset</Button>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={2} className="text-left">
                                                            <Button className="m-2" variant="contained" color="secondary" onClick={() => this.handleClass()}>Submit</Button>
                                                        </Grid>
                                                    </Grid> */}
                                                    {/* </Grid> */}
                                                </Card>
                                            </Grid>
                                        </Grid>


                                        {/* <Grid container spacing={4} justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                      
                                                    </Grid>

                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="m-2" variant="contained" color="secondary" onClick={() => this.handleClass()}>Export</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>

                                            </Grid>
                                        </Grid>
                                    */}
                                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={11}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Vehicle Details
                            </h4>
                                </div>
                              </div>
                              <ReactTable
                                data={this.state.blocksList.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    vehicle_no: original.vehicle_no,
                                    role_name: original.role_name,
                                    name: original.name,
                                    emp_code: original.UID,
                                    contact_no: original.contact_no,
                                    
                                    actions: (
                                      // we've added some custom button actions
                                      <div>


                                        { /* use this button to add a like kind of action */}

                                        {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                          {original.editable ? <Button
                                            className="m-2"
                                            // simple
                                            onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id, key); }}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <CheckCircleOutline />
                                          </Button> : <Button
                                            className="m-2"
                                            // simple
                                            onClick={() => { this.setState({ selectedHeading: original.name }); this.rowEdit(original.editable, key); }}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <EditIcon />
                                          </Button>}
                                        </Tooltip> */}

                                        {/* use this button to remove the data row */}

                                        <Tooltip id="tooltip-top" title={original.status == "1" ? "Deactivate" : "Activate"} placement="top">
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                checked={original.status == "1" ? true : false}
                                                onChange={() => this.handleDeactive(original.id, original.status)}
                                                value="checkedA"
                                              />
                                            }

                                            label="" />
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
                                    Filter: ({ filter, onChange }) => (
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
                                    Header: "Role Name",
                                    accessor: "role_name",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search role name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Vehicle No",
                                    accessor: "vehicle_no",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Vehicle No"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                
                                  {
                                    Header: "Name",
                                    accessor: "name",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search name"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Emp Code",
                                    accessor: "emp_code",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Emp Code"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Contact No",
                                    accessor: "contact_no",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
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
                                    Header: "Actions",
                                    accessor: "actions",
                                    className: "center",
                                    sortable: false,
                                    filterable: false,
                                  }
                                ]}
                                defaultFilterMethod={filterCaseInsensitive}
                                defaultPageSize={10}
                                showPaginationTop={false}
                                showPaginationBottom={false}
                                className="-striped -highlight"
                              />
                            </Grid>
                          </Grid>

                          {/* <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" onClick={() => this.handleClass()}>Export</Button>
                            </Grid>
                          </Grid> */}
                        </Card>

                      </Grid>
                    </Grid>
                  
                                    </div>


                                    {/* End */}
                                </Grid>

                            </Grid>

                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(StaffToVehicle);
