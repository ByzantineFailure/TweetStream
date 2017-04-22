'use strict';

var lastTime = new Date();

function getTime(req, res) {
    res.send(200, lastTime.getTime());
}

function postTime(req, res) {
    lastTime = new Date();
    res.send(200, lastTime.getTime());
}

module.exports = {
    get: getTime,
    post: postTime
}

