import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";

export class CommentForm extends React.Component {
  state = {
    commentBody: ""
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onAddComment(this.state.commentBody);
    this.setState({ commentBody: "" });
  };

  onBodyChange = e => {
    this.setState({ commentBody: e.target.value });
  };

  render() {
    const { classes, addingComment } = this.props;

    return (
      <form onSubmit={this.onSubmit} className={classes.form}>
        <OutlinedInput
          onChange={this.onBodyChange}
          labelWidth={-25}
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
                disabled={this.state.commentBody < 1 || addingComment}
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
  classes: PropTypes.object.isRequired,
  onAddComment: PropTypes.func.isRequired,
  addingComment: PropTypes.bool.isRequired
};

const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column"
  }
});

export default withStyles(styles)(CommentForm);
