import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Table,
    TableBody,
    TableCell,
    TableRow
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

var id;

export class ShowDiagnoses extends Component {
    constructor(props) {
        super(props);
        id = props.match.params.id;
    }
    state = { diagnoses: [] }
    componentDidMount() {
        fetch('http://localhost:3001/showDiagnoses?id='+ id)
        .then(res => res.json())
        .then(res => this.setState({ diagnoses: res.data }));
    }
    render() {
        const { diagnoses } = this.state;
        const Header = () => (
            <Box
                tag='header'
                background='brand'
                pad='small'
                elevation='small'
                justify='between'
                direction='row'
                align='center'
                flex={false}
            >
                <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>HMS</Heading></a>
            </Box>
        );
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                   
                </div>
                <hr />
            </div>
        );
        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true}>
                    <Header />
                    <Body />
                </Box>
            </Grommet>
        );
    }
}


export default ShowDiagnoses;