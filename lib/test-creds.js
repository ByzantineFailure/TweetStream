const Twitter = require('twitter');

function testCredentials(req, res) {
    if (!req.session.oAuthAccessToken || !req.session.oAuthAccessTokenSecret) {
        res.status(401).send('Unauthenticated!');
        return;
    }
    const credentials = {
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: req.session.oAuthAccessToken,
            access_token_secret: req.session.oAuthAccessTokenSecret
        },
        twitter = new Twitter(credentials);
    
    twitter.get('account/verify_credentials.json', function(error, tweet, response) {
        if (error) {
            res.status(500).json(error);
        }
        else {
            res.json(response);
        }
    }); 
}

module.exports = testCredentials;

