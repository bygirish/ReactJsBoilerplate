import React, { Component } from "react";
import ReactDOM from "react-dom";
// import $ from "jquery";
// import { datepicker } from "jquery-datepicker";
import DynamicComponent from "./DynamicComponent.jsx";

// Import React Table
import ReactTable from 'react-table-6';
import {
    Dialog, Grid, Switch, FormControlLabel, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Avatar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, Tooltip,
    Drawer, Toolbar
  } from '@material-ui/core';
import "../../../assets/custom.scss";
// require("jquery-datepicker");
const tables = require("./table-data.js");

function filterCaseInsensitive(filter, row) {

    const id = filter.pivotId || filter.id;
    if (row[id] !== null) {
      return (
        row[id] !== undefined ?
          String(row[id].toString().toLowerCase())
            .includes(filter.value.toString().toLowerCase())
          :
          true
      );
    }
  }

class TableApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      columns: [],
    //   sorted: [],
    //   filtered: [],
      minRows:0,
      filterable:true,
      className: "-striped -highlight",
      
      defaultPageSize:10,
      showPaginationTop:true,
      showPaginationBottom:false,
                     
    };

    this.copyPropsToState(this.props.properties);
    this.componentMounted = false;

    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  copyPropsToState(props) {
    let properties = { ...this.state };
    if (props !== undefined) {
      if (props.columns !== undefined)
        properties.columns = this.getParsedColumns(props.columns);
      else if (props.cols !== undefined)
        properties.columns = this.getParsedColumns(props.cols);
      if (props.rows !== undefined) properties.rows = props.rows;
      if (props.defaultPageSize !== undefined)
        properties.defaultPageSize = props.defaultPageSize;
      if (props.className !== undefined) properties.className = props.className;
      if (props.multiSort !== undefined) properties.multiSort = props.multiSort;
      if (props.freezeWhenExpanded !== undefined)
        properties.freezeWhenExpanded = props.freezeWhenExpanded;
      if (props.pageSizeOptions !== undefined)
        properties.pageSizeOptions = props.pageSizeOptions;
    } else {
      console.warn("TableApp: table properties not defined. Using defaults");
    }
    if (!this.componentMounted) this.state = properties;
    else this.setState({ ...properties });
  }

  getParsedColumns(columns) {
    columns.map((col, idx) => {
      if (col["Cell"] !== undefined) {
        let tmp = col["Cell"];
        let align = "left";
        let Cell;
        if (col.align !== undefined) align = col.align;
        Cell = function (row) {
          return (
            <div align={align}>
              <DynamicComponent
                type={tmp.type}
                properties={tmp.properties}
                value={row.value}
                row={row}
                isRead={tmp.isRead}
              />
            </div>
          );
        };
        col["Cell"] = Cell;
        col["filterMethod"] = this.filterMethod;
      } else {
        console.warn("Found undefined column at index", idx);
      }
    });
    return columns;
  }

  updateRows(rows) {
    if (rows === undefined) {
      console.log(
        "undefined rows provided in updateRows, skipping table updation"
      );
      return;
    }
    // this.setState({
    //     rows: []
    // })
    this.setState({
      rows: rows
    });
    console.log("Table rows updated");
  }

  compare(key, desc) {
    return function (a, b) {
      const cell1 = a[key],
        cell2 = b[key];
      if (cell1 === undefined) return -1;
      else if (cell2 === undefined) return 1;
      const val1 = cell1.value,
        val2 = cell2.value;
      if (val1 === undefined) return -1;
      else if (val2 === undefined) return 1;
      let res = 0;
      if (val1 < val2) res = -1;
      else if (val1 > val2) res = 1;
      if (desc) {
        if (res === -1) res = 1;
        else if (res === 1) res = -1;
      }
      return res;
    };
  }
  componentDidMount() {
    if (this.componentMounted === false) this.componentMounted = true;
  }
  handleSortChange(sorted) {
    const prop = sorted[0];
    const sortKey = prop.id,
      sortDesc = prop.desc;

    let oldRows = [...this.state.rows];
    oldRows.sort(this.compare(sortKey, sortDesc));
    // let newRows = [];
    // oldRows.map((row, idx) => {
    //     let newRow = {};
    //     newRows.push({...row});

    // });
    // console.log('newRows', newRows);
    // let newRows = [...this.state.rows];
    // newRows.sort(this.compare(sortKey, sortDesc));

    /**
     * a simple way to create new objects in array.
     *
     * if any problem arises, then it can be changed with forEach loop.
     */
    let rows = JSON.parse(JSON.stringify(oldRows));
    let instance = this.tableInstance;
    console.log("before removing data", instance);
    // instance.state.data.length = 0;
    instance.state.data = [];
    console.log("after removing data", instance);
    // let cols = [...this.state.columns];
    // this.setState({
    //     columns: [
    //         {
    //             Header: "Samp"
    //         }
    //     ]
    // })
    this.setState({
      sorted,
      // columns: cols,
      rows: []
    });
    const parent = this;
    setTimeout(function () {
      parent.setState({ rows });
    }, 0);
    // instance.forceUpdate();
    // this.updateRows(newRows);
  }

  handleFilterChange(filteredData) {
    this.setState({
      filtered: filteredData
    });
  }

  filterMethod(filter, rows) {
    const row = rows[filter.id];
    if (!row) return true;
    const rowValue = row.value;
    if (!rowValue) return true;
    const filterValue = filter.value === undefined ? "" : filter.value;
    const retVal =
      String(rowValue)
        .toLowerCase()
        .indexOf(String(filterValue).toLowerCase()) > -1;
    console.log(rowValue, filterValue, retVal);
    console.log("------------------------------------------------------------");
    return retVal;
  }

  render() {
    return (
      <ReactTable
        filterable={true}
        data={this.state.rows}
        {...this.state}
        defaultFilterMethod={this.handleFilterChange}
        // ref={el => (this.tableInstance = el)}
        // onSortedChange={this.handleSortChange}
        // onFilteredChange={this.handleFilterChange}
      />
    );
  }
}


  
//   document.getElementById("root")

export default TableApp;
