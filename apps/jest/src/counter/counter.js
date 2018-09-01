import React from 'react';

export default class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
        this.increment = this.increment.bind(this);
    }

    increment() {
        this.setState((prevState)=>{
            return {count: prevState.count + 1}
        });
    }

    render() {
        return (
            <div>
                <h2>Counter</h2>
                <p>Counter value: {this.state.count}</p>
                <button onClick={this.increment}>Increment</button>
            </div>
        );
    }
}