import React, { Component } from 'react';
import Textbox from './textbox/textbox';
import Counter from './counter/counter';
import CounterList from './counterList/counterList';
import './App.css';

export default class App extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Hello World</h1>
                <label>name: <Textbox /></label>
                <Counter />
                <CounterList/>
            </React.Fragment>
        );
    }
}