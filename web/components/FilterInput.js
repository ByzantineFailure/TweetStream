import React from 'react';
import ReactDOM from 'react-dom';
import config from '../config';

class FilterInput extends React.Component {
    constructor() {
        super();
        this.click = this.click.bind(this);
    }
    click(e) {
        var filterInput = ReactDOM.findDOMNode(this.refs.filterInput).value;
        this.props.update(filterInput);
    }
    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.filterInput).value = config.defaultFilter;
    }
    render() {
        return (
            <div>
                <h3>Tag Filter</h3>
                <input ref="filterInput" type="text" />
                <button onClick={this.click}>Update Filter</button>
                <br/>
            </div>
        );
    }
}

FilterInput.propTypes = {
    update: React.PropTypes.func.isRequired
}

export default FilterInput;

