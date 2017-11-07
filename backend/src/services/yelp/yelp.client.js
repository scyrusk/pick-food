const yelp = require('yelp-fusion');

const clientId = "W7jCVC14zcWQhZUFeZcQAw";
const clientSecret = "U5BXzBIlNsLKytF5Qds1KKEmqX06yqVeYNoLIVqnkfCaOmX0Qqtg7F49xfBL9l7W";

let callbacks = [];
let client = null;

yelp.accessToken(clientId, clientSecret).then(response => {
  client = yelp.client(response.jsonBody.access_token);

  callbacks.forEach(cb => cb(null, client));
  callbacks = [];
}).catch(e => {
  console.log(e);
  callbacks.forEach(cb => cb(e, null));
  callbacks = [];
});


module.exports = function(cb) {
  if (client !== null) {
    cb(null, client);
  } else {
    callbacks.push(cb);
  }
};