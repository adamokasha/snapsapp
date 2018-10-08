import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({});

class ModalView extends React.Component {
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
    const { classes, modalComponent, togglerComponent } = this.props;

    const ModalComponent = React.cloneElement(modalComponent, {handleClose:this.handleClose})

    return (
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
    );
  }
}

ModalView.propTypes = {
  classes: PropTypes.object.isRequired,
  togglerComponent: PropTypes.element.isRequired,
  modalComponent: PropTypes.element.isRequired
};

export default withStyles(styles)(ModalView);
