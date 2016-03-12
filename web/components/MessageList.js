import config from '../config';
import React from 'react';
import Message from './Message';


function renderMessage(value, key) {
    return <Message text={value.text} author={value.author} timestamp={value.timestamp} key={key} />
}

class MessageList extends React.Component {
    constructor() {
        super();
        this.state = { messages: [] };
        this.newMessage = this.newMessage.bind(this);
    }
    newMessage(message) {
        var state = this.state;
        state.messages.unshift(message);
        if(state.messages.length > config.maxMessages) {
            state.messages.length = config.maxMessages;
        }
        this.setState(state);
    }
    componentWillMount() {
        throw new Error("MessageList used without message source! (please extend MessageList)");
    }
    componentWillUnmount() {
        throw new Error("MessageList used without message source! (please extend MessageList)");
    }
    render() {
        var values = this.state.messages.map(renderMessage);
        return (
            <ul className="message-list">
                {values}
            </ul>
        );
    }
}

export default MessageList;
