const yelpClient = require('./yelp.client');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      (hook) => {
        return new Promise((resolve, reject) => {
          yelpClient((error, client) => {
            if (error) {
              return reject(error);
            }

            hook.params.client = client;

            resolve(hook);
          })
        });
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};