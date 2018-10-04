import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({

})

export const CommentForm = () => {
  return (
    <form>
      <TextField></TextField>
      <Button>Add Comment</Button>
    </form>
  )
}

export default withStyles(styles)(CommentForm)