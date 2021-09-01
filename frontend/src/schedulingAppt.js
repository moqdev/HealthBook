import React, { Component, useState, useEffect } from 'react';
import {
  Schedule,
} from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Form,
  Text,
  TextArea,
  Grommet,
  Calendar,
  DropButton,
  MaskedInput,
  Keyboard,
  Select
} from 'grommet';
import './App.css';
const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: "#000000",
      active: "#000000",
    },
    font: {
      family: 'Lato',
    },
  },
};
var theDate;
var theTime;
var endTime;
var theConcerns;
var theSymptoms;
var theDoc;
const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props} />
);

const DropContent = ({ date: initialDate, time: initialTime, onClose }) => {
  const [date, setDate] = React.useState();
  const [time, setTime] = React.useState();

  const close = () => {
    theDate = date;
    theTime = time;

    //time is string, store it as [hour, min]
    let parsedTime = theTime.split(":");

    //parse hr string to in and add one hour to start hour
    let startHour = parseInt(parsedTime[0], 10);
    let endHour = startHour + 1;

        //rejoin into string
    endTime = `${endHour}:00`;

    console.log(endTime);
    console.log(theDate)
    console.log(theTime);
    onClose(date || initialDate, time || initialTime);
  };

export default SchedulingAppt;