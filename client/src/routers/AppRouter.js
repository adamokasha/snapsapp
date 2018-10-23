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
import { fetchUser } from "../async/auth";
import { fetchPopular } from "../async/posts";

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
      isFetching: true,
      pages: null,
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
      this.props.setUser(userData);

      // this.props.setPosts(postData);
      this.setState(
        {
          view: "mainpage",
          isFetching: false,
          initialMount: true,
          pages: [postData]
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

  onFetchPopular = () => {
    try {
      this.setState({ isFetching: true }, async () => {
        const { data: postData } = await fetchPopular(this.signal.token, 0);
        this.props.setUI({
          page: 1,
          isFetching: false,
          context: "posts",
          hasMore: true
        });
        this.setState(
          {
            pages: [postData],
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

  // onProfileSwitch = (context, user, profileTabPos) => {
  //   try {
  //     // Contexts: userPosts, userFaves, userAlbums
  //     this.setState(
  //       { isFetching: true, pages: [], view: "profile" },
  //       async () => {
  //         this.props.clearPosts();
  //         await fetchScrollViewData(this.signal.token, context, 0, user);
  //         this.setState(
  //           { isFetching: false, profileTabPos, view: "profile" },
  //           () => {}
  //         );
  //       }
  //     );
  //   } catch (e) {
  //     if (axios.isCancel()) {
  //       return console.log(e.message);
  //     }
  //     console.log(e);
  //   }
  // };

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.state.initialMount && (
            <NavBar
              onFetchPopular={this.onFetchPopular}
              onProfileSwitch={this.onProfileSwitch}
            />
          )}
          <Switch>
            {!this.state.isFetching &&
              this.state.view === "mainpage" && (
                <Route
                  exact
                  path="/"
                  component={() => (
                    <MainPage page={1} pages={this.state.pages} />
                  )}
                />
              )}

            {(!this.state.initialMount || this.state.isFetching) && (
              <React.Fragment>
                <div>Loading...</div>
              </React.Fragment>
            )}

            <Route
              path="/myprofile/"
              component={() =>
                this.state.view === "profile" &&
                !this.state.isFetching && (
                  <ProfilePage profileTabPos={this.state.profileTabPos} />
                )
              }
            />

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
  { setUser }
)(AppRouter);
