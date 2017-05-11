import React from 'react';
import ReactDOM from 'react-dom';
import MessageList from './components/MessageList';
import FilterInput from './components/FilterInput';
import TimeChart from './components/TimeChart';
import BucketSelector from './components/BucketSelector';
import Socket from './lib/Socket';
import config from './config';

class App extends React.Component {
    constructor() {
        super();
        this.state = { messages: [], filter: config.defaultFilter };
        this.updateFilter = this.updateFilter.bind(this);
        this.newMessage = this.newMessage.bind(this);
        this.onBucketSelect = this.onBucketSelect.bind(this);

        this.registerTweet = null;
        this.updateBucketMs = null;

        this.__socket = new Socket(config.socket);
        this.__socket.open(config.defaultFilter, this.newMessage);
    }
    updateFilter(filterText) {
        this.__socket.changeFilter(filterText);
        // newMessage will call setState
        this.state.filter = filterText;
        this.newMessage({
            author: 'TAG_CHANGED',
            text: 'Changed tag to: ' + filterText,
            timestamp: (new Date().toString())
        });
    }
    onBucketSelect(bucketMs) {
        if(this.updateBucketMs) {
            this.updateBucketMs(bucketMs);
        }
    }
    newMessage(message) {
        var state = this.state;
        state.messages.unshift(message);
        if(state.messages.length > config.maxMessages) {
            state.messages.length = config.maxMessages;
        }
        this.setState(state);
        if (this.registerTweet) {
            this.registerTweet();
        }
    }
    render() {
        return (
            <div>
                <div>
                    <FilterInput update={this.updateFilter} />
                    <BucketSelector selectCallback={this.onBucketSelect} />
                </div>
                <TimeChart ref={ (chart) => 
                        { 
                            this.registerTweet = chart ? chart.registerTweet : null; 
                            this.updateBucketMs = chart ? chart.updateBucketMs : null; 
                        }
                    } 
                    initialBucketMs={1000} 
                    filterName={this.state.filter} />
                <MessageList messages={this.state.messages} />
            </div>
        );
    }
}

export default App;

