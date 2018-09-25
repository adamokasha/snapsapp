import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  imgView: {
    maxWidth: '100%',
    minHeight: '100%',
    margin: `${theme.spacing.unit * 2}px`,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imgContainer: {
    position: 'relative'
  },
  dummyImg: {
    height: '200px',
    width: 'auto',
    marginLeft: '8px'
  },
  checkIconContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    backgroundColor: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '5px',
    opacity: '0.8'
  },
  hiddenIconContainer: {
    display: 'none'
  },
  checkIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  imgSelected: {
    height: '200px',
    width: 'auto',
    marginLeft: '8px',
    border: '2px solid #000'
  }
});

export const AlbumMakerImageView = (props) => {
  const onImageSelect = e => {
    const imgId = e.target.attributes['imgid'].nodeValue;
    props.onImageSelect(imgId);
  };

    const { classes, imgData, selected } = props;

    return (
        <div className={classes.imgView}>
          {imgData.map(img => (
            <div className={classes.imgContainer}>
              <div className={selected.includes(img.id)? classes.checkIconContainer : classes.hiddenIconContainer}>
                <CheckIcon className={classes.checkIcon} />
              </div>
              <img
                key={img.id}
                imgid={img.id}
                className={
                  selected.includes(img.id)
                    ? classes.imgSelected
                    : classes.dummyImg
                }
                onClick={onImageSelect}
                src={img.imgUrl}
              />
            </div>
          ))}
        </div>
    );
  
}

AlbumMakerImageView.propTypes = {
  classes: PropTypes.object.isRequired,
  imgData: PropTypes.array.isRequired
};

export default withStyles(styles)(AlbumMakerImageView);
