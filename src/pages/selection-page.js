/* global google */
import React, { Component } from 'react';
import { Message, Icon, Container, Card, Image, Rating, Grid, Segment, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DirectionsMap from '../components/directions-map';
import AuthenticatedPage from './authenticated-page';

@inject("stores") @observer
class SelectionPage extends AuthenticatedPage {
  _render() {
    const { selectionStore: store } = this.props.stores;

    const fetchingMessage = (
      <Message icon info>
        <Icon name='circle notched' loading />
        <Message.Content>
           <Message.Header>Just one moment</Message.Header>
           We are finding an awesome place for you.
       </Message.Content>
      </Message>
    )

    const noQuery = (
      <Message icon info>
        <Icon name='warning circle' />
        <Message.Content>
           <Message.Header>No query found</Message.Header>
           <Link to="/">Go back to query page</Link>
       </Message.Content>
      </Message>
    )

    let result = (
      <div>
        <p>Sorry, we couldn't find any results that matched your query. Bummer!</p>
      </div>
    );

    if (store.selection && store.initialLocation) {
      const categories = store.selection.categories ? store.selection.categories.map((category, index) => {
        return (
          <span key={index} className='category'>
            {category.title}
          </span>
        )
      }) : null;

      const map = store.selection.coordinates ? (
        <DirectionsMap
          origin={new google.maps.LatLng(store.initialLocation.loc[0], store.initialLocation.loc[1])}
          destination={new google.maps.LatLng(store.selection.coordinates.latitude, store.selection.coordinates.longitude)}
          zoom={18}
        />
      ) : null;

      result = (
        <div>
          <Card fluid>
            <Image src={store.selection.image_url} style={{maxHeight: "300px"}} />
            <Card.Content>
              <Card.Header>
                {store.selection.name}
              </Card.Header>
              <Card.Meta>
                {categories}
              </Card.Meta>
              <Card.Description>
                {map}
                <p>{Math.round(store.selection.distance / 1610.0 * 100) / 100} miles away from {store.initialLocation.title || ""}</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Grid columns={2} relaxed>
                <Grid.Column>
                  {store.selection.price}
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Segment basic>
                    <Rating icon='star' defaultRating={Math.round(store.selection.rating)} maxRating={5} disabled />
                    <p>
                      {store.selection.review_count}
                      { ' ' }
                      reviews
                    </p>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
          <p>
            Venue content provided by:
            <Link to={store.selection.url || "#"} target="_blank"> Yelp</Link>
          </p>
        </div>
      )
    }

    const backButton = (
      <Button primary fluid as={Link} to="/">
        Back
      </Button>
    )

    return (
      <Container style={{width: '600px'}}>
        { !store.initialLocation && noQuery }
        { store.loading && fetchingMessage }
        { !store.loading && store.initialLocation && result }
        { backButton }
      </Container>
    );
  }
}

export default SelectionPage;