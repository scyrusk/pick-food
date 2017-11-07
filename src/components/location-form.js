import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Grid, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import InputField from '../forms/input-field';

@observer
class LocationForm extends React.Component {
  componentDidMount() {
    this.props.form.update(this.props.location);
  }

  // For ASYNC if i move to separate page
  componentWillReceiveProps = (nextProps) => {
    const location = nextProps.location;
    this.props.form.update(location);
  }

  render() {
    const { form, location } = this.props;
    const { deleteOne: deleteLocation, redirect, loading, errors, newEntity } = this.props.store;
    const messages = errors.messages ? errors.messages.toJS() : [];

    const errorMessages = (
      <Message negative header={errors.global} list={messages.reverse()}/>
    )

    const locationForm = (
      <Form onSubmit={form.onSubmit} loading={loading}>
        <InputField field={form.$('title')} />
        <input type="hidden" {...form.$('loc').bind()} value={this.props.location.loc}/>
        <input type="hidden" {...form.$('user_id').bind()} value={this.props.location.user_id} />
        <Button primary type='submit' onClick={form.onSubmit} disabled={form.isPristine}>Save Location</Button>
        { location._id ?
          <Button
            basic
            color="red"
            onClick={(e) => {
              e.preventDefault();
              deleteLocation(location._id).then(() => newEntity())
            }}>Delete</Button> :
          null
        }
      </Form>
    );

    const grid = (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <h1 style={{marginTop:"1em"}}>{ location._id ? 'Edit Location' : 'Add New Location' }</h1>
            {errors.global && errorMessages }
            {locationForm}
          </Grid.Column>
        </Grid>
      </div>
    );

    return (
      <div>
        { redirect ? <Redirect to="/" /> : grid }
      </div>
    );
  }
}

export default LocationForm;