import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";

import NavBar from "../components/NavBar";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainPage from "../pages/MainPage";
import RegisterOrLogin from "../pages/RegisterOrLogin";
import RegisterUserPage from "../pages/RegisterUserPage";
import AddPostPage from "../pages/AddPostPage";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { setUser } from "../actions/auth";
import { setPosts, clearPosts } from "../actions/posts";
import { fetchUser } from "../async/auth";
import { fetchPopular } from "../async/posts";
import { fetchForProfilePage } from "../async/scrollview";

import AlbumMaker from "../components/AlbumMaker";
import MyAlbumsPage from "../pages/MyAlbumsPage";
import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

export class AppRouter extends React.Component {
  constructor() {
    super();
    this.state = {
      view: "routes",
      pages: null,
      profileTabPos: 1,
      isFetching: true,
      initialMount: false
    };
    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      const [{ data: userData }, { data: postData }] = await axios.all([
        fetchUser(),
        fetchPopular(this.signal.token, 0)
      ]);
      console.log(userData, postData);
      await this.props.setUser(userData);
      this.setState(
        {
          pages: [postData],
          isFetching: false,
          initialMount: true,
          view: "mainpage",
          profileTabPos: 1
        },
        () => {
          this.props.setPosts(postData);
        }
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  onProfileSwitch = (context, user, profileTabPos) => {
    try {
      // Contexts: userPosts, userFaves, userAlbums
      this.setState(
        { isFetching: true, pages: [], view: "profile" },
        async () => {
          this.props.clearPosts();
          await fetchForProfilePage(this.signal.token, context, 0, user);
          this.setState(
            { isFetching: false, profileTabPos, view: "profile" },
            () => {}
          );
        }
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.state.initialMount && (
            <NavBar onProfileSwitch={this.onProfileSwitch} />
          )}
          <Switch>
            {!this.state.isFetching &&
              this.state.view === "mainpage" && (
                <Route
                  exact
                  path="/"
                  component={() => (
                    <MainPage
                      pages={this.state.pages}
                      page={1}
                      context="popular"
                    />
                  )}
                />
              )}

            {(!this.state.initialMount || this.state.isFetching) && (
              <div>Loading...</div>
            )}

            {this.state.view === "profile" &&
              !this.state.isFetching && (
                <ProfilePage profileTabPos={this.state.profileTabPos} />
              )}

            <Route path="/profile/:user" component={ProfilePage} />

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
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { setUser, setPosts, clearPosts }
)(AppRouter);
