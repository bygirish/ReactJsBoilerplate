import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChipInput from 'material-ui-chip-input';
import  "@assetss/custom.scss";
import {Animated} from "react-animated-css";
import {Badge,Grid,Switch,FormControlLabel,ButtonGroup,Dialog,CardActions,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,MenuItem,Slide,FormControl,Box,Tooltip,IconButton,Typography,AppBar} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js'
import Service from '@utils/Service';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import Config from '../../../config';
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
      dialogOpen:true,
      basicNotify:false,
      selected_category:0,
      tags:[],
      subtags:[],
      category_type:"main",
      categoryList:[],
      showStatus:'all'
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

  getCategories() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      role_id: this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, editable: false}));
          const filterData = newArr.filter(x => x.id_parent == 0);
          if(this.state.showStatus == 'all'){
              this.setState({categoryList:filterData});
          }
          else{
             var newArray = newArr.filter(x => x.status == this.state.showStatus);
             this.setState({categoryList:filterData});
          }
      }
    }).catch(error => {
      this.showError(error.response.data)

    });

  }

  getSubCategories() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      role_id: this.props.data.role_id,
      token:"abc",
      id_user: this.props.data.UID
    }
    new Service().apiCall('Expenses/getData',postData).then(response => {
      if (response.status==200 && response.data!='') {
          const newArr = response.data.map(v => ({...v, editable: false}));
          const filterData = newArr.filter(x => x.id_parent != 0);
          console.log(filterData);
          if(this.state.showStatus == 'all'){
              this.setState({subCategoryList:filterData});
          }
          else{
             var newArray = filterData.filter(x => x.status == this.state.showStatus);
             this.setState({subCategoryList:newArray});
          }
      }
    }).catch(error => {
      this.showError(error.response.data)

    });

  }


  insertMaster = () => {
    let headingArray = [];
   
    let sCount = this.state.tags.length;
    let sText = "";
 
      if(sCount > 1){
        sText = "Expense Categories";
      }
      else{
        sText = "Expense Category";
      }
      this.state.tags.forEach(element => {
        headingArray.push(element);
      })
 
    const postData = {
      name: headingArray, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_parent:this.state.selected_category,
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall("Expenses/insertCategory",postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">{sCount + " "+ sText +"  Inserted!"}</h4>
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
            style={{ display: "block", marginTop: "-100px",zIndex:999999 }}
            title={response}
            showConfirm={false}
          >
          </SweetAlert>
          ),
          
        });
        setTimeout(() => {
          this.setState({ alert:null,categorytags:[] });
        }, 2000)
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  insertSubCategory = () => {
    let headingArray = [];
   
    let sCount = this.state.subtags.length;
    let sText = "";
 
      if(sCount > 1){
        sText = "Sub Categories";
      }
      else{
        sText = "Sub Category";
      }
      this.state.subtags.forEach(element => {
        headingArray.push(element);
      })
 
    const postData = {
      name: headingArray, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_parent:this.state.selected_category,
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall("Expenses/insertCategory",postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">{sCount + " "+ sText +"  Inserted!"}</h4>
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
            style={{ display: "block", marginTop: "-100px",zIndex:999999 }}
            title={response}
            showConfirm={false}
          >
          </SweetAlert>
          ),
          
        });
        setTimeout(() => {
          this.setState({ alert:null,categorytags:[] });
        }, 2000)
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }

  updateHeading = (id,index) => {
    let data = this.state.categoryList;
    let heading = data[index].name;
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      id:id,
      name:heading,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall("expenses/updateCategory",postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Updated Successfully</h4>
            </div>
            </Dialog>
          ),
        });
      
          this.getCategories();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)
    });
  }
  
