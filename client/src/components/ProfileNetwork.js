import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import axios from "axios";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import PersonAddOutlined from "@material-ui/icons/PersonAdd";

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
  actions: {
    display: "flex",
    flexDirection: "column"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  following: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

export class ProfileNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
        // const res = await axios.get(`/api/profile/count/${this.props.userId}`);
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
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  onUnfollow = async () => {
    try {
      await onUnfollow(this.signal.token, this.props.userId);
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
    }
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
            <div className={classes.actions}>
              <div>
                {this.state.clientFollows ? (
                  <Button size="small" onClick={this.onUnfollow}>
                    <PersonAddOutlined className={classes.leftIcon} />
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
