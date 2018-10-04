import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export const CommentForm = (props) => {
  const {classes} = props;
  return (
    <form className={classes.form}>
      <OutlinedInput multiline rows={3}></OutlinedInput>
      <Button variant="contained" color="primary">Add Comment</Button>
    </form>
  )
}

export default withStyles(styles)(CommentForm)