import React from 'react';
import config from '../config';
import MessageList from './MessageList';

class SocketMessageList extends MessageList {
    componentWillMount() {
        this.socket = new WebSocket("ws://" + config.host + (config.port ? ":" + config.port : "") + "/socket");    
        this.socket.onmessage = message => this.newMessage(message.data);
    }
    componentWillUnmount() {
        if (this.socket && 
                (this.socket.readyState === "OPEN" || this.socket.readyState === "CONNECTING")) {
            this.socket.close();
        }
    }
}

export default SocketMessageList;

