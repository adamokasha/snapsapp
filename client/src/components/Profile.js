import React from "react";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import classNames from "classnames";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import axios from "axios";

import ProfileHeader from "./ProfileHeader";
import ProfileNetwork from "./ProfileNetwork";
import CustomSnackbar from "./CustomSnackbar";

import { updateProfile } from "../actions/auth";
import { fetchProfile, setProfile } from "../async/profiles";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  paper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginTop: 0,
    padding: `${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up("sm")]: {
      marginTop: `${theme.spacing.unit * 3}px`,
      width: "80%"
    },
    [theme.breakpoints.up("md")]: {
      width: "55%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "35%"
    }
  },
  profileHeading: {
    display: "flex",
    flexDirection: "row"
  },
  profileHeadingMR: {
    marginRight: `${theme.spacing.unit * 3}px`
  },
  linearLoader: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0
  },
  loadingOpacity: {
    opacity: 0.4,
    pointerEvents: "none"
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
  },
  networkDivider: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  form: {
    display: "flex",
    flexDirection: "column",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
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
  textField: {
    width: "65%",
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

export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      displayName: "",
      profilePhoto: "",
      joined: "",
      name: "",
      website: "",
      facebook: "",
      gplus: "",
      twitter: "",
      about: "",
      editEnabled: false,
      ownProfile: false,
      isLoading: false,
      snackbarOpen: false,
      snackbarMessage: null
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      const { data } = await fetchProfile(
        this.signal.token,
        this.props.match.params.user
      );
      const { profilePhoto, joined, displayName, profile, _id } = data;
      this.setState(
        { id: _id, profilePhoto, displayName, joined, ...profile },
        () => {
          return this.checkIfProfileOwner();
        }
      );
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      this.setState(
        { snackbarOpen: true, snackbarMessage: "Could not find profile." },
        () => {}
      );
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  checkIfProfileOwner = () => {
    if (
      this.props.auth &&
      this.props.auth.displayName === this.props.match.params.user
    ) {
      this.setState({ ownProfile: true }, () => {});
    }
  };

  enableEdit = () => {
    this.setState({ editEnabled: true });
  };

  cancelEdit = () => {
    this.setState({
      ...this.state,
      editEnabled: false,
      ...this.props.auth.profile
    });
  };

  onSubmit = e => {
    e.preventDefault();

    this.setState({ isLoading: true }, async () => {
      try {
        const { name, website, facebook, gplus, twitter, about } = this.state;
        const profile = {
          name,
          website,
          facebook,
          gplus,
          twitter,
          about
        };
        await setProfile(this.signal.token, profile);

        console.log(profile);
        this.props.updateProfile(profile);
        this.setState({ editEnabled: false, isLoading: false });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState({
          isLoading: false,
          snackbarOpen: true,
          snackbarMessage: "Could not update profile! Try again."
        });
      }
    });
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
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            {this.state.isLoading && (
              <LinearProgress
                className={classes.linearLoader}
                color="secondary"
              />
            )}
            <div
              className={
                this.state.ownProfile
                  ? classNames(classes.profileHeading, classes.profileHeadingMR)
                  : classes.profileHeading
              }
            >
              <ProfileHeader
                ownProfile={this.state.ownProfile}
                editEnabled={this.state.editEnabled}
                profilePhoto={this.state.profilePhoto}
                displayName={this.state.displayName}
                joined={this.state.joined}
                cancelEdit={this.cancelEdit}
                enableEdit={this.enableEdit}
              />
              <Divider />
              <ProfileNetwork
                ownProfile={this.state.ownProfile}
                userId={this.state.id}
              />
            </div>
            <Divider className={classes.networkDivider} />
            <form
              onSubmit={this.onSubmit}
              className={
                this.state.isLoading
                  ? classNames(classes.form, classes.loadingOpacity)
                  : classes.form
              }
            >
              {(this.state.name || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography variant="body2">Name:</Typography>
                  <TextField
                    margin="normal"
                    inputProps={{ style: { color: "#000" }, maxLength: 30 }}
                    disabled={this.state.editEnabled ? false : true}
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.onNameChange}
                  />
                </div>
              )}

              {(this.state.website || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography variant="body2">Website: </Typography>
                  <TextField
                    className={classes.textField}
                    margin="normal"
                    inputProps={
                      !this.state.editEnabled && this.state.website
                        ? { style: { cursor: "pointer", color: "#3b5999" } }
                        : { maxLength: 60 }
                    }
                    disabled={this.state.editEnabled ? false : true}
                    onClick={this.state.editEnabled ? null : this.onLinkClick}
                    value={this.state.website}
                    onChange={this.onWebsiteChange}
                    placeholder="www.mysite.com"
                  />
                </div>
              )}

              {(this.state.facebook || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography className={classes.socialText} variant="body2">
                    Facebook:{" "}
                  </Typography>
                  <TextField
                    margin="normal"
                    className={classes.textField}
                    inputProps={
                      !this.state.editEnabled && this.state.facebook
                        ? { style: { cursor: "pointer", color: "#3b5999" } }
                        : { maxLength: 60 }
                    }
                    disabled={this.state.editEnabled ? false : true}
                    onClick={this.state.editEnabled ? null : this.onLinkClick}
                    value={this.state.facebook}
                    onChange={this.onFacebookChange}
                    placeholder="facebook.com/my.fb.90"
                  />
                </div>
              )}

              {(this.state.gplus || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography className={classes.socialText} variant="body2">
                    Google+:{" "}
                  </Typography>
                  <TextField
                    margin="normal"
                    className={classes.textField}
                    inputProps={
                      !this.state.editEnabled && this.state.gplus
                        ? { style: { cursor: "pointer", color: "#3b5999" } }
                        : { maxLength: 60 }
                    }
                    disabled={this.state.editEnabled ? false : true}
                    onClick={this.state.editEnabled ? null : this.onLinkClick}
                    value={this.state.gplus}
                    onChange={this.onGplusChange}
                    placeholder="plus.google.com/mygplus90"
                  />
                </div>
              )}

              {(this.state.twitter || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography className={classes.socialText} variant="body2">
                    Twitter:{" "}
                  </Typography>
                  <TextField
                    margin="normal"
                    className={classes.textField}
                    inputProps={
                      !this.state.editEnabled && this.state.twitter
                        ? { style: { cursor: "pointer", color: "#3b5999" } }
                        : { maxLength: 60 }
                    }
                    disabled={this.state.editEnabled ? false : true}
                    onClick={this.state.editEnabled ? null : this.onLinkClick}
                    value={this.state.twitter}
                    onChange={this.onTwitterChange}
                    placeholder="twitter.com/mytwitter"
                  />
                </div>
              )}

              {(this.state.about || this.state.editEnabled) && (
                <div className={classes.fieldGroup}>
                  <Typography variant="body2">About Me: </Typography>
                  <TextField
                    margin="normal"
                    multiline
                    rows={3}
                    inputProps={{ style: { color: "#000" }, maxLength: 140 }}
                    className={classes.textField}
                    disabled={this.state.editEnabled ? false : true}
                    value={this.state.about}
                    onChange={this.onAboutChange}
                  />
                </div>
              )}

              {this.state.ownProfile && (
                <Button
                  className={
                    this.state.editEnabled
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
          </Paper>
        </div>
        <CustomSnackbar
          variant="error"
          message={this.state.snackbarMessage}
          snackbarOpen={this.state.snackbarOpen}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

Profile.propTypes = {
  // user: PropTypes.string
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateProfile }
  )
)(withRouter(Profile));
