import React from 'react';

class Message extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <ul className="message">
              <li className="author">{this.props.author}</li>
              <li className="timestamp">{this.props.timestamp}</li>
              <li className="tweet-text">{this.props.text}</li>
            </ul>
        );
    }
}

Message.propTypes = {
    author: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired
};

export default Message;

