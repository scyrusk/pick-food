import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Grid, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import InputField from '../forms/input-field';

@observer
class UserForm extends Component {
  componentDidMount() {
    this.props.form.update(this.props.user);
  }

  componentWillReceiveProps = (nextProps) => {
    const user = nextProps.user;
    this.props.form.update(user);
  }

  render() {
    const { form, user } = this.props;
    const { redirect, loading, errors } = this.props.store;
    const messages = errors.messages ? errors.messages.toJS() : [];

    const errorMessages = (
      <Message negative header={errors.global} list={messages.reverse()}/>
    )

    const userForm = (
      <Form onSubmit={form.onSubmit} loading={loading}>
        <InputField field={form.$('email')} />
        <InputField type="password" field={form.$('password')} />
        <InputField type="password" field={form.$('passwordConfirm')} />
        <Button primary type='submit' onClick={form.onSubmit} disabled={form.isPristine}>Submit</Button>
      </Form>
    );

    const grid = (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <h1 style={{marginTop:"1em"}}>{ user._id ? 'Edit Account' : 'Create Account' }</h1>
            { errors.global && errorMessages }
            { userForm }
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

export default UserForm;