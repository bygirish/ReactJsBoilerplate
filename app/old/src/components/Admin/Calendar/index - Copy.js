import React from 'react';

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
  Fab,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  Tooltip,
  Divider
} from '@material-ui/core';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';   

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: '#eaf6ff'
    }
  });



const locales = {
  'en-US': require('date-fns/locale/en-US')
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const now = new Date();

const events = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2021, 3, 0),
    end: new Date(2021, 3, 1)
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2021, 3, 7),
    end: new Date(2021, 3, 10)
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0)
  },

  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0)
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(2021, 3, 9, 0, 0, 0),
    end: new Date(2021, 3, 10, 0, 0, 0)
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(2021, 3, 11),
    end: new Date(2021, 3, 13),
    desc: 'Big conference for important people'
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(2021, 3, 12, 10, 30, 0, 0),
    end: new Date(2021, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting'
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(2021, 3, 12, 12, 0, 0, 0),
    end: new Date(2021, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch'
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(2021, 3, 12, 14, 0, 0, 0),
    end: new Date(2021, 3, 12, 15, 0, 0, 0)
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(2021, 3, 12, 17, 0, 0, 0),
    end: new Date(2021, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day'
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(2021, 3, 12, 20, 0, 0, 0),
    end: new Date(2021, 3, 12, 21, 0, 0, 0)
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2021, 3, 13, 7, 0, 0),
    end: new Date(2021, 3, 13, 10, 30, 0)
  },
  {
    id: 12,
    title: 'Late Night Event',
    start: new Date(2021, 3, 17, 19, 30, 0),
    end: new Date(2021, 3, 18, 2, 0, 0)
  },
  {
    id: 12.5,
    title: 'Late Same Night Event',
    start: new Date(2021, 3, 17, 19, 30, 0),
    end: new Date(2021, 3, 17, 23, 30, 0)
  },
  {
    id: 13,
    title: 'Multi-day Event',
    start: new Date(2021, 3, 20, 19, 30, 0),
    end: new Date(2021, 3, 22, 2, 0, 0)
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3))
  },
  {
    id: 15,
    title: 'Point in Time Event',
    start: now,
    end: now
  },
  {
    id: 16,
    title: 'Video Record',
    start: new Date(2021, 3, 14, 15, 30, 0),
    end: new Date(2021, 3, 14, 19, 0, 0)
  },
  {
    id: 17,
    title: 'Dutch Song Producing',
    start: new Date(2021, 3, 14, 16, 30, 0),
    end: new Date(2021, 3, 14, 20, 0, 0)
  },
  {
    id: 18,
    title: 'Itaewon Halloween Meeting',
    start: new Date(2021, 3, 14, 16, 30, 0),
    end: new Date(2021, 3, 14, 17, 30, 0)
  },
  {
    id: 19,
    title: 'Online Coding Test',
    start: new Date(2021, 3, 14, 17, 30, 0),
    end: new Date(2021, 3, 14, 20, 30, 0)
  },
  {
    id: 20,
    title: 'An overlapped Event',
    start: new Date(2021, 3, 14, 17, 0, 0),
    end: new Date(2021, 3, 14, 18, 30, 0)
  },
  {
    id: 21,
    title: 'Phone Interview',
    start: new Date(2021, 3, 14, 17, 0, 0),
    end: new Date(2021, 3, 14, 18, 30, 0)
  },
  {
    id: 22,
    title: 'Cooking Class',
    start: new Date(2021, 3, 14, 17, 30, 0),
    end: new Date(2021, 3, 14, 19, 0, 0)
  },
  {
    id: 23,
    title: 'Go to the gym',
    start: new Date(2021, 3, 14, 18, 30, 0),
    end: new Date(2021, 3, 14, 20, 0, 0)
  }
];


const MyCalendar = () => (

  

       <div className="app-inner-content-layout--main bg-white p-0 card-box">
          <div className="app-inner-content-layout--main__header rounded-0 card-header bg-white p-4 border-bottom">
            <div className="card-header--title">
             
              <b className="font-size-lg">Events calendar</b>
            </div>
            <div className="card-header--actions">
              <Tooltip placement="left" title="Add new event">
                <IconButton size="medium" color="primary">
                  <FontAwesomeIcon
                    icon={['fas', 'plus']}
                    className="font-size-md"
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <PerfectScrollbar>
            <div className="p-4">
    <Calendar
      popup
      localizer={localizer}
      views={allViews}
      step={60}
      showMultiDayTimes
      defaultDate={new Date()}
      
      components={{
        timeSlotWrapper: ColoredDateCellWrapper,
        
      }}
      events={events}
      startAccessor="start"
      endAccessor="end"
      onSelectEvent={event => alert(event.title)}
      style={{ minHeight: 650 }}
    />
    </div>
     </PerfectScrollbar>
        </div>
      

);

export default MyCalendar;
