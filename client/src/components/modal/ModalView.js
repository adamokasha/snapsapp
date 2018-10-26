import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import CustomSnackbar from "../snackbar/CustomSnackbar";

const styles = theme => ({});

class ModalView extends React.Component {
  state = {
    open: false,
    snackbarOpen: false,
    snackbarVar: null,
    snackbarMessage: ""
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSnackbarSet = (variant, message) => {
    this.setState({ snackbarVar: variant, snackbarMessage: message }, () => {
      this.onSnackbarOpen();
    });
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  render() {
    const { classes, modalComponent, togglerComponent } = this.props;

    // Add snackbar functionality if modalComponent.props.withSnackbar = true,
    const ModalComponent = modalComponent.props.withSnackbar
      ? React.cloneElement(modalComponent, {
          handleClose: this.handleClose,
          onSnackbarSet: this.onSnackbarSet
        })
      : React.cloneElement(modalComponent, {
          handleClose: this.handleClose
        });

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div onClick={this.handleOpen}>{togglerComponent}</div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onBackdropClick={this.handleClose}
            onClose={this.handleClose}
          >
            {ModalComponent}
          </Modal>
        </div>
        {modalComponent.props.withSnackbar && (
          <CustomSnackbar
            variant={this.state.snackbarVar}
            message={this.state.snackbarMessage}
            onSnackbarOpen={this.onSnackbarOpen}
            onSnackbarClose={this.onSnackbarClose}
            snackbarOpen={this.state.snackbarOpen}
          />
        )}
      </React.Fragment>
    );
  }
}

ModalView.propTypes = {
  classes: PropTypes.object.isRequired,
  togglerComponent: PropTypes.element.isRequired,
  modalComponent: PropTypes.element.isRequired
};

export default withStyles(styles)(ModalView);
