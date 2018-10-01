import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import PersonAddOutlined from '@material-ui/icons/PersonAdd';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  },
  info: {
    display: 'flex',
    width: '80%'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column'
  }
});

export const ProfileFollows = props => {
  const {classes} = props;
  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div>
          <Typography>1152 Followers</Typography>
        </div>
        <div>
          <Typography>52 Following</Typography>
        </div>
      </div>
      <div className={classes.actions}>
        <div>
          <PersonAddOutlined />
          Follow
        </div>
        <div>
          <MailOutlinedIcon />
          Message
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(ProfileFollows);
