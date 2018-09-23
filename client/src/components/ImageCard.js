import React from 'react';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';

import ImageModalView from './ImageModalView';
import {favePost, unFavePost} from '../actions/posts';

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: `${theme.spacing.unit * 3}px auto`
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    cursor: 'pointer'
  },
  actions: {
    display: 'flex'
  },
  modalRoot: {
    top: '3%',
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      top: '18%',
    }
  },
  red: {
    color: 'red'
  }
});

class ImageCard extends React.Component {
  state = {
    imgId: this.props.imgId,
    faved: false,
    faveColor: 'default',
    open: false
  };

  handleOpen = () => {
    let goTopButton = document.getElementById('goTopButton'); 
    if (goTopButton) {goTopButton.style.display = 'none'};
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    let goTopButton = document.getElementById('goTopButton'); 
    if(goTopButton) {goTopButton.style.display = 'inline-flex'};
  };

  onFave = async () => {
    if(this.state.faved) {
      this.setState({faveColor: 'default', faved: false})
      await this.props.unFavePost(this.state.imgId);
      console.log('UNFAVE dispatched')
      return;
    }
    this.setState({faveColor: 'secondary', faved: true});
    await this.props.favePost(this.state.imgId);
    console.log('favePost dispatched')
  }

  render() {
    const {
      classes,
      profilePhoto,
      displayName,
      imgUrl,
      title,
      description
    } = this.props;

    return (
      <div>
        <Card className={classes.card} raised>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                <img src={profilePhoto} alt="avatar" />
              </Avatar>
            }
            title={title || 'Aerial Photo'}
            subheader={displayName || 'September 14, 2016'}
          />
          <CardMedia
            className={classes.media}
            image={
              `https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}` ||
              'https://i.imgur.com/KAXz5AG.jpg'
            }
            title={title || 'Image Title'}
            onClick={this.handleOpen}
          />
          <CardContent>
            <Typography component="p">
              {description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius, orci in faucibus egestas, mi turpis condimentum dui, ac dictum ipsum ante sit amet elit.'}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton 
            aria-label="Add to favorites"
            onClick={this.onFave}
            color={this.state.faveColor}
            >
              <FavoriteIcon
              />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
        <Modal
          id="image-modal-view"
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onBackdropClick={this.handleClose}
          onClose={this.handleClose}
          classes={{root: classes.modalRoot}}
        >
          <ImageModalView
            imgUrl={imgUrl}
          />
        </Modal>
      </div>
    );
  }
}

ImageCard.propTypes = {
  classes: PropTypes.object.isRequired
};


export default compose(
  withStyles(styles),
  connect(null, {favePost, unFavePost})
)(ImageCard)