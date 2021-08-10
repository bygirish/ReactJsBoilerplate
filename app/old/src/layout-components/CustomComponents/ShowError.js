import React, { Fragment } from "react";
import {Animated} from "react-animated-css";
import {Dialog,Grid,Switch,FormControlLabel,IconButton,Typography,AppBar,Toolbar,Card,CardContent,Fab,TextField,Button,Avatar,List,ListItem,Slide,FormControl,Checkbox} from '@material-ui/core';
// @material-ui/icons
import NavigateNext from "@material-ui/icons/NavigateNext";
import Service from 'utils/Service';
import  "assets/custom.scss";
export default class ShowError extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showError = (message,status) => {
   console.log(123);
    this.setState({
      basicNotify: (
        <Dialog open={true}>
      <div className="text-center p-5">
        <h4 className="font-weight-bold">{message}</h4>
      </div>
    </Dialog>
      ),
    });
       setTimeout(() => {
         this.setState({ basicNotify:false});
        if(status == 401){
          this.props.removeUserData();
          this.props.history.push("/login");
        }
       }, 2000)
  }


  componentDidMount() {
    console.log(this.props);
    if(this.props.responseCode == 500 && this.props.responseData!=""){
      this.showError(this.props.responseData,this.props.responseCode)
    }
    else if(this.props.responseCode == 401){
      this.showError('Invalid Auth token. Redirecting to login',this.props.responseCode)
    }
  }
  render() {
    console.log(this.props);
    const { classes } = this.props;
    return (
      <Fragment>
      {this.state.basicNotify}
      </Fragment>
      )
    
  }
}

