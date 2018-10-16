import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import Comment from "./Comment";

const styles = theme => ({});

export class CommentList extends React.Component {
  render() {
    return (
      <div>
        <Button>Load Previous</Button>
        {this.props.comments.length > 0 ? (
          this.props.comments.map((comment, i) => (
            <Comment key={i} comment={comment} />
          ))
        ) : (
          <Typography>Be the first to comment!</Typography>
        )}
      </div>
    );
  }
}

CommentList.propTypes = {
  postId: PropTypes.string
};

export default withStyles(styles)(CommentList);
