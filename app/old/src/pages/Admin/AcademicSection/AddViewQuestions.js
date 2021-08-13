import React, { Fragment } from 'react';
import AddViewQuestions from '@components/Admin/AcademicSection/QuestionBank/AddViewQuestions.js';
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
            <AddViewQuestions title={this.headerTitle}  {...this.props} />
    </Fragment>
  );
  }
}
export default connect(mapStateToProps, mapDispatchToPros)(QuestionBank);