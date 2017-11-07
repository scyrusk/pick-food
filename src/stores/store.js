import { observable, action, runInAction, autorun } from 'mobx';
import _ from 'lodash';
import sessionStore from './session-store';
import { feathersClient } from './client';
import localStorage from 'mobx-localstorage';

class Store {
  @observable service = null;
  @observable serviceName = null;

  @observable addEventSubscribers = [];

  @observable errors = {};
  @observable entity = {};
  @observable entities = [];
  @observable loading = false;
  @observable redirect = false;

  constructor(serviceName) {
    this.serviceName = serviceName;
    autorun(() => {
      if (localStorage.getItem("feathers-jwt")) {
        this.initialize();
      } else {
        this.service = null;
      }
    })
  }

  @action
  initialize() {
    feathersClient().passport.getJWT().then((jwt) => {
      jwt = jwt || localStorage.getItem("feathers-jwt")
      return feathersClient().passport.verifyJWT(jwt);
    }).then(payload => {
      runInAction('authenticated', () => {
        this.service = feathersClient().service(this.serviceName);

        // real time event registration
        this.service.on('patched', entity => {
          this.updateEvent(entity);
        });

        this.service.on('created', entity => {
          this.addEvent(entity);
          _.each(this.addEventSubscribers, (subscriber) => {
            subscriber();
          });
        });

        this.service.on('removed', entity => {
          this.removeEvent(entity);
        });
      });
    }).catch((e) => {
      console.error("Could not authenticate.", e);
    });
  }

  startAsync = () => {
    this.loading = true;
    this.errors = {};
  }

  @action
  handleErrors = (err) => {
    if( err.code === 400) {
      let messages = [];
      _.each(err.errors, (value, key) => {
        messages.push(value.message);
      })
      this.errors = {global: err.message, messages}
    } else {
      this.errors = {global: err.message}
    }
    this.loading = false;
  }

  @action
  resetRedirect() {
    this.redirect = false;
  }

  @action
  _processAuthenticatedAsyncRequest = async(serviceFn, onSuccess, onFailure) => {
    this.startAsync();
    try {
      const jwt = localStorage.getItem("feathers-jwt");
      const payload = await feathersClient().passport.verifyJWT(jwt);
      const response = await serviceFn(feathersClient());
      onSuccess(response);
    } catch (e) {
      onFailure(e);
    }
  }

  @action
  fetchAllAuthenticated = async(onError = (e) => {}) => {
    this.startAsync();
    this._processAuthenticatedAsyncRequest(
      (client) => {
        return client.service(this.serviceName).find({})
      },
      (response) => {
        runInAction('populate entities', () => {
          this.entities = response.data;
          this.loading = false;
        });
      }, (error) => {
        console.error("couldn't fetch", error);
        this.handleErrors(error);
        onError(error);
      }
    );
  }

  @action
  fetchAll = async() => {
    this.startAsync();
    try{
      const jwt = (await feathersClient().passport.getJWT()) || localStorage.getItem("feathers-jwt")
      const payload = await feathersClient().passport.verifyJWT(jwt)
      const response = await feathersClient().service(this.serviceName).find({})
      runInAction('populate entities', () => {
        this.entities = response.data;
        this.loading = false;
      });
    } catch(err) {
      console.error("couldn't fetch", err);
        this.handleErrors(err);
    }
  }

  @action
  create = async(entity) => {
    this.startAsync();
    try{
      const response = await this.service.create(entity);
      runInAction('entity created', () => {
        this.entities.push(response);
        this.redirect = true;
        this.loading = false;
      });
    } catch(err) {
        this.handleErrors(err);
    } finally {
      this.resetRedirect();
    }
  }

  @action
  newEntity = () => {
    this.entity = {};
    this.errors = {};
  }

  @action
  newEntityWithFields = (fields={}) => {
    this.entity = Object.assign({}, fields);
    this.errors = {};
  }

  @action
  fetch = async(_id) => {
    this.startAsync();
    try {
      const response = await this.service.get(_id)
      runInAction('entity fetched', () => {
        this.entity = response;
        this.loading = false;
      })
    } catch(err) {
      this.handleErrors(err)
    }
  }

  @action
  update = async(_id, entity) => {
    this.startAsync();
    try{
      const response = await this.service.patch(_id, entity);
      runInAction('entity updated', () => {
        this.entities = this.entities.map(item => item._id === response._id ? response : item);
        this.redirect = true;
        this.loading = false;
      })
    } catch(err) {
      this.handleErrors(err)
    } finally {
      this.resetRedirect();
    }
  }

  @action
  deleteOne = async(_id) => {
    await this.service.remove(_id)
    try {
      runInAction('entity deleted', () => {
        this.entities = this.entities.filter(item => item._id !== _id)
      })
    }
    catch(err) {
      this.handleErrors(err)
    }
  }

  @action
  addEvent = (entity) => {
    const found = this.entities.find(item => item._id === entity._id)
    if(!found){
      this.entities.push(entity)
    }
  }

  @action
  updateEvent = (entity) => {
    this.entities = this.entities.map(item => item._id === entity._id ? Object.assign(item, entity) : item);
  }

  @action
  removeEvent = (entity) => {
    const found = this.entities.find(item => item._id === entity._id)
    if(found){
        this.entities = this.entities.filter(item => item._id !== entity._id)
    }
  }

  @action
  pushSubscriberToAddEvent(fn) {
    if (typeof fn === "function") {
      const found = this.addEventSubscribers.find(item => item === fn);
      if (!found) {
        this.addEventSubscribers.push(fn);
      }
    }
  }

  @action
  pullSubscriberFromAddEvent(fn) {
    if (typeof fn === "function") {
      this.addEventSubscribers = this.addEventSubscribers.filter(item => item !== fn);
    }
  }
}

export default Store;
