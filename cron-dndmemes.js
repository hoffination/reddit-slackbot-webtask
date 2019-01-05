'use strict';

const request = require('request');
const baseURL = 'https://bonebrawlers.slack.com/api/chat.postMessage';
const defaultForm = {
  token: 'oops',
  channel: 'general',
  as_user: false,
  username: 'memechest',
  icon_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/211/1000/1000/636252764731637373.jpeg'
};

const callAPI = (form, cb) => {
  console.log(form);
  request.post(baseURL, { form }, (err, res, body) => {
    if (err) return cb(err);
    body = JSON.parse(body);
    if (!body.ok) return cb(body.error);
    return cb(null, body);
  });
};

const getStoredValues = (context, cb) => {
  context.storage.get((err, data) => {
    if (err) return cb(err);
    cb(data);
  });
};

const setStoredValues = (context, data) => {
  context.storage.set(data, err => {
    if (err) console.log(err);
  });
};

module.exports = (context, cb) => {
  request('https://www.reddit.com/r/dndmemes/.json?count=20', { json: true }, function(err, res, data) {
    if (err) {
      cb({ message: 'Error encountered', error: JSON.stringify(err) });
    } else {
      let index = 0;
      let post = data.data.children[index].data;
      while (post.stickied) {
        post = data.data.children[++index].data;
      }
      getStoredValues(context, result => {
        console.log(result);
        // check to see if post was already posted
        if (!result || result === post.url) {
          post = data.data.children[index + 1].data;
        }
        callAPI(
          Object.assign({}, defaultForm, {
            text: `${post.title}
${post.url}
link: https://www.reddit.com${post.permalink}`
          }),
          (error, body) => {
            if (error) {
              console.log(err);
              return cb(err);
            }
            cb(null, post);
            setStoredValues(context, post.url);
          }
        );
      });
    }
  });
};
