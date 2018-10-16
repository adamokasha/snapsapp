import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";

import NavBar from "../components/NavBar";
import FullPost from "../components/FullPost";
import { fetchSinglePost, fetchPostComments } from "../async/posts";

export class FullPostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.location.state ? this.props.location.state.post : null,
      commentsPage: 0,
      comments: [],
      fetchingComments: false
    };

    this.signal = axios.CancelToken.source();
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.setState({ fetchingComments: true }, async () => {
      try {
        if (!this.props.location.state) {
          const { id } = this.props.match.params;
          const { data: post } = await fetchSinglePost(this.signal.token, id);

          return this.setState(
            {
              post
            },
            async () => {
              const { data: comments } = await fetchPostComments(
                this.signal.token,
                id,
                this.state.commentsPage
              );
              this.setState({
                comments: [...comments],
                commentsPage: this.state.commentsPage + 1,
                fetchingComments: false
              });
            }
          );
        }

        const { post } = this.props.location.state;
        const { data: comments } = await fetchPostComments(
          this.signal.token,
          post._id,
          this.state.commentsPage
        );
        this.setState({
          comments: [...comments],
          commentsPage: this.state.commentsPage + 1,
          fetchingComments: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  }

  onFetchComments = async () => {
    try {
      const { post, commentsPage } = this.state;
      const { data: comments } = await fetchPostComments(
        this.signal.token,
        post._id,
        commentsPage
      );
      this.setState(
        {
          commentPage: this.state.commentsPage + 1,
          comments: [...comments]
        },
        () => {}
      );
    } catch (e) {
      console.log(e);
    }
  };

  // onLoadPrevious = () => {
  //   try {
  //     const { data: comments } = await fetchPostComments(
  //       this.signal.token,
  //       this.state.post._id,
  //       this.state.commentsPage
  //     );
  //   } catch (e) {

  //   }
  // };

  // onLoadNext = () => {
  //   try {

  //   } catch (e) {

  //   }
  // };

  componentDidUpdate(prevProps) {
    // Case of uploading new post in modal while FullPostPage is mounted
    if (
      this.props.location.state &&
      this.props.location.state.post !== prevProps.location.state.post
    ) {
      this.setState({ post: this.props.location.state.post }, () => {});
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.post && (
          <FullPost
            onFetchComments={this.onFetchComments}
            comments={this.state.comments}
            post={this.state.post}
            fetchingComments={this.state.fetchingComments}
          />
        )}
      </div>
    );
  }
}

FullPostPage.propTypes = {
  location: PropTypes.object
};

export default withRouter(FullPostPage);
