import React, { Fragment } from 'react';
import SendViewMessage from '../../../components/Admin/Communication/SendViewMessage';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

class MessageCenter extends React.Component {
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
     
     
            <SendViewMessage title={this.headerTitle}  {...this.props} />

    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(MessageCenter);