export default {
    socket: {
        host: 'www.byzantinefailure.com',
        port: '',
        // We run this behind HAProxy now, so the path is prefixed with '/twitterstream'
        path: '/twitterstream/socket',
        isSecure: true
    },
    defaultFilter: 'javascript',
    maxMessages: 15
};
