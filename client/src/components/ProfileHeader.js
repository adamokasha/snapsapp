import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  editButtons: {
    position: "absolute",
    top: "1%",
    right: "2%"
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

export class ProfileHeader extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div
          className={
            this.props.ownProfile
              ? classes.editButtons
              : classes.hideEditButtons
          }
        >
          {this.props.editEnabled ? (
            <IconButton onClick={this.props.cancelEdit}>
              <CancelTwoToneIcon />
            </IconButton>
          ) : (
            <IconButton onClick={this.props.enableEdit}>
              <EditTwoToneIcon />
            </IconButton>
          )}
        </div>
        <div className={classes.avatarContainer}>
          <Avatar>
            <img src={`${this.props.profilePhoto}`} alt="avatar" />
          </Avatar>
          <div className={classes.userText}>
            <Typography variant="body2">{this.props.displayName}</Typography>
            <Typography variant="caption">
              Member since {this.props.joined}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

ProfileHeader.propTypes = {
  // ownProfile,
  // editEnabled,
  // profilePhoto,
  // displayName,
  // joined
};

export default withStyles(styles)(ProfileHeader);
