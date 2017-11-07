import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { feathersClient } from '../stores/client';
import localStorage from 'mobx-localstorage';

class AuthenticatedPage extends Component {
  state = {
    authenticated: 0
  }

  _handleAuthError = (error) => {
    this.setState({
      authenticated: -1
    })
    console.error("Authentication failed", error);
  }

  async componentDidMount() {
    try {
      let jwt = await feathersClient().passport.getJWT();
      jwt = jwt || localStorage.getItem("feathers-jwt");
      const authResponse = await feathersClient().authenticate({
        strategy: 'jwt',
        accessToken: jwt
      });
      const payload = await feathersClient().passport.verifyJWT(authResponse.accessToken);
      this.setState({
        authenticated: 1
      });
      this._getAuthenticatedData();
    } catch (error) {
      this._handleAuthError(error)
    }
  }

  _getAuthenticatedData() {
  }

  render() {
    const redir = (
      <Redirect to="/login" />
    )

    const mainContent = (
      <Grid>
        <Grid.Column width={4}>
          <Menu fluid vertical secondary>
            <Menu.Item as={Link} to='/' active={ location.pathname === '/' }>
              Query
            </Menu.Item>
            <Menu.Item as={Link} to='/locations' active={ location.pathname === '/locations' }>
              Locations
            </Menu.Item>
            <Menu.Item as={Link} to='/selection' active={ location.pathname === '/selection' }>
              Selection
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment basic>
            { this._render() }
          </Segment>
        </Grid.Column>
      </Grid>
    );

    return (
      <div>
        { (this.state.authenticated === -1) && redir }
        { mainContent }
      </div>
    );
  }

  _render() {
    return (
      <pre>
        Please override the _render method in your page.
      </pre>
    );
  }
}

export default AuthenticatedPage;