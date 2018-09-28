import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import NavBar from './NavBar';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  imgContainer: {
    width: '100%',
    height: '80vh',
    margin: '0',
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    backgroundColor: '#212124'
  },
  img: {
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
  postInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '10%',
    padding: '2% 10%'
  },
  infoLeft: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  avatar: {
    width: '50px',
    height: '50px',
    marginRight: `${theme.spacing.unit * 2}px`
  },
  descContainer: {
    marginTop: `${theme.spacing.unit}px`,
    marginLeft: `${theme.spacing.unit * 2 + 50}px`

  },
  infoRight: {
    display: 'flex'
  },
  infoRightButtons: {},
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
  }
});

export class FullPost extends React.Component {
  render() {
    const post = {
      faved: {},
      isFave: true,
      faveCount: 1,
      comments: {},
      tags: {},
      _id: '5ba931ecc54b150015045d85',
      _owner: {
        profilePhoto:
          'https://lh6.googleusercontent.com/-qiv1IpPX9Xc/AAAAAAAAAAI/AAAAAAAAAAA/AAN31DVnmHGYoa8QU_ibRrAd07hho5-rqw/mo/photo.jpg?sz=50',
        displayName: 'kasho'
      },
      title: 'Veggies',
      description: 'Vegetables ',
      createdAt: 1537815020214,
      imgUrl:
        '5ba909db3b527b1ad43d4443/1155fb67-0e3f-48de-b29a-dac366fec124.jpeg',
      __v: 0
    };

    const {
      _id,
      _owner,
      imgUrl,
      title,
      faveCount,
      createdAt,
      isFave,
      description
    } = post;

    const { classes } = this.props;

    return (
      <React.Fragment>
        <NavBar />
        <div className={classes.root}>
          <div className={classes.imgContainer}>
            <img
              className={classes.img}
              src="https://s3.amazonaws.com/img-share-kasho/5ba8d9e10dc62b3c1cfebc70/b4676a43-8bcd-4d06-8a1d-06810075a1a5.jpeg"
            />
          </div>
          <div className={classes.postInfo}>
            <div className={classes.infoLeft}>
              <div className={classes.avatarContainer}>
                <Avatar src={_owner.profilePhoto} className={classes.avatar} />
                <div>
                  <Typography variant="body2">{title}</Typography>
                  <Typography variant="caption" gutterBottom>
                    {_owner.displayName}
                  </Typography>
                </div>
              </div>
              <div className={classes.descContainer}>
                <Typography variant="caption">{createdAt}</Typography>
                <Typography variant="body1">{description}</Typography>
              </div>
            </div>
            <div className={classes.infoRight}>
              <div className={classes.infoRightButtons}>
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
          <div className="commentsContainer" />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(FullPost);
