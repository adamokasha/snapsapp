import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LandingPage from '../pages/LandingPage';
import RegisterOrLogin from '../pages/RegisterOrLogin';
import RegisterUserPage from '../pages/RegisterUserPage';
import DashboardPage from '../pages/DashboardPage';
import ImageUploadPage from '../pages/ImageUploadPage';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { fetchUser } from '../actions/auth';

import imageModalView from '../components/ImageModalView';

export class AppRouter extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/" component={LandingPage} />
          <PublicRoute path="/register" component={() => <RegisterOrLogin registerOrLogin="register" />} />
          <Route path="/register_user" component={RegisterUserPage} />
          <PublicRoute path="/login" component={() => <RegisterOrLogin registerOrLogin="login" />} registerOrLogin="login" />
          <PublicRoute path="/privacy" component={PrivacyPolicy} />
          <PrivateRoute path="/dashboard" component={DashboardPage} />
          <PrivateRoute path="/upload" component={ImageUploadPage} />

          <Route path="/modalpreview" component={imageModalView} />

        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, {fetchUser})(AppRouter);