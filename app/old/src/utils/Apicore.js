import React, { Component } from 'react';
import Config from '../config';
import axios from 'axios';
import { getToken } from '@utils/Common';
import Service from './Service';
class Apicore extends Component {
    
    GetInstitution(postData) {
        
        return  new Service().getAll('Institution', postData)
        .then(this.handleResponse) 
        .catch(this.handleError); 
    }



    handleResponse=(response)=> {
        if (response.results) {
          return response.results;
        }
      
        if (response.data) {
          return response.data;
        }
      
        return response;
    }
      
    handleError=(error)=> {
        if (error.data) {
          return error.data;
        }
        return error;
    }
  }
  export default Apicore
