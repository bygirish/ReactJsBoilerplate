import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Search from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Avatar from '@material-ui/core/Avatar';
class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };
  static defaultProps = {
    suggestions: []
  };
  constructor(props) {
    super(props);
    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown 
      showSuggestions: false,
      // What the user has entered
      userInput: this.props.value ? this.props.value : ""
    };
  }
  onChange = e => {
    
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    if(userInput == ""){
      this.props.onSelected(userInput); 
    }
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.name.toString().toLowerCase().indexOf(userInput.toString().toLowerCase()) > -1
    );
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };
  onRoomChange = e => {
   
    const { suggestions } = this.props;

    const userInput = e.currentTarget.value;
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.value.toString().toLowerCase().indexOf(userInput.toString().toLowerCase()) > -1
    );
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };
  staffOnChange = e => {

    const { suggestions } = this.props;
    
    const userInput = e.currentTarget.value;
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.first_name.toString().toLowerCase().indexOf(userInput.toString().toLowerCase()) > -1
    );
  
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };
  onClick = (suggestion) => {
    this.props.onSelected(suggestion);    
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: this.props.showValue && this.props.showValue == true ? suggestion.name+" "+suggestion.last_name+" - "+suggestion.standard_name+" "+suggestion.section_name : ""
    });
  };
  
  onStaffClick = (suggestion) => {
    this.props.onSelected(suggestion);    
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: this.props.showValue && this.props.showValue == true ? suggestion.first_name+" "+suggestion.middle_name+" "+suggestion.last_name+" - "+suggestion.designation_data : ""
    });
  };

  onRoomClick = (suggestion) => {
    this.props.onSelected(suggestion);    
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: this.props.showValue && this.props.showValue == true ? suggestion.value:""
    });
  };
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;
   
    // User pressed the enter key
    if (e.keyCode === 13) {  
      this.props.onSelected(filteredSuggestions[activeSuggestion]); 
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: ""
      });
     
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  renderOnchange = (e) => {
    
    if(this.props.type == "student") {
     return this.onChange(e);
    } 
    else if(this.props.type == "staff" || this.props.type == "alumni"){
      return this.staffOnChange(e);
    } 
    else if(this.props.type == "room"){
      return this.onRoomChange(e);
    }
  }
  render() {
    const {
      onChange,
      staffOnChange,
      onClick,
      onStaffClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
            <div className="searchResultsDiv">
            <div className="searchResultsInnerDiv">
            <div className="xtSCL"></div>
            <ul className="searchResultsList">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
                
                if (index === activeSuggestion) {
                  className = "option-active";  
                }
                if(this.props.type == "student" || this.props.type == "alumni" ){
                  var matches = suggestion.name.match(/\b(\w)/g); 
                var acronym = matches.join('');
                  return (
                    <li className={"sbre   py-1 "+className} onClick={()=>this.onClick(suggestion)}>
                    <div className="searchListContainer pickerGrid">
                    {(index == 1 || index == 3 || index == 5) ?   <div className="searchImageDiv" style={{backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm20E4GcRluz0LGSYfsx-I9LaCxO_EoLggPn0DK5s&s=10)"}}></div> :   <div className="searchImageDiv"><Avatar>{acronym.toUpperCase()}</Avatar></div>}
                    <div className="searchOptionDiv">
                    <div className="sbl1 font-weight-400"><span>{suggestion.name+" "+suggestion.last_name+" - "+suggestion.standard_name+" "+suggestion.section_name}</span></div>
                    <div className="sbl2" ><span>{suggestion.father_name+" "+suggestion.father_last_name+" - "+suggestion.father_phone_no+" - "+suggestion.UID }</span></div>
                    
                    </div>
                    </div>
                  </li>
                  );
                }
               else if(this.props.type == "room"){
                  var matches = suggestion.value.match(/\b(\w)/g); 
                var acronym = matches.join('');
                  return (
                    <li className={"sbre   py-1 "+className} onClick={()=>this.onRoomClick(suggestion)}>
                    <div className="searchListContainer pickerGrid">
                    <div className="searchOptionDiv">
                    <div className="sbl1 font-weight-400"><span>{suggestion.value}</span></div>
                    </div>
                    </div>
                  </li>
                  );
                }
                else{
                  var matches = suggestion.first_name.match(/\b(\w)/g); 
                var acronym = matches.join('');
                  return (
                    <li className={"sbre "+className} onClick={()=>this.onStaffClick(suggestion)}>
                    <div className="searchListContainer pickerGrid">
                    {(index == 1 || index == 3 || index == 5) ?   <div className="searchImageDiv" style={{backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm20E4GcRluz0LGSYfsx-I9LaCxO_EoLggPn0DK5s&s=10)"}}></div> :   <div className="searchImageDiv"><Avatar>{acronym.toUpperCase()}</Avatar></div>}
                    <div className="searchOptionDiv">
                    <div className="sbl1"><span>{suggestion.first_name+' '+suggestion.middle_name+' '+suggestion.last_name}</span></div>
                    <div className="sbl2" ><span>{suggestion.designation_data}</span></div>
                    </div>
                    </div>
                  </li>
                  );
                }
            
              })} 
            </ul>
            </div>
            </div>          
          );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions!</em>
          </div>
        );
      }
    }
    return (
      <div>
        {this.props.view && this.props.view == "custom" ?
          <FormControl fullWidth>
            <TextField 
            inputProps={{
            autoComplete: 'off',
            style: {textTransform: 'capitalize'} 
            }}
            placeholder={this.props.SearchPlaceholderText}
            onChange={(e)=>this.renderOnchange(e)}
            onKeyDown={this.onKeyDown}
            value={this.state.userInput}
            id="student-list"   
            type="search" 
            variant="outlined" required/>
        </FormControl>
        :
          <div className={this.state.userInput.length > 0 ? "searchDiv  SearchFocus": "searchDiv"} style={{borderBottomLeftRadius: (this.state.userInput.length && this.state.filteredSuggestions.length) > 0 ? 0 : 24 ,  borderBottomRightRadius: (this.state.userInput.length && this.state.filteredSuggestions.length) > 0 ? 0 : 24 }}>
                  <div className="searchStep1">
                    <div className="searchIconDIv">
                      <div className="searchIconDivChild">
                        <span className="searchIconSpan">
                          <Search />
                        </span>
                      </div>
                    </div>
                    <div className="searchInputDiv">
                    <input className="searchInput" maxlength="2048"  placeholder={this.props.SearchPlaceholderText}
                    onChange={(e)=>this.renderOnchange(e)}
                    onKeyDown={this.onKeyDown}
                   value={this.state.userInput} type="search" aria-autocomplete="off" aria-haspopup="false" autocapitalize="off" autocomplete="off" autocorrect="off" />
                    </div>
                    <div className="searchMicDiv">
                      <div className="searchMicInnerDiv">

                      </div>
                    </div>
                  </div>
                  
              </div>
              }

        {suggestionsListComponent}
      </div>
    );
  }
}
export default Autocomplete;
