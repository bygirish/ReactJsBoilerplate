import React, { Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { Grid,IconButton,Typography,AppBar,Toolbar,Dialog,Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewPreadmissionApplication from '@components/Admin/Demography/ViewPreadmissionApplication';
import { connect } from 'react-redux';
import {Animated} from "react-animated-css";
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

class ViewApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
      dialogOpen:true
    }
    }

    headerTitle = (title) => {
      this.setState({title:title})
    }
  render(){
  return (
    <Fragment>
      <Dialog fullScreen open={this.state.dialogOpen} className="bgColor" onClose={()=>this.setState({dialogOpen:false})} TransitionComponent={Transition}>
      <AppBar className="app-header" color="secondary" position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/application-assessment")} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h4">
              View Application Lists
            </Typography>
           
          </Toolbar>
        </AppBar>
        <Animated  animationIn="slideInRight" animationOut="slideOutLeft">   
          <div  className="pt-100">   
                <ViewPreadmissionApplication title={this.headerTitle}  {...this.props} />
          </div>
        </Animated>
      </Dialog>
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(ViewApplication);