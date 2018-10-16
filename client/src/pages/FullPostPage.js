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
      fetchingComments: false,
      hasMoreComments: true
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
          fetchingComments: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState({ fetchingComments: false });
      }
    });
  }

  onLoadPrevious = () => {
    this.setState({ fetchingComments: true, comments: [] }, async () => {
      try {
        const { data: comments } = await fetchPostComments(
          this.signal.token,
          this.state.post._id,
          this.state.commentsPage + 1
        );
        if (!comments.length) {
          return this.setState({
            hasMoreComments: false,
            fetchingComments: false
          });
        }
        this.setState({
          commentsPage: this.state.commentsPage + 1,
          comments: [...comments],
          fetchingComments: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState({ fetchingComments: false });
      }
    });
  };

  onLoadNext = () => {
    this.setState({ fetchingComments: true, comments: [] }, async () => {
      try {
        if (this.state.commentsPage === 0) {
          return this.setState({ fetchingComments: false }, () => {});
        }
        const { data: comments } = await fetchPostComments(
          this.signal.token,
          this.state.post._id,
          this.state.commentsPage - 1
        );
        this.setState({
          commentsPage: this.state.commentsPage - 1,
          comments: [...comments],
          fetchingComments: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState({ fetchingComments: false }, () => {});
      }
    });
  };

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
            post={this.state.post}
            comments={this.state.comments}
            commentsPage={this.state.commentsPage}
            fetchingComments={this.state.fetchingComments}
            onLoadNext={this.onLoadNext}
            onLoadPrevious={this.onLoadPrevious}
            hasMoreComments={this.state.hasMoreComments}
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
