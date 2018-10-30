import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import axios from "axios";

import PostCard from "../components/post/PostCard";
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
      hasMore: true
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
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

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
    this.signal.cancel("Async call cancelled.");
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
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
                  <PostCard cardContext="album" post={post} />
                </GridListTile>
              ))}
            </GridList>
          )}
        {this.state.initialFetch && <div>Loading</div>}
      </React.Fragment>
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
  }
});

export default withStyles(styles)(withRouter(SingleAlbumPage));
