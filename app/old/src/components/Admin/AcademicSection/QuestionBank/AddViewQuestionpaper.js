import React, { Fragment } from 'react';
import {Dialog,Grid,Drawer,Toolbar,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,MenuItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,Switch,Tooltip,Chip,Paper, FormControlLabel,FormLabel} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
import Search from "@material-ui/icons/Search";
import 'react-table-6/react-table.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {Animated} from "react-animated-css";
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from '@material-ui/icons/Close';
import Edit from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";  
import NavigateNext from "@material-ui/icons/NavigateNext";
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '../../../../utils/MapStateDispatchProps.js';
import defaultImage from  "../../../../assets/images/image_placeholder.jpg";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import  "../../../../assets/custom.scss";
import Service from '../../../../utils/Service';
import Config from '../../../../config';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import i18n from '../../../../i18n';
import moment from "moment";

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;

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
const fileQuestionInput = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class AddViewQuestionpaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus:'all',
      dialogOpen:true,
      visibility:'none',
      actionType:'view',
      userInput:"",
      filteredSuggestions:[],
      QuestionMappedList:[],
      loading:false,
      chapterHolders : [{chapter_no:'',chapter_name:'',chapter_type:''}],
      chapter_types:['Theory','Practical'],
      multiSelectHolders : [{option:'',checked:false}],
      subjects:[],
      searchResults:[],
      dashboardDetails:[],
      standardNamesList:[],
      QuestionList:[],
      questionInfo:[{id:0, difficulty_level:'',question:'', optionsarray:[], marks:'',right_ans:'',description:''}],
      chaptersList:[],
      selectedStandards:[],
      CountQuetionDetails:[],
      CountChapterDetails:[],
      questionType:'multiplechoice',
      chaptersSelectedIds:'',
      difficultyLevel:'',
      subjects:[],
      examsList:[],
      examSubjectDetails:[],
      basicNotify:false,
      allStudents:true,
      searchStudent:false,
      startdate: new Date(),
      enddate:  new Date(),
      selectedFile:'',    
      selectedFileName:'',
      selectedQuestionFile:'',    
      selectedQuestionFileName:'',
      selectedStandardId: '',
      selectedSection: '',
      selectedStandard: '', 
      imagePreviewUrl:defaultImage,
      question_description: EditorState.createEmpty(),
      question: EditorState.createEmpty(),
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoard:this.props.data.selectedBoardId,
      selectedAcademicYear:this.props.data.selectedAcademicId, 
    };
     this.textInput = React.createRef();
     this.focusTextInput = this.focusTextInput.bind(this);
    
  }
  onEditorStateChange = question_description => {
    this.setState({question_description})};
  onEditorUpdateStateChange = question => {
    // let data = this.state.questionInfo;
    // data[0].question = question;
    this.setState({question})};

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    setTimeout(() => {
      this.textInput.current.focus();
    }, 100);
  } 

  handleCheckOptions = (value) => {
    this.setState({ rightAns: value });
  }

  rowChaptersEdit = (estatus,index) => {
    let lheadings = this.state.chaptersList;
    if(estatus == true){
      lheadings[index].editable = false;
    }
    else{
      lheadings[index].editable = true;
    }
    this.setState({ chaptersList:lheadings});
}    
 
  handleImageChange = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    })
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(event.target.files[0])
  };

  handleClick = () => {
    fileInput.current.click();
  };
  handleRemove = () => {
    this.setState({
      imagePreviewUrl: defaultImage, selectedFile:null
    });
    fileInput.current.value = null;
  };
   
  renderTextInput = (name,label) => {
      return (
        <FormControl fullWidth>
        <TextField 
          inputProps={{
           autoComplete: "off",
           pattern: "[a-z]"
          }}
          id="document-type"   
          value={this.state[name]}
          label={label} 
          type="search" 
          onChange={(event) => this.handleChangeState(name,event.target.value)}
          className="my-2"
          inputRef={this.textInput} 
          variant="outlined" 
       />
       </FormControl>
      )
  }

  getExamSubjectDetails(id_section){
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_section:id_section,
      id:this.state.selectedExamId
    };
    new Service().apiCall('ExamsTimetable/getExamWiseTimetableDetails',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({ examSubjectDetails: response.data });
      }else{
        this.setState({ examSubjectDetails: [] });
      }
    }).catch(error => {
    //  alert("error.response.data.message");

    });
  }

  examSearch = e => {
    const userInput = e.currentTarget.value;
    console.log(userInput);
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = this.state.OnlineExamsList.filter(
      suggestion =>
        suggestion.name.toString().toLowerCase().indexOf(userInput.toString().toLowerCase()) > -1
    );
    this.setState({
      activeSuggestion: 0,
      searchResults:filteredSuggestions,
      userInput: e.currentTarget.value
    });
  };

  getOnlineExamsList(){
    const postData = {
      id_organization:1,
      id_institute:1,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      userrole: this.props.data.type,
      id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsOnline/getOnlineExams',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        console.log(response);
        this.setState({ OnlineExamsList: response.data, searchResults:response.data  });
      }
    }).catch(error => {
     // alert(error);
    });
  }

  getChaptersListByStandard(id_section,id_subject){
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_section:id_section,
      id_subject:id_subject
    };
    new Service().apiCall('QuestionbankChapters/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false, checked:false}));
        this.setState({ chaptersList: newArr, filteredChapters: newArr });
      }else{
        this.setState({ chaptersList: [] });
      }
    }).catch(error => {
      //alert(error);

    });
  }

  handleInputChangeProposed = (cellInfo, event, name) => {
    let data = [...this.state.insertQuestionHolders];
    data[cellInfo.index][name] = event.target.value;
    this.setState({ data });
  };

  renderEditableProposed = (cellInfo) => {
    const cellValue = this.state.insertQuestionHolders[cellInfo.index].proposed_marks;

    return (
    <FormControl fullWidth>
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }} 
    onChange={(event)=> this.handleInputChangeProposed(cellInfo,event, "proposed_marks")}
    value={cellValue}
    label="Marks" 
    type="search" 
    variant="outlined" />

    </FormControl>
    );      
  };

  handleSelectedChapters= (type,index,status) => {
    let chapters = this.state.chaptersList;
    chapters[index].checked = !status;  
    this.setState({chaptersList:chapters});
    this.renderChapters();
  }

  renderChapters= () => {
    let chapters = this.state.chaptersList;
    let selectedBoardIds = "";
    let selectedids=[];
    chapters.map(element=>{
            if(element.checked == true){
              selectedids.push(element.id);
            }
   });
   if(selectedids.length > 0){
    selectedBoardIds = selectedids.join(',');
   }
   this.setState({chaptersSelectedIds:selectedBoardIds});
 
  }

  handleUpdateQuestion = (value)=>{
    let lquestion = this.state.questionInfo;
    lquestion[0].question = value;
    this.setState({questionInfo:lquestion});
  }
  handleChangeDifficulty = (id,value)=>{
    let lquestion = this.state.questionInfo;
    lquestion[0].difficulty_level = value;
    this.setState({questionInfo:lquestion}); 
  }

  handleUpdateMarks = (name,value)=>{
    let lquestion = this.state.questionInfo;
    lquestion[0].marks = value;
    this.setState({questionInfo:lquestion});
  }
  updateDescription = (value)=>{
    let lquestion = this.state.questionInfo;
    lquestion[0].description = value;
    this.setState({questionInfo:lquestion});
  }

  getSubjectDetails(id_section){
    const postData = { 
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      type:"assignment",
      standard_id:[id_section],
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('subjectStandards/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({ subjects: response.data });
      }else{
        this.setState({ subjects: [] });
      }
    }).catch(error => {
      console.log("error.response.data.message");

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

  handleQuestionsData = (index,status) => {
    let questions = this.state.insertQuestionHolders;
    let lquestions = this.state.QuestionList;
    questions[index].checked = !status;  
    lquestions[index].checked = !status;  
    this.setState({insertQuestionHolders:questions,QuestionList:lquestions});
  }
  handleSelectedQuestionData = (index,inputName,pValue) => {
     let lProfessionHolders = this.state.insertQuestionHolders;
    lProfessionHolders[index][inputName] = pValue;
    this.setState({insertQuestionHolders:lProfessionHolders});
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.chaptersList];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;
    this.setState({ data });
};

  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.chaptersList[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl fullWidth>
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={cellValue}
          type="text" 
          onChange={event => this.handleInputChange(cellInfo,event)}
          />
      </FormControl>
    );
      
    }
    else{
      return cellValue;
    }
    
  };


  addChapterHolder = () => {
    let lchapterHolders = this.state.chapterHolders;
    let lChapters = {};
    lChapters.chapter_no = '';
    lChapters.chapter_name = '';
    lChapters.chapter_type = '';
    lchapterHolders.push(lChapters);
    this.setState({chapterHolders:lchapterHolders});
  }
  removeChapterHolder(i) {
    const { chapterHolders } = this.state;
    this.setState({
      chapterHolders: chapterHolders.filter((chapter, index) => index !== i),
    });
  }

  handleChapterChange = (pIndex,inputName,pValue) => {
    let lChapterHolders = this.state.chapterHolders;
    lChapterHolders[pIndex][inputName] = pValue;
    this.setState({chapterHolders:lChapterHolders});
  }

  handleAssignQuestions(){
    const lUserData = this.props.data;
    let qholders = this.state.insertQuestionHolders;
    let mapped = [];
    qholders.map(element=>{
      if(element.checked == true){
        mapped.push(element);
      }
    })
    const postData = {
      id_exam:this.state.selectedExamId,
      id_examtimetable:this.state.selectedTimeTableId,
      id_examtimetable_subject:this.state.selectedTimeTableSubjectId,
      instructions:this.state.instruction_data,
      questions:mapped,
      token:"abc",
      userrole: this.props.data.type,
      id_user: this.props.data.UID
    };
    new Service().apiCall('ExamsOnline/insertAssignQuestions', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Question Inserted</h4>
          </div>
        </Dialog>
          ),
        });
        this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
        this.getQuestionbankCountDetails(this.state.selectedStandardId);
        setTimeout(() => {
        
          this.setState({ basicNotify:false});
           window.location.reload()
        })
       
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  updateChapters = (id,index) => {
    let data = this.state.chaptersList;
    let chapter_name = data[index].chapter_name;
    let chapter_no = data[index].chapter_no;
    let chapter_type = data[index].chapter_type;
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id:id,
      userrole: this.props.data.type,
      chapter_no:chapter_no,
      chapter_name:chapter_name,
      chapter_type:chapter_type,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('QuestionbankChapters/updateChapter',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Chapter Updated</h4>
          </div>
        </Dialog>
          ),
        });
        this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000)
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
        //console.log(error);
     // this.raiseLoginSignupErrorAlert("signup");

    });
  }

  UpdateQuestion(){
    const postData = {
      created_by: this.props.data.UID, 
      id:this.state.questionInfo[0].id,
      right_ans:this.state.questionInfo[0].right_ans,
      question:this.state.question.getCurrentContent().getPlainText(),
      description:this.state.questionInfo[0].description,
      options:this.state.questionInfo[0].optionsarray,
      difficulty_level:this.state.questionInfo[0].difficulty_level,
      marks:this.state.questionInfo[0].marks,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      userrole: this.props.data.type,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('QuestionbankQuestions/updateQuestion', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Question Updated</h4>
          </div>
        </Dialog>
          ),
        });
        this.getQuestionsList(this.state.selectedStandardId,this.state.selectedChapterId,this.state.selectedSubjectId, this.state.selectedQuestionId);
        setTimeout(() => {
          this.setState({ basicNotify:false,editQuestionPanel:false});
        }, 2000) 
       
      } else {
      //  this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  handleChaptersUpload(){
    const lUserData = this.props.data;
    let data = new FormData();
    let formData = new FormData();
    formData.append('userrole',this.props.data.type);
   formData.append('id_organization',this.props.data.selectedOrganizationId);
   formData.append('id_institute',this.props.data.selectedInstitutionId);
   formData.append('id_board',this.props.data.selectedBoardId);
   formData.append('id_academicyear',this.props.data.selectedAcademicId);
   formData.append('id_section',this.state.selectedStandardId);
   formData.append('id_subject',this.state.selectedSubjectId);
   formData.append('create_new',1);
   formData.append('insertFile',this.state.selectedFile);
   formData.append('id_user',this.props.data.UID);
  
    new Service().apiCall('QuestionbankChapters/excelChapterSampleUpload', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      if (response.status==200 && response.data!='') {
         this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Chapter Created</h4>
          </div>
        </Dialog>
          ),
        });
        this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
          this.getQuestionbankCountDetails(this.state.selectedStandardId);
        setTimeout(() => {
          this.setState({ basicNotify:false,selectedFileName:'',chapterHolders : [{chapter_no:'',chapter_name:'',chapter_type:''}]});
        }, 2000) 
       
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  getQuestionsList(id_section,id_chapter,id_subject,id_question){
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_section:id_section,
      id_chapter:id_chapter,
      id_subject:id_subject,
      id_question:id_question
    };
    new Service().apiCall('QuestionbankQuestions/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false,checked:false}));
       
        console.log(newArr);
        let marksArr = [];
        response.data.map((element,index) =>{
            marksArr.push({question_order:index+1,id_question:element.id,proposed_marks:'',checked:false})
        })
         this.setState({ QuestionList: newArr,insertQuestionHolders: marksArr, questionInfo: newArr, question:EditorState.createWithContent(ContentState.createFromText(newArr[0].question))});
      }else{
        this.setState({ QuestionList: [],insertQuestionHolders:[] });
      }
    }).catch(error => {
      //alert(error); 

    });
  }

  handleQuestionDelete = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Question Deactivated";
     }
     else{
        switchStatus = "Question Activated";
     }
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id: id,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('QuestionbankQuestions/deleteQuestion',postData).then(response => {
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
        this.getQuestionsList(this.state.selectedStandardId,this.state.selectedChapterId);
        this.getQuestionbankCountDetails(this.state.selectedStandardId);
        setTimeout(() => {
          this.setState({  basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
     // alert(error);
    });
  }

  handleUpdateCheckOptions = (value) => {
    let lquestions = this.state.questionInfo;
    lquestions[0].right_ans = value;
    this.setState({ rightAnswer: value, questionInfo: lquestions });
  }

  handleChapters(){
    const lUserData = this.props.data;
    let data = new FormData();
    const postData = {
      chapters:this.state.chapterHolders,
      created_by: lUserData.UID, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      userrole: this.props.data.type,
      id_section:this.state.selectedStandardId,
      id_subject:this.state.selectedSubjectId,
      create_new:1,
      token:"abc",
      id_user: this.props.data.UID
    };
  
    new Service().apiCall('QuestionbankChapters/insertData', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Chapter Created</h4>
          </div>
        </Dialog>
          ),
        });
          this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
          this.getQuestionbankCountDetails(this.state.selectedStandardId);
           setTimeout(() => {
        this.setState({ basicNotify:false,selectedFileName:'',chapterHolders : [{chapter_no:'',chapter_name:'',chapter_type:''}]});
      }, 2000) 
        
       
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  handleDeactiveChapter = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Chapter Deactivated";
     }
     else{
        switchStatus = "Chapter Activated";
     }
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id: id,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('QuestionbankChapters/deleteChapter',postData).then(response => {
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
        this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
        setTimeout(() => {
          this.setState({  basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
      //alert(error);
    });
  }

  handleQuestionsUpload(){
    const lUserData = this.props.data;
    let data = new FormData();
    let formData = new FormData();
    formData.append('userrole',this.props.data.type);
    formData.append('id_organization',this.props.data.selectedOrganizationId);
    formData.append('id_institute',this.props.data.selectedInstitutionId);
    formData.append('id_board',this.props.data.selectedBoardId);
    formData.append('id_academicyear',this.props.data.selectedAcademicId);
    formData.append('question_type','multiplechoice');
    formData.append('id_chapter',this.state.selectedChapterId);
    formData.append('insertFile',this.state.selectedQuestionFile);
    formData.append('id_user',this.props.data.UID);
    new Service().apiCall('QuestionbankQuestions/excelQuestionSampleUpload', formData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Question Created</h4>
          </div>
        </Dialog>
          ),
        });
        this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
        this.getQuestionbankCountDetails(this.state.selectedStandardId);


      setTimeout(() => {
        this.setState({ basicNotify:false,selectedQuestionFile:'',selectedQuestionFileName:'',createQuestionPanel:false});
      }, 2000) 
       
      } else {
        this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  }

  handleQuestions(){
    const lUserData = this.props.data;
    let data = new FormData();
    const postData = {
      question_type:this.state.questionType,
      difficulty_level:this.state.difficultyLevel,
      options:this.state.multiSelectHolders,
      question:this.state.question_description.getCurrentContent().getPlainText(),
      rightAns:this.state.rightAns,
      userrole: this.props.data.type,
      description:this.state.description,
      marks:this.state.marks,
      created_by: lUserData.UID, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      id_chapter:this.state.selectedChapterId,
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('QuestionbankQuestions/insertData', postData,
    {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    ).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">Question Created</h4>
          </div>
        </Dialog>
          ),
        });
       
          this.getChaptersListByStandard(this.state.selectedStandardId,this.state.selectedSubjectId);
          this.getQuestionbankCountDetails(this.state.selectedStandardId);
  

        setTimeout(() => {
          this.setState({ basicNotify:false,selectedQuestionFile:'',selectedQuestionFileName:'',createQuestionPanel:false});
        }, 2000) 
       
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.raiseLoginSignupErrorAlert("signup");

    });
  } 

  handleAddmultiSelectholder = () => {
    let lmultiSelectHolders = this.state.multiSelectHolders;
    let lMultiselect = {};
    lMultiselect.option = ''
    lMultiselect.checked = false;
    lmultiSelectHolders.push(lMultiselect);
    this.setState({multiSelectHolders:lmultiSelectHolders});
  }
  removeMultiSelectHolder(i) {
    const { multiSelectHolders } = this.state;
    this.setState({
      multiSelectHolders: multiSelectHolders.filter((chapter, index) => index !== i),
    });
  }

  handleChangeOptions = (pIndex,inputName,pValue) => {
    let lOptionHolders = this.state.multiSelectHolders;
    lOptionHolders[pIndex][inputName] = pValue;
    this.setState({multiSelectHolders:lOptionHolders});
  }
  handleUpdateOptions = (pIndex,inputName,pValue) => {
    let lquestion = this.state.questionInfo;
    lquestion[0].options[pIndex] = pValue;
    lquestion[0].optionsarray[pIndex][inputName] = pValue;
    this.setState({questionInfo:lquestion});
  }
  
  setPostData = (name,value) => {
    this.setState({ [name]: value });
  }

  getOnlineExamsMappedQuestions(id_exam,id_timetable,id_timetable_subject){
    const postData = {
      id_organization:1,
      id_institute:1,
      token:"abc",
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.state.selectedAcademicYear,
      userrole: this.props.data.type,
      id_user: this.props.data.UID,
      id_exam:id_exam,
      id_examtimetable:id_timetable,
      id_examtimetable_subject:id_timetable_subject
    };
    new Service().apiCall('ExamsOnline/getOnlineExamsMappedQuestions',postData).then(response => {
      console.log(response);
      if (response.status==200 && response.data!='') {
        const newArr = response.data.map(v => ({...v, editable: false,checked:true}));
        this.setState({ QuestionMappedList: newArr });
      }else{
        this.setState({ QuestionMappedList: [] });
      }
    }).catch(error => {
      //alert(error);

    });
  }

  showError = (error) => {
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
         this.setState({ basicNotify:false});
        // window.location.reload()
       }, 2000)
    }

    getQuestionbankCountDetails(id_section) {
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        userrole: this.props.data.type,
        id_user: this.props.data.UID,
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        id_section:id_section
      };
      new Service().apiCall('QuestionbankChapters/getQuestionBankCountDetails',postData).then(response => {
        if (response.status==200 && response.data!='') {
          if(response.data['questions'] !== null){
            this.setState({ CountQuetionDetails:response.data['questions'][id_section]});
          }else{
            this.setState({ CountQuetionDetails:[]});
          }
          if(response.data['chapters'] !== null){
            this.setState({ CountChapterDetails:response.data['chapters'][id_section]});
          }else{
            this.setState({ CountChapterDetails:[]});
          }
          //this.setState({ CountQuetionDetails:response.data['questions'][id_section],CountChapterDetails:response.data['chapters']});
        }else{
           this.setState({ CountQuetionDetails:[],CountChapterDetails:[]});
        }
      }).catch(error => {
        //alert(error);

      });

    }

    handleSelecteSidebardSection = (id,name) => {
      this.setState({selectedStandardId:id, selectedSidebarSection:name,searchStudent:false });
      this.getSubjectDetails(id);
      this.getQuestionbankCountDetails(id);
      this.getExamsListStandard(id);
      this.getExamSubjectDetails(id);
    }

    getExamsListStandard(id_section){
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_board:this.props.data.selectedBoardId,
        id_academicyear:this.props.data.selectedAcademicId,
        userrole: this.props.data.type,
        id_user: this.props.data.UID,
        id_section:id_section
      };
      new Service().apiCall('ExamDetails/getExamStandardWiseDetails',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ examsList: response.data });
        }else{
          this.setState({ examsList: [] });
        }
      }).catch(error => {
      // alert(error);

      });
    }

 
  sidebarStandardSections = () => {
    return(
      <StandardSectionsList
      board_id={this.state.selectedBoard}
      type="sidebar"
      viewMapped={true}
      showBadge={false}
      viewcount="student" 
      institute_id={this.state.selectedInstitutionId}
      academic_id={this.state.selectedAcademicId}
      active={this.state.searchStudent ? true : false}
      handleSelectedSection={this.handleSelecteSidebardSection}
      {...this.props}
    /> 
    )
  }


  componentDidMount() {
    this.getOnlineExamsList();
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
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/question-bank")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
            Online Exams - Questions Setting
            </Typography>
               </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  
              <Grid container justify="center">
               <Grid item xs={12} lg={6}>
               <div>
          <div className={this.state.userInput.length > 0 ? "searchDiv  SearchFocus": "searchDiv"} style={{borderBottomLeftRadius: (this.state.userInput.length && this.state.filteredSuggestions) > 0 ? 0 : 24 ,  borderBottomRightRadius: (this.state.userInput.length && this.state.filteredSuggestions.length) > 0 ? 0 : 24 }}>
                  <div className="searchStep1">
                    <div className="searchIconDIv">
                      <div className="searchIconDivChild">
                        <span className="searchIconSpan">
                          <Search />
                        </span>
                      </div>
                    </div>
                    <div className="searchInputDiv">
                    <input className="searchInput" maxlength="2048"  placeholder="Search exam"
                    onChange={this.examSearch}
                   value={this.state.userInput} type="search"  aria-autocomplete="off" aria-haspopup="false" autocapitalize="off" autocomplete="off" autocorrect="off" />
                    </div>
                    <div className="searchMicDiv">
                      <div className="searchMicInnerDiv">

                      </div>
                    </div>
                  </div>
                  
              </div>
      </div>
               </Grid>  
              </Grid>

              <Grid container justify="center">
               <Grid item xs={12} lg={10}>
               {this.state.searchResults.map((ele,idx) =>{
               // if(ele.start_date){
                return (
               
                <Card className="card-box mb-4 mt-4 d-flex p-2 flex-row flex-wrap justify-content-center">
                  <Grid container spacing={2}>
              <Grid item xs={12} md={2} lg={4}>
                    <div className="py-3 px-3 d-flex align-items-center text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {ele.name}
                  </span>
                  <span className="d-block opacity-7">exam name</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={1}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {/* {this.state.standardNamesList[ele.id_section]?this.state.standardNamesList[ele.id_section]:''} */}
                  </span>
                  <span className="d-block opacity-7">std/batch</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {ele.start_date?ele.start_date:''}
                  </span>
                  <span className="d-block opacity-7">start date</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {ele.end_date?ele.end_date:''}
                  </span>
                  <span className="d-block opacity-7">end date</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {ele.exam_status}
                  </span>
                  <span className="d-block opacity-7">exam status</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} sm={12} md={1} className="pickerGrid" style={{margin:'auto', textAlign:'right'}}>
                <Avatar onClick={()=>this.setState({selectedExamId:ele.id, viewOnlinePaperByStatus:true})} style={{float:'right'}}>
                <NavigateNext />
                </Avatar>
                </Grid>
            
             </Grid>   
            </Card>
                );  
             // }     
           })}
               </Grid>
              </Grid>   
      </div>
      </Animated>
      </Dialog>
      <Dialog fullScreen open={this.state.viewOnlinePaperByStatus} className="bgColor" onClose={()=>this.setState({viewOnlinePaperByStatus:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/question-bank")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
            Question Paper
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
              <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.actionType == "create" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => this.setState({actionType:'create' })}>
                  Create
                </Button>
                <Button color="primary" size="small" variant={this.state.actionType == "view" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({actionType:"view"})}}>
                View
                </Button>
              </ButtonGroup>
                </Box>
              </div>
               </Grid>
            </Grid>
            
            
          </Toolbar>
        </AppBar>
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <div  className="pt-100">  

    

      <Grid container spacing={4} justify={this.props.data.usertype!= "student" ? "none" : "center"}>
      {this.props.data.usertype!= "student" && <Grid item xs={12} md={8} lg={3}>
           <Card className="card-box ml-4 mb-4">
            <div className="text-center">
              <div className="pt-1">
                <List className="py-2">
                  {this.sidebarStandardSections()}
                </List>
              </div>
            </div>
          </Card>
          </Grid>  }
        <Grid item xs={12} md={8} lg={9}>
       <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={8} lg={10}>
        {this.state.subjects.map((ele)=>(
                
               
                <Card className="card-box mb-4 d-flex p-2 flex-row flex-wrap justify-content-center">
                  <Grid container spacing={2}>
              <Grid item xs={12} md={2} lg={4}>
                    <div className="py-3 px-3 d-flex align-items-center text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                    {ele.name}
                  </span>
                  <span className="d-block opacity-7">subject</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={1}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['exam_date']?this.state.examSubjectDetails[ele.id]['exam_date']:''}
                  </span>
                  <span className="d-block opacity-7">start date</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['duration']?this.state.examSubjectDetails[ele.id]['duration']:''} min
                  </span>
                  <span className="d-block opacity-7">duration</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['max_marks']?this.state.examSubjectDetails[ele.id]['max_marks']:''}
                  </span>
                  <span className="d-block opacity-7">max marks</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div className="py-3 px-4 d-flex align-items-center  text-center">
                <div>
                  <span className="font-weight-bold font-size-md">
                  {this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['exam_status']?this.state.examSubjectDetails[ele.id]['exam_status']:''}
                  </span>
                  <span className="d-block opacity-7">exam status</span>
                </div>
              </div>
              </Grid>
              <Grid item xs={12} sm={12} md={1} className="pickerGrid" style={{margin:'auto', textAlign:'right'}}>
              { this.state.actionType == "create" &&  <Avatar onClick={()=>{this.getChaptersListByStandard(this.state.selectedStandardId,ele.id);this.setState({selectedSubjectId:ele.id, selectChapterPanel:true,selectedTimeTableId:this.state.examSubjectDetails[ele.id]['id_timetable'],selectedTimeTableSubjectId:this.state.examSubjectDetails[ele.id]['id']})}} style={{float:'right'}}>
              <NavigateNext />
              </Avatar>}
              { this.state.actionType == "view" &&  <Avatar onClick={()=>{this.getOnlineExamsMappedQuestions((this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['id_exam']?this.state.examSubjectDetails[ele.id]['id_exam']:''),(this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['id_timetable']?this.state.examSubjectDetails[ele.id]['id_timetable']:''),(this.state.examSubjectDetails[ele.id] && this.state.examSubjectDetails[ele.id]['id']?this.state.examSubjectDetails[ele.id]['id']:''));this.setState({selectedExamId:this.state.examSubjectDetails[ele.id]['id_exam']?this.state.examSubjectDetails[ele.id]['id_exam']:'', selectedSubjectId:ele.id,selectedTimeTableId:this.state.examSubjectDetails[ele.id]['id_timetable'],selectedTimeTableSubjectId:this.state.examSubjectDetails[ele.id]['id'], viewQuestionPaperPanel:true})}} style={{float:'right'}}>
              <NavigateNext />
              </Avatar>}
              </Grid>
            
             </Grid>   
            </Card>
             ))}
        </Grid>
              
        </Grid>

        </Grid> 
        </Grid>
            


