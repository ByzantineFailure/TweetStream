module.exports = TwitterFeed;

var Twitter = require('twitter'),
    loggers = require('./logger'),
    credentials = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };

function TwitterFeed(socketId) {
    this.socketId = socketId;
    this.client = new Twitter(credentials);
    this.__stream = null;
    this.watchTag = this.watchTag.bind(this);
    this.closeStream = this.closeStream.bind(this);
};

//Do a promise thing here or something, I dunno
TwitterFeed.prototype.watchTag = function(tag, tweetCallback) {
    loggers.stream.info('Opening stream for statuses filter ' + tag, { client: this.socketId });
    var self = this;
    self.client.stream('statuses/filter', {track: tag}, function(stream) {
        stream.on('data', function(tweet) {
            if(tweet.limit) {
                loggers.stream.verbose('Tweet rate limited!', { client: self.socketId });
            } else {
                loggers.stream.silly(tweet, { client: self.socketId });
                tweetCallback({
                    text: tweet.text,
                    author: tweet.user.name + ' / @' + tweet.user.screen_name,
                    timestamp: tweet.created_at
                });
            }
        });

        stream.on('error', function(error) {
            if(error.source.indexOf('Exceeded') >= 0) {
                loggers.stream.warn('sending too many users notice', { client: self.socketId });
                tweetCallback(createStreamCountError());
            } else {
                loggers.stream.error('Some error', { error: error });
            }
        });

        self.__stream = stream;
    });
}

TwitterFeed.prototype.closeStream = function() {
    if(this.__stream !== null) {
        loggers.stream.info('Destroying stream...', { client: this.socketId });
        this.__stream.destroy();
        this.__stream = null;
    }
}

function createStreamCountError() {
    return { 
        text: 'Current twitter stream count exceeds limit.  Try updating again in about 15 seconds, or tell someone else on the server to bugger off.',
        author: 'SERVER',
        timestamp: (new Date()).toString()
    };
}
