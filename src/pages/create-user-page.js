import React, { Component } from 'react';
import { runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router';
import CreateUserForm from '../forms/create-user-form';
import UserForm from '../components/user-form';
import validatorjs from 'validatorjs';
import localStorage from 'mobx-localstorage';

// Interface with User Store
@inject("stores") @observer
export default class CreateUserPage extends Component {
  state = {
    credentialsStored: false
  }

  form = null
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
    }, {
      name: 'passwordConfirm',
      label: 'Password Confirmation',
      type: 'password',
      placeholder: 'Confirm Password',
      rules: 'required|string|same:password',
    }],
    plugins: {
      dvr: validatorjs
    },
  }

  constructor(props) {
    super(props)
    const { fields, plugins } = this.mobxFormVals;
    this.form = new CreateUserForm({ fields }, { plugins }, this.onSuccessHandler, this.onErrorHandler);
  }

  onSuccessHandler = (result) => {
    // Authenticate user
    runInAction('setting localstorage', () => {
      localStorage.setItem("feathers-jwt", result.accessToken);
      localStorage.setItem("feathers-user", result.user._id);
      this.setState({
        credentialsStored: true
      });
    });
  }

  onErrorHandler = (error) => {
    console.error('Error creating new user!', error);
  }

  componentDidMount() {
    const { _id } = this.props.match.params;
    const { usersStore:store } = this.props.stores;
    if(_id) {
      store.fetch(_id)
    } else {
      store.newEntity();
    }
  }

  render() {
    const { usersStore:store } = this.props.stores;
    const { entity } = store;

    const userForm =
      <UserForm store={store} form={this.form} user={entity} />;

    const redir = (
      <Redirect to="/" />
    );

    return (
      <div>
        { this.state.credentialsStored && redir }
        { userForm }
      </div>
    );
  }
}