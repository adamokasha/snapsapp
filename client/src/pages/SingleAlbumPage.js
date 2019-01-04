import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import moment from "moment";

import MainPageLoader from "../components/loaders/MainPageLoader";
import PostCardActions from "../components/post/PostCardActions";
import ModalView from "../components/modal/ModalView";
import PostLightbox from "../components/post/PostLightbox";
import AlbumMaker from "../components/album/AlbumMaker";
import ShareButton from "../components/buttons/ShareButton";
import NavToTopButton from "../components/buttons/NavToTopButton";
import ConfirmationModal from "../components/modal/ConfirmationModal";
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
      snackbarMessage: "",
      snackbarOpen: false
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.call(this, this.fetchNextPage);
    this.topRef = React.createRef();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
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

  onAlbumDelete = async () => {
    try {
      await axios.delete(`/api/albums/delete?id=${this.state.albumId}`);
      this.props.history.push({
        pathname: `/profile/${this.props.auth.displayName}`,
        state: {
          snackbarOpen: true,
          snackbarVar: "success",
          snackbarMessage: "Album deleted successfully",
          profileTabPos: 2
        }
      });
    } catch (e) {
      console.log(e);
    }
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
          return {
            ...post,
            isFave: !post.isFave,
            faveCount: post.isFave ? post.faveCount - 1 : post.isFave + 1
          };
        }
        return post;
      });
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
              <ShareButton
                context="album"
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
                  <React.Fragment>
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
                    <ModalView
                      togglerComponent={
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      }
                      modalComponent={
                        <ConfirmationModal onDelete={this.onAlbumDelete} />
                      }
                    />
                  </React.Fragment>
                )}
            </div>
          </div>
        )}
        {this.state.initialFetch && <MainPageLoader />}
        {!this.state.initialFetch && this.state.pages && (
          <Grid
            container
            classes={{ "spacing-xs-24": classes.spacingXs24 }}
            direction="row"
            wrap="wrap"
            justify={"space-evenly"}
            spacing={24}
          >
            {this.state.pages.map(post => (
              <Grid item key={post._id} xs={12} sm={6} md={6} lg={4} xl={4}>
                <Card>
                  {window.screen.width < 600 || window.innerWidth < 600 ? (
                    <Link
                      to={{
                        pathname: `/post/${post._id}/`,
                        state: { post: post }
                      }}
                    >
                      <CardMedia
                        className={classes.media}
                        image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${
                          post.imgUrl
                        }`}
                        title={post.title || "Image Title"}
                      />
                    </Link>
                  ) : (
                    <ModalView
                      togglerComponent={
                        <CardMedia
                          onClick={() => this.toggleShowNavToTopButton(false)}
                          className={classes.media}
                          image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${
                            post.imgUrl
                          }`}
                          title={post.title || "Untitled"}
                        />
                      }
                      modalComponent={
                        <PostLightbox
                          onFavePost={this.onFavePost}
                          slideData={this.state.pages}
                          slideIndex={this.state.pages.indexOf(post)}
                          post={post}
                          isFirstSlide={this.state.pages.indexOf(post) === 0}
                          isLastSlide={
                            this.state.pages.length - 1 ===
                            this.state.pages.indexOf(post)
                          }
                        />
                      }
                    />
                  )}

                  <CardContent>
                    <div>
                      <Typography variant="body2">{post.title}</Typography>
                      <Typography variant="caption">
                        Posted {moment(post.createdAt).format("MMM Do YY")}
                      </Typography>
                    </div>
                  </CardContent>
                  <Divider />

                  <CardActions className={classes.actions} disableActionSpacing>
                    <PostCardActions
                      commentCount={post.commentCount}
                      faveCount={post.faveCount}
                      _id={post._id}
                      imgUrl={post.imgUrl}
                      onFavePost={() => this.onFavePost(post._id)}
                      isFave={post.isFave}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
  card: {
    maxWidth: 400,
    margin: `${theme.spacing.unit * 3}px auto`
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  spacingXs24: {
    width: "100%",
    margin: 0
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
