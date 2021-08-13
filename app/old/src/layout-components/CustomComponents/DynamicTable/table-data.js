import React, { Fragment } from 'react';
import {
  Dialog, Grid, Switch, FormControlLabel, FormControl, IconButton, Typography, AppBar, Divider, Card, CardContent, Fab, CardActions, TextField, Button, ButtonGroup, Box, Avatar, List, ListItem, Slide, Checkbox, RadioGroup, Radio, InputAdornment, MenuItem, Tooltip,
  Drawer, Toolbar
} from '@material-ui/core';

import "@assetss/custom.scss";
export const tables = {
    cols: [
      {
        Header: "S No",
        accessor: "link",
        width: 90,
        className: "center",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          type: "LINK"
        },
        align: "center"
      },
      {
        Header: "Date",
        accessor: "date",
        className: "center",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          type: "Date"
        }
      },
      {
        Header: "Input",
        accessor: "inp",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          isRead: false
        }
      },
      {
        Header: "Image",
        accessor: "img",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          type: "image",
          properties: {
            width: 40
          }
        },
        align: "center"
      },
      {
        Header: "Date Link",
        accessor: "date",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          type: "text"
        },
        align: "right"
      },
      {
        Header: "Check",
        accessor: "check",
        Filter: ({ filter, onChange }) => (
            <TextField
              inputProps={{
                autoComplete: 'off'
              }}
              id="document-type"
              value={filter ? filter.value : ''}
              placeholder="S No"
              type="text"
              onChange={event => onChange(event.target.value)}
            />
          ),
        Cell: {
          type: "checkBox"
        },
        align: "center"
      }
    ],
    rows: [
      {
        link: {
          value: "Row 1"
        },
        inp: {
          value: "Sample Value 1"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "01-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 2"
        },
        inp: {
          value: "Sample Value 2"
        },
        check: {
          value: true
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "02-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 3"
        },
        inp: {
          value: "Sample Value 3"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "03-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 4"
        },
        inp: {
          value: "Sample Value 4"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "04-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 5"
        },
        inp: {
          value: "Sample Value 5"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "05-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 6"
        },
        inp: {
          value: "Sample Value 6"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "06-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 7"
        },
        inp: {
          value: "Sample Value 7"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "07-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 8"
        },
        inp: {
          value: "Sample Value 8"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "08-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 9"
        },
        inp: {
          value: "Sample Value 9"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "09-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 10"
        },
        inp: {
          value: "Sample Value 10"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "10-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 11"
        },
        inp: {
          value: "Sample Value 11"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "11-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 12"
        },
        inp: {
          value: "Sample Value 12"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "12-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 13"
        },
        inp: {
          value: "Sample Value 13"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "13-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 14"
        },
        inp: {
          value: "Sample Value 14"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "14-Feb-2019"
        }
      },
      {
        link: {
          value: "Row 15"
        },
        inp: {
          value: "Sample Value 15"
        },
        check: {
          value: false
        },
        img: {
          value: "https://github.githubassets.com/favicon.ico",
          title: "GitHub"
        },
        date: {
          value: "15-Feb-2019"
        }
      }
    ]
  };
  