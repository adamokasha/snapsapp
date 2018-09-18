import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';

import ImageUploadForm from "./ImageUploadForm";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: '80%',
    right: '0%'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Button
          onClick={this.handleOpen}
          variant="fab"
          color="secondary"
          aria-label="Add"
          className={classes.fab}
        >
          <AddPhotoAlternate/>
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onBackdropClick={this.handleClose}
          onClose={this.handleClose}
        >
            <ImageUploadForm
              handleClose={this.handleClose}
            />
        </Modal>
      </div>
    );
  }
}

ImageUploadModal.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageUploadModal);
