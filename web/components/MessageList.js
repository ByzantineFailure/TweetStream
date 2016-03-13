import React from 'react';
import Message from './Message';

function renderMessage(value, key) {
    return <Message text={value.text} author={value.author} timestamp={value.timestamp} key={key} />
}

class MessageList extends React.Component {
    constructor() {
        super();
    }
    render() {
        var values = this.props.messages.map(renderMessage);
        return (
            <div>
                <ul className="message-list">
                    {values}
                </ul>
            </div>
        );
    }
}

MessageList.propTypes = {
    messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}

export default MessageList;