</div>
</Animated>
</Dialog>

<Drawer
anchor="right"
open={this.state.viewQuestionPaperPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({viewQuestionPaperPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({viewQuestionPaperPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {'View Questions '+this.state.selectedSidebarSection}
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">     


<Grid container justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                 View Questions
                </h4>
              </div>
            </div>

    <ReactTable

data={
this.state.QuestionMappedList.map((original,key) => {
return ({
  slno: key+1,
  question:original.question,
  chapter_name: original.chapter_name,
  proposed_marks:original.proposed_marks,
  question_type:original.question_type,
  editable:original.editable,
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
  Header: "Question",
  accessor: "question",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Question"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
)
},
{
  Header: "Chapter Name",
  accessor: "chapter_name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Chapter Name"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
  Header: "Question Type",
  accessor: "question_type",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Chapter Type"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
  Header: "Marks",
  accessor: "marks",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Marks"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    {AuthHelper('Question Bank','can_export') && <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
        <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card>
        </Grid>
        </Grid>
</div>
</PerfectScrollbar>
</Box>
</Drawer>  


<Drawer

anchor="right"
open={this.state.selectChapterPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({selectChapterPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({selectChapterPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  Set Questions
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">
  <Grid item xs={12} md={4} lg={6}>
  {this.state.chaptersList.map((ele,idx) =>(
     <Card className="card-box p-2 mb-3">
        <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={4} lg={1} className="margin-auto">
              <FormControlLabel
              control={
              <Checkbox
              tabIndex={-1}
              checked={ele.checked}
              onClick={() => {this.handleSelectedChapters(ele.id,idx,ele.checked)}}
              />
              }
              label=""
              />
        </Grid>
        <Grid item xs={12} md={4} lg={9} className="margin-auto text-left">
          <div>{(idx+1)+" . "+ele.chapter_name}</div>
        </Grid>
        <Grid item xs={12} md={4} lg={2} className="margin-auto text-center">
          <div>{ele.questions} Questions</div>
        </Grid>
        </Grid>
     </Card>
  ))}
       <Card className="card-box p-2 mb-3">
        <Grid container spacing={4}>
        <Grid item xs={12} md={12} lg={12} className="text-right">
        <Button color="primary" variant="outlined" onClick={()=>{  this.getQuestionsList(this.state.selectedStandardId,this.state.chaptersSelectedIds);this.setState({addQuestionPaperPanel:true})}}>Next</Button>
        </Grid>
        </Grid>
     </Card>
  </Grid>
</Grid>      
</div>
</PerfectScrollbar>
</Box>
</Drawer>

<Drawer
anchor="right"
open={this.state.addQuestionPaperPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({addQuestionPaperPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({addQuestionPaperPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {'Select Questions'}
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">

<Grid container justify="center">
        <Grid item xs={12} sm={12} lg={10}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                 Select Questions
                </h4>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.QuestionList.map((original,key) => {
return ({
  slno: key+1,
  id:original.id,
  question:original.question,
  chapter_name: original.chapter_name,
  question_type:original.question_type,
  difficulty_level:original.difficulty_level,
  marks:original.marks,
  status:original.status,
  usage:original.usage,
  checked:original.checked,
  editable:original.editable,
})
})
}
filterable
minRows={0}
columns={[
{
Header: "Select",
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
),
Cell: row => (
  <div><FormControlLabel
  control={
    <Checkbox
      tabIndex={-1}
      checked={row.original.checked}
      onClick={(event) => {this.handleQuestionsData(row.original.keyname,row.original.checked);}}
    />
  }
  classes={{
  }}
  label=""
/></div>
)
},
{
  Header: "Question",
  accessor: "question",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Question"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell: row => (
    <div style={{overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis'}}><Tooltip
    id="tooltip-top"
    title={row.original.question}
    placement="top"
    >
       
                    <Button style={{width:'100%', color:'rgba(0, 0, 0, 0.87)'}}
                    simple  
                    className="descriptionBtn"
                  >
                   {row.original.question}
                  </Button> 
    </Tooltip>   </div>
  )
},
{
  Header: "Chapter Name",
  accessor: "chapter_name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Chapter Name"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell: row => (
    <div style={{overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis'}}><Tooltip
    id="tooltip-top"
    title={row.original.chapter_name}
    placement="top"
    >
       
                    <Button style={{width:'100%', color:'rgba(0, 0, 0, 0.87)'}}  
                    simple  
                    className="descriptionBtn"
                  >
                  {row.original.chapter_name}
                  </Button> 
    </Tooltip>   </div>
  )
},
{
  Header: "Question Type",
  accessor: "question_type",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Question Type"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},

{
  Header: "Marks",
  accessor: "marks",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Marks"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
  Header: "Proposed marks",
  accessor: "proposed_marks",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Marks"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell: this.renderEditableProposed
},
  
]}
defaultFilterMethod={filterCaseInsensitive}
defaultPageSize={10}
showPaginationTop
showPaginationBottom={false}
className="-striped -highlight"
/>
    <CardActions  style={{marginTop:0}}>
    {AuthHelper('Question Bank','can_create') && <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
      <Button className="successBtnOutline" variant="outlined" onClick={()=>{this.handleAssignQuestions()}}>Submit</Button>
        </Grid>
        </Grid>}
  </CardActions>

        </Card>
        </Grid>
        </Grid>
  </div>
  </PerfectScrollbar>
  </Box>
  </Drawer>

  <Drawer
anchor="right"
open={this.state.editQuestionPanel}
variant="temporary"
elevation={4}
onClose={()=> this.setState({editQuestionPanel:false})}>
<Box className={"app-header-drawer bgColor"} style={{width:width100p}}>
  <PerfectScrollbar>
  <AppBar className="app-header" color="secondary" position="relative">
<Toolbar>
  <IconButton edge="start" color="inherit" onClick={()=> this.setState({editQuestionPanel:false})} aria-label="close">
    <CloseIcon />
  </IconButton>
  <Typography variant="h5">
  {'Edit Question'}
  </Typography>
 
</Toolbar>
</AppBar>
<div className="m-20">
<Grid container spacing={4} justify="center">
  <Grid item xs={12} md={4} lg={8}>
  <Card className="card-box p-3 mb-4">
  <Card className="card-box p-2 mb-4">
  <Grid container spacing={2}>
      <Grid item xs={12} sm={6} lg={12} className="p-20">
        
        <div className="card-header--title font-size-md font-weight-bold ml-2">
          Difficulty Level
        </div>
      </Grid>
    </Grid> 
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} lg={12}>
      <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "basic"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"basic")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B"
                           
                          />
                        }
                      
                        label="Basic"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "easy"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"easy")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B"
                            
                          />
                        }
                       
                        label="Easy"
                      />
                        <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "moderate"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"moderate")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B" 
                            
                          />
                        }
                       
                        label="Moderate"
                      />
                       <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "hard"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"hard")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B"
                           
                          />
                        }
                       
                        label="Hard"
                      />
                        <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "difficult"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"difficult")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B"
                          
                          />
                        }
                       
                        label="Difficult"
                      />
                                    <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].difficulty_level === "notspecified"}
                          onChange={() => this.handleChangeDifficulty(this.state.questionInfo[0].id,"notspecified")}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B"
                          />
                        }
                     
                        label="Not specified"
                      />
                           
      </Grid>
 
  </Grid>   
  </Card>   
<Grid container>
  <Grid item xs={12} sm={6} lg={12}>
      <Editor
          editorState={this.state.question}
          placeholder="Type question here"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorUpdateStateChange}
        />
      </Grid> 
  </Grid> 


  <Grid container justify="center">
  <Grid item xs={12} sm={6} lg={12}>
  {this.state.questionInfo[0].optionsarray.length>0 && this.state.questionInfo[0].optionsarray.map((ele,index) =>(
  <Grid container>
  <Grid item xs={12} sm={6} lg={1} className='margin-auto'>
    {index+1}
  </Grid> 
  <Grid item xs={12} sm={10} md={3}>
  <TextField 
  inputProps={{
  autoComplete: 'off'
  }}
  className="m-2"
  onChange={(event) => this.handleUpdateOptions(index, "option", event.target.value)}
  inputRef={this.textInput}
  id="document-type"   
  value={ele.option}
  label="Option" 
  type="search" 
  variant="outlined" />
  </Grid>
       <Grid item xs={12} sm={6} md={3}  style={{textAlign:'center'}} style={{marginTop:10}}>

       <FormControlLabel
                        control={
                          <Radio
                          checked={this.state.questionInfo[0].right_ans === ele.option}
                            onChange={() => this.handleUpdateCheckOptions(ele.option)}
                            id="driver"
                            name="driver"
                            value="driver"
                            name="radio button enabled"
                            aria-label="B" 
                          
                          />
                        }
                      
                        label="Right answer"
                      /></Grid>
                      <Grid item xs={12} sm={6} md={5}  style={{textAlign:'center'}} style={{marginTop:10}}>
                      {this.state.questionInfo[0].right_ans === ele.option && <TextField 
                        inputProps={{
                        autoComplete: 'off'
                        }}
                        value={this.state.questionInfo[0].description}
                        className="m-2"
                        inputRef={this.textInput}
                        id="document-type"   
                        label="Description" 
                        type="search" 
                        onChange={(event) => this.updateDescription(event.target.value)}
                        variant="outlined" />}</Grid>


  </Grid>
  ))}
  </Grid>
  </Grid>

 <Grid container>
  <Grid item xs={12} sm={6} lg={12}>
    <TextField 
    inputProps={{
    autoComplete: 'off'
    }}
    className="m-2"
    id="document-type"   
    label="Marks" 
    type="search" 
    value={this.state.questionInfo[0].marks}
    onChange={(event) => this.handleUpdateMarks("marks",event.target.value)}
    variant="outlined" />
  </Grid> 
  </Grid>

<Grid container>
  
  <Grid item xs={12} sm={6} lg={12} className="text-right">
  <Button className="successBtnOutline" variant="outlined" onClick={()=>this.UpdateQuestion()}>Submit</Button>
  </Grid>
  </Grid>
  </Card>
  </Grid>
  </Grid>
  
  </div>
  </PerfectScrollbar>
  </Box>
  </Drawer>
    </Fragment>
  );
};
}

export default connect(mapStateToProps, mapDispatchToPros)(AddViewQuestionpaper);
