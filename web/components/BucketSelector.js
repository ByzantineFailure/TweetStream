import React from 'react';

const values = [
    { label: '1 second', value: 1000 },
    { label: '3 seconds', value: 3000 },
    { label: '5 seconds', value: 5000 },
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 }
]

class BucketSelector extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        this.props.selectCallback(Number(e.target.value));
    }
    render() {
        const options = values.map(val => 
            <option key={val.value} value={val.value}>{val.label}</option>
        );
        return <select onChange={this.onChange}>
            {options}     
        </select>
    }
}

BucketSelector.propTypes = {
    selectCallback: React.PropTypes.func.isRequired
};

export default BucketSelector;
