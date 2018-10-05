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
import MyAlbumsPage from '../pages/MyAlbumsPage';
import SingleAlbumPage from '../pages/SingleAlbumPage';
import FullPost from '../components/FullPost';
import ProfilePage from '../pages/ProfilePage';
import MessageBoxPage from '../pages/MessageBoxPage';


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
          <PrivateRoute path="/mbox" component={MessageBoxPage}/>
          <Route path="/albummaker" component={AlbumMaker} />

          <PrivateRoute exact path="/myalbums" component={MyAlbumsPage} />
          <Route path="/albums/:user/:albumid" component={SingleAlbumPage} />
          <Route path="/post/:id" component={FullPost} />
          <Route path="/profile/:user" component={ProfilePage} />

        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, {fetchUser})(AppRouter);