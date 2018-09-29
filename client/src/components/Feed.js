import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';
import axios from 'axios';

import ImageGrid from '../components/ImageGrid';
import { setPosts, setPostContext } from '../actions/posts';
import AlbumList from './AlbumList';

const styles = theme => ({
  circularLoader: {
    margin: '16px auto',
    display: 'block'
  },
  toTopButton: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '5%',
    right: '5%',
    zIndex: 5000
  },
  navIcon: {
    marginRight: theme.spacing.unit
  }
});

export class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: this.props.posts.length || 0,
      morePagesAvailable: true,
      isFetching: false,
      pages: [],
      albums: [],
      showNavToTop: false
    };

    /* global pageYOffset, innerHeight */
    let pageYOffset,
      innerHeight,
      docOffsetHeight,
      ticking = false;

    this.onScroll = function() {
      pageYOffset = window.pageYOffset;
      innerHeight = window.innerHeight;
      docOffsetHeight = document.body.offsetHeight;
      requestTick();
    };

    // Scroll optimization using raf
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame;

    function requestTick() {
      if (!ticking) {
        raf(update);
      }
      ticking = true;
    }

    const loadImages = this.loadImages.bind(this);
    const boundSetState = this.setState.bind(this);

    function update() {
      ticking = false;

      const currentPageYOffset = pageYOffset;
      const currentInnerHeight = innerHeight;
      const currentDocOffsetHeight = docOffsetHeight;

      if (currentPageYOffset > currentInnerHeight) {
        boundSetState({ showNavToTop: true });
      }
      if (currentPageYOffset < currentInnerHeight) {
        boundSetState({ showNavToTop: false });
      }
      if (currentInnerHeight + currentPageYOffset >= currentDocOffsetHeight) {
        loadImages();
      }
    }

    window.addEventListener('scroll', this.onScroll, false);
  }

  loadImages = async () => {
    if (this.state.isFetching || !this.state.morePagesAvailable) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      const {context} = this.props;
      let res;
      if (context === 'home') {
        res = await axios.get(`/api/posts/all/${this.state.currentPage}`);
      } else if (context === 'userposts') {
        res = await axios.get(`/api/posts/user/all/${this.props.user}/${this.state.currentPage}`)
      } else if (context === 'userfaves') {
        res = await axios.get(`/api/posts/user/faves/${this.props.user}/${this.state.currentPage}`)
      } else if (context === 'useralbums') {
        res = await axios.get(`/api/albums/all/${this.props.user}`);
        return this.setState({
          albums: [...res.data],
          isFetching: false,
          morePagesAvailable: false
        })
      }

      if (!res.data.length) {
        this.setState({ morePagesAvailable: false }, () => {
          return;
        });
      }

      this.setState(
        {
          currentPage: this.state.currentPage + 1,
          pages: [...this.state.pages, res.data],
          isFetching: false
        },
        () => {
          return this.props.setPosts(res.data);
        }
      );
    });
  };

  componentDidMount() {
    this.setState({ isFetching: true }, async () => {
      const {context} = this.props;
      let res;
      if (context === 'home') {
        res = await axios.get(`/api/posts/all/${this.state.currentPage}`);
      } else if (context === 'userposts') {
        res = await axios.get(`/api/posts/user/all/${this.props.user}/${this.state.currentPage}`)
      } else if (context === 'userfaves') {
        res = await axios.get(`/api/posts/user/faves/${this.props.user}/${this.state.currentPage}`)
      } else if (context === 'useralbums') {
        res = await axios.get(`/api/albums/all/${this.props.user}`);
        return this.setState({
          albums: [...res.data],
          isFetching: false,
          morePagesAvailable: false
        })
      }

      this.setState(
        {
          pages: [res.data],
          currentPage: this.state.currentPage + 1,
          isFetching: false
        },
        () => {
          this.props.setPostContext(this.props.context);
          this.props.setPosts(res.data);
        }
      );
    });
  }

  componentWillUnmount() {
    // Prevent memory leak
    window.removeEventListener('scroll', this.onScroll, false);
  }

  goTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.showNavToTop ? (
          <Button
            id="goTopButton"
            variant="extendedFab"
            aria-label="go-top"
            className={classes.toTopButton}
            onClick={this.goTop}
          >
            <NavigationIcon className={classes.navIcon} />
            Go to Top
          </Button>
        ) : null}
        {this.state.pages
          ? this.state.pages.map((page, i) => (
              <ImageGrid key={i} posts={page} />
            ))
          : null}
        {this.state.isFetching ? (
          <CircularProgress className={classes.circularLoader} size={50} />
        ) : null}
        {
          this.state.albums ? (
            <AlbumList albums={this.state.albums} />
          ) : null
        }
      </div>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

Feed.propTypes = {
  context: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setPosts, setPostContext }
  )
)(Feed);
