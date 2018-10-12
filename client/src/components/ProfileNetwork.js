import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import PersonAddOutlined from '@material-ui/icons/PersonAdd';

import ModalView from './ModalView';
import ProfileNetworkTabs from './ProfileNetworkTabs';
import MessageForm from './MessageForm';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: `${theme.spacing.unit}px`
  },
  info: {
    display: 'flex',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column'
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
      followersCount: '',
      followsCount: '',
      clientFollows: null
    };
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.userid !== this.props.userid) {
      console.log('called!');
      try {
        const res = await axios.get(`/api/profile/count/${this.props.userid}`);
        const { followsCount, followersCount, clientFollows } = res.data[0];
        this.setState(
          { followersCount, followsCount, clientFollows },
          () => {}
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  onFollow = async () => {
    try {
      await axios.post(`/api/profile/follows/add/${this.props.userid}`);
    } catch (e) {
      console.log(e);
    }
  };

  onUnfollow = async () => {
    try {
      await axios.delete(`/api/profile/follows/unf/${this.props.userid}`);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes, userid, auth } = this.props;
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
                <ProfileNetworkTabs tabPosition={1} userId={userid} />
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
                <ProfileNetworkTabs tabPosition={1} userId={userid} />
              }
            />
          </div>
        </div>
        {auth ? (
          <div className={classes.actions}>
            <div>
              {this.state.clientFollows ? (
                <Button onClick={this.onUnfollow}>
                  <PersonAddOutlined className={classes.leftIcon} />
                  Unfollow
                </Button>
              ) : (
                <Button onClick={this.onFollow}>
                  <PersonAddOutlined className={classes.leftIcon} />
                  Follow
                </Button>
              )}
            </div>
            <div>
              <ModalView
                togglerComponent={
                  <Button>
                    <MailOutlinedIcon className={classes.leftIcon} />
                    Message
                  </Button>
                }
                modalComponent={
                  <MessageForm withSnackbar={true} userId={userid} />
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

ProfileNetwork.propTypes = {
  userid: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ProfileNetwork);
