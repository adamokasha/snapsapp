import React from "react";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import axios from "axios";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileNetwork from "../components/profile/ProfileNetwork";
import ProfileNetworkMenu from "../components/profile/ProfileNetworkMenu";
import ProfileMessageForm from "../components/profile/ProfileMessageForm";
import ProfileForm from "../components/profile/ProfileForm";
import ShareButton from "../components/buttons/ShareButton";
import ProfileActivity from "../components/profile/ProfileActivity";
import ModalView from "../components/modal/ModalView";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

import { sendMessage } from "../async/messages";
import { updateProfile } from "../actions/auth";

import {
  fetchProfile,
  setProfile,
  fetchFollows,
  onFollow,
  onUnfollow
} from "../async/profiles";
import { fetchForProfilePage } from "../async/combined";

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      id: "",
      profile: null,
      editEnabled: false,
      isUpdatingProfile: false,
      network: {},
      isUpdatingNetwork: false,
      pages: [],
      profileTabPos: this.props.location.state
        ? this.props.location.state.profileTabPos
        : 1,
      snackbarVar: null,
      snackbarMessage: null,
      snackbarOpen: false
    };

    this.signal = axios.CancelToken.source();
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.user !== prevProps.match.params.user) {
      this.setState({ isFetching: true }, () => {
        this.fetchProfile();
      });
    }

    if (
      this.props.location.state &&
      this.props.location.state.profileTabPos !== this.state.profileTabPos
    ) {
      this.setState({
        profileTabPos: this.props.location.state.profileTabPos
      });
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  fetchProfile = async () => {
    try {
      const asyncContextMap = {
        0: "userFaves",
        1: "userPosts",
        2: "userAlbums"
      };
      const context = asyncContextMap[this.state.profileTabPos];
      const [
        { data: userData },
        { data: userPosts },
        { data: userNetwork }
      ] = await axios.all([
        fetchProfile(this.signal.token, this.props.match.params.user),
        fetchForProfilePage(
          this.signal.token,
          context,
          0,
          this.props.match.params.user
        ),
        fetchFollows(this.signal.token, this.props.match.params.user)
      ]);

      const { profilePhoto, joined, displayName, profile, _id } = userData;
      const { followsCount, followersCount, clientFollows } = userNetwork;

      this.setState(
        {
          id: _id,
          pages: [...userPosts],
          profilePhoto,
          displayName,
          joined,
          profile,
          ownProfile: this.props.ownProfile,
          network: {
            clientFollows,
            followersCount,
            followsCount
          },
          isFetching: false
        },
        () => {}
      );
    } catch (e) {
      axios.isCancel(e)
        ? console.log(e.message)
        : this.setState(
            {
              snackbarOpen: true,
              snackbarMessage: "Could not find profile.",
              isFetching: false
            },
            () => {}
          );
    }
  };

  enableEdit = () => {
    this.setState({ editEnabled: true });
  };

  cancelEdit = () => {
    this.setState({
      ...this.state,
      editEnabled: false,
      ...this.state.profile
    });
  };

  onProfileSubmit = profile => {
    this.setState({ isUpdatingProfile: true }, async () => {
      try {
        await setProfile(this.signal.token, profile);

        this.props.updateProfile(profile);
        this.setState({
          editEnabled: false,
          isUpdatingProfile: false,
          profile: { ...this.state.profile, ...profile }
        });
      } catch (e) {
        axios.isCancel(e)
          ? console.log(e.message)
          : this.setState({
              isUpdatingProfile: false,
              snackbarOpen: true,
              snackbarMessage: "Could not update profile! Try again."
            });
      }
    });
  };

  onFollow = () => {
    this.setState({ isUpdatingNetwork: true }, async () => {
      try {
        await onFollow(this.signal.token, this.state.id);
        this.setState(
          {
            isUpdatingNetwork: false,
            network: {
              ...this.state.network,
              clientFollows: true,
              followersCount: this.state.network.followersCount + 1
            }
          },
          () => {}
        );
      } catch (e) {
        axios.isCancel(e)
          ? console.log(e.message)
          : this.setState({
              isUpdatingNetwork: false,
              snackbarOpen: true,
              snackbarMessage: "Could not update profile! Try again."
            });
      }
    });
  };

  onUnfollow = () => {
    this.setState({ isUpdatingNetwork: true }, async () => {
      try {
        await onUnfollow(this.signal.token, this.state.id);
        this.setState(
          {
            isUpdatingNetwork: false,
            network: {
              ...this.state.network,
              clientFollows: false,
              followersCount: this.state.network.followersCount - 1
            }
          },
          () => {}
        );
      } catch (e) {
        axios.isCancel(e)
          ? console.log(e.message)
          : this.setState({
              isUpdatingNetwork: false,
              snackbarOpen: true,
              snackbarVar: "error",
              snackbarMessage: "Could not update profile! Try again."
            });
      }
    });
  };

  onSubmitMessage = async (title, body) => {
    try {
      await sendMessage(this.signal.token, this.state.id, title, body);
      this.setState(
        {
          snackbarOpen: true,
          snackbarVar: "success",
          snackbarMessage: "Your message was sent successfully!"
        },
        () => {}
      );
    } catch (e) {
      axios.isCancel(e)
        ? console.log(e)
        : this.setState(
            {
              snackbarOpen: true,
              snackbarVar: "error",
              snackbarMessage: "Something went wrong! Try again!"
            },
            () => {}
          );
    }
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  renderEditButtons = ownProfile => {
    const { classes } = this.props;

    return (
      ownProfile && (
        <div className={classes.editButtons}>
          {this.state.editEnabled ? (
            <IconButton onClick={this.cancelEdit}>
              <CancelTwoToneIcon />
            </IconButton>
          ) : (
            <IconButton onClick={this.enableEdit}>
              <EditTwoToneIcon />
            </IconButton>
          )}
        </div>
      )
    );
  };

  render() {
    const { classes } = this.props;
    const { ownProfile } = this.state;

    return (
      <React.Fragment>
        {this.state.isFetching && (
          <div className={classes.circularProgressContainer}>
            <CircularProgress color="primary" size={50} />
          </div>
        )}
        {!this.state.isFetching && (
          <div className={classes.root}>
            <Paper
              square={true}
              elevation={1}
              className={classes.profileInfoContainer}
            >
              {this.state.isUpdatingProfile && (
                <LinearProgress
                  className={classes.linearLoader}
                  color="secondary"
                />
              )}
              <div className={classes.profileHeading}>
                <ProfileHeader
                  ownProfile={ownProfile}
                  profilePhoto={this.state.profilePhoto}
                  displayName={this.state.displayName}
                  joined={this.state.joined}
                />
                {this.state.network && (
                  <ProfileNetwork
                    onFollow={this.onFollow}
                    onUnfollow={this.onUnfollow}
                    isUpdatingNetwork={this.state.isUpdatingNetwork}
                    ownProfile={ownProfile}
                    clientFollows={this.state.network.clientFollows}
                    followers={
                      <ModalView
                        togglerComponent={
                          <Typography align="center" variant="body2">
                            {this.state.network.followersCount}
                            <br />
                            Followers
                          </Typography>
                        }
                        modalComponent={
                          <ProfileNetworkMenu
                            context="userFollowers"
                            tabPosition={0}
                            userId={this.state.id}
                          />
                        }
                      />
                    }
                    following={
                      <ModalView
                        togglerComponent={
                          <Typography
                            align="center"
                            variant="body2"
                            className={classes.following}
                          >
                            {this.state.network.followsCount}
                            <br />
                            Following
                          </Typography>
                        }
                        modalComponent={
                          <ProfileNetworkMenu
                            context="userFollows"
                            tabPosition={1}
                            userId={this.state.id}
                          />
                        }
                      />
                    }
                    messageForm={
                      <ModalView
                        togglerComponent={
                          <Button
                            classes={{ root: classes.buttonRoot }}
                            size="small"
                          >
                            <MailOutlinedIcon />
                          </Button>
                        }
                        modalComponent={
                          <ProfileMessageForm
                            onSubmitMessage={this.onSubmitMessage}
                            userId={this.state.id}
                          />
                        }
                      />
                    }
                  />
                )}
              </div>
              <Divider className={classes.hidingDivider} />

              {this.renderEditButtons(ownProfile)}

              {this.state.profile || this.state.editEnabled ? (
                <ProfileForm
                  onProfileSubmit={this.onProfileSubmit}
                  profile={this.state.profile}
                  ownProfile={ownProfile}
                  editEnabled={this.state.editEnabled}
                  isUpdatingProfile={this.state.isUpdatingProfile}
                  cancelEdit={this.cancelEdit}
                  enableEdit={this.enableEdit}
                />
              ) : (
                <Typography className={classes.noProfileText}>
                  {this.state.displayName} has not shared any of their profile
                  information yet!
                </Typography>
              )}
              {!this.state.editEnabled && (
                <ShareButton
                  context="profile"
                  user={this.props.match.params.user}
                  classes={{
                    root: classes.shareButtonRoot,
                    popper: classes.popper
                  }}
                  button={
                    <Button
                      className={classes.shareButton}
                      variant="text"
                      color="primary"
                    >
                      <ShareTwoToneIcon className={classes.leftIcon} /> Share{" "}
                      {this.state.ownProfile ? "your" : "this"} Profile
                    </Button>
                  }
                />
              )}
            </Paper>

            <ProfileActivity
              profileTabPos={this.state.profileTabPos}
              user={this.state.displayName}
              pages={this.state.pages}
              ownProfile={ownProfile}
            />
          </div>
        )}
        <CustomSnackbar
          snackbarOpen={this.state.snackbarOpen}
          variant={this.state.snackbarVar}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
        />
      </React.Fragment>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  profileTabPos: PropTypes.number
};

const styles = theme => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center"
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "row"
    }
  },
  circularProgressContainer: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    marginTop: `${theme.spacing.unit * 4}px`
  },
  profileInfoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    padding: `${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up("md")]: {
      height: "inherit",
      minHeight: "100vh",
      width: "55%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "35%"
    }
  },
  profileHeading: {
    display: "flex",
    flexDirection: "row",
    position: "relative"
  },
  profileHeadingMR: {
    marginRight: `${theme.spacing.unit * 3}px`
  },
  editButtons: {
    display: "none",
    position: "absolute",
    top: 0,
    right: 0,
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex"
    }
  },
  hideEditButtons: {
    display: "none"
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
  avatarContainer: {
    display: "flex",
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  userText: {
    marginLeft: `${theme.spacing.unit}px`
  },
  hidingDivider: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  noProfileText: {
    marginTop: `${theme.spacing.unit}px`
  },
  following: {
    marginLeft: `${theme.spacing.unit}px`
  },
  buttonRoot: {
    minWidth: "56px"
  },
  shareButtonRoot: {
    [theme.breakpoints.down("sm")]: {
      alignSelf: "center"
    }
  },
  shareButton: {
    marginTop: `${theme.spacing.unit * 2}px`
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  },
  popper: {
    transform: "translate(50%, -75%)",
    [theme.breakpoints.down("sm")]: {
      transform: "translate(25%, -75%)"
    }
  }
});

const mapStateToProps = (auth, ownProps) => ({
  ownProfile: (auth && auth.displayName === ownProps.match.params.user) || false
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateProfile }
  )
)(withRouter(ProfilePage));
