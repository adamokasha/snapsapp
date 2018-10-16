import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f9f9f9"
  },
  imgContainer: {
    width: "100%",
    height: "80vh",
    margin: "0",
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    backgroundColor: "#212124"
  },
  img: {
    // maintain aspect ratio
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  postInfo: {
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px 0`
  },
  infoLeft: {
    display: "flex",
    flexDirection: "column"
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row"
  },
  avatar: {
    width: "50px",
    height: "50px",
    marginRight: `${theme.spacing.unit * 2}px`
  },
  descContainer: {
    marginTop: `${theme.spacing.unit}px`,
    marginLeft: `${theme.spacing.unit * 2 + 50}px`
  },
  infoRight: {},
  infoRightButtons: {
    display: "flex",
    alignItems: "baseline"
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
    color: "rgba(0, 0, 0, 0.70)"
  },
  buttonMargin: {
    marginLeft: `${theme.spacing.unit}px`
  },
  commentsContainer: {
    width: "95%",
    padding: `${theme.spacing.unit}px 0`,
    display: "flex",
    flexDirection: "column"
  }
});

export const FullPost = props => {
  const { classes } = props;
  const { post } = props;

  return (
    <React.Fragment>
      {props.post && (
        <div className={classes.root}>
          <div className={classes.imgContainer}>
            <img
              className={classes.img}
              src={`https://s3.amazonaws.com/img-share-kasho/${post.imgUrl}`}
            />
          </div>
          <div className={classes.postInfo}>
            <div className={classes.infoLeft}>
              <div className={classes.avatarContainer}>
                <Avatar
                  to={`/profile/${post._owner.displayName}`}
                  component={Link}
                  src={post._owner.profilePhoto}
                  className={classes.avatar}
                />
                <div>
                  <Typography variant="body2">{post.title}</Typography>
                  <Typography variant="caption" gutterBottom>
                    {post._owner.displayName}
                  </Typography>
                </div>
              </div>
              <div className={classes.descContainer}>
                <Typography variant="caption">
                  {moment(post.createdAt).fromNow()}
                </Typography>
                <Typography variant="body1">{post.description}</Typography>
              </div>
            </div>
            <div className={classes.infoRight}>
              <div className={classes.infoRightButtons}>
                <Button size="small">
                  <FavoriteTwoToneIcon
                    color="inherit"
                    className={classes.leftIcon}
                  />
                  {post.faveCount}
                </Button>
                <Button size="small" className={classes.buttonMargin}>
                  <ShareTwoToneIcon />
                </Button>
              </div>
            </div>
          </div>
          {props.comments && (
            <div className={classes.commentsContainer}>
              <CommentList
                comments={props.comments}
                commentsPage={props.commentsPage}
                fetchingComments={props.fetchingComments}
                onLoadNext={props.onLoadNext}
                onLoadPrevious={props.onLoadPrevious}
                hasMoreComments={props.hasMoreComments}
              />
              <CommentForm postId={post._id} />
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth
});

FullPost.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  commentsPage: PropTypes.number.isRequired,
  fetchingComments: PropTypes.bool.isRequired,
  onLoadNext: PropTypes.func.isRequired,
  onLoadPrevious: PropTypes.func.isRequired,
  hasMoreComments: PropTypes.bool.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(FullPost);
