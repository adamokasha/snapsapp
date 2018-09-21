import React from 'react';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: `${theme.spacing.unit * 3}px auto`
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  }
});

class ImageCard extends React.Component {
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
      <Card className={classes.card} raised>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              <img src={profilePhoto} />
            </Avatar>
          }
          title={title || 'Aerial Photo'}
          subheader={displayName || 'September 14, 2016'}
        />
        <CardMedia
          className={classes.media}
          image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}` || 'https://i.imgur.com/KAXz5AG.jpg'}
          title={title || 'Image Title'}
        />
        <CardContent>
          <Typography component="p">
            {description ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius, orci in faucibus egestas, mi turpis condimentum dui, ac dictum ipsum ante sit amet elit.'}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

ImageCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageCard);
