import React, { Component, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Grid,
    Text,
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
const SidebarButton = ({ label, ...rest }) => (
  <Button plain {...rest}>
      {({ hover }) => (
          <Box
              background={hover ? "#DADADA" : undefined}
              pad={{ horizontal: "large", vertical: "medium" }}
          >
              <Text size="large">{label}</Text>
          </Box>
      )}
  </Button>
);

const SidebarButtons = () => {
  const [active, setActive] = useState();
  return (
      <Grommet full theme={theme}>
          <Box fill direction="row">
              <Box background="brand">
                  {["Appointments", "View Patients", "Settings", "Sign Out"].map(label => (
                      <SidebarButton
                          key={label}
                          label={label}
                          active={label === active}
                          onClick={() => {
                              if (label === "Appointments") {
                                  window.location = "/ApptList"
                              }
                              else if (label === "Sign Out") {
                                  fetch("http://localhost:3001/endSession");
                                  window.location = "/"
                              }
                              else if (label === "Settings") {
                                  window.location = "/DocSettings"
                              }
                              else if (label === "View Patients") {
                                  window.location = "/MedHistView"
                              }
                              setActive(label);
                          }}
                      />
                  ))}

              </Box>
          </Box>
      </Grommet>
  );
};