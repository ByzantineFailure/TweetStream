const OAuth = require('oauth'),
    REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token',
    ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token',
    AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'
    CALLBACK_URL = 'https://www.byzantinefailure.com/twitterstream/access_token';

const oa = new OAuth.OAuth(
    REQUEST_TOKEN_URL,
    ACCESS_TOKEN_URL,
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    CALLBACK_URL,
    'HMAC-SHA1'
);

function getRequestToken(req, res) {
    oa.getOAuthRequestToken((error, token, secret, results) => {
        if (error || !results.oauth_callback_confirmed) {
            res.status(500).json({ 
                error,
                results
            });
        } else {
            req.session.oAuthTokenSecret = secret;
            res.redirect(302, `${AUTHENTICATE_URL}?oauth_token=${token}`);
        }
    });
}

function getAccessToken(req, res) {
    if (!req.query.oauth_token || !req.query.oauth_verifier) {
        res.send(401, 'oauth_token or oauth_verifier absent from query!');
        return;
    }
    if (!req.session.oAuthTokenSecret) {
        res.send(401, 'OAuth token secret not present in session!');
        return;
    }
    oa.getOAuthAccessToken(
        req.query.oauth_token, 
        req.session.oAuthTokenSecret, 
        req.query.oauth_verifier, 
        (error, oAuthAccessToken, oAuthAccessTokenSecret, results) => 
        {
            if(error) {
                res.status(500).json({ error, results });
            } else {
                req.session.oAuthAccessToken = oAuthAccessToken;
                req.session.oAuthAccessTokenSecret = oAuthAccessTokenSecret;
                res.redirect(302, '/');
            }
        }
    );
}

function displayRequest(req, res) {
    res.json(200, {
        headers: req.headers,
        body: req.body,
        params: req.query
    });
}

module.exports = {
    getRequestToken,
    displayRequest,
    getAccessToken
};

