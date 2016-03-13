"use strict";

var express = require('express'),
    app = express(),
    socketApp = require('express-ws')(app),
    heartbeat = require('./lib/heartbeat-pinger'),
    socketHandler = require('./lib/socket-handler');

console.log('Starting server...');

app.use('/', express.static(__dirname + '/build'));

app.ws('/socket', socketHandler);
//heartbeat(socketApp.getWss('/socket'));

app.listen(process.env.PORT || 3000);

console.log('Server started!');

