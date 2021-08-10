import React, { Fragment } from 'react';
import clsx from 'clsx';
import SweetAlert from "react-bootstrap-sweetalert";
import OutlinedDiv from "../../../../layout-components/CustomComponents/OutlinedDiv.js"; 
import StandardSectionsList from "../../../../layout-components/CustomComponents/StandardSectionsList.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChipInput from 'material-ui-chip-input';
import  "../../../../assets/custom.scss";
import {Animated} from "react-animated-css";
import {Checkbox,Grid,Switch,FormControlLabel,ButtonGroup,Dialog,CardActions,Toolbar,Card,Radio,Avatar,TextField,Button,InputAdornment,Chip,Drawer,Slide,FormControl,Box,Tooltip,IconButton,Typography,AppBar, List,ListItem,Divider} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Add from "@material-ui/icons/Add";  
import Remove from "@material-ui/icons/Remove";  
import Edit from "@material-ui/icons/Edit";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js'
import Service from '../../../../utils/Service';
import { AuthHelper } from '../../../../utils/AuthHelper.js';
import EditIcon from '@material-ui/icons/Edit';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from "moment";
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

class Authors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen:true,
      basicNotify:false,
      tags:[],
      showStatus:'all',
      authorHolders:[{name:'', description:''}],
      authors:[],
      selectedOrganizationId:this.props.data.selectedOrganizationId,
      selectedInstitutionId:this.props.data.selectedInstitutionId,
      selectedBoardId:this.props.data.selectedBoardId,
      selectedAcademicId:this.props.data.selectedAcademicId, 
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


  updateAuthor = (id, index) => {
    let data = this.state.authors;
    let author = data[index].name;
  
    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      name:author,
      id_author:id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Libraries/updateAuthor',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
            <div className="text-center p-5">
            <h4 className="font-weight-bold">Author Updated</h4>
            </div>
            </Dialog>
          ),
        });
        this.getAuthors(); 
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      }
    }).catch(error => {
     // this.showError(error.response.data)
    });
  }
  
