import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

import MainPageLoader from "../components/loaders/MainPageLoader";
import Search from "../components/mainpage/Search";
import MainPageMenu from "../components/mainpage/MainPageMenu";
import HeroUnit from "../components/mainpage/HeroUnit";
import PostCardActions from "../components/post/PostCardActions";
import ModalView from "../components/modal/ModalView";
import PostLightbox from "../components/post/PostLightbox";
import ProfileHeader from "../components/profile/ProfileHeader";
import NavToTopButton from "../components/buttons/NavToTopButton";

import { fetchForMainPage } from "../async/combined";
import { fetchPopular, favePost } from "../async/posts";
import { onScroll } from "../utils/utils";

export class MainPage extends React.Component {
  constructor() {
    super();

    this.state = {
      context: "popular",
      gridContext: "posts",
      searchTerms: null,
      page: 0,
      pages: [],
      initialFetch: true,
      isFetching: false,
      hasMore: true,
      showNavToTop: false
    };

    this.onScroll = onScroll.bind(this);
    this.signal = axios.CancelToken.source();
    this.topRef = React.createRef();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);

    try {
      const { data: postData } = await fetchPopular(this.signal.token, 0);
      this.setState(
        { initialFetch: false, page: 1, pages: [...postData] },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
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
        const { data } = await fetchForMainPage(
          this.signal.token,
          this.state.context,
          this.state.page,
          this.state.searchTerms
        );

        if (!data.length) {
          return this.setState({ hasMore: false, isFetching: false }, () => {});
        }

        this.setState(
          {
            isFetching: false,
            page: this.state.page + 1,
            pages: [...this.state.pages, ...data]
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

  deriveGridContext = context => {
    let gridContext;
    // searchUsers will be profiles, rest are posts
    if (["searchUsers"].includes(context)) {
      gridContext = "profiles";
    } else {
      gridContext = "posts";
    }
    return gridContext;
  };

  onSwitchContext = (context, searchTerms = null) => {
    try {
      this.setState({ isFetching: true, pages: [] }, async () => {
        const { data } = await fetchForMainPage(
          this.signal.token,
          context,
          0,
          searchTerms
        );
        const gridContext = this.deriveGridContext(context);
        this.setState({
          context,
          isFetching: false,
          page: 1,
          pages: [...data],
          gridContext
        });
      });
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

  renderGrid = data => {
    const gridContext = this.deriveGridContext(this.state.context);
    const { classes } = this.props;
    return (
      <Grid
        classes={{ "spacing-xs-24": classes.spacingXs24 }}
        direction="row"
        wrap="wrap"
        justify={
          (gridContext === "profiles" && "center") ||
          (gridContext === "posts" && "space-evenly")
        }
        container
        spacing={
          (gridContext === "profiles" && 24) || (gridContext === "posts" && 24)
        }
      >
        {data.map(item => (
          <Grid
            item
            key={item._id}
            classes={{
              item:
                gridContext === "profiles" ? classes.albumItem : classes.item
            }}
            xs={
              (gridContext === "profiles" && 6) ||
              (gridContext === "posts" && 12)
            }
            sm={
              (gridContext === "profiles" && 4) ||
              (gridContext === "posts" && 6)
            }
            md={gridContext === "posts" && 6}
            lg={gridContext === "posts" && 4}
            xl={gridContext === "posts" && 3}
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

            {gridContext === "profiles" && (
              <Link
                className={classes.aTag}
                to={`/profile/${item.displayName}`}
              >
                <ProfileHeader
                  profilePhoto={item.profilePhoto}
                  displayName={item.displayName}
                  joined={item.joined}
                />
              </Link>
            )}
          </Grid>
        ))}
      </Grid>
    );
  };

  render() {
    console.log("MAINPAGE RENDERED");
    const { classes } = this.props;
    return (
      <div ref={this.topRef}>
        {!this.state.initialFetch && !this.props.auth && <HeroUnit />}
        {this.state.initialFetch && <MainPageLoader />}
        {!this.state.initialFetch && (
          <React.Fragment>
            <div className={classes.menuContainer}>
              <MainPageMenu
                auth={this.props.auth}
                onSwitchContext={this.onSwitchContext}
              />
              <Search
                className={classes.search}
                classes={{ root: classes.searchRoot }}
                onSwitchContext={this.onSwitchContext}
              />
            </div>
            {this.state.pages && this.renderGrid(this.state.pages)}
          </React.Fragment>
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

MainPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  menuContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // add with of icon button as padding to center search
    paddingRight: "48px",
    zIndex: 1000
  },
  searchRoot: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "start",
      width: "250px"
    }
  },
  spacingXs24: {
    width: "100%",
    margin: 0
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
  aTag: {
    color: "inherit",
    textDecoration: "none"
  },
  circularProgress: {
    margin: "16px auto",
    display: "block"
  }
});

const mapStateToProps = auth => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(MainPage);
