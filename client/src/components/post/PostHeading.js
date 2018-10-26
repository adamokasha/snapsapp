import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

export const PostHeading = props => {
  const { profilePhoto, displayName, title, classes } = props;

  return (
    <div className={classes.avatarContainer}>
      <Avatar
        to={`/profile/${displayName}`}
        component={Link}
        src={profilePhoto}
        className={classes.avatar}
      />
      <div>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="caption" gutterBottom>
          {displayName}
        </Typography>
      </div>
    </div>
  );
};

PostHeading.propTypes = {
  classes: PropTypes.object.isRequired,
  profilePhoto: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

const styles = theme => ({
  avatarContainer: {
    display: "flex",
    flexDirection: "row"
  },
  avatar: {
    width: "50px",
    height: "50px",
    marginRight: `${theme.spacing.unit * 2}px`
  }
});

export default withStyles(styles)(PostHeading);
