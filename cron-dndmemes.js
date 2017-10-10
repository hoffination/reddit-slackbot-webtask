'use strict';

const request = require('request');
const token = 'oops';
const baseURL = 'https://bonebrawlers.slack.com/api/chat.postMessage';

const callAPI = (form, cb) => {
    request.post(baseURL, {form}, (err, res, body) => {
        if (err) return cb(err);

        body = JSON.parse(body);
        if (!body.ok) return cb(body.error);

        return cb(null, body);
    });
};

module.exports = (context, cb) => {
    request('https://www.reddit.com/r/dndmemes/.json?count=20', {json: true}, function(err, res, data) {
        if (err) {
            cb({ message: 'Error encountered', error: JSON.stringify(err) });
        } else {
            let post = data.data.children[0];
            callAPI({
                token,
                channel: 'general',
                as_user: false,
                username: 'memebot',
                icon_url: 'http://i.imgur.com/cM1OhgS.jpg',
                text: `${post.data.title}
${post.data.url}
link: https://www.reddit.com${post.data.permalink}`
            }, (err, body) => {
                if (err) { console.log(err); return cb(err); }
                cb(null);
            })
        }
    });
};
