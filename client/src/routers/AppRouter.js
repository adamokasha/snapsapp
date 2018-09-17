import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LandingPage from '../pages/LandingPage';
import RegistrationPage from '../pages/RegistrationPage';
import DashboardPage from '../pages/DashboardPage';
import { fetchUser } from '../actions/auth';

const history = createBrowserHistory();

export class AppRouter extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/" component={LandingPage} />
          <Route path="/register" component={RegistrationPage} />
          <PrivateRoute path="/dashboard" component={DashboardPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, {fetchUser})(AppRouter);