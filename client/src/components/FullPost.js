import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import NavBar from './NavBar';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

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
  },
  commentsContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
});

export class FullPost extends React.Component {
  constructor() {
    super();
    this.state = {
      post: null
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.location.state) {
      try {
        const res = await axios.get(
          `/api/posts/single/${this.props.match.params.id}`
        );
        return this.setState({ post: res.data }, () => {});
      } catch (e) {
        console.log(e);
      }
    }
    this.setState({ post: this.props.location.state.post });
  }

  componentDidUpdate(prevProps) {
    // Case of uploading new post while FullPost is mounted
    if(this.props.location.state && this.props.location.state.post !== prevProps.location.state.post) {
      this.setState({post: this.props.location.state.post}, () => {})
    }
  }

  render() {
    const { classes } = this.props;
    const {post} = this.state;

    return (
      <React.Fragment>
        <NavBar />
        {this.state.post && (
          <div className={classes.root}>
            <div className={classes.imgContainer}>
              <img
                className={classes.img}
                src={`https://s3.amazonaws.com/img-share-kasho/${post.imgUrl}`}
              />
            </div>
            <div className={classes.postInfo}>
              <div className={classes.infoLeft}>
                <div className={classes.avatarContainer}>
                  <Avatar
                    to={`/profile/${post._owner.displayName}`}
                    component={Link}
                    src={post._owner.profilePhoto}
                    className={classes.avatar}
                  />
                  <div>
                    <Typography variant="body2">{post.title}</Typography>
                    <Typography variant="caption" gutterBottom>
                      {post._owner.displayName}
                    </Typography>
                  </div>
                </div>
                <div className={classes.descContainer}>
                  <Typography variant="caption">{post.createdAt}</Typography>
                  <Typography variant="body1">{post.description}</Typography>
                </div>
              </div>
              <div className={classes.infoRight}>
                <div className={classes.infoRightButtons}>
                  <Button>
                    <FavoriteTwoToneIcon
                      color="inherit"
                      className={classes.leftIcon}
                    />
                    {post.faveCount}
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
            <div className="commentsContainer">
              <CommentList postId={post._id} />
              <CommentForm postId={post._id} />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

FullPost.propTypes = {
  location: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(FullPost);
