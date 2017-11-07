import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Route, Link, withRouter } from 'react-router-dom';
import { Container, Menu, Segment, Grid } from 'semantic-ui-react';
import LocationsListPage from './pages/locations-list-page';
import QueryPage from './pages/query-page';
import SelectionPage from './pages/selection-page';
import CreateUserPage from './pages/create-user-page';
import LoginPage from './pages/login-page';
import LogoutPage from './pages/logout-page';
import TestPage from './pages/test-page';
import localStorage from 'mobx-localstorage';

@observer
class App extends Component {
  render() {
    const { location } = this.props;
    const authenticated = localStorage.getItem("feathers-jwt") !== undefined;

    const home = (
      <Menu.Item as={Link} to='/' name='home' />
    )

    return (
      <Container>
        <Segment inverted>
          <Menu inverted>
            { authenticated && home }
            <Menu.Item as={Link} to={authenticated ? '/logout' : '/login'} name={authenticated ? 'logout' : 'login'} />
          </Menu>
        </Segment>

        <Route exact path="/" component={QueryPage}/>
        <Route exact path="/locations" component={LocationsListPage}/>
        <Route exact path="/selection" component={SelectionPage}/>
        <Route exact path="/users/new" component={CreateUserPage}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/logout" component={LogoutPage}/>
        <Route exact path="/test" component={TestPage}/>
      </Container>
    );
  }
}

export default withRouter(App);
