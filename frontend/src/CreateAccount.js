import React, { Component} from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text
} from 'grommet';

import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000'
    },
    font: {
      family: 'Lato',
    },
  },
};

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
export class CreateAccount extends Component {
  constuctor() {
  }

  render() {

    return (
      <Grommet theme={theme} full>
        <AppBar>
          <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>HMS</Heading></a>
        </AppBar>
        <Box fill align="center" justify="top">
          <Box width="medium">
          <Text color = "#AAAAAA">Patient's registration form:</Text>
            <Form
              onReset={event => console.log(event)}
              method="post"
              onSubmit={({ value }) => {
                console.log("Submit", value);

                fetch("http://localhost:3001/checkIfPatientExists?email=" + value.email)
                  .then(res => res.json())
                  .then(res => {
                    console.log(res.data[0]);

                    if ((res.data[0])) {
                      window.alert("An account is already associated with that email.");
                      console.log("no user found");
                    } else {
                      fetch("http://localhost:3001/makeAccount?name=" + value.firstName + "&lastname=" + value.lastName + "&email=" + value.email
                        + "&password=" + value.password + "&address=" + value.address + "&gender=" + value.gender
                        + "&conditions=" + value.conditions + "&medications=" + value.medications + "&surgeries=" + value.surgeries);
                      window.location = "/Home";
                    }
                  });
              }}>
               </Form>
          </Box>
        </Box>
      </Grommet>
    );
  }
} 