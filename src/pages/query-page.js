import React, { Component } from 'react';
import { Redirect, Link } from 'react-router';
import { Message, Icon, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { feathersClient } from '../stores/client';
import AuthenticatedPage from './authenticated-page';
import QueryForm from '../components/query-form';
import { geolocated } from 'react-geolocated';

@inject("stores") @observer
class QueryPage extends AuthenticatedPage {
  _getAuthenticatedData() {
    this.props.stores.locationsStore.fetchAllAuthenticated(this._handleAuthError);
  }

  _render() {
    const fetchingMessage = (
      <Message icon info>
        <Icon name='circle notched' loading />
        <Message.Content>
           <Message.Header>Just one moment</Message.Header>
           We are fetching that content for you.
       </Message.Content>
      </Message>
    )

    const emptyMessage = (
      <Message icon info>
        <Icon name='warning circle' />
        <Message.Content>
          <Message.Header>No saved locations found</Message.Header>
          <a href="/locations">
            <span>Add some new locations to get started.</span>
          </a>
       </Message.Content>
      </Message>
    )

    const fetchingLocation = (
      <Message icon info>
        <Icon name='circle notched' loading />
        <Message.Content>
           <Message.Header>Just one moment</Message.Header>
           We are fetching your current location.
       </Message.Content>
      </Message>
    )

    if (this.props.stores.locationsStore.service != null) {
      let { entities:locations, loading, errors } = this.props.stores.locationsStore;
      const messages = errors.messages ? errors.messages.toJS() : [];

      const currLocAvailable = this.props.isGeolocationAvailable && this.props.isGeolocationEnabled;

      if (currLocAvailable && this.props.coords) {
        locations = [ {
          title: 'me',
          loc: [ this.props.coords.latitude, this.props.coords.longitude],
        }, ...locations]
      }

      const errorMessages = (
        <Message negative header={errors.global} list={messages.reverse()}/>
      )

      return (
        <Container fluid>
          { loading && fetchingMessage }
          { currLocAvailable && !this.props.coords && fetchingLocation }
          { locations.length === 0 && !loading && !errors.global && emptyMessage }
          { errors.global && errorMessages}
          { locations.length > 0 ? <QueryForm locations={locations} selectionStore={this.props.stores.selectionStore} /> : null}
        </Container>
      );
    } else {
      return (
        <Container fluid>
          { emptyMessage }
        </Container>
      );
    }


  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(QueryPage);