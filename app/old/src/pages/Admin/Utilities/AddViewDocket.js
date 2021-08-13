import React, { Fragment } from 'react';
import AddViewDocket from '@components/Admin/Utilities/AddViewDocket';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

class DocumentManagement extends React.Component {
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
     
     
            <AddViewDocket title={this.headerTitle}  {...this.props} />

    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(DocumentManagement);