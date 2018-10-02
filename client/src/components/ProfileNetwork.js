import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import PersonAddOutlined from '@material-ui/icons/PersonAdd';

import ModalView from './ModalView';
import ProfileNetworkTabs from './ProfileNetworkTabs'

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

export const ProfileNetwork = props => {
  const onFollow = async () => {
    console.log('clicked');
    try {
      await axios.post(`/api/profile/follows/add/${props.userid}`);
    } catch (e) {
      console.log(e);
    }
  }

  const { classes } = props;
  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div>
          <Typography align="center" variant="body2">
            1152
            <br />
            Followers
          </Typography>
        </div>
        <div>
          <ModalView 
            togglerComponent={
              <Typography
              align="center"
              variant="body2"
              className={classes.following}
            >
              52
              <br />
              Following
            </Typography>
            }
            modalComponent={<ProfileNetworkTabs tabPosition={1} userId={props.userid}/>}
          />         
        </div>
      </div>
      <div className={classes.actions}>
        <div>
          <Button
            onClick={onFollow}
          >
            <PersonAddOutlined className={classes.leftIcon} />
            Follow
          </Button>
        </div>
        <div>
          <Button>
            <MailOutlinedIcon className={classes.leftIcon} />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

ProfileNetwork.propTypes = {
  userid: PropTypes.string.isRequired
}

export default withStyles(styles)(ProfileNetwork);
