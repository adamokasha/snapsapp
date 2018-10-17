import React from "react";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import axios from "axios";

import NavBar from "../components/NavBar";
import { fetchSinglePost, fetchPostComments } from "../async/posts";

import FullPostImage from "../components/FullPostImage";
import PostHeading from "../components/PostHeading";
import PostActions from "../components/PostActions";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f9f9f9"
  },
  postInfo: {
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px 0`
  },
  commentsContainer: {
    width: "95%",
    padding: `${theme.spacing.unit}px 0`,
    display: "flex",
    flexDirection: "column"
  }
});

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
    const { classes } = this.props;
    const { post, comments, commentsPage, hasMoreComments } = this.state;

    return (
      <React.Fragment>
        <NavBar />
        <div className={classes.root}>
          {this.state.post && (
            <React.Fragment>
              <FullPostImage imgUrl={post.imgUrl} />
              <div className={classes.postInfo}>
                <PostHeading
                  profilePhoto={post._owner.profilePhoto}
                  displayName={post._owner.displayName}
                  title={post.title}
                />
                <PostActions />
              </div>
            </React.Fragment>
          )}
          <div className={classes.commentsContainer}>
            {this.state.comments && (
              <CommentList
                comments={comments}
                commentsPage={commentsPage}
                hasMoreComments={hasMoreComments}
                fetchingComments={this.fetchingComments}
                onLoadNext={this.onLoadNext}
                onLoadPrevious={this.onLoadPrevious}
              />
            )}
            <CommentForm postId={post._id} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FullPostPage.propTypes = {
  location: PropTypes.object
};

export default withStyles(styles)(withRouter(FullPostPage));
