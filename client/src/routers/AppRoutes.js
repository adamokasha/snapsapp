import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
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

import AlbumMaker from "../components/AlbumMaker";
import MyAlbumsPage from "../pages/MyAlbumsPage";
import ProfileTabs from "../components/ProfileTabs";
import SingleAlbumPage from "../pages/SingleAlbumPage";
import FullPostPage from "../pages/FullPostPage";
import ProfilePage from "../pages/ProfilePage";
import MessageBoxPage from "../pages/MessageBoxPage";

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
    console.log("AppRoutes", this.props);
    try {
      const [{ data: userData }, { data: popularPosts }] = await axios.all([
        fetchUser(),
        fetchPopular(this.signal.token, 0)
      ]);
      console.log(userData, popularPosts);
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

  onSetProfilePage = (context, user, profileTabPos = 1, ownProfile) => {
    console.log(context, user, profileTabPos, ownProfile);
    try {
      this.props.history.push(`/profile/${user}`);
      // Contexts: userPosts, userFaves, userAlbums
      this.setState({ isFetching: true, pages: [] }, async () => {
        let profileData;
        let postData;
        // If navigating to own profile, pull profile data from redux store
        if (ownProfile) {
          profileData = this.props.auth;
          const { data } = await fetchForProfilePage(
            this.signal.token,
            context,
            0,
            user
          );
          postData = data;
        } else {
          // Else fetch all data from api
          const [{ data: userProfile }, { data: userPosts }] = await axios.all([
            fetchProfile(this.signal.token, user),
            fetchForProfilePage(this.signal.token, context, 0, user)
          ]);
          profileData = userProfile;
          postData = userPosts;
        }
        console.log(profileData, postData);

        this.setState({
          view: "profilepage",
          isFetching: false,
          profile: profileData,
          pages: [postData],
          ownProfile,
          profileTabPos,
          context
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
    console.log(this.state);
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
                path="/profile/:user"
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
