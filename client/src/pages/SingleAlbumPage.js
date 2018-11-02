import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import SettingsIcon from "@material-ui/icons/Settings";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import moment from "moment";

import MainPageLoader from "../components/loaders/MainPageLoader";
import PostCard from "../components/post/PostCard";
import ModalView from "../components/modal/ModalView";
import AlbumMaker from "../components/album/AlbumMaker";
import PostShare from "../components/post/PostShare";
import NavToTopButton from "../components/buttons/NavToTopButton";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

import { favePost } from "../async/posts";
import { fetchAlbumPostsPaginated } from "../async/albums";
import { onScroll } from "../utils/utils";

export class SingleAlbumPage extends React.Component {
  constructor() {
    super();

    this.state = {
      initialFetch: true,
      isFetching: false,
      albumId: null,
      albumName: null,
      albumOwner: null,
      createdAt: null,
      page: 0,
      pages: null,
      hasMore: true,
      showNavToTop: false,
      snackbarVar: null,
      snackbarMessage: null,
      snackbarOpen: false
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
    this.topRef = React.createRef();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
    try {
      const { albumid } = this.props.match.params;
      const { data: album } = await fetchAlbumPostsPaginated(
        this.signal.token,
        albumid,
        0
      );
      this.setState({
        initialFetch: false,
        albumId: album._id,
        albumName: album.name,
        albumOwner: album._displayName,
        createdAt: album.createdAt,
        pages: [...album.posts],
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

  onAlbumUpdate = () => {
    this.setState(
      {
        initialFetch: true,
        isFetching: false,
        page: 0,
        pages: null,
        albumName: null,
        hasMore: true,
        showNavToTop: false,
        snackbarVar: "success",
        snackbarMessage: "Album updated successfully.",
        snackbarOpen: true
      },
      async () => {
        try {
          const { albumid } = this.props.match.params;
          const { data: album } = await fetchAlbumPostsPaginated(
            this.signal.token,
            albumid,
            0
          );
          this.setState({
            initialFetch: false,
            albumName: album.name,
            pages: [...album.posts],
            page: this.state.page + 1
          });
        } catch (e) {
          if (axios.isCancel()) {
            return console.log(e);
          }
          console.log(e);
        }
      }
    );
  };

  fetchNextPage = () => {
    if (
      this.state.initialFetch ||
      this.state.isFetching ||
      !this.state.hasMore
    ) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { albumid } = this.props.match.params;
        const { data: album } = await fetchAlbumPostsPaginated(
          this.signal.token,
          albumid,
          this.state.page
        );

        if (!album.posts.length) {
          return this.setState({ isFetching: false, hasMore: false }, () => {});
        }
        this.setState(
          {
            isFetching: false,
            pages: [...this.state.pages, ...album.posts],
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

  toggleShowNavToTopButton = bool => {
    this.setState({ showNavToTop: bool });
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  render() {
    const { classes } = this.props;
    return (
      <div ref={this.topRef}>
        {!this.state.initialFetch && (
          <div className={classes.infoContainer}>
            <div className={classes.info}>
              <Typography>
                Title:{" "}
                {this.state.albumName ? this.state.albumName : "Untitled"}
              </Typography>
              <Typography>Created by: {this.state.albumOwner}</Typography>
              <Typography>
                Created on: {moment(this.state.createdAt).format("MMM Do YYYY")}
              </Typography>
            </div>
            <div className={classes.actions}>
              <PostShare
                context="album"
                imgUrl={this.state.pages[0].imgUrl}
                user={this.state.albumOwner}
                albumId={this.state.albumId}
                button={
                  <IconButton>
                    <ShareTwoToneIcon />
                  </IconButton>
                }
              />

              {this.props.auth &&
                this.props.auth.displayName ===
                  this.props.match.params.user && (
                  <ModalView
                    togglerComponent={
                      <IconButton>
                        <SettingsIcon />
                      </IconButton>
                    }
                    modalComponent={
                      <AlbumMaker
                        albumId={this.state.albumId}
                        albumName={this.state.albumName}
                        onAlbumUpdate={this.onAlbumUpdate}
                        method="patch"
                      />
                    }
                    withSnackbar={true}
                  />
                )}
            </div>
          </div>
        )}
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
                    slideData={this.state.pages}
                    post={post}
                    toggleShowNavToTopButton={this.toggleShowNavToTopButton}
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
        <CustomSnackbar
          snackbarOpen={this.state.snackbarOpen}
          variant={this.state.snackbarVar}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
        />
      </div>
    );
  }
}

const mapStateToProps = auth => ({
  auth
});

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
};

const styles = theme => ({
  infoContainer: {
    margin: `${theme.spacing.unit * 2}px`,
    display: "flex",
    justifyContent: "space-between"
  },
  info: {
    display: "flex",
    flexDirection: "column"
  },
  actions: {
    display: "flex"
  },
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

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(withRouter(SingleAlbumPage));
