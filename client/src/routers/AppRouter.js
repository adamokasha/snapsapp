import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavBar from "../components/NavBar";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainPage from "../pages/MainPage";
import RegisterOrLogin from "../pages/RegisterOrLogin";
import RegisterUserPage from "../pages/RegisterUserPage";
import AddPostPage from "../pages/AddPostPage";
import PrivacyPolicy from "../components/PrivacyPolicy";

import { fetchUser } from "../async/auth";
import { setUser } from "../actions/auth";

import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

export class AppRouter extends React.Component {
  async componentDidMount() {
    try {
      const { data: userData } = await fetchUser();
      this.props.setUser(userData);
    } catch (e) {
      console.log(e);
    }
  }

  onFetchPopular = () => {};
  onSetProfilePage = () => {};

  render() {
    console.log("APP ROUTES RENDERED");
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavBar
            onFetchPopular={this.onFetchPopular}
            onSetProfilePage={this.onSetProfilePage}
          />
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route path="/profile/:user" component={ProfilePage} />
            <Route path="/albums/:user/:albumid" component={SingleAlbumPage} />
            <Route path="/post/:id" component={FullPostPage} />
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
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { setUser }
)(AppRouter);
