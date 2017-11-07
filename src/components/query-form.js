import React, { Component } from 'react';
import { Form, Dropdown, Input, Button } from 'semantic-ui-react';
import { feathersClient } from '../stores/client';
import { withRouter } from 'react-router';

class QueryForm extends Component {
  state = {
    term: 'food',
    location_loc: this.props.locations[0].loc.join(","),
    distance: 1.0,
  }

  handleDistanceChanged = (e) => {
    this.setState({
      distance: parseFloat(e.target.value),
    })
  }

  handleLocationChanged = (e, { value }) => {
    this.setState({
      location_loc: value,
    });
  }

  handleSubmit = (e) => {
    this.props.selectionStore.setLoading();
    this.props.selectionStore.setInitialLocation(
      this.props.locations.find((location) => { return location.loc.join(",") === this.state.location_loc })
    );
    feathersClient().service("yelp").create(this.state).then(response => {
      this.props.selectionStore.updateSelection(response);
    });
    this.props.history.push("/selection");
  }

  handleTermChanged = (e) => {
    this.setState({
      term: e.target.value
    })
  }

  FIXED_CHAR_WIDTH = 6

  render() {
    const locations = this.props.locations;
    const options = locations.map((location) => {
      return {
        text: location.title,
        value: location.loc.join(","),
      }
    });

    return (
      <Form size='massive'>
        <Form.Field inline>
          <label>I want to eat</label>
          <Input
            transparent
            className="dashed-underline"
            defaultValue="food"
            onChange={this.handleTermChanged} />
        </Form.Field>
        <Form.Field inline>
          <label>somewhere within</label>
          <Input
            transparent
            className="dashed-underline"
            defaultValue={1}
            onChange={this.handleDistanceChanged} />
        </Form.Field>
        <Form.Field inline>
          <label>mile(s) of</label>
          <Dropdown
            inline
            options={options}
            defaultValue={options[0].value}
            onChange={this.handleLocationChanged} />
        </Form.Field>
        <Button positive fluid onClick={this.handleSubmit} className="margin-top-10">
          Please help
        </Button>
      </Form>
    );
  }
}

export default withRouter(QueryForm);