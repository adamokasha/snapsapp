import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';

import ImageGrid from '../components/ImageGrid';
import { fetchPosts } from '../actions/posts';

const styles = theme => ({
  circularLoader: {
    margin: '16px auto',
    display: 'block'
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '5%',
    right: '5%',
    zIndex: 5000
  },
  goTopBtn: {
    marginRight: theme.spacing.unit
  }
});

export class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      morePagesAvailable: true,
      isFetching: false,
      pages: this.props.posts || [],
      showNavToTop: false
    };

    // Prevent loadImages 'this' context being window in onScroll window event
    const loadImages = this.loadImages.bind(this);
    const boundSetState = this.setState.bind(this);

    let throttledEvent;

    window.onscroll = function() {
      // Clear throttled event on scroll
      if (throttledEvent) {
        window.clearTimeout(throttledEvent);
      }

      // Optimize scrolling by having scroll events fire only every 100ms for rendering navtotop button
      throttledEvent = window.setTimeout(function() {
        if (window.pageYOffset > window.innerHeight) {
          boundSetState({ showNavToTop: true });
        }
        if (window.pageYOffset < window.innerHeight) {
          boundSetState({ showNavToTop: false });
        }
      }, 100);

      // The loadImages check is not throttled to ensure that it is not in throttled state if we reach bottom
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        loadImages();
      }
    };
  }

  loadImages = async () => {
    const { posts } = this.props;
    if (!this.state.morePagesAvailable || this.state.isFetching) {
      return;
    }
    // If last array in posts has length < 12 return
    if (posts[posts.length - 1].length < 12) {
      return this.setState({ morePagesAvailable: false });
    }

    this.setState({ isFetching: true });
    await this.props.fetchPosts(this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage + 1,
      pages: [posts],
      isFetching: false
    });
  };

  async componentDidMount() {
    this.setState({ isFetching: true });
    await this.props.fetchPosts(this.state.currentPage);
    this.setState({
      pages: [this.props.posts],
      currentPage: this.state.currentPage + 1,
      isFetching: false
    });
    this.state;
  }

  goTop = () => {
    window.scrollTo(0, 0);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.showNavToTop ? (
          <Button
            variant="extendedFab"
            aria-label="Delete"
            className={classes.button}
            onClick={this.goTop}
          >
            <NavigationIcon className={classes.goTopBtn} />
            Go to Top
          </Button>
        ) : null}
        {this.state.pages.map(page => {
          return page.map(post => <ImageGrid imageData={post} />);
        })}
        {this.state.isFetching ? (
          <CircularProgress className={classes.circularLoader} size={50} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { fetchPosts }
  )
)(Feed);
