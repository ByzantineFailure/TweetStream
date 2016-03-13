class Socket {
    constructor(params) {
        if(!params.host || !params.path) {
            throw new Error('Must provide path and host to socket!');
        }
        var port = params.port ? ':' + params.port : '',
            protocol = params.isSecure ? 'wss://' : 'ws://';
        this.url = protocol + params.host + port + params.path;
        
        this.isReady = this.isReady.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.open = this.open.bind(this);

        this.__onMessage = this.__onMessage.bind(this);
        this.__resetReady = this.__resetReady.bind(this);
        this.readyReceived = false;
        this.readyDeferred = null;
    }
    open(filterText, dataCallback) {
        if(!filterText || !dataCallback) {
            throw new Error('Must provide filter text and callback!');
        }
        this.dataCallback = dataCallback;
        this.__socket = new WebSocket(this.url);
        this.__socket.onmessage = this.__onMessage;
        this.__resetReady();
        this.changeFilter(filterText);
    }
    changeFilter(newFilter) {
        var msg = JSON.stringify({
            type: 'CHANGE_FILTER',
            data: newFilter
        });
        if(!this.isReady()) {
            this.readyDeferred.then(() => this.__socket.send(msg));
        } else {
            this.__socket.send(msg);
        }
    }
    isReady() {
        //readyState === 1 means OPEN
        return this.__socket && this.__socket.readyState === 1;
    }
    close() {
        if(this.__socket) {
            this.__socket.close();
        }
        this.__socket = null;
    }
    __onMessage(rawMsg) {
        var msg = JSON.parse(rawMsg.data);
        switch(msg.type) {
            case 'TWEET':
                this.dataCallback(msg.data);
                break;
            default:
                throw new Error('Unrecognized message type: ' + msg.type);
                break;
        }
    }
    __resetReady() {
        var self = this;
        this.readyDeferred = new Promise(function(resolve, reject) {
            var readyInterval;
            function readyCheck() {
                if(self.isReady()) {
                    clearInterval(readyInterval);
                    resolve(true);
                }
            }
            readyInterval = setInterval(readyCheck, 100);
        });
        return this.readyDeferred;
    }
}

export default Socket;

