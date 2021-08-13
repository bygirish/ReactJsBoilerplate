import React from "react";
import {Animated} from "react-animated-css";
import {Grid,Card,Fab} from '@material-ui/core';
// @material-ui/icons
import NavigateNext from "@material-ui/icons/NavigateNext";
import  "@assetss/custom.scss";
export default class ChildMenu extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
     childMenu:[],
    };
  }

  renderChildMenu = () => {
      if (this.props.data.module_permissions) {
        this.props.data.module_permissions.forEach(element => {
      if(element.child && this.props.route == element.path){
        this.setState({childMenu: element.child.filter(v=>v.can_view == "1")});
      }
    });
  }
  else{
    this.setState({childMenu: []}); 
  }
  }

  renderPage = (page) => {  
    this.props.history.push({
      pathname: '/admin'+page,
    })
  }

  componentDidMount() {
    this.renderChildMenu();
  }
  render() {
    const { classes } = this.props;
    return(
      <Animated  animationIn="slideInRight" animationOut="slideOutLeft" animationInDelay="100"> 
      <Grid container spacing={4}>
      <Grid xs={12} sm={12} md={3}></Grid>   
      <Grid xs={12} sm={12} md={6}>  
      {this.state.childMenu.length > 0 && this.state.childMenu.map((element, index) => (
      <Card key={element.id} className="card-box mb-2"  onClick={()=>this.renderPage(element.path)}>
      <Grid container spacing={4}  justify="center" className="align-center">
        <Grid item xs={12} sm={12} lg={9}>
          <Grid container spacing={4} >
            <Grid item xs={12}>
              <div className="px-4 py-2">
                <div className="mt-2 mb-2 line-height-sm">
                  <span className="font-size-lg">{element.name}</span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div className="text-right py-2">
                <div className="mt-2 mb-2 mr-4 line-height-sm">
                <Fab className="customNavBtn" size="medium"  aria-label="edit" onClick={()=>this.renderPage(element.path)}>
                  <NavigateNext />
                </Fab>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
      ))}
      </Grid>
      </Grid>
      </Animated>
    )
  }
}

