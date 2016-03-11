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
};

TwitterFeed.prototype.watchTag = function(tag, callback) {
    this.client.stream('statuses/filter', {track: tag}, function(stream) {
        stream.on('data', function(tweet) {
            callback({
                text: tweet.text,
                author: tweet.screen_name,
                timestamp: tweet.created_at
            });
        });
        stream.on('error', function(error) {
           throw error;
        });
    });
}

console.log(credentials);

