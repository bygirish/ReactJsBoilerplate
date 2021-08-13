import React, { Fragment } from 'react';
import AddViewAssignment from '@components/Admin/AcademicSection/AddViewAssignment';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

class Assignments extends React.Component {
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
            <AddViewAssignment title={this.headerTitle}  {...this.props} />
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(Assignments);