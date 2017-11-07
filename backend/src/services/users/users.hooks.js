const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ hashPassword() ],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [ (hook) => {
      const data = {
        strategy: 'local',
        email: hook.data.email,
        password: hook.data.passwordConfirm
      }
      const params = { user: hook.result, payload: { userId: hook.result._id } }
      return hook.app.service('authentication').create(data, params).then((page) => {
        hook.result = page;
        return Promise.resolve(hook);
      })
    }],
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
