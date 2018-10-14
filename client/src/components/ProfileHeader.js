import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import moment from "moment";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  editButtons: {
    display: "none",
    position: "absolute",
    top: "1%",
    right: "2%",
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex"
    }
  },
  hideEditButtons: {
    display: "none"
  },
  avatarContainer: {
    display: "flex",
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  userText: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

export const ProfileHeader = props => {
  const {
    classes,
    cancelEdit,
    enableEdit,
    ownProfile,
    editEnabled,
    profilePhoto,
    displayName,
    joined
  } = props;

  return (
    <div className={classes.root}>
      <div
        className={ownProfile ? classes.editButtons : classes.hideEditButtons}
      >
        {editEnabled ? (
          <IconButton onClick={cancelEdit}>
            <CancelTwoToneIcon />
          </IconButton>
        ) : (
          <IconButton onClick={enableEdit}>
            <EditTwoToneIcon />
          </IconButton>
        )}
      </div>
      <div className={classes.avatarContainer}>
        <Avatar>
          <img src={`${profilePhoto}`} alt="avatar" />
        </Avatar>
        <div className={classes.userText}>
          <Typography variant="body2">{displayName}</Typography>
          <Typography variant="caption">
            Joined {moment(joined).format("MMM YY")}
          </Typography>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  ownProfile: PropTypes.bool.isRequired,
  editEnabled: PropTypes.bool.isRequired,
  profilePhoto: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  joined: PropTypes.number.isRequired,
  cancelEdit: PropTypes.func,
  enableEdit: PropTypes.func
};

export default withStyles(styles)(ProfileHeader);
