import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import classNames from "classnames";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import PersonAddOutlined from "@material-ui/icons/PersonAdd";
import UndoIcon from "@material-ui/icons/Undo";
import axios from "axios";

import ModalView from "./ModalView";
import ProfileNetworkTabs from "./ProfileNetworkTabs";
import MessageForm from "./MessageForm";

import { fetchFollows, onFollow, onUnfollow } from "../async/profiles";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing.unit}px`
  },
  info: {
    display: "flex",
    width: "80%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonControls: {
    display: "flex",
    flexDirection: "column",
    margin: `0 ${theme.spacing.unit}px`
  },
  reversedButtons: {
    flexDirection: "column-reverse"
  },
  buttonRoot: {
    minWidth: "56px"
  },
  topIcon: {
    marginBottom: `${theme.spacing.unit}px`
  },
  unFollowedIcon: {
    color: "rgba(0,0,0,.7)"
  },
  following: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

export class ProfileNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      followersCount: "",
      followsCount: "",
      clientFollows: null
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      // User navigated to a profile that doesn't exist
      if (!this.props.userId) {
        throw new Error();
      }
      const data = await fetchFollows(this.signal.token, this.props.userId);
      const { followsCount, followersCount, clientFollows } = data;
      this.setState({ followersCount, followsCount, clientFollows }, () => {});
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      console.log("called!");
      try {
        // User navigated to a profile that doesn't exist
        if (!this.props.userId) {
          throw new Error();
        }
        const data = await fetchFollows(this.signal.token, this.props.userId);
        const { followsCount, followersCount, clientFollows } = data;
        this.setState(
          { followersCount, followsCount, clientFollows },
          () => {}
        );
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        console.log(e);
      }
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  onFollow = async () => {
    try {
      await onFollow(this.signal.token, this.props.userId);
      this.setState({ clientFollows: true }, () => {
        this.handleClose();
      });
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      this.handleClose();
      console.log(e);
    }
  };

  onUnfollow = async () => {
    try {
      await onUnfollow(this.signal.token, this.props.userId);
      this.setState({ clientFollows: false }, () => {
        this.handleClose();
      });
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      this.handleClose();
      console.log(e);
    }
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, userId, auth, ownProfile } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.info}>
          <div>
            <ModalView
              togglerComponent={
                <Typography align="center" variant="body2">
                  {this.state.followersCount}
                  <br />
                  Followers
                </Typography>
              }
              modalComponent={
                <ProfileNetworkTabs tabPosition={0} userId={userId} />
              }
            />
          </div>
          <div>
            <ModalView
              togglerComponent={
                <Typography
                  align="center"
                  variant="body2"
                  className={classes.following}
                >
                  {this.state.followsCount}
                  <br />
                  Following
                </Typography>
              }
              modalComponent={
                <ProfileNetworkTabs tabPosition={1} userId={userId} />
              }
            />
          </div>
        </div>
        {auth &&
          !ownProfile && (
            <div
              className={
                this.state.clientFollows
                  ? classNames(classes.buttonControls, classes.reversedButtons)
                  : classes.buttonControls
              }
            >
              <div>
                {this.state.clientFollows ? (
                  <Tooltip title="Unfollow" placement="bottom">
                    <Button
                      classes={{ root: classes.buttonRoot }}
                      size="small"
                      onClick={this.onUnfollow}
                      className={classes.topIcon}
                    >
                      <UndoIcon
                        fontSize="small"
                        className={classes.unFollowedIcon}
                      />
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    classes={{ root: classes.buttonRoot }}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={this.onFollow}
                  >
                    <PersonAddOutlined fontSize="small" />
                  </Button>
                )}
              </div>
              <ModalView
                togglerComponent={
                  <Button classes={{ root: classes.buttonRoot }} size="small">
                    <MailOutlinedIcon fontSize="small" />
                  </Button>
                }
                modalComponent={
                  <MessageForm withSnackbar={true} userId={userId} />
                }
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

ProfileNetwork.propTypes = {
  userId: PropTypes.string.isRequired,
  ownProfile: PropTypes.bool.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ProfileNetwork);
