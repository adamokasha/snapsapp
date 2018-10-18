import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import axios from "axios";

import ImageGrid from "./ImageGrid";
import { setPostContext, setPosts } from "../actions/posts";

const styles = theme => ({
  root: {
    backgroundColor: `${theme.palette.background.paper}`
  },
  circularProgress: {
    margin: "16px auto",
    display: "block"
  },
  toTopButton: {
    margin: theme.spacing.unit,
    position: "fixed",
    bottom: "5%",
    right: "5%",
    zIndex: 5000
  },
  navIcon: {
    marginRight: theme.spacing.unit
  }
});

export class ScrollView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      morePagesAvailable: true,
      isFetching: false,
      pages: [],
      gridContext: "posts",
      albums: [],
      profilePages: [],
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

    const loadData = this.loadData.bind(this);
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
        loadData();
      }
    }

    window.addEventListener("scroll", this.onScroll, false);
  }

  loadData = () => {
    if (this.state.isFetching || !this.state.morePagesAvailable) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      const { context } = this.props;
      let res;
      let gridContext;
      switch (context) {
        case "popular":
          res = await axios.get(`/api/posts/popular/${this.state.currentPage}`);
          gridContext = "posts";
          break;
        case "new":
          res = await axios.get(`/api/posts/new/${this.state.currentPage}`);
          gridContext = "posts";
          break;
        case "following":
          res = await axios.get(`/api/posts/follows/${this.state.currentPage}`);
          gridContext = "profiles";
          break;
        case "userPosts":
          res = await axios.get(
            `/api/posts/user/all/${this.props.user}/${this.state.currentPage}`
          );
          gridContext = "posts";
          break;
        case "userFaves":
          res = await axios.get(
            `/api/posts/user/faves/${this.props.user}/${this.state.currentPage}`
          );
          gridContext = "posts";
          break;
        case "userAlbums":
          res = await axios.get(
            `/api/albums/all/${this.props.user}/${this.state.currentPage}`
          );
          gridContext = "albums";
          break;
        case "userFollows":
          res = await axios.get(
            `/api/profile/follows/${this.props.userId}/${
              this.state.currentPage
            }`
          );
          gridContext = "profiles";
          break;
        case "userFollowers":
          res = await axios.get(
            `/api/profile/followers/${this.props.userId}/${
              this.state.currentPage
            }`
          );
          gridContext = "profiles";
          break;
        case "searchPosts":
          res = await axios.post(
            `/api/posts/search/${this.state.currentPage}`,
            {
              searchTerms: this.props.searchTerms
            }
          );
          gridContext = "posts";
          break;
        case "searchUsers":
          res = await axios.post(
            `/api/profile/search/${this.state.currentPage}`,
            { searchTerms: this.props.searchTerms }
          );
          gridContext = "profiles";
          break;
        default:
          return (res = []);
      }

      if (!res.data.length) {
        return this.setState(
          { morePagesAvailable: false, isFetching: false },
          () => {}
        );
      }

      return this.setState(
        {
          currentPage: this.state.currentPage + 1,
          pages: [...this.state.pages, res.data],
          gridContext,
          isFetching: false
        },
        () => {
          this.props.setPosts(res.data);
        }
      );
    });
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    // Case: context switching
    if (this.props.context !== prevProps.context) {
      return this.setState(
        {
          currentPage: 0,
          isFetching: false,
          pages: [],
          morePagesAvailable: true
        },
        () => {
          this.loadData();
        }
      );
    }

    // Case: search terms change
    if (this.props.searchTerms !== prevProps.searchTerms) {
      return this.setState(
        {
          currentPage: 0,
          morePagesAvailable: true,
          isFetching: false,
          pages: [],
          albums: [],
          profilePages: [],
          showNavToTop: false
        },
        () => {
          this.loadData();
        }
      );
    }
  }

  componentWillUnmount() {
    // Prevent memory leak
    window.removeEventListener("scroll", this.onScroll, false);
  }

  goTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { classes, context, posts } = this.props;

    return (
      <div className={classes.root}>
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
              <ImageGrid
                key={i}
                gridData={page}
                gridContext={this.state.gridContext}
              />
            ))
          : null}
        {this.state.isFetching ? (
          <CircularProgress className={classes.circularProgress} size={50} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

ScrollView.propTypes = {
  context: PropTypes.string.isRequired,
  searchTerms: PropTypes.array
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setPosts, setPostContext }
  )
)(ScrollView);
