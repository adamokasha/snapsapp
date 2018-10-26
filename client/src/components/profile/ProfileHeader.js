import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

export const ProfileHeader = props => {
  const { classes, profilePhoto, displayName, joined } = props;

  return (
    <div className={classes.root}>
      <div className={classes.avatarContainer}>
        <Avatar>
          <img src={`${profilePhoto}`} alt="avatar" />
        </Avatar>
        <div className={classes.userText}>
          <Typography variant="body2">{displayName}</Typography>
          <Typography variant="caption">
            {joined && `Joined ${moment(joined).format("MMM YY")}`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  ownProfile: PropTypes.bool,
  profilePhoto: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  joined: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
};

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  avatarContainer: {
    display: "flex",
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  userText: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

export default withStyles(styles)(ProfileHeader);
