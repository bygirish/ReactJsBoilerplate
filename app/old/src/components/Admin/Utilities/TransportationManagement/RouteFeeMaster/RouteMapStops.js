import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
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
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from "@assetss/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
import Service from '@utils/Service';
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

class RoomFeeManagement extends React.Component {
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
            blocksList: [{ id_route: '', stop_name: '', upward_time: '', downward_time: '', distance_from_school: '',total_fee:'',status:'' }],
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
            roomholders: [{ distance: '', upward_time: '', downward_time: '' }],
            RouteStops:[{ stop_name: '', upward_time: '', downward_time: '',distance_from_school:'',total_fee:'' }],
            loading: true,
            selectedBoard: '',
            basicNotify: false,
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
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
        new Service().apiCall('TransportationRouteMasters/deleteRouteMaster', postData).then(response => {
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
        let id_route = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            tripDetails: this.state.roomholders,
            token: "abc",
            id_route:id_route,
            id_user: this.props.data.UID
        };
        new Service().apiCall('TransportationRouteMasters/insertRouteTripsMaster', postData).then(response => {
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
                    this.setState({ basicNotify: false, roomholders: [{ distance: '', upward_time: '', downward_time: '' }] });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }
     insertBlockStop = () => {
        let headingStatus = "Block Inserted!";
        let id_route = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            stopDetails: this.state.RouteStops,
            token: "abc",
            id_route:id_route,
            id_user: this.props.data.UID
        };
        new Service().apiCall('TransportationRouteMasters/insertRouteStopsMaster', postData).then(response => {
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
                    this.setState({ basicNotify: false, RouteStops: [{ stop_name: '', upward_time: '', downward_time: '',distance_from_school:'',total_fee:'' }] });
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
        let object = { distance: '', upward_time: '', downward_time: '' };
        data.push(object);
        this.setState({ data });
    }
    addBlockStop = () => {
        let data = this.state.RouteStops;
        let object = { distance: '', upward_time: '', downward_time: '' };
        data.push(object);
        this.setState({ data });
    }

    removeBlock = (index) => {
        const { roomholders } = this.state;
        this.setState({ roomholders: roomholders.filter((data, i) => i !== index) })

    }
    removeBlockStop = (index) => {
        const { RouteStops } = this.state;
        this.setState({ RouteStops: RouteStops.filter((data, i) => i !== index) })

    }

    getBlocksData = (id, type) => {
        let id_route = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            type: type,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            id_route:id_route
        };
        new Service().apiCall('TransportationRouteMasters/getStopsData', postData).then(response => {
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



    // renderBlocks = () =>{
    //   let total_blocks = this.state.blocksList.length;
    //   //console.log(total_blocks);
    //   //console.log(this.state.blocksList && this.state.blocksList[0].block_name);
    //   let data =[];
    //   for(let i=0; i<=total_blocks; i++){
    //     let indexing=i;
    //     //console.log(indexing);
    //      data.push(
    //       <Grid item xs={12} sm={12} lg={8}>
    //         <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-3 text-center">
    //             <Grid container spacing={2} justify="center">
    //                 <Grid item xs={12} sm={12} lg={4}>
    //                     <h5>{i + 1}</h5>
    //                     <div><small>{this.state.blocksList[i].block_name}</small></div>
    //                 </Grid>
    //                 <Grid item xs={12} sm={12} lg={8}>
    //                     <Grid container spacing={1} justify="center">
    //                         <Grid item xs={12} sm={12} lg={2}>
    //                             <h5>{this.state.blocksList[0].no_of_floors}</h5>
    //                             <div><small>Floors</small></div>
    //                         </Grid>
    //                         <Grid item xs={12} sm={12} lg={2}>
    //                             <h5>{this.state.blocksList[0].no_of_rooms}</h5>
    //                             <div><small>Rooms</small></div>
    //                         </Grid>
    //                         <Grid item xs={12} sm={12} lg={2}>
    //                             <h5>{this.state.blocksList[0].no_of_beds}</h5>
    //                             <div><small>Beds</small></div>
    //                         </Grid>
    //                         <Grid item xs={12} sm={12} lg={2}>
    //                             <h5>{this.state.blocksList[0].gross_rent}</h5>
    //                             <div><small>Gross Rent</small></div>
    //                         </Grid>
    //                         <Grid item xs={12} sm={12} lg={2} justify="center">
    //                             <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/view-room-fee-master")}>Go</Button>
    //                         </Grid>
    //                     </Grid>
    //                 </Grid>
    //             </Grid>
    //         </div>
    //     </Grid>

    //     )
    //   }
    //   return data;
    // }

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
    
    handleChangeDataStop = (index, name, value) => {
        let data = this.state.RouteStops;
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
                                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/RouteFee-Master")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Route Name
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                        <div className="pt-100">

                            <Grid container spacing={2} className="sliderDiv" justify="center">
                               
                                <Grid item xs={12} md={8} lg={9}>
                                    {/* Room Structure section */}
                                    {this.state.actionType == "room_structure" && <div>
                                        <Grid container justify="center">
                                            <Grid item xs={12} md={8} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Stops
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    {/* <Card className="card-box  mb-4 p-3">
                                                    <Grid container>

                                                    <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h5 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Trips
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={12}>

                                                    {this.state.roomholders.map((element, index) => (
                                                                  
                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} sm={10} lg={1} align="center">
                                                                <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                    {index + 1}
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} lg={1} align="center">
                                                                <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                    {'Trip '+ (index+1)}
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={3}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeData(index, "distance", event.target.value)}
                                                                        value={element.distance}
                                                                        id="document-type"
                                                                        label="Distance (in Kms)"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>



                                                            <Grid item xs={12} sm={10} md={3}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeData(index, "upward_time", event.target.value)}
                                                                        value={element.upward_time}
                                                                        id="document-type"
                                                                        label="Upward time"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={3}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeData(index, "downward_time", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Downward Time"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                           

                                                            <Grid item xs={12} sm={12} lg={1}>
                                                                {index == 0 ? <FormControl fullWidth>
                                                                    <TextField
                                                                        InputProps={{
                                                                            autoComplete: 'off',
                                                                            readOnly: true,
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <Add onClick={() => this.addBlock()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        id="document-type" label="Add" variant="outlined" />
                                                                </FormControl> :
                                                                    <FormControl fullWidth>
                                                                        <TextField
                                                                            InputProps={{
                                                                                autoComplete: 'off',
                                                                                readOnly: true,
                                                                                startAdornment: (
                                                                                    <InputAdornment position="start">
                                                                                        <Remove onClick={() => this.removeBlock(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer' }} />
                                                                                    </InputAdornment>
                                                                                ),
                                                                            }}
                                                                            id="document-type" label="Add" variant="outlined" />
                                                                    </FormControl>}
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertBlock()}>Submit</Button>
                                                        </Grid>
                                                    </Grid>
                                                    </Grid></Grid></Card>
                                                    */}
                                                    <Card className="card-box  mb-4 p-3">
                                                    <Grid container>

                                                    <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h5 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Stops
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={12}>

                                                    {this.state.RouteStops.map((element, index) => (
                                                                  
                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} sm={10} lg={1} align="center">
                                                                <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                    {index + 1}
                                                                </FormControl>
                                                            </Grid>
                                                            
                                                            <Grid item xs={12} sm={10} md={2}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeDataStop(index, "stop_name", event.target.value)}
                                                                        value={element.stop_name}
                                                                        id="document-type"
                                                                        label="Stop Name"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>



                                                            <Grid item xs={12} sm={10} md={2}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeDataStop(index, "upward_time", event.target.value)}
                                                                        value={element.upward_time}
                                                                        id="document-type"
                                                                        label="Upward time"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={2}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeDataStop(index, "downward_time", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Downward Time"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={2}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeDataStop(index, "distance_from_school", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Distance from school"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={2}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeDataStop(index, "total_fee", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Total fee Rs"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                           

                                                            <Grid item xs={12} sm={12} lg={1}>
                                                                {index == 0 ? <FormControl fullWidth>
                                                                    <TextField
                                                                        InputProps={{
                                                                            autoComplete: 'off',
                                                                            readOnly: true,
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <Add onClick={() => this.addBlockStop()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        id="document-type" label="Add" variant="outlined" />
                                                                </FormControl> :
                                                                    <FormControl fullWidth>
                                                                        <TextField
                                                                            InputProps={{
                                                                                autoComplete: 'off',
                                                                                readOnly: true,
                                                                                startAdornment: (
                                                                                    <InputAdornment position="start">
                                                                                        <Remove onClick={() => this.removeBlockStop(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer' }} />
                                                                                    </InputAdornment>
                                                                                ),
                                                                            }}
                                                                            id="document-type" label="Add" variant="outlined" />
                                                                    </FormControl>}
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                    <Grid container className="mt-2">
                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                            <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertBlockStop()}>Submit</Button>
                                                        </Grid>
                                                    </Grid>
                                                    </Grid></Grid></Card>

                                                   
                                                
                                                   
                                                    </Card>
                                                    

                                            </Grid>
                                        </Grid>

                                        <Grid container justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3 customNoData">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Stops List
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <ReactTable
                                                                data={this.state.blocksList.map((original, key) => {
                                                                    return ({
                                                                        slno: key + 1,
                                                                        id: original.id,
                                                                        stop_name: original.stop_name,
                                                                        upward_time: original.upward_time,
                                                                        downward_time: original.downward_time,
                                                                        distance_from_school: original.distance_from_school,
                                                                        total_fee: original.total_fee,
                                                                        editable: original.editable,
                                                                        checked: original.checked,
                                                                        status: original.status,
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                                { /* use this button to add a like kind of action */}

                                                                                <Tooltip id="tooltip-top" title="Next" placement="top" >
                                                                                    <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => this.props.history.push("/admin/route-map-stops/" + original.id)}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                    >
                                                                                        <NextIcon />
                                                                                    </Button>
                                                                                </Tooltip>

                                                                                { /* use this button to add a like kind of action */}

                                                                                {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                    {original.editable ? <Button
                                                                                        className="m-2"
                                                                                        simple
                                                                                        onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id, key); }}
                                                                                        color="secondary"
                                                                                        className="edit"
                                                                                    >
                                                                                        <CheckCircleOutline />
                                                                                    </Button> : <Button
                                                                                        className="m-2"
                                                                                        simple
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
                                                                        Header: "Stop Name",
                                                                        accessor: "stop_name",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
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
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Upward Time",
                                                                        accessor: "upward_time",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
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
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Downward Time",
                                                                        accessor: "downward_time",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
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
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Distance from school",
                                                                        accessor: "distance_from_school",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
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
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    {
                                                                        Header: "Total Fee",
                                                                        accessor: "total_fee",
                                                                        className: "center",
                                                                        Filter: ({ filter, onChange }) => (
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
                                                                        ),
                                                                        // Cell: this.renderEditable
                                                                    },
                                                                    // {
                                                                    //     Header: "Actions",
                                                                    //     accessor: "actions",
                                                                    //     className: "center",
                                                                    //     sortable: false,
                                                                    //     filterable: false,
                                                                    // }
                                                                ]}
                                                                defaultFilterMethod={filterCaseInsensitive}
                                                                defaultPageSize={10}
                                                                showPaginationTop
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                            />
                                                        </Grid>
                                                    </Grid>


                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </div>}

                                    
                                   
                                </Grid>

                            </Grid>

                        </div>
                    </Animated>
                </Dialog>

            </Fragment>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(RoomFeeManagement);
