import React, { Component } from 'react';
import Config from '../config';
import axios from 'axios';
import { getToken } from '../utils/Common';
class Service extends Component {
  apiCall(method, postData) {
    let token = getToken();
    return axios({
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: Config.url + method,
      data: postData
    });
  }
  
  post(method, postData) {
    let token = getToken();
    return axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      },
      url: Config.url + method,
      data: postData
    });
  }
  get(method, getData) {
    let token = getToken();
    return axios({
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: Config.url + method,
      
    });
  }
  laravelTmp(method, getData) {
    let token = getToken();
    return axios({
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: 'http://reactdev.egenius.in/egenius_api_laravel/public/api/' + method,
     
    });
  }
  getAll(method, getData) {
    let token = getToken();
    return axios({
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: Config.url + method,

    });
  }
  put(method, putData) {
    let token = getToken();
    return axios({
      method: 'put',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: Config.url + method,
      data: putData
    });
  }
  delete(method, deleteData) {
    let token = getToken();
    return axios({
      method: 'delete',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
      url: Config.url + method,
      data: deleteData
    });
  }
}



export default Service
