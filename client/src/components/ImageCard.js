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
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionsLeft: {
    display: 'flex'
  },
  iconButtonRoot: {
    width: '32px',
    height: '32px'
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
    imgId: this.props.imgData._id,
    faved: this.props.imgData.isFave,
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
      this.setState({faved: !this.state.faved});
      await this.props.favePost(this.state.imgId);
      return;
  }

  render() {
    const {classes} = this.props;
    const {
      _owner,
      imgUrl,
      title,
      description,
      faveCount
    } = this.props.imgData;

    return (
      <div>
        <Card className={classes.card} raised>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                <img src={_owner.profilePhoto} alt="avatar" />
              </Avatar>
            }
            title={title || 'Aerial Photo'}
            subheader={_owner.displayName || 'September 14, 2016'}
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
            <div className={classes.actionsLeft}>
              <Typography variant="caption">{faveCount} Faves</Typography>
              &nbsp;
              <Typography variant="caption">15 Comments</Typography>
            </div>
            <div className={classes.actionsRight}>
            {this.props.isAuth ? (
              <React.Fragment>
              <IconButton 
              aria-label="Add to favorites"
              onClick={this.onFave}
              color={this.state.faved ? 'secondary' : 'default'}
              classes={{
                root: classes.iconButtonRoot
              }}
              >
                <FavoriteTwoToneIcon
                />
              </IconButton>
              <IconButton 
              aria-label="Share"
              color="default"
              classes={{
                root: classes.iconButtonRoot
              }}
              >
              <ion-icon name="share-alt"></ion-icon>
              </IconButton>
              </React.Fragment>
            ) : ( null )}
            </div>
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
  classes: PropTypes.object.isRequired,
  imgData: PropTypes.object.isRequired
};

const mapStateToProps = ({auth}) => ({
  isAuth: auth
})

export default compose(
  withStyles(styles),
  connect(mapStateToProps, {favePost, unFavePost})
)(ImageCard)