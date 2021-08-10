import React, { Fragment } from 'react';
import ApplicationAssessment from '../../../components/Admin/Demography/ApplicationAssessment';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

class Preadmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
    
    }
    }

    headerTitle = (title) => {
      this.setState({title:title})  
    }
  render(){
  return (
    <Fragment>
            <ApplicationAssessment title={this.headerTitle}  {...this.props} />
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(Preadmission);