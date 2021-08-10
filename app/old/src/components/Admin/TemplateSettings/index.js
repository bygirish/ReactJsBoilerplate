import React, { Fragment } from 'react';
import  "../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {FormControl,Grid,MenuItem,Dialog,Card,TextField,Button, DialogTitle, DialogContent,DialogActions} from '@material-ui/core';
import { PageTitle } from '../../../layout-components';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';   
import { withRouter } from 'react-router-dom';
import { AuthHelper } from '../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js'
import Service from '../../../utils/Service';
import Config from '../../../config';

class TemplateSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events:[],
      templateData:EditorState.createEmpty(),
      roleData:[],
      selectedStandards:[],
      templateTypes:[],
      templateList:[],
      selectedTemplate:'',
      template_name:'',
      selectedType:'',
      startdate: new Date(),
      enddate:  new Date(),
      selectedOrganizationId:this.props.data.selectedOrganizationId,  
      selectedInstitutionId:this.props.data.selectedInstitutionId,  
      selectedBoard: this.props.data.selectedBoardId,  
      selectedAcademicYear:this.props.data.selectedAcademicId,   
    };

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

    updateTemplate =() =>{
   
      const postData = {
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        template_id:this.state.selectedTemplate,
        role_id: this.props.data.role_id,
        content:this.state.templateData.getCurrentContent().getPlainText(),

        id_user: this.props.data.UID
      };
      new Service().apiCall('TemplateSettings/updateTemplate', postData,
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
        <h4 className="font-weight-bold">Template Updated</h4>
      </div>
    </Dialog>
            ),
          });
          setTimeout(() => {
           window.location.reload()
  
          }, 2000)
        } else {
        //  this.raiseLoginSignupErrorAlert("signup");
        }
      }).catch(error => {
    //    this.showError(error.response.data)
      });
    }

    viewTemplate = () => {
      window.open(Config.url+"TemplateSettings/ViewTemplate/"+this.state.selectedTemplate);
    }

    
    getTemplateTypes(){
      const postData = { 
        id_academicyear:this.props.data.selectedAcademicId,
        id_board:this.props.data.selectedBoardId,
        id_organization:this.props.data.selectedOrganizationId,
        id_institute:this.props.data.selectedInstitutionId,
        token:"abc",
        id_user: this.props.data.UID,
      };
      new Service().apiCall('TemplateSettings/getTemplateTypes',postData).then(response => {
        if (response.status==200 && response.data!='') {
          this.setState({ templateTypes: response.data});
        }
      }).catch(error => {
       console.log(error)
  
      });
    }
  

    getTemplateCode(){
      this.setState({templateData:EditorState.createEmpty()});
    const postData = { 
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      template_id:this.state.selectedTemplate,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('TemplateSettings/getTemplate',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({ templateData: EditorState.createWithContent(ContentState.createFromText(response.data)) });
      }
    }).catch(error => {
     console.log(error)

    });
  }

  getTemplateList(type){
    this.setState({ templateList: [] });
    const postData = { 
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      type:type,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('TemplateSettings/getTemplateByType',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
        this.setState({ templateList: response.data });
      }
    }).catch(error => {
     console.log(error)

    });
  }

  insertTemplate = () => {
  
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      template_name: this.state.template_name,
      type:this.state.selectedType,
      type_name:this.state.selectedTypeName,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall('TemplateSettings/insertTemplate',postData).then(response => {
      if (response.status==200 && response.data!='') {
 
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Template Created</h4>
            </div>
            </Dialog>
          ),
        });
        
        setTimeout(() => {
          window.location.reload()
        }, 2000)
       
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      //this.showError(error.response.data)

    });
  }

  onEditorStateChange = templateData => {
    this.setState({templateData})};

  componentDidMount() {
  // this.getTemplateCode();
   this.getTemplateTypes();

  }

  render() {
    const width = window.innerWidth;
  const width40p =  width * (40/100)+"px";
  return (
    <Fragment>
       {this.state.basicNotify}
     
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
    <PageTitle
        onSelectedNav={this.onSelected}
        titleHeading="Template Settings"
        titleDescription=""
        {...this.props}
      /> 
   
   <Grid container spacing={2} justify="center">
        <Grid item xs={12} lg={8} className="py-1">
        <Card className="card-box my-2 p-2">
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth>
            <TextField
                    className="m-2"
                    id="outlined-select-currency"
                    select
                    label="Select Type"
                    value={this.state.selectedType}
                    onChange={(event, child) => {this.setState({selectedType:child.props.id,selectedTypeName:event.target.value,showCode:false});this.getTemplateList(child.props.id)}}
                    variant="outlined">
                    {this.state.templateTypes.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.type_name}
                      </MenuItem>
                    ))}
                  </TextField>
             </FormControl>
            </Grid>  

            <Grid item xs={12} sm={6} lg={5}>
          <FormControl fullWidth>
            <TextField
                     className="m-2"
                    id="outlined-select-currency"
                    select
                    label="Select Template"
                    value={this.state.selectedTemplate}
                    onChange={(event, child) => {this.setState({selectedTemplate:child.props.id,showCode:false})}}
                    variant="outlined">
                    {this.state.templateList.map(option => (
                      <MenuItem key={option.id} name={option.id} id={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
            </TextField>
          </FormControl>
            </Grid>  
          <Grid item xs={12} sm={6} lg={1}>
          <Button
          className="m-2"
          variant="outlined"
          color="secondary"
          onClick={()=>{this.setState({showCode:true}); this.getTemplateCode()}}>
          View
          </Button>
          </Grid>
            <Grid item xs={12} sm={6} lg={3} className="text-center">
       {/* {this.state.selectedType!='' &&  <Button
        className="m-2"
        variant="outlined"
        color="primary"
        onClick={()=>this.setState({templatePanel:true,showCode:false})}>
        Create New
      </Button>} */}
            </Grid>
        </Grid>  
        </Card>  
        </Grid>
   </Grid>      

    { this.state.showCode && <Grid container spacing={2}>
        <Grid item xs={12} lg={12} className="py-1">
        <Card className="card-box my-2 p-3">
        <Editor
          editorState={this.state.templateData}
          placeholder="Enter description"
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />

<Grid container spacing={2}>
        <Grid item xs={12} lg={12} className=" m-2 py-2 text-right">
        <Button className="m-2"  variant="outlined" color="primary" onClick={()=>this.viewTemplate()}>
        View Template
        </Button>
        <Button className="m-2"  variant="outlined" className="successBtnOutline" onClick={()=>this.updateTemplate()}>
        Submit
        </Button>
        
        </Grid>  
        </Grid> 
        </Card>

        
        </Grid>
        </Grid> }
<Dialog
        open={this.state.templatePanel}
        onClose={()=>this.setState({templatePanel:false})}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Template Name to Create New Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(event) => this.setState({template_name:event.target.value})}
            value={this.state.template_name}
            label="Enter Template name"
            placeholder="Ex: Study Certificate"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.setState({templatePanel:false})} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>this.insertTemplate()} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

</Animated>
    </Fragment>
  );
}
}



export default connect(mapStateToProps, mapDispatchToPros)(withRouter(TemplateSettings));
