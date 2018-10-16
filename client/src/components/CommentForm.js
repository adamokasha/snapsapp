import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import axios from "axios";

const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column"
  }
});

export class CommentForm extends React.Component {
  state = {
    commentBody: "",
    isSending: false
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ isSending: true }, async () => {
      try {
        await axios.post(`/api/posts/comments/add/${this.props.postId}`, {
          commentBody: this.state.commentBody
        });
        this.setState({ isSending: false, commentBody: "" }, () => {});
      } catch (e) {
        console.log(e);
        this.setState({ isSending: false }, () => {});
      }
    });
  };

  onBodyChange = e => {
    this.setState({ commentBody: e.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.form}>
        <OutlinedInput
          onChange={this.onBodyChange}
          multiline
          rows={3}
          value={this.state.commentBody}
          inputProps={{ maxLength: 120 }}
          endAdornment={
            <InputAdornment>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={this.state.commentBody < 1 || this.state.isSending}
              >
                Add Comment
              </Button>
            </InputAdornment>
          }
        />
      </form>
    );
  }
}

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired
};

export default withStyles(styles)(CommentForm);
