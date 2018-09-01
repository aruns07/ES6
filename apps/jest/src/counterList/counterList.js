import React from 'react';
import Counter from '../counter/counter';

export default class CounterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1
        };
        this.addCounter = this.addCounter.bind(this);
    }

    addCounter() {
        this.setState((prevState)=>{
            return {count: prevState.count + 1}
        });
    }

    render() {
        var list = (
            Array.from(Array(this.state.count).keys()).map((index) => {
                return (<li key={index}><Counter/></li>)
            })
        );
        return (
            <div>
                <button onClick={this.addCounter}>Add Counter</button>
                {list}
                
            </div>
        );
    }
}