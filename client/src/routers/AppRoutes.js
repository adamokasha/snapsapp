import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import pathToRegexp from "path-to-regexp";
import axios from "axios";

import NavBar from "../components/NavBar";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainPage from "../pages/MainPage";
import RegisterOrLogin from "../pages/RegisterOrLogin";
import RegisterUserPage from "../pages/RegisterUserPage";
import AddPostPage from "../pages/AddPostPage";
import PrivacyPolicy from "../components/PrivacyPolicy";

import { fetchUser } from "../async/auth";
import { fetchPopular, fetchUserPosts } from "../async/posts";
import { fetchProfile } from "../async/profiles";
import { fetchForProfilePage } from "../async/scrollview";

import { setUser } from "../actions/auth";

import MyAlbumsPage from "../pages/MyAlbumsPage";
import ProfileTabs from "../components/ProfileTabs";
import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

const profileKeys = [];
const profilePath = pathToRegexp("/profile/:user", profileKeys);
const homePath = pathToRegexp("/");

export class AppRoutes extends React.Component {
  constructor() {
    super();
    this.state = {
      view: "routes",
      context: "popular",
      isFetching: true,
      hasInitMounted: false,
      pages: null,
      profile: null,
      ownProfile: false,
      profileTabPos: 1
    };
    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    let splitPathname = this.props.location.pathname.split("/");
    console.log(splitPathname);

    if (profilePath.test(this.props.location.pathname)) {
      let user = splitPathname[splitPathname.length - 1];
      return this.onSetProfilePage("userPosts", user, 1);
    }

    try {
      const [{ data: userData }, { data: popularPosts }] = await axios.all([
        fetchUser(),
        fetchPopular(this.signal.token, 0)
      ]);
      this.props.setUser(userData);

      // this.props.setPosts(popularPosts);
      this.setState(
        {
          view: "mainpage",
          isFetching: false,
          hasInitMounted: true,
          pages: [popularPosts]
        },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  onFetchUser = () => {};

  onFetchPopular = () => {
    try {
      this.setState({ isFetching: true }, async () => {
        const { data: popularPosts } = await fetchPopular(this.signal.token, 0);
        this.setState(
          {
            pages: [popularPosts],
            isFetching: false,
            view: "mainpage"
          },
          () => {}
        );
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  onSetProfilePage = (context, user, profileTabPos = 1) => {
    try {
      // Contexts: userPosts, userFaves, userAlbums
      this.setState({ isFetching: true, pages: [] }, async () => {
        const [{ data: auth }, { data: pages }] = await axios.all([
          fetchUser(),
          fetchForProfilePage(this.signal.token, context, 0, user)
        ]);

        this.props.setUser(auth);
        let profile;
        // If own profile, set profile from redux store
        if (auth && auth.displayName === user) {
          profile = auth;
        } else {
          const { data: profileData } = await fetchProfile(
            this.signal.token,
            user
          );
          profile = profileData;
        }

        this.setState({
          view: "profilepage",
          isFetching: false,
          profile: profile,
          pages: [pages],
          profileTabPos,
          context,
          hasInitMounted: true
        });
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.hasInitMounted && (
          <NavBar
            onFetchPopular={this.onFetchPopular}
            onSetProfilePage={this.onSetProfilePage}
          />
        )}
        <Switch>
          {(!this.state.hasInitMounted || this.state.isFetching) && (
            <React.Fragment>
              <div>Loading...</div>
            </React.Fragment>
          )}

          {this.state.hasInitMounted &&
            this.state.isFetching && (
              <React.Fragment>
                <div>Loading...</div>
              </React.Fragment>
            )}

          {!this.state.isFetching &&
            this.state.view === "mainpage" && (
              <Route
                exact
                path="/"
                component={() => <MainPage page={1} pages={this.state.pages} />}
              />
            )}

          {!this.state.isFetching &&
            this.state.view === "profilepage" && (
              <Route
                path={"/profile/:id"}
                component={() => (
                  <ProfilePage
                    profile={this.state.profile}
                    ownProfile={this.state.ownProfile}
                    pages={this.state.pages}
                  >
                    <ProfileTabs
                      profileTabPos={this.state.profileTabPos}
                      pages={this.state.pages}
                      user={this.state.profile.displayName}
                    />
                  </ProfilePage>
                )}
              />
            )}

          {/* <Route path="/profile/:user" component={ProfilePage} /> */}
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

          {/* <Route path="/albummaker" component={AlbumMaker} /> */}
          {/* <PrivateRoute exact path="/myalbums" component={MyAlbumsPage} /> */}
          {/* <Route path="/post/:id" component={FullPost} /> */}
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { setUser }
  )(AppRoutes)
);
