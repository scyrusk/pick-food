import React, { Component } from 'react';
import { runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { Form, Button, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LoginForm from '../forms/login-form';
import InputField from '../forms/input-field';
import validatorjs from 'validatorjs';
import localStorage from 'mobx-localstorage';

@inject("stores") @observer
export default class LoginPage extends Component {
  state = {
    credentialsStored: false
  }

  form = null;
  mobxFormVals = {
    fields: [{
      name: 'email',
      label: 'Email',
      placeholder: 'Email',
      rules: 'required|email|string|between:5,25',
    }, {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      rules: 'required|string|between:5,25',
    }],
    plugins: {
      dvr: validatorjs
    },
  }

  onSuccessHandler = (result) => {
    runInAction('setting localstorage', () => {
      localStorage.setItem("feathers-jwt", result.accessToken);
      localStorage.setItem("feathers-user", result.user._id);
    });
    this.setState({
      credentialsStored: true
    });
  }

  onErrorHandler = (error) => {
    console.error('Error authenticating!', error);
  }

  constructor(props) {
    super(props);
    const { fields, plugins } = this.mobxFormVals;
    this.form = new LoginForm({ fields }, { plugins }, this.onSuccessHandler, this.onErrorHandler);
  }

  render() {
    const form = this.form;

    const loginForm = (
      <Form onSubmit={form.onSubmit}>
        <InputField field={form.$('email')} />
        <InputField type="password" field={form.$('password')} />
        <Button primary positive fluid type='submit' onClick={form.onSubmit} disabled={form.isPristine}>Login</Button>
        <Divider horizontal>Or</Divider>
        <Button as={Link} to="/users/new" secondary fluid>Sign Up</Button>
      </Form>
    );

    const redir = (
      <Redirect to="/" />
    )

    return (
      <div>
        { this.state.credentialsStored && redir}
        { loginForm }
      </div>
    );
  }
}