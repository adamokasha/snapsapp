import React from "react";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import axios from "axios";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileNetwork from "../components/profile/ProfileNetwork";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileTabs from "../components/profile/ProfileTabs";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

import { updateProfile } from "../actions/auth";

import { fetchProfile, setProfile } from "../async/profiles";
import { fetchForProfilePage } from "../async/combined";

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      id: "",
      profile: null,
      pages: [],
      editEnabled: false,
      ownProfile: false,
      isLoading: false,
      profileTabPos: this.props.location.state
        ? this.props.location.state.profileTabPos
        : 1,
      snackbarOpen: false,
      snackbarMessage: null
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      const asyncContextMap = {
        0: "userFaves",
        1: "userPosts",
        2: "userAlbums"
      };
      const context = asyncContextMap[this.state.profileTabPos];
      const [{ data: userData }, { data: userPosts }] = await axios.all([
        fetchProfile(this.signal.token, this.props.match.params.user),
        fetchForProfilePage(
          this.signal.token,
          context,
          0,
          this.props.match.params.user
        )
      ]);

      const { profilePhoto, joined, displayName, profile, _id } = userData;

      let ownProfile;
      if (
        this.props.auth &&
        this.props.auth.displayName === this.props.match.params.user
      ) {
        ownProfile = true;
      } else {
        ownProfile = false;
      }

      this.setState(
        {
          id: _id,
          pages: [userPosts],
          profilePhoto,
          displayName,
          joined,
          profile,
          ownProfile,
          isFetching: false
        },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      this.setState(
        {
          snackbarOpen: true,
          snackbarMessage: "Could not find profile.",
          isFetching: false
        },
        () => {}
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.location.state &&
      this.props.location.state.profileTabPos !== this.state.profileTabPos
    ) {
      this.setState({ profileTabPos: this.props.location.state.profileTabPos });
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  checkIfProfileOwner = () => {};

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
    this.setState({ isLoading: true }, async () => {
      try {
        await setProfile(this.signal.token, profile);

        console.log(profile);
        this.props.updateProfile(profile);
        this.setState({
          editEnabled: false,
          isLoading: false,
          profile: { ...this.state.profile, ...profile }
        });
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
    console.log("PROFILEPAGE RENDERED", this.props);
    const { ownProfile } = this.state;

    return (
      <React.Fragment>
        {!this.state.isFetching && (
          <div className={classes.root}>
            <Paper
              square={true}
              elevation={1}
              className={classes.profileInfoContainer}
            >
              {this.state.isLoading && (
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
                <ProfileNetwork
                  ownProfile={ownProfile}
                  userId={this.state.id}
                />
              </div>
              <Divider className={classes.hidingDivider} />

              {this.renderEditButtons(ownProfile)}

              {this.state.profile || this.state.editEnabled ? (
                <ProfileForm
                  onProfileSubmit={this.onProfileSubmit}
                  profile={this.state.profile}
                  ownProfile={ownProfile}
                  editEnabled={this.state.editEnabled}
                  isLoading={this.state.isLoading}
                  cancelEdit={this.cancelEdit}
                  enableEdit={this.enableEdit}
                />
              ) : (
                <Typography className={classes.noProfileText}>
                  {this.state.displayName} has not shared any of their profile
                  information yet!
                </Typography>
              )}
            </Paper>

            {/* {this.props.children} */}
            <ProfileTabs
              profileTabPos={this.state.profileTabPos}
              user={this.state.displayName}
              pages={this.state.pages}
            />
          </div>
        )}
        {this.state.isFetching && <div>Loading...</div>}
        <CustomSnackbar
          variant="error"
          message={this.state.snackbarMessage}
          snackbarOpen={this.state.snackbarOpen}
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
  }
});

const mapStateToProps = auth => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateProfile }
  )
)(withRouter(ProfilePage));
