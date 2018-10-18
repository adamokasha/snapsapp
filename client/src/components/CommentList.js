import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import Comment from "./Comment";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  circularProgress: {
    margin: `${theme.spacing.unit * 3}px auto`
  },
  paginationControls: {
    marginBottom: `${theme.spacing.unit}px`
  },
  buttonRoot: {
    minWidth: `48px`
  },
  leftButton: {
    marginRight: `${theme.spacing.unit}px`
  },
  leftIcon: {
    marginRight: "4px"
  },
  iconRoot: {
    fontSize: "16px"
  },
  rightIcon: {
    marginLeft: "4px"
  }
});

export const CommentList = props => {
  const {
    classes,
    comments,
    commentsPage,
    hasMoreComments,
    fetchingComments,
    onLoadNext,
    onLoadPrevious
  } = props;
  return (
    <div className={classes.root}>
      <div className={classes.paginationControls}>
        <Button
          classes={{ root: classes.buttonRoot }}
          variant="outlined"
          size="small"
          className={classes.leftButton}
          onClick={onLoadPrevious}
          disabled={!hasMoreComments || comments.length < 20}
        >
          <ArrowBackIcon
            classes={{ root: classes.iconRoot }}
            className={classes.leftIcon}
          />
        </Button>
        <Button
          classes={{ root: classes.buttonRoot }}
          variant="outlined"
          size="small"
          onClick={onLoadNext}
          disabled={commentsPage === 0}
        >
          <ArrowForwardIcon
            classes={{ root: classes.iconRoot }}
            className={classes.rightIcon}
          />
        </Button>
      </div>
      {fetchingComments && (
        <CircularProgress
          className={classes.circularProgress}
          color="primary"
        />
      )}
      {comments &&
        comments.map((comment, i) => <Comment key={i} comment={comment} />)}
      {!comments &&
        !fetchingComments && <Typography>No comments yet.</Typography>}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  commentsPage: PropTypes.number.isRequired,
  fetchingComments: PropTypes.bool.isRequired,
  onLoadNext: PropTypes.func.isRequired,
  onLoadPrevious: PropTypes.func.isRequired,
  hasMoreComments: PropTypes.bool.isRequired
};

export default withStyles(styles)(CommentList);
