import React from 'react';
import config from '../config';
import MessageList from './MessageList';

class SocketMessageList extends MessageList {
    componentWillMount() {
        this.socket = new WebSocket('ws://' + this.props.host + (this.props.port ? ':' + this.props.port : '') + this.props.path);    
        this.socket.onmessage = message => this.newMessage(this.props.messageParser(message));
    }
    componentWillUnmount() {
        if (this.socket && 
                (this.socket.readyState === 'OPEN' || this.socket.readyState === 'CONNECTING')) {
            this.socket.close();
        }
    }
}

SocketMessageList.propTypes = {
    host: React.PropTypes.string.isRequired,
    port: React.PropTypes.string,
    path: React.PropTypes.string,
    messageParser: React.PropTypes.function
}

SocketMessageList.defaultProps = {
    path: '/socket'
    messageParser: (message) => JSON.parse(message.data),
}

export default SocketMessageList;

