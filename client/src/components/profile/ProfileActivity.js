import React from "react";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Album from "../album/Album";
import Button from "@material-ui/core/Button";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import moment from "moment";

import PostMenu from "../post/PostMenu";
import PostCardActions from "../post/PostCardActions";
import ModalView from "../modal/ModalView";
import PostLightbox from "../post/PostLightbox";
import AlbumMaker from "../album/AlbumMaker";
import NavToTopButton from "../buttons/NavToTopButton";
import CustomSnackbar from "../snackbar/CustomSnackbar";

import { onScroll } from "../../utils/utils";
import { fetchForProfilePage } from "../../async/combined";
import { deletePost, updatePost, favePost } from "../../async/posts";

class ProfileActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.profileTabPos,
      isFetching: false,
      pages: this.props.pages,
      page: 1,
      hasMore: true,
      showNavToTop: false,
      snackbarOpen: false,
      snackbarVar: null,
      snackbarMessage: ""
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.call(this, this.fetchNextPage);
    this.topRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.profileTabPos !== prevProps.profileTabPos) {
      this.handleChange(null, this.props.profileTabPos);
    }
  }

  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

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
        const mappedValToContext = {
          0: "userFaves",
          1: "userPosts",
          2: "userAlbums"
        };
        const { data } = await fetchForProfilePage(
          this.signal.token,
          mappedValToContext[`${this.state.value}`],
          this.state.page,
          this.props.user
        );

        if (!data.length) {
          return this.setState({ hasMore: false, isFetching: false }, () => {});
        }
        this.setState(
          {
            pages: [...this.state.pages, ...data],
            isFetching: false,
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

  handleChange = (event, value) => {
    try {
      this.setState(
        { value, isFetching: true, pages: [], page: 0, hasMore: true },
        async () => {
          const mappedValToContext = {
            0: "userFaves",
            1: "userPosts",
            2: "userAlbums"
          };
          const { data } = await fetchForProfilePage(
            this.signal.token,
            mappedValToContext[value],
            0,
            this.props.user
          );

          this.setState(
            { isFetching: false, pages: [...data], page: 1 },
            () => {}
          );
        }
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
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
      this.setState({ pages: updatedPages, isFaving: false }, () => {});
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  toggleShowNavToTopButton = bool => {
    this.setState({ showNavToTop: bool });
  };

  scrollToTop = () => {
    this.topRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };

  onDeletePost = async (imgUrl, id) => {
    try {
      // await axios.delete(`/api/delete?img=${imgUrl}&id=${id}`);
      await deletePost(this.signal.token, imgUrl, id);
      const filteredPages = this.state.pages.filter(post => post._id !== id);
      this.setState(
        {
          pages: filteredPages,
          snackbarOpen: true,
          snackbarVar: "success",
          snackbarMessage: "Post deleted successfully."
        },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  onEditPost = async (id, title, tags, description) => {
    try {
      // await axios.patch(`/api/posts/edit/${id}`, { title, description, tags });
      await updatePost(this.signal.token, id, title, tags, description);
      const mappedPages = this.state.pages.map(post => {
        if (post._id === id) {
          return { ...post, title, description, tags };
        }
        return post;
      });
      this.setState(
        {
          pages: [...mappedPages],
          snackbarOpen: true,
          snackbarVar: "success",
          snackbarMessage: "Post updated successfully."
        },
        () => {}
      );
    } catch (e) {
      return console.log(e);
    }
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  renderGrid = data => {
    const { classes, ownProfile } = this.props;

    // Derive gridContext by tab value (0, 1 = posts, 2 = albums)
    const gridContext = this.state.value === 2 ? "albums" : "posts";

    return (
      <Grid
        classes={{ "spacing-xs-24": classes.spacingXs24 }}
        direction="row"
        wrap="wrap"
        justify={
          (gridContext === "albums" && "center") ||
          (gridContext === "posts" && "flex-start")
        }
        container
        spacing={
          (gridContext === "albums" && 0) ||
          (gridContext === "posts" && 24) ||
          0
        }
      >
        {data.map(item => (
          <Grid
            item
            key={item._id}
            classes={{
              item: gridContext === "albums" ? classes.albumItem : classes.item
            }}
            xs={
              (gridContext === "albums" && "auto") ||
              (gridContext === "posts" && 12)
            }
            sm={gridContext === "posts" && 12}
            md={gridContext === "posts" && 6}
            lg={gridContext === "posts" && 4}
            xl={gridContext === "posts" && 4}
          >
            {gridContext === "posts" && (
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar
                      to={`/profile/${item._owner.displayName}`}
                      component={Link}
                      aria-label="Recipe"
                    >
                      <img src={item._owner.profilePhoto} alt="avatar" />
                    </Avatar>
                  }
                  action={
                    ownProfile &&
                    this.state.value === 1 && (
                      <PostMenu
                        onEditPost={this.onEditPost}
                        onDeletePost={this.onDeletePost}
                        post={item}
                      />
                    )
                  }
                  title={item.title || "Untitled"}
                  subheader={item._owner.displayName}
                />

                {window.screen.width < 600 || window.innerWidth < 600 ? (
                  <Link
                    to={{
                      pathname: `/post/${item._id}/`,
                      state: { post: item }
                    }}
                  >
                    <CardMedia
                      className={classes.media}
                      image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${
                        item.imgUrl
                      }`}
                      title={item.title || "Image Title"}
                    />
                  </Link>
                ) : (
                  <ModalView
                    togglerComponent={
                      <CardMedia
                        onClick={() => this.toggleShowNavToTopButton(false)}
                        className={classes.media}
                        image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${
                          item.imgUrl
                        }`}
                        title={item.title || "Untitled"}
                      />
                    }
                    modalComponent={
                      <PostLightbox
                        onFavePost={this.onFavePost}
                        slideData={this.state.pages}
                        slideIndex={this.state.pages.indexOf(item)}
                        post={item}
                        isFirstSlide={this.state.pages.indexOf(item) === 0}
                        isLastSlide={
                          this.state.pages.length - 1 ===
                          this.state.pages.indexOf(item)
                        }
                      />
                    }
                  />
                )}

                <CardContent>
                  <div>
                    <Typography variant="caption">
                      {moment(item.createdAt).format("MMM Do YY")}
                    </Typography>
                  </div>
                  <Typography>{item.description}</Typography>
                </CardContent>
                <Divider />

                <CardActions className={classes.actions} disableActionSpacing>
                  <PostCardActions
                    commentCount={item.commentCount}
                    faveCount={item.faveCount}
                    _id={item._id}
                    imgUrl={item.imgUrl}
                    onFavePost={() => this.onFavePost(item._id)}
                    isFave={item.isFave}
                  />
                </CardActions>
              </Card>
            )}

            {gridContext === "albums" && (
              <Album ownAlbum={this.props.ownProfile} album={item} />
            )}
          </Grid>
        ))}
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div ref={this.topRef} className={classes.root}>
        <AppBar
          classes={{ root: classes.appBarRoot }}
          position="static"
          color="default"
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Faves" />
            <Tab label="Posts" />
            <Tab label="Albums" />
          </Tabs>
        </AppBar>

        {this.state.pages && this.renderGrid(this.state.pages)}

        {this.state.value === 2 && this.props.ownProfile && (
          <ModalView
            togglerComponent={
              <Button
                className={classes.fabAddAlbum}
                variant="fab"
                color="secondary"
              >
                <AddPhotoAlternateOutlinedIcon />
              </Button>
            }
            modalComponent={<AlbumMaker withSnackbar={true} />}
          />
        )}
        {this.state.isFetching && (
          <CircularProgress className={classes.circularProgress} size={50} />
        )}
        {this.state.showNavToTop && (
          <NavToTopButton scrollToTop={this.scrollToTop} />
        )}
        <CustomSnackbar
          variant={this.state.snackbarVar}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
          snackbarOpen={this.state.snackbarOpen}
        />
      </div>
    );
  }
}

ProfileActivity.propTypes = {
  classes: PropTypes.object.isRequired,
  profileTabPos: PropTypes.number,
  ownProfile: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
    marginTop: 0,
    backgroundColor: theme.palette.background.paper,
    width: "100%"
  },
  appBarRoot: {
    marginBottom: `${theme.spacing.unit}px`
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
    justifyContent: "space-between"
  },
  spacingXs24: {
    width: "100%",
    margin: 0
  },
  albumItem: {
    minWidth: "200px"
  },
  fabAddAlbum: {
    position: "fixed",
    bottom: "5%",
    right: "2%"
  },
  circularProgress: {
    margin: "16px auto",
    display: "block"
  }
});

export default withStyles(styles)(ProfileActivity);
