import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: `${theme.spacing.unit}px`
  },
  avatarContainer: {
    display: "flex",
    marginRight: `${theme.spacing.unit * 2}px`
  },
  displayName: {
    marginRight: "4px"
  },
  commentBox: {
    display: "flex",
    flexDirection: "column"
  },
  commentHeading: {
    display: "flex",
    alignItems: "baseline"
  },
  aTag: { textDecoration: "none" }
});

export const Comment = props => {
  const { classes } = props;
  const { _owner, body, createdAt } = props.comment;
  return (
    <div className={classes.root}>
      <div className={classes.avatarContainer}>
        <Link className={classes.aTag} to={`/profile/${_owner.displayName}`}>
          <Avatar>
            <img src={_owner.profilePhoto} />
          </Avatar>
        </Link>
      </div>
      <div className={classes.commentBox}>
        <div className={classes.commentHeading}>
          <Link className={classes.aTag} to={`/profile/${_owner.displayName}`}>
            <Typography
              color="primary"
              variant="body2"
              className={classes.displayName}
            >
              {_owner.displayName}{" "}
            </Typography>
          </Link>
          <Typography variant="caption">
            {moment(createdAt).fromNow(true)}
          </Typography>
        </div>
        <Typography>{body}</Typography>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

export default withStyles(styles)(Comment);
