import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import classNames from "classnames";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import axios from "axios";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import PersonAddOutlined from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";

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
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "column"
    }
  },
  moreVertIcon: {
    color: "#000"
  },
  menuControls: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  msgModal: {
    display: "flex"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
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
                <ProfileNetworkTabs tabPosition={1} userId={userId} />
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
            <div className={classes.menuControls}>
              <IconButton
                variant="contained"
                className={classes.moreVertIcon}
                aria-owns={this.state.anchorEl ? "simple-menu" : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                {this.state.clientFollows ? (
                  <MenuItem size="small" onClick={this.onUnfollow}>
                    <PersonIcon
                      className={classNames(
                        classes.unFollowedIcon,
                        classes.leftIcon
                      )}
                    />
                    Unfollow
                  </MenuItem>
                ) : (
                  <MenuItem size="small" onClick={this.onFollow}>
                    <PersonAddOutlined className={classes.leftIcon} />
                    Follow
                  </MenuItem>
                )}
                <MenuItem>
                  <ModalView
                    togglerComponent={
                      <div className={classes.msgModal}>
                        <MailOutlinedIcon className={classes.leftIcon} />
                        Message
                      </div>
                    }
                    modalComponent={
                      <MessageForm withSnackbar={true} userId={userId} />
                    }
                  />
                </MenuItem>
              </Menu>{" "}
            </div>
          )}

        {auth &&
          !ownProfile && (
            <div className={classes.buttonControls}>
              <div>
                {this.state.clientFollows ? (
                  <Button size="small" onClick={this.onUnfollow}>
                    <PersonIcon
                      className={classNames(
                        classes.unFollowedIcon,
                        classes.leftIcon
                      )}
                    />
                    Unfollow
                  </Button>
                ) : (
                  <Button size="small" onClick={this.onFollow}>
                    <PersonAddOutlined className={classes.leftIcon} />
                    Follow
                  </Button>
                )}
              </div>
              <div>
                <ModalView
                  togglerComponent={
                    <Button size="small">
                      <MailOutlinedIcon className={classes.leftIcon} />
                      Message
                    </Button>
                  }
                  modalComponent={
                    <MessageForm withSnackbar={true} userId={userId} />
                  }
                />
              </div>
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
