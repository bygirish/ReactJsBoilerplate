import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import { HashLoader } from 'react-spinners';
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import NavigateNext from "@material-ui/icons/NavigateNext";
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js';
import Service from '../../../../utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import i18n from '../../../../i18n';

const lang = i18n.options.lng;
const t = i18n.options.resources[lang].translations;



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      total_roles:0,
      loading:false,
      total_modules:0,
      total_employees:0,
      total_mapped:0,
      showNextBtn:false,
      role_name:'',
      expanded: '',
      viewUpdatePermissionCount:0,
      showPermissions:false,
      roles:[],
      viewPermissionCount:0,
      create_role_permissions:[],
      view_role_permissions:[],
      role_permission:[],
      dialogOpen:false,
      basicNotify:false
    };

  }

  
  savePermissions = () => {

    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      name:this.state.role_name,
      permissionData: this.state.create_role_permissions,
      token:"abc",
      id_user: this.props.data.UID,
    };
 
    new Service().apiCall('Roles/insertRole',postData).then(response => {
      console.log(response);
   
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">{t.permission} {t.added} {t.successful}</h4>
          </div>
        </Dialog>
          ),
        });
       
          setTimeout(() => {
            this.setState({ basicNotify:false});window.location.reload();
          }, 2000) 
      }
    }).catch(error => {
      alert(error);
    });
  } 



  
  checkInputkFilled = ()=> { 
    if(this.state.role_name == ""){
     //this.setState({basicNotify:true});
     this.setState({
      basicNotify: (
        <Dialog open={true}>
      <div className="text-center p-5">
        <h4 className="font-weight-bold">{t.please} {t.enter} {t.role}</h4>
      </div>
    </Dialog>
      ),
    });
   
      setTimeout(() => {
        this.setState({ basicNotify:false});
      }, 2000) 
    }
    else if(this.state.roles.some(heading => heading.name.toString().toLowerCase() === this.state.role_name.toString().toLowerCase())){
      this.setState({
        basicNotify: (
          <Dialog open={true}>
        <div className="text-center p-5">
          <h4 className="font-weight-bold">{t.role} {t.already_exists}</h4>
        </div>
      </Dialog>
        ),
      });
     
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
  } 
    else{
      this.setState({showPermissions:true})
    }
  
  }

  handleChangeParent = (rindex,perm, status) => {
    let permissions_data = this.state.create_role_permissions;
    let checkedStatus = 0;
    if(status == 1){
      checkedStatus = 0;
    }
    else{
      checkedStatus = 1;
    }
        permissions_data[rindex][perm] = checkedStatus;
 
    this.setState({create_role_permissions: permissions_data});
    this.getViewPermissionCount();
  };

  handleChangeAll = (rindex,perm, status) => {
    let permissions_data = this.state.create_role_permissions;
      if(status == 1){
        permissions_data[rindex][perm] = 0;
        permissions_data[rindex].child.map((child,cindex)=>{
          permissions_data[rindex].child[cindex][perm] = 0;
        });
      }
      else{
        permissions_data[rindex][perm] = 1;
        permissions_data[rindex].child.map((child,cindex)=>{
          permissions_data[rindex].child[cindex][perm] = 1;
        });
      }
    this.setState({create_role_permissions: permissions_data});
    this.getViewPermissionCount();
  };

  handleChange = (rindex,index,perm, status) => {
    let permissions_data = this.state.create_role_permissions;
      if(status == 1){
        permissions_data[rindex].child[index][perm] = 0;
      }
      else{
        permissions_data[rindex].child[index][perm] = 1;
      }
    this.setState({create_role_permissions: permissions_data});
    this.getViewPermissionCount();
  };

  getViewPermissionCount =()=>{
    let permissions_data = this.state.create_role_permissions;
    console.log(permissions_data);
    let viewParentCount = 0;
    let viewChildCount = 0;
    permissions_data.map((parent,rindex)=>{
      // if(parent.can_view == 1){
      //   viewParentCount = viewParentCount+1;
        if(permissions_data[rindex].child){
          permissions_data[rindex].child.map((child,cindex)=>{
            console.log(child);
              if(permissions_data[rindex].child[cindex].can_view == 1){
                viewChildCount = viewChildCount + 1;
              }
          });
        }
     // }
    });
    let totalViewed = viewChildCount;
    this.setState({ viewPermissionCount: totalViewed });
  };

  getDashboardInfo = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Roles/getUserManagementDashboardDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ total_roles: response.data.roles, total_modules: response.data.modules, total_employees: response.data.employees, total_mapped: response.data.mapped }); 
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getRolesList = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Roles/getData',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
      this.setState({ roles: response.data }); 
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getAllPermissions = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
      actiondata:"create"
    };
    new Service().apiCall('Roles/getPermissionData',postData).then(response => {
      if (response.status==200 && response.data!='') {
      this.setState({ create_role_permissions: response.data }); 
      }
    }).catch(error => {
      console.log(error);
    });
  }

  viewRolePermissions = (role_id) => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      id_user: this.props.data.UID,
      id:role_id
    };
    new Service().apiCall('Roles/getPermissionData',postData).then(response => {
      if (response.status==200 && response.data!='') {
        console.log(response.data[0]);
      this.setState({ view_role_permissions: response.data[0].permissions,loading:false }); 
      this.updateViewPermissionCount();
      }
    }).catch(error => {
      console.log(error);
    });
  }

  updatePermissions = () => {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      name:this.state.selectedRoleName,
      permissionData: this.state.view_role_permissions,
      id_role:this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID,
      id: this.state.selectedRoleId
    };
    new Service().apiCall('Roles/updateRole',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
          <div className="text-center p-5">
            <h4 className="font-weight-bold">{t.permission} {t.updated} {t.successful}</h4>
          </div>
        </Dialog>
          ),
        });
        this.storeModulePermission();
          setTimeout(() => {
            this.setState({ basicNotify:false}); window.location.reload()
          }, 3000) 
      }
    }).catch(error => {
      console.log(error);
    });
  }

  storeModulePermission = () => {
  const postData = {
    id_organization:this.props.data.selectedOrganizationId,
    id_institute:this.props.data.selectedInstitutionId,
    id_board:this.props.data.selectedBoardId,
    id_academicyear:this.props.data.selectedAcademicId,
    id:this.props.data.role_id,
    token:"abc",
    id_user: this.props.data.UID,
  }
  new Service().apiCall('Roles/getPermissionData',postData).then(response => {

    if (response.status==200 && response.data!='') {
      
      let data = this.props.data;
      data.module_permissions = response.data[0].permissions;
      this.props.updateModulePermission(data);
    
    }
  }).catch(error => {
    console.log(error);
  });
}

  handleUpdateAll = (rindex,perm, status) => {
    let permissions_data = this.state.view_role_permissions;
      if(status == 1){
        permissions_data[rindex][perm] = 0;
        permissions_data[rindex].child.map((child,cindex)=>{
          permissions_data[rindex].child[cindex][perm] = 0;
        });
      }
      else{
        permissions_data[rindex][perm] = 1;
        permissions_data[rindex].child.map((child,cindex)=>{
          permissions_data[rindex].child[cindex][perm] = 1;
        });
      }
    this.setState({view_role_permissions: permissions_data});
    this.updateViewPermissionCount();
  };

  updateViewPermissionCount =()=>{
    let permissions_data = this.state.view_role_permissions;
    let viewParentCount = 0;
    let viewChildCount = 0;
    permissions_data.map((parent,rindex)=>{
       if(parent.can_view == 1){
         viewParentCount = viewParentCount+1;
      }
        if(permissions_data[rindex].child){
          permissions_data[rindex].child.map((child,cindex)=>{
              if(permissions_data[rindex].child[cindex].can_view == 1){
                viewChildCount = viewChildCount + 1;
              }
          });
        }
     // }
    });
    let totalViewed = viewChildCount;
    this.setState({ viewUpdatePermissionCount: totalViewed });
  };

  handleUpdateParent = (rindex, perm,status) => {
    let permissions_data = this.state.view_role_permissions;
    let checkedStatus = 0;
    if(status == 1){
      checkedStatus = 0;
    }
    else{
      checkedStatus = 1;
    }
        permissions_data[rindex][perm] = checkedStatus;
  

    this.setState({view_role_permissions: permissions_data});
    this.updateViewPermissionCount();
  };

  handleUpdateChange = (rindex,index,perm, status) => {
    let permissions_data = this.state.view_role_permissions;
      if(status == 1){
        permissions_data[rindex].child[index][perm] = 0;
      }
      else{
        permissions_data[rindex].child[index][perm] = 1;
      }
    this.setState({view_role_permissions: permissions_data});
    this.updateViewPermissionCount();
  };


  componentDidMount() {
    this.getDashboardInfo();
    this.getRolesList();
     this.getAllPermissions();
  }

 
  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
      <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_roles}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    {t.total} {t.roles}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_modules}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    {t.total} {t.modules}
                  </div>
                </div>
      
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                <div className="w-100 text-center">
                  <div className="display-3  font-weight-400">
                  {this.state.total_employees}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    {t.total} {t.employees}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <div
                className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-4 p-4">
                 <div className="w-100 text-center">
                  <div className="display-3 font-weight-400">
                  {this.state.total_mapped}
                  </div>
                  <div className="mt-2 mb-2" />
                  <div className="font-weight-400 font-size-sm text-uppercase">
                    {t.pending} {t.mapping}
                  </div>
                </div>
              </div>
            </Grid>
      </Grid>

      {AuthHelper('User Management','can_create') && <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={4}>
          <Button className="m-2 w-100 py-2 font-18" variant="contained" color="secondary" onClick={()=>this.setState({dialogOpen:true})}>
          {t.create} {t.role} 
          </Button>
        </Grid>
      </Grid>}

      <Grid container spacing={5} justify="center">
      <Grid item xs={12} sm={12} lg={8}>
      {this.state.roles.length > 0 && this.state.roles.map(roledata =>   
      <Card key={roledata.id} className="card-box mb-4">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} lg={4}>
            <div className="divider-v divider-v-lg" />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-center py-2">
                  <div className="mt-3 mb-2 line-height-sm">
                  <b className="font-size-lg">{roledata.name}</b>
                    <span className="text-black-50 d-block">role</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <div className="divider-v divider-v-lg" />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-center py-2">
                  <div className="mt-3 mb-2 line-height-sm">
                    <b className="font-size-lg">{roledata.mappedcount}</b>
                    <span className="text-black-50 d-block">{t.modiles} {t.mapped.toLowerCase()}</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="text-right py-2">
                  <div className="mt-2 mb-2 mr-4 line-height-sm">
                  {AuthHelper('User Management','can_edit') && <Fab size="medium" color="secondary" aria-label="edit" onClick={()=>{this.viewRolePermissions(roledata.id); this.setState({editRolePanel:true, selectedRoleId: roledata.id, selectedRoleName:roledata.name,loading:true})}}>
                    <EditIcon />
                  </Fab>}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
        )} 
        </Grid>
      </Grid>
      </Animated>
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
    
        <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=>this.setState({dialogOpen:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4">
              {t.add_new} {t.role}
            </Typography>
           
          </Toolbar>
        </AppBar>

        <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 
        <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        <Card className=" pt-74 customCard">
        <CardContent className="p-3">
        <Card className="card-box  mb-3 mt-2 py-2">
        <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={5} className="outlinedInput">
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                minLength: 5,
                style: {textTransform: 'capitalize'},
                  autoComplete: "off",
                  pattern: "[a-z]"
                }}
               id="document-type"   
               label={t.role +" "+t.name} 
               type="search" 
               onChange={(event) => this.setState({showPermissions:false,role_name:event.target.value, showNextBtn: event.target.value.length >= 5 ? true: false})}
               variant="outlined" 
               />  
        </FormControl> 
        </Grid>
        {this.state.showNextBtn && <Grid item xs={12} sm={12} lg={1}  className="pickerGrid">
           <Avatar onClick={()=>this.checkInputkFilled()}>
                <NavigateNext />
           </Avatar>
        </Grid> } 
        </Grid>
      
        </Card>
        { this.state.showPermissions && this.state.create_role_permissions.length > 0 && this.state.create_role_permissions.map((roledata,rindex) =>  
            <Card className="card-box  mb-3 mt-2">
              <List>
                <ListItem className="file-manager-item d-block">
                  <div className="align-box-row w-100">
                  <div className="d-flex align-items-center">
                      <Switch
                      checked={roledata.can_view == 1 ? true : false}
                      onChange={() => this.handleChangeParent(rindex,"can_view",roledata.can_view)}
                      value="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <a onClick={e => e.preventDefault()}>
                        {roledata.name}
                      </a>  
                    </div>
                    <Grid container>
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeParent(rindex,'can_create',roledata.can_create)}
                        tabIndex={-1}
                        checked={roledata.can_create == 1 ? true : false}
                        />
                        }
                        label="Create"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeParent(rindex,'can_edit',roledata.can_edit)}
                        tabIndex={-1}
                        checked={roledata.can_edit == 1 ? true : false}
                        />
                        }
                        label="Edit"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeParent(rindex,'can_export',roledata.can_export)}
                        tabIndex={-1}
                        checked={roledata.can_export == 1 ? true : false}
                        />
                        }
                        label="Export"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeParent(rindex,'can_delete',roledata.can_delete)}
                        tabIndex={-1}
                        checked={roledata.can_delete == 1 ? true : false}
                        />
                        }
                        label="Delete"
                        />
                    </Grid>  
                    </Grid> 
                  </div>
                 
                  <div className="align-box-row w-100 mt-2">
                        {roledata.child &&   
        <ReactTable className="w-100"
                    data={this.state.create_role_permissions[rindex].child}
                    minRows={0}
                    columns={[
                      {
                        Header: "Permission",
                        accessor: 'name',
                        className: "center",
                      },
                      {
                        Header: <div>
                        <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeAll(rindex,'can_view',roledata.can_view)}
                        tabIndex={-1}
                        checked={this.state.create_role_permissions[rindex].can_view == 1 ? true : false}
                        />
                        }
                        label=""
                        />
                      <br />
                      <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.view}</span>
                      </div>,
                        sortable: false,
                        filterable: false,
                        className: "center",
                        Cell: ({ original,index }) => (
                      <div>
                      <Checkbox
                      onClick={() => this.handleChange(rindex,index,'can_view',original.can_view)}
                      checked={original.can_view == 1 ? true : false}
                      />
                      </div>
                        ),
                      },
                   
                      {
                        Header:  <div>
                        <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeAll(rindex,'can_create',roledata.can_create)}
                        tabIndex={-1}
                        checked={this.state.create_role_permissions[rindex].can_create == 1 ? true : false}
                        />
                        }
                        label=""
                        />
                        <br />
                        <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.create}</span></div>,
                        sortable: false,
                        filterable: false,
                        className: "center",
                        Cell: ({ original,index }) => (
                        <div>
                        <Checkbox
                        onClick={() => this.handleChange(rindex,index,'can_create',original.can_create)}
                        checked={original.can_create == 1 ? true : false}
                        />
                        </div>
                        ),
                      },
                      {
                        Header:  <div>
                        <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeAll(rindex,'can_edit',roledata.can_edit)}
                        tabIndex={-1}
                        checked={this.state.create_role_permissions[rindex].can_edit == 1 ? true : false}
                        />
                        }
                        label=""
                        />
                        <br />
                        <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.edit}</span></div>,
                        sortable: false,
                        filterable: false,
                        className: "center",
                        Cell: ({ original,index }) => (
                        <div>
                        <Checkbox
                        onClick={() => this.handleChange(rindex,index,'can_edit',original.can_edit)}
                        checked={original.can_edit == 1 ? true : false}
                        />
                        </div>
                        ),
                      },
                      {
                        Header:  <div>
                        <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeAll(rindex,'can_export',roledata.can_export)}
                        tabIndex={-1}
                        checked={this.state.create_role_permissions[rindex].can_export == 1 ? true : false}
                        />
                        }
                        label=""
                        />
                        <br />
                        <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.export}</span></div>,
                        sortable: false,
                        filterable: false,
                        className: "center",
                        Cell: ({ original,index }) => (
                          <div>
                          <FormControlLabel
                          control={
                          <Checkbox
                          onClick={() => this.handleChange(rindex,index,'can_export',original.can_export)}
                          checked={original.can_export == 1 ? true : false}
                          />
                          }
                          label=""
                          />
                          </div>
                        ),
                      },
                      {
                        Header:  <div>
                        <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleChangeAll(rindex,'can_delete',roledata.can_delete)}
                        tabIndex={-1}
                        checked={this.state.create_role_permissions[rindex].can_delete == 1 ? true : false}
                        />
                        }
                        label=""
                        />
                        <br />
                        <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.delete}</span></div>,
                        sortable: false,
                        filterable: false,
                        className: "center",
                        Cell: ({ original,index }) => (
                        <div>
                        <Checkbox
                        onClick={() => this.handleChange(rindex,index,'can_delete',original.can_delete)}
                        checked={original.can_delete == 1 ? true : false}
                        />
                        </div>
                        ),
                      },
                 
                    ]}
                    defaultPageSize={10}
                    pageSize={this.state.create_role_permissions[rindex].child.length}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                    }
                    </div>
                </ListItem>
              </List>
            </Card>
              )}
        {this.state.showPermissions && <Card className="card-box ml-20 mr-20">
        <Grid container spacing={4} justify="center"> 
        <Grid item xs={12} sm={12} lg={6} className="m-auto">
        <div className="text-left m-2 display-5">
        <b>{this.state.viewPermissionCount} {t.modules} {t.mapped}</b>
        </div>
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
        <div className="text-right py-2">
        <Button variant="outlined"  className="m-2 successBtnOutline" onClick={()=>this.savePermissions()}>
        {t.submit}
        </Button>
        </div>
        </Grid>
        </Grid>
        </Card>  }
        </CardContent>
      
      </Card>

       
      </Grid>
      </Grid>
      </Animated>
      </Dialog>

      <Dialog fullScreen open={this.state.editRolePanel} className="bgColor" onClose={()=>this.setState({editRolePanel:false})} TransitionComponent={Transition}>
    
    <AppBar className="app-header" color="secondary" position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>this.setState({editRolePanel:false})} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">
           {t.edit} {t.role} {t.and} {t.assign} {t.permission}
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container spacing={5} justify="center">
    <Grid item xs={12} sm={12} lg={8}>

    <Card className=" pt-74 customCard">
    <CardContent className="p-3">
    {this.state.loading &&  <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
      
    <div className="font-size-xl text-center pt-3">
            {t.loading}
          </div>
     
    </div>}
    <Card className="card-box  py-2">
    <Grid container spacing={5} justify="center">
    <Grid item xs={12} sm={12} lg={5} className="outlinedInput mt-3">
    <FormControl fullWidth>
           <TextField 
           inputProps={{
            minLength: 5,
            style: {textTransform: 'capitalize'},
              autoComplete: "off",
              pattern: "[a-z]"
            }}
           id="document-type"   
           label="Role Name" 
           value={this.state.selectedRoleName}
           type="search" 
           onChange={(event) => this.setState({selectedRoleName:event.target.value})}
           variant="outlined" 
           />  
    </FormControl> 
    </Grid>
    </Grid>

    </Card>
  
    {!this.state.loading && this.state.view_role_permissions.length > 0 && this.state.view_role_permissions.map((roledata,rindex) =>   
        <Card className="card-box  mb-3 mt-2">
          <List>
            <ListItem className="file-manager-item d-block">
              <div className="align-box-row w-100">
              <div className="d-flex align-items-center">
                  <Switch
                  checked={roledata.can_view == 1 ? true : false}
                  onChange={() => this.handleUpdateParent(rindex,"can_view",roledata.can_view)}
                  value="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                  <a onClick={e => e.preventDefault()}>
                    {roledata.name}
                  </a>  
                </div>
                <Grid container>
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleUpdateParent(rindex,'can_create',roledata.can_create)}
                        tabIndex={-1}
                        checked={roledata.can_create == 1 ? true : false}
                        />
                        }
                        label="Create"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleUpdateParent(rindex,'can_edit',roledata.can_edit)}
                        tabIndex={-1}
                        checked={roledata.can_edit == 1 ? true : false}
                        />
                        }
                        label="Edit"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleUpdateParent(rindex,'can_export',roledata.can_export)}
                        tabIndex={-1}
                        checked={roledata.can_export == 1 ? true : false}
                        />
                        }
                        label="Export"
                        />
                    </Grid>  
                    <Grid item xs={12} sm={12} lg={3} className="text-center">
                    <FormControlLabel
                        control={
                        <Checkbox
                        onClick={() => this.handleUpdateParent(rindex,'can_delete',roledata.can_delete)}
                        tabIndex={-1}
                        checked={roledata.can_delete == 1 ? true : false}
                        />
                        }
                        label="Delete"
                        />
                    </Grid>  
                    </Grid>
              </div>
             
              <div className="align-box-row w-100 mt-2">
                    {roledata.child &&   
    <ReactTable className="w-100"
                data={this.state.view_role_permissions[rindex].child}
                minRows={0}
                columns={[
                  {
                    Header: "Permission",
                    accessor: 'name',
                    className: "center",
                  },
                  {
                    Header: <div>
                    <FormControlLabel
                    control={
                    <Checkbox
                    onClick={() => this.handleUpdateAll(rindex,'can_view',roledata.can_view)}
                    tabIndex={-1}
                    checked={this.state.view_role_permissions[rindex].can_view == 1 ? true : false}
                    />
                    }
                    label=""
                    />
                  <br />
                  <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.view}</span>
                  </div>,
                    sortable: false,
                    filterable: false,
                    className: "center",
                    Cell: ({ original,index }) => (
                  <div>
                  <Checkbox
                  onClick={() => this.handleUpdateChange(rindex,index,'can_view',original.can_view)}
                  checked={original.can_view == 1 ? true : false}
                  />
                  </div>
                    ),
                  },
     
                  {
                    Header:  <div>
                    <FormControlLabel
                    control={
                    <Checkbox
                    onClick={() => this.handleUpdateAll(rindex,'can_create',roledata.can_create)}
                    tabIndex={-1}
                    checked={this.state.view_role_permissions[rindex].can_create == 1 ? true : false}
                    />
                    }
                    label=""
                    />
                    <br />
                    <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.create}</span></div>,
                    sortable: false,
                    filterable: false,
                    className: "center",
                    Cell: ({ original,index }) => (
                    <div>
                    <Checkbox
                    onClick={() => this.handleUpdateChange(rindex,index,'can_create',original.can_create)}
                    checked={original.can_create == 1 ? true : false}
                    />
                    </div>
                    ),
                  },
                  {
                    Header:  <div>
                    <FormControlLabel
                    control={
                    <Checkbox
                    onClick={() => this.handleUpdateAll(rindex,'can_edit',roledata.can_edit)}
                    tabIndex={-1}
                    checked={this.state.view_role_permissions[rindex].can_edit == 1 ? true : false}
                    />
                    }
                    label=""
                    />
                    <br />
                    <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.edit}</span></div>,
                    sortable: false,
                    filterable: false,
                    className: "center",
                    Cell: ({ original,index }) => (
                    <div>
                    <Checkbox
                    onClick={() => this.handleUpdateChange(rindex,index,'can_edit',original.can_edit)}
                    checked={original.can_edit == 1 ? true : false}
                    />
                    </div>
                    ),
                  },
                  {
                    Header:  <div>
                    <FormControlLabel
                    control={
                    <Checkbox
                    onClick={() => this.handleUpdateAll(rindex,'can_export',roledata.can_export)}
                    tabIndex={-1}
                    checked={this.state.view_role_permissions[rindex].can_export == 1 ? true : false}
                    />
                    }
                    label=""
                    />
                    <br />
                    <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.export}</span></div>,
                    sortable: false,
                    filterable: false,
                    className: "center",
                    Cell: ({ original,index }) => (
                      <div>
                      <FormControlLabel
                      control={
                      <Checkbox
                      onClick={() => this.handleUpdateChange(rindex,index,'can_export',original.can_export)}
                      checked={original.can_export == 1 ? true : false}
                      />
                      }
                      label=""
                      />
                      </div>
                    ),
                  },
                  {
                    Header:  <div>
                    <FormControlLabel
                    control={
                    <Checkbox
                    onClick={() => this.handleUpdateAll(rindex,'can_delete',roledata.can_delete)}
                    tabIndex={-1}
                    checked={this.state.view_role_permissions[rindex].can_delete == 1 ? true : false}
                    />
                    }
                    label=""
                    />
                    <br />
                    <span style={{position:'relative', top:'-15px', fontSize:12}}>{t.delete}</span></div>,
                    sortable: false,
                    filterable: false,
                    className: "center",
                    Cell: ({ original,index }) => (
                    <div>
                    <Checkbox
                    onClick={() => this.handleUpdateChange(rindex,index,'can_delete',original.can_delete)}
                    checked={original.can_delete == 1 ? true : false}
                    />
                    </div>
                    ),
                  },
             
                ]}
                defaultPageSize={10}
                pageSize={this.state.view_role_permissions[rindex].child.length}
                showPaginationTop={false}
                showPaginationBottom={false}
                className="-striped -highlight"
              />
                }
                </div>
            </ListItem>
          </List>
        </Card>
          )}
    <Card className="card-box ml-20 mr-20">
    <Grid container spacing={4} justify="center"> 
    <Grid item xs={12} sm={12} lg={6} className="m-auto">
    <div className="text-left m-2 display-5">
    <b>{this.state.viewUpdatePermissionCount} modules mapped</b>
    </div>
    </Grid>
    <Grid item xs={12} sm={12} lg={6}>
    <div className="text-right py-2">
    <Button variant="outlined"  className="m-2 successBtnOutline" onClick={()=>this.updatePermissions()}>
    {t.submit}
    </Button>
    </div>
    </Grid>
    </Grid>
    </Card>
    </CardContent>
  
  </Card>

   
  </Grid>
  </Grid>
  </Dialog>
     
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(UserManagement));
