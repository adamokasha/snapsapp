import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import axios from "axios";

import Grid from "./Grid";
import { setPosts } from "../actions/posts";
import * as async from "../async/scrollview";

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
      isFetching: true,
      pages: [],
      gridContext: "posts",
      showNavToTop: false
    };

    this.signal = axios.CancelToken.source();
  }

  onScroll = () => {
    /* global pageYOffset, innerHeight */
    let pageYOffset,
      innerHeight,
      docOffsetHeight,
      ticking = false;

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(update);
      }
      ticking = true;
    };

    const update = () => {
      ticking = false;

      const currentPageYOffset = pageYOffset;
      const currentInnerHeight = innerHeight;
      const currentDocOffsetHeight = docOffsetHeight;

      if (
        this.state.showNavToTop === false &&
        currentPageYOffset > currentInnerHeight
      ) {
        this.setState({ showNavToTop: true });
      }
      if (
        this.state.showNavToTop === true &&
        currentPageYOffset < currentInnerHeight
      ) {
        this.setState({ showNavToTop: false });
      }
      if (currentInnerHeight + currentPageYOffset >= currentDocOffsetHeight) {
        this.loadData();
      }
    };

    pageYOffset = window.pageYOffset;
    innerHeight = window.innerHeight;
    docOffsetHeight = document.body.offsetHeight;
    requestTick();
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
    try {
      const { data } = await this.doAsync();
      this.updateState(data);
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
    }
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
    this.signal.cancel("Async call cancelled.");
  }

  setGridContext = context => {
    let gridContext;
    const needsPostsGrid = [
      "popular",
      "new",
      "following",
      "userPosts",
      "userFaves",
      "searchPosts"
    ];
    const needsAlbumsGrid = ["userAlbums"];
    const needsAlbumPostsGrid = ["albumPosts"];
    const needsProfileGrid = ["userFollows", "userFollowers", "searchUsers"];

    if (needsPostsGrid.includes(context)) {
      gridContext = "posts";
    }
    if (needsAlbumsGrid.includes(context)) {
      gridContext = "albums";
    }
    if (needsAlbumPostsGrid.includes(context)) {
      gridContext = "albumPosts";
    }
    if (needsProfileGrid.includes(context)) {
      gridContext = "profiles";
    }

    return gridContext;
  };

  loadData = () => {
    if (this.state.isFetching || !this.state.morePagesAvailable) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { data } = await this.doAsync();
        this.updateState(data);
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        console.log(e);
        this.setState({ isFetching: false }, () => {});
      }
    });
  };

  doAsync = async () => {
    try {
      const { context, user, userId, albumId, searchTerms } = this.props;
      const { currentPage: page } = this.state;
      const { token: cancelToken } = this.signal;

      return await async.fetchScrollViewData(
        cancelToken,
        context,
        user,
        userId,
        albumId,
        searchTerms,
        page
      );
    } catch (e) {
      throw e;
    }
  };

  updateState = data => {
    const { context } = this.props;
    const gridContext = this.setGridContext(context);
    if (!data.length) {
      return this.setState(
        { morePagesAvailable: false, isFetching: false },
        () => {}
      );
    }
    return this.setState(
      {
        currentPage: this.state.currentPage + 1,
        pages: [...this.state.pages, data],
        gridContext,
        isFetching: false
      },
      () => {
        this.props.setPosts(data);
      }
    );
  };

  goTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { classes, context, posts } = this.props;
    console.log("ScrollView Rendered");
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

        {this.state.pages.length > 0
          ? this.state.pages.map((page, i) => (
              <Grid
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
// user, userId, albumId
ScrollView.propTypes = {
  context: PropTypes.string.isRequired,
  user: PropTypes.string,
  userId: PropTypes.string,
  albumId: PropTypes.string,
  searchTerms: PropTypes.array
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setPosts }
  )
)(ScrollView);
