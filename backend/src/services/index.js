const location = require('./location/location.service.js');
const yelp = require('./yelp/yelp.service.js');

const users = require('./users/users.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(location);
  app.configure(yelp);
  app.configure(users);
};
