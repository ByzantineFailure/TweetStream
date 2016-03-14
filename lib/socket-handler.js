/**
 * Message Format:
 * {
 *   type: MESSAGE_TYPE,
 *   data: { message data }
 * }
 **/
"use strict";
module.exports = socketHandler;

var loggers = require('./logger'),
    uuid = require('node-uuid'),
    TwitterFeed = require('./twitter-feed');

function socketHandler(ws, req) {
    var socketId = uuid.v4();
    loggers.socket.info('Client connected', { client: socketId });
    var feed = new TwitterFeed(socketId),
        tweetCallback = createTweetCallback(ws, socketId, feed.closeStream);

    ws.on('message', function(rawMsg) {
        loggers.socket.verbose('Got message: ' + rawMsg, { client: socketId });
        var msg = JSON.parse(rawMsg);  
        switch(msg.type) {
            case 'CHANGE_FILTER':
                loggers.socket.info('Changing filter to ' + msg.data, { client: socketId });
                feed.closeStream();
                feed.watchTag(msg.data, tweetCallback);
                break;
            default:
                loggers.socket.warn('Received message with unknown type' + msg.type + '!', { client: socketId });
                break;
        }
    });

    ws.on('close', function() {
        loggers.socket.info('Client disconnected', { client: socketId });
        feed.closeStream();
        feed = null;
    });
}

function createTweetCallback(ws, socketId, closeCallback) {
    function tweetCallback(tweet) {
        loggers.socket.verbose(JSON.stringify(tweet, ' ', 2), { client: socketId });
        try {
            ws.send(JSON.stringify({ type: 'TWEET', data: tweet }));
        } catch(e) {
            closeCallback();
        }
    }
    return tweetCallback;
}
