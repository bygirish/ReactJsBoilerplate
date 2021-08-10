import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar, MenuItem, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel, Avatar } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
// import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import 'react-table-6/react-table.css';
import { withRouter } from 'react-router-dom';
import { Animated } from "react-animated-css";
import GroupWork from "@material-ui/icons/GroupWork";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
// import defaultImage from "../../../../assets/images/placeholder.jpg";
import defaultImage from "@assetss/images/placeholder.jpg";
// import logo from "../../../assets/images/egenius_logo.png";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
// import "../../../assets/custom.scss";
// import Service from '../../../../utils/Service';
import Service from '@utils/Service.js';
import Config from '../../../../config';
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "green"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        "& .MuiOutlinedInput-input": {
            color: "green"
        },
        "&:hover .MuiOutlinedInput-input": {
            color: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
            color: "purple"
        },
        "& .MuiInputLabel-outlined": {
            color: "green"
        },
        "&:hover .MuiInputLabel-outlined": {
            color: "red"
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "purple"
        }
    }
});

const styles = theme => ({
    cssLabelRed: {
        color: 'red'
    },
    cssLabelBlue: {
        color: 'blue'
    },

    cssFocused: {},

    notchedOutlineRed: {
        borderColor: 'red !important'
    },
    notchedOutlineBlue: {
        borderColor: 'blue !important'
    }
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
const fileInput = React.createRef();
const fileInput1 = React.createRef();
const fileInput2 = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

class ClassMaster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: 'all',
            dialogOpen: true,
            selectedDate: new Date(),
            enddate: new Date(),
            selectedSection: '',
            selectedStandard: '',
            studentInfo: '',
            tags: [],
            mapclassDetails: [],
            filterSections: [],
            lstandardSections: [],
            streamDetails: [],
            standardSections: [],
            standardSuggestions: [],
            classmasterDetails: [],
            academicsetting: [],
            documentInfo: '',
            classholders: [{ standards: '', sections: '', streams: '', academics: '' }],
            stream: [{ stream: '' }],
            documentHolders: [{ type: '', no_of_sheets: '', unique_no: '' }],
            suggestions: [],
            studentSuggestions: [],
            studentDocuments: [],
            basicNotify: false,
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
            AllStream: [],
            selectedStaff: [],
            staffArr: [],
            imagePreviewUrl: defaultImage,
            imagePreviewUrl1: defaultImage,
            imagePreviewUrl2: defaultImage,
            name: '',
            orgInfoApi: {
                org_name: '', inst_name: '', inst_logo: '', inst_district: '', inst_state: '', inst_pincode: '', inst_address1: '', inst_address2: '', inst_taluk: '', inst_contact1: '', inst_contact2: '', inst_email1: '', inst_email2: '', inst_post_office: '',
                corp_district: '', corp_state: '', corp_pincode: '', corp_address1: '', corp_address2: '', corp_taluk: '', corp_contact1: '', corp_contact2: '', corp_email1: '', corp_email2: '', corp_post_office: ''
            },

            orgInfo: {
                org_name: '', inst_name: '', inst_logo: '', inst_district: '', inst_state: '', inst_pincode: '', inst_address1: '', inst_address2: '', inst_taluk: '', inst_contact1: '', inst_contact2: '', inst_email1: '', inst_email2: '', id_organization: this.props.data.selectedOrganizationId,
                id_user: this.props.data.UID, inst_post_office: ''
            },
            description: '',
            selectedFile: null,
            selectedFile1: null,
            selectedFile2: null,
            Board_nameI: [],
            CourseNameI: [],
            Board_name: [],
            BoardData: '',
            BoardMaster: [{ id: '1', name: 'CBSE' }, { id: '2', name: 'STATE BOARD' }],
            CourseName: [],
            CourseMaster: [{ id: '1', name: 'PUC' }, { id: '2', name: 'BSC' }],
            StreamMaster: [{ id: '1', name: 'SCIENCE', course: 'PUC' }, { id: '2', name: 'COMMERCE', course: 'PUC' }],
            StreamName: [],
            CombinationMaster: [{ id: '1', name: 'PCMB', stream: 'SCIENCE' }, { id: '2', name: 'PCMC', stream: 'SCIENCE' }, { id: '3', name: 'ABMS', stream: 'COMMERCE' }, { id: '4', name: 'ABES', stream: 'COMMERCE' }],
            BoardCourseHolders: [{ BoardData: [], CourseData: [], StreamData: [], CombinationData: [], filterCourse: [], filterStream: [], filterCombination: [] }],
            CombinationName: [],
            pincodesArr: [],
            selectInstitutionPanel: false,
            mappStreamCourse: false,
            instituteId: '',
            boardId: '',
            courseId: '',
            filterCombination: [],
            BoardDataid: [],
            CourseDataid: [],
            StreamCombinationMaster: [],
            InstitutionDataid: { name: '', address1: '', address2: '', taluk: '', district: '', state: '', pincode: '', post_office: '', office_tel1: '', office_tel2: '', office_email1: '', office_email2: '', id_user: this.props.data.UID },
            BoardCourseMaster: [],
            same_address: false,
            activeStep: 0,
            openBoard: false,
            validatecolorEmail1: '',
            validatecolorEmail2: '',
            validatecolorContact1: '',
            validatecolorContact2: '',

        };
        this.textInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);

    }
    handleAddress = (status) => {
        let data = this.state.orgInfo;
        // console.log(this.state.orgInfoApi.inst_address1);
        // data[name] = value;
        if (status == false) {
            data['inst_address1'] = this.state.orgInfoApi.inst_address1;
            data['inst_address2'] = this.state.orgInfoApi.inst_address2;
            data['inst_pincode'] = this.state.orgInfoApi.inst_pincode;
            data['inst_taluk'] = this.state.orgInfoApi.inst_taluk;
            data['inst_district'] = this.state.orgInfoApi.inst_district;
            data['inst_state'] = this.state.orgInfoApi.inst_state;
            data['inst_contact1'] = this.state.orgInfoApi.inst_contact1;
            data['inst_contact2'] = this.state.orgInfoApi.inst_contact2;
            data['inst_email1'] = this.state.orgInfoApi.inst_email1;
            data['inst_email2'] = this.state.orgInfoApi.inst_email2;
            data['inst_post_office'] = this.state.orgInfoApi.inst_post_office;

            this.setState({ data });
            this.setState({ same_address: !status });
        }
        else {
            data['inst_address1'] = '';
            data['inst_address2'] = '';
            data['inst_pincode'] = '';
            data['inst_taluk'] = '';
            data['inst_district'] = '';
            data['inst_state'] = '';
            data['inst_contact1'] = '';
            data['inst_contact2'] = '';
            data['inst_email1'] = '';
            data['inst_email2'] = '';
            data['inst_post_office'] = '';
            // this.setState({orgInfoApi[corp_address1]:this.state.orgInfoApi.inst_address1,same_address:!status})
            this.setState({ data });
            this.setState({ same_address: !status });
            // this.setState({permanent_address1:'',permanent_address2:'', permanent_pincode:'',permanent_city:'',permanent_post_office:'',permanent_district:'',permanent_state:'',same_address:!status})
        }
    }
    getOrganizationData() {
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoardId,
            id_academicyear: this.state.selectedAcademicYear,
        }
        new Service().apiCall('AcademicSettings/getOrgInfo', postData).then(response => {
            // console.log(response)
            if (response.status == 200 && response.data != '') {

                this.setState({
                    orgInfoApi: response.data
                    // ,imagePreviewUrl:response.data.org_logo?Config.path+"writable/uploads/organization_logo/"+response.data.org_logo : this.state.imagePreviewUrl1,selectedFile:response.data.org_logo,imagePreviewUrl1:response.data.fav_logo?Config.path+"writable/uploads/fav_logo/"+response.data.fav_logo : this.state.imagePreviewUrl1,selectedFile1:response.data.fav_logo
                });

            }
        }).catch(error => {
            console.log(error)

        });
    }


    focusTextInput() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        setTimeout(() => {
            this.textInput.current.focus();
        }, 100);
    }
    selectJoiningStandard = (value) => {
        this.setState({ joiningStandard: value });
    }
    getStateValue = (name) => {
        return this.state.name;
    }

    handleDateChange = (date) => {
        this.setState({ selectedDate: date })
    };
    handleEndDate = (enddate) => {
        this.setState({ enddate: enddate })
    };



    getAcademicSettingData() {
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getData', postData).then(response => {
            console.log(response)
            if (response.status == 200 && response.data != '') {
                if (response.data) {
                    this.setState({ academicsetting: response.data });
                }
            }
        }).catch(error => {
            console.log(error)

        });
    }


    verifyNumber = value => {
        var numberRex = new RegExp("^[0-9]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    };
    verifyInput = value => {
        var numberRex = new RegExp("^[A-Za-z]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    };


    handleDateOfBirth = (dob) => {
        this.setState({ dateOfBirth: dob })
    };

    handleClassMasterData = (pIndex, inputName, pValue) => {
        let lclassholders = this.state.classholders;
        lclassholders[pIndex][inputName] = pValue;

        this.setState({ classholders: lclassholders });
        console.log(this.state.classholders)

    }
    searchStaff = (idx, values) => {
        // console.log('id'+idx);
        // console.log(values)

        let data = [];

        let BoardCourseHolders = this.state.BoardCourseHolders;
        BoardCourseHolders[idx]['BoardData'] = values;
        BoardCourseHolders[idx]['filterCourse'] = this.state.CourseMaster;
        this.setState({ BoardCourseHolders });

        this.setState({ Board_name: values, BoardData: data })

    }
    searchStaffCourse = (idx, values) => {
        console.log(values);
        //this.setState({selectedStaff:values})
        let data = [];
        let Eid = '';
        let key = 0;
        // if(values){
        //     const listItems = values.map((myList, index) =>  
        //         data.push(myList.name)         
        //     ); 
        // }
        let BoardCourseHolders = this.state.BoardCourseHolders;
        BoardCourseHolders[idx]['CourseData'] = values;
        if (values != null && values.name != null) {
            let i = values.name;
            let StreamMaster = this.state.StreamMaster;

            // BoardCourseHolders[idx]['filterStream']= StreamMaster.filter((holder, index) => holder.course == i);
            BoardCourseHolders[idx]['filterStream'] = StreamMaster;
        } else {
            BoardCourseHolders[idx]['filterStream'] = [];
        }
        console.log(BoardCourseHolders[idx]['filterStream']);
        // if(BoardCourseHolders.length!=1 && BoardCourseHolders.length!=0){
        //     console.log(BoardCourseHolders.length);
        //    console.log( BoardCourseHolders[key]['StreamData']);
        //    for( key=0;key<BoardCourseHolders.length;key++){
        //     BoardCourseHolders[key]['StreamData'].map((element,index)=>{
        //         console.log(element.id);
        //         Eid=element.id;
        //         BoardCourseHolders[idx]['filterStream'] = BoardCourseHolders[idx]['filterStream'].filter((holder, index) =>
        //          holder.id != Eid

        //          ); 

        //     })

        //    }

        // }












        this.setState({ BoardCourseHolders });

        this.setState({ CourseName: values, CourseData: data })
        //console.log(staffArr)    
    }
    searchStaffI = (event, values) => {
        console.log(values);
        //this.setState({selectedStaff:values})
        let data = [];
        if (values) {
            const listItems = values.map((myList, index) =>
                data.push(myList.id)
            );
        }

        this.setState({ Board_nameI: values, BoardDataI: data })
        //console.log(staffArr)    
    }
    searchStaffCourseI = (event, values) => {
        console.log(values);
        //this.setState({selectedStaff:values})
        let data = [];
        if (values) {
            const listItems = values.map((myList, index) =>
                data.push(myList.name)
            );
        }

        this.setState({ CourseNameI: values, CourseDataI: data })
        //console.log(staffArr)    
    }
    searchStream = (idx, values) => {
        // console.log(values);

        let data = [];
        let Eid = '';
        let i = '';
        let key = 0;
        let BoardCourseHolders = this.state.BoardCourseHolders;


        if (values != null && values.name != null) {
            i = values.name
            // this.filterCombination(i);

            const { CombinationMaster } = this.state;

            BoardCourseHolders[idx]['CombinationData'] = [];

            BoardCourseHolders[idx]['filterCombination'] = CombinationMaster.filter((holder, index) => holder.stream == i);






            // console.log('i = '+i);
            // let filterCombination = BoardCourseHolders[idx]['filterCombination'];
            //  console.log({filterCombination});
            // BoardCourseHolders[idx]['filterCombination'] = filterCombination.filter((holder, index) => holder.id != i);
            if (BoardCourseHolders.length != 1 && BoardCourseHolders.length != 0) {
                console.log(BoardCourseHolders.length);
                console.log(BoardCourseHolders[key]['CombinationData']);
                for (key = 0; key < BoardCourseHolders.length; key++) {
                    BoardCourseHolders[key]['CombinationData'].map((element, index) => {
                        console.log(element.id);
                        Eid = element.id;
                        BoardCourseHolders[idx]['filterCombination'] = BoardCourseHolders[idx]['filterCombination'].filter((holder, index) =>
                            holder.id != Eid

                        );

                    })

                }
                if (BoardCourseHolders[idx]['filterCombination'].length == 0) {
                    BoardCourseHolders[idx]['filterCombination'] = CombinationMaster.filter((holder, index) => holder.stream == i);
                }

            }

        } else {

            BoardCourseHolders[idx]['CombinationData'] = [];
            BoardCourseHolders[idx]['filterCombination'] = [];
            this.setState({ CombinationName: [] });
        }
        if (values != null && values.length > 1) {
            BoardCourseHolders[idx]['filterCombination'] = [];
            this.setState({ CombinationName: [] });
        }

        BoardCourseHolders[idx]['StreamData'] = values;
        this.setState({ BoardCourseHolders });

        this.setState({ StreamName: values, StreamData: data })
        //console.log(staffArr)    
    }
    searchCombination = (idx, values) => {
        console.log(values + idx);
        //this.setState({selectedStaff:values})
        let data = [];
        let i = '';
        let key = 0;
        let stl = 0;
        if (values) {
            const listItems = values.map((myList, index) => {
                // data.push(myList.name),
                i = myList.stream;
            }
            );
        }
        console.log(i + values.length);
        let CombinationMaster = this.state.CombinationMaster;
        let BoardCourseHolders = this.state.BoardCourseHolders;
        let StreamMaster = this.state.StreamMaster;
        let CourseName = BoardCourseHolders[idx]['CourseData'].name;
        let BoardName = BoardCourseHolders[idx]['BoardData'].name;

        BoardCourseHolders[idx]['CombinationData'] = values;

        let combStream = CombinationMaster.filter((holder, index) => holder.stream == i);
        console.log(combStream.length);


        for (key = 0; key < BoardCourseHolders.length; key++) {
            if (BoardCourseHolders[key]['BoardData'].name == BoardName) {
                if (BoardCourseHolders[key]['CourseData'].name == CourseName) {
                    let StreamLength = BoardCourseHolders[key]['CombinationData'].filter((holder, index) =>
                        holder.stream == i

                    );
                    console.log({ StreamLength });
                    stl += StreamLength.length;
                }
            }

        }
        console.log({ stl });

        console.log('test' + CourseName);

        if (stl == combStream.length) {
            console.log('equal length');
            if (BoardCourseHolders.length == 1) {
                // let StreamMaster1=StreamMaster.filter((holder, index) => holder.name != i);
                let StreamMaster1 = BoardCourseHolders[idx]['filterStream'].filter((holder, index) => holder.name != i);
                // if(BoardCourseHolders[idx]['CourseData']){
                // let CourseName = BoardCourseHolders[idx]['CourseData'].name;
                // console.log('test'+CourseName);
                //  StreamMaster1=StreamMaster1.filter((holder, index) => holder.course == CourseName);
                // }
                console.log({ StreamMaster1 });
                this.setState({ StreamMaster1: StreamMaster1 });
            } else {

                let StreamMaster1 = this.state.StreamMaster1;
                StreamMaster1 = StreamMaster1.filter((holder, index) => holder.name != i);
                console.log({ StreamMaster1 });

                if (StreamMaster1.length == 0) {
                    console.log('stream length 0');



                    if (this.state.CourseMaster1) {
                        let CourseMaster1 = this.state.CourseMaster1;
                        CourseMaster1 = CourseMaster1.filter((holder, index) => holder.name != CourseName);
                        this.setState({ CourseMaster1 });
                        if (CourseMaster1.length == 0) {
                            if (this.state.BoardMaster1) {
                                let BoardMaster1 = this.state.BoardMaster1;
                                BoardMaster1 = BoardMaster1.filter((holder, index) => holder.name != BoardName);
                                this.setState({ BoardMaster1 });
                                this.setState({ CourseMaster1: BoardCourseHolders[idx]['filterCourse'] });
                            } else {
                                let BoardMaster1 = this.state.BoardMaster;
                                BoardMaster1 = BoardMaster1.filter((holder, index) => holder.name != BoardName);
                                this.setState({ BoardMaster1 });
                                this.setState({ CourseMaster1: BoardCourseHolders[idx]['filterCourse'] });
                            }
                        }

                    } else {
                        let CourseMaster1 = BoardCourseHolders[idx]['filterCourse'].filter((holder, index) => holder.name != CourseName);
                        this.setState({ CourseMaster1 });
                    }

                    this.setState({ StreamMaster1: StreamMaster });
                } else {
                    this.setState({ StreamMaster1: StreamMaster1 });
                }


            }
        }
        else {
            if (BoardCourseHolders.length == 1) {

                // this.setState({StreamMaster1:StreamMaster});
                this.setState({ StreamMaster1: BoardCourseHolders[idx]['filterStream'] });

            }
        }

        // console.log('i = '+i);
        // let filterCombination = BoardCourseHolders[idx]['filterCombination'];
        //  console.log({filterCombination});
        // BoardCourseHolders[idx]['filterCombination'] = filterCombination.filter((holder, index) => holder.id != i);


        // if(BoardCourseHolders.length!=1 && BoardCourseHolders.length!=0){
        //     console.log(BoardCourseHolders.length);
        //    console.log( BoardCourseHolders[key]['CombinationData']);
        //    for(key=0;key<BoardCourseHolders.length;key++){
        //     BoardCourseHolders[key]['CombinationData'].map((element,index)=>{
        //         console.log(element.id);
        //         i=element.id;
        //         BoardCourseHolders[idx]['filterCombination'] = CombinationMaster.filter((holder, index) => holder.id != i); 

        //     })
        //    }

        // }



        this.setState({ BoardCourseHolders });

        this.setState({ CombinationName: values, CombinationData: data })
        console.log({ BoardCourseHolders })
    }
    handleClassMasterDataStream = (pIndex, inputName, pValue) => {
        let lclassholders = this.state.stream;
        lclassholders[pIndex][inputName] = pValue;
        this.setState({ stream: lclassholders });
    }

    removeHolder(i) {
        const { classholders } = this.state;
        this.setState({
            classholders: classholders.filter((holder, index) => index !== i),
        });
    }
    removeHolderStream(i) {
        const { stream } = this.state;
        this.setState({
            stream: stream.filter((holder, index) => index !== i),
        });
    }
    filterCombination(i) {
        const { CombinationMaster } = this.state;
        this.setState({
            filterCombination: CombinationMaster.filter((holder, index) => holder.stream == i),
        });
        console.log('filterCombination' + this.state.filterCombination);
    }

    handleAddHolder = () => {
        let data = this.state.classholders;
        let addStream = this.state.staffArr;
        let lData = {};
        lData.standards = '';
        lData.sections = '';
        lData.streams = '';
        lData.academics = '';
        data.push(lData);
        this.setState({ data });
    }
    handleAddHolderStream = () => {
        let data = this.state.stream;
        let lData = {};
        lData.name = '';

        data.push(lData);
        this.setState({ data });
    }

    handleDocumentChange = (pIndex, inputName, pValue) => {
        let data = this.state.classholders;
        data[pIndex][inputName] = pValue;
        this.setState({ data });
    }

    getStudentDetails = (id, id_board, id_academicyear) => {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            standard_id: id ? id : '',
            id_board: id_board ? id_board : this.state.selectedBoard,
            id_academicyear: id_academicyear ? id_academicyear : this.state.selectedAcademicYear
        };
        new Service().apiCall('students/getData', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                const newArr = response.data.map(v => ({ ...v, editable: false }));
                if (this.state.showStatus == 'all') {
                    this.setState({ studentData: newArr, studentSuggestions: newArr });
                }
                else {
                    var newArray = newArr.filter(x => x.status == this.state.showStatus);
                    this.setState({ studentData: newArray, studentSuggestions: newArray });
                }
            } else {
                this.setState({ studentData: [] });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    getStudentDocuments = (uid) => {
        this.setState({ studentDocuments: [] });
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_user: this.props.data.UID,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",

            id_student: uid,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('DocumentManagements/getDocumentDetails', postData).then(response => {
            if (response.status == 200 && response.data != '') {

                this.setState({ studentDocuments: response.data });

            }
        }).catch(error => {
            console.log(error);
        });
    }


    submit = e => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('orgData', JSON.stringify(this.state.orgInfo));

        formData.append('BoardCourseHolders', JSON.stringify(this.state.BoardCourseHolders));
        formData.append('id_academicyear', this.props.data.selectedAcademicId);


        formData.append('inst_logo', this.state.selectedFile1);
        formData.append('inst_fav_icon', this.state.selectedFile2);
        formData.append('id_user', this.props.data.UID);

        console.log(...formData);
        if (this.state.orgInfo.inst_contact1.length == 10 && this.state.orgInfo.inst_contact2.length == 10) {
            new Service().apiCall('AcademicSettings/updateInstituteInfoCheck', formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            ).then(response => {




                this.handleNext();
                //     console.log(response);
                //   if(response.data == 201){
                //         this.setState({
                //           basicNotify: (
                //             <Dialog open={true}>
                //               <div className="text-center p-5">
                //                 <h4 className="font-weight-bold">Institution Already Exist</h4>
                //               </div>
                //             </Dialog>
                //           ),
                //         });
                //         setTimeout(() => {
                //           this.setState({ basicNotify:false});
                //         //   window.location.reload()
                //         }, 2000)
                //       }
                //     else if (response.status == 200 && response.data != '') {
                //         this.setState({
                //             basicNotify: (
                //                 <Dialog open={true}>
                //                     <div className="text-center p-5">
                //                         <h4 className="font-weight-bold">Institution Added</h4>
                //                     </div>
                //                 </Dialog>
                //             ),
                //         });
                //         setTimeout(() => {
                //             // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                //             this.setState({ basicNotify:false});
                //             // window.location.reload()
                //         }, 2000)
                //     } else {
                //         console.log(response.data);
                //         //this.raiseLoginSignupErrorAlert("signup");
                //     }
            }).catch(error => {
                console.log(error);
            });
        } else {
            this.setState({
                basicNotify: (
                    <Dialog open={true}>
                        <div className="text-center p-5">
                            <h4 className="font-weight-bold" style={{ color: 'red' }}>Contact Number length should be 10</h4>
                        </div>
                    </Dialog>
                ),
            });
            setTimeout(() => {

                this.setState({ basicNotify: false });

            }, 2000);
        }
    }
    insertBCSC = e => {
        e.preventDefault();
        let formData = new FormData();

        formData.append('orgData', JSON.stringify(this.state.orgInfo));

        formData.append('BoardCourseHolders', JSON.stringify(this.state.BoardCourseHolders));
        formData.append('id_academicyear', this.props.data.selectedAcademicId);


        formData.append('inst_logo', this.state.selectedFile1);
        formData.append('inst_fav_icon', this.state.selectedFile2);
        formData.append('id_user', this.props.data.UID);

        console.log(...formData);
        // formData.append('BoardCourseHolders', JSON.stringify(this.state.BoardCourseHolders));
        // formData.append('id_academicyear', this.props.data.selectedAcademicId);



        formData.append('id_user', this.props.data.UID);

        console.log(...formData);
        new Service().apiCall('AcademicSettings/updateInstituteInfo', formData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            console.log(response);
            if (response.data == 201) {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Institution Already Exist</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    this.setState({ basicNotify: false });
                    //   window.location.reload()
                }, 2000)
            }
            else if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Institution Added</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                    this.setState({ basicNotify: false });
                    this.props.history.push("/admin/organization");
                    // window.location.reload()
                }, 2000)
            } else {
                console.log(response.data);
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            console.log(error);
        });
    }
    updateInstitution = e => {
        e.preventDefault();
        let formData = new FormData();
        if (this.state.Board_nameI.length > 0) {
            if (this.state.CourseNameI.length > 0) {
                formData.append('id', this.state.instituteId);
                formData.append('InsData', JSON.stringify(this.state.InstitutionDataid));
                formData.append('BoardData', JSON.stringify(this.state.Board_nameI));
                formData.append('CourseData', JSON.stringify(this.state.CourseNameI));

                formData.append('id_academicyear', this.props.data.selectedAcademicId);

                formData.append('inst_logo', this.state.selectedFile2);
                formData.append('id_user', this.props.data.UID);

                console.log(...formData);
                new Service().apiCall('AcademicSettings/updateInstitution', formData,
                    {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                ).then(response => {
                    console.log(response);
                    if (response.data == 201) {
                        this.setState({
                            basicNotify: (
                                <Dialog open={true}>
                                    <div className="text-center p-5">
                                        <h4 className="font-weight-bold">Institution Already Exist</h4>
                                    </div>
                                </Dialog>
                            ),
                        });
                        setTimeout(() => {
                            this.setState({ basicNotify: false });
                            //   window.location.reload()
                        }, 2000)
                    }
                    else if (response.status == 200 && response.data != '') {
                        this.getBoardCourse(this.state.instituteId);
                        this.setState({
                            basicNotify: (
                                <Dialog open={true}>
                                    <div className="text-center p-5">
                                        <h4 className="font-weight-bold">Institution Updated</h4>
                                    </div>
                                </Dialog>
                            ),
                        });
                        setTimeout(() => {
                            // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                            this.setState({ basicNotify: false });
                            // window.location.reload()
                        }, 2000)
                    } else {
                        console.log(response.data);
                        //this.raiseLoginSignupErrorAlert("signup");
                    }
                }).catch(error => {
                    console.log(error);
                });

            } else {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Please add Course</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                    this.setState({ basicNotify: false });
                    // window.location.reload()
                }, 2000)

            }
        } else {
            formData.append('id', this.state.instituteId);
            formData.append('InsData', JSON.stringify(this.state.InstitutionDataid));
            // formData.append('BoardData', JSON.stringify(this.state.Board_nameI));
            // formData.append('CourseData', JSON.stringify(this.state.CourseNameI));

            formData.append('id_academicyear', this.props.data.selectedAcademicId);

            formData.append('inst_logo', this.state.selectedFile2);
            formData.append('id_user', this.props.data.UID);

            console.log(...formData);
            new Service().apiCall('AcademicSettings/updateInstitution', formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            ).then(response => {
                console.log(response);
                if (response.data == 201) {
                    this.setState({
                        basicNotify: (
                            <Dialog open={true}>
                                <div className="text-center p-5">
                                    <h4 className="font-weight-bold">Institution Already Exist</h4>
                                </div>
                            </Dialog>
                        ),
                    });
                    setTimeout(() => {
                        this.setState({ basicNotify: false });
                        //   window.location.reload()
                    }, 2000)
                }
                else if (response.status == 200 && response.data != '') {
                    this.setState({
                        basicNotify: (
                            <Dialog open={true}>
                                <div className="text-center p-5">
                                    <h4 className="font-weight-bold">Institution Updated</h4>
                                </div>
                            </Dialog>
                        ),
                    });
                    setTimeout(() => {
                        // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                        this.setState({ basicNotify: false });
                        // window.location.reload()
                    }, 2000)
                } else {
                    console.log(response.data);
                    //this.raiseLoginSignupErrorAlert("signup");
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
    InsertStreamCourse = () => {
        const postData = {
            id: this.state.instituteId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            boardId: this.state.boardId,
            courseId: this.state.courseId,
            stream: this.state.StreamName,
            combination: this.state.CombinationName,
            //   role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID
        };
        console.log(postData);
        new Service().apiCall('AcademicSettings/InsertStreamCourse', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Data Inserted</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {

                    this.setState({ basicNotify: false });

                }, 2000)
            } else {
                //  this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            console.log(error)
            // this.raiseLoginSignupErrorAlert("signup");
        });
    }
    getStreamCombination = (id) => {
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,

            token: "abc",
            id_user: this.props.data.UID
        };
        console.log(postData);
        new Service().apiCall('AcademicSettings/getStreamCombination', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({ StreamCombinationMaster: response.data });

            } else {

                this.setState({ StreamCombinationMaster: [] });
            }
        }).catch(error => {
            console.log(error)

        });
    }
    getBoardCourse = (id) => {
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,

            token: "abc",
            id_user: this.props.data.UID
        };
        // console.log(postData);
        new Service().apiCall('AcademicSettings/getBoardCourse', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({ BoardCourseMaster: response.data });

            } else {

                this.setState({ BoardCourseMaster: [] });
            }
        }).catch(error => {
            console.log(error)

        });
    }
    getStream = (id, type) => {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,

            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
        };
        console.log(postData);
        new Service().apiCall('ClassMasters/AllStream', postData).then(response => {
            console.log(response)
            if (response.status == 200 && response.data != '') {
                const data = response.data.map((data) => {
                    return { ...data, checked: false, editable: false, gross_rent: 0 };
                });

                this.setState({ AllStream: data });
            } else {
                this.setState({ AllStream: [] });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    handleClassMasterDelete = (id, status) => {
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            //   role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('ClassMasters/deleteInstitute', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{status == 1 ? "Institute Deactivated" : "Institute Activated"}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    this.getInstitutions();
                    this.setState({ basicNotify: false });

                }, 2000)
            } else {
                //  this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            console.log(error)
            // this.raiseLoginSignupErrorAlert("signup");
        });
    }

    handleBoardCourseDelete = (id, status) => {
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            //   role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('AcademicSettings/deleteCourse', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{status == 1 ? "Course Deactivated" : "Course Activated"}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getBoardCourse(this.state.instituteId);
                setTimeout(() => {
                    // this.getInstitutions();
                    this.setState({ basicNotify: false });

                }, 2000)
            } else {
                //  this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            console.log(error)
            // this.raiseLoginSignupErrorAlert("signup");
        });
    }

    handleCombinationDelete = (id, status) => {
        const postData = {
            id: id,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            //   role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('AcademicSettings/deleteCombination', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{status == 1 ? "Combination Deactivated" : "Combination Activated"}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getStreamCombination(this.state.instituteId);
                setTimeout(() => {
                    // this.getInstitutions();
                    this.setState({ basicNotify: false });

                }, 2000)
            } else {
                //  this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            console.log(error)
            // this.raiseLoginSignupErrorAlert("signup");
        });
    }

    showError = (error, status) => {
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
            this.setState({ basicNotify: false });
            if (status == 401) {
                this.props.removeUserData();
                this.props.history.push("/login");
            }
        }, 2000)
    }
    handleImageChange = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };


    handleClass = e => {
        e.preventDefault();
        const postData = {
            classholders: this.state.classholders,

            id_academicyear: this.state.selectedAcademicYear,
            id_board: this.state.selectedBoard,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID,
        };
        new Service().apiCall('ClassMasters/insertData', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {

            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Class Inserted</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                    window.location.reload()
                }, 2000)
            } else {
                console.log(response.data);
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }
    handleClassStream = e => {
        e.preventDefault();
        const postData = {
            stream: this.state.stream,
            id_academicyear: this.state.selectedAcademicYear,
            id_board: this.state.selectedBoard,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            BoardData: this.state.Board_name,
            CourseData: this.state.course,
            //   role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID,
        };
        console.log(postData)
        new Service().apiCall('ClassMasters/insertInstitutions', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            console.log(response)
            if (response.data == 201) {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Institution Already Exist</h4>
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
                                <h4 className="font-weight-bold">Institution Added</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                    window.location.reload()
                }, 2000)
            } else {
                console.log(response.data);
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }

    updateStreamData = (streamSelections) => {
        const postData = {
            streamSelections: streamSelections,
            id_academicyear: this.state.selectedAcademicYear,
            id_board: this.state.selectedBoard,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            role_id: this.props.data.role_id,
            token: "abc",
            id_user: this.props.data.UID,
        };
        new Service().apiCall('ClassMasters/updateStreamDetails', postData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">Streams Inserted</h4>
                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    // this.setState({ basicNotify:false,groupName:'',groupRecipients:''});
                    window.location.reload()
                }, 2000)
            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }

    renderSelectedStreams = () => {
        const lUserData = this.props.data;
        let lstdstreams = this.state.streamDetails;
        let selectedSectionIds = "";
        let selectedSection = "";
        let selected = [];
        let selectedids = [];
        lstdstreams.map(element => {
            selected[element.id] = new Array();
            element.streams.map((stream, sindex) => {
                var ldata = {};
                if (stream.checked == true) {
                    selected[element.id].push(stream.stream);
                }
            });
            if (selected[element.id].length > 0) {
                selectedids[element.id] = selected[element.id].join(',');
            }

        });
        //if(selected.length > 0){
        // selectedSectionIds = selected.join(',');
        // selectedSection = selectedids;
        //}
        this.setState({ streamSelections: selectedids });
        this.updateStreamData(selectedids);


    }

    renderStatusPanel = (status, id, data) => {
        if (status == "incustody") {
            this.setState({ custodyPanel: true, id_document: id, documentInfo: data })
        }
        else if (status == "returned") {
            this.setState({ returnPanel: true, id_document: id, documentInfo: data })
        }
        else if (status == "disposed") {
            this.setState({ disposePanel: true, id_document: id, documentInfo: data })
        }
    }

    handleStudentSearch = (val) => {
        this.setState({ studentInfo: val });
        this.getStudentDocuments(val.UID);
    }

    handleStreamChecked(standard, idx, id, status) {
        let lstreams = this.state.streamDetails;
        lstreams[idx].streams[id].checked = !status;
        this.setState({ streamDetails: lstreams });
    }

    getInstitutions(id_board, id_academicyear) {
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,

            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('ClassMasters/getInstitutions', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                console.log(response)
                if (response.data) {
                    let data = [];



                    this.setState({ classmasterDetails: response.data });
                }
            } else {
                this.setState({ standardSuggestions: [], classmasterDetails: [], activeclassmasterDetails: [], inactiveclassmasterDetails: [], allClassmasterDetails: [] });
            }
        }).catch(error => {
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }
    replaceText = (str) => {
        let string = str.replace(" B.O", "");
        string = string.replace(" S.O", "");
        return string;
    }

    handleMapClass(accyr, board, standard) {
        const lUserData = this.props.data;
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_academicyear: accyr,
            id_board: board,
            standard: standard,
            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('ClassMasters/getMapClassDetails', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                if (response.data) {
                    var lStreams = [];
                    var lDetails = [];
                    response.data.forEach((element, idx) => {
                        var lStandard = {};
                        var lStream = {};
                        lStandard.id = element.id;
                        lStandard.standard = element.standard;
                        lStandard.streams = new Array();
                        lStreams.push(lStandard);
                        if (element.stream) {
                            element.stream.forEach((ele, id) => {
                                var lStream = {};
                                if (element.selectedstream && element.selectedstream.includes(ele)) {
                                    lStream.checked = true;
                                } else {
                                    lStream.checked = false;
                                }
                                lStream.stream = ele;
                                lStream.id = id + 1;
                                lStandard.streams.push(lStream);
                                lStreams[idx] = lStandard;
                            })
                        }
                    })
                    this.setState({ mapclassDetails: response.data, streamDetails: lStreams });
                }
            }
        }).catch(error => {
            alert("error");

        });
    }
    handleImageChange1 = event => {
        this.setState({
            selectedFile1: event.target.files[0]
        })
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl1: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleClick1 = () => {
        fileInput1.current.click();
    };
    handleRemove1 = () => {
        this.setState({
            imagePreviewUrl1: defaultImage, selectedFile1: null
        });
        fileInput1.current.value = null;
    };
    handleImageChange2 = event => {
        this.setState({
            selectedFile2: event.target.files[0]
        })
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl2: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleClick2 = () => {
        fileInput2.current.click();
    };
    handleRemove2 = () => {
        this.setState({
            imagePreviewUrl2: defaultImage, selectedFile2: null
        });
        fileInput2.current.value = null;
    };
    setDta = (name, value) => {
        let data = this.state.orgInfo;
        data[name] = value;
        this.setState({ data })

        if (name == 'inst_email1' || name == 'inst_email2') {

            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(value)) {

                if (name == 'inst_email1') {
                    this.setState({ validatecolorEmail1: 'red' });
                }
                if (name == 'inst_email2') {
                    this.setState({ validatecolorEmail2: 'red' });
                }
            } else {

                if (name == 'inst_email1') {
                    this.setState({ validatecolorEmail1: '' });
                }
                if (name == 'inst_email2') {
                    this.setState({ validatecolorEmail2: '' });
                }
            }
        }
        else {
            // console.log('not checking');
        }
        if (name == 'inst_contact1' || name == 'inst_contact2') {
            console.log(value.length);
            if (value.length < 10) {
                if (name == 'inst_contact1') {
                    this.setState({ validatecolorContact1: 'red' });
                }
                if (name == 'inst_contact2') {
                    this.setState({ validatecolorContact2: 'red' });
                }
            }
            else {
                if (name == 'inst_contact1') {
                    this.setState({ validatecolorContact1: '' });
                }
                if (name == 'inst_contact2') {
                    this.setState({ validatecolorContact2: '' });
                }
            }
        }


        if (name == 'inst_pincode' || name == 'corp_pincode') {

            this.getAddressInfo(value, name);
        } else {
            console.log('not pin' + name);
        }
    }

    setDtaIns = (name, value) => {
        let data = this.state.InstitutionDataid;
        data[name] = value;
        console.log('before');
        if (name == 'inst_email1' || name == 'office_email1') {
            console.log('if');
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(value)) {
                console.log('checking');
                // document.getElementById("inst_email1").style.borderColor = "3px solid green";
                //  this.setState({data});
            } else {
                console.log('red');
            }
        }
        else {
            console.log('not checking');
        }
        this.setState({ data })
        if (name == 'pincode' || name == 'corp_pincode') {

            this.getAddressInfo(value, name);
        } else {
            console.log('not pin' + name);
        }
        // }
    }
    getAddressInfo(pincode, type) {
        let data = this.state.orgInfo;
        data['inst_pincode'] = pincode;
        // console.log(pincode+type);
        // this.setState({ data });
        // this.setState({ [type]: pincode });
        if (pincode && pincode.length == 6) {
            const postData = {
                pincode: pincode,
            }
            new Service().apiCall('Pincode/GetPincode', postData).then(response => {
                if (response.status == 200 && response.data != '') {
                    if (response.data) {

                        let newArr = response.data.filter(v => v.delivery == "Delivery");
                        // console.log(newArr);
                        this.setState({ pincodesArr: newArr, selectPOPanel: true, addressType: type })
                    }
                    else {
                        this.setState({ pincodesArr: [] })
                    }
                }
            }).catch(error => {
                //alert("error");  
            });
        }
    }
    fillAddress = (po, taluk, district, state, event) => {


        event.preventDefault();
        let data = this.state.orgInfo;
        let dataI = this.state.InstitutionDataid;
        if (this.state.addressType == "inst_pincode") {
            data['inst_post_office'] = po;
            data['inst_taluk'] = taluk;
            data['inst_district'] = district;
            data['inst_state'] = state;

            this.setState({ data });
            this.setState({ selectPOPanel: false });
        }
        if (this.state.addressType == "corp_pincode") {

            data['corp_post_office'] = po;
            data['corp_taluk'] = taluk;
            data['corp_district'] = district;
            data['corp_state'] = state;

            this.setState({ data });
            this.setState({ selectPOPanel: false });
        }
        if (this.state.addressType == "pincode") {

            dataI['post_office'] = po;
            dataI['taluk'] = taluk;
            dataI['district'] = district;
            dataI['state'] = state;

            this.setState({ dataI });
            this.setState({ selectPOPanel: false });
        }
        else {
            this.setState({ selectPOPanel: false });
            // this.setState({permanent_post_office:'',permanent_taluk:'',permanent_district:'',permanent_state:'', selectPOPanel:false});
        }
    }
    handleBoardDataid = (inputName, pValue) => {


        this.setState({ boardId: pValue });
        if (pValue.length > 0) {
            this.getCourseInfo(pValue)
        }


    }
    handleCourseDataid = (inputName, pValue) => {


        this.setState({ courseId: pValue });


    }
    getInstitutionwithId(instituteId) {
        const postData = {
            id: instituteId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,


            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getInstitutionwithId', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                // console.log(response.data)
                if (response.data) {

                    let data = this.state.InstitutionDataid;
                    // this.setState({ InstitutionDataid: response.data });
                    console.log('ins' + response.data)
                    response.data.map((key, value) => {
                        console.log(key.name);
                        console.log(value);

                        data['name'] = key.name;
                        data['address1'] = key.address1;
                        data['address2'] = key.address2;

                        data['created_by'] = key.created_by;
                        data['created_on'] = key.created_on;
                        data['district'] = key.district;
                        data['id'] = key.id;
                        data['logo'] = key.logo;

                        data['office_email1'] = key.office_email1;
                        data['office_email2'] = key.office_email2;
                        data['office_tel1'] = key.office_tel1;
                        data['office_tel2'] = key.office_tel2;
                        data['organization_id'] = key.organization_id;
                        data['pincode'] = key.pincode;
                        data['post_office'] = key.post_office;
                        data['state'] = key.state;
                        data['status'] = key.status;
                        data['taluk'] = key.taluk;

                        //   this.setState({Iname:key.name});
                    })
                    this.setState({ data })
                    console.log(this.state.Iname)
                }
            } else {
                this.setState({ InstitutionDataid: [] });
            }
        }).catch(error => {
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }
    getBoardInfo(instituteId) {
        const postData = {
            id: instituteId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,


            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getBoardInfo', postData).then(response => {
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
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }
    getCourseInfo(boardId) {
        const postData = {
            id: this.state.instituteId,
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            boardId: boardId,

            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('AcademicSettings/getCourseInfo', postData).then(response => {
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
            if (error.response.status == 500 && error.response.data != "") {
                this.showError(error.response.data, error.response.status)
            }
            else if (error.response.status == 401) {
                this.showError('Invalid Auth token. Redirecting to login', error.response.status)
            }
            else {
                console.log(error)
            }
        });
    }
    addBoardCourseHolder = () => {
        let BoardCourseHolders = this.state.BoardCourseHolders;
        let lSemsters = {};
        lSemsters.BoardData = [];
        lSemsters.CourseData = [];
        lSemsters.StreamData = [];
        lSemsters.CombinationData = [];

        BoardCourseHolders.push(lSemsters);
        this.setState({ BoardCourseHolders: BoardCourseHolders });
    }
    removeBoardCourseHolder(i) {
        const { BoardCourseHolders } = this.state;
        this.setState({
            BoardCourseHolders: BoardCourseHolders.filter((holder, index) => index !== i),
        });
    }
    handleNext = () => {
        this.setState({ openBoard: true });
    }




    componentDidMount() {
        this.getAcademicSettingData();
        this.getInstitutions();
        this.getOrganizationData();


        this.getStream();
    }

    render() {
        const width = window.innerWidth;
        const width40p = width * (40 / 100) + "px";
        const width50p = width * (50 / 100) + "px";
        const width60p = width * (60 / 100) + "px";
        const width100p = width + "px";
        // const classes  = makeStyles((theme) => ({
        //     labelRoot: {
        //         right: 0
        //       },
        //       shrink: {
        //         transformOrigin: "top right"
        //       }

        //   }));

        const { classes } = this.props;

        return (
            <Fragment>
                {this.state.basicNotify}
                <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={() => this.setState({ dialogOpen: false })} TransitionComponent={Transition}>
                    <AppBar className="app-header" color="secondary" position="fixed">
                        <Toolbar className="w-100">
                            <Grid container>
                                <Grid item xs={12} lg={12} className="d-flex">
                                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.push("/admin/organization")} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4" className="p-12">
                                        Institution
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                    <Animated animationIn="slideInRight" animationOut="slideOutLeft">
                        <div className="pt-100 pl-5">


                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                                <Link color="inherit" href="/admin/dashboard"

                                >
                                    Home
                                </Link>
                                <Link color="inherit"
                                    href="/admin/settings"

                                >
                                    Settings
                                </Link>
                                <Link color="inherit"
                                    href="/admin/organization"

                                >
                                    Organization/Institution
                                </Link>
                                <Typography color="textPrimary">Add Institution</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className="pt-5" >
                            {/* Add stream */}

                            {/* //add institute */}
                            <Grid container spacing={2} justify="center" className="sliderDiv">

                                <Grid item xs={12} md={10} lg={9}>
                                    <form
                                        onSubmit={this.submit.bind(this)}
                                        autoComplete="off">
                                        <Card className="card-box mb-4 pt-3 pb-3">

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <div className="card-header pl-0">
                                                        <div className="card-header--title">
                                                            <h4 className="font-size-lg mb-0 ml-3 pb-2  font-weight-bold">
                                                                Add Institution
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </Grid>


                                                <Grid item xs={12} sm={12} md={8} className="margin-auto">


                                                    <Grid container >
                                                        <Grid item xs={12} sm={1} md={1} className="mb-10">
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={11} className="mt-3">

                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        tabIndex={-1}
                                                                        checked={this.state.same_address == true}
                                                                        onClick={() => {
                                                                            this.handleAddress(this.state.same_address);

                                                                        }}
                                                                    />
                                                                }
                                                                label="Same as Organization"
                                                            />
                                                            {/* }  */}
                                                        </Grid>

                                                        <Grid item xs={12} sm={1} md={1} className="mb-10">
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="1"
                                                                    label="Instituition Name"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_name}
                                                                    onChange={(event) => this.setDta("inst_name", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container >
                                                        <Grid item xs={12} sm={1} md={1} className="mb-10">
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="2"
                                                                    label="Address 1"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_address1}
                                                                    onChange={(event) => this.setDta("inst_address1", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={1} md={1} className="mb-10">
                                                        </Grid>
                                                        <Grid item xs={12} sm={1} md={1} className="mb-10">
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">

                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="3"
                                                                    label="Address 2"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_address2}
                                                                    onChange={(event) => this.setDta("inst_address2", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="7"
                                                                    label="Pincode"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_pincode}
                                                                    onChange={(event) => this.setDta("inst_pincode", event.target.value.replace(/\D/g, ""))}
                                                                    variant="outlined"
                                                                    onInput={(e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                                                                    }}
                                                                />

                                                            </FormControl>
                                                        </Grid>


                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    disabled
                                                                    className="m-2"
                                                                    id="7"
                                                                    label="Post Office"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_post_office}
                                                                    onChange={(event) => this.setDta("inst_post_office", event.target.value.replace(/\D/g, ""))}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>


                                                    </Grid>

                                                    <Grid container justify="center">

                                                        <Grid item xs={12} sm={12} md={3} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    disabled
                                                                    className="m-2"
                                                                    id="4"
                                                                    label="Taluk"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_taluk}
                                                                    onChange={(event) => this.setDta("inst_taluk", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    disabled
                                                                    className="m-2"
                                                                    id="5"
                                                                    label="District"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_district}
                                                                    onChange={(event) => this.setDta("inst_district", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={4} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    inputProps={{
                                                                        autoComplete: 'off',
                                                                        style: { textTransform: 'capitalize' }
                                                                    }}
                                                                    required
                                                                    disabled
                                                                    className="m-2"
                                                                    id="6"
                                                                    label="State"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_state}
                                                                    onChange={(event) => this.setDta("inst_state", event.target.value)}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>

                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField

                                                                    InputLabelProps={{
                                                                        style: {
                                                                            color: this.state.validatecolorContact1,
                                                                        },


                                                                    }}
                                                                    InputProps={{
                                                                        maxLength: 10,
                                                                        minLength: 10,
                                                                        classes: {

                                                                            notchedOutline: this.state.validatecolorContact1 && classes.notchedOutlineRed
                                                                        }

                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="8"
                                                                    label="Contact Number 1 "
                                                                    type="search"
                                                                    maxlength='10'
                                                                    minLength='10'
                                                                    value={this.state.orgInfo.inst_contact1}
                                                                    onChange={(event) => this.setDta("inst_contact1", event.target.value.replace(/\D/g, ""))}
                                                                    variant="outlined"
                                                                    onInput={(e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                    }}
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    InputLabelProps={{
                                                                        style: {
                                                                            color: this.state.validatecolorContact2,
                                                                        },


                                                                    }}
                                                                    InputProps={{
                                                                        classes: {

                                                                            notchedOutline: this.state.validatecolorContact2 && classes.notchedOutlineRed
                                                                        }

                                                                    }}

                                                                    className="m-2"
                                                                    id="9"
                                                                    label="Contact Number 2"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_contact2}
                                                                    onChange={(event) => this.setDta("inst_contact2", event.target.value.replace(/\D/g, ""))}
                                                                    variant="outlined"
                                                                    onInput={(e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                    }}
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    // inputProps={{
                                                                    //     autoComplete: 'off',

                                                                    //     // style: {
                                                                    //     //     textOverflow: 'ellipsis',
                                                                    //     //     whiteSpace: 'nowrap',
                                                                    //     //     overflow: 'hidden',
                                                                    //     //     width: '100%',
                                                                    //     //     height: '100%',
                                                                    //     //     color: this.state.validatecolorEmail1
                                                                    //     //   },
                                                                    //       classes: {
                                                                    //         // root: classes.cssOutlinedInput,
                                                                    //         // focused: classes.cssFocused,
                                                                    //         notchedOutline: classes.notchedOutline
                                                                    //       }
                                                                    // }}
                                                                    InputLabelProps={{
                                                                        style: {
                                                                            color: this.state.validatecolorEmail1,
                                                                        },

                                                                        // classes: {
                                                                        //     root: classes.cssLabelRed,
                                                                        //     focused: classes.cssLabelRed,

                                                                        //   }
                                                                    }}
                                                                    InputProps={{
                                                                        classes: {
                                                                            // root: classes.cssOutlinedInput,
                                                                            // focused: classes.cssFocused,
                                                                            notchedOutline: this.state.validatecolorEmail1 && classes.notchedOutlineRed
                                                                        }
                                                                        // inputMode: 'numeric'
                                                                    }}
                                                                    required
                                                                    className="m-2"
                                                                    id="inst_email1"
                                                                    label="Email 1"
                                                                    type="search"
                                                                    value={this.state.orgInfo.inst_email1}
                                                                    onChange={(event) => this.setDta("inst_email1", event.target.value.replace(/\s|[A-Z]/g, ""))}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} className="mb-10">
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    InputLabelProps={{
                                                                        style: {
                                                                            color: this.state.validatecolorEmail2,
                                                                        },


                                                                    }}
                                                                    InputProps={{
                                                                        classes: {

                                                                            notchedOutline: this.state.validatecolorEmail2 && classes.notchedOutlineRed
                                                                        }

                                                                    }}

                                                                    className="m-2"
                                                                    id="11"
                                                                    label="Email 2"
                                                                    type="email"
                                                                    value={this.state.orgInfo.inst_email2}
                                                                    onChange={(event) => this.setDta("inst_email2", event.target.value.replace(/\s|[A-Z]/g, ""))}
                                                                    variant="outlined"
                                                                />

                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    {/* {this.state.BoardCourseHolders.map((BoardCourseHolder, idx) => (
                                                    <Grid container className="my-2 ">
                                                         <Grid item xs={12} sm={1} md={1} >
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} className="   pl-1  pr-1 autocompleteDiv" >
                                                        
                                                    <Autocomplete
                                                // select
                                                id="tags-outlined"
                                                options={this.state.BoardMaster}
                                                
                                                value={BoardCourseHolder.BoardData}
                                                
                                                onChange={(event,newValue)=>this.searchStaff(idx,newValue)} 
                                                   
                                                getOptionLabel={(option) => option.name}
                                                // filterSelectedOptions
                                                required
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Add Board here"
                                                    placeholder="Boards"
                                                    
                                                    
                                                />
                                                )}
                                            />
                                                        </Grid>
                                                <Grid item xs={12} sm={12} md={5} className="  pl-1 pr-2  autocompleteDiv">
                                                        <Autocomplete
                                                multiple
                                                id="tags-outlined"
                                                options={this.state.CourseMaster}
                                                // value={this.state.CourseName}
                                                value={BoardCourseHolder.CourseData}
                                                onChange={(event,newValue)=>this.searchStaffCourse(idx,newValue)} 
                                                
                                                getOptionLabel={(option) => option.name}
                                                filterSelectedOptions
                                                required
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Add Course here"
                                                    placeholder="Course"
                                                    
                                                />
                                                )}
                                            />
                                                        </Grid>
          <Grid item xs={12} sm={10} md={1} style={{margin:'auto',textAlign:'center'}}>
        { idx==0 ? 
         <div  className="addHolderStyle"><FormControl fullWidth >
        <TextField 
        // disabled={this.state.editStudent ? false : true}
        id={"add"+idx}  
        onKeyPress={(data) => {
        if (data.charCode === 13) {
        this.addBoardCourseHolder(); 
        }
        }}
        className="m-2"
        InputProps={{
        autoComplete: 'off', 
        readOnly: true,
        startAdornment: (
        <InputAdornment position="start">
        <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
        </InputAdornment>
        ),
        }}
        label="Add" 
        onClick={()=>{this.addBoardCourseHolder();}}
        variant="outlined" />
        </FormControl></div>
        :
        <div className="removeHolderStyle"> <FormControl fullWidth>
        <TextField 
        className="m-2"
        onKeyPress={(data) => {
        if (data.charCode === 13) {
        this.removeBoardCourseHolder(idx); 
        }
        }}
        id={"remove"+idx}
        InputProps={{
        autoComplete: 'off',
        readOnly: true,
        startAdornment: (
        <InputAdornment position="start">
        <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}} />
        </InputAdornment>
        ),
        }}
        label="Del" 
        onClick={()=>this.removeBoardCourseHolder(idx)}
        variant="outlined" />
        </FormControl></div>}
        </Grid>

                                                    </Grid>
                                                    ))} */}


                                                    <Grid container justify="center" className="mt-10">
                                                        <Grid item xs={12} sm={12} md={10} className="text-right pr-2">
                                                            {/* <Button type="submit" className="successBtnOutline ">Submit</Button> */}


                                                        </Grid>

                                                    </Grid>
                                                    <Grid container justify="center" className="mt-1">
                                                        <Grid item xs={12} sm={12} md={1} className="text-left ">
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} className="text-left pl-2 mt-2">
                                                            <Button variant="outlined" className="warningBtnOutline " style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.props.history.push("/admin/organization")}>Cancel</Button>

                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={6} className="text-right pr-2 mt-2">
                                                            <Button type="submit" >
                                                                <Chip
                                                                    // onClick={()=>this.handleNext()}
                                                                    avatar={<Avatar>{this.state.activeStep + 2}</Avatar>}

                                                                    label={'Next'}
                                                                    clickable
                                                                    color="secondary"
                                                                    onDelete={() => this.handleNext()}
                                                                    deleteIcon={<KeyboardArrowRight />}
                                                                    variant="outlined"
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid item xs={12} md={4} lg={4}>
                                                    <Card className="card-box mb-4 p-2 mr-4">
                                                        <Grid container style={{ height: '250px' }}>
                                                            <Grid item xs={12} sm={12} md={12}>
                                                                <h6 className="mt-2 text-center">Institute Logo</h6>
                                                                <FormControl fullWidth>
                                                                    <div className="fileinput text-center">
                                                                        <input type="file" onChange={this.handleImageChange1} ref={fileInput1} />
                                                                        <div className={"thumbnail"}>
                                                                            <img style={{ maxHeight: 180, width: 'auto' }} src={this.state.imagePreviewUrl1} alt="..." />
                                                                        </div>
                                                                        <div>
                                                                            {this.state.selectedFile1 === null ? (
                                                                                <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick1()}>
                                                                                    {"Select Logo"}
                                                                                </Button>
                                                                            ) : (
                                                                                <span>
                                                                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick1()}>
                                                                                        Change
                                                                                    </Button>
                                                                                    {null}
                                                                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove1()}>
                                                                                        <i className="fas fa-times" /> Remove
                                                                                    </Button>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                    <Card className="card-box mb-4 p-2 mr-4">
                                                        <Grid container style={{ height: '250px' }}>
                                                            <Grid item xs={12} sm={12} md={12}>
                                                                <h6 className="mt-2 text-center">Fav Icon</h6>
                                                                <FormControl fullWidth>
                                                                    <div className="fileinput text-center">
                                                                        <input type="file" onChange={this.handleImageChange2} ref={fileInput2} />
                                                                        <div className={"thumbnail"}>
                                                                            <img style={{ maxHeight: 180, width: 'auto' }} src={this.state.imagePreviewUrl2} alt="..." />
                                                                        </div>
                                                                        <div>
                                                                            {this.state.selectedFile2 === null ? (
                                                                                <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick2()}>
                                                                                    {"Select Logo"}
                                                                                </Button>
                                                                            ) : (
                                                                                <span>
                                                                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick2()}>
                                                                                        Change
                                                                                    </Button>
                                                                                    {null}
                                                                                    <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove2()}>
                                                                                        <i className="fas fa-times" /> Remove
                                                                                    </Button>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>

                                                </Grid>

                                            </Grid>
                                        </Card>

                                    </form>
                                </Grid>
                            </Grid>

                            {/* //end institute */}


                            <Drawer

                                anchor="right"
                                open={this.state.academicSettingsPanel}
                                variant="temporary"
                                elevation={4}
                                onClose={() => this.setState({ academicSettingsPanel: false })}>
                                <Box className={"app-header-drawer bgColor"} style={{ width: width40p }}>
                                    <PerfectScrollbar>
                                        <AppBar className="app-header" color="secondary" position="relative">
                                            <Toolbar>
                                                <IconButton edge="start" color="inherit" onClick={() => this.setState({ academicSettingsPanel: false })} aria-label="close">
                                                    <CloseIcon />
                                                </IconButton>
                                                <Typography variant="h5">
                                                    Academic Calendar Settings
                                                </Typography>

                                            </Toolbar>
                                        </AppBar>
                                        <div className="m-20">
                                            {this.state.academicsetting.annual &&
                                                <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={10} md={12}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        tabIndex={-1}
                                                                        checked={this.state.academicSettingId == this.state.academicsetting.annual.id}
                                                                        onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', this.state.academicsetting.annual.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: this.state.academicsetting.annual.id }) }}
                                                                    />
                                                                }
                                                                label="Annual"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            }
                                            <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                                                {this.state.academicsetting.semester && this.state.academicsetting.semester.map((element) => (

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={10} md={12}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        tabIndex={-1}
                                                                        checked={this.state.academicSettingId == element.id}
                                                                        onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: element.id }) }}
                                                                    />
                                                                }
                                                                label={element.name}
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                ))}
                                            </Card>

                                            <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                                                {this.state.academicsetting.trimester && this.state.academicsetting.trimester.map((element) => (

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={10} md={12}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        tabIndex={-1}
                                                                        checked={this.state.academicSettingId == element.id}
                                                                        onClick={() => { this.handleClassMasterData(this.state.academicId, 'academics', element.id); this.setState({ academicChecked: !this.state.academicChecked, academicSettingId: element.id }) }}
                                                                    />
                                                                }
                                                                label={element.name}
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                ))}
                                            </Card>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={10} md={12} className="text-right">
                                                    <Button color="secondary" variant="contained" onClick={() => this.setState({ academicSettingsPanel: false })}>Submit</Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </PerfectScrollbar>
                                </Box>
                            </Drawer>

                            <Drawer

                                anchor="right"
                                open={this.state.mapSectionStreamPanel}
                                variant="temporary"
                                elevation={4}
                                onClose={() => this.setState({ mapSectionStreamPanel: false })}>
                                <Box className={"app-header-drawer bgColor"} style={{ width: width100p }}>
                                    <PerfectScrollbar>
                                        <AppBar className="app-header" color="secondary" position="relative">
                                            <Toolbar>
                                                <IconButton edge="start" color="inherit" onClick={() => this.setState({ mapSectionStreamPanel: false })} aria-label="close">
                                                    <CloseIcon />
                                                </IconButton>
                                                <Typography variant="h5">
                                                    Map Section to Stream
                                                </Typography>
                                            </Toolbar>
                                        </AppBar>
                                        <div className="m-20">
                                            <Grid container spacing={2} justify="center">
                                                <Grid item xs={12} sm={10} md={6}>
                                                    <Card className="card-box  mb-4 pt-2 pb-1 px-3">
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                    Map Section to Stream
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        {this.state.streamDetails.map((element, idx) => (
                                                            <Grid container spacing={4}>
                                                                <Grid item xs={12} sm={10} md={2} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                                    <Box>{element.standard}</Box>
                                                                </Grid>
                                                                {element.streams.map((ele, id) => (
                                                                    <Grid item xs={12} sm={10} md={2}>

                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    tabIndex={-1}
                                                                                    checked={ele.checked}
                                                                                    onClick={() => this.handleStreamChecked(element.id, idx, id, ele.checked)}

                                                                                />
                                                                            }

                                                                            label={ele.stream}
                                                                        />

                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        ))}
                                                        {AuthHelper('CSTR', 'can_edit') && <Grid container spacing={4}>
                                                            <Grid item xs={12} sm={12} md={12} className="text-right mb-2">
                                                                <Button className="successBtnOutline" onClick={() => this.renderSelectedStreams()}>Submit</Button>
                                                            </Grid>
                                                        </Grid>}
                                                    </Card>

                                                </Grid>
                                            </Grid>
                                        </div>
                                    </PerfectScrollbar>
                                </Box>
                            </Drawer>

                        </div>
                    </Animated>
                </Dialog>
                <Drawer

                    anchor="right"
                    open={this.state.selectPOPanel}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ selectPOPanel: false })}>
                    <Box className={"app-header-drawer bgColor"} style={{ width: width60p }}>
                        <PerfectScrollbar>

                            <AppBar className="app-header" color="secondary" position="relative">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={() => this.setState({ selectPOPanel: false })} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4">
                                        Select Address
                                    </Typography>
                                </Toolbar>
                            </AppBar>

                            <Grid container spacing={2} justify="center" className="mt-1">
                                <Grid item xs={12} sm={12} lg={12}>
                                    {this.state.pincodesArr.length > 0 && this.state.pincodesArr.map((element, index) => (
                                        <Card className="card-box my-2 mx-4">
                                            <div className="card-indicator bg-first" />
                                            <CardContent className="px-4 py-3">
                                                <div className="pb-2 d-flex justify-content-between">
                                                    <a href="#" onClick={(e) => this.fillAddress(this.replaceText(element.office), element.taluk, element.district, element.circle, e)}>
                                                        {this.replaceText(element.office)}
                                                    </a>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-start">

                                                    <div className="font-size text-dark">
                                                        {"Taluk: " + element.taluk + "    District: " + element.district + "    State: " + element.circle}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Grid>
                            </Grid>
                        </PerfectScrollbar>
                    </Box>
                </Drawer>

                <Drawer

                    anchor="right"
                    open={this.state.selectInstitutionPanel}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ selectInstitutionPanel: false })}>
                    <Box className={"app-header-drawer bgColor"} style={{ width: width40p }}>
                        <PerfectScrollbar>

                            <AppBar className="app-header" color="secondary" position="relative">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={() => this.setState({ selectInstitutionPanel: false })} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4">
                                        View Institution
                                    </Typography>
                                </Toolbar>
                            </AppBar>

                            <Grid container spacing={2} justify="center" className="mt-1">

                                <Grid item xs={12} md={11} lg={11}>
                                    <form
                                        onSubmit={this.updateInstitution.bind(this)}
                                        autoComplete="off">
                                        {/* <Card className="card-box  mb-4 p-3"> */}

                                        <Grid container spacing={2}>

                                            {this.state.InstitutionDataid != [] && this.state.InstitutionDataid.name != null &&
                                                <Grid item xs={12} sm={12} md={12} className="margin-auto">


                                                    <Grid container justify="center">


                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        required
                                                                        className="m-2"
                                                                        id="1"
                                                                        label="Instituition Name"
                                                                        type="search"
                                                                        value={this.state.InstitutionDataid.name}
                                                                        onChange={(event) => this.setDtaIns("name", event.target.value)}
                                                                        variant="outlined"
                                                                    />

                                                                </FormControl>
                                                            </Card>
                                                        </Grid>


                                                    </Grid>



                                                    <Grid container justify="center">

                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        required
                                                                        className="m-2"
                                                                        id="2"
                                                                        label="Address 1"
                                                                        type="search"
                                                                        value={this.state.InstitutionDataid.address1}
                                                                        onChange={(event) => this.setDtaIns("address1", event.target.value)}
                                                                        variant="outlined"
                                                                    />

                                                                </FormControl>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>



                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        required
                                                                        className="m-2"
                                                                        id="3"
                                                                        label="Address 2"
                                                                        type="search"
                                                                        value={this.state.InstitutionDataid.address2}
                                                                        onChange={(event) => this.setDtaIns("address2", event.target.value)}
                                                                        variant="outlined"
                                                                    />

                                                                </FormControl>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>



                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container spacing={2} justify="center">
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10" justify="center">
                                                                        {/* <Card className="card-box  mb-4 p-3"> */}
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}
                                                                                required
                                                                                className="m-2"
                                                                                id="7"
                                                                                label="Pincode"
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.pincode}
                                                                                onChange={(event) => this.setDtaIns("pincode", event.target.value.replace(/\D/g, ""))}
                                                                                variant="outlined"
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                        {/* </Card> */}
                                                                    </Grid>

                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10" justify="center">
                                                                        {/* <Card className="card-box  mb-4 p-3"> */}
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}
                                                                                required
                                                                                disabled
                                                                                className="m-2"
                                                                                id="4"
                                                                                label="Taluk"
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.taluk}
                                                                                onChange={(event) => this.setDtaIns("taluk", event.target.value)}
                                                                                variant="outlined"
                                                                            />

                                                                        </FormControl>
                                                                        {/* </Card> */}
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <FormControl fullWidth>
                                                                    <TextField
                                                                        inputProps={{
                                                                            autoComplete: 'off',
                                                                            style: { textTransform: 'capitalize' }
                                                                        }}
                                                                        required
                                                                        disabled
                                                                        className="m-2"
                                                                        id="7"
                                                                        label="Post Office"
                                                                        type="search"
                                                                        value={this.state.InstitutionDataid.post_office}
                                                                        onChange={(event) => this.setDtaIns("post_office", event.target.value.replace(/\D/g, ""))}
                                                                        variant="outlined"
                                                                    />

                                                                </FormControl>
                                                            </Card>
                                                        </Grid>

                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">

                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container spacing={2} justify="center">
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}
                                                                                required
                                                                                disabled
                                                                                className="m-2"
                                                                                id="5"
                                                                                label="District"
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.district}
                                                                                onChange={(event) => this.setDtaIns("district", event.target.value)}
                                                                                variant="outlined"
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}
                                                                                required
                                                                                disabled
                                                                                className="m-2"
                                                                                id="6"
                                                                                label="State"
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.state}
                                                                                onChange={(event) => this.setDtaIns("state", event.target.value)}
                                                                                variant="outlined"
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>

                                                        </Grid>
                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container spacing={2} justify="center">
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}
                                                                                required
                                                                                className="m-2"
                                                                                id="8"
                                                                                label="Contact Number 1 "
                                                                                type="search"
                                                                                maxlength='10'
                                                                                minLength='10'
                                                                                value={this.state.InstitutionDataid.office_tel1}
                                                                                onChange={(event) => this.setDtaIns("office_tel1", event.target.value.replace(/\D/g, ""))}
                                                                                variant="outlined"
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                    style: { textTransform: 'capitalize' }
                                                                                }}

                                                                                className="m-2"
                                                                                id="9"
                                                                                label="Contact Number 2"
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.office_tel2}
                                                                                onChange={(event) => this.setDtaIns("office_tel2", event.target.value.replace(/\D/g, ""))}
                                                                                variant="outlined"
                                                                                onInput={(e) => {
                                                                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container spacing={2} justify="center">
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                }}
                                                                                required
                                                                                className="m-2"
                                                                                id="10"
                                                                                label="Email 1 aaa "
                                                                                type="search"
                                                                                value={this.state.InstitutionDataid.office_email1}
                                                                                onChange={(event) => this.setDtaIns("office_email1", event.target.value.replace(/\s|[A-Z]/g, ""))}
                                                                                variant="outlined"
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10">
                                                                        <FormControl fullWidth>
                                                                            <TextField
                                                                                inputProps={{
                                                                                    autoComplete: 'off',
                                                                                }}
                                                                                required
                                                                                className="m-2"
                                                                                id="11"
                                                                                label="Email 2"
                                                                                type="email"
                                                                                value={this.state.InstitutionDataid.office_email2}
                                                                                onChange={(event) => this.setDtaIns("office_email2", event.target.value.replace(/\s|[A-Z]/g, ""))}
                                                                                variant="outlined"
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container justify="center">
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10">
                                                            <Card className="card-box  mb-4 p-3">
                                                                <Grid container spacing={2} justify="center">
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10  autocompleteDiv" >

                                                                        <Autocomplete
                                                                            multiple
                                                                            id="tags-outlined"
                                                                            options={this.state.BoardMaster}
                                                                            value={this.state.Board_nameI}
                                                                            onChange={this.searchStaffI}
                                                                            getOptionLabel={(option) => option.name}
                                                                            filterSelectedOptions
                                                                            required
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant="outlined"
                                                                                    label="Add Board here"
                                                                                    placeholder="Boards"


                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} md={6} className="mb-10  autocompleteDiv">
                                                                        <Autocomplete
                                                                            multiple
                                                                            id="tags-outlined"
                                                                            options={this.state.CourseMaster}
                                                                            value={this.state.CourseNameI}
                                                                            onChange={this.searchStaffCourseI}
                                                                            getOptionLabel={(option) => option.name}
                                                                            filterSelectedOptions
                                                                            required
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant="outlined"
                                                                                    label="Add Course here"
                                                                                    placeholder="Course"

                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>

                                                            </Card>
                                                        </Grid>
                                                    </Grid>


                                                    <Grid container justify="center">
                                                        <Grid item xs={12} md={10} lg={10} className="mb-10">
                                                            <Card className="card-box mb-4 p-3 ">
                                                                <Grid container style={{ height: '250px' }}>
                                                                    <Grid item xs={12} sm={12} md={12}>
                                                                        <h6 className="mt-2 text-center">Institute Logo</h6>
                                                                        <FormControl fullWidth>
                                                                            <div className="fileinput text-center">
                                                                                <input type="file" onChange={this.handleImageChange2} ref={fileInput2} />
                                                                                {this.state.selectedFile2 == null ?
                                                                                    <div className={"thumbnail"}>
                                                                                        <img style={{ maxHeight: 180, width: 'auto' }} src={Config.path + 'writable/uploads/institute_logo/' + this.state.InstitutionDataid.logo} alt="..." />
                                                                                    </div> :
                                                                                    <div className={"thumbnail"}>
                                                                                        <img style={{ maxHeight: 180, width: 'auto' }} src={this.state.imagePreviewUrl2} alt="..." />
                                                                                    </div>
                                                                                }
                                                                                <div>
                                                                                    {this.state.selectedFile2 === null ? (
                                                                                        <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleClick2()}>
                                                                                            {"Select Logo"}
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <span>
                                                                                            <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="primary" onClick={() => this.handleClick2()}>
                                                                                                Change
                                                                                            </Button>
                                                                                            {null}
                                                                                            <Button className="mt-2 mb-2 mr-2" size="small" variant="contained" color="secondary" onClick={() => this.handleRemove2()}>
                                                                                                <i className="fas fa-times" /> Remove
                                                                                            </Button>
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                                <CardActions stats style={{ marginTop: 10 }}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} md={4} lg={6}></Grid>
                                                                        <Grid item xs={12} md={4} lg={6} className="text-right">
                                                                            <Button type="submit" variant="outlined" className="successBtnOutline"

                                                                            >
                                                                                Submit
                                                                            </Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </CardActions>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>

                                                    {/* //board course     */}
                                                    <Grid container justify="center" className="sliderDiv">
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Card className="card-box  mb-4 customNoData">
                                                                <div className="card-header">
                                                                    <div className="card-header--title">
                                                                        <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                                                                            Board,Course List
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <ReactTable

                                                                    data={
                                                                        this.state.BoardCourseMaster.map((original, key) => {
                                                                            return ({
                                                                                slno: key + 1,
                                                                                id_board: original.id_board,
                                                                                board_name: original.board_name,
                                                                                board_status: original.board_status,
                                                                                course: original.course,
                                                                                course_status: original.course_status,

                                                                                // status: original.status,

                                                                                actions: (
                                                                                    <div>


                                                                                        {AuthHelper('CSTR', 'can_delete') && <Tooltip
                                                                                            id="tooltip-top"
                                                                                            title={original.course_status == "1" ? "Deactivate" : "Activate"}
                                                                                            placement="top"
                                                                                        >
                                                                                            <FormControlLabel
                                                                                                control={
                                                                                                    <Switch
                                                                                                        checked={original.course_status == "1" ? true : false}
                                                                                                        onChange={() => this.handleBoardCourseDelete(original.id_course, original.course_status)}
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
                                                                            Filter: ({ filter, onChange }) => (
                                                                                <TextField
                                                                                    inputProps={{
                                                                                        autoComplete: 'off'
                                                                                    }}
                                                                                    id="sno"
                                                                                    value={filter ? filter.value : ''}
                                                                                    placeholder="S No"
                                                                                    type="text"
                                                                                    onChange={event => onChange(event.target.value)}
                                                                                />
                                                                            )
                                                                        },

                                                                        {
                                                                            Header: "Board",
                                                                            accessor: "board_name",
                                                                            className: "center",
                                                                            Filter: ({ filter, onChange }) => (
                                                                                <TextField
                                                                                    inputProps={{
                                                                                        autoComplete: 'off'
                                                                                    }}
                                                                                    // id="standard"
                                                                                    value={filter ? filter.value : ''}
                                                                                    placeholder="Search Board"
                                                                                    type="text"
                                                                                    onChange={event => onChange(event.target.value)}
                                                                                />
                                                                            )
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
                                                                                    // id="standard"
                                                                                    value={filter ? filter.value : ''}
                                                                                    placeholder="Search Course"
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
                                                                {/* <CardActions stats style={{ marginTop: 0 }}>

                                        </CardActions> */}

                                                            </Card></Grid>
                                                    </Grid>


                                                </Grid>

                                            }

                                        </Grid>
                                        {/* </Card> */}

                                    </form>
                                </Grid>
                            </Grid>

                        </PerfectScrollbar>
                    </Box>
                </Drawer>

                <Drawer

                    anchor="right"
                    open={this.state.mappStreamCourse}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ mappStreamCourse: false })}>
                    <Box className={"app-header-drawer bgColor"} style={{ width: width40p }}>
                        <PerfectScrollbar>

                            <AppBar className="app-header" color="secondary" position="relative">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={() => this.setState({ mappStreamCourse: false })} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4">
                                        Mapp Stream and Course
                                    </Typography>
                                </Toolbar>
                            </AppBar>

                            <Grid container justify="center" className="mt-2">

                                <Grid item xs={12} sm={12} md={10} className="mb-10">
                                    <Card className="card-box  mb-4 p-3">
                                        <Grid container spacing={2} justify="center">

                                            <Grid item xs={12} md={10} lg={10}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        // id="outlined-select-currency"
                                                        select
                                                        label="Select Board"
                                                        variant="outlined"
                                                        value={this.state.boardId}
                                                        onChange={(event) =>
                                                            this.handleBoardDataid("Board", event.target.value)
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
                                            {this.state.boardId.length > 0 &&
                                                <Grid item xs={12} md={10} lg={10}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            // id="outlined-select-currency"
                                                            select
                                                            label="Select Course"
                                                            variant="outlined"
                                                            value={this.state.courseId}
                                                            onChange={(event) =>
                                                                this.handleCourseDataid("Course", event.target.value)
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
                                            }
                                            {this.state.courseId.length > 0 &&
                                                <>
                                                    <Grid item xs={12} sm={12} md={10} className="mb-10  autocompleteDiv" >

                                                        <Autocomplete
                                                            multiple
                                                            id="tags-outlined"
                                                            options={this.state.StreamMaster}
                                                            value={this.state.StreamName}
                                                            onChange={this.searchStream}
                                                            getOptionLabel={(option) => option.name}
                                                            filterSelectedOptions
                                                            required
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="Add Stream here"
                                                                    placeholder="Stream"


                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    {this.state.StreamName.length < 2 &&
                                                        <Grid item xs={12} sm={12} md={10} className="mb-10  autocompleteDiv">
                                                            <Autocomplete
                                                                multiple
                                                                id="tags-outlined"
                                                                options={this.state.filterCombination}
                                                                value={this.state.CombinationName}
                                                                onChange={this.searchCombination}
                                                                getOptionLabel={(option) => option.name}
                                                                filterSelectedOptions
                                                                required
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        variant="outlined"
                                                                        label="Add Combination here"
                                                                        placeholder="Combination"
                                                                        required
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    }
                                                </>
                                            }
                                        </Grid>
                                        <CardActions stats style={{ marginTop: 10 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4} lg={6}></Grid>
                                                <Grid item xs={12} md={4} lg={6} className="text-right">
                                                    <Button variant="outlined" className="successBtnOutline"
                                                        onClick={() => this.InsertStreamCourse()}
                                                    >
                                                        Submit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardActions>
                                    </Card>
                                </Grid>
                                <Grid container justify="center" className="sliderDiv">
                                    <Grid item xs={12} md={10} lg={10}>
                                        <Card className="card-box  mb-4 customNoData">
                                            <div className="card-header">
                                                <div className="card-header--title">
                                                    <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                                                        Stream,Combination List
                                                    </h4>
                                                </div>
                                            </div>
                                            <ReactTable

                                                data={
                                                    this.state.StreamCombinationMaster.map((original, key) => {
                                                        return ({
                                                            slno: key + 1,
                                                            id: original.id,
                                                            board_name: original.board_name,
                                                            course: original.course,
                                                            stream: original.stream,
                                                            combination: original.combination,
                                                            status: original.combination_status,


                                                            actions: (
                                                                <div>


                                                                    {AuthHelper('CSTR', 'can_delete') && <Tooltip
                                                                        id="tooltip-top"
                                                                        title={original.combination_status == "1" ? "Deactivate" : "Activate"}
                                                                        placement="top"
                                                                    >
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch
                                                                                    checked={original.combination_status == "1" ? true : false}
                                                                                    onChange={() => this.handleCombinationDelete(original.id_combination, original.combination_status)}
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
                                                        Filter: ({ filter, onChange }) => (
                                                            <TextField
                                                                inputProps={{
                                                                    autoComplete: 'off'
                                                                }}
                                                                id="sno"
                                                                value={filter ? filter.value : ''}
                                                                placeholder="S No"
                                                                type="text"
                                                                onChange={event => onChange(event.target.value)}
                                                            />
                                                        )
                                                    },

                                                    {
                                                        Header: "Board Name",
                                                        accessor: "board_name",
                                                        className: "center",
                                                        Filter: ({ filter, onChange }) => (
                                                            <TextField
                                                                inputProps={{
                                                                    autoComplete: 'off'
                                                                }}
                                                                // id="standard"
                                                                value={filter ? filter.value : ''}
                                                                placeholder="Search Board Name"
                                                                type="text"
                                                                onChange={event => onChange(event.target.value)}
                                                            />
                                                        )
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
                                                                // id="standard"
                                                                value={filter ? filter.value : ''}
                                                                placeholder="Search Course"
                                                                type="text"
                                                                onChange={event => onChange(event.target.value)}
                                                            />
                                                        )
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
                                                                // id="standard"
                                                                value={filter ? filter.value : ''}
                                                                placeholder="Search Stream"
                                                                type="text"
                                                                onChange={event => onChange(event.target.value)}
                                                            />
                                                        )
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
                                                                // id="standard"
                                                                value={filter ? filter.value : ''}
                                                                placeholder="Search combination"
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
                                            {/* <CardActions stats style={{ marginTop: 0 }}>

                                        </CardActions> */}

                                        </Card></Grid>
                                </Grid>


                            </Grid>


                        </PerfectScrollbar>
                    </Box>
                </Drawer>

                <Drawer

                    anchor="right"
                    open={this.state.openBoard}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ openBoard: false })}>
                    <Box className={"app-header-drawer bgColor"} style={{ width: width100p }}>
                        <PerfectScrollbar>

                            <AppBar className="app-header" color="secondary" position="relative">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={() => this.setState({ openBoard: false })} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4">
                                        Map Board, Course, Stream and Combination
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                            <Grid container justify="center" className="mt-4">

                                <Grid item xs={12} sm={12} md={10} className="mb-10">
                                    <form
                                        onSubmit={this.insertBCSC.bind(this)}
                                        autoComplete="off">
                                        <Card className="card-box  mb-4 p-3">
                                            <Grid container spacing={2} justify="center">
                                                {this.state.BoardCourseHolders.map((BoardCourseHolder, idx) => (
                                                    <Grid container className="my-2 ">
                                                        <Grid item xs={12} sm={1} md={1} >
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={2} className="   pl-1  pr-1 autocompleteDiv" >

                                                            <Autocomplete
                                                                // select
                                                                // id="tags-outlined"
                                                                options={this.state.BoardMaster1 ? this.state.BoardMaster1 : this.state.BoardMaster}

                                                                value={BoardCourseHolder.BoardData}

                                                                onChange={(event, newValue) => this.searchStaff(idx, newValue)}

                                                                getOptionLabel={(option) => option.name}
                                                                // filterSelectedOptions
                                                                required
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        InputLabelProps={{
                                                                            // classes: { root: classes.labelRoot, shrink: classes.shrink },
                                                                            // style: {
                                                                            //     textOverflow: 'ellipsis',
                                                                            //     whiteSpace: 'nowrap',
                                                                            //     overflow: 'hidden',
                                                                            //     width: '100%',
                                                                            //     height: '100%',
                                                                            //     color: 'green'
                                                                            //   }
                                                                        }}
                                                                        variant="outlined"
                                                                        label=" Add Board here"
                                                                        placeholder=" Boards"
                                                                        required

                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={2} className="  pl-1 pr-2  autocompleteDiv">
                                                            <Autocomplete
                                                                // multiple
                                                                // id="tags-outlined"
                                                                // options={idx==0?BoardCourseHolder.filterCourse:this.state.CourseMaster1}
                                                                options={this.state.CourseMaster1 ? this.state.CourseMaster1 : BoardCourseHolder.filterCourse}
                                                                // value={this.state.CourseName}
                                                                value={BoardCourseHolder.CourseData}
                                                                onChange={(event, newValue) => this.searchStaffCourse(idx, newValue)}

                                                                getOptionLabel={(option) => option.name}
                                                                // filterSelectedOptions
                                                                required
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        variant="outlined"
                                                                        label="Add Course here"
                                                                        placeholder="Course"
                                                                        required
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <>
                                                            <Grid item xs={12} sm={12} md={2} className="pl-1 pr-2   autocompleteDiv" >

                                                                <Autocomplete
                                                                    //  multiple
                                                                    //  id="tags-outlined"
                                                                    options={idx == 0 ? BoardCourseHolder.filterStream : this.state.StreamMaster1}
                                                                    // options={BoardCourseHolder.filterStream}
                                                                    //  value={this.state.StreamName}
                                                                    value={BoardCourseHolder.StreamData}
                                                                    onChange={(event, newValue) => this.searchStream(idx, newValue)}
                                                                    getOptionLabel={(option) => option.name}
                                                                    //  filterSelectedOptions
                                                                    required
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant="outlined"
                                                                            label="Add Stream here"
                                                                            placeholder="Stream"
                                                                            required

                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            {/* {this.state.StreamName.length <2 && */}
                                                            <Grid item xs={12} sm={12} md={4} className="pl-1 pr-2  autocompleteDiv">
                                                                <Autocomplete
                                                                    multiple
                                                                    //  id="tags-outlined"
                                                                    //  options={this.state.filterCombination}
                                                                    options={BoardCourseHolder.filterCombination}
                                                                    //  value={this.state.CombinationName}
                                                                    value={BoardCourseHolder.CombinationData}
                                                                    onChange={(event, newValue) => this.searchCombination(idx, newValue)}
                                                                    getOptionLabel={(option) => option.name}
                                                                    filterSelectedOptions
                                                                    required
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant="outlined"
                                                                            label="Add Combination here"
                                                                            placeholder="Combination"
                                                                            required={BoardCourseHolder.CombinationData.length === 0}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            {/* } */}
                                                        </>

                                                        <Grid item xs={12} sm={10} md={1} style={{ margin: 'auto', textAlign: 'center' }}>
                                                            <Grid container justify="center">
                                                                <Grid item xs={12} sm={10} md={8} style={{ margin: 'auto', textAlign: 'center' }}>
                                                                    {
                                                                        // idx==0 ? 
                                                                        // //  <div  className="addHolderStyle"><FormControl fullWidth >
                                                                        // // <TextField 
                                                                        // // // disabled={this.state.editStudent ? false : true}
                                                                        // // id={"add"+idx}  
                                                                        // // onKeyPress={(data) => {
                                                                        // // if (data.charCode === 13) {
                                                                        // // this.addBoardCourseHolder(); 
                                                                        // // }
                                                                        // // }}
                                                                        // // className="m-2"
                                                                        // // InputProps={{
                                                                        // // autoComplete: 'off', 
                                                                        // // readOnly: true,
                                                                        // // startAdornment: (
                                                                        // // <InputAdornment position="start">
                                                                        // // <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}} />
                                                                        // // </InputAdornment>
                                                                        // // ),
                                                                        // // }}
                                                                        // // label="Add" 
                                                                        // // onClick={()=>{this.addBoardCourseHolder();}}
                                                                        // // variant="outlined" />

                                                                        // // </FormControl>
                                                                        // // </div>

                                                                        // :
                                                                        this.state.BoardCourseHolders.length != 1 &&
                                                                        <div className="removeHolderStyle"> <FormControl fullWidth>
                                                                            <TextField
                                                                                className="m-2"
                                                                                onKeyPress={(data) => {
                                                                                    if (data.charCode === 13) {
                                                                                        this.removeBoardCourseHolder(idx);
                                                                                    }
                                                                                }}
                                                                                id={"remove" + idx}
                                                                                InputProps={{
                                                                                    autoComplete: 'off',
                                                                                    readOnly: true,
                                                                                    startAdornment: (
                                                                                        <InputAdornment position="start">
                                                                                            <Remove style={{ color: 'rgb(220, 53, 69)', cursor: 'pointer' }} />
                                                                                        </InputAdornment>
                                                                                    ),
                                                                                }}
                                                                                label="Del"
                                                                                onClick={() => this.removeBoardCourseHolder(idx)}
                                                                                variant="outlined" />
                                                                        </FormControl>
                                                                        </div>
                                                                    }
                                                                </Grid>

                                                            </Grid> </Grid>

                                                        {/* <Grid item xs={12} sm={1} md={1} >
                                                        </Grid> */}
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Grid container justify="center" className="mt-3 mr-1 pr-1">
                                                <Grid item xs={12} sm={12} md={1} className="text-left ">
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={5} className="text-left ">
                                                    <Button variant="outlined" className="warningBtnOutline " style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ openBoard: false })}>Cancel</Button>

                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} className="text-right ">
                                                    <Button className="mr-2" variant="outlined" color="secondary" onClick={() => this.addBoardCourseHolder()}>
                                                        Add Row
                                                    </Button>
                                                    <Button type="submit" className="successBtnOutline ">Submit</Button>


                                                </Grid>

                                            </Grid>
                                        </Card>
                                    </form>
                                </Grid>
                            </Grid>

                        </PerfectScrollbar>
                    </Box>
                </Drawer>



            </Fragment>
        );
    };
}

// export default connect(mapStateToProps, mapDispatchToPros)(withRouter(ClassMaster));
export default connect(mapStateToProps, mapDispatchToPros)(withStyles(styles)(withRouter(ClassMaster)));

