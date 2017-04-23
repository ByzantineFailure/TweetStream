var winston = require('winston');

winston.loggers.options.transports = [
    //new (winston.transports.File)({filename: '/var/log/twitterstream/log.log' })
];

function createRewriter(type) {
    return function(level, msg, meta) {
        meta.type = type;
        meta.timestamp = (new Date()).getTime();
        return meta;
    }
}

winston.loggers.add('socket', {
    console: {
        level: 'info',
        colorize: true
    }
});
winston.loggers.get('socket').rewriters.push(
    createRewriter('SOCKET')
);

winston.loggers.add('stream', {
    console: {
        level: 'info',
        colorize: true
    }
});
winston.loggers.get('stream').rewriters.push(
    createRewriter('STREAM')
);

winston.loggers.add('server', {
    console: {
        level: 'info',
        colorize: true
    }
});
winston.loggers.get('server').rewriters.push(
    createRewriter('SERVER')
);

module.exports = {
    socket: winston.loggers.get('socket'),
    stream: winston.loggers.get('stream'),
    server: winston.loggers.get('server')
};

