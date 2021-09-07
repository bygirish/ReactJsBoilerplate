import Router from "@router/Router";
import React from "react";


interface IProps {

}

interface IState {}

export default class Root extends React.Component<IProps, IState> {
  
  public async componentDidMount() {

  }


  public async componentDidUpdate(prevProps: IProps) {

  }
  public render() {
    return (
      <React.Fragment>
        <Router />
      </React.Fragment>
    );
  }
}
