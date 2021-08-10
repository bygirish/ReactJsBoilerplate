import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
  Card,
  Drawer,
  IconButton,
  Box,
  Checkbox,
  Badge,
  Button,
  Toolbar,
  AppBar,
  Typography,
  List,
  ListItem,
  Tooltip,
  Divider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import ListIcon from '@material-ui/icons/List';
import  "../../assets/custom.scss";
import Service from '../../utils/Service';
import Config from '../../config';

export default class SlidepanelNav extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      selectedOrgIndex:0,
      selectedInst:this.props.data.selectedInstitutionId,
      selectedInstIndex:this.props.data.selectedInstIndex,
      selectedBoard:this.props.data.selectedBoardId,
      selectedBoardIndex:this.props.data.selectedBoardIndex,
      selectedAcademicYear:this.props.data.selectedAcademicId,
      selectedAcademicIndex:this.props.data.selectedAcademicIndex,
      menuLevel:1,
      notificationPane:false,
      openNotification: null,
      openProfile:null,
      navPanel:false,
      AcademicBoardInfo:""
    };

  }

 
  setLevel = (val) =>{
    this.setState({menuLevel:val})
  }
  setInstitution = (val) =>{
    this.setState({selectedInst:val})
  }
  setInstitutionIndex = (val) =>{
    this.setState({selectedInstIndex:val})
  }
  setBoard = (val) =>{
    this.setState({selectedBoard:val})
  }
  setBoardIndex = (val) =>{
    this.setState({selectedBoardIndex:val})
  }
  setYear = (val) =>{
    this.setState({selectedAcademicYear:val})
  }
  setYearIndex = (val) =>{
    this.setState({selectedAcademicIndex:val})
  }

  onSelected = (org_index,inst,inst_index,year,year_index,board,board_index) =>{

    let data = this.props.data;
    data.selectedOrganizationId = this.props.data.selectedOrganizationId;
    data.selectedInstitutionId = inst;
    data.selectedOrgIndex = org_index;
    data.selectedInstIndex = inst_index;
    data.selectedBoardId = board;
    data.selectedAcademicId = year;
    data.selectedBoardIndex = board_index;
    data.selectedAcademicIndex = year_index;
    this.props.changeOrganization(data);

    let orgdata = this.props.data;
    orgdata.org_id = orgdata.org_id;
    orgdata.org_name = orgdata.org_name;
    orgdata.org_logo = orgdata.org_logo;
    orgdata.inst_id = inst;
    orgdata.inst_logo = orgdata.organization[org_index].institutes[inst_index].logo;
    orgdata.inst_name = orgdata.organization[org_index].institutes[inst_index].name;
    orgdata.inst_district = orgdata.inst_district;
    orgdata.inst_state = orgdata.inst_state;
    orgdata.inst_pincode = orgdata.inst_pincode;
    orgdata.inst_taluk = orgdata.inst_taluk;
    orgdata.inst_address1 = orgdata.inst_address1;
    orgdata.inst_address2 = orgdata.inst_address2;
    orgdata.inst_district = orgdata.inst_district;
    orgdata.inst_state = orgdata.inst_state;
    orgdata.inst_pincode = orgdata.inst_pincode;
    orgdata.inst_contact1 = orgdata.inst_contact1;
    orgdata.inst_contact2 = orgdata.inst_contact2;
    orgdata.inst_email1 = orgdata.inst_email1;
    orgdata.inst_email2 = orgdata.inst_email2;
    this.props.getOrganizationData(orgdata);
   // console.log(this.props.data);
    window.location.reload();
  }

  getAcademicYearBoardDetails() {

    const postData = {
     UID: this.props.data.UID
    }
    new Service().apiCall('users/getUserDetails',postData).then(response => {
      if (response.status==200 && response.data!='') {
        if(response.data){
       
          this.setState({ AcademicBoardInfo: response.data});
        }
      } 
    }).catch(error => {
     console.log(error)
  
    });
  }
  handleClickNotification = event => {
    if (this.state.openNotification && this.state.openNotification.contains(event.target)) {
      this.setState({openNotification:null})
    } else {
      this.setState({openNotification:event.currentTarget})
    }
  };

  handleClickProfile = event => {
    if (this.state.openProfile && this.state.openProfile.contains(event.target)) {
      this.setState({openProfile:null})
    } else {
      this.setState({openProfile:event.currentTarget})
    }
  };

  componentDidMount() {
   // this.getAcademicYearBoardDetails();
    console.log(this.props.data.academicyear.length);
    
  }
  render() {
    const { classes } = this.props;
    const width = window.innerWidth;
const level1 = this.state.menuLevel == 1 ? width * (30/100)+"px" : "";
const level2 = this.state.menuLevel == 2 ? width * (40/100)+"px" : "";
const level3 = this.state.menuLevel == 3 ? width * (60/100)+"px" : "";

const Inst1 = this.state.menuLevel == 1 ? 12: "";
const Inst2 = this.state.menuLevel == 2 ? 8 : "";
const Inst3 = this.state.menuLevel == 3 ? 6 : "";

const Year1 = this.state.menuLevel == 1 ? 12: "";
const Year2 = this.state.menuLevel == 2 ? 4 : "";
const Year3 = this.state.menuLevel == 3 ? 2 : "";

const Board1 = this.state.menuLevel == 1 ? 12: "";
const Board2 = this.state.menuLevel == 2 ? 4 : "";
const Board3 = this.state.menuLevel == 3 ? 4 : "";
if(this.props.data.organization!=""){
return(
<div>
<Box className="ml-2">
{this.props.data.organization[this.state.selectedOrgIndex].institutes.length > 1 && <Tooltip title="Change Instituition" placement="bottom">
      <Button className="mx-1" size="sm" variant="contained" color="default" onClick={() => {this.setState({ navPanel: true }); this.setLevel(1) }}>{this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].name}</Button>
      </Tooltip>}
      {this.props.data.academicyear.length > 1 &&  <Tooltip title="Change Academic Year" placement="bottom">
  <Button className="mx-1" variant="contained" color="default" size="sm" onClick={() => {this.setState({ navPanel: true }); this.setLevel(2)}} >{this.props.data.academicyear[this.state.selectedAcademicIndex].label}</Button>
  </Tooltip>}
  {this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards.length > 1 &&<Tooltip title="Change Board" placement="bottom">
  <Button className="mx-1" variant="contained" color="default" size="sm" onClick={() => {this.setState({ navPanel: true }); this.setLevel(3)}} >{this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards[this.state.selectedBoardIndex].board_name}</Button>
  </Tooltip>}
        </Box>
        <Drawer

          anchor="right"
          open={this.state.navPanel}
          variant="temporary"
          elevation={4}
          onClose={()=> this.setState({navPanel:false})}>
          <Box className={"app-header-drawer bgColor"} style={{width:level1+level2+level3}}>
            <PerfectScrollbar>
            <AppBar className="app-header" color="secondary" position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=> this.setState({navPanel:false})} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">
            Change Institutue, Academic Year and Board
            </Typography>
           
          </Toolbar>
        </AppBar>
        <div className="m-20">
        <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={12} lg={12}>
                    
                  <Grid container spacing={2}>
                    
                  <Grid xs={12} sm={Inst1+Inst2+Inst3} md={Inst1+Inst2+Inst3} lg={Inst1+Inst2+Inst3}>
                    
                        {this.props.data.organization[this.state.selectedOrgIndex].institutes.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes.map((instdata ,index)=> 
                        <Card className={this.state.selectedInst == instdata.id ? "activeCard backgroundTransparent card-box  m-3 p-3": "InactiveCard backgroundTransparent card-box  m-3 p-3"}>
                             <div className="font-weight-400" onClick={() => {this.setLevel(2);this.setInstitution(instdata.id);this.setInstitutionIndex(index)}}>{instdata.name}</div>
                        </Card>
                        )}
                      
                  </Grid>  
                 {(this.state.menuLevel == 2 || this.state.menuLevel == 3) && <Grid xs={12} sm={Year1+Year2+Year3} md={Year1+Year2+Year3} lg={Year1+Year2+Year3}>
                    
                    {this.props.data.academicyear.length > 1 && this.props.data.academicyear.map((acddata,index) => 
                    <Card className={this.state.selectedAcademicYear == acddata.id ? "activeCard backgroundTransparent card-box  m-3 p-3": "InactiveCard backgroundTransparent card-box  m-3 p-3"} >
                         <div className="font-weight-400" onClick={() => {this.setLevel(3);this.setLevel(3);this.setYear(acddata.id);this.setYearIndex(index)}}>{acddata.label}</div>
                    </Card>
                    )}
                  
                    </Grid>  }

                    {this.state.menuLevel == 3 && <Grid xs={12} sm={Board1+Board2+Board3} md={Board1+Board2+Board3} lg={Board1+Board2+Board3}>
                    
                    {this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards.length > 1 && this.props.data.organization[this.state.selectedOrgIndex].institutes[this.state.selectedInstIndex].boards.map((boarddata,index) => 
                    <Card className={this.state.selectedBoard == boarddata.id_board ? "activeCard backgroundTransparent card-box  m-3 p-3": "InactiveCard backgroundTransparent card-box  m-3 p-3"}>
                         <div className="font-weight-400" onClick={() => {this.setLevel(3);this.setBoard(boarddata.id_board);this.setBoardIndex(index)}}>{boarddata.board_name}</div>
                    </Card>
                    )}   
                  
                    </Grid>  }
                  </Grid>
                  </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={12} lg={12} className="text-right m-3">
                  <Button onClick={() => {this.onSelected(this.state.selectedOrgIndex, this.state.selectedInst, this.state.selectedInstIndex, this.state.selectedAcademicYear, this.state.selectedAcademicIndex, this.state.selectedBoard, this.state.selectedBoardIndex); this.setState({navPanel:false})}}  color="secondary" variant="contained">Go</Button>
                  </Grid>
                  </Grid>
                            
        </div>
            </PerfectScrollbar>
          </Box>
        </Drawer>      

  </div>  
)
                    }
                    else{ 
                      return null;
                    }
  }
}

