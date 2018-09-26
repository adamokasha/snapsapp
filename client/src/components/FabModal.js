import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: '80%',
    right: '0%'
  }
});

class ImageUploadModal extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, modalComponent, buttonIcon } = this.props;

    return (
      <div className={classes.root}>
        <Button
          onClick={this.handleOpen}
          variant="fab"
          color="secondary"
          aria-label="Add"
          className={classes.fab}
        >
          {buttonIcon}
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onBackdropClick={this.handleClose}
          onClose={this.handleClose}
        >
          <div handleClose={this.handleClose}>
            {modalComponent}
          </div>
        </Modal>
      </div>
    );
  }
}

ImageUploadModal.propTypes = {
  classes: PropTypes.object.isRequired,
  modalComponent: PropTypes.element.isRequired,
  buttonIcon: PropTypes.element.isRequired
};

export default withStyles(styles)(ImageUploadModal);
