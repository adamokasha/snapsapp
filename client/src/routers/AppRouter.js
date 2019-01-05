import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AppBar from "../components/appbar/AppBar";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainPage from "../pages/MainPage";
import RegisterOrLogin from "../pages/RegisterOrLogin";
import RegisterUserPage from "../pages/RegisterUserPage";
import AddPostPage from "../pages/AddPostPage";
import PrivacyPolicy from "../components/auth/PrivacyPolicy";
import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

import { fetchUser } from "../async/auth";
import { setUser } from "../actions/auth";

export class AppRouter extends React.Component {
  state = {
    fetchingUser: true
  };
  async componentDidMount() {
    try {
      const { data: userData } = await fetchUser();
      this.props.setUser(userData);
      this.setState({ fetchingUser: false });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AppBar />
          <Switch>
            {this.state.fetchingUser ? (
              <div>LOADING</div>
            ) : (
              <Route
                exact
                path="/"
                component={() => <MainPage auth={this.props.auth} />}
              />
            )}
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
            <Route path="/privacy" component={PrivacyPolicy} />
            <PrivateRoute path="/upload" component={AddPostPage} />
            <PrivateRoute path="/mbox" component={MessageBoxPage} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = auth => ({
  auth
});

export default connect(
  mapStateToProps,
  { setUser }
)(AppRouter);
