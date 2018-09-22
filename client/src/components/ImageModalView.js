import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    opacity: '.9',
    background: '#fff'
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%%',
    margin: '0 auto',
    overflow: 'hidden'
  },
  headerElement: {
    height: '5%'
  },
  imageContainer: {
    width: '100%',
    height: '90%',
    margin: '0',
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden'
  },
  image: {
    width: 'auto',
    height: '100%',
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  bottom: {
    height: '5%'
  }
});

class ImageModalView extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.headerElement}>Header</div>
          <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src="https://i.imgur.com/l3ztqFE.jpeg"
            alt="testing"
          />
          </div>
          <div className={classes.bottom}>Bottom Stuff</div>
        </div>
      </div>
    );
  }
}

ImageModalView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageModalView);
