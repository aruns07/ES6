import React from 'react';
import Counter from './counter';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Counter Component', () => {
    it('matches the snapshot', ()=>{
        const tree = renderer.create(<Counter/>);
        expect(tree).toMatchSnapshot();
    })

    it('starts with a count of 0', ()=>{
        const wrapper = shallow(<Counter/>);
        const text = wrapper.find('p').text();
        expect(text).toEqual('Counter value: 0');
    })

    it('Increments on button click', ()=>{
        const wrapper = shallow(<Counter/>);
        wrapper.find('button').simulate('click');
        const text = wrapper.find('p').text();
        expect(text).toEqual('Counter value: 1');
    })
});