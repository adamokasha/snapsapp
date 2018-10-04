import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({

})

export const Comment = () => {
  return (
    <div>
      <div>
      <Avatar></Avatar>
      </div>
      <div>
        <Typography>Comment</Typography>
      </div>
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
}

export default withStyles(styles)(Comment)