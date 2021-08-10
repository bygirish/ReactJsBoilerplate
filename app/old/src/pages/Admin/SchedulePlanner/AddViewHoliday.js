import React, { Fragment } from 'react';
import AddViewDailydiary from '../../../components/Admin/SchedulePlanner/AddViewHolidays';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

class Holidays extends React.Component {
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
            <AddViewDailydiary title={this.headerTitle}  {...this.props} />
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(Holidays);