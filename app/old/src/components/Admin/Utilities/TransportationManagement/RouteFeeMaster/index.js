import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar,MenuItem, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
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
import Moment from "moment";

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
            blocksList: [{ route_no: '', route_name: '', starting_point: '', ending_point: '', vehicle_no: '', status: '' }],
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
            roomholders: [{ route_no: '', route_name: '', starting_point: '', ending_point: '',downward_time:'',upward_time:'' }],
            RouteStops: [{ stop_name: '', upward_time: '', downward_time: '', distance_from_school: '', total_fee: '' }],
            loading: true,
            selectedBoard: '',
            basicNotify: false,
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
            StaggeredInstallment: 0,
            EqualInstallment: 1,
            selectedDate: new Date(),
            installments:[{date:new Date(),percentage:0}],
            concessions:[{percentage:0,date:new Date(),rebate_percentage:0}],
            student_effective:1,
            installment_type:'equal',
            select_acad_year:'',
            acad_year:[],
            effective:1,

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

        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            routeDetails: this.state.roomholders,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('TransportationRouteMasters/insertRouteMaster', postData).then(response => {
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
                    this.setState({ basicNotify: false, roomholders: [{ route_no: '', route_name: '', starting_point: '', ending_point: '' }] });
                }, 2000)

            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            // this.raiseLoginSignupErrorAlert("signup");

        });
    }
    insertFeeConfig = () => {
        let headingStatus = "Fee Configuration Inserted!";

        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.state.select_acad_year,
            installment_type:this.state.installment_type,
            installments: this.state.installments,
            concessions: this.state.concessions,
            student_effective:this.state.student_effective,
            token: "abc",
            id_user: this.props.data.UID
        };
        console.log(postData);
        new Service().apiCall('TransportationRouteMasters/insertFeeConfig', postData).then(response => {
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
                // this.getBlocksData();
                setTimeout(() => {
                    this.setState({ basicNotify: false, installments:[{date:new Date(),percentage:0}],concessions:[{percentage:0,date:new Date(),rebate_percentage:0}], });
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
        let object = { route_no: '', route_name: '', starting_point: '', ending_point: '',upward_time:'',downward_time:'' };
        data.push(object);
        this.setState({ data });
    }

    removeBlock = (index) => {
        const { roomholders } = this.state;
        this.setState({ roomholders: roomholders.filter((data, i) => i !== index) })

    }
    addBlockInstallments = () => {
        let data = this.state.installments;
        let object = {date:new Date(),percentage:''};
        data.push(object);
        this.setState({ data });
    }
    removeBlockInstallments = (index) => {
        const { installments } = this.state;
        this.setState({ installments: installments.filter((data, i) => i !== index) })

    }
    addBlockConcessions = () => {
        let data = this.state.concessions;
        let object = {percentage:0,date:new Date(),rebate_percentage:0};
        data.push(object);
        this.setState({ data });
    }

    removeBlockConcessions = (index) => {
        const { concessions } = this.state;
        this.setState({ concessions: concessions.filter((data, i) => i !== index) })

    }

    getBlocksData = (id, type) => {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            type: type,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
        };
        new Service().apiCall('TransportationRouteMasters/getData', postData).then(response => {
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

    getUserData = (id, type) => {
        const postData = {
            
            UID: this.props.data.UID
            
        };
        new Service().apiCall('users/getUserDetails', postData).then(response => {
            console.log(response)
            if (response.status == 200 && response.data != '') {
                // const data = response.data.map((data) => {
                //     return { ...data, checked: false, editable: false, gross_rent: 0 };
                // });

                this.setState({ acad_year: response.data.academicyear });
                // this.state.UserData.academicyear.map((element, index)=> {
                   console.log(response.data.academicyear);
                // });

                
            } else {
                this.setState({ UserData: [] });
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
    handleChangeDataInstallments = (index, name, value) => {
        let data = this.state.installments;
        if(name=='date'){
            data[index][name] = Moment(value).format("YYYY-MM-DD");; 
        }else{
        data[index][name] = value;
        }
        this.setState({ data });
        console.log(data);
    };
   
    handleChangeDataConcessions = (index, name, value) => {
        let data = this.state.concessions;
        if(name=='date'){
            data[index][name] = Moment(value).format("YYYY-MM-DD");; 
        }else{
        data[index][name] = value;
        }
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
        this.getUserData();
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
                                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/transportation-management")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Route Master
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                        <div className="pt-100">

                            <Grid container spacing={4} className="sliderDiv">
                                <Grid item xs={12} md={8} lg={3}>
                                    <Card className="card-box ml-4 mb-4">
                                        <div className="text-center">
                                            <div className="pt-1">
                                                <List className="py-2">
                                                    <ListItem button className={this.state.actionType == "room_structure" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "room_structure", showStatus: 'all' }); }}>
                                                        <span>Route Master</span>
                                                    </ListItem>
                                                    <Divider />
                                                    <ListItem button className={this.state.actionType == "fee_configuration" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "fee_configuration", showStatus: 'all' }); }}>
                                                        <span>Fee Configuration</span>
                                                    </ListItem>
                                                    {/* <Divider />
                                              <ListItem button className={this.state.actionType == "food_fee" ?"my-2 activeSidebarColor":"my-2"} onClick={()=>{this.setState({actionType:"food_fee",showStatus:'all'});}}>
                                                  <span>Food Fee</span>
                                              </ListItem> */}
                                                </List>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={8} lg={9}>
                                    {/* Room Structure section */}
                                    {this.state.actionType == "room_structure" && <div>
                                        <Grid container justify="center">
                                            <Grid item xs={12} md={12} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Add Route
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    {this.state.roomholders.map((element, index) => (

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
                                                                        onChange={(event) => this.handleChangeData(index, "route_no", event.target.value)}
                                                                        value={element.block_name}
                                                                        id="document-type"
                                                                        label="Route#"
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
                                                                        onChange={(event) => this.handleChangeData(index, "route_name", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Route Name"
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
                                                                        onChange={(event) => this.handleChangeData(index, "starting_point", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Starting Point"
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
                                                                        onChange={(event) => this.handleChangeData(index, "ending_point", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Ending Point"
                                                                        type="search"
                                                                        variant="outlined" />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={10} md={2}></Grid>
                                                            <Grid item xs={12} sm={10} md={3}>
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        onChange={(event) => this.handleChangeData(index, "upward_time", event.target.value)}
                                                                        value={element.no_of_floors}
                                                                        id="document-type"
                                                                        label="Upward Time"
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
                                                                        Routes List
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <ReactTable
                                                                data={this.state.blocksList.map((original, key) => {
                                                                    return ({
                                                                        slno: key + 1,
                                                                        id: original.id,
                                                                        route_no: original.route_no,
                                                                        route_name: original.route_name,
                                                                        starting_point: original.starting_point,
                                                                        vehicle_no: original.vehicle_no,
                                                                        ending_point: original.ending_point,
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
                                                                        Header: "Route No",
                                                                        accessor: "route_no",
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
                                                                        Header: "Route Name",
                                                                        accessor: "route_name",
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
                                                                        Header: "Starting Point",
                                                                        accessor: "starting_point",
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
                                                                        Header: "Ending Point",
                                                                        accessor: "ending_point",
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
                                                                                placeholder="Search Name"
                                                                                type="text"
                                                                                onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        ),
                                                                        // Cell: this.renderEditable
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
                                                        </Grid>
                                                    </Grid>


                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </div>}

                                    {/* Fee Configuration section */}
                                    {this.state.actionType == "fee_configuration" && <div>
                                    
                                    <Grid container justify="center">
                                            <Grid item xs={12} md={8} lg={8}>
                                                <Card className="card-box  mb-4 p-3">
                                    <Grid container spacing={4} justify="center">
                                                <Grid item xs={12} md={12} lg={5}>
                                                    <FormControl >
                                                        <FormLabel  >
                                                        <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                        <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                        Select Academic Year :
                                                        </h4>
                                                        </div>
                                                        </div></FormLabel>
                                                        
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={3}>
                                                    <FormControl fullWidth>
                                                        <TextField                        
                                                            id="outlined-select-currency"
                                                            select
                                                            label="Select Year"
                                                            variant="outlined"
                                                            value={this.state.select_acad_year}
                                                            onChange={(event) => this.setState({select_acad_year:event.target.value})}>
                                                            {this.state.acad_year.map(option => (
                                                            <MenuItem key={option.label} value={option.id} id={option.label} justify="center">
                                                                {option.label}
                                                            </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid> 
                                            </Card>
                                            </Grid>
                                            </Grid>

                                            { 
                                                this.state.select_acad_year !="" &&  

                                        <Grid container justify="center">
                                            <Grid item xs={12} md={8} lg={11}>
                                                <Card className="card-box  mb-4 p-3">
                                                    <Grid container>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <div className="card-header pl-0">
                                                                <div className="card-header--title">
                                                                    <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Fee Configuration
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                    <Card className="card-box  mb-4 p-3">
                                                        <Grid container spacing={4} justify="center">

                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h5 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                            Installments
                                                                    </h5>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} md={8} lg={12} className="text-center">
                                                                {/* { this.state.EqualInstallment > 0 &&   */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Radio
                                                                             checked={this.state.EqualInstallment>0}
                                                                             onChange={() => {this.setState({EqualInstallment:1});
                                                                             this.setState({StaggeredInstallment:0});
                                                                             this.setState({installment_type:'equal'});
                                                                             }}
                                                                            value="block_wise"
                                                                            name="radio button enabled"
                                                                            aria-label="B"

                                                                        />
                                                                    }
                                                                    label="Equal Installment"
                                                                />
                                                                {/* } */}


                                                                {/* { this.state.StaggeredInstallment > 0 &&     */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Radio
                                                                            checked={this.state.StaggeredInstallment>0}
                                                                            onChange={() => {this.setState({EqualInstallment:0});
                                                                            this.setState({StaggeredInstallment:1});
                                                                            this.setState({installment_type:'staggered'});
                                                                            }}
                                                                            value="floor_wise"
                                                                            name="radio button enabled"
                                                                            aria-label="B"


                                                                        />
                                                                    }

                                                                    label="Staggered Installment"
                                                                />
                                                                {/* } */}


                                                            </Grid>
                                                            
                                                            { this.state.EqualInstallment > 0 &&  
                                                            <Grid item xs={12} md={12} lg={12}>

                                                                {this.state.installments.map((element, index) => (

                                                                    <Grid container spacing={2} justify='center'>
                                                                        <Grid item xs={12} sm={10} lg={1} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {index + 1}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={5} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {'Pay instalment -  ' + (index + 1) + 'on or before'}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} md={5}>
                                                                            {/* <FormControl fullWidth> */}
                                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                                <KeyboardDatePicker 
                                                                                disableToolbar
                                                                                autoOk={true}
                                                                                variant="inline"
                                                                                inputVariant="outlined"
                                                                                format="dd/MM/yyyy"
                                                                                margin="normal"
                                                                                id="date-picker-inline"
                                                                                label="date"
                                                                                value={element.date}
                                                                                onChange={date=>this.handleChangeDataInstallments(index,"date", date)}
                                                                                KeyboardButtonProps={{
                                                                                'aria-label': 'change date',
                                                                                }}
                                                                                />
                                                                                </MuiPickersUtilsProvider>
                                                                            {/* </FormControl> */}
                                                                        </Grid>





                                                                        <Grid item xs={12} sm={12} lg={1}>
                                                                            {index == 0 ? <FormControl fullWidth>
                                                                                <TextField
                                                                                    InputProps={{
                                                                                        autoComplete: 'off',
                                                                                        readOnly: true,
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start">
                                                                                                <Add onClick={() => this.addBlockInstallments()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
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
                                                                                                    <Remove onClick={() => this.removeBlockInstallments(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer' }} />
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        id="document-type" label="Add" variant="outlined" />
                                                                                </FormControl>}
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}
                                                                <Grid container className="mt-2">

                                                                </Grid>
                                                            </Grid>
                                                             }
                                                             { this.state.StaggeredInstallment > 0 &&    
                                                            <Grid item xs={12} md={12} lg={12}>

                                                                {this.state.installments.map((element, index) => (

                                                                    <Grid container spacing={2} justify='center'>
                                                                        <Grid item xs={12} sm={10} lg={1} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {index + 1}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={2} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {'Pay '}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={2} lg={1}>
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                            inputProps={{
                                                                                autoComplete: 'off',
                                                                                style: { textTransform: 'capitalize' }
                                                                            }}
                                                                            onChange={(event)=>this.handleChangeDataInstallments(index,"percentage", event.target.value)}
                                                                            value={element.percentage}
                                                                            id="document-type"
                                                                            label=""
                                                                            type="search"
                                                                            variant="outlined" />
                                                                        </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={2} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {' % on or before '}
                                                                            </FormControl>
                                                                        </Grid>

                                                                        <Grid item xs={12} sm={10} md={5}>
                                                                            {/* <FormControl fullWidth> */}
                                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                                <KeyboardDatePicker 
                                                                                disableToolbar
                                                                                autoOk={true}
                                                                                variant="inline"
                                                                                inputVariant="outlined"
                                                                                format="dd/MM/yyyy"
                                                                                margin="normal"
                                                                                id="date-picker-inline"
                                                                                label="date"
                                                                                value={element.date}
                                                                                onChange={date => this.handleChangeDataInstallments(index, "date", date)}
                                                                                KeyboardButtonProps={{
                                                                                'aria-label': 'change date',
                                                                                }}
                                                                                />
                                                                                </MuiPickersUtilsProvider>
                                                                            {/* </FormControl> */}
                                                                        </Grid>





                                                                        <Grid item xs={12} sm={12} lg={1}>
                                                                            {index == 0 ? <FormControl fullWidth>
                                                                                <TextField
                                                                                    InputProps={{
                                                                                        autoComplete: 'off',
                                                                                        readOnly: true,
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start">
                                                                                                <Add onClick={() => this.addBlockInstallments()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
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
                                                                                                    <Remove onClick={() => this.removeBlockInstallments(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer' }} />
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        id="document-type" label="Add" variant="outlined" />
                                                                                </FormControl>}
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}
                                                                <Grid container className="mt-2">

                                                                </Grid>
                                                            </Grid>
                                                            }
                                                            </Grid></Card>
                                                            
                                                    <Card className="card-box  mb-4 p-3">
                                                        <Grid container>

                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h5 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                            Concession
                                                                    </h5>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12}>

                                                                {this.state.concessions.map((element, index) => (

                                                                    <Grid container spacing={4}>
                                                                        <Grid item xs={12} sm={10} lg={1} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {index + 1}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={1} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {' pay '}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={2} lg={1}>
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                            inputProps={{
                                                                                autoComplete: 'off',
                                                                                style: { textTransform: 'capitalize' }
                                                                            }}
                                                                            onChange={(event)=>this.handleChangeDataConcessions(index,"percentage", event.target.value)}
                                                                            value={element.percentage}
                                                                            id="document-type"
                                                                            label=""
                                                                            type="search"
                                                                            variant="outlined" />
                                                                        </FormControl>
                                                                        </Grid>

                                                                        <Grid item xs={12} sm={10} lg={2} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {' % on or before '}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} md={2}>
                                                                            {/* <FormControl fullWidth> */}
                                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                                <KeyboardDatePicker 
                                                                                disableToolbar
                                                                                autoOk={true}
                                                                                variant="inline"
                                                                                inputVariant="outlined"
                                                                                format="dd/MM/yyyy"
                                                                                margin="normal"
                                                                                id="date-picker-inline"
                                                                                label="date"
                                                                                value={element.date}
                                                                                onChange={date=>this.handleChangeDataConcessions(index,"date", date)}
                                                                                KeyboardButtonProps={{
                                                                                'aria-label': 'change date',
                                                                                }}
                                                                                />
                                                                                </MuiPickersUtilsProvider>
                                                                            {/* </FormControl> */}
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={1} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {' get '}
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={2} lg={1}>
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                            inputProps={{
                                                                                autoComplete: 'off',
                                                                                style: { textTransform: 'capitalize' }
                                                                            }}
                                                                            onChange={(event)=>this.handleChangeDataConcessions(index,"rebate_percentage", event.target.value)}
                                                                            value={element.rebate}
                                                                            id="document-type"
                                                                            label=""
                                                                            type="search"
                                                                            variant="outlined" />
                                                                        </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={10} lg={2} align="center">
                                                                            <FormControl fullWidth style={{ paddingTop: "10px" }}>
                                                                                {' % rebate '}
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
                                                                                                <Add onClick={() => this.addBlockConcessions()} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
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
                                                                                                    <Remove onClick={() => this.removeBlockConcessions(index)} style={{ color: 'rgb(248, 50, 69)', cursor: 'pointer' }} />
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                        id="document-type" label="Add" variant="outlined" />
                                                                                </FormControl>}
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}

                                                            </Grid>
                                                            
                                                            
                                                            </Grid></Card>

                                                    <Card className="card-box  mb-4 p-3">
                                                        <Grid container>

                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h5 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                            Student shuffling calculation

                                                                    </h5>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <p>On suffling of student from one stop to another, the charges should be calculated based on following condition</p>

                                                                <Grid container className="mt-2">

                                                                <Grid item xs={12} md={8} lg={12} className="text-center">
                                                                {/* { this.state.EqualInstallment > 0 &&   */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Radio
                                                                             checked={this.state.student_effective>0}
                                                                             onChange={() => {this.setState({student_effective:1});
                                                                            //  this.setState({StaggeredInstallment:0});
                                                                             
                                                                             }}
                                                                            value="block_wise"
                                                                            name="radio button enabled"
                                                                            aria-label="B"

                                                                        />
                                                                    }
                                                                    label="Prorata from effective date"
                                                                />
                                                                {/* } */}


                                                                {/* { this.state.StaggeredInstallment > 0 &&     */}
                                                                <FormControlLabel
                                                                    control={
                                                                        <Radio
                                                                            checked={this.state.student_effective<1}
                                                                            onChange={() => {this.setState({student_effective:1});
                                                                            // this.setState({StaggeredInstallment:1});
                                                                            // this.setState({installment_type:'staggered'});
                                                                            }}
                                                                            value="floor_wise"
                                                                            name="radio button enabled"
                                                                            aria-label="B"


                                                                        />
                                                                    }

                                                                    label="Higher fee from begining of the month"
                                                                />
                                                                {/* } */}


                                                            </Grid>
                                                            
                                                                    <Grid container className="mt-2">
                                                                        <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                            <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertFeeConfig()}>Submit</Button>
                                                                        </Grid>
                                                                    </Grid>

                                                                </Grid>
                                                            </Grid></Grid></Card>




                                                </Card>


                                            </Grid>
                                        </Grid>
                                            }

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
