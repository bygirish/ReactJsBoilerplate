import React, { Fragment } from 'react';
import AddViewQuestionpaper from '@components/Admin/AcademicSection/QuestionBank/AddViewQuestionpaper';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

class QuestionBank extends React.Component {
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
            <AddViewQuestionpaper title={this.headerTitle}  {...this.props} />
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(QuestionBank);