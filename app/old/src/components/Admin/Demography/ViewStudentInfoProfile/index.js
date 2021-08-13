import React, { Fragment } from 'react';
import { Dialog, Grid, Drawer, FormControlLabel, FormControl, IconButton, Chip, Typography, AppBar, Divider, Card, CardContent, Box, TextField, Button, Avatar, Toolbar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { Editor } from 'react-draft-wysiwyg';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Animated } from "react-animated-css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { AuthHelper } from '@utils/AuthHelper.js';
import NavigateNext from "@material-ui/icons/NavigateNext";
import ViewIcon from "@material-ui/icons/Visibility";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import { ExampleWrapperSimple } from '../../../../layout-components';
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import Autocomplete from "../../../../layout-components/CustomComponents/AutoComplete.js";
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import defaultImage from "@assetss/images/placeholder.jpg";
import 'date-fns';
import ViewStaffInfo from "../ViewStaffInfo";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
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
const fileMotherInput = React.createRef();
const fileFatherInput = React.createRef();
const fileGuardInput = React.createRef();
const fileBirthInput = React.createRef();
const fileAadhaarInput = React.createRef();
const fileTransferInput = React.createRef();
const fileMarksInput = React.createRef();

class StudentDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: 'all',
            loading: false,
            firstname: "",
            previous_id: "",
            middlename: "",
            lastname: "",
            gender: "",
            bloodgroup: "",
            mothertongue: "",
            nationality: "",
            religion: "",
            caste: "",
            castecategory: "",
            phone_no: "",
            email: "",
            linkedin_id: "",
            facebook_id: "",
            address_line1: "",
            address_line2: "",
            pincode: "",
            taluk: "",
            post_office: "",
            city: "",
            district: "",
            state: "",
            permanent_address1: "",
            permanent_address2: "",
            permanent_pincode: "",
            permanent_city: "",
            permanent_district: "",
            permanent_state: "",
            permanent_post_office: "",
            birth_certificate_no: "",
            aadhaar_no: "",
            passport_no: "",
            driving_license_no: "",
            selectedOptionalSubject: '',
            selectedOptionalSubjectIds: '',
            standardSubjects: [],
            subjects: [],
            student_photo: '',
            individualAttachments: [{ student_photo: "", father_photo: "", mother_photo: "", guardian_photo: "", birth_certificate: "", aadhaar_card: "", latest_marks_card: "", transfer_certificate: "" }],
            individualAllData: [],
            individualPrevious: [],
            individualFees: [],
            phone1Checked: false,
            phone2Checked: false,
            bothChecked: false,
            studentData: [],
            individualData: [],
            individualSiblings: [],
            message_sent_to: '',
            messageCheck: false,
            formChanged: false,
            showTextSuggestions: false,
            textSuggestions: [],
            feeCategoryChecked: false,
            selectedFeeSection: false,
            selectedFeeSectionId: '',
            boardChecked: false,
            selectedFeeBoard: '',
            same_address: false,
            father_name: "",
            father_middle_name: "",
            father_last_name: "",
            father_phone_no: "",
            father_email_id: "",
            father_linkedin_id: "",
            father_facebook_id: "",
            mother_name: "",
            mother_middle_name: "",
            mother_last_name: "",
            mother_phone_no: "",
            mother_email_id: "",
            mother_linkedin_id: "",
            mother_facebook_id: "",
            guard_name: "",
            guard_middle_name: "",
            guard_last_name: "",
            guard_phone_no: "",
            guard_email_id: "",
            guard_linkedin_id: "",
            guard_facebook_id: "",
            guard_address_line1: "",
            guard_address_line2: "",
            guard_pincode: "",
            guard_city: "",
            guard_district: "",
            guard_state: "",
            primary_contact: "",
            primary_contact1: "",
            message_sent_to: "",
            activeAccordion: '',
            categoryName: '',
            lfeecategory: '',
            categoryData: [],
            classwiseSectionsDashboard: [],
            boardDetails: [],
            academicDetails: [],
            dashboardDetails: [],
            TotalStudentCount: 0,
            studentname: '',
            siblingHolders: [],
            awardHolders: [{ award_academic_year: '', area_of_achievement: '', award_remarks: '' }],
            siblingCount: '',
            awardCount: '',
            previouslyStudied: '',
            passed_name: '',
            passed_address: '',
            passed_academic_year: '',
            passed_board: '',
            passed_standard: '',
            passed_grade: '',
            passed_marks: '',
            fee_board: '',
            fee_category: '',
            fee_standard: '',
            gender: '',
            dateOfBirth: new Date(),
            imagePreviewUrl: defaultImage,
            imageFatherPreviewUrl: defaultImage,
            imageMotherPreviewUrl: defaultImage,
            imageGuardPreviewUrl: defaultImage,
            imageBirthPreviewUrl: defaultImage,
            imageAadhaarPreviewUrl: defaultImage,
            imageMarksPreviewUrl: defaultImage,
            imageTransferPreviewUrl: defaultImage,
            defaultDisplayImage: defaultImage,
            error: '',
            genderArray: ['Male', 'Female', 'Others'],
            selectedFile: null,
            selectedFatherFile: null,
            selectedMotherFile: null,
            selectedGuardFile: null,
            selectedBirthFile: null,
            selectedAadhaarFile: null,
            selectedMarksFile: null,
            selectedTransferFile: null,
            alert: null,
            currentForm: 'student_details',
            sameInstitute: '',
            standardSections: [],
            sectionSuggestions: [],
            pincodesArr: [],
            filterSections: [],
            selectedStandardId: '',
            selectedSection: '',
            selectedStandard: '',
            selectedOrganizationId: this.props.data.selectedOrganizationId,
            selectedInstitutionId: this.props.data.selectedInstitutionId,
            selectedBoard: this.props.data.selectedBoardId,
            selectedAcademicYear: this.props.data.selectedAcademicId,
            classwiseSections: [],
            userInput: "",
            userSiblingInput: "",
            studentSuggestions: [],
            activeSuggestion: 0,
            filteredSuggestions: [],
            activeStep: 0,
            joiningStandard: '',
            steps: ['Student Profiling', 'Sibling Profiling', 'Parents Profiling', 'Academic Profiling', 'Fee Configuration', 'Attachments'],
            requiredState: "",
            basicNotify: false,
            searchStudent: false,
            admission_number: '',
            admission_date: new Date(),
            sts_number: '',
            student_uid: '',
            student_id: '',
            fee_id: '',
            attachment_id: '',
            standard_name: '',
            section_name: ''

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
    selectJoiningStandard = (value, id) => {
        this.setState({ joiningStandard: value, fee_standard: id });
    }
    getStateValue = (name) => {
        return this.state.name;
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

    handleFatherImageChange = event => {
        this.setState({
            selectedFatherFile: event.target.files[0]
        })
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                imageFatherPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleMotherImageChange = event => {
        this.setState({
            selectedMotherFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageMotherPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleGuardImageChange = event => {
        this.setState({
            selectedGuardFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageGuardPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleBirthImageChange = event => {
        this.setState({
            selectedBirthFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageBirthPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleStudentSearch = (val) => {

    }
    handleIndividualSearch = (val) => {
        this.setState({ 'id_user': val.UID, viewStudentPanel: true });
        setTimeout(() => {
            this.getIndividualStudentDetails(val.UID);
        }, 1500);
    }
    handleAadhaarImageChange = event => {
        this.setState({
            selectedAadhaarFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageAadhaarPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };
    handleMarksImageChange = event => {
        this.setState({
            selectedMarksFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageMarksPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };

    handleChangePrevious = (index, name, value) => {
        let data = this.state.individualPrevious;
        data[index][name] = value;
        this.setState({ data });
    }

    handleTransferImageChange = event => {
        this.setState({
            selectedTransferFile: event.target.files[0]
        })
        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState({
                imageTransferPreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(event.target.files[0])
    };

    fillAddress = (po, taluk, district, state, event) => {
        event.preventDefault();
        if (this.state.addressType == "pincode") {
            this.setState({ post_office: po, taluk: taluk, district: district, state: state, selectPOPanel: false });
        }
        else {
            this.setState({ permanent_post_office: 'po', permanent_taluk: taluk, permanent_district: district, permanent_state: state, selectPOPanel: false });
        }
    }

    renderTextInput = (name, label) => {
        return (
            <FormControl fullWidth>
                <TextField
                    disabled={this.state.editStudent ? false : true}
                    inputProps={{
                        autoComplete: "off",
                        pattern: "[a-z]"
                    }}
                    id="document-type"
                    value={this.state[name]}
                    label={label}
                    type="search"
                    onChange={(event) => this.handleChangeState(name, event.target.value)}
                    className="m-2"
                    inputRef={this.textInput}
                    variant="outlined"
                />
            </FormControl>
        )
    }

    removeAwardHolder(i) {
        const { awardHolders } = this.state;
        this.setState({
            awardHolders: awardHolders.filter((award, index) => index !== i),
        });
    }
    handleAddAwardholder = (c) => {
        let lawardholders = this.state.awardHolders;
        let lAwards = {};
        lAwards.award_academic_year = '';
        lAwards.area_of_achievement = '';
        lAwards.award_remarks = '';
        lawardholders.push(lAwards);
        this.setState({ awardHolders: lawardholders });
    }

    handleAwardChange = (pIndex, inputName, pValue) => {
        console.log(pIndex);
        let lAwardHolders = this.state.awardHolders;
        lAwardHolders[pIndex][inputName] = pValue;
        this.setState({ awardHolders: lAwardHolders });
    }

    verifyNumber = value => {
        if (value) {
            var numberRex = new RegExp("^[0-9]+$");
            if (numberRex.test(value)) {
                return true;
            }
            return false;
        }

    };
    verifyInput = value => {
        var numberRex = new RegExp("^[A-Za-z]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    };

    handleFeeCategory = (id, name, status) => {
        this.setState({ fee_category: id, categoryName: name });
    }

    replaceText = (str) => {
        let string = str.replace(" B.O", "");
        string = string.replace(" S.O", "");
        return string;
    }

    handleChangeInstitute = (idx, value) => {
        let lsiblingata = this.state.siblingHolders;
        lsiblingata.map((siblings, id) => {
            if (idx == id) {
                siblings.checked = value;
            }
        });
        this.setState({ siblingHolders: lsiblingata });
    };

    handleBoard = (id, name, status) => {
        this.setState({ fee_board: id, selectedFeeBoard: name });
    }

    rendersiblings = () => {
        let siblingCount = this.state.siblingCount;

        let lsiblingholders = this.state.siblingHolders;
        if (siblingCount > 0) {
            for (let i = 0; i < siblingCount; i++) {
                lsiblingholders.push({ sibling_firstname: '', sibling_middlename: '', sibling_lastname: '', sibling_gender: '', sibling_dob: '', sibling_standard: '', sibling_board: '', sibling_school: '', checked: "" });
            }
            this.setState({ siblingHolders: lsiblingholders, siblingCount: this.state.siblingHolders.length });
        }
    }

    handleUpdate(id, order) {
        //console.log(this.state.fee_id);
        let formData = new FormData();
        formData.append('id', id);
        formData.append('student_uid', this.state.student_uid);
        formData.append('order', order);
        formData.append('awardHolders', JSON.stringify(this.state.awardHolders));
        formData.append('id_organization', this.state.selectedOrganizationId);
        formData.append('id_institute', this.state.selectedInstitutionId);
        formData.append('firstname', this.state.firstname);
        formData.append('middlename', this.state.middlename);
        formData.append('lastname', this.state.lastname);
        formData.append('gender', this.state.gender ? this.state.gender : this.state.individualData.gender);
        formData.append('bloodgroup', this.state.bloodgroup);
        formData.append('dateOfBirth', moment(this.state.dateOfBirth).format("YYYY-MM-DD"));
        formData.append('mothertongue', this.state.mothertongue);
        formData.append('nationality', this.state.nationality);
        formData.append('religion', this.state.religion);
        formData.append('caste', this.state.caste);
        formData.append('castecategory', this.state.castecategory);
        formData.append('phone_no', this.state.phone_no);
        formData.append('email', this.state.email);
        formData.append('linkedin_id', this.state.linkedin_id);
        formData.append('facebook_id', this.state.facebook_id);
        formData.append('address_line1', this.state.address_line1);
        formData.append('address_line2', this.state.address_line2);
        formData.append('post_office', this.state.post_office);
        formData.append('pincode', this.state.pincode);
        formData.append('city', this.state.taluk);
        formData.append('district', this.state.district);
        formData.append('state', this.state.state);
        formData.append('previous_id', this.state.previous_id);
        formData.append('permanent_address1', this.state.permanent_address1);
        formData.append('permanent_address2', this.state.permanent_address2);
        formData.append('permanent_pincode', this.state.permanent_pincode);
        formData.append('permanent_post_office', this.state.permanent_post_office);
        formData.append('permanent_city', this.state.permanent_city);
        formData.append('permanent_district', this.state.permanent_district);
        formData.append('permanent_state', this.state.permanent_state);
        formData.append('birth_certificate_no', this.state.birth_certificate_no);
        formData.append('aadhaar_no', this.state.aadhaar_no);
        formData.append('passport_no', this.state.passport_no);
        formData.append('driving_license_no', this.state.driving_license_no);
        formData.append('father_name', this.state.father_name);
        formData.append('father_middle_name', this.state.father_middle_name);
        formData.append('father_last_name', this.state.father_last_name);
        formData.append('father_phone_no', this.state.father_phone_no);
        formData.append('father_email_id', this.state.father_email_id);
        formData.append('father_linkedin_id', this.state.father_linkedin_id);
        formData.append('father_facebook_id', this.state.father_facebook_id);
        formData.append('mother_name', this.state.mother_name);
        formData.append('mother_middle_name', this.state.mother_middle_name);
        formData.append('mother_last_name', this.state.mother_last_name);
        formData.append('mother_phone_no', this.state.mother_phone_no);
        formData.append('mother_email_id', this.state.mother_email_id);
        formData.append('mother_linkedin_id', this.state.mother_linkedin_id);
        formData.append('mother_facebook_id', this.state.mother_facebook_id);
        formData.append('guard_name', this.state.guard_name);
        formData.append('guard_middle_name', this.state.guard_middle_name);
        formData.append('guard_last_name', this.state.guard_last_name);
        formData.append('guard_phone_no', this.state.guard_phone_no);
        formData.append('guard_email_id', this.state.guard_email_id);
        formData.append('guard_linkedin_id', this.state.guard_linkedin_id);
        formData.append('guard_facebook_id', this.state.guard_facebook_id);
        formData.append('guard_address_line1', this.state.guard_address_line1);
        formData.append('guard_address_line2', this.state.guard_address_line2);
        formData.append('guard_pincode', this.state.guard_pincode);
        formData.append('guard_city', this.state.guard_city);
        formData.append('guard_district', this.state.guard_district);
        formData.append('guard_state', this.state.guard_state);
        formData.append('primary_contact', this.state.primary_contact);
        formData.append('primary_contact1', this.state.primary_contact1);
        formData.append('message_sent_to', this.state.message_sent_to);
        formData.append('previouslyStudied', this.state.previouslyStudied);
        formData.append('passed_name', this.state.passed_name);
        formData.append('passed_address', this.state.passed_address);
        formData.append('passed_academic_year', this.state.passed_academic_year);
        formData.append('passed_board', this.state.passed_board);
        formData.append('passed_standard', this.state.passed_standard);
        formData.append('passed_grade', this.state.passed_grade);
        formData.append('fee_id', this.state.fee_id);
        formData.append('fee_board', this.state.fee_board);
        formData.append('fee_category', this.state.fee_category);
        formData.append('fee_standard', this.state.fee_standard);
        formData.append('student_photo', this.state.selectedFile);
        formData.append('father_photo', this.state.selectedFatherFile);
        formData.append('mother_photo', this.state.selectedMotherFile);
        formData.append('guardian_photo', this.state.selectedGuardFile);
        formData.append('birth_certificate', this.state.selectedBirthFile);
        formData.append('aadhaar_card', this.state.selectedAadhaarFile);
        formData.append('latest_marks_card', this.state.selectedMarksFile);
        formData.append('transfer_certificate', this.state.selectedTransferFile);
        formData.append('attachment_id', this.state.attachment_id);
        formData.append('admission_date', moment(this.state.admission_date).format("YYYY-MM-DD"));
        formData.append('admission_number', this.state.admission_number);
        formData.append('sts_number', this.state.sts_number);
        console.log(...formData);
        new Service().apiCall('StudentDetails/updateStudent', formData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            console.log(response);
            if (response.status == 200) {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <div className="avatar-icon-wrapper rounded-circle m-0">
                                    <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-success text-success m-0 d-130">
                                        <FontAwesomeIcon
                                            icon={['fas', 'check']}
                                            className="d-flex align-self-center display-3"
                                        />
                                    </div>
                                </div>
                                <h4 className="font-weight-bold mt-4">Student Updated Successfully!</h4>

                            </div>
                        </Dialog>
                    ),
                });
                setTimeout(() => {
                    this.setState({ basicNotify: null, editStudent: false, formChanged: false });
                    //  this.props.history.push({
                    // pathname: '/admin/student'})
                }, 2000)
            } else {
                //this.raiseLoginSignupErrorAlert("signup");
            }
        }).catch(error => {
            //this.raiseLoginSignupErrorAlert("signup");
        });

    }

    handlePreviouStudied = (value) => {
        this.setState({ previouslyStudied: value });
    }
    handleAdmissionDate = (val) => {
        this.setState({ admission_date: val })
    };

    handleClick = (name) => {
        if (name == 'student') {
            fileInput.current.click();
        } else if (name == 'father') {
            fileFatherInput.current.click();
        } else if (name == 'mother') {
            fileMotherInput.current.click();
        } else if (name == 'guardian') {
            fileGuardInput.current.click();
        } else if (name == 'birth') {
            fileBirthInput.current.click();
        } else if (name == 'aadhaar') {
            fileAadhaarInput.current.click();
        } else if (name == 'marks') {
            fileMarksInput.current.click();
        } else if (name == 'transfer') {
            fileTransferInput.current.click();
        }
    };

    handleRemove = (name) => {
        if (name == 'student') {
            this.setState({
                imagePreviewUrl: defaultImage, selectedFile: null
            });
            fileInput.current.value = null;
        } else if (name == 'father') {
            this.setState({
                imageFatherPreviewUrl: defaultImage, selectedFatherFile: null
            });
            fileFatherInput.current.value = null;
        } else if (name == 'mother') {
            this.setState({
                imageMotherPreviewUrl: defaultImage, selectedMotherFile: null
            });
            fileMotherInput.current.value = null;
        } else if (name == 'guard') {
            this.setState({
                imageGuardPreviewUrl: defaultImage, selectedGuardFile: null
            });
            fileGuardInput.current.value = null;
        } else if (name == 'birth') {
            this.setState({
                imageBirthPreviewUrl: defaultImage, selectedBirthFile: null
            });
            fileBirthInput.current.value = null;
        } else if (name == 'aadhaar') {
            this.setState({
                imageAadhaarPreviewUrl: defaultImage, selectedAadhaarFile: null
            });
            fileAadhaarInput.current.value = null;
        } else if (name == 'marks') {
            this.setState({
                imageMarksPreviewUrl: defaultImage, selectedMarksFile: null
            });
            fileMarksInput.current.value = null;
        } else if (name == 'transfer') {
            this.setState({
                imageTransferPreviewUrl: defaultImage, selectedTransferFile: null
            });
            fileTransferInput.current.value = null;
        }
    };

    handleSiblingData = (pIndex, inputName, pValue) => {
        let lSiblingHolders = this.state.individualSiblings;
        lSiblingHolders[pIndex][inputName] = pValue;
        this.setState({ individualSiblings: lSiblingHolders });
    }

    verifyNumberLength = (value, length) => {

        var numberRex = new RegExp("^[0-9]+$");
        if (value) {
            console.log(value.length, length);
            if (value.length < length && numberRex.test(value)) {
                return true;
            }
            return false;
        }
        else {
            console.log("error");
            return true;
        }
    };

    getAddressInfo(pincode, type) {
        this.setState({ [type]: pincode });
        if (pincode && pincode.length == 6) {
            const postData = {
                pincode: pincode,
            }
            new Service().apiCall('Pincode/GetPincode', postData).then(response => {
                if (response.status == 200 && response.data != '') {
                    if (response.data) {

                        let newArr = response.data.filter(v => v.delivery == "Delivery");
                        console.log(newArr);
                        this.setState({ pincodesArr: newArr, selectPOPanel: true, addressType: type })
                    }
                    else {
                        this.setState({ pincodesArr: [] })
                    }
                }
            }).catch(error => {
                alert("error");

            });
        }
    }

    handleChangeState = (name, value) => {
        let allowOnlyText = ["firstname", "middlename", "lastname"];
        let allowNumberLimit = ["phone_no", "father_phone_no", "mother_phone_no", "guard_phone_no", "primary_contact", "primary_contact1"];
        let pinCheck = ["pincode", "permanent_pincode", "guard_pincode"];
        let numberCheck = ["passed_academic_year"];
        if (allowOnlyText.includes(name)) {
            this.setState({ [name]: value.replace(/[^A-Za-z]/ig, '') });
        }
        else if (allowNumberLimit.includes(name)) {
            if (this.verifyNumberLength(value, 11)) {
                this.setState({ [name]: value });
            }
        }
        else if (pinCheck.includes(name)) {
            if (this.verifyNumberLength(value, 7)) {
                this.getAddressInfo(value, "pincode");
            }
        }
        else if (numberCheck.includes(name)) {
            if (this.verifyNumber(value)) {
                this.setState({ [name]: value });
            }
        }
        else {
            this.setState({ [name]: value });
        }
    }

    handleAddress = (status) => {
        if (status == false) {
            this.setState({ permanent_address1: this.state.address_line1, permanent_address2: this.state.address_line2, permanent_pincode: this.state.pincode, permanent_post_office: this.state.post_office, permanent_city: this.state.taluk, permanent_district: this.state.district, permanent_state: this.state.state, same_address: !status })

        }
        else {
            this.setState({ permanent_address1: '', permanent_address2: '', permanent_pincode: '', permanent_city: '', permanent_post_office: '', permanent_district: '', permanent_state: '', same_address: !status })
        }
    }

    handleDateOfBirth = (dob) => {
        this.setState({ dateOfBirth: dob })
    };

    studentProfiling = () => {
        console.log('profile' + this.state.firstname);
        return (
            <div className="w-100">
                {this.state.individualAllData.map((element, idx) => (

                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Primary Information {element.UID}
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("firstname", "First Name")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("middlename", "Middle Name")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("lastname", "Last Name")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("gender", "Gender")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("bloodgroup", "Blood Group")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                <FormControl fullWidth>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Date of birth"
                                            inputVariant="outlined"
                                            format="MM/dd/yyyy"
                                            value={this.state.dateOfBirth}
                                            onChange={this.handleDateOfBirth}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("mothertongue", "Mother Tongue")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("nationality", "Nationality")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("religion", "Religion")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("caste", "Caste")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("castecategory", "Caste Category")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Contact Details
                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("phone_no", "Phone Number")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("email", "Email")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("linkedin_id", "Linkedin ID")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("facebook_id", "Facebook ID")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Correspondance Address
                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={5} className="py-1">
                                {this.renderTextInput("address_line1", "Communication address line 1")}
                            </Grid>
                            <Grid item xs={12} lg={5} className="py-1">
                                {this.renderTextInput("address_line2", "Communication address line 2")}
                            </Grid>
                            <Grid item xs={12} lg={2} className="py-1">
                                {this.renderTextInput("pincode", "Pincode")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("post_office", "Post Office")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("taluk", "Taluk/City")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("district", "District")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("state", "State")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={3} className="p-20  mt-3">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Permanent Address
                </div>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={9} className="p-20">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            tabIndex={-1}
                                            checked={this.state.same_address == true}
                                            onClick={() => { this.handleAddress(this.state.same_address); this.setState({ same_address: !this.state.same_address }) }}
                                        />
                                    } label="Same as above"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={5} className="py-1">
                                {this.renderTextInput("permanent_address1", "Permanent address line 1")}
                            </Grid>
                            <Grid item xs={12} lg={5} className="py-1">
                                {this.renderTextInput("permanent_address2", "Permanent address line 2")}
                            </Grid>
                            <Grid item xs={12} lg={2} className="py-1">
                                {this.renderTextInput("permanent_pincode", "Pincode")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("permanent_post_office", "Post Office")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("permanent_city", "Taluk/City")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("permanent_district", "District")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("permanent_state", "State")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Admission Details
                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("admission_number", "Admission Number")}
                            </Grid>
                            {/* <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("aadhaar_no","Aadhaar No")}
              </Grid> */}
                            <Grid item xs={12} lg={4} className="py-1">
                                <FormControl fullWidth>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Admission Date"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            value={this.state.admission_date}
                                            onChange={this.handleAdmissionDate}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={12} lg={3} className="py-1">
                {this.renderTextInput("admission_date","Admission Date")}
              </Grid> */}
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("sts_number", "STS Number")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Supporting Documents References
                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("birth_certificate_no", "Birth Certificate No")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("aadhaar_no", "Aadhaar No")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("passport_no", "Passport No")}
                            </Grid>
                            <Grid item xs={12} lg={3} className="py-1">
                                {this.renderTextInput("driving_license_no", "Driving License No")}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mt-2">
                            <Grid item xs={12} lg={12} className="py-1 text-right">
                                {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') &&
                                    <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                                        Edit
                  </Button>
                                }

                                {this.state.editStudent &&
                                    <div>
                                        <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                                        <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.handleUpdate(element.id, '1')}>Submit</Button>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </div>
        )
    }

    siblingProfiling = () => {
        return (
            <div className="w-100">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={12} className="p-20">
                        <Card className="card-box  mb-2 mt-2 py-3">
                            <Grid container spacing={2} justify="center" className="align-center">
                                <Grid item xs={12} sm={6} lg={3} className="text-right">
                                    <span className="mr-10">No of Siblings </span>
                                    <input type='number' className="text-center mr-10 w-50"
                                        value={this.state.siblingCount}
                                        onChange={(event => this.setState({ siblingCount: event.target.value }))}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={1} className="m-0 pickerGrid">
                                    <Avatar onClick={() => this.rendersiblings()}>
                                        <NavigateNext />
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={8} className="m-0"></Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
                {this.state.individualSiblings.map((sibling, idx) => (
                    <Card className="card-box  mb-2 mt-2 py-3 px-3">
                        <Grid container spacing={2} justify="center" className="align-center">
                            <Grid item xs={12} sm={6} lg={6}>
                                <strong>Sibling {idx + 1} </strong>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                Studying in same institute?
        </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <FormControl component="fieldset">
                                    <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                                        <FormControlLabel value="end" control={
                                            <Radio color="primary" checked={sibling.checked == "Yes" == "Yes"}
                                                onChange={() => { this.handleChangeInstitute(idx, "Yes") }} />} label="Yes" />
                                        <FormControlLabel value="end" control={<Radio color="primary" checked={sibling.checked == "No"}
                                            onChange={() => { this.handleChangeInstitute(idx, "No") }} />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {sibling.checked == "Yes" && <div>

                        </div>
                        }
                        {sibling.checked == "No" && <div>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_first_name}
                                            label="First Name"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_first_name", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_middle_name}
                                            label="Middle Name"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_middle_name", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />

                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_last_name}
                                            label="Last Name"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_last_name", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_gender}
                                            label="Gender"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_gender", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1 dobGrid">
                                    <FormControl fullWidth>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Date of birth"
                                                inputVariant="outlined"
                                                format="dd/MM/yyyy"
                                                value={sibling.sibling_dob}
                                                onChange={(val) => this.handleSiblingData(idx, "sibling_dob", val)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_standard}
                                            label="Studying Standard"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_standard", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_board}
                                            label="Board"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_board", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_school}
                                            label="School name"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_school", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} lg={8} className="py-1">
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            id="document-type"
                                            value={sibling.sibling_school}
                                            label="School full address"
                                            type="search"
                                            onChange={(event) => this.handleSiblingData(idx, "sibling_school_address", event.target.value)}
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                        }
                    </Card>
                ))}
                <Grid container spacing={2} className="mt-2">

                    <Grid item xs={12} lg={12} className="py-1 text-right">
                        {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') && <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
             </Button>}
                        {this.state.editStudent && <div> <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                            <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }}>
                                Submit
               </Button>
                        </div>}
                    </Grid>
                </Grid>
            </div>
        )
    }

    parentsProfiling = () => {
        return (
            <div className="w-100">
                {this.state.individualAllData.map((element, idx) => (
                    <div>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={12} className="p-20">
                                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                                        Fathers Primary Information
          </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("father_name", "First Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("father_middle_name", "Middle Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("father_last_name", "Last Name")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("father_phone_no", "Phone Number")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("father_email_id", "Email ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("father_linkedin_id", "Linkedin ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("father_facebook_id", "Facebook ID")}
                                </Grid>
                            </Grid>
                        </Card>

                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={12} className="p-20">
                                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                                        Mothers Primary Information
          </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("mother_name", "First Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("mother_middle_name", "Middle Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("mother_last_name", "Last Name")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("mother_phone_no", "Phone Number")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("mother_email_id", "Email ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("mother_linkedin_id", "Linkedin ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("mother_facebook_id", "Facebook ID")}
                                </Grid>
                            </Grid>
                        </Card>

                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={12} className="p-20">
                                    <div className="card-header--title font-size-md font-weight-bold ml-2">
                                        Guardians(if any) Primary Information
          </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("guard_name", "First Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("guard_middle_name", "Middle Name")}
                                </Grid>
                                <Grid item xs={12} lg={4} className="py-1">
                                    {this.renderTextInput("guard_last_name", "Last Name")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("guard_phone_no", "Phone Number")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("guard_email_id", "Email ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("guard_linkedin_id", "Linkedin ID")}
                                </Grid>
                                <Grid item xs={12} lg={3} className="py-1">
                                    {this.renderTextInput("guard_facebook_id", "Facebook ID")}
                                </Grid>
                            </Grid>
                        </Card>

                        <Grid container spacing={2} className="mt-2">

                            <Grid item xs={12} lg={12} className="py-1 text-right">
                                {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') && <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                                    Edit
        </Button>}
                                {this.state.editStudent && <div> <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                                    <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.handleUpdate(element.id, '2')}>
                                        Submit
          </Button>
                                </div>}
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </div>
        )
    }

    AcademicProfiling = () => {
        return (
            <div className="w-100">

                <Card className="card-box  mb-2 mt-2 py-3 px-3">
                    <Grid container spacing={2} justify="center" className="align-center">

                        <Grid item xs={12} sm={6} lg={6}>
                            Previously studied?
        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl component="fieldset">
                                <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                                    <FormControlLabel value="end" control={
                                        <Radio color="primary" checked={this.state.previouslyStudied == "Yes"}
                                            onChange={() => { this.handlePreviouStudied("Yes") }} />} label="Yes" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl component="fieldset">
                                <RadioGroup row aria-label="position" name="yes" defaultValue="top">
                                    <FormControlLabel value="end" control={<Radio color="primary" checked={this.state.previouslyStudied == "No"}
                                        onChange={() => { this.handlePreviouStudied("No") }} />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {this.state.previouslyStudied == "Yes" && <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} lg={12} className="p-20">
                                <div className="card-header--title font-size-md font-weight-bold ml-2">
                                    Please mention latest passed out details
          </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_name", "School Name")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_address", "School Address")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_academic_year", "Academic Year")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_board", "Board")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_standard", "Standard")}
                            </Grid>
                            <Grid item xs={12} lg={4} className="py-1">
                                {this.renderTextInput("passed_grade", "Grade")}
                            </Grid>
                        </Grid>
                    </div>
                    }
                </Card>

                <Card className="card-box  mb-2 mt-2 py-3 px-3">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} lg={12} className="p-20">
                            <div className="card-header--title font-size-md font-weight-bold ml-2">
                                Awards and recognition (if any)
          </div>
                        </Grid>
                    </Grid>
                    {this.state.awardHolders.map((awardholder, idx) => (
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            disabled={this.state.editStudent ? false : true}
                                            id="document-type"
                                            value={awardholder.award_academic_year}
                                            label="Academic Year"
                                            type="search"
                                            onChange={(event) =>
                                                this.handleAwardChange(idx, "award_academic_year", event.target.value)
                                            }
                                            inputRef={this.textInput}
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            disabled={this.state.editStudent ? false : true}
                                            id="document-type"
                                            value={awardholder.area_of_achievement}
                                            label="Area of achievement"
                                            type="search"
                                            onChange={(event) =>
                                                this.handleAwardChange(idx, "area_of_achievement", event.target.value)
                                            }
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputProps={{
                                                autoComplete: 'off'
                                            }}
                                            disabled={this.state.editStudent ? false : true}
                                            id="document-type"
                                            value={awardholder.award_remarks}
                                            label="Remarks"
                                            type="search"
                                            onChange={(event) =>
                                                this.handleAwardChange(idx, "award_remarks", event.target.value)
                                            }
                                            variant="outlined" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={1}>
                                    {(this.state.awardHolders.length - 1) == idx ? <div className="addHolderStyle inputMargin"><FormControl fullWidth >
                                        <TextField

                                            id="document-type"
                                            onKeyPress={(data) => {
                                                if (data.charCode === 13) {
                                                    this.handleAddAwardholder(); this.focusTextInput();
                                                }
                                            }}
                                            disabled={this.state.editStudent ? false : true}
                                            InputProps={{
                                                autoComplete: 'off',
                                                readOnly: true,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Add style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            label="Add"
                                            onClick={() => { this.handleAddAwardholder(); this.focusTextInput() }}
                                            variant="outlined" />
                                    </FormControl></div>
                                        :
                                        <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                                            <TextField
                                                disabled={this.state.editStudent ? false : true}
                                                onKeyPress={(data) => {
                                                    if (data.charCode === 13) {
                                                        this.removeAwardHolder(idx);
                                                    }
                                                }}
                                                id="document-type"
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
                                                onClick={() => { this.removeAwardHolder(idx); }}
                                                variant="outlined" />
                                        </FormControl></div>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </Card>
                <Grid container spacing={2} className="mt-2">

                    <Grid item xs={12} lg={12} className="py-1 text-right">
                        {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') && <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
        </Button>}
                        {this.state.editStudent && <div> <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                            <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.handleUpdate(this.state.student_id, '4')}>
                                Submit
          </Button>
                        </div>}
                    </Grid>
                </Grid>
            </div>
        )
    }

    feeConfiguration = () => {
        console.log(this.state.fee_category);
        return (
            <div className="w-100">
                <Card className="card-box  mb-2 mt-2 py-3 px-3">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12}>
                            <div className="card-header--title font-size-md font-weight-bold ml-2">
                                Select Category:
        </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        {this.state.categoryData.length > 0 && this.state.categoryData.map((original, key) => (
                            <Grid item xs={12} sm={6} lg={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={this.state.editStudent ? false : true}
                                            tabIndex={-1}
                                            checked={this.state.fee_category == original.id ? true : false}
                                            onClick={() => { this.handleFeeCategory(original.id, original.name, this.state.feeCategoryChecked) }}
                                        />
                                    }
                                    label={original.name}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Card>
                {/* <Card className="card-box  mb-2 mt-2 py-3 px-3">
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={3}>
        <div className="card-header--title font-size-md font-weight-bold ml-2">
        Select Board:
        </div>
        </Grid>
        </Grid>
        <Grid container spacing={2}>
        {this.state.boardDetails.length>0 && this.state.boardDetails.map((original,key) => (
            <Grid item xs={12} sm={6} lg={3}>
                 <FormControlLabel
                      control={
                        <Checkbox
                          disabled={this.state.editStudent ? false : true}
                          tabIndex={-1}
                          checked={original.id == this.state.fee_board ? true : false}
                          onClick={() => {this.getStandardSectionDetails(original.id,this.state.selectedAcademicYear);this.handleBoard(original.id,original.name,this.state.boardChecked)}}
                        />
                      }
                      label={original.name}
                    />
            </Grid>  
        ))}  
        </Grid>  
    </Card>  */}
                <Card className="card-box  mb-2 mt-2 py-3 px-3">
                    <Grid container spacing={2} justify="center" className="align-center">
                        <Grid item xs={12} sm={12} lg={5} className="text-center">
                            <div className="card-header--title font-size-md font-weight-bold ml-2">
                                Joining Standard
        </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <FormControl fullWidth>
                                <TextField
                                    disabled={this.state.editStudent ? false : true}
                                    className="m-2"
                                    id="outlined-select-currency"
                                    select
                                    label="Select Standard"
                                    value={this.state.fee_standard}
                                    onChange={(event, child) => this.selectJoiningStandard(event.target.value, child.props.id)}
                                    variant="outlined">
                                    {this.state.textSuggestions.map(option => (
                                        <MenuItem key={option.value} value={option.id} id={option.id}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            {/* <Button color="secondary" variant="contained" onClick={()=>{this.setState({standardPanel:true});    this.getSectionSubjectDetails(this.state.fee_standard);this.getSubjectDetails(this.state.fee_standard);}}>Go</Button> */}
                        </Grid>
                    </Grid>
                </Card>
                <Grid container spacing={2} className="mt-2">

                    <Grid item xs={12} lg={12} className="py-1 text-right">
                        {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') && <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
             </Button>}
                        {this.state.editStudent && <div> <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                            <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.handleUpdate(this.state.student_id, '5')}>
                                Submit
               </Button>
                        </div>}
                    </Grid>
                </Grid>
            </div>
        )
    }

    attachments = () => {
        return (
            <div className="w-100">

                <Grid container spacing={4}>

                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Student Photo</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleImageChange} ref={fileInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imagePreviewUrl} />
                                    </div>
                                    <div>

                                        {this.state.selectedFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('student')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Father Photo</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleFatherImageChange} ref={fileFatherInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageFatherPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedFatherFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('father')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('father')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Mother Photo</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleMotherImageChange} ref={fileMotherInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageMotherPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedMotherFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('mother')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('mother')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Guardian Photo</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleGuardImageChange} ref={fileGuardInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageGuardPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedGuardFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('guardian')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('guardian')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Birth Certificate</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleBirthImageChange} ref={fileBirthInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageBirthPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedBirthFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('birth')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('birth')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Aadhaar Card</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleAadhaarImageChange} ref={fileAadhaarInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageAadhaarPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedAadhaarFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('aadhaar')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('aadhaar')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Latest Marks Card</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleMarksImageChange} ref={fileMarksInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageMarksPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedMarksFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('marks')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('marks')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Card className="card-box  mb-2 mt-2 py-3 px-3">
                            <div className="font-weight-400 text-center display-5">Transfer Certificate</div>
                            <Divider className="my-2" />
                            <FormControl fullWidth>
                                <div className="fileinput text-center">
                                    <input type="file" onChange={this.handleTransferImageChange} ref={fileTransferInput} />
                                    <div className={"img-circle"}>
                                        <img className="w-100" src={this.state.imageTransferPreviewUrl} />
                                    </div>
                                    <div>
                                        {this.state.selectedTransferFile == "" ?
                                            this.state.editStudent && <Button color="secondary" variant="contained" className="m-2" onClick={() => this.handleClick('transfer')}>
                                                Add
                 </Button>
                                            :
                                            <span>
                                                {this.state.editStudent && <Button color="primary" variant="contained" className="m-2" onClick={() => this.handleClick('transfer')}>
                                                    Change
                 </Button>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                        </Card>
                    </Grid>

                </Grid>

                <Grid container spacing={2} className="mt-2">

                    <Grid item xs={12} lg={12} className="py-1 text-right">
                        {!this.state.editStudent && AuthHelper('Student Demography', 'can_edit') && <Button className="mx-2" variant="outlined" onClick={() => this.setState({ editStudent: true })} color="primary">
                            Edit
             </Button>}
                        {this.state.editStudent && <div> <Button variant="outlined" className="warningBtnOutline mx-2" style={{ color: '#000000', border: '1px solid #ffc107' }} onClick={() => this.setState({ editStudent: false })}>Cancel</Button>

                            <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{ color: '#4caf50', border: '1px solid #4caf50' }} onClick={() => this.handleUpdate(this.state.student_id, '6')}>
                                Submit
               </Button>
                        </div>}
                    </Grid>
                </Grid>
            </div>
        )
    }
    handleDeactive = (id, status) => {
        let switchStatus = "";
        if (status == true) {
            switchStatus = "Student Deactivated";
        }
        else {
            switchStatus = "Student Activated Successfully";
        }
        const postData = {
            id_organization: this.props.data.selectedOrganizationId,
            id_institute: this.props.data.selectedInstitutionId,
            id_board: this.props.data.selectedBoardId,
            id_academicyear: this.props.data.selectedAcademicId,
            id_student: id,
            token: "abc",
            id_user: this.props.data.UID,
        };
        new Service().apiCall('StudentDetails/deleteStudent', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({
                    basicNotify: (
                        <Dialog open={true}>
                            <div className="text-center p-5">
                                <h4 className="font-weight-bold">{switchStatus}</h4>
                            </div>
                        </Dialog>
                    ),
                });
                this.getStudentDetails();
                setTimeout(() => {
                    this.setState({ basicNotify: false });
                }, 2000)
            }
        }).catch(error => {
            alert(error);
        });
    }

    handleChangeAccordion = (value) => {
        if (this.state.activeAccordion == value) {
            this.setState({ activeAccordion: "", editStudent: false });
        }
        else {
            this.setState({ activeAccordion: value, editStudent: false });
        }
    }
    getSectionSubjectDetails(id_section, selectedSubjects) {
        const postData = {
            type: 'cstr',
            standard_id: id_section,
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('SubjectStandards/getData', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                console.log(response.data);
                var lAllSubjectStandards = [];
                var lActiveSubjectStandards = [];
                var lInActiveSubjectStandards = [];
                response.data.forEach(element => {
                    var lAllSubjectStandard = {};
                    lAllSubjectStandard.id = element.id;
                    lAllSubjectStandard.smid = element.smid;
                    lAllSubjectStandard.name = element.name;
                    lAllSubjectStandard.status = element.status;
                    lAllSubjectStandard.type = element.type;
                    lAllSubjectStandard.checked = false;
                    if (selectedSubjects && selectedSubjects.includes(element.id)) {
                        lAllSubjectStandard.checked = true;
                    }
                    lAllSubjectStandards.push(lAllSubjectStandard);
                    if (element.status == 1) {
                        var lActiveSubjectStandard = {};
                        lActiveSubjectStandard.id = element.id;
                        lActiveSubjectStandard.name = element.name;
                        lActiveSubjectStandard.status = element.status;
                        lActiveSubjectStandard.type = element.type;
                        lActiveSubjectStandard.checked = false;
                        if (selectedSubjects && selectedSubjects.includes(element.id)) {
                            lActiveSubjectStandard.checked = true;
                        }
                        lActiveSubjectStandards.push(lActiveSubjectStandard);
                    }
                    if (element.status == 0) {
                        var lInActiveSubjectStandard = {};
                        lInActiveSubjectStandard.id = element.id;
                        lInActiveSubjectStandard.name = element.name;
                        lInActiveSubjectStandard.status = element.status;
                        lInActiveSubjectStandard.type = element.type;
                        lInActiveSubjectStandard.checked = false;
                        if (selectedSubjects && selectedSubjects.includes(element.id)) {
                            lInActiveSubjectStandard.checked = true;
                        }
                        lInActiveSubjectStandards.push(lInActiveSubjectStandard);
                    }
                })
                this.setState({ standardSubjects: response.data });
            } else {
                this.setState({ standardSubjects: [] });
            }
        }).catch(error => {
            alert("error.response.data.message");
        });
    }

    getAllBoardDetails() {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear,
            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('boards/get_data', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                if (response.data) {
                    this.setState({ boardDetails: response.data });
                }
            }
        }).catch(error => {
            alert("error");

        });
    }

    handleOptionalSubject = (type, status) => {
        if (type) {
            this.setState({ selectedOptionalSubject: true, selectedOptionalSubjectIds: type });
        }
        else {
            this.setState({ selectedOptionalSubject: false, selectedOptionalSubjectIds: '' });
        }
    }

    getStandardSectionDetails() {
        const postData = {
            count: "student",
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear
        };
        new Service().apiCall('ClassDetails/getData', postData).then(response => {
            console.log(response);
            if (response.status == 200 && response.data != '') {
                var lStandardSections = [];
                var lBoardDetails = [];
                response.data.forEach(element => {
                    if (lStandardSections[element.standard_id]) {
                        var lSection = {};
                        lSection.section_id = element.section_id;
                        lSection.section_name = element.section_name;
                        lSection.standard_id = element.standard_id;
                        lSection.standard_name = element.standard_name;
                        lSection.all_subject_count = element.all_subject_count;
                        lSection.active_subject_count = element.active_subject_count;
                        lSection.fee_remain_count = element.feeremaindetails;
                        lStandardSections[element.standard_id].standards.push(lSection);
                    } else {
                        var lStandard = {};
                        var lSection = {};
                        lStandard.standard_name = element.standard_name;
                        lStandard.section_name = element.section_name;
                        lStandard.stream_name = element.stream_name;
                        lStandard.standard_id = element.standard_id;
                        lSection.section_id = element.section_id;
                        lSection.section_name = element.section_name;
                        lSection.standard_id = element.standard_id;
                        lSection.standard_name = element.standard_name;
                        lSection.all_subject_count = element.all_subject_count;
                        lSection.active_subject_count = element.active_subject_count;
                        lSection.fee_remain_count = element.feeremaindetails;
                        lStandard.standards = new Array();
                        lStandard.standards.push(lSection);

                        lStandardSections[element.standard_id] = lStandard;

                    }

                });
                let data = [];
                lStandardSections.forEach((element, index) => {
                    data.push({ id: element.standard_id, value: element.standard_name + " " + element.stream_name + " " + element.section_name });
                });
                this.setState({ classwiseSections: lStandardSections, standardSections: response.data, filterSections: response.data, textSuggestions: data });
            }
        }).catch(error => {
            alert(error);

        });

    }

    getCategoryDetails() {
        const postData = {
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            id_academicyear: this.state.selectedAcademicYear,
            id_board: this.state.selectedBoard,
            token: "abc",
            id_user: this.props.data.UID
        }
        new Service().apiCall('categories/getData', postData).then(response => {

            if (response.status == 200 && response.data != '') {
                console.log(response.data);
                this.setState({ categoryData: response.data });
            } else {
                this.setState({ categoryData: [] });
            }
        }).catch(error => {
            console.log(error);
        });
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

    getStudentInfo() {
        // const studentUID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        //console.log("UID"+studentUID)
        const postData = {
            UID: this.props.data.UID,
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID,
            id_board: this.state.selectedBoard,
            id_academicyear: this.state.selectedAcademicYear
        }
        new Service().apiCall('students/getDataWithId', postData).then(response => {
            console.log(response);
            if (response.status == 200 && response.data != '') {
                if (response.data['feeconfig'].fee_standard) {
                    this.state.textSuggestions.map((element) => {

                        if (element.id == response.data['feeconfig'].fee_standard) {
                            this.setState({ joiningStandard: element.value, fee_standard: response.data['feeconfig'].fee_standard })
                        }

                    })
                }
                this.setState({
                    student_id: response.data.profile.id, student_uid: response.data.profile.UID, individualAllData: response.data.personal, individualData: response.data['profile'], selectedOptionalSubjectIds: response.data['profile'].optional1, individualPrevious: response.data['previous'], previous_id: response.data['previous'][0].id, passed_academic_year: response.data['previous'][0].passed_academic_year, passed_address: response.data['previous'][0].passed_address, passed_board: response.data['previous'][0].passed_board, passed_grade: response.data['previous'][0].passed_grade, passed_marks: response.data['previous'][0].passed_marks, passed_name: response.data['previous'][0].passed_name, passed_standard: response.data['previous'][0].passed_standard, previouslyStudied: response.data['previous'][0].previously_studied, awardHolders: response.data['awards'] ? response.data['awards'] : this.state.awardHolders, individualFees: response.data['feeconfig'], fee_category: response.data['feeconfig'].fee_category, fee_id: response.data['feeconfig'].id, fee_board: response.data['feeconfig'].fee_board, fee_standard: response.data['feeconfig'].fee_standard, individualSiblings: response.data.siblings, standard_name: response.data['personal'][0].standard_name, section_name: response.data['personal'][0].section_name, student_uid: response.data['personal'][0].UID, dateOfBirth: response.data['personal'][0].date_of_birth, firstname: response.data['personal'][0].name, middlename: response.data['personal'][0].middle_name, lastname: response.data['personal'][0].last_name, gender: response.data['personal'][0].gender, bloodgroup: response.data['personal'][0].blood_group, nationality: response.data['personal'][0].nationality, mothertongue: response.data['personal'][0].mother_tongue, religion: response.data['personal'][0].religion, caste: response.data['personal'][0].caste, castecategory: response.data['personal'][0].category, phone_no: response.data['personal'][0].contact_number, email: response.data['personal'][0].email_id, linkedin_id: response.data['personal'][0].linkedin_id, facebook_id: response.data['personal'][0].facebook_id, address_line1: response.data['personal'][0].address1, address_line2: response.data['personal'][0].address2, post_office: response.data['personal'][0].post_office, pincode: response.data['personal'][0].pincode, taluk: response.data['personal'][0].taluk, district: response.data['personal'][0].district, state: response.data['personal'][0].state, permanent_address1: response.data['personal'][0].permanent_address1, permanent_address2: response.data['personal'][0].permanent_address2, permanent_post_office: response.data['personal'][0].permanent_post_office, permanent_pincode: response.data['personal'][0].permanent_pincode, permanent_city: response.data['personal'][0].permanent_taluk, permanent_district: response.data['personal'][0].permanent_district, permanent_state: response.data['personal'][0].permanent_state, birth_certificate_no: response.data['personal'][0].birth_certificate_no, aadhaar_no: response.data['personal'][0].aadhaar_no, passport_no: response.data['personal'][0].passport_no, driving_license_no: response.data['personal'][0].driving_license_no, father_name: response.data['personal'][0].father_name, father_middle_name: response.data['personal'][0].father_middle_name, father_last_name: response.data['personal'][0].father_last_name, father_phone_no: response.data['personal'][0].father_phone_no, father_email_id: response.data['personal'][0].father_email_id, father_linkedin_id: response.data['personal'][0].father_linkedin_id, father_facebook_id: response.data['personal'][0].father_facebook_id, mother_name: response.data['personal'][0].mother_name, mother_middle_name: response.data['personal'][0].mother_middle_name, mother_last_name: response.data['personal'][0].mother_last_name, mother_phone_no: response.data['personal'][0].mother_phone_no, mother_email_id: response.data['personal'][0].mother_email_id, mother_linkedin_id: response.data['personal'][0].mother_linkedin_id, mother_facebook_id: response.data['personal'][0].mother_facebook_id, guard_name: response.data['personal'][0].guard_name, guard_middle_name: response.data['personal'][0].guard_middle_name, guard_last_name: response.data['personal'][0].guard_last_name, guard_phone_no: response.data['personal'][0].guard_phone_no, guard_email_id: response.data['personal'][0].guard_email_id, guard_linkedin_id: response.data['personal'][0].guard_linkedin_id, guard_facebook_id: response.data['personal'][0].guard_facebook_id, guard_address_line1: response.data['personal'][0].guard_address1, guard_address_line2: response.data['personal'][0].guard_address2, guard_pincode: response.data['personal'][0].guard_pincode, guard_city: response.data['personal'][0].guard_taluk, guard_district: response.data['personal'][0].guard_dist, guard_state: response.data['personal'][0].guard_state, primary_contact: response.data['personal'][0].primary_contact, primary_contact1: response.data['personal'][0].primary_contact1, message_sent_to: response.data['personal'][0].message_sent_to, admission_number: response.data['personal'][0].admission_number, admission_date: response.data['personal'][0].admission_date, sts_number: response.data['personal'][0].sts_number, attachment_id: response.data['attachment'].length > 0 ? response.data['attachment'][0].id : '', individualAttachments: response.data['attachment'].length > 0 ? response.data['attachment'] : [{ student_photo: "", father_photo: "", mother_photo: "", guardian_photo: "", birth_certificate: "", aadhaar_card: "", latest_marks_card: "", transfer_certificate: "" }], imagePreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].student_photo != '' ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].student_photo : this.state.defaultDisplayImage, imageFatherPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].father_photo != '' ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].father_photo : this.state.defaultDisplayImage,
                    imageMotherPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].mother_photo != '' ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].mother_photo : this.state.defaultDisplayImage,
                    imageGuardPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].guardian_photo != "" ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].guardian_photo : this.state.defaultDisplayImage,
                    imageBirthPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0] && response.data['attachment'][0].birth_certificate != "" ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].birth_certificate : this.state.defaultDisplayImage, imageAadhaarPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].aadhaar_card != "" ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].aadhaar_card : this.state.defaultDisplayImage, imageMarksPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].latest_marks_card != "" ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].latest_marks_card : this.state.defaultDisplayImage, imageTransferPreviewUrl: response.data['attachment'][0] && response.data['attachment'][0].transfer_certificate != "" ? Config.path + 'writable/uploads/students/' + response.data['attachment'][0].transfer_certificate : this.state.defaultDisplayImage
                });

            } else {
                this.setState({ individualData: [] });
            }

        }).catch(error => {
            console.log(error.message);

        });
    }


    getSubjectDetails(id_section) {
        const postData = {
            standard_id: [id_section],
            id_organization: this.state.selectedOrganizationId,
            id_institute: this.state.selectedInstitutionId,
            token: "abc",
            id_user: this.props.data.UID
        };
        new Service().apiCall('subjectStandards/get_data', postData).then(response => {
            if (response.status == 200 && response.data != '') {
                this.setState({ subjects: response.data });
            } else {
                this.setState({ subjects: [] });
            }
        }).catch(error => {
            alert("error.response.data.message");
        });
    }
    staffProfiling = () => {
        return(
          <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
     
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Primary Information
              </div>
          </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("first_name","First Name")}
            </Grid>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("middle_name","Middle Name")}
            </Grid>
            <Grid item xs={12} lg={4} className="py-1">
              {this.renderTextInput("last_name","Last Name")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("gender","Gender")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("blood_group","Blood Group")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              <FormControl fullWidth>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
              autoOk
              margin="normal"
              id="date-picker-dialog"
              label="Date of birth"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              value={this.state.dateOfBirth}
              onChange={this.handleDateOfBirth}   
              KeyboardButtonProps={{
              'aria-label': 'change date',
              }}
              />
              </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
          
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("nationality","Nationality")}
            </Grid>
           
          </Grid>
    
              <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
                  Contact Details
              </div>
          </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("phone_no","Phone Number")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("email","Email")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("linkedin_id","Linkedin ID")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("facebook_id","Facebook ID")}
            </Grid>
          </Grid> 
    
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Correspondance Address
              </div>
             </Grid>
          </Grid>
    
          <Grid container spacing={2}>
            <Grid item xs={12} lg={5} className="py-1">
              {this.renderTextInput("address1","Communication address line 1")}
            </Grid>
            <Grid item xs={12} lg={5} className="py-1">
              {this.renderTextInput("address2","Communication address line 2")}
            </Grid>
            <Grid item xs={12} lg={2} className="py-1">
              {this.renderTextInput("pincode","Pincode")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("post_office","Post Office")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("taluk","Taluk/City")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("district","District")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("state","State")}
            </Grid>
          </Grid> 
    
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3} className="p-20  mt-3">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Permanent Address
              </div>
             </Grid>
    
             <Grid item xs={12} sm={6} lg={9} className="p-20">
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              checked={this.state.same_address == true}
                              onClick={() => {this.handleAddress(this.state.same_address); this.setState({same_address:!this.state.same_address})}}
                            />
                          }
                          label="Same as above"
                        />
             </Grid>
          </Grid>
    
          <Grid container spacing={2}>
            <Grid item xs={12} lg={5} className="py-1">
              {this.renderTextInput("permanent_address1","Permanent address line 1")}
            </Grid>
            <Grid item xs={12} lg={5} className="py-1">
              {this.renderTextInput("permanent_address2","Permanent address line 2")}
            </Grid>
            <Grid item xs={12} lg={2} className="py-1">
              {this.renderTextInput("permanent_pincode","Pincode")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_post_office","Post Office")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_city","Taluk/City")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_district","District")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("permanent_state","State")}
            </Grid>
          </Grid> 
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12} className="p-20">
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Supporting Documents References
              </div>
             </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("birth_certificate","Birth Certificate No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("aadhaar_no","Aadhaar No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("passport_no","Passport No")}
            </Grid>
            <Grid item xs={12} lg={3} className="py-1">
              {this.renderTextInput("driving_license_no","Driving License No")}
            </Grid>
          </Grid>
    
          <Grid container spacing={2} className="mt-2"> 
                 <Grid item xs={12} lg={12} className="py-1 text-right">
                 { !this.state.editStaff &&  AuthHelper('Staff Demography','can_edit') && <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                              Edit
                 </Button>}
             { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
         
                   <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.staff_id,'1')}>
                              Submit
                   </Button>
                   </div>}
                 </Grid>
          </Grid>
      
          </Animated>
        )
      }
    educationSkills = () => {
        return (
          <Animated className="overflowVisible" animationIn="slideInRight" animationOut="slideOutLeft"> 
       
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6} lg={12} className="p-20">
           
            {this.state.educationHolders.map((educationholder, idx) => (
               <Card className="card-box px-2 mb-2 mt-2 py-3">
                       <Grid container>
                       <Grid item xs={12} sm={12} md={3}>
                           <FormControl fullWidth>
                          
                            <TextField 
                            disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.year_passout}
                            label="Passed out year" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"year_passout",event.target.value)}
                            inputRef={this.textInput} 
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                           <Grid item xs={12} sm={12} md={3}>
                           <FormControl fullWidth>
                          
                            <TextField 
                            disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.board}
                            label="Board/University" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"board",event.target.value)}
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                           <Grid item xs={12} sm={12} md={3}>
                           <FormControl fullWidth>
                           <TextField 
                           disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.degree}
                            label="Degree/Standard" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"degree",event.target.value)}
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                           <Grid item xs={12} sm={12} md={3}>
                           <FormControl fullWidth>
                           <TextField 
                           disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.grade}
                            label="Overall grade/marks" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"grade",event.target.value)}
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                           <Grid item xs={12} sm={12} md={4}>
                           <FormControl fullWidth>
                           <TextField 
                           disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.school}
                            label="School/University Name" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"school",event.target.value)}
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                           <Grid item xs={12} sm={12} md={7}>
                           <FormControl fullWidth>
                           <TextField 
                           disabled={this.state.editStaff?false:true}
                            inputProps={{
                            autoComplete: 'off'
                            }}
                            id="document-type"   
                            value={this.state.school_address}
                            label="School/University Full address" 
                            type="search" 
                            className="m-2"
                            onChange={(event) => this.handleEducationChange(idx,"school_address",event.target.value)}
                            variant="outlined" />
                           </FormControl>
                           </Grid>
                          <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}}>
                          {(this.state.educationHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                          <TextField 
                          disabled={this.state.editStaff?false:true}
                           className="m-2"
                          id="document-type"   
                          onKeyPress={(data) => {
                          if (data.charCode === 13) {
                          this.handCustomersdEducationholder(); this.focusTextInput();
                          }
                          }}
                          InputProps={{
                          autoComplete: 'off', 
                          readOnly: true,
                          startAdornment: (
                          <InputAdornment position="start">
                          <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                          }}
                          label="Add" 
                          onClick={()=>{this.handCustomersdEducationholder(); this.focusTextInput()}}
                          variant="outlined" />
                          </FormControl></div>
                          :
                          <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                          <TextField 
                          disabled={this.state.editStaff?false:true}
                           className="m-2"
                          onKeyPress={(data) => {
                          if (data.charCode === 13) {
                          this.removeEducationHolder(idx); 
                          }
                          }}
                          id="document-type"   
                          InputProps={{
                          autoComplete: 'off',
                          readOnly: true,
                          startAdornment: (
                          <InputAdornment position="start">
                          <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                          }}
                          label="Del" 
                          onClick={()=>{this.removeEducationHolder(idx);}}
                          variant="outlined" />
                          </FormControl></div>
                          }
                          </Grid>
                         </Grid>
     
               </Card>  
    
            ))}
        
          </Grid>
          <Grid item xs={12} sm={6} lg={12}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12}>
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Awards and recognition (if any)
              </div>
          </Grid>
          </Grid>
          {this.state.awardHolders.map((awardholder, idx) => (
            <div>
               <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                  <TextField 
                  disabled={this.state.editStaff?false:true}
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  id="document-type"   
                  value={this.state.award_academic_year}
                  label="Academic Year" 
                  type="search" 
                  onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                  this.handleAwardChange(idx,"award_academic_year",event.target.value.replace(/\s/g, ''))
                  }}}
                  inputRef={this.textInput} 
                  variant="outlined" />
                  </FormControl>
                </Grid>  
                <Grid item xs={12} sm={6} lg={4}>
                  <FormControl fullWidth>
                  <TextField 
                  disabled={this.state.editStaff?false:true}
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  id="document-type"   
                  value={this.state.area_of_achievement}
                  label="Area of achievement" 
                  type="search" 
                  onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                  this.handleAwardChange(idx,"area_of_achievement",event.target.value.replace(/\s/g, ''))
                  }}}
                  variant="outlined" />
                  </FormControl>
                </Grid>  
                <Grid item xs={12} sm={6} lg={4}>
                  <FormControl fullWidth>
                  <TextField 
                  disabled={this.state.editStaff?false:true}
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  id="document-type"   
                  value={this.state.award_remarks}
                  label="Remarks" 
                  type="search" 
                  onChange={(event) => { if (this.verifyNumber(event.target.value)) {
                  this.handleAwardChange(idx,"award_remarks",event.target.value.replace(/\s/g, ''))
                  }}}
                  variant="outlined" />
                  </FormControl>
                </Grid>  
                <Grid item xs={12} sm={6} lg={1}>
                {(this.state.awardHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                <TextField 
                disabled={this.state.editStaff?false:true}
                id="document-type"   
                onKeyPress={(data) => {
                if (data.charCode === 13) {
                this.handleAddAwardholder(); this.focusTextInput();
                }
                }}
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
                onClick={()=>{this.handleAddAwardholder(); this.focusTextInput()}}
                variant="outlined" />
                </FormControl></div>
                :
                <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                <TextField 
                disabled={this.state.editStaff?false:true}
                onKeyPress={(data) => {
                if (data.charCode === 13) {
                this.removeAwardHolder(idx); 
                }
                }}
                id="document-type"   
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
                onClick={()=>{this.removeAwardHolder(idx);}}
                variant="outlined" />
                </FormControl></div>
                }
                </Grid>  
               </Grid>
            </div>
          ))}  
          </Card>
          </Grid>
    
          <Grid item xs={12} sm={6} lg={12}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12}>
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Skills (if any)
              </div>
          </Grid>
          </Grid>
          {this.state.awardHolders.map((awardholder, idx) => (
            <div>
               <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={4}>
                  <FormControl fullWidth>
                  <TextField 
                  disabled={this.state.editStaff?false:true}
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  id="document-type"   
                  value={this.state.skill}
                  label="Special Skill" 
                  type="search" 
                  inputRef={this.textInput} 
                  onChange={(event) => this.handleSkillChange(idx,"skill",event.target.value)}
                  inputRef={this.textInput} 
                  variant="outlined" />
                  </FormControl>
                </Grid>  
               
                <Grid item xs={12} sm={6} lg={7}>
                  <FormControl fullWidth>
                  <TextField 
                  disabled={this.state.editStaff?false:true}
                  inputProps={{
                  autoComplete: 'off',
                  style: {textTransform: 'capitalize'}
                  }}
                  id="document-type"   
                  value={this.state.staff_remark}
                  label="Remarks" 
                  type="search" 
    
                  onChange={(event) => this.handleSkillChange(idx,"staff_remark",event.target.value)}
                  variant="outlined" />
                  </FormControl>
                </Grid>  
                <Grid item xs={12} sm={6} lg={1}>
                {(this.state.skillHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
                          <TextField 
                          disabled={this.state.editStaff?false:true}
                          id="document-type"   
                          onKeyPress={(data) => {
                          if (data.charCode === 13) {
                          this.handCustomersdSkillholder(); this.focusTextInput();
                          }
                          }}
                          InputProps={{
                          autoComplete: 'off',
                          readOnly: true,
                          startAdornment: (
                          <InputAdornment position="start">
                          <Add style={{color:'rgb(76, 175, 80)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                          }}
                          label="Add" 
                          onClick={()=>{this.handCustomersdSkillholder(); this.focusTextInput()}}
                          variant="outlined" />
                          </FormControl></div>
                          :
                          <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
                          <TextField 
                          disabled={this.state.editStaff?false:true}
                          onKeyPress={(data) => {
                          if (data.charCode === 13) {
                          this.removeSkillHolder(idx); 
                          }
                          }}
                          id="document-type"   
                          InputProps={{
                          autoComplete: 'off',
                          readOnly: true,
                          startAdornment: (
                          <InputAdornment position="start">
                          <Remove style={{color:'rgb(220, 53, 69)', cursor:'pointer'}}  />
                          </InputAdornment>
                          ),
                          }}
                          label="Del" 
                          onClick={()=>{this.removeSkillHolder(idx);}}
                          variant="outlined" />
                          </FormControl></div>
                          }
                </Grid>  
               </Grid>
            </div>
          ))}  
          </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={12}>
          <Card className="card-box  mb-2 mt-2 py-3 px-3">  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={12}>
              <div className="card-header--title font-size-md font-weight-bold ml-2">
              Additional Info (if any)
              </div>
          </Grid>
          <Grid item xs={12} sm={6} lg={12}>
          <Editor
              disabled={this.state.editStaff?false:true}
              editorState={this.state.remarks}
              placeholder="Remarks"
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange}
            />
            </Grid>
          </Grid>
          </Card>
          </Grid>
          </Grid>
        
          <Grid container spacing={2} className="mt-2"> 
                 <Grid item xs={12} lg={12} className="py-1 text-right">
                 { !this.state.editStaff && AuthHelper('Staff Demography','can_edit') &&  <Button className="mx-2"  variant="outlined" onClick={()=>this.setState({editStaff:true})} color="primary">
                              Edit
                 </Button>}
             { this.state.editStaff  && <div> <Button variant="outlined" className="warningBtnOutline mx-2"  style={{color:'#000000',border:'1px solid #ffc107'}} onClick={()=>this.setState({editStaff:false})}>Cancel</Button>
         
                   <Button variant="outlined" size="sm" className="successBtnOutline mx-2" style={{color:'#4caf50',border:'1px solid #4caf50'}} onClick={()=>this.handleUpdate(this.state.staff_id,'2')}>
                              Submit
                   </Button>
                   </div>}
                 </Grid>
          </Grid>
        
          </Animated>  
        )
      }

    componentDidMount() {
        this.getAllBoardDetails();
        this.getStudentInfo();
        this.getCategoryDetails();
        this.getStandardSectionDetails(this.state.selectedBoard, this.state.selectedAcademicYear);
    }

    render() {
        const width = (window.innerWidth) * (40 / 100) + "px";
        const width30 = (window.innerWidth) * (30 / 100) + "px";
        let name = this.state.firstname + " " + this.state.middlename + " " + this.state.lastnam;
        let matches = name.match(/\b(\w)/g);
        var acronym = matches.join('');

        return (
            
            <Fragment>
                {this.state.basicNotify}
                {this.props.data.usertype=='student' ? (
                    <>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} lg={3}>
                        <Card className="card-box mb-4 ml-4 pt-4">
                            <div className="d-flex align-items-center px-4 mb-3">
                                <div className="avatar-icon-wrapper rounded mr-3">
                                    <div className="rounded overflow-hidden d-100 bg-neutral-first font-size-lg text-center font-weight-bold text-first d-flex justify-content-center flex-column">
                                        <span>{acronym.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="w-100">
                                    <a
                                        href="#/"
                                        onClick={e => e.preventDefault()}
                                        className="font-weight-bold font-size-lg"
                                        title="...">
                                        {this.state.firstname + " " + this.state.middlename + " " + this.state.lastname}
                                    </a>
                                    <span className="text-black-50 d-block pb-1">
                                        UID: {this.state.student_uid}
                                    </span>
                                </div>
                            </div>
                            <Divider className="my-3" />
                            <div className="font-size-sm px-4 rounded-sm">
                                <div className="d-flex justify-content-between">
                                    <span className="font-weight-bold">Standard:</span>
                                    <span className="text-black-50">{this.state.standard_name + " " + this.state.section_name}</span>
                                </div>
                                <div className="d-flex justify-content-between py-2">
                                    <span className="font-weight-bold">Parent Name:</span>
                                    <span className="text-black-50">{this.state.father_name + " " + this.state.father_middle_name + " " + this.state.father_last_name}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="font-weight-bold">Parent Contact:</span>
                                    <span className="text-black-50">{this.state.father_phone_no}</span>
                                </div>
                            </div>
                            <div className="mt-3 mb-2" />
                            {/* <List className="py-0">
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-center text-warning font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'user']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Profile</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-warning text-center font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'object-group']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Attendance</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem button className="bg-white border-0 align-box-row">
                <div className="align-box-row w-100">
                  <div className="mr-3">
                    <div className="bg-neutral-warning text-warning text-center font-size-xl d-50 rounded-circle">
                      <FontAwesomeIcon icon={['far', 'chart-bar']} />
                    </div>
                  </div>
                  <div>
                    <div className="font-weight-bold d-block">Assignments</div>
                  </div>
                  <div className="ml-auto card-hover-indicator align-self-center">
                    <FontAwesomeIcon
                      icon={['fas', 'chevron-right']}
                      className="font-size-lg"
                    />
                  </div>
                </div>
              </ListItem>
            </List> */}
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8} lg={9}>
                        {this.state.searchStudent && <Grid container spacing={4}>
                            <Grid item xs={12} md={8} lg={3}></Grid>
                            <Grid item xs={12} md={8} lg={6}>
                                <Autocomplete
                                    type="student"
                                    SearchPlaceholderText="Enter name and select from suggestions"
                                    suggestions={this.state.studentSuggestions}
                                    onSelected={this.handleStudentSearch}
                                    {...this.props}
                                />
                            </Grid>
                        </Grid>}
                        {!this.state.searchStudent && <Grid container spacing={4}>
                            <Grid item xs={12} md={8} lg={1}></Grid>
                            <Grid item xs={12} md={8} lg={10}>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'student_details'}
                                    onChange={() => this.handleChangeAccordion("student_details")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Student Profile</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.studentProfiling()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'parent_details'}
                                    onChange={() => this.handleChangeAccordion("parent_details")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Parents Details</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.parentsProfiling()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'siblings_details'}
                                    onChange={() => this.handleChangeAccordion("siblings_details")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Siblings</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.siblingProfiling()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'academics'}
                                    onChange={() => this.handleChangeAccordion("academics")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Academics</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.AcademicProfiling()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'configuration'}
                                    onChange={() => this.handleChangeAccordion("configuration")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Configuration</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.feeConfiguration()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.activeAccordion === 'attachments'}
                                    onChange={() => this.handleChangeAccordion("attachments")}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header">
                                        <Typography>Attachments</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.attachments()}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        </Grid>}

                    </Grid>
                </Grid>
                <Drawer

                    anchor="right"
                    open={this.state.selectPOPanel}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ selectPOPanel: false })}>
                    <Box className={"app-header-drawer bgColor"} style={{ width: width }}>
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
                    open={this.state.standardPanel}
                    variant="temporary"
                    elevation={4}
                    onClose={() => this.setState({ standardPanel: false })}>
                    <Box className={"app-header-drawer "} style={{ width: width30 }}>
                        <PerfectScrollbar>

                            <AppBar className="app-header" color="secondary" position="relative">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={() => this.setState({ standardPanel: false })} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h4">
                                        Select Section and Subject
        </Typography>
                                </Toolbar>
                            </AppBar>

                            <Grid container spacing={2} justify="center" className="mt-1">
                                <Grid item xs={12} sm={12} lg={12}>

                                    <h4 className="theme-configurator--heading">Optional Subjects</h4>
                                    <ul className="theme-configurator--list">
                                        <li className="d-block p-3">

                                            <Grid container spacing={2} className="p-1 ">
                                                {this.state.standardSubjects.map(element => element.id ? (
                                                    <Grid xs={12} sm={10} md={6}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    tabIndex={-1}
                                                                    checked={(element.smid == this.state.selectedOptionalSubjectIds) ? true : false}
                                                                    onClick={() => { this.handleOptionalSubject(element.smid, this.state.selectedOptionalSubject) }}
                                                                />
                                                            }

                                                            label={element.name}
                                                        />
                                                    </Grid>
                                                ) : "")}
                                            </Grid>

                                        </li>
                                    </ul>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="mt-1 p-3">
                                <Grid item xs={12} sm={12} lg={12} className="text-right">
                                    <Button size="small" color="secondary" variant="contained" onClick={() => this.setState({ standardPanel: false })}>Submit</Button>
                                </Grid>
                            </Grid>
                        </PerfectScrollbar>
                    </Box>
                </Drawer>
               </>
                ):''}
               {this.props.data.usertype=='admin'?(
                <ViewStaffInfo type='profile' />
               ):''} 
            </Fragment>
            )
         
    };
}

export default connect(mapStateToProps, mapDispatchToPros)(StudentDashboard);
