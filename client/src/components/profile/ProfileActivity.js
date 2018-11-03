import React from "react";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import PostCard from "../post/PostCard";
import Album from "../album/Album";
import Button from "@material-ui/core/Button";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

import ModalView from "../modal/ModalView";
import AlbumMaker from "../album/AlbumMaker";
import NavToTopButton from "../buttons/NavToTopButton";

import { onScroll } from "../../utils/utils";
import { fetchForProfilePage } from "../../async/combined";
import { favePost } from "../../async/posts";

class ProfileActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.profileTabPos,
      isFetching: false,
      pages: this.props.pages,
      page: 1,
      hasMore: true,
      showNavToTop: false
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
    this.topRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
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

  renderGrid = data => {
    const { classes } = this.props;

    // Derive gridContext by tab value (0, 1 = posts, 2 = albums)
    const gridContext = this.state.value === 2 ? "albums" : "posts";

    return (
      <Grid
        classes={{ "spacing-xs-24": classes.spacingXs24 }}
        direction="row"
        wrap="wrap"
        justify={
          (gridContext === "albums" && "center") ||
          (gridContext === "posts" && "space-evenly")
        }
        container
        spacing={
          (gridContext === "albums" && 0) || (gridContext === "posts" && 24)
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
              <PostCard
                toggleShowNavToTopButton={this.toggleShowNavToTopButton}
                post={item}
                slideData={this.state.pages}
                cardContext="post"
                onFavePost={this.onFavePost}
              />
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
    console.log("ProfileActivity RENDERED", this.props);

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

        {this.state.value === 2 &&
          this.props.ownProfile && (
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
      </div>
    );
  }
}

ProfileActivity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
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
  spacingXs24: {
    width: "100%",
    margin: 0
  },
  // gridList: {
  //   display: "flex",
  //   flexWrap: "wrap",
  //   justifyContent: "space-around",
  //   width: "100%",
  //   overflowY: "unset"
  // },
  // gridTileRoot: {
  //   height: "auto !important",
  //   width: "100% !important",
  //   [theme.breakpoints.up("sm")]: {
  //     width: "45% !important",
  //     margin: "0 auto"
  //   },
  //   [theme.breakpoints.up("lg")]: {
  //     width: "30% !important",
  //     margin: "0 auto"
  //   }
  // },
  // // Inner div that wraps children
  // tile: {
  //   overflow: "initial"
  // },
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

export default compose(withStyles(styles))(ProfileActivity);
