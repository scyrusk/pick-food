/*global google*/
import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import LocationsMap from '../components/locations-map';
import createForm from '../forms/form';
import LocationForm from '../components/location-form';
import _ from 'lodash';

@observer
class LocationsList extends Component {
  state = {
    bounds: null,
    center: {
      lat: 40.4527783,
      lng: -79.9461796
    },
    searchMarkers: [],
    showFormFor: null,
    selectedKey: null,
  }

  searchMarkerIcon = {
    path: 'M -2,0 0,-2 2,0 0,2 z',
    strokeColor: '#000',
    fillColor: '#F00',
    fillOpacity: 1,
    scale: 5
  }

  selectedSearchMarkerIcon = {
    path: 'M -2,0 0,-2 2,0 0,2 z',
    strokeColor: '#000',
    fillColor: '#0F0',
    fillOpacity: 1,
    scale: 5
  }

  storeIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#F00',
    strokeOpacity: 0.8
  }

  selectedStoreIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#0F0',
    strokeOpacity: 0.8
  }


    // 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  form = null;
  fields = {
    title: {
      name: 'title',
      label: 'Title',
      placeholder: 'Enter a name for the place',
      rules: 'required|string'
    },
    loc: {
      name: 'loc',
      label: 'Location Coordinates',
      type: 'hidden',
      rules: 'required|array'
    },
    user_id: {
      name: 'user_id',
      label: 'User',
      type: 'hidden',
      rules: 'required|string'
    }
  };

  handleAddedPlace = this.handleAddedPlace.bind(this);
  handleMapMounted = this.handleMapMounted.bind(this);
  handleBoundsChanged = this.handleBoundsChanged.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);

  constructor(props){
    super(props)
    this.form = createForm(this.fields, this.props.store);
  }

  componentDidMount() {
    this.props.store.fetchAll();
    this.props.store.pushSubscriberToAddEvent(this.handleAddedPlace);
  }

  componentWillUnmount() {
    this.props.store.pullSubscriberFromAddEvent(this.handleAddedPlace);
  }

  getInputStyle() {
    return {
      boxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      border: '1px solid transparent',
      width: '240px',
      height: '28px',
      marginTop: '10px',
      padding: '0 12px',
      borderRadius: '1px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      fontSize: '14px',
      outline: 'none',
      textOverflow: 'ellipses'
    };
  }

  handleAddedPlace() {
    if (this._searchBox) {
      this._searchBox._inputElement.value = ""

      this.setState({
        searchMarkers: []
      })
    }
  }

  handleMapMounted(map) {
    this._map = map;
  }

  handleBoundsChanged() {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter()
    });
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();

    // Add a marker for each place returned from search bar
    const placeLocations = places.map((place, index) => ({
      position: place.geometry.location,
      icon: this.searchMarkerIcon,
      defaultAnimation: 2,
      type: 'search',
      key: `search${index}`
    }));

    this.setState({
      searchMarkers: placeLocations
    });
  }

  handleMarkerClick(marker) {
    // add logic to style selected marker
    if (marker.type === 'store') {
      this.props.store.fetch(marker.key);
      this.setState({
        selectedKey: marker.key,
        searchMarkers: this.state.searchMarkers.map(item => { return {...item, icon: this.searchMarkerIcon } }),
      });
    } else if (marker.type === 'search') {
      this.props.store.newEntityWithFields({
        _id: null,
        title: "",
        loc: [marker.position.lat(), marker.position.lng()],
        user_id: this.props.user_id
      });

      this.setState({
        selectedKey: null,
        searchMarkers: this.state.searchMarkers.map(item => item.key === marker.key ? {...item, icon: this.selectedSearchMarkerIcon } : item),
      })
    }
  }

  render() {
    const { center, bounds, searchMarkers } = this.state;
    const { entities:locations, entity, loading, errors } = this.props.store;
    const messages = errors.messages ? errors.messages.toJS() : [];

    const errorMessages = (
      <Message negative header={errors.global} list={messages.reverse()}/>
    )

    const locMarkers = locations.map((location) => {
      return {
        position: {
          lat: location.loc[0],
          lng: location.loc[1]
        },
        user_id: location.user_id || this.props.user_id,
        key: location._id,
        label: location.title,
        icon: this.state.selectedKey === location._id ? this.selectedStoreIcon : this.storeIcon,
        defaultAnimation: 2,
        type: 'store',
      }
    })

    const fetchingMessage = (
      <Message icon info>
        <Icon name='circle notched' loading />
        <Message.Content>
           <Message.Header>Just one moment</Message.Header>
           We are fetching your saved locations.
       </Message.Content>
      </Message>
    )

    const emptyMessage = (
      <Message icon info>
        <Icon name='warning circle' />
        <Message.Content>
           <Message.Header>No saved locations found</Message.Header>
           <span>Search for locations you would like to save in the map below.</span>
       </Message.Content>
      </Message>
    )

    const map = (
      <LocationsMap
        containerElement={
          <div style={{ height: '600px', width: '100%' }} />
        }
        mapElement={
          <div style={{ height: '100%' }} />
        }
        onMapLoad={_.noop}
        onMapClick={_.noop}
        zoom={ 13 }
        center={ center }
        markers={ locMarkers.concat(searchMarkers) }
        onMarkerClick={ this.handleMarkerClick }
        onMapMounted={ this.handleMapMounted }
        onBoundsChanged={ this.handleBoundsChanged }
        onSearchBoxMounted={ this.handleSearchBoxMounted }
        bounds={ bounds }
        inputStyle={ this.getInputStyle() }
        onPlacesChanged={ this.handlePlacesChanged }
      />
    )

    const locForm = _.isEmpty(entity) ? null :
      (
        <LocationForm store={this.props.store} form={this.form} location={entity} />
      )

    return (
      <div>
        { loading && fetchingMessage }
        { locations.length === 0 && !loading  && !errors.global && emptyMessage }
        { errors.global && errorMessages}
        { map }
        { locForm }
      </div>
    )
  }
}

export default LocationsList;