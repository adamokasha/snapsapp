import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import WarningIcon from "@material-ui/icons/Warning";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const ConfirmationModal = ({ classes, handleClose, onDelete }) => {
  return (
    <Paper className={classes.paperModal}>
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
        <Button onClick={onDelete}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </div>
    </Paper>
  );
};

ConfirmationModal.propTypes = {};

const styles = theme => ({
  paperModal: {
    padding: `${theme.spacing.unit * 2}px`,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
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
