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
      comments: []
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    try {
      if (!this.props.location.state) {
        const { id } = this.props.match.params;
        const { data: post } = await fetchSinglePost(this.signal.token, id);
        const { data: comments } = await fetchPostComments(
          this.signal.token,
          id,
          this.state.commentsPage
        );
        return this.setState({ post, comments: [...comments] }, () => {});
      }

      const { post } = this.props.location.state;
      const { data: comments } = await fetchPostComments(
        this.signal.token,
        post._id,
        this.state.commentsPage
      );
      this.setState({ post: post, comments: [...comments] });
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

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

  onFetchComments = async () => {
    try {
      const res = await axios.get(
        `/api/posts/comments/all/${this.state.post._id}/${
          this.state.commentPage
        }`
      );
      this.setState(
        {
          commentPage: this.state.currentPage + 1,
          comments: [...res.data]
        },
        () => {}
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        <NavBar />
        {this.state.post && (
          <FullPost
            onFetchComment={this.onFetchComments}
            comments={this.state.comments}
            post={this.state.post}
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
