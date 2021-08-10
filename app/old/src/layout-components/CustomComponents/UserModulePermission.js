import React from "react";
import {Animated} from "react-animated-css";
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
// @material-ui/icons
import NavigateNext from "@material-ui/icons/NavigateNext";
import Service from 'utils/Service';
import  "assets/custom.scss";
export default class ChildMenu extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
     can_view:0,
     can_create:0,
     can_edit:0,
     can_delete:0,
     can_export:0
    };
  }

  modulePermission = () => {
    
      if (this.props.data.module_permissions) {
        this.props.data.module_permissions.forEach(element => {
      
      if(element.child && this.props.module_name == element.name){
      
      return  this.props.handlePermission(element.can_view,element.can_create,element.can_edit,element.can_delete,element.can_export)
      }
    });
  }
  else{
    this.setState({childMenu: []}); 
  }
  }

  renderPage = (page) => {  
    this.props.history.push({
      pathname: '/admin'+page,
    })
  }

  componentDidMount() {
    this.modulePermission();
  }
  render() {
    const { classes } = this.props;
    return this.modulePermission();
    
  }
}

