#Twitter Watcher

Just a little thing I'm doing to play around with React in a more real way

Watches a twitter tag and updates whenever something is tweeted.

Requires you to have the following twitter API environment variables set up:
* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN_KEY`
* `TWITTER_ACCESS_TOKEN_SECRET`

It looks like the most concurrent streams it can use right now is 2, and the stream looks to take about ~10s to actually _close_ the stream when it's done, so this is not real scalable, just more a fun thing to play with.  

MIT Licensed

