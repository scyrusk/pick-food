import React, { Component } from 'react';
import { Message, Icon, Container } from 'semantic-ui-react';
import { feathersClient } from '../stores/client';
import localStorage from 'mobx-localstorage';

class LogoutPage extends Component {
  state = {
    pending: true
  }

  componentDidMount() {
    feathersClient().logout().then((response) => {
      localStorage.removeItem('feathers-jwt');
      localStorage.removeItem('feathers-user');
      this.setState({
        pending: false
      })
    }).catch((e) => {
      console.error("Couldn't log out", e);
    })
  }

  render() {
    const waitMessage = (
      <Message icon info>
        <Icon name='circle notched' loading />
        <Message.Content>
           <Message.Header>Just one moment</Message.Header>
           We are logging you out.
       </Message.Content>
      </Message>
    )

    const successMessage = (
      <Message success>
        <Message.Content>
           <Message.Header>See you around, kid.</Message.Header>
           You're dead to me.
       </Message.Content>
      </Message>
    )

    return (
      <Container fluid>
        { this.state.pending && waitMessage }
        { !this.state.pending && successMessage }
      </Container>
    );
  }
}

export default LogoutPage;