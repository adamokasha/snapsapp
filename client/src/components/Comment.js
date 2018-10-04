import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  avatarContainer: {
    display: 'flex',
  },
  commentBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  commentHeading: {
    display: 'flex'
  }
})

export const Comment = (props) => {
  const {classes} = props;
  const {_owner, body, createdAt} = props.comment;
  return (
    <div className={classes.root}>
      <div className={classes.avatarContainer}>
      <Avatar><img src={_owner.profilePhoto}/></Avatar>
      </div>
      <div className={classes.commentBox}>
        <div className={classes.commentHeading}>
          <Typography variant="body2">{_owner.displayName}</Typography>
          <Typography variant="body2">{createdAt}</Typography>
        </div>
        <Typography>{body}</Typography>
      </div>
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
}

export default withStyles(styles)(Comment)