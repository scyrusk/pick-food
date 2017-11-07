import { observable, action } from 'mobx';

class SelectionStore {
  @observable selection = {}
  @observable loading = false;
  @observable initialLocation = null

  @action
  setLoading() {
    this.loading = true;
  }

  @action
  unsetLoading() {
    this.loading = false;
  }

  @action
  setInitialLocation(location) {
    this.initialLocation = location;
  }

  @action
  updateSelection(newSelection) {
    this.selection = newSelection;
    this.unsetLoading();
  }
}

export default new SelectionStore();