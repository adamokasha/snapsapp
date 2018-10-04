import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export class CommentForm extends React.Component {
  state = {
    commentBody: ''
  }

  onSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`/api/posts/comments/add/${this.props.postId}`, {commentBody: this.state.commentBody});
    } catch (e) {
      console.log(e);
    }
  }

  onBodyChange = (e) => {
    this.setState({commentBody: e.target.value})
  }

  render () {
    const {classes} = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.form}>
        <OutlinedInput onChange={this.onBodyChange} multiline rows={3}></OutlinedInput>
        <Button variant="contained" color="primary" type="submit">Add Comment</Button>
      </form>
    )
  
  }
}

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired
}

export default withStyles(styles)(CommentForm)