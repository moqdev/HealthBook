import React, { Component} from 'react';
import {
    Box,
    Heading,
    Grommet,
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

export class NoMedHistFound extends Component {
    componentDidMount() {
    }
    render() {
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
                <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>healthbook</Heading></a>

            </Box>
        );







export default NoMedHistFound;