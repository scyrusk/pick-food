const hooks = require('./yelp.hooks');
const filters = require('./yelp.filters');
const yelp = require('yelp-fusion');

const clientId = "W7jCVC14zcWQhZUFeZcQAw";
const clientSecret = "U5BXzBIlNsLKytF5Qds1KKEmqX06yqVeYNoLIVqnkfCaOmX0Qqtg7F49xfBL9l7W";

module.exports = function () {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/yelp', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        if (data.location_loc) {
          try {
            const loc = data.location_loc.split(",").map((val) => parseFloat(val))
            params.client.search({
              term: data.term || 'food',
              latitude: loc[0],
              longitude: loc[1],
              radius: (data.distance || 1) * 1400, // 1610 is ~ 1 mile in meters; we do slightly less
              limit: 50,
              open_now: true,
            }).then(res => {
              const subset = res.jsonBody.businesses.filter((business) => {
                return business.rating >= 3.5 && business.review_count >= 5
              });
              resolve(pickRandom(subset));
            })
          } catch (e) {
            return reject(e);
          }
        } else { /* if no location */
          data.client.search({
            term: data.term || 'food',
            location: 'pittsburgh, pa'
          }).then(res => {
            resolve(pickRandom(res.jsonBody.businesses));
          }).catch(e => {
            return reject(e);
          })
        }
      });
    }
  });

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('yelp');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};