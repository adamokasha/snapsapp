import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";

import FullPostImage from "../components/post/FullPostImage";
import PostHeading from "../components/post/PostHeading";
import PostActions from "../components/post/PostActions";
import PostDescription from "../components/post/PostDescription";
import PostTags from "../components/post/PostTags";
import CommentList from "../components/post/CommentList";
import CommentForm from "../components/post/CommentForm";
import {
  fetchSinglePost,
  fetchPostComments,
  addComment,
  favePost
} from "../async/posts";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    background: "#f9f9f9"
  },
  postInfo: {
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px 0`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: `${theme.spacing.unit}px`
    }
  },
  commentsContainer: {
    width: "95%",
    padding: `${theme.spacing.unit}px 0`,
    margin: `0 auto`,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      marginLeft: `${theme.spacing.unit}px`
    },
    [theme.breakpoints.up("md")]: {
      width: "40%",
      marginLeft: `${theme.spacing.unit}px`
    },
    [theme.breakpoints.up("lg")]: {
      width: "30%",
      marginLeft: `${theme.spacing.unit}px`
    }
  }
});

export class FullPostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialFetch: true,
      post: this.props.location.state ? this.props.location.state.post : null,
      commentsPage: 0,
      comments: null,
      fetchingComments: true,
      hasMoreComments: true,
      addingComment: false,
      isFaving: false
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    try {
      if (!this.props.location.state) {
        const { id } = this.props.match.params;
        const [{ data: postData }, { data: commentData }] = await axios.all([
          fetchSinglePost(this.signal.token, id),
          fetchPostComments(this.signal.token, id, this.state.commentsPage)
        ]);

        if (!commentData.length) {
          return this.setState(
            {
              initialFetch: false,
              post: postData,
              fetchingComments: false,
              hasMoreComments: false
            },
            () => {}
          );
        }

        return this.setState(
          {
            initialFetch: false,
            post: postData,
            comments: [...commentData],
            fetchingComments: false
          },
          () => {}
        );
      }

      const { post } = this.props.location.state;
      const { data: comments } = await fetchPostComments(
        this.signal.token,
        post._id,
        this.state.commentsPage
      );

      if (!comments.length) {
        return this.setState(
          {
            initialFetch: false,
            fetchingComments: false,
            hasMoreComments: false
          },
          () => {}
        );
      }

      this.setState({
        initialFetch: false,
        comments: [...comments],
        fetchingComments: false
      });
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      this.setState({ initialFetch: false, fetchingComments: false });
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

  onAddComment = commentBody => {
    this.setState({ addingComment: true }, async () => {
      try {
        await addComment(this.signal.token, this.state.post._id, commentBody);
        // Generate comment client side to avoid another MongoDB operation
        const { displayName, profilePhoto } = this.props.auth;
        const comment = {
          _id: Math.floor(Math.random() * 100),
          body: commentBody,
          createdAt: Date.now(),
          _owner: {
            displayName,
            profilePhoto
          }
        };
        this.setState({
          comments: [...this.state.comments, { ...comment }],
          addingComment: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState({ addingComment: false });
      }
    });
  };

  onFavePost = () => {
    this.setState({ isFaving: true }, async () => {
      try {
        await favePost(this.signal.token, this.state.post._id);
        this.setState({
          post: {
            ...this.state.post,
            isFave: !this.state.post.isFave,
            faveCount: this.state.post.faveCount
              ? this.state.post.faveCount - 1
              : this.state.post.faveCount + 1
          },
          isFaving: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        console.log(e);
        this.setState({ isFaving: false }, () => {});
      }
    });
  };

  render() {
    console.log("FULLPOSTPAGE RENDERED");
    const { classes, auth } = this.props;
    const {
      post,
      comments,
      commentsPage,
      fetchingComments,
      hasMoreComments,
      addingComment,
      isFaving
    } = this.state;

    return (
      <div className={classes.root}>
        {!this.state.post &&
          (!this.props.location.state &&
            this.state.initialFetch && <div>Loading...</div>)}
        {this.state.post && (
          <React.Fragment>
            <FullPostImage imgUrl={post.imgUrl} />
            <div className={classes.postInfo}>
              <PostHeading
                profilePhoto={post._owner.profilePhoto}
                displayName={post._owner.displayName}
                title={post.title}
              />
              <PostActions
                canFave={auth ? true : false}
                onFavePost={this.onFavePost}
                isFaving={isFaving}
                isFave={post.isFave}
                faveCount={post.faveCount}
              />
            </div>
          </React.Fragment>
        )}
        <div className={classes.commentsContainer}>
          {this.state.post && (
            <PostDescription
              createdAt={post.createdAt}
              description={post.description}
            />
          )}
          {this.state.post && <PostTags tags={this.state.post.tags} />}

          {(this.props.location.state || !this.state.initialFetch) && (
            <CommentList
              comments={comments}
              commentsPage={commentsPage}
              hasMoreComments={hasMoreComments}
              fetchingComments={fetchingComments}
              onLoadNext={this.onLoadNext}
              onLoadPrevious={this.onLoadPrevious}
            />
          )}
          {auth &&
            !fetchingComments && (
              <CommentForm
                onAddComment={this.onAddComment}
                addingComment={addingComment}
              />
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = auth => ({
  auth
});

FullPostPage.propTypes = {
  location: PropTypes.object,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(withRouter(FullPostPage));
