import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import WarningIcon from "@material-ui/icons/Warning";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

class ConfirmationModal extends React.Component {
  state = {
    isSubmitting: false
  };

  onDelete = () => {
    this.setState({ isSubmitting: true }, () => {
      this.props.onDelete();
    });
  };

  render() {
    const { classes, handleClose } = this.props;

    return (
      <Paper className={classes.paperModal}>
        {this.state.isSubmitting && (
          <LinearProgress
            color="secondary"
            className={classes.linearLoaderModal}
          />
        )}

        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <WarningIcon />
          </Avatar>
          <Typography align="center" variant="h5">
            Confirmation
          </Typography>
        </div>
        <p>Are you sure you want to permanently delete?</p>
        <div>
          <Button onClick={this.onDelete} disabled={this.state.isSubmitting}>
            Yes
          </Button>
          <Button onClick={handleClose} disabled={this.state.isSubmitting}>
            No
          </Button>
        </div>
      </Paper>
    );
  }
}

ConfirmationModal.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const styles = theme => ({
  paperModal: {
    position: "relative",
    padding: `${theme.spacing.unit * 2}px`,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  linearLoaderModal: {
    position: "absolute",
    top: "0",
    left: 0,
    width: "100%"
  },
  heading: {
    marginBottom: `${theme.spacing.unit}px`
  },
  avatar: {
    margin: `${theme.spacing.unit}px auto`,
    backgroundColor: theme.palette.secondary.main
  }
});

export default withStyles(styles)(ConfirmationModal);
