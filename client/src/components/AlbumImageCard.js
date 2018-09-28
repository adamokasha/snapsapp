import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ImageModalView from './ImageModalView';
import Modal from './Modal';
import { favePost, unFavePost } from '../actions/posts';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  card: {
    maxWidth: 600,
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
      top: '18%'
    }
  },
  red: {
    color: 'red'
  }
});

class AlbumImageCard extends React.Component {
  state = {
    imgId: this.props.post._id,
    faved: this.props.post.isFave,
    faveColor: 'default'
  };

  onImgClick = () => {
    return this.props.history.push({
      pathname: `/post/${this.props.post._id}/`,
      state: { post: this.props.post }
    })
  }

  render() {
    const { classes } = this.props;
    const { imgUrl, title, description, createdAt } = this.props.post;

    return (
      <div>
        <Card className={classes.card} raised>
          <CardHeader
            title={title || 'Aerial Photo'}
            subheader={createdAt || 'September 14, 2016'}
          />
          <CardMedia
            className={classes.media}
            image={
              `https://d14ed1d2q7cc9f.cloudfront.net/500x350/smart/${imgUrl}` ||
              'https://i.imgur.com/KAXz5AG.jpg'
            }
            title={title || 'Image Title'}
            onClick={this.onImgClick}
          />

          <CardContent>
            <Typography component="p">
              {description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius, orci in faucibus egestas, mi turpis condimentum dui, ac dictum ipsum ante sit amet elit.'}
            </Typography>
          </CardContent>
          <Divider />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuth: auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { favePost, unFavePost }
  )
)(withRouter(AlbumImageCard));
