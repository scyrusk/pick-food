const parseLoc = require('../../hooks/parse-loc-string');
const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const { restrictToOwner, associateCurrentUser } = require('feathers-authentication-hooks');

const locationUserSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'user_id',
    childField: '_id'
  }
};

const restrict = [
  restrictToOwner({
    idField: '_id',
    ownerField: 'user_id'
  })
];

const associate = [
  associateCurrentUser({
    idField: '_id',
    as: 'user_id'
  })
];

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ ...restrict ],
    get: [ ...restrict ],
    create: [ parseLoc(), ...associate ],
    update: [ ...restrict, ...associate, parseLoc() ],
    patch: [ ...restrict, ...associate ],
    remove: [ ...restrict ]
  },

  after: {
    all: [ populate({ schema: locationUserSchema })],
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