handleInputChange = (cellInfo, event) => {
  let data = [...this.state.authors];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;
  this.setState({ data });
};
handleChange = (index,name, value) => {
  let data = this.state.authorHolders;
  data[index][name] = value;
  this.setState({ data });
};
rowEdit = (estatus,index) => {

  let lheadings = this.state.authors;
  if(estatus == true){
    lheadings[index].editable = false;
  }
  else{
    lheadings[index].editable = true;
  }
 // console.log(lheadings);
  this.setState({ authors:lheadings});
}
  renderEditable = (cellInfo) => {
   
    const cellValue = this.state.authors[cellInfo.index][cellInfo.column.id];
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

  removeAuthortHolder(i) {
    const { authorHolders } = this.state;
    this.setState({
      authorHolders: authorHolders.filter((author, index) => index !== i),
    });
  }

  handleAddAuthorholder = () => {
    let lauthorHolders = this.state.authorHolders;
    let lAuthor = {};
    lAuthor.name = '';
    lAuthor.description = '';
    lauthorHolders.push(lAuthor);
    this.setState({authorHolders:lauthorHolders});
  }

  handleDeactive = (id,status) => {
    let switchStatus = "";
     if(status == true){
        switchStatus = "Author Deactivated";
     }
     else{
        switchStatus = "Author Activated";
     }
     const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      id: id,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Libraries/deleteAuthor',postData).then(response => {
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
        this.getAuthors();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
      
      } else {
       // this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
    //  this.showError(error.response.data)

    });
  }

  createAuthor = () => {

    const postData = {
      id_organization:this.state.selectedOrganizationId,
      id_institute:this.state.selectedInstitutionId,
      id_board:this.state.selectedBoardId,
      id_academicyear:this.state.selectedAcademicId,
      authors:this.state.authorHolders,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID,
    };
    new Service().apiCall('Libraries/insertAuthor',postData).then(response => {
      if (response.status==200 && response.data!='') {
        this.setState({
          basicNotify: (
            <Dialog open={true}>
    <div className="text-center p-5">
      <h4 className="font-weight-bold">Author  Created</h4>
    </div>
  </Dialog>
          ),
        });
        
        setTimeout(() => {
          window.location.reload()
        }, 2000) 
      }
    }).catch(error => {
  //    this.showError(error.response.data)
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

  refreshData = () => {  
      this.getAuthors();
  }


  getAuthors = () => {
  const postData = {
    id_organization:this.state.selectedOrganizationId,
  id_institute:this.state.selectedInstitutionId,
  id_board:this.state.selectedBoardId,   
  id_academicyear:this.state.selectedAcademicId,  
  token:"abc",
  userrole: this.props.data.type,
  id_user: this.props.data.UID,
  role_id: this.props.data.role_id,
  };
  new Service().apiCall('Libraries/getAuthorData',postData).then(response => {
    console.log(response); 
    if (response.status==200 && response.data!='') {
      
      const newArr = response.data.map(v => ({...v, editable: false}));
      if(this.state.showStatus == 'all'){
          this.setState({authors:newArr});
      }
      else{
         var newArray = newArr.filter(x => x.status == this.state.showStatus);
         this.setState({authors:newArray});
      }
      
    }
  }).catch(error => {
  //  this.showError(error.response.data)
  });
}



  componentDidMount() {
      this.getAuthors();
  }

  render() {
    const width = window.innerWidth;
    const width30p =  width * (30/100)+"px";
    const width50p =  width * (50/100)+"px";
    const width100p =  width +"px";

  return (
    <Fragment>
       {this.state.basicNotify}

    <Animated  animationIn="slideInRight" animationOut="slideOutLeft"> 


    <Grid container spacing={5} justify="center">
        <Grid item xs={12} sm={12} lg={12}>
        {AuthHelper('Library Management','can_create') &&    <Card className="card-box  mb-3 mt-2 p-3">
        {this.state.authorHolders.map((holder, idx) => (
      <Grid container spacing={4}>

      <Grid item xs={12} sm={10} md={4}>
             <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off'
                }} 
               onChange={(event)=>this.handleChange(idx,"name",event.target.value)} 
               id="document-type"   
               label="Name" 
               value={holder.name}
               type="search" 
               inputRef={this.textInput} 
               variant="outlined" />
               </FormControl>
        </Grid>
        <Grid item xs={12} sm={10} md={7}>
        <FormControl fullWidth>
               <TextField 
               inputProps={{
                autoComplete: 'off'
                }} 
                onChange={(event)=>this.handleChange(idx,"description",event.target.value)} 
               value={holder.description}
               id="document-type"   
               label="About author" 
               type="search" 
               variant="outlined" />
               </FormControl>
        </Grid>
     
        <Grid item xs={12} sm={10} md={1} style={{textAlign:'center'}}>
        {(this.state.authorHolders.length - 1) == idx ?   <div  className="addHolderStyle inputMargin"><FormControl fullWidth >
            <TextField 

            id="document-type"   
            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.handleAddAuthorholder(); this.focusTextInput();
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
            onClick={()=>{this.handleAddAuthorholder(); this.focusTextInput()}}
            variant="outlined" />
            </FormControl></div>
            :
            <div className="removeHolderStyle inputMargin"> <FormControl fullWidth>
            <TextField 

            onKeyPress={(data) => {
            if (data.charCode === 13) {
            this.removeAuthortHolder(idx); 
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
            onClick={()=>{this.removeAuthortHolder(idx);}}
            variant="outlined" />
            </FormControl></div>}
        </Grid>
     
        </Grid>
        ))}
             

               {AuthHelper('Library Management','can_create') &&   <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={12} className="text-right mt-4">
        <Button className="successBtnOutline" variant="outlined" onClick={()=>this.createAuthor()}>
              Submit
            </Button>
        </Grid>
        </Grid>}
      
        </Card>}

        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
        <Card className="card-box  mb-4 customNoData">
        <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                 Authors
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
this.state.authors.map((original,key) => {
return ({
  slno: key+1,
  name: original.name,
  no_of_books:original.no_of_books,
  editable:original.editable,
  created_on:moment(original.created_on).format("DD/MM/YYYY"),
  actions: (
    // we've added some custom button actions
    <div className="grouplist-actions">
      { /* use this button to add a like kind of action */ }
    
      {AuthHelper('Library Management','can_edit') &&  <Tooltip
        id="tooltip-top"
        title={original.editable ? "Save":"Edit"}
        placement="top"
    
      >
         { original.editable ?  <Button disabled={original.status == 0}
                           
                            simple
                            onClick={()=> {this.setState({selectedHeading:original.name}); this.updateAuthor(original.id,key);}}
                            color="secondary"
                            className="edit"
                          >
                            <CheckCircleOutline  />
                          </Button>
                          :
                          <Button disabled={original.status == 0}
                        
                          simple
                          onClick={()=> {this.setState({selectedHeading:original.name}); this.rowEdit(original.editable,key);}}
                          color="secondary"
                          className="edit"
                        >
                          <Edit  />
                        </Button> }

      </Tooltip>}
                          
                          {/* use this button to remove the data row */}
                         
                          {AuthHelper('Library Management','can_delete') &&    <Tooltip
        id="tooltip-top"
        title={original.status == 1 ? "Deactivate":"Activate"}
        placement="top"
    
      >
           <FormControlLabel
                      control={
                        <Switch
                          checked={original.status == 1 ? true:false}
                          onChange={() => this.handleDeactive(original.id, original.status)}
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
  Header: "Author",
  accessor: "name",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder={"Search Author"}
type="text" 
onChange={event => onChange(event.target.value)}
/>
  ),
  Cell:this.renderEditable
},
{
  Header: "No of Books",
  accessor: "no_of_books",
  className: "center",
  Filter: ({filter, onChange}) => (
<TextField 
inputProps={{
autoComplete: 'off'
}}         
id="document-type"   
value={filter ? filter.value : ''}
placeholder="Search Count"
type="text" 
onChange={event => onChange(event.target.value)}
/>
  )
  },

  {
    Header: "Actions",
    accessor: "actions",
    show:(AuthHelper('Library Management','can_edit') || AuthHelper('Library Management','can_delete'))?true:false,
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
    {AuthHelper('Library Management','can_export') && <Grid container spacing={4}>
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

    </Animated>
   
    </Fragment>
  );
}
}


export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Authors));
