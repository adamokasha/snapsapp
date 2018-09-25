import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import Chip from '@material-ui/core/Chip';
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
    }
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
    display: 'flex',
    justifyContent: 'space-between',
    height: '10%',
    padding: `${theme.spacing.unit * 2}px`
  },
  headerLeft: {
    display: 'flex'
  },
  headerLeftText: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerRight: {
    display: 'flex'
  },
  headerRightButtons: {},
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
    color: 'rgba(0, 0, 0, 0.70)'
  },
  buttonMargin: {
    marginLeft: `${theme.spacing.unit}px`
  },
  ionicon: {
    fontSize: '24px',
    color: 'rgba(0, 0, 0, 0.70)'
  },
  avatar: {
    width: '50px',
    height: '50px',
    marginRight: `${theme.spacing.unit * 2}px`
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
    transform: 'translate(-50%, -50%)'
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '10%',
    padding: `${theme.spacing.unit * 2}px`
  },
  bottomLeft: {
    overflow: 'hidden',
    width: '35%'
  },
  bottomRight: {
    display: 'flex',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    width: '65%',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end'
    }
  },
  chip: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

class ImageModalView extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      _owner,
      imgUrl,
      title,
      faveCount,
      isFave,
      description
    } = this.props.imgData;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.headerElement}>
            <div className={classes.headerLeft}>
              <Avatar src={_owner.profilePhoto} className={classes.avatar} />
              <div className={classes.headerLeftText}>
                <Typography variant="body2">{title}</Typography>
                <Typography variant="caption">{_owner.displayName}</Typography>
              </div>
            </div>
            <div className={classes.headerRight}>
              <div className={classes.headerRightButtons}>
                <Button>
                  <FavoriteTwoToneIcon
                    color="inherit"
                    className={classes.leftIcon}
                  />
                  {faveCount}
                </Button>
                <Button className={classes.buttonMargin}>
                  <CommentOutlinedIcon
                    color="inherit"
                    className={classes.leftIcon}
                  />
                  15
                </Button>
                <Button className={classes.buttonMargin}>
                  <ion-icon class={classes.ionicon} name="share-alt" />
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={`https://s3.amazonaws.com/img-share-kasho/${imgUrl}`}
              alt="testing"
            />
          </div>
          <div className={classes.bottom}>
            <div className={classes.bottomLeft}>
              <Typography variant="body2">{description}</Typography>
            </div>
            <div className={classes.bottomRight}>
              <Typography variant="body2">Tags: </Typography>
              <Chip label="Nature" className={classes.chip} />
              <Chip label="Forest" className={classes.chip} />
              <Chip label="Plants" className={classes.chip} />
              <Chip label="Mountains" className={classes.chip} />
              <Chip label="Hiking" className={classes.chip} />
              <Chip label="Trail" className={classes.chip} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ImageModalView.propTypes = {
  classes: PropTypes.object.isRequired,
  imgData: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageModalView);
