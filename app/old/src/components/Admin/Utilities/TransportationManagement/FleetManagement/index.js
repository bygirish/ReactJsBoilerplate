import React, { Fragment } from 'react';
import ReactDOM from "react-dom";
import { Dialog, Grid, Drawer, Toolbar, FormControl, IconButton, Typography, AppBar,MenuItem, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Tabs, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, Switch, Tooltip, Chip, Paper, FormControlLabel, FormLabel } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTable from 'react-table-6';
// import Autocomplete from "../../../../../layout-components/CustomComponents/AutoComplete.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import VisibilityIcon from '@material-ui/icons/Visibility';

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
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import "@assetss/custom.scss";
import Service from '@utils/Service';
import Config from '../../../../../config';
import moment from "moment";
import Moment from 'moment';
import { AlignRight } from 'react-feather';


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

class FleetManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: 'all',
      dialogOpen: true,
      actionType: 'fuel_usage',
      loading: false,
      selectedBlockId: '',
      TabValue: 0,
      checkAll: false,
      blocksList: [],
      vehicleMaintainance:[],
      checked: [],
      holidays: [{ id: 1, name: 'test' }],
      startdate: new Date(),
      enddate: new Date(),
      confirmPanel: false,
      activePanelType: true,
      selectedTab: '',
      selectedSubTab: '',
      error: '',
      activeSidebarTab: "fuel_usage",
      alert: null,
      roomholders: [{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }],
      loading: true,
      selectedBoard: '',
      basicNotify: false,
      selectedOrganizationId: this.props.data.selectedOrganizationId,
      selectedInstitutionId: this.props.data.selectedInstitutionId,
      selectedBoard: this.props.data.selectedBoardId,
      selectedAcademicYear: this.props.data.selectedAcademicId,
      RoleMaster: [],
      VehicleMaster:[{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }],
      StaffOverview:[],
      StaffToVehicle:[],
      dependentModule: false,
      value: '',
      role:'',
      role_name:'',
      setValue: 'female',
      shifttype:'full_time',
      shiftHolders: [{ from_time: Moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), to_time: Moment(new Date()).format("YYYY-MM-DD HH:mm:ss") }],   
       
      shift_count:1,
      selectedStaff:[],
      monthDetails:[{month:'January', month_id:1},{month:'February', month_id:2},{month: 'March', month_id:3},{month: 'April', month_id:4},{month: 'May', month_id:5},{month: 'June', month_id:6},{month: 'July', month_id:7},{month:'August', month_id:8},{month: 'September', month_id:9},{month: 'October', month_id:10},{month: 'November', month_id:11},{month:'December', month_id:12}],
        

      RoleMappingDetails:[],
      StaffToRole: [],
      details:[{id_role:'',staffs:''}],

    };
  }
    //ADD STAFF TO ROLE
    insertStafftoRole = () => {
      let headingStatus = "Role Inserted!";  
      let role = this.state.role_name;
  
      const postData = {
          id_organization:this.props.data.selectedOrganizationId,
          id_institute:this.props.data.selectedInstitutionId,
          id_board:this.props.data.selectedBoardId,   
          id_academicyear:this.props.data.selectedAcademicId,  
          // staffs:JSON.stringify(this.state.staffArr),
          staffs:this.state.staffArr,
          token:"abc",
          id_role:role,
          id_user: this.props.data.UID
      };
      console.log(postData);
      //return false;
      new Service().apiCall('TransportationMasters/insertStaffMapping',postData).then(response => {
          console.log(response);
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
          this.getStaffRoleMapping();
          setTimeout(() => {
          this.setState({ basicNotify:false, shiftHolders:[{from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")}]});
          }, 2000) 
      
      } else {
          //this.raiseLoginSignupErrorAlert("signup");
      }
      }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

      });
  }
  getStaffRoleMapping = (type) => {
    
    const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    type:type,
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('TransportationMasters/getStaffMapping',postData).then(response => {
    //console.log(response)
    if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
        return {...data, checked: false, editable: false};
    });
    
        this.setState({ RoleMappingDetails: data }); 
    }else{
        this.setState({ RoleMappingDetails: []});
    }
    }).catch(error => {
        console.log(error);
    });
}
  getStaffs = (type) => {
    
    const postData = {
    id_organization:this.state.selectedOrganizationId,
    id_institute:this.state.selectedInstitutionId,
    token:"abc",
    type:type,
    id_user: this.props.data.UID,
    id_board:this.state.selectedBoard,
    id_academicyear:this.state.selectedAcademicYear,
    };
    //console.log(postData);
    new Service().apiCall('Staffs/getData',postData).then(response => {
    //console.log(response)
    if (response.status==200 && response.data!='') {
        const data = response.data.map((data) => {
        return {...data, checked: false, editable: false};
    });
    
        this.setState({ StaffToRole: data }); 
    }else{
        this.setState({ StaffToRole: []});
    }
    }).catch(error => {
        console.log(error);
    });
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
    new Service().apiCall('TransportationMasters/deleteVehicleMaster', postData).then(response => {
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
        this.getVehicleMaster();
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
  handleDeactiveVehicleMaintainance = (id, status) => {
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
    new Service().apiCall('TransportationMasters/deleteVehicleMaintainance', postData).then(response => {
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
        this.getVehicleMaster();
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
  handleTimeChange(index, name, datevlaue){
    let timer = this.state.shiftHolders;
    timer[index][name] = Moment(datevlaue).format("YYYY-MM-DD HH:mm:ss");
    this.setState({ timer });
};
insertRoleMaster = event =>{
  event.preventDefault();

  let headingStatus = "Role Inserted!"; 
  let shifttype = this.state.shifttype;
  let shift_count = this.state.shift_count;
  let role = this.state.role;

  for(var i =0; i< this.state.RoleMaster.length; i++ ) {
      if(this.state.RoleMaster[i].name === this.state.role) { 
                   
          this.setState({
              basicNotify: (
                  <Dialog open={true}>
                  <div className="text-center p-5">
                      <h4 className="font-weight-bold">{this.state.role+' already exists'}</h4>
                  </div>
                  </Dialog>
              ),
          });
          setTimeout(() => {
              this.setState({ basicNotify:false, shift_count:'', role:''});
          },1000);
          return false; 
          break;           
      }
  }

  const postData = {
  id_organization:this.props.data.selectedOrganizationId,
  id_institute:this.props.data.selectedInstitutionId,
  id_board:this.props.data.selectedBoardId,   
  id_academicyear:this.props.data.selectedAcademicId,  
  shifts:this.state.shiftHolders,
  token:"abc",
  name : role,
  working_type : shifttype,
  no_of_shifts:shift_count,
  id_user: this.props.data.UID
  };
  // console.log(this.state.role);
  // return false;
  new Service().apiCall('TransportationMasters/insertRoleData',postData).then(response => {
      //console.log(response);
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
      this.getRoleMaster();
      setTimeout(() => {
      this.setState({ basicNotify:false, shift_count:'', role:'', shiftHolders:[{from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")}]});
      }, 2000) 
  
  } else {
      //this.raiseLoginSignupErrorAlert("signup");
  }
  }).catch(error => {
  // this.raiseLoginSignupErrorAlert("signup");

  });
}
  handleDeactiveStaffOverview = (id, status) => {
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
    new Service().apiCall('TransportationMasters/deleteStaffOverview', postData).then(response => {
      console.log(response);
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
        this.getStaffOverview();
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
  searchStaff = (event,values) => {
    console.log(values);
    //this.setState({selectedStaff:values})
    let data =[];
    if(values){
        const listItems = values.map((myList, index) =>  
            data.push(myList.UID)         
        ); 
    }
  
    this.setState({selectedStaff:values, staffArr:data})
    //console.log(staffArr)    
}

  insertBlock = () => {
    let headingStatus = "Block Inserted!";

    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      vehicleDetails: this.state.roomholders,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/insertVehicleMaster', postData).then(response => {
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
        this.getVehicleMaster();
        setTimeout(() => {
          this.setState({ basicNotify: false, roomholders: [{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }] });
        }, 2000)

      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
      // this.raiseLoginSignupErrorAlert("signup");

    });
  }


  updateHeading = (id, index) => {
    let data = this.state.VehicleMaster;
    let vehicle_no = data[index].vehicle_no;
    let make_model = data[index].make_model;
    let year = data[index].year;
    let fuel_type = data[index].fuel_type;
    let insurance_expiry_date = data[index].insurance_expiry_date;
    let seating_capacity = data[index].seating_capacity;
    const postData = {
      id_organization: this.props.data.selectedOrganizationId,
      id_institute: this.props.data.selectedInstitutionId,
      id_board: this.props.data.selectedBoardId,
      id_academicyear: this.props.data.selectedAcademicId,
      id: id,
      vehicle_no: vehicle_no,
      make_model: make_model,
      year: year,
      fuel_type: fuel_type,
      insurance_expiry_date: insurance_expiry_date,
      seating_capacity: seating_capacity,
      token: "abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/updateVehicleMaster', postData).then(response => {
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
        this.getVehicleMaster();
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
    let object = { block_name: '', no_of_floors: '' };
    data.push(object);
    this.setState({ data });
  }

  removeBlock = (index) => {
    const { roomholders } = this.state;
    this.setState({ roomholders: roomholders.filter((data, i) => i !== index) })

  }

  getBlocksData = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getFuelDetails', postData).then(response => {
      // console.log(response)
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
  getVehicleMaintainance = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getVehicleMaintainance', postData).then(response => {
      // console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ vehicleMaintainance: data });
      } else {
        this.setState({ vehicleMaintainance: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  
   getRoleMaster = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getRoleDataNew', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ RoleMaster: data });
      } else {
        this.setState({ RoleMaster: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getVehicleMaster = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getData', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ VehicleMaster: data });
      } else {
        this.setState({ VehicleMaster: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getStaffOverview = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getStaffMapping', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ StaffOverview: data });
      } else {
        this.setState({ StaffOverview: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getStaffToVehicle = (id, type) => {
    const postData = {
      id_organization: this.state.selectedOrganizationId,
      id_institute: this.state.selectedInstitutionId,
      token: "abc",
      id_user: this.props.data.UID,

      id_board: this.state.selectedBoard,
      id_academicyear: this.state.selectedAcademicYear,
    };
    // console.log(postData);
    new Service().apiCall('TransportationMasters/getData', postData).then(response => {
      console.log(response)
      if (response.status == 200 && response.data != '') {
        const data = response.data.map((data) => {
          return { ...data, checked: false, editable: false, gross_rent: 0 };
        });

        this.setState({ StaffToVehicle: data });
      } else {
        this.setState({ StaffToVehicle: [] });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  

  


  rowEdit = (estatus, index) => {

    let blocks = this.state.VehicleMaster;
    if (estatus == true) {
      blocks[index].editable = false;
    }
    else {
      blocks[index].editable = true;
    }
    this.setState({ blocks });
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.VehicleMaster];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;
    this.setState({ data });
  };

  handleChangeData = (index, name, value) => {
    let data = this.state.roomholders;
    data[index][name] = value;
    this.setState({ data });

  };
  resetClass=()=>{
   let data = this.state.roomholders;
   console.log(data);
    data=[{ vehicle_no: '', make_model: '', year: '', fuel_type: '', insurance_expiry_date: '', seating_capacity: '' }];
    this.setState({ roomholders: data });
    console.log(data);
  }

  renderEditable = (cellInfo) => {

    const cellValue = this.state.VehicleMaster[cellInfo.index][cellInfo.column.id];
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
  addShift = ()=>{
    let data = this.state.shiftHolders;
    let shift_count = this.state.shift_count + 1;
    let object={from_time:Moment().format("YYYY-MM-DD HH:mm:ss"), to_time:Moment().format("YYYY-MM-DD HH:mm:ss")};
    data.push(object);
    this.setState({data});
    this.setState({shift_count:shift_count});
}

removeShift = (index) =>{
    const {shiftHolders} = this.state;
    let shift_count = this.state.shift_count - 1;
    this.setState({ shiftHolders : shiftHolders.filter((data,i)=> i!==index)});
    this.setState({shift_count:shift_count});
}

  componentDidMount() {
    this.getBlocksData();
    this.getVehicleMaintainance();
    this.getRoleMaster();
    this.getVehicleMaster();
    this.getStaffOverview();
    this.getStaffToVehicle();
    this.getStaffs();
    this.getStaffRoleMapping();
  }
  handleMappingDelete = (id,status) => {
    let headingStatus = "Role Mapping Activated!";
    if(status == 1){
      headingStatus = "Role Mapping Deactivated!";
    }
  
    const postData = {
      id: id, 
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,   
      id_academicyear:this.props.data.selectedAcademicId,  
      token:"abc",
      id_user: this.props.data.UID
    };
    new Service().apiCall('TransportationMasters/deleteStaffRole',postData).then(response => {
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
       this.getStaffRoleMapping();
        setTimeout(() => {
          this.setState({ basicNotify:false});
        }, 2000) 
   
      } else {
        //this.raiseLoginSignupErrorAlert("signup");
      }
    }).catch(error => {
     // this.raiseLoginSignupErrorAlert("signup");
    });
}


  handleChange = (event) => {
    //  console.log(event.target.value);
    // value=event.target.value;
    // this.setState({value: value})

    let data = [...this.state.value];
    data = event.target.value;
    this.setState({ value: data });
    console.log(data);

  };

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
                    Fleet Management
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
                          <ListItem button className={this.state.actionType == "fuel_usage" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "fuel_usage", showStatus: 'all' }); }}>
                            <span>Fuel Usage & History</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "vehicle_maintainance" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "vehicle_maintainance", showStatus: 'all' }); }}>
                            <span>Vehicle Maintainance</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "vehicle_master" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "vehicle_master", showStatus: 'all' }); }}>
                            <span>Vehicle Master</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "staff_overview" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "staff_overview", showStatus: 'all' }); }}>
                            <span>Staff Overview</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "role_master" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "role_master", showStatus: 'all' }); }}>
                            <span>Role Master</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "staff_to_role" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "staff_to_role", showStatus: 'all' }); }}>
                            <span>Staff To Role</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "staff_to_vehicle" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "staff_to_vehicle", showStatus: 'all' }); }}>
                            <span>Staff To Vehicle</span>
                          </ListItem>
                          <Divider />
                          <ListItem button className={this.state.actionType == "rostering" ? "my-2 activeSidebarColor" : "my-2"} onClick={() => { this.setState({ actionType: "rostering", showStatus: 'all' }); }}>
                            <span>Rostering</span>
                          </ListItem>
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
                                    Create Block and Floor
                                                                    </h4>
                                </div>
                              </div>
                            </Grid>
                          </Grid>

                          {this.state.roomholders.map((element, index) => (

                            <Grid container spacing={4}>

                              <Grid item xs={12} sm={10} md={7}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "block_name", event.target.value)}
                                    value={element.block_name}
                                    id="document-type"
                                    label="Block Name"
                                    type="search"
                                    variant="outlined" />
                                </FormControl>
                              </Grid>

                              <Grid item xs={12} sm={10} md={4}>
                                <FormControl fullWidth>
                                  <TextField
                                    inputProps={{
                                      autoComplete: 'off',
                                      style: { textTransform: 'capitalize' }
                                    }}
                                    onChange={(event) => this.handleChangeData(index, "no_of_floors", event.target.value)}
                                    value={element.no_of_floors}
                                    id="document-type"
                                    label="No. of Floors"
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
                                    Block List
                                                                    </h4>
                                </div>
                              </div>

                              <ReactTable
                                data={this.state.blocksList.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    block_name: original.block_name,
                                    no_of_floors: original.no_of_floors,
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
                                            onClick={() => this.props.history.push("/admin/add-rooms-to-floors/" + original.id)}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <NextIcon />
                                          </Button>
                                        </Tooltip>

                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Edit" placement="top" >
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
                                        </Tooltip>

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
                                    ),
                                    actionsGo: (<Button variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/view-block-rooms-master/")}>Go</Button>)
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
                                    Header: "Block Name",
                                    accessor: "block_name",
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
                                    Header: "Floor No.",
                                    accessor: "no_of_floors",
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



                  {/* Role Master section */}
                  {this.state.actionType == "role_master" && <div>


                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={8}>
                      <Card className="card-box  mb-4 p-4 customNoData">
                                                    <form  onSubmit={this.insertRoleMaster.bind(this)} autoComplete="off">
                                                        <Grid container>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                                <div className="card-header pl-0">
                                                                    <div className="card-header--title">
                                                                        <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                        Role Master
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={6}>
                                                                <FormControl fullWidth>
                                                                    <TextField 
                                                                    inputProps={{
                                                                    autoComplete: 'off',
                                                                    style: {textTransform: 'capitalize'} 
                                                                    }}
                                                                    value={this.state.role}
                                                                    onChange = {(event) => this.setState({role:event.target.value})}
                                                                    id="document-type"   
                                                                    label="Enter Role Name" 
                                                                    type="search" 
                                                                    variant="outlined" required/>
                                                                    </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} md={12} lg={6}>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup row aria-label="position" name="shiftType" value={this.state.shifttype} onChange={(event) => this.setState({shifttype:event.target.value})} defaultValue="top">
                                                                    <FormControlLabel value="full_time" control={
                                                                        <Radio name="shift_type" color="primary"
                                                                            />} label="Full Time" checked={this.state.shifttype == 'full_time'}/>
                                                                    <FormControlLabel value="shift" control={<Radio name="shift_type" color="primary"
                                                                                    />} label="Shift" checked={this.state.shifttype == 'shift'} />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>       

                                                    {this.state.shifttype == 'shift' && <>
                                                        {this.state.shiftHolders.map((element,index)=>(      
                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={1}>
                                                            <FormLabel component="legend" className="pt-3">Shift {index + 1}</FormLabel>
                                                            
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={5}> 
                                                            <FormControl fullWidth>
                                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <KeyboardTimePicker
                                                                margin="normal"
                                                                autoOk={true}
                                                                value={element.from_time}
                                                                shrink={true}
                                                                id="time-picker"
                                                                label="From Time"
                                                                inputVariant="outlined"
                                                                onChange={date => this.handleTimeChange(index, "from_time",date)} 
                                                                KeyboardButtonProps={{
                                                                'aria-label': 'change time', 
                                                                }} 
                                                                /> 
                                                                </MuiPickersUtilsProvider>
                                                            </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} md={12} lg={5}>
                                                            <FormControl fullWidth>
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardTimePicker
                                                                margin="normal"
                                                                autoOk={true}
                                                                value={element.to_time}
                                                                shrink={true}
                                                                id="time-picker"
                                                                label="To Time"
                                                                inputVariant="outlined"
                                                                onChange={(value)=>this.handleTimeChange(index, "to_time",value)}   
                                                                KeyboardButtonProps={{
                                                                'aria-label': 'change time', 
                                                                }} 
                                                                /> 
                                                            </MuiPickersUtilsProvider>
                                                            </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} lg={2}>
                                                                {index == 0 ?  <FormControl fullWidth>
                                                                    <TextField 
                                                                    InputProps={{
                                                                        autoComplete: 'off',
                                                                        readOnly: true,
                                                                        startAdornment: (
                                                                        <InputAdornment position="start">
                                                                        <Add onClick={()=>this.addShift()} style={{color:'rgb(76, 175, 80)', cursor:'pointer',marginLeft: "-8px"}} />
                                                                        </InputAdornment>
                                                                        ),
                                                                        }}
                                                                        id="document-type" label="Add" variant="outlined" />
                                                                </FormControl>:
                                                                <FormControl fullWidth>
                                                                <TextField 
                                                                InputProps={{
                                                                    autoComplete: 'off',
                                                                    readOnly: true,
                                                                    startAdornment: (
                                                                    <InputAdornment position="start">
                                                                    <Remove onClick={()=>this.removeShift(index)} style={{color:'rgb(248, 50, 69)', cursor:'pointer'}} />
                                                                    </InputAdornment>
                                                                    ),
                                                                    }}
                                                                    id="document-type" label="Add" variant="outlined" />
                                                            </FormControl>}
                                                            </Grid>
                                                        </Grid> 
                                                        ))}
                                                        <FormControl fullWidth>
                                                        <TextField 
                                                            inputProps={{
                                                            autoComplete: 'off',
                                                            style: {textTransform: 'capitalize'} 
                                                            }}
                                                            id="document-type"   
                                                            label="Shift Count" 
                                                            type="search" 
                                                            variant="outlined" 
                                                            value={this.state.shift_count}
                                                            onChange={event => this.setState({shift_count : event.target.value})} hidden/>
                                                        </FormControl>
                                                        </> 
                                                        }
                                                        <Grid container className="mt-2">
                                                            <Grid item xs={12} sm={12} md={12} className="text-right">
                                                                <Button type="submit" className="successBtnOutline" variant="outlined">Submit</Button>
                                                            </Grid>
                                                        </Grid>
                                                    </form>
                                                </Card>
                                            
                      </Grid>
                    </Grid>


                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={11}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Roles List
                                                                    </h4>
                                </div>
                              </div>
                              <ReactTable
                                data={this.state.RoleMaster.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    role_name: original.name,
                                    shift_type: original.working_type,
                                    no_of_hour: original.shift_hours,
                                    emp_count: original.employee_count
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
                                    Header: "Role Name",
                                    accessor: "role_name",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Role"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Shift Type",
                                    accessor: "shift_type",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Shift"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "No Of Hours",
                                    accessor: "no_of_hour",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search No Of Hours"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  },
                                  {
                                    Header: "Employee Count",
                                    accessor: "emp_count",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Employee Count"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    )
                                  }
                                ]}
                                defaultFilterMethod={filterCaseInsensitive}
                                defaultPageSize={10}
                                showPaginationTop={false}
                                showPaginationBottom={false}
                                className="-striped -highlight"
                              />
                            </Grid>
                          </Grid>

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/excelBlocks?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                            </Grid>
                          </Grid>
                        </Card>

                      </Grid>
                    </Grid>
                  </div>}

                  {/* staff to role section */}
                  {this.state.actionType == "staff_to_role" && <div>


                  <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={8}>
                                          <Card className="card-box  mb-4 p-3 customNoData">
                                            <Grid container>
                                              <Grid item xs={12} md={12} lg={12}>
                                                  <div className="card-header pl-0">
                                                      <div className="card-header--title">
                                                          <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                          Staff Role Mapping
                                                          </h4>
                                                      </div>
                                                  </div>
                                              </Grid>
                                            </Grid>

                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={12} lg={2}>
                                                    <FormControl component="fieldset">
                                                        <FormLabel component="legend" className="pt-2">Select Role:</FormLabel>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={5}>
                                                    <FormControl fullWidth>
                                                        <TextField                        
                                                            id="outlined-select-currency"
                                                            select
                                                            label="Select Type"
                                                            variant="outlined"
                                                            value={this.state.role_name}
                                                            onChange={(event) => this.setState({role_name:event.target.value})}>
                                                            {this.state.RoleMaster.map(option => (
                                                            <MenuItem key={option.name} value={option.id} id={option.name}>
                                                                {option.name}
                                                            </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="autocompleteDiv" >
                                              <Autocomplete
                                                multiple
                                                id="tags-outlined"
                                                options={this.state.StaffToRole}
                                                value={this.state.selectedStaff}
                                                onChange={this.searchStaff} 
                                                getOptionLabel={(option) => option.first_name}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="filter Selected Options"
                                                    placeholder="Favorites"
                                                />
                                                )}
                                            />
                                              </Grid>
                                            </Grid> 

                                            <Grid container spacing={4}>
                                              <Grid item xs={12} md={12} lg={12} className="text-right">
                                                <Button  className="successBtnOutline" variant="outlined" onClick={()=>this.insertStafftoRole()}>Submit</Button>
                                              </Grid>
                                            </Grid> 
                                        
                                          </Card>
                                        </Grid> 
                                      </Grid>

                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={11}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Roles List
                            </h4>
                                </div>
                              </div>
                              <ReactTable
                                 data={this.state.RoleMappingDetails.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        id:original.id,
                                                                        role_name: original.role_name,
                                                                        name: original.name,
                                                                        vehicle_no:original.vehicle_no,
                                                                        emp_code: original.UID,
                                                                        contact: original.contact_no,
                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                            { /* use this button to add a like kind of action */ }
                                                                            
                                                                                {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                    <Button
                                                                                        simple
                                                                                            onClick={() => {this.getRoleData(original.staff_applicable);this.setState({editHolidayPanel:true,title:original.title, startdate:new Date(original.start_date),enddate:new Date(original.end_date),staff_depts:original.staff_applicable,student_standards:original.student_applicable, id_holiday:original.id})}}
                                                                                            color="secondary"
                                                                                            className="edit"
                                                                                            >
                                                                                        <Edit  />
                                                                                    </Button>
                                                                                </Tooltip> */}
                                                                                        
                                                                            {/* use this button to remove the data row */}
                                                                                    
                                                                                <Tooltip id="tooltip-top" title={original.status == "1"  ? "Deactivate":"Activate"} placement="top">
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                        <Switch
                                                                                            checked={original.status == "1" ? true:false}
                                                                                            onChange={() => this.handleMappingDelete(original.id,original.status)}
                                                                                            value="checkedA"
                                                                                        />
                                                                                        }
                                                                                
                                                                                    label=""/>
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
                                                                        Filter: ({filter, onChange}) => (
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
                                                                        Header: "Role Name",
                                                                        accessor: "role_name",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
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
                                                                        Header: "Vehicle No",
                                                                        accessor: "vehicle_no",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
                                                                            <TextField 
                                                                            inputProps={{
                                                                            autoComplete: 'off'
                                                                            }}         
                                                                            id="document-type"   
                                                                            value={filter ? filter.value : ''}
                                                                            placeholder="Search Vehicle No"
                                                                            type="text" 
                                                                            onChange={event => onChange(event.target.value)}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        Header: "Name",
                                                                        accessor: "name",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
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
                                                                        Header: "Employee Code",
                                                                        accessor: "emp_code",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
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
                                                                        Header: "Contact",
                                                                        accessor: "contact",
                                                                        className: "center",
                                                                        Filter: ({filter, onChange}) => (
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
                                                                        Header:"Actions",
                                                                        accessor: "actions",
                                                                        className: "center",
                                                                        sortable: false,
                                                                        filterable: false,
                                                                    }
                                                                ]}
                                                                defaultFilterMethod={filterCaseInsensitive}
                                                                defaultPageSize={10}
                                                                showPaginationTop={false}
                                                                showPaginationBottom={false}
                                                                className="-striped -highlight"
                                                           
                              />
                            </Grid>
                          </Grid>

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/StaffRoleMappingExcel?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                            </Grid>
                          </Grid>
                        </Card>

                      </Grid>
                    </Grid>
                  </div>}
                 
                  {/* fuel usage section */}
                  {this.state.actionType == "fuel_usage" && <div>
                    <Grid container justify="center">
                      <Grid item xs={12} md={12} lg={11}>

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
                                    Fuel Usage 
                                                                    </h4>
                                </div>
                              </div>

                              <ReactTable
                                data={this.state.blocksList.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    vehicle_no: original.vehicle_no,
                                    bill_no: original.no_bill,
                                    total: original.total,

                                    status: original.status,
                                    actions: (
                                      // we've added some custom button actions
                                      <div>
                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Next" placement="top" >
                                          <Button
                                            className="m-2"
                                            simple
                                            onClick={() => this.props.history.push("/admin/add-rooms-to-floors/" + original.id)}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <NextIcon />
                                          </Button>
                                        </Tooltip>

                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Edit" placement="top" >
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
                                        </Tooltip>

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
                                    ),
                                    actionsGo: (<Button variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/fuel-expenses/" + original.id)}>Go</Button>)
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
                                    Header: "Total No Of Bills",
                                    accessor: "bill_no",
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
                                    Header: "Total Amount  Rs.",
                                    accessor: "total",
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
                                    accessor: "actionsGo",
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

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/excelFuelUsage?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear} >Export</Button>

                            </Grid>
                          </Grid>


                        </Card>
                      </Grid>
                    </Grid>
                  </div>}

                  {/* Vehicle maintainance section */}
                  {this.state.actionType == "vehicle_maintainance" && <div>
                    <Grid container justify="center">
                      <Grid item xs={12} md={12} lg={11}>

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
                                    Vehicle Maintainance 
                                                                    </h4>
                                </div>
                              </div>

                              <ReactTable
                                 data={this.state.vehicleMaintainance.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    vehicle_no: original.vehicle_no,
                                    bill_no: original.no_bill,
                                    total: original.total,

                                    status: original.status,
                                    actions: (
                                      // we've added some custom button actions
                                      <div>
                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Next" placement="top" >
                                          <Button
                                            className="m-2"
                                            simple
                                            onClick={() => this.props.history.push("/admin/add-rooms-to-floors/" + original.id)}
                                            color="secondary"
                                            className="edit"
                                          >
                                            <NextIcon />
                                          </Button>
                                        </Tooltip>

                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Edit" placement="top" >
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
                                        </Tooltip>

                                        {/* use this button to remove the data row */}

                                        <Tooltip id="tooltip-top" title={original.status == "1" ? "Deactivate" : "Activate"} placement="top">
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                checked={original.status == "1" ? true : false}
                                                onChange={() => this.handleDeactiveVehicleMaintainance(original.id, original.status)}
                                                value="checkedA"
                                              />
                                            }

                                            label="" />
                                        </Tooltip>
                                      </div>
                                    ),
                                    actionsGo: (<Button variant="contained" color="secondary" onClick={() => this.props.history.push("/admin/vehicle-maintainance/" + original.id)}>Go</Button>)
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
                                    Header: "Total Amount  Rs.",
                                    accessor: "total",
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
                                    Header: "Total No Of Bills",
                                    accessor: "bill_no",
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
                                    accessor: "actionsGo",
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

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/VehicleMaintainanceExcel?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear} >Export</Button>

                            </Grid>
                          </Grid>


                        </Card>
                      </Grid>
                    </Grid>
                  </div>}


                  {/* Vehicle Master section */}
                  {this.state.actionType == "vehicle_master" && <div>

                  <form  onSubmit={this.insertBlock.bind(this)} autoComplete="off">
                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={12}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Add Vehicle
                            </h4>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                          {this.state.roomholders.map((element,index)=>( 
                          <Grid container spacing={4}>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"vehicle_no", event.target.value)}
                                  value={element.vehicle_no}
                                  id="document-type"
                                  label="Vehicle No"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"make_model", event.target.value)}
                                  value={element.make_model}
                                  id="document-type"
                                  label="Make & Model"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"year", event.target.value)}
                                  value={element.year}
                                  id="document-type"
                                  label="Year"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"fuel_type", event.target.value)}
                                  value={element.fuel_type}
                                  id="document-type"
                                  label="Fuel Type"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"insurance_expiry_date", event.target.value)}
                                  value={element.insurance_expiry_date}
                                  id="document-type"
                                  label="Ins Expiry Date"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                              <FormControl fullWidth>
                                <TextField
                                  inputProps={{
                                    autoComplete: 'off',
                                    style: { textTransform: 'capitalize' }
                                  }}
                                  onChange={(event)=>this.handleChangeData(index,"seating_capacity", event.target.value)}
                                  value={element.seating_capacity}
                                  id="document-type"
                                  label="Seating Capacity"
                                  type="search"
                                  variant="outlined" />
                              </FormControl>
                            </Grid>


                          </Grid>
                          ))}
                          {/* <Grid container spacing={4}>
                        <Grid item xs="12" md={12} lg={4}>
                      
                          </Grid> */}
                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={10} className="text-right">
                              <Button className="m-2" variant="contained" color="default" onClick={() => this.resetClass()}>Reset</Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} className="text-left">
                              <Button className="m-2" variant="contained" color="secondary" onClick={() => this.insertBlock()}>Submit</Button>
                            </Grid>
                          </Grid>
                          
                          {/* </Grid> */}
                        </Card>
                      </Grid>
                    </Grid>
                  </form>

                    <Grid container spacing={4} justify="center">
                      <Grid item xs={12} md={12} lg={11}>
                        <Card className="card-box  mb-4 p-3 customNoData">
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                              <div className="card-header pl-0">
                                <div className="card-header--title">
                                  <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                    Vehicle Details
                            </h4>
                                </div>
                              </div>
                              <ReactTable
                                data={this.state.VehicleMaster.map((original, key) => {
                                  return ({
                                    slno: key + 1,
                                    id: original.id,
                                    vehicle_no: original.vehicle_no,
                                    make_model: original.make_model,
                                    year: original.year,
                                    fuel_type: original.fuel_type,
                                    insurance_expiry_date: original.insurance_expiry_date,
                                    seating_capacity: original.seating_capacity,
                                    editable: original.editable,
                                    actions: (
                                      // we've added some custom button actions
                                      <div>


                                        { /* use this button to add a like kind of action */}

                                        <Tooltip id="tooltip-top" title="Edit" placement="top" >
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
                                        </Tooltip>

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
                                        placeholder="Search Vehicle No"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Make & Model",
                                    accessor: "make_model",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Make & Model"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Year",
                                    accessor: "year",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search year"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Fuel Type",
                                    accessor: "fuel_type",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Fuel Type"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Ins Expire Date",
                                    accessor: "insurance_expiry_date",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Ins Expire Date"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
                                  },
                                  {
                                    Header: "Seating Capacity",
                                    accessor: "seating_capacity",
                                    className: "center",
                                    Filter: ({ filter, onChange }) => (
                                      <TextField
                                        inputProps={{
                                          autoComplete: 'off'
                                        }}
                                        id="document-type"
                                        value={filter ? filter.value : ''}
                                        placeholder="Search Seating Capacity"
                                        type="text"
                                        onChange={event => onChange(event.target.value)}
                                      />
                                    ),
                                    Cell: this.renderEditable
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
                                showPaginationTop={false}
                                showPaginationBottom={false}
                                className="-striped -highlight"
                              />
                            </Grid>
                          </Grid>

                          <Grid container className="mt-2">
                            <Grid item xs={12} sm={12} md={12} className="text-right">
                              <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/VehicleMasterExcel?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
                            </Grid>
                          </Grid>
                        </Card>

                      </Grid>
                    </Grid>
                  
                  </div>}

                    {/* Staff Overview section */}
                    {this.state.actionType == "staff_overview" && <div>




<Grid container spacing={4} justify="center">
  <Grid item xs={12} md={12} lg={11}>
    <Card className="card-box  mb-4 p-3 customNoData">
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <div className="card-header pl-0">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
              Staff Allocation
        </h4>
            </div>
          </div>
          <ReactTable
            data={this.state.StaffOverview.map((original, key) => {
              return ({
                slno: key + 1,
                id: original.id,
                vehicle_no: original.vehicle_no,
                role_name: original.role_name,
                name: original.name,
                emp_code: original.UID,
                contact_no: original.contact_no,
               
                actions: (
                  // we've added some custom button actions
                  <div>


                    { /* use this button to add a like kind of action */}

                    {/* <Tooltip id="tooltip-top" title="Edit" placement="top" >
                      {original.editable ? <Button
                        className="m-2"
                        // simple
                        onClick={() => { this.setState({ selectedHeading: original.name }); this.updateHeading(original.id, key); }}
                        color="secondary"
                        className="edit"
                      >
                        <CheckCircleOutline />
                      </Button> : <Button
                        className="m-2"
                        // simple
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
                            onChange={() => this.handleDeactiveStaffOverview(original.id, original.status)}
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
                    placeholder="Search Vehicle No"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              // {
              //   Header: "Route Name",
              //   accessor: "route_name",
              //   className: "center",
              //   Filter: ({ filter, onChange }) => (
              //     <TextField
              //       inputProps={{
              //         autoComplete: 'off'
              //       }}
              //       id="document-type"
              //       value={filter ? filter.value : ''}
              //       placeholder="Search Route Name"
              //       type="text"
              //       onChange={event => onChange(event.target.value)}
              //     />
              //   )
              // },
              {
                Header: "Role Name",
                accessor: "role_name",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Role Name"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Name",
                accessor: "name",
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
                )
              },
              {
                Header: "Emp Code",
                accessor: "emp_code",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Emp Code"
                    type="text"
                    onChange={event => onChange(event.target.value)}
                  />
                )
              },
              {
                Header: "Contact No",
                accessor: "contact_no",
                className: "center",
                Filter: ({ filter, onChange }) => (
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    id="document-type"
                    value={filter ? filter.value : ''}
                    placeholder="Search Contact No"
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
            showPaginationTop={false}
            showPaginationBottom={false}
            className="-striped -highlight"
          />
        </Grid>
      </Grid>

      <Grid container className="mt-2">
        <Grid item xs={12} sm={12} md={12} className="text-right">
          <Button className="m-2" variant="contained" color="secondary" href={Config.url+"/TransportationMasters/StaffOverviewExcel?id_institute="+this.props.data.selectedInstitutionId+"&id_board="+this.state.selectedBoard+"&id_academicyear="+this.state.selectedAcademicYear}>Export</Button>
        </Grid>
      </Grid>
    </Card>

  </Grid>
</Grid>
</div>}

{/* staff_to_vehicle */}
 
  {this.state.actionType == "staff_to_vehicle" && <div>
                                        <Grid container spacing={0} justify="center" className="sliderDiv">
                                          {this.state.StaffToVehicle.map((element, key) => (
                                            <Grid item xs={12} sm={12} lg={7}>
                                                <div className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-start mb-3 p-3 text-center">
                                                    <Grid container spacing={2} justify="center">
                                                        {/* <Grid item xs={12} sm={12} lg={3}>
                                                            <h5>{key + 1}</h5>
                                                            <div><small>{element.block_name}</small></div>
                                                        </Grid> */}
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Grid container spacing={1} justify="center">
                                                                <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.vehicle_no}</h5>
                                                                    <div><small>Vehicle No</small></div>
                                                                </Grid>
                                                                {/* <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.no_of_rooms}</h5>
                                                                    <div><small>Route Name</small></div>
                                                                </Grid> */}
                                                                {/* <Grid item xs={12} sm={12} lg={3}>
                                                                    <h5>{element.no_of_beds}</h5>
                                                                    <div><small>Allocated Staffs</small></div>
                                                                </Grid> */}
                                                            
                                                                <Grid item xs={12} sm={12} lg={2} justify="center">  
                                                                    <Button variant="contained" color="secondary" onClick={()=>this.props.history.push("/admin/staff-to-vehicle/"+element.id)}>Go</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                          ))}
                                        </Grid>
                                    </div>}

                                    {/* Rostering */}

                                    {this.state.actionType == "rostering" && <div>
                                    
                                    <Grid container spacing={4} justify="center">
                                        <Grid item xs={12} md={12} lg={11}>
                                            <Card className="card-box  mb-4 p-3">
                                                <Grid container>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <div className="card-header pl-0">
                                                            <div className="card-header--title">
                                                                <h4 className="font-size-lg mb-0 ml-0 pb-2 font-weight-bold">
                                                                Rostering
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        
                                                        <Grid container spacing={4}>
                                                            <Grid item xs={12} md={12} lg={12}>
                                                            <ReactTable
                                                                data={this.state.monthDetails.map((original,key) => {
                                                                    return ({
                                                                        slno: key+1,
                                                                        month:original.month,
                                                                        processed:'Yes',

                                                                        actions: (
                                                                            // we've added some custom button actions
                                                                            <div>
                                                                                        
                                                                                { /* use this button to add a like kind of action */ }

                                                                                <Tooltip id="tooltip-top" title="View" placement="top" >
                                                                                <Button
                                                                                    className="m-2"
                                                                                    simple
                                                                                    onClick={()=>this.props.history.push("/admin/rostering/"+original.month_id)}
                                                                                    color="secondary"
                                                                                    className="view"
                                                                                    >
                                                                                    <VisibilityIcon/>
                                                                                    </Button> 
                                                                                </Tooltip>

                                                                                { /* use this button to add a like kind of action */ }

                                                                                <Tooltip id="tooltip-top" title="Edit" placement="top" >
                                                                                <Button
                                                                                    className="m-2"
                                                                                    simple
                                                                                    onClick={()=>this.props.history.push("/admin/rostering/"+original.month_id)}
                                                                                    color="secondary"
                                                                                    className="edit"
                                                                                    >
                                                                                    <EditIcon/>
                                                                                    </Button> 
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
                                                                filterable: false
                                                            },
                                                            {
                                                                Header: "Month",
                                                                accessor: "month",
                                                                className: "center",
                                                                filterable: false
                                                            },
                                                            {
                                                                Header: "Processed?",
                                                                accessor: "processed",
                                                                className: "center",
                                                                filterable: false
                                                            },
                                                            {
                                                                Header:"Actions",
                                                                accessor: "actions",
                                                                className: "center",
                                                                sortable: false,
                                                                filterable: false,
                                                            }
                                                            ]}
                                                            defaultFilterMethod={filterCaseInsensitive}
                                                            defaultPageSize={10}
                                                            showPaginationTop={false}
                                                            showPaginationBottom={false}
                                                            className="-striped -highlight"
                                                            />
                                                            </Grid>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>

                                            </Card>

                                        </Grid>
                                    </Grid>
                                </div>}
                                
                                





                  {/* End sections   */}
                </Grid>

              </Grid>

            </div>
          </Animated>
        </Dialog>

      </Fragment>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToPros)(FleetManagement);
