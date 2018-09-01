import React from 'react';
import {shallow, mount} from 'enzyme';
import CounterList from './counterList';

describe('counter list', () => {
    it('should have one counter widget by default', () => {
        const wrapper = shallow(<CounterList/>)
        const counters = wrapper.find('Counter')
        expect(counters.length).toEqual(1)
    })
})