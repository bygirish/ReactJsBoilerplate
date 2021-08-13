import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChipInput from 'material-ui-chip-input';
import "@assetss/custom.scss";
import { Animated } from "react-animated-css";
import { Badge, Grid, Switch, FormControlLabel, ButtonGroup, Dialog, CardActions, Toolbar, Card, CardContent, Fab, TextField, Button, Avatar, List, ListItem, Slide, FormControl, Box, Tooltip, AppBar, IconButton, Typography, FormLabel, MenuItem } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import moment from 'moment';
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
            dialogOpen: true,
            basicNotify: false,
            academicMasterList: [],
            masterList: [],
            showStatus: 'all',
            BoardDataid: [],
            CourseDataid: [],
            StreamDataid: [],
        };

    }

    getBoardMasterInfo() {
        const postData = {
            id: this.props.data.selectedInstitutionId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            boardId: this.props.data.selectedBoardId,

            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getBoardMasterInfo', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                console.log(response)
                if (response.data) {
                    let data = [];



                    this.setState({ BoardDataid: response.data });
                }
            } else {
                this.setState({ BoardDataid: [] });
            }
        }).catch(error => {
            //
        });
    }
    getCourseMasterWithBoardId(boardId) {
        const postData = {
            id: this.props.data.selectedInstitutionId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            boardId: boardId,

            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getCourseMasterWithBoardId', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                console.log(response)
                if (response.data) {
                    let data = [];



                    this.setState({ CourseDataid: response.data });
                }
            } else {
                this.setState({ CourseDataid: [] });
            }
        }).catch(error => {
            //
        });
    }
    getStreamMasterWithBoardId(courseId) {
        const postData = {
            id: this.props.data.selectedInstitutionId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            boardId: this.state.BoardId,
            courseId: courseId,

            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getStreamMasterWithBoardId', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                console.log(response)
                if (response.data) {
                    let data = [];



                    this.setState({ StreamDataid: response.data });
                }
            } else {
                this.setState({ StreamDataid: [] });
            }
        }).catch(error => {
            //
        });
    }


    handleAddChip = (chip) => {
        let capitalize = chip.charAt(0).toUpperCase() + chip.slice(1);
        this.setState(state => ({ masterList: [...state.masterList, capitalize.replace(/[^a-zA-Z\.,]/g, '')] }));
    }

    handleDeleteChip = (chip, i) => {
        const { masterList } = this.state;
        this.setState({
            masterList: masterList.filter((tag, index) => index !== i),
        });
    }

    getMasterInfo() {
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getCombinationMasterInfo', postData).then(response => {
            if (response.status == 200 && response.data != '') {

                if (response.status == 200 && response.data != '') {
                    const newArr = response.data.map(v => ({ ...v, editable: false }));
                    console.log({ newArr });
                    if (this.state.showStatus == 'all') {
                        this.setState({ academicMasterList: newArr });
                    }
                    else {
                        var newArray = newArr.filter(x => x.status == this.state.showStatus);
                        this.setState({ academicMasterList: newArray });
                    }
                }
            }
        }).catch(error => {
            //  alert("error");

        });

    }

    insertMaster = () => {
        let headingArray = [];

        let sCount = this.state.masterList.length;
        let sText = "";

        let endpoint = "AcademicSettings/insertCombinationMasterInfo";

        this.state.masterList.forEach(element => {
            headingArray.push(element);
        })
        const postData = {
            name: headingArray,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.BoardId,
            id_course: this.state.CourseId,
            id_stream: this.state.StreamId,
            id_academicyear: this.props.data.selectedAcademicId,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall(endpoint, postData).then(response => {
            if (response.data == 201) {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Combination Already Exist</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    this.setState({ basicNotify: false });
                    window.location.reload()
                }, 2000)
            }
            else if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{sCount + " " + sText + "  Inserted!"}</h4>
                            </div>
                        </Dialog>
                    ),
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            } else {
                this.setState({
                    alert: (
                        <SweetAlert
                            style={{ display: "block", marginTop: "-100px", zIndex: 999999 }}
                            title={response}
                            showConfirm={false}
                        >
                        </SweetAlert>
                    ),

                });
                setTimeout(() => {
                    this.setState({ alert: null, categorytags: [] });
                }, 2000)
            }
        }).catch(error => {
            //console.log(error); 
        });
    }

    updateHeading = (id, index) => {
        let data = this.state.academicMasterList;
        let combination = data[index].combination;
        let board = data[index].board;
        let board_id = data[index].board_id;
        let course = data[index].course;
        let course_id = data[index].course_id;
        let stream = data[index].stream;
        let stream_id = data[index].stream_id;

        let endpoint = "AcademicSettings/UpdateCombinationMasterInfo";

        console.log({ data });

        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            id: id,
            name: combination,
            board: board,
            board_id: board_id,
            course: course,
            course_id: course_id,
            stream: stream,
            stream_id: stream_id,

            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall(endpoint, postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Updated Successfully</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getMasterInfo();
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

    handleInputChange = (cellInfo, event) => {
        let data = [...this.state.academicMasterList];
        data[cellInfo.index][cellInfo.column.id] = event.target.value;
        this.setState({ data });
    };
    rowEdit = (estatus, index) => {

        let lcategories = this.state.academicMasterList;
        if (estatus == true) {
            lcategories[index].editable = false;
        }
        else {
            lcategories[index].editable = true;
        }
        this.setState({ academicMasterList: lcategories });
    }
    renderEditable = (cellInfo) => {

        const cellValue = this.state.academicMasterList[cellInfo.index][cellInfo.column.id];
        if (cellInfo.original.editable) {
            return (
                <FormControl fullWidth>
                    <TextField
                        inputProps={{
                            autoComplete: 'off'
                        }}
                        id="sno"
                        value={cellValue}
                        placeholder="S No"
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

    handleDeactive = (name, id, status) => {
        let headingStatus = name + " Activated!";
        if (status == 1) {
            headingStatus = name + " Deactivated!";
        }
        let endpoint = "AcademicSettings/deleteCombinationMasterInfo";
        // if(this.state.mastertype == "academic"){
        //   endpoint = "feesMasters/deleteFeemaster";
        // }
        // else if(this.state.mastertype == "nonacademic"){
        //   endpoint = "feesMasters/deleteFeemaster";
        // }
        // else if(this.state.mastertype == "categories"){
        //   endpoint = "categories/deleteCategory";
        // }
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall(endpoint, postData).then(response => {
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
                this.getMasterInfo();
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

    refreshData = () => {

        this.getMasterInfo();


    }

    componentDidMount() {
        const split = window.location.href.split("/");
        const mastertype = split[split.length - 2];
        const actionType = split[split.length - 1];
        this.getMasterInfo();
        this.getBoardMasterInfo();
        this.getCourseMasterWithBoardId();
        this.getStreamMasterWithBoardId();

    }

    render() {
        return (
            <Fragment>
                {this.state.basicNotify}
                <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
                    <AppBar className="app-header" color="secondary" position="fixed">
                        <Toolbar className="w-100">
                            <Grid container>
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/master-data")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        {'Combination Master'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                    <div className="pt-100">
                        <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} lg={8}>

                                    <Card className="card-box  mb-3 mt-2 p-3">
                                        <Grid container justify="center">

                                            {/* <Grid item xs={12} md={5} lg={2}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend" className="pt-3 pb-3" style={{ color: 'black' }}><h5>Select Board :</h5></FormLabel>
                                                </FormControl>
                                            </Grid> */}
                                            <Grid item xs={12} md={4} lg={4} className=" my-2 px-2 pt-1 pb-3">
                                                <FormControl fullWidth>
                                                    <TextField
                                                        // id="outlined-select-currency"
                                                        select
                                                        label="Select Board"
                                                        variant="outlined"
                                                        value={this.state.BoardId}
                                                        onChange={(event) => {

                                                            this.setState({ BoardId: event.target.value });
                                                            this.getCourseMasterWithBoardId(event.target.value);
                                                        }
                                                        }

                                                    >

                                                        {this.state.BoardDataid.map(option => (
                                                            <MenuItem key={option.name} value={option.id} id={option.name}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>

                                                </FormControl>
                                            </Grid>

                                            {this.state.BoardId &&
                                                <>
                                                    {/* <Grid container justify="center"> */}
                                                    {/* <Grid item xs={12} md={5} lg={2}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend" className="pt-3 pb-3" style={{ color: 'black' }}><h5>Select Course :</h5></FormLabel>
                                                </FormControl>
                                            </Grid> */}
                                                    <Grid item xs={12} md={4} lg={4} className=" my-2 px-2 pt-1 pb-3">
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                // id="outlined-select-currency"
                                                                select
                                                                label="Select Course"
                                                                variant="outlined"
                                                                value={this.state.CourseId}
                                                                onChange={(event) => {

                                                                    this.setState({ CourseId: event.target.value })
                                                                    this.getStreamMasterWithBoardId(event.target.value);
                                                                }
                                                                }

                                                            >

                                                                {this.state.CourseDataid.map(option => (
                                                                    <MenuItem key={option.course} value={option.id} id={option.course}>
                                                                        {option.course}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>

                                                        </FormControl>
                                                    </Grid>
                                                    {/* </Grid> */}
                                                </>
                                            }

                                            {this.state.BoardId && this.state.CourseId &&
                                                <>
                                                    {/* <Grid container justify="center"> */}
                                                    {/* <Grid item xs={12} md={5} lg={2}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend" className="pt-3 pb-3" style={{ color: 'black' }}><h5>Select Stream :</h5></FormLabel>
                                                </FormControl>
                                            </Grid> */}
                                                    <Grid item xs={12} md={4} lg={4} className=" my-2 px-2 pt-1 pb-3">
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                // id="outlined-select-currency"
                                                                select
                                                                label="Select Stream"
                                                                variant="outlined"
                                                                value={this.state.StreamId}
                                                                onChange={(event) =>

                                                                    this.setState({ StreamId: event.target.value })
                                                                }

                                                            >

                                                                {this.state.StreamDataid.map(option => (
                                                                    <MenuItem key={option.stream} value={option.id} id={option.stream}>
                                                                        {option.stream}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>

                                                        </FormControl>
                                                    </Grid>
                                                    {/* </Grid> */}
                                                </>
                                            }

                                            {this.state.BoardId && this.state.CourseId && this.state.StreamId &&
                                                <>
                                                    <Grid item xs={12} sm={12} lg={12} className="customChip">
                                                        <FormControl fullWidth>
                                                            <ChipInput
                                                                variant="outlined"
                                                                className="inputTag"
                                                                label={"Add Combination and press 'Enter'"}
                                                                value={this.state.masterList}
                                                                onAdd={(chip) => this.handleAddChip(chip)}
                                                                onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                            }


                                            {this.state.showNextBtn && <Grid item xs={12} sm={12} lg={1} className="pickerGrid">
                                                <Avatar onClick={() => this.checkInputkFilled()}>
                                                    <NavigateNext />
                                                </Avatar>
                                            </Grid>}
                                        </Grid>
                                        {this.state.BoardId &&
                                            <>
                                                <Grid container justify="center">
                                                    <Grid item xs={12} sm={12} lg={12} className="text-right pt-2">
                                                        <Button className="successBtnOutline" variant="outlined" onClick={() => this.insertMaster()}>
                                                            Submit
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }

                                    </Card>

                                </Grid>

                                <Grid item xs={12} sm={12} lg={8}>
                                    <Card className="card-box  mb-4 customNoData">
                                        <div className="card-header">
                                            <div className="card-header--title">
                                                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                                                    {this.state.selectedHeading}
                                                </h4>
                                            </div>
                                            <div className="card-header--actions">
                                                <Box>
                                                    <ButtonGroup size="small" className="m-2">
                                                        <Button color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 'all' }); this.refreshData() }}>
                                                            All
                                                        </Button>
                                                        <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 1 }); this.refreshData() }}>
                                                            Active
                                                        </Button>
                                                        <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained" : "outlined"} style={{ fontWeight: 500 }} onClick={() => { this.setState({ showStatus: 0 }); this.refreshData() }}>
                                                            InActive
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            </div>
                                        </div>



                                        <ReactTable

                                            data={
                                                this.state.academicMasterList.map((original, key) => {
                                                    return ({
                                                        slno: key + 1,
                                                        board: original.board,
                                                        course: original.course,
                                                        stream: original.stream,
                                                        combination: original.combination,
                                                        created_date: original.created_at ? moment(original.created_at).format("DD/MM/YYYY") : '',
                                                        editable: original.editable,
                                                        actions: (
                                                            // we've added some custom button actions
                                                            <div className="grouplist-actions">
                                                                { /* use this button to add a like kind of action */}

                                                                <Tooltip
                                                                    id="tooltip-top"
                                                                    title={original.editable ? "Save" : "Edit"}
                                                                    placement="top"
                                                                >
                                                                    {original.editable ? <Button
                                                                        className="m-2"
                                                                        simple
                                                                        onClick={() => { this.updateHeading(original.id, key); }}
                                                                        color="secondary"
                                                                        className="edit"
                                                                    >
                                                                        <CheckCircleOutline />
                                                                    </Button> : <Button
                                                                        className="m-2"
                                                                        disabled={original.status == 1 ? false : true}
                                                                        simple
                                                                        onClick={() => { this.rowEdit(original.editable, key); }}
                                                                        color="secondary"
                                                                        className="edit"
                                                                    >
                                                                        <EditIcon />
                                                                    </Button>}

                                                                </Tooltip>

                                                                {/* use this button to remove the data row */}
                                                                <Tooltip
                                                                    id="tooltip-delete"
                                                                    title={original.status == 1 ? "Deactivate" : "Activate"}
                                                                    placement="top"

                                                                >
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={original.status == 1 ? true : false}
                                                                                onChange={() => this.handleDeactive(original.combination, original.id, original.status)}
                                                                                value="checkedA"
                                                                            />
                                                                        }
                                                                        label=""
                                                                    />
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
                                                    width: 90,
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="slno"
                                                            value={filter ? filter.value : ''}
                                                            placeholder="S No"
                                                            type="text"
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    )
                                                },
                                                {
                                                    Header: "Board",
                                                    accessor: "board",
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="search"
                                                            value={filter ? filter.value : ''}
                                                            placeholder={"Search board"}
                                                            type="text"
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    ),
                                                    Cell: this.renderEditable
                                                },
                                                {
                                                    Header: "Course",
                                                    accessor: "course",
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="search"
                                                            value={filter ? filter.value : ''}
                                                            placeholder={"Search Course"}
                                                            type="text"
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    ),
                                                    Cell: this.renderEditable
                                                },
                                                {
                                                    Header: "Stream",
                                                    accessor: "stream",
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="search"
                                                            value={filter ? filter.value : ''}
                                                            placeholder={"Search stream"}
                                                            type="text"
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    ),
                                                    Cell: this.renderEditable
                                                },
                                                {
                                                    Header: "Combination",
                                                    accessor: "combination",
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="search"
                                                            value={filter ? filter.value : ''}
                                                            placeholder={"Search Combination"}
                                                            type="text"
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    ),
                                                    Cell: this.renderEditable
                                                },
                                                {
                                                    Header: "Created Date",
                                                    accessor: "created_date",
                                                    className: "center",
                                                    Filter: ({ filter, onChange }) => (
                                                        <TextField
                                                            inputProps={{
                                                                autoComplete: 'off'
                                                            }}
                                                            id="cdate"
                                                            value={filter ? filter.value : ''}
                                                            placeholder="Search Date"
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
                                        <CardActions style={{ marginTop: 0 }}>
                                            <Grid container>
                                                <Grid item xs={12} md={4} lg={6}></Grid>
                                                {/* <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid> */}
                                            </Grid>
                                        </CardActions>

                                    </Card>
                                </Grid>
                            </Grid>

                        </Animated>
                    </div>
                </Dialog>

            </Fragment>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
