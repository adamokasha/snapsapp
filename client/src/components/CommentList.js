import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import Comment from "./Comment";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  circularProgress: {
    margin: `${theme.spacing.unit * 3}px auto`
  }
});

export const CommentList = props => {
  const { classes, fetchingComments, onFetchComments, comments } = props;
  return (
    <div className={classes.root}>
      <Button onClick={onFetchComments}>Load Previous</Button>
      {fetchingComments && (
        <CircularProgress
          className={classes.circularProgress}
          color="primary"
        />
      )}
      {comments.length > 0 ? (
        comments.map((comment, i) => <Comment key={i} comment={comment} />)
      ) : (
        <Typography>Be the first to comment!</Typography>
      )}
    </div>
  );
};

CommentList.propTypes = {
  postId: PropTypes.string
};

export default withStyles(styles)(CommentList);
