import React, { Fragment } from 'react';
import {
  Dialog, Grid, Switch, FormControlLabel, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Avatar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, Tooltip,
  Drawer, Toolbar
} from '@material-ui/core';
import "../../../assets/custom.scss";


class DynamicComponent extends React.Component {
  getTagElement(tagType) {
    if (!tagType) return "span";
    switch (tagType.toLowerCase()) {
      case "image":
      case "img":
        return "img";

      case "code":
        return "code";
      case "select":
        return "select";
      case "link":
        return "div";
      default:
        return "span";
    }
  }

  defaultOnChange(evt) {
    const targetVal = evt.target.value;
    const targetChecked = evt.target.checked;
    console.log("targetVal", targetVal);
    console.log("targetChecked", targetChecked);
  }

  createElement(tagType, tagProperties, data) {
    if (tagType === "LINK") {
      const str = data.value;
      if (str === undefined)
        throw Error(
          "DynamicComponent: 'value' key not defined for data of type 'LINK'"
        );
      return <span>{str}</span>;
    }
    const parent = this;
    const tagElement = this.getTagElement(tagType);
    let props = {};
    if (tagType === "image" || tagType === "img") {
      props = {
        src: data === undefined ? "" : data.value
      };
      Object.keys(data).map((key, idx) => {
        if (key !== "value") props[key] = data[key];
      });
      data = undefined;
    } else if (tagElement === "input") {
      let value = data === undefined ? "" : data.value;
      let onChange =
        tagProperties === undefined
          ? this.defaultOnChange
          : tagProperties.onChange === undefined
          ? this.defaultOnChange
          : tagProperties.onChange;
      let onClick = undefined;
      let type = "text";
      let checked = undefined;
      let className,
        style = {},
        size,
        jsvalidatedate,
        tabIndex,
        autoComplete = "off",
        placeholder = "",
        yearoffsetconstant,
        name;
      if (tagType === "password") type = "password";
      else if (tagType === "checkbox") {
        type = "checkbox";
        checked = value;
        className = "ace-switch ace-switch-2";
        style = { display: "none" };
      } else if (tagType === "date") {
        type = "text";
        className = "date-picker width-153";
        jsvalidatedate = "jsvalidatedate";
        tabIndex = 0;
        yearoffsetconstant = 0;
        name = "date";
      } else if (tagType === "timestamp") type = "datetime-local";
      props = {
        defaultValue: value,
        defaultCheckecd: checked,
        type,
        onClick,
        onChange,
        className,
        style,
        jsvalidatedate,
        autoComplete,
        placeholder,
        tabIndex
      };
      data = undefined;
    } else if (tagElement === "span") {
      if (data === undefined) data = "";
      else data = data.value;
    }
    if (tagProperties) {
      if (!props) props = tagProperties;
      else
        Object.keys(tagProperties).map(
          (key, idx) => (props[key] = tagProperties[key])
        );
    }
    return React.createElement(tagElement, props, data);
  }

  constructor(props) {
    super(props);
    const type =
      this.props.isRead === undefined
        ? this.props.type
        : this.props.isRead === true
        ? "span"
        : "input";
    let value = this.props.value;
    let properties = this.props.properties;
    if (value !== undefined) {
      if (value.properties !== undefined) {
        if (properties === undefined) properties = value.properties;
        else {
          let valProps = value.properties;
          Object.keys(valProps).map(
            (key, idx) => (properties[key] = valProps.key)
          );
        }
        delete value.properties;
        if (Object.keys(value).length === 0) value = undefined;
        else {
          if (value.value !== undefined) value = value.value;
          else if (value.text !== undefined) value = value.text;
        }
      }
    }
    this.state = { type, value, properties };
  }

  render() {
    const { type, value, properties } = this.state;
    return this.createElement(type, properties, value);
  }
}

export default DynamicComponent;
