import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import LocationsList from '../components/locations-list';
import { inject } from 'mobx-react';
import { feathersClient } from '../stores/client';
import AuthenticatedPage from './authenticated-page';


@inject("stores")
class LocationsListPage extends AuthenticatedPage {
  _getAuthenticatedData() {
    this.props.stores.locationsStore.fetchAllAuthenticated(this._handleAuthError);
  }

  _render() {
    const { locationsStore:store } = this.props.stores;
    return (
      <Container fluid>
        <h1>Locations</h1>
        <LocationsList store={store} user_id={window.localStorage.getItem('feathers-user')} />
      </Container>
    )
  }
}

export default LocationsListPage;