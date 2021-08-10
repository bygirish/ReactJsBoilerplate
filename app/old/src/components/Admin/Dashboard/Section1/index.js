import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Grid, IconButton, Box, Badge, Card } from '@material-ui/core';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../utils/MapStateDispatchProps.js';
import Service from '../../../../utils/Service';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import Circle from 'react-circle';


  class Section1 extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dashboardData:'',
        total_students:0,
        total_staff:0,
        student_attendance:[],
        staff_roles:[],
        class_list:[],
      }
    }
    
  getDashboardDetails() {
    const postData = {
      id_organization:this.props.data.selectedOrganizationId,
      id_institute:this.props.data.selectedInstitutionId,
      id_board:this.props.data.selectedBoardId,
      id_academicyear:this.props.data.selectedAcademicId,
      token:"abc",
      role_id: this.props.data.role_id,
      id_user: this.props.data.UID
    }
    new Service().apiCall('dashboards/get_dashboard_data',postData).then(response => {
      console.log(response)
      if (response.status==200 && response.data!='') {
          this.setState({staff_roles:response.data.staff_roles, class_list:response.data.class_list,student_attendance:response.data.student_attendance});    
      }
      
    }).catch(error => {
      console.log(error)
    });

  }
  componentDidMount() {
    this.getDashboardDetails();
  }
  render(){  
    
  const chart41Options = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    labels: this.state.staff_roles,
    fill: {
      opacity: 0.85,
      colors: ['#f4772e']
    },
    colors: ['#f4772e'],
    legend: {
      show: false
    },
    grid: {
      strokeDashArray: '5',
      borderColor: 'rgba(125, 138, 156, 0.3)'
    },
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    yaxis: {
      min: 0
    }
  };
  const chart41Data = [
    {
      name: 'Percentage',
      data: [0, 0, 0, 0, 0, 0, 0, 0]
    }
  ];

  const chart34Options = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%'
      }
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent']
    },
    colors: ['#1bc943'],
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    },
    labels: this.state.class_list,
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    yaxis: {
      min: 0
    }
  };
  const chart34Data = [
    {
      name: 'Percentage',
      data: this.state.student_attendance
    },
  ];
  return (
    <Fragment>
      <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
          <Card className="card-box mb-4 px-4 pt-4 text-center">
     
          
          
            <div className="font-weight-bold font-size-lg mt-4 mb-3 text-black">
              Staff Attendance
            </div>
            <Chart
              options={chart41Options}
              series={chart41Data}
              type="bar"
              height={280}
            />
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card className="card-box mb-4 px-4 pt-4 text-center">
          
          
            <div className="font-weight-bold font-size-lg mt-4 mb-3 text-black">
              Student Attendance
            </div>
            <Chart
              options={chart34Options}
              series={chart34Data}
              type="bar"
              height={280}
            />
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
  }
}

export default connect(mapStateToProps, mapDispatchToPros)(Section1);