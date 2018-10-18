import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainPage from "../pages/MainPage";
import RegisterOrLogin from "../pages/RegisterOrLogin";
import RegisterUserPage from "../pages/RegisterUserPage";
import AddPostPage from "../pages/AddPostPage";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { setUser } from "../actions/auth";
import { fetchUser } from "../async/auth";

import AlbumMaker from "../components/AlbumMaker";
import MyAlbumsPage from "../pages/MyAlbumsPage";
import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

export class AppRouter extends React.Component {
  async componentDidMount() {
    try {
      const { data } = await fetchUser();
      console.log(data);
      this.props.setUser(data);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <PublicRoute
            path="/register"
            component={() => <RegisterOrLogin registerOrLogin="register" />}
          />
          <Route path="/register_user" component={RegisterUserPage} />
          <PublicRoute
            path="/login"
            component={() => <RegisterOrLogin registerOrLogin="login" />}
            registerOrLogin="login"
          />
          <PublicRoute path="/privacy" component={PrivacyPolicy} />
          <PrivateRoute path="/upload" component={AddPostPage} />
          <PrivateRoute path="/mbox" component={MessageBoxPage} />
          <Route path="/albummaker" component={AlbumMaker} />

          <PrivateRoute exact path="/myalbums" component={MyAlbumsPage} />
          <Route path="/albums/:user/:albumid" component={SingleAlbumPage} />
          {/* <Route path="/post/:id" component={FullPost} /> */}
          <Route path="/post/:id" component={FullPostPage} />
          <Route path="/profile/:user" component={ProfilePage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { setUser }
)(AppRouter);
