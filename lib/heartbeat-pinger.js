"use strict";

module.exports = heartbeat;

function heartbeat(socketHost) {
    setInterval(function() {
        socketHost.clients.forEach(function(client) {
            client.send(JSON.stringify({
                type: 'TWEET',
                data: {
                    author: 'HEARTBEAT',
                    text: '3s ping...',
                    timestamp: (new Date()).toString()
                }
            }));
        });
    }, 3000);
}

