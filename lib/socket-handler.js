/**
 * Message Format:
 * {
 *   type: MESSAGE_TYPE,
 *   data: { message data }
 * }
 **/
"use strict";
module.exports = socketHandler;

var WATCH_TAG = 'javascript',
    TwitterFeed = require('./twitter-feed');

function socketHandler(ws, req) {
    console.log('Client connected');
    var feed = new TwitterFeed(),
        alertUser = alertUserCallback.bind(null, ws);

    ws.on('message', function(rawMsg) {
        console.log('Got message: ' + rawMsg);
        var msg = JSON.parse(rawMsg);  
        switch(msg.type) {
            case 'CHANGE_FILTER':
                console.log('Changing filter to ' + msg.data);
                feed.closeStream();
                feed.watchTag(msg.data, alertUser);
                break;
            default:
                console.log('Received message with unknown type!');
                console.log(rawMsg);
                break;
        }
    });

    ws.on('close', function() {
        console.log('Client disconnected');
        feed.closeStream();
        feed = null;
    });
}

function alertUserCallback(ws, tweet, closeCallback) {
    console.log('Sending tweet:');
    console.log(tweet);
    try {
        ws.send(JSON.stringify({ type: 'TWEET', data: tweet }));
    } catch(e) {
        closeCallback();
    }
}
