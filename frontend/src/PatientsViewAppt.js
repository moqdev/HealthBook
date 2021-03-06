import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Button
} from 'grommet';

import './App.css';

const theme = {
    global: {
        colors: {
            brand: '#00739D',
            focus: '#00739D'
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

export class PatientsViewAppointments extends Component {
    state = { appointmentsState: [] }
    componentDidMount() {
        this.getNames("");
    }
    getNames(value) {
        let patName = value;
        console.log(patName);
        fetch("/userInSession")
            .then(res => res.json())
            .then(res => {
                var string_json = JSON.stringify(res);
                var email_json = JSON.parse(string_json);
                let email_in_use = email_json.email;
                fetch('/patientViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res.data)
                        this.setState({ appointmentsState: res.data.rows });
                    });
            });
    }
    render() {
        const { appointmentsState } = this.state;
        console.log(this.state.appointmentsState)
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                            <th>Date of Appointment</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Concerns</th>
                                <th>Symptoms</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsState.map(patient =>
                                <tr key={patient.user}>
                                    <td align="center" >
                                        {new Date(patient.thedate).toLocaleDateString('en-us').substring(0, 10)}
                                    </td>
                                    <td align="center" >{patient.thestart}</td>
                                    <td align="center" >{patient.theend.substring(0, 5)}</td>
                                    <td align="center">{patient.theconcerns} </td>
                                    <td align="center">{patient.thesymptoms}</td>
                                    <td align="center">{patient.status}</td>
                                    <td>
                                        <Button label="See Diagnosis"
                                        href={`/showDiagnoses/${patient.id}`}
                                        ></Button>     
                                    </td> 
                                    <td>
                                    {   patient.status==="NotDone"?
                                        <Button label="Cancel"
                                        onClick = {() => {
                                            fetch('/deleteAppt?uid='+ patient.id)
                                            window.location.reload()
                                        }}
                                        ></Button>
                                        :
                                        <Button label="Delete"
                                        onClick = {() => {
                                            fetch('/deleteAppt?uid='+ patient.ID)
                                            window.location.reload()
                                        }}
                                        ></Button>
                                    }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        return (
            <Grommet theme={theme} full>
                <Box >
                    <AppBar>
                    <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>healthbook</Heading></a>
                    </AppBar>
                    <Body />
                </Box>
            </Grommet>
        );
    }
}


export default PatientsViewAppointments;