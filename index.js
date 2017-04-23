"use strict";

var express = require('express'),
    fs = require('fs'),
    https = require('https'),
    app = express(),
    session = require('express-session'),
    socketApp = require('express-ws')(app),
    heartbeat = require('./lib/heartbeat-pinger'),
    socketHandler = require('./lib/socket-handler'),
    timeEndpoint = require('./lib/last-time'),
    testCredentials = require('./lib/test-creds'),
    auth = require('./lib/authenticate'),
    loggers = require('./lib/logger');

loggers.server.info('Starting server...');

console.log(process.env.TWITTER_STREAM_PKEY);
console.log(process.env.TWITTER_STREAM_CERT);


const credentials = {
    key: fs.readFileSync(process.env.TWITTER_STREAM_PKEY, 'utf8'),
    cert: fs.readFileSync(process.env.TWITTER_STREAM_CERT, 'utf8')
};

app.use(session({
    secret: process.env.SESSION_SECRET || 'NEATO SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// ayy
app.get('/', function(req, res) {
    if (!req.session.oAuthAccessToken || ! req.session.oAuthAccessTokenSecret) {
        res.redirect(302, '/request_token');
    } else {
        res.redirect(302, '/static');
    }
});

app.use('/static',express.static(__dirname + '/build'));

app.get('/time', timeEndpoint.get);
app.post('/time', timeEndpoint.post);

app.get('/display_request', auth.displayRequest);
app.get('/request_token', auth.getRequestToken);
app.get('/access_token', auth.getAccessToken);
app.get('/test_credentials', testCredentials);

app.ws('/socket', socketHandler);
//heartbeat(socketApp.getWss('/socket'));

https.createServer(credentials, app).listen(process.env.PORT || 3000);
//app.listen(process.env.PORT || 3000);

loggers.server.info(`Listening on port ${process.env.PORT || 3000}`);
loggers.server.info('Server started!');

