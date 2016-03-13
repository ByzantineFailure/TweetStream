module.exports = TwitterFeed;

var Twitter = require('twitter'),
    credentials = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };

function TwitterFeed() {
    this.client = new Twitter(credentials);
    this.__stream = null;
    this.watchTag = this.watchTag.bind(this);
    this.closeStream = this.closeStream.bind(this);
};

//Do a promise thing here or something, I dunno
TwitterFeed.prototype.watchTag = function(tag, dataCallback) {
    console.log('Opening stream for statuses filter ' + tag);
    var self = this;
    self.client.stream('statuses/filter', {track: tag}, function(stream) {
        stream.on('data', function(tweet) {
            if(tweet.limit) {
                console.log('Tweet rate limited!');
            } else {
                dataCallback({
                    text: tweet.text,
                    author: tweet.user.name + ' / @' + tweet.user.screen_name,
                    timestamp: tweet.created_at
                }, self.closeStream);
            }
        });
        stream.on('error', function(error) {
            console.log('some error');
            console.log(error);
            //throw error;
        });
        self.__stream = stream;
    });
}

TwitterFeed.prototype.closeStream = function() {
    if(this.__stream !== null) {
        console.log('Destroying stream...');
        this.__stream.destroy();
        this.__stream = null;
    }
}

console.log('Twitter Credentials:');
console.log(credentials);

