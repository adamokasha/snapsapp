import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import HomePage from '../pages/HomePage';
import RegisterOrLogin from '../pages/RegisterOrLogin';
import RegisterUserPage from '../pages/RegisterUserPage';
import ImageUploadPage from '../pages/ImageUploadPage';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { fetchUser } from '../actions/auth';

import AlbumMaker from '../components/AlbumMaker';
import AlbumsPage from '../pages/AlbumsPage';
import SingleAlbumPage from '../pages/SingleAlbumPage';
import FullPost from '../components/FullPost';
import Profile from '../components/Profile';


export class AppRouter extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <PublicRoute path="/register" component={() => <RegisterOrLogin registerOrLogin="register" />} />
          <Route path="/register_user" component={RegisterUserPage} />
          <PublicRoute path="/login" component={() => <RegisterOrLogin registerOrLogin="login" />} registerOrLogin="login" />
          <PublicRoute path="/privacy" component={PrivacyPolicy} />
          <PrivateRoute path="/upload" component={ImageUploadPage} />

          <Route path="/albummaker" component={AlbumMaker} />

          <PrivateRoute exact path="/myalbums" component={AlbumsPage} />
          <Route path="/albums/:user/:albumid" component={SingleAlbumPage} />
          <Route path="/post/:id" component={FullPost} />

          <Route path="/profile" component={Profile} />

        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, {fetchUser})(AppRouter);