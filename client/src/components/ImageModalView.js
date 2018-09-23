import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '90%',
    height: '97%',
    background: '#fff',
    margin: '0 auto',
    overflowY: 'auto',
    borderRadius: '8px',
    [theme.breakpoints.down('md')]: {
      height: '60%'
    },

  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    margin: '0 auto',
    overflow: 'hidden'
  },
  headerElement: {
    height: '10%'
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    margin: '0',
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden'
  },
  image: {
    // maintain aspect ratio
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'zoom-in'
  },
  bottom: {
    height: '10%'
  }
});

class ImageModalView extends React.Component {
  render() {
    const { classes, imgUrl } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.headerElement}>Header</div>
          <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={`https://s3.amazonaws.com/img-share-kasho/${imgUrl}`}
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
  classes: PropTypes.object.isRequired,
  imgUrl: PropTypes.string.isRequired
};

export default withStyles(styles)(ImageModalView);
