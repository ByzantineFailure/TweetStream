import React from 'react';
import MessageList from './components/MessageList';
import FilterInput from './components/FilterInput';
import Socket from './lib/Socket';
import config from './config';

class App extends React.Component {
    constructor() {
        super();
        this.state = { messages: [] };
        this.updateFilter = this.updateFilter.bind(this);
        this.newMessage = this.newMessage.bind(this);

        this.__socket = new Socket(config.socket);
        this.__socket.open(config.defaultFilter, this.newMessage);
    }
    updateFilter(filterText) {
        this.__socket.changeFilter(filterText);
        this.newMessage({
            author: 'TAG_CHANGED',
            text: 'Changed tag to: ' + filterText,
            timestamp: (new Date().toString())
        });
    }
    newMessage(message) {
        var state = this.state;
        state.messages.unshift(message);
        if(state.messages.length > config.maxMessages) {
            state.messages.length = config.maxMessages;
        }
        this.setState(state);
    }
    render() {
        return (
            <div>
                <FilterInput update={this.updateFilter} />
                <MessageList messages={this.state.messages} />
            </div>
        );
    }
}

export default App;

