import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import classNames from "classnames";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import FacebookIcon from "../icons/Facebook";
import TwitterIcon from "../icons/Twitter";
import GlobeIcon from "../icons/Globe";
import { updateProfile } from "../actions/auth";

const styles = theme => ({
  loadingOpacity: {
    opacity: 0.4,
    pointerEvents: "none"
  },
  hidingDivider: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  form: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "start"
    }
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
    width: "100%%"
  },
  socialText: {
    // Stops shaking when edit toggled
    marginTop: `${theme.spacing.unit * 3}px`,
    marginBottom: `12px`
  },
  socialIcons: {
    alignSelf: "center",
    width: "28px",
    height: "28px"
  },
  fbIcon: {
    fill: "#3b5998"
  },
  twitterIcon: {
    fill: "#1da1f2"
  },
  textField: {
    width: "70%",
    marginLeft: `${theme.spacing.unit}px`,
    marginRight: `${theme.spacing.unit * 3}px`
  },
  disabledCursor: {
    cursor: "pointer"
  },
  button: {
    marginTop: `${theme.spacing.unit * 2}px`,
    width: "100%",
    margin: "0 auto"
  },
  hiddenSubmitButton: {
    display: "none"
  }
});

export class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.profile ? this.props.profile.name : "",
      website: this.props.profile ? this.props.profile.website : "",
      facebook: this.props.profile ? this.props.profile.facebook : "",
      twitter: this.props.profile ? this.props.profile.twitter : "",
      location: this.props.profile ? this.props.profile.location : "",
      about: this.props.profile ? this.props.profile.about : ""
    };
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.onProfileSubmit(this.state);
  };

  onNameChange = e => {
    this.setState({ name: e.target.value });
  };
  onWebsiteChange = e => {
    this.setState({ website: e.target.value });
  };
  onFacebookChange = e => {
    this.setState({ facebook: e.target.value });
  };
  onGplusChange = e => {
    this.setState({ gplus: e.target.value });
  };
  onTwitterChange = e => {
    this.setState({ twitter: e.target.value });
  };
  onLocationChange = e => {
    this.setState({ location: e.target.value });
  };
  onAboutChange = e => {
    this.setState({ about: e.target.value });
  };

  onLinkClick = e => {
    if (!e.target.value) {
      return;
    }
    var win = window.open(`http://${e.target.value}`, "_blank");
    win.focus();
  };

  render() {
    const { classes, profile } = this.props;
    const { name, website, facebook, twitter, about } = this.state;

    return (
      <form
        onSubmit={this.onSubmit}
        className={
          this.props.isLoading
            ? classNames(classes.form, classes.loadingOpacity)
            : classes.form
        }
      >
        <div>
          {(name || this.props.editEnabled || this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <Typography variant="body2">Name:</Typography>
              <TextField
                margin="normal"
                inputProps={{ style: { color: "#000" }, maxLength: 28 }}
                disabled={this.props.editEnabled ? false : true}
                className={classes.textField}
                value={this.state.name}
                onChange={this.onNameChange}
                placeholder="Your name"
              />
            </div>
          )}

          {(website || this.props.editEnabled || this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <Typography variant="body2">Website: </Typography>
              <TextField
                className={classes.textField}
                margin="normal"
                inputProps={
                  !this.props.editEnabled && website
                    ? { style: { cursor: "pointer", color: "#3b5999" } }
                    : { maxLength: 60 }
                }
                disabled={this.props.editEnabled ? false : true}
                onClick={this.props.editEnabled ? null : this.onLinkClick}
                value={this.state.website}
                onChange={this.onWebsiteChange}
                placeholder="www.mysite.com"
              />
            </div>
          )}

          {(this.state.location ||
            this.props.editEnabled ||
            this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <GlobeIcon classes={{ root: classes.socialIcons }} />
              <TextField
                margin="normal"
                inputProps={{ style: { color: "#000" }, maxLength: 28 }}
                disabled={this.props.editEnabled ? false : true}
                className={classes.textField}
                value={this.state.location}
                onChange={this.onLocationChange}
              />
            </div>
          )}
        </div>

        <div>
          {(facebook || this.props.editEnabled || this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <FacebookIcon
                classes={{
                  root: classNames(classes.socialIcons, classes.fbIcon)
                }}
              />
              <TextField
                margin="normal"
                className={classes.textField}
                inputProps={
                  !this.props.editEnabled && facebook
                    ? { style: { cursor: "pointer", color: "#3b5999" } }
                    : { maxLength: 60 }
                }
                disabled={this.props.editEnabled ? false : true}
                onClick={this.props.editEnabled ? null : this.onLinkClick}
                value={this.state.facebook}
                onChange={this.onFacebookChange}
                placeholder="facebook.com/my.fb.90"
              />
            </div>
          )}

          {(twitter || this.props.editEnabled || this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <TwitterIcon
                classes={{
                  root: classNames(classes.socialIcons, classes.twitterIcon)
                }}
              />
              <TextField
                margin="normal"
                className={classes.textField}
                inputProps={
                  !this.props.editEnabled && twitter
                    ? { style: { cursor: "pointer", color: "#3b5999" } }
                    : { maxLength: 60 }
                }
                disabled={this.props.editEnabled ? false : true}
                onClick={this.props.editEnabled ? null : this.onLinkClick}
                value={this.state.twitter}
                onChange={this.onTwitterChange}
                placeholder="twitter.com/mytwitter"
              />
            </div>
          )}

          {(about || this.props.editEnabled || this.props.ownProfile) && (
            <div className={classes.fieldGroup}>
              <Typography variant="body2">About: </Typography>
              <TextField
                margin="normal"
                multiline
                rows={3}
                inputProps={{ style: { color: "#000" }, maxLength: 140 }}
                className={classes.textField}
                disabled={this.props.editEnabled ? false : true}
                value={this.state.about}
                onChange={this.onAboutChange}
                placeholder="Something about yourself"
              />
            </div>
          )}
        </div>

        {this.props.ownProfile && (
          <Button
            className={
              this.props.editEnabled
                ? classes.button
                : classes.hiddenSubmitButton
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        )}
      </form>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

ProfileForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateProfile }
  )
)(withRouter(ProfileForm));
