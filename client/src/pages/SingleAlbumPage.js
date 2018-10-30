import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

import MainPageLoader from "../components/loaders/MainPageLoader";
import PostCard from "../components/post/PostCard";
import NavToTopButton from "../components/buttons/NavToTopButton";

import { favePost } from "../async/posts";
import { fetchAlbumPostsPaginated } from "../async/albums";
import { onScroll } from "../utils/utils";

export class SingleAlbumPage extends React.Component {
  constructor() {
    super();

    this.state = {
      initialFetch: true,
      isFetching: false,
      page: 0,
      pages: null,
      hasMore: true,
      showNavToTop: false
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
    this.topRef = React.createRef();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
    try {
      const { albumid } = this.props.match.params;
      const { data: albumPosts } = await fetchAlbumPostsPaginated(
        this.signal.token,
        albumid,
        0
      );
      this.setState({
        initialFetch: false,
        pages: [...albumPosts],
        page: this.state.page + 1
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e);
      }
      console.log(e);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
    this.signal.cancel("Async call cancelled.");
  }

  fetchNextPage = () => {
    if (this.state.isFetching || !this.state.hasMore) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { albumid } = this.props.match.params;
        const { data: albumPosts } = await fetchAlbumPostsPaginated(
          this.signal.token,
          albumid,
          this.state.page
        );

        if (!albumPosts.length) {
          return this.setState({ isFetching: false, hasMore: false }, () => {});
        }
        this.setState(
          {
            isFetching: false,
            pages: [...this.state.pages, ...albumPosts],
            page: this.state.page + 1
          },
          () => {}
        );
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  };

  onFavePost = async postId => {
    try {
      await favePost(this.signal.token, postId);
      const updatedPages = this.state.pages.map(post => {
        if (post._id === postId) {
          console.log("TRUE");
          return {
            ...post,
            isFave: !post.isFave,
            faveCount: post.isFave ? post.faveCount - 1 : post.isFave + 1
          };
        }
        return post;
      });
      console.log(updatedPages);
      this.setState({ pages: updatedPages }, () => {});
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  scrollToTop = () => {
    this.topRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div ref={this.topRef}>
        {this.state.initialFetch && <MainPageLoader />}
        {!this.state.initialFetch &&
          this.state.pages && (
            <GridList className={classes.gridList} cols={3}>
              {this.state.pages.map(post => (
                <GridListTile
                  key={post._id}
                  cols={1}
                  classes={{
                    root: classes.gridTileRoot,
                    tile: classes.tile
                  }}
                >
                  <PostCard
                    onFavePost={this.onFavePost}
                    cardContext="album"
                    post={post}
                  />
                </GridListTile>
              ))}
            </GridList>
          )}
        {this.state.showNavToTop && (
          <NavToTopButton scrollToTop={this.scrollToTop} />
        )}
        {this.state.isFetching && (
          <div className={classes.circularProgressContainer}>
            <CircularProgress color="primary" size={50} />
          </div>
        )}
      </div>
    );
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
};

const styles = theme => ({
  gridList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    overflowY: "unset"
  },
  gridTileRoot: {
    height: "auto !important",
    width: "100% !important",
    [theme.breakpoints.up("sm")]: {
      width: "45% !important",
      margin: "0 auto"
    },
    [theme.breakpoints.up("lg")]: {
      width: "30% !important",
      margin: "0 auto"
    }
  },
  // Inner div that wraps children
  tile: {
    overflow: "initial"
  },
  circularProgressContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: `${theme.spacing.unit * 4}px`
  }
});

export default withStyles(styles)(withRouter(SingleAlbumPage));
