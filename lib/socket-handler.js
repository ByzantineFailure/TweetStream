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
    const socketId = uuid.v4();
    
    loggers.socket.info('Client connected', { client: socketId });

    if (!req.session.oAuthAccessToken || !req.session.oAuthAccessTokenSecret) {
        loggers.socket.info('Client does not have proper auth', { client: socketId });
        ws.send(JSON.stringify({ type: 'TWEET', data: {
            text: 'You are unauthenticated!  Closing socket.  No further requests will function.',
            author: 'SERVER',
            timestamp: new Date().toString()
        }}));
        ws.close();
    }

    var feed = new TwitterFeed(
            socketId, 
            req.session.oAuthAccessToken, 
            req.session.oAuthAccessTokenSecret
        ),
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
        if (feed) {
            feed.closeStream();
            feed = null;
        }
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
