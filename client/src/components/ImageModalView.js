import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '90%',
    height: '97%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
  navIcons: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '48px',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.80)'
  },
  navLeft: {
    left: '2%'
  },
  navRight: {
    right: '2%'
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
  constructor(props) {
    super(props);

    this.state = {
      slides: [],
      currentSlide: this.props.post,
      currentIndex: null
    };
  }

  componentDidMount(){
    // If feed slides will be array of arrays (due to pagination)
    if(this.props.slidesSource === 'feed') {
      const slides = [];
      this.props.slides.forEach(posts => posts.forEach(post => slides.push(post)));
      const currentIndex = slides.indexOf(this.props.post);     
      this.setState({slides, currentIndex}, () => {});
    }
  }

  
  onPrevSlide = () => {
    const {currentIndex} = this.state;
    if (currentIndex - 1 < 0 ) {
      return;
    }
    const prevSlide = this.state.slides[currentIndex - 1];
    return this.setState({currentSlide: prevSlide, currentIndex: this.state.currentIndex - 1}, () => {});
  }

  onNextSlide = () => {
    const {currentIndex} = this.state;
    if (currentIndex + 1 > this.state.slides.length - 1 ) {
      return;
    }
    const nextSlide = this.state.slides[currentIndex + 1];
    return this.setState({currentSlide: nextSlide, currentIndex: this.state.currentIndex + 1}, () => {});
  }

  render() {
    console.log(this.props.slides);
    const { classes } = this.props;
    const {
      _id,
      _owner,
      imgUrl,
      title,
      faveCount,
      isFave,
      description
    } = this.state.currentSlide;

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
            <NavigateBeforeIcon
              onClick={this.onPrevSlide}
              className={classNames(classes.navIcons, classes.navLeft)}
            />
            <img
              className={classes.image}
              src={`https://s3.amazonaws.com/img-share-kasho/${imgUrl}`}
              alt="testing"
            />
            <NavigateNextIcon
              onClick={this.onNextSlide}
              className={classNames(classes.navIcons, classes.navRight)}
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

const mapStateToProps = (state) => {
  if(state.slidesSource === 'feed') {
    return {
      slidesSource: state.slidesSource,
      slides: state.posts
    }
  }
  if(state.slidesSource === 'album') {
    return {
      slidesSource: state.slidesSource,
      slides: state.album
    }
  }
  if(state.slidesSource === 'faves') {
    return {
      slidesSource: state.slidesSource,
      slides: state.faves
    }
  }
};

ImageModalView.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ImageModalView);
