import React, { Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Dialog,Grid,Chip,FormControlLabel,FormControl,IconButton,Typography,AppBar,Divider,Card,CardContent,Fab,CardActions,TextField,Button,ButtonGroup,Box,Avatar,List,ListItem,Slide,Checkbox,RadioGroup,Radio,InputAdornment,MenuItem,Tooltip} from '@material-ui/core';
import Service from '@utils/Service';

export default class StandardSections extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      allChecked:false,
     standardSections:[],
     selectSections:[],
     filterSections:[],
     selectedStandardId:this.props.mappedStandard && this.props.mappedStandard!=''?this.props.mappedStandard:'',
    };

  }

  searchSections = (value) => {
    const filteredSuggestions = this.state.sectionSuggestions.filter(
      (suggestion) =>
      String(suggestion.standard_name+' '+suggestion.stream_name+' '+suggestion.section_name).toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.setState({ filterSections:filteredSuggestions});
  }  

  handleAll = () => {
    let lstdsections = this.state.selectSections;
    lstdsections.map((element,index)=>{
      lstdsections[index].checked = this.state.allChecked ? false:true;
      element.standards.map((sections,sindex)=>{
        lstdsections[index].standards[sindex].checked = this.state.allChecked ? false:true;
      });  
    }); 
    this.setState({selectSections:lstdsections, allChecked:!this.state.allChecked});
    this.renderSelectedSections();
  }

  handleStandard = (standard_id,index,status) => {
    let lstdsections = this.state.selectSections;
    lstdsections.map(element=>{
       if(element.standard_id == standard_id){
         lstdsections[index].checked = !status;
         element.standards.map((sections,sindex)=>{
           lstdsections[index].standards[sindex].checked = !status;
         });  
       }
    }); 
    let total=0;
    let checked=0;
    lstdsections.map(ele=>{
      total++;
      if(ele.checked == true){
        checked++;
      }
    })
    if(total == checked){
      this.setState({selectSections:lstdsections, allChecked:true});
    }
    else{
      this.setState({selectSections:lstdsections,allChecked:false});
    }
   
    this.renderSelectedSections();
  }

 
  handleSection = (section_id,index,sindex,status) => {
    let lstdsections = this.state.selectSections;
    lstdsections[index].standards[sindex].checked = !status;
    let total_sections = lstdsections[index].standards.length;
    let checked_count = 0;
    lstdsections[index].standards.map((sections)=>{
      if(sections.checked == true){
        checked_count++;
      }
    });
    if(checked_count == total_sections){
      lstdsections[index].checked = true;
    }
    else{
      lstdsections[index].checked = false;
    }
    let total=0;
    let checked=0;
    lstdsections.map(ele=>{
      total++;
      if(ele.checked == true){
        checked++;
      }
    })
    if(total == checked){
      this.setState({selectSections:lstdsections, allChecked:true});
    }
    else{
      this.setState({selectSections:lstdsections, allChecked:false});
    }
    this.renderSelectedSections();
    
   }

   handleSingleSection = (section_id,section_name) => {
     this.props.onSelected(section_id,section_name);
   }

   renderSelectedSections = () => {
    let lstdsections = this.state.selectSections;
    let selected=[];
    lstdsections.map(element=>{
        element.standards.map((sections,sindex)=>{
            if(sections.checked == true){
              selected.push({id:sections.section_id, name:sections.standard_name+" "+sections.section_name});
            }
        });
   });
  //  if(selected.length > 0){
  //   selectedSections = selected.join(',');
  //   selectedSectionIds = selectedids;
  //  }
  // this.getSubjectDetails(thselectedSectionsIds);
  this.props.onSelected(selected);
  }

  getStandardSectionDetails() {

    let mapped = this.props.mappedstandards; 
    
    let mappedSections = this.props.selectedSections; 
    // console.log({mappedSections});
    
    let filterStandards = this.props.filterStandards; 
    //console.log('section'+filterStandards)
    const postData = {
      count: this.props.viewcount,
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      token:"abc",
      id_user: this.props.data.UID,
      id_academicyear:this.props.data.selectedAcademicId,
      id_board:this.props.data.selectedBoardId
    };
    //console.log('postdata'+postData);return false;
    new Service().apiCall('ClassDetails/getData',postData).then(response => {    
      // console.log({response});   
      if (response.status==200 && response.data!='') {
        let newArray = [];
         if(this.props.viewMapped){
           newArray = response.data.filter(x => x.active_student_count >= 0);
         }
         else{
          newArray = response.data;
        } 
       
        var lStandardSections = [];
        let responseData = [];
        var filterData = [];
        if(filterStandards){
        response.data.forEach(element => {
          if (filterStandards.some(stdid => stdid.id === element.section_id)) {
            filterData.push(element);
          }
        });
        responseData = filterData;
      }
      else{
        responseData = response.data;
      }


      responseData.forEach(element => {
        if(lStandardSections[element.standard_id]){
            var lSection = {};
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            lSection.assignment_count = element.assignment_count;
            if(this.props.viewcount == "student"){
              lSection.count = element.active_student_count;              
            }
            else{
              lSection.count = element.count;
            }
            lSection.count = element.count;
            lSection.board_id = element.board_id;
            if(mapped){

              if (mapped.some(stdid => stdid.id === element.section_id)) {
                lSection.checked = true;
              }
              else{
                lSection.checked = false;
              }
            }
          

            if(mappedSections){

              if (mappedSections.includes(element.section_id)) {
                lSection.checked = true;
              }
              else{
                lSection.checked = false;
              }
            }          
           
            lStandardSections[element.standard_id].standards.push(lSection);
        
          }else{
            var lStandard = {};
            var lSection = {};
            lStandard.standard_name = element.standard_name;
            lStandard.standard_id = element.standard_id;
            
            
            if(mapped){    
              if (mapped.some(stdid => stdid.id === element.section_id)) {
                lSection.checked = true;
                lStandard.checked = true;
              }
              else{
                lSection.checked = false;
                lStandard.checked = false;
              }              
            }
           
            if(mappedSections){

              if (mappedSections.includes(element.section_id)) {
                lSection.checked = true;
                lStandard.checked = true;
              }
              else{
                lSection.checked = false;
                lStandard.checked = false;
              }
            }
           
            lSection.section_id = element.section_id;
            lSection.section_name = element.section_name;
            lSection.standard_id = element.standard_id;
            lSection.standard_name = element.standard_name;
            lSection.all_subject_count = element.all_subject_count;
            if(this.props.viewcount == "student"){
              lSection.count = element.active_student_count;
            }
            else{
              lSection.count = element.count;
            }
            lSection.assignment_count = element.assignment_count;
            lSection.count = element.count;
            lSection.board_id = element.board_id;
            lStandard.standards = new Array();
            lStandard.standards.push(lSection);
            lStandardSections[element.standard_id] = lStandard;   

            
        }
      }); 

        let total = 0;
        newArray.map((el)=>{
          total = total + parseInt(el.active_student_count);
        })
        this.props.totalStudentCount && this.props.totalStudentCount(total);
        let totalcnt=0;
        let checkedcnt=0;
        lStandardSections.map(ele=>{
          totalcnt++;
          if(ele.checked == true){
            checkedcnt++;
          }
        })
        if(totalcnt == checkedcnt){
          this.setState({allChecked:true});
        }
        else{
          this.setState({allChecked:false});
        }
        this.setState({ standardSections:lStandardSections, selectSections:lStandardSections, filterSections:newArray,sectionSuggestions:newArray, totalStudentCount:total});
        // console.log('class'+JSON.stringify(this.state.filterSections));
      }
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    this.getStandardSectionDetails();
   
    
  }
  render() {
    const { classes } = this.props;
    if(this.props.type == "card"){
    return (
      <div>
        {/* {this.state.alert}
        <GridContainer>
        {this.state.standardSections.length > 0 && this.state.standardSections.map((element, index) => (
           <GridItem xs={12} sm={6} md={4} lg={4}>
           <Card profile>
          <CardAvatar style={{marginTop:'-30px',left:0,bottom:0, justifyContent: 'center', alignItems: 'center'}}>
          <div className={classes.upperheader}  style={{textTransform:'uppercase',fontSize:'15px',fontWeight:'bold',}}> <Button  color="primary" style={{fontSize:'20px', borderRadius:6}}>
                  {element.standard_name}
          </Button></div>
          </CardAvatar>
          <CardBody profile style={{marginTop:0}}>
          <GridContainer style={{textAlign:'center'}}> 
          {element.standards.map(sections => (
          <GridItem style={{width:100/element.standards.length+'%',cursor:'pointer'}}>
            <a onClick={ () => this.props.handleSelectedSection(sections.section_id) }><h4 className={classes.cardTitle} style={{cursor:'pointer',fontWeight:'bold'}}>{sections.section_name}</h4><h4 className={classes.cardTitle} style={{cursor:'pointer',fontWeight:'bold'}}>{sections.count}</h4></a>
            </GridItem>
          ))} 
          </GridContainer>

          </CardBody>
        </Card>
      </GridItem>
      ))}
        </GridContainer>    */}
        </div> 
    );
    }
    else if(this.props.type == "sidebar"){
      return(
        <PerfectScrollbar>
        <div style={{width:'100%',maxHeight:450}}>
         
              <ListItem>
              <FormControl fullWidth>
              <TextField 
                    inputProps={{
                    autoComplete: "off"
                    }}
                    id="document-type"   
                    label="Search" 
                    onChange={(event) =>  this.searchSections(event.target.value)}
                    className="m-2"
                    />
              </FormControl>      
              </ListItem>
        {this.state.filterSections.map(sections => (
              <ListItem button className={!this.props.active && this.state.selectedStandardId == sections.section_id ?"my-2 activeSidebarColor":"my-2"} onClick={ () => {this.props.handleSelectedSection(sections.section_id, sections.standard_name+" "+sections.stream_name+" "+sections.section_name); this.setState({selectedStandardId:sections.section_id})}}>
              <span>{sections.standard_name} {sections.stream_name} {sections.section_name}</span>
              {this.props.showBadge && this.props.showBadge == true && <span className="ml-auto badge badge-warning">{sections.active_student_count ? sections.active_student_count : sections.count}</span>}
            </ListItem>
    ))}   
          </div>
          </PerfectScrollbar>
      )
    }
    else if(this.props.type == "dropdown"){
      return(
        <FormControl fullWidth>
        <TextField
                className="m-1"
                id="outlined-select-currency"
                select
                required
                label="Select Standard"
                value={this.state.selectedStandardId}
                onChange={(event, child) => {this.setState({selectedStandardId:child.props.id});this.props.handleDropdown(child.props.id)}}
                variant="outlined">
                {this.state.filterSections.map(option => (
                  <MenuItem key={option.section_id} name={option.section_id} id={option.section_id} value={option.section_id}>
                    {option.standard_name} {option.stream_name} {option.section_name}
                  </MenuItem>
                ))}
              </TextField>
         </FormControl>
      )
    }
    // else if(this.props.type == "radio"){
    //   return (
    //    <div>
     
    //      {this.state.selectSections.length > 0 && this.state.selectSections.map((element, index) => (
    //                   <GridContainer  className="customRadioStyle">
    //                         <GridItem xs={12} sm={10} md={3}>
    //                   <div className={classes.inlineChecks} style={{fontWeight:400, color:'black'}}>
    //                   {element.standard_name}
    //                     </div> 
    //                     </GridItem>
    //                     {element.standards.map((sections,sindex) => (
    //                       <GridItem xs={12} sm={10} md={3}>
    //                      <FormControlLabel  control={<Radio checked={false} onClick={()=>this.props.handleStandardSelected()} />} label={sections.section_name} />
    //                         </GridItem>
    //                     ))} 
    //                     </GridContainer>
    //                 ))}

              
    //  </div>
    //   )
    // }
    else if(this.props.type == "sections"){
      return (
       <div className="w-100 p-4">
          <Grid container spacing={2}>
            
       
         {this.state.selectSections  && this.state.selectSections.map((element, index) => (
                       <Grid container >
               
                        {element.standards.map((sections,sindex) => (
                          <Grid xs={12} sm={10} md={3} lg={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                disabled = {(this.props.disable && this.props.disable == true) ? true:false }
                                  tabIndex={-1}
                                  checked={sections.checked}
                                  onClick={() => this.handleSingleSection(sections.section_id,element.standard_name+" "+sections.section_name)}
                                />
                              }
                              label={element.standard_name+" "+sections.stream_name+sections.section_name}
                            />
                           {this.props.showCount && this.props.showCount == true &&     <Chip size="small" variant="outlined" color="secondary" label={sections.active_student_count ? sections.active_student_count : sections.count} />}
                            </Grid>
                        ))} 
                        </Grid>
                    ))}

           </Grid>   
     </div>
      )
    }
    else{
      return (
       <div className="w-100 p-4">
          <Grid container spacing={2}>
            <Grid xs={12} sm={10} md={12} lg={12}>
            <FormControlLabel
                          control={
                            <Checkbox
                              disabled = {(this.props.disable && this.props.disable == true) ? true:false }
                              onClick={()=> this.handleAll()}
                              tabIndex={-1}
                              checked={this.state.allChecked}
                            />
                          }
                         
                          label={this.props.label? this.props.label:"Select All"}
                        />
            </Grid>
       
         {this.state.selectSections  && this.state.selectSections.map((element, index) => (
                       <Grid container >
                        <Grid xs={12} sm={10} md={3} lg={3}>
                        <FormControlLabel
                          control={
                            <Checkbox
                            disabled = {(this.props.disable && this.props.disable == true) ? true:false }
                              tabIndex={-1}
                              checked={element.checked}
                              onClick={() => {this.setState({selectedOverlayStandard:index});this.handleStandard(element.standard_id,index,element.checked)}}
                        
                            />
                          }
                          label={element.standard_name}
                        />
                        </Grid>
                        {element.standards.map((sections,sindex) => (
                          <Grid xs={12} sm={10} md={3} lg={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                disabled = {(this.props.disable && this.props.disable == true) ? true:false }
                                  tabIndex={-1}
                                  checked={sections.checked}
                                  onClick={() => this.handleSection(sections.section_id,index,sindex,sections.checked)}
                                />
                              }
                              label={sections.section_name}
                            />
                           {this.props.showCount && this.props.showCount == true &&     <Chip size="small" variant="outlined" color="secondary" label={sections.active_student_count ? sections.active_student_count : sections.count} />}
                            </Grid>
                        ))} 
                        </Grid>
                    ))}

           </Grid>   
     </div>
      )
    }
  }
}

