"use strict";

var express = require('express'),
    app = express(),
    socketApp = require('express-ws')(app),
    Watcher = require('./lib/twitter-feed.js'),
    WATCH_TAG = 'javascript';

console.log('Starting server...');

app.use('/', express.static(__dirname + '/build'));

//Do websocket-y stuff here
app.ws('/socket', function(ws, req) {
    console.log('Client connected!');
});
var socketHost = socketApp.getWss('/socket');

setInterval(function() {
    socketHost.clients.forEach(function(client) {
        client.send('3s ping...');  
    });
}, 3000);

function alertUsers(tweet) {
    socketHost.clients.forEach(function(client) {
        client.send(JSON.stringify(tweet));
    });
}

var twitterWatcher = new Watcher();
twitterWatcher.watchTag(WATCH_TAG, alertUsers);

app.listen(process.env.PORT || 3000);

console.log('Server started!');

