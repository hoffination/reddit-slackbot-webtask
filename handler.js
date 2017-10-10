'use strict';

module.exports = (context, cb) => {
    const message = 'Go Serverless & Webtasks! Your function executed successfully!';
    console.log(message); // test logging
    cb(null, { message });
};
