import remotedev from 'mobx-remotedev';
import { observer } from 'mobx-react';
import Store from './store';
import selectionStore from './selection-store';
import sessionStore from './session-store';

const locationsConfig = {
  name:'Locations Store',
  onlyActions:true,
  filters: {
    whitelist: /fetch|update|create|Event|entity|entities|handleErrors/
  }
};

const yelpConfig = {
  name:'Yelp Store',
  onlyActions: true,
  filters: {
    whitelist: /create/
  }
};

const selectionConfig = {
  name: 'Selections Store',
  onlyActions: true,
  filters: {
    whitelist: /updateSelection|setLoading|unsetLoading|setInitialLocation/
  }
}

const sessionConfig = {
  name: 'Session Store',
  onlyActions: true,
  filters: {
    whitelist: /updateSesession|setLoading|unsetLoading/
  }
}

const usersConfig = {
  name:'Users Store',
  onlyActions: true,
  filters: {
    whitelist: /fetch|update|create|Event|entity|entities|handleErrors/
  }
}

const locationsStore = new Store('locations');
const yelpStore = new Store('yelp');
const usersStore = new Store('users');

const allStores = {
  locationsStore: remotedev(locationsStore, locationsConfig),
  yelpStore: remotedev(yelpStore, yelpConfig),
  selectionStore: remotedev(selectionStore, selectionConfig),
  usersStore: remotedev(usersStore, usersConfig),
  sessionStore: remotedev(sessionStore, sessionConfig),
};

export default allStores;