handleInputChange = (cellInfo, event) => {
  let data = [...this.state.categoryList];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lcategories = this.state.categoryList;
  if(estatus == true){
    lcategories[index].editable = false;
  }
  else{
    lcategories[index].editable = true;
  }
  this.setState({ categoryList:lcategories});
}
  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.categoryList[cellInfo.index][cellInfo.column.id];
    if(cellInfo.original.editable){
      return (
        <FormControl fullWidth>
          <TextField 
          inputProps={{
          autoComplete: 'off'
          }}         
          id="document-type"   
          value={cellValue}
          placeholder="S No"
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

  handleDeactive = (name,id,status) => {
    let headingStatus = name+" Activated!";
    if(status == 1){
      headingStatus = name+" Deactivated!";
    }
    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    };
    new Service().apiCall("expenses/deleteCategory",postData).then(response => {
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
          this.getCategories();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      this.showError(error.response.data)

    });
  }

  handleAddChip = (chip) => {
    this.setState(state => ({ tags: [...state.tags, chip] }));
  }

  handleDeleteChip = (chip,i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddSubChip = (chip) => {
    this.setState(state => ({ subtags: [...state.subtags, chip] }));
  }

  handleDeleteSubChip = (chip,i) => {
    const { subtags } = this.state;
    this.setState({
      subtags: subtags.filter((tag, index) => index !== i),
    });
  }

  selectCategory = (val,id) => {
    this.setState({selected_category:id});
  }

  refreshData = () => {  
      this.getCategories();
  }

  refreshSubData = () => {  
    this.getSubCategories();
}

  componentDidMount() {
      this.getCategories();
      this.getSubCategories();
      this.setState({selectedHeading:'Expense Categories',tableHeading:'Expense Categories'})
  }

  render() {
  return (
    <Fragment>
       {this.state.basicNotify}
       <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar className="w-100">
            <Grid container>
               <Grid item xs={12} lg={6} className="d-flex">
               <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/expense-management")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="p-12">
              Expense Categories
            </Typography>
               </Grid>
               <Grid item xs={12} lg={6}>
               <div className="card-header--actions text-right">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="primary" size="small" variant={this.state.category_type == "main" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({category_type:"main",selected_category:0}); }}>
                  Main Categories
                </Button>
                <Button color="primary" size="small" variant={this.state.category_type == "sub" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({category_type:"sub"}); }}>
                Sub Categories
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
       {this.state.category_type == "main" && <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-3 mt-2 p-3">
        <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={12} className="outlinedInput customChip">
        <FormControl fullWidth>
              <ChipInput
              variant="outlined"
              className="inputTag"
              label={"Add "+this.state.tableHeading}
              value={this.state.tags}
              onAdd={(chip) => this.handleAddChip(chip)}
              onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
              />
        </FormControl> 
        </Grid>
       
        </Grid>

        <Grid container spacing={3} justify="center">
        <Grid item xs={12} sm={12} lg={12} className="text-right">
            <Button className="successBtnOutline" variant="outlined" onClick={()=>this.insertMaster()}>
              Submit
            </Button>
        </Grid>
        </Grid>
      
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
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.refreshData()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.refreshData()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.refreshData()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.categoryList.map((original,key) => {
return ({
  slno: key+1,
  name: original.name,
  created_date:original.created_on,
  editable:original.editable,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
            <Tooltip
            id="tooltip-top"
            title={original.editable ? "Save":"Edit"}
            placement="top"
            >
            { original.editable ? <Button
            className="m-2"
            simple
            onClick={()=> {this.setState({selectedHeading:original.name}); this.updateHeading(original.id,key);}}
            color="secondary"
            className="edit"
            >
            <CheckCircleOutline />
            </Button> : <Button
            className="m-2"
            simple
            onClick={()=> {this.setState({selectedHeading:original.name}); this.rowEdit(original.editable,key);}}
            color="secondary"
            className="edit"
            >
            <EditIcon />
            </Button> }

            </Tooltip>
                
                {/* use this button to remove the data row */}
            <Tooltip
            id="tooltip-top"
            title={original.status == 1 ? "Deactivate":"Activate"}
            placement="top"

            >
            <FormControlLabel
            control={
            <Switch
            checked={original.status == 1 ? true:false}
            onChange={() => this.handleDeactive(original.name,original.id, original.status)}
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
  Header: this.state.tableHeading,
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search "+this.state.tableHeading}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderEditable
},
{
  Header: "Created Date",
  accessor: "created_date",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
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
    <CardActions  style={{marginTop:0}}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
        {/* <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button> */}
        </Grid>
        </Grid>
  </CardActions>

        </Card>
        </Grid>
        </Grid>}

        {this.state.category_type == "sub" && <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-3 mt-2 p-3">
        <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={6} lg={4}>
             
             <FormControl fullWidth>
           <TextField
                   className="m-2"
                   id="outlined-select-currency"
                   select
                   label="Select Category"
                   value={this.state.selected_category}
                   onChange={(event,child) => this.selectCategory(event.target.value,child.props.id)}
                   variant="outlined">
                   {this.state.categoryList.map(option => (
                     <MenuItem key={option.id} value={option.id} id={option.id}>
                       {option.name}
                     </MenuItem>
                   ))}
                 </TextField>
                 </FormControl>
           </Grid>  
        <Grid item xs={12} sm={12} lg={8} className="outlinedInput customChip">
        <FormControl fullWidth>
              <ChipInput
              variant="outlined"
              className="inputTag"
              label={"Add Sub Categories"}
              value={this.state.subtags}
              onAdd={(chip) => this.handleAddSubChip(chip)}
              onDelete={(chip, index) => this.handleDeleteSubChip(chip, index)}
              />
        </FormControl> 
        </Grid>
     
        </Grid>

        <Grid container spacing={3} justify="center">
        <Grid item xs={12} sm={12} lg={12} className="text-right">
            <Button className="successBtnOutline" variant="outlined" onClick={()=>this.insertSubCategory()}>
              Submit
            </Button>
        </Grid>
        </Grid>
      
        </Card>

        </Grid>

        <Grid item xs={12} sm={12} lg={8}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                  Sub Category List
                </h4>
              </div> 
              <div className="card-header--actions">
                <Box>
                  <ButtonGroup size="small" className="m-2">
                  <Button  color="secondary" size="small" variant={this.state.showStatus == "all" ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:'all'}); this.refreshSubData()}}>
                  All
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 1 ? "contained":"outlined"}  style={{fontWeight:500}} onClick={() => {this.setState({showStatus:1}); this.refreshSubData()}}>
                  Active
                </Button>
                <Button color="secondary" size="small" variant={this.state.showStatus == 0 ? "contained":"outlined"}   style={{fontWeight:500}} onClick={() => {this.setState({showStatus:0}); this.refreshSubData()}}>
                  InActive
                </Button>
                  </ButtonGroup>
                </Box>
              </div>
            </div>

    
     
    <ReactTable

data={
this.state.subCategoryList.map((original,key) => {
return ({
  slno: key+1,
  name: original.name,
  created_date:original.created_on,
  editable:original.editable,
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
            <Tooltip
            id="tooltip-top"
            title={original.editable ? "Save":"Edit"}
            placement="top"
            >
            { original.editable ? <Button
            className="m-2"
            simple
            onClick={()=> {this.setState({selectedHeading:original.name}); this.updateHeading(original.id,key);}}
            color="secondary"
            className="edit"
            >
            <CheckCircleOutline />
            </Button> : <Button
            className="m-2"
            simple
            onClick={()=> {this.setState({selectedHeading:original.name}); this.rowEdit(original.editable,key);}}
            color="secondary"
            className="edit"
            >
            <EditIcon />
            </Button> }

            </Tooltip>
                
                {/* use this button to remove the data row */}
            <Tooltip
            id="tooltip-top"
            title={original.status == 1 ? "Deactivate":"Activate"}
            placement="top"

            >
            <FormControlLabel
            control={
            <Switch
            checked={original.status == 1 ? true:false}
            onChange={() => this.handleDeactive(original.name,original.id, original.status)}
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
  Header: this.state.tableHeading,
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search "+this.state.tableHeading}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
},
{
  Header: "Created Date",
  accessor: "created_date",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
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
    <CardActions  style={{marginTop:0}}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={6}></Grid>
      <Grid item xs={12} md={4} lg={6} className="text-right">
        {/* <Button   variant="outlined" color="secondary" href={Config.url+"/StudentDetails/excelStudent?standard_id="+this.state.selectedStandardId+"&id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>
        Export
        </Button> */}
        </Grid>
        </Grid>
  </CardActions>

        </Card>
        </Grid>
        </Grid>}
</div>
    </Animated>
    </Dialog>

    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));
