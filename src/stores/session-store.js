import { observable, action } from 'mobx';

class SessionStore {
  @observable isAuthenticated = false;

  @action
  setAuthenticated() {
    this.isAuthenticated = true;
  }

  @action
  unsetAuthenticated() {
    this.isAuthenticated = false;
  }
}

export default new SessionStore();