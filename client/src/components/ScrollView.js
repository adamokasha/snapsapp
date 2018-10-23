import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import axios from "axios";

import Album from "./Album";
import PostCard from "./PostCard";
import ProfileHeader from "./ProfileHeader";
import Grid from "./Grid";
import { setPosts } from "../actions/posts";
import { setAlbums } from "../actions/albums";

// import { fetchScrollViewData } from "../async/scrollview";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
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
  subheader: {
    width: "100%"
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
      context: "popular",
      pages: this.props.pages ? this.props.pages : [],
      page: 1,
      hasMore: this.props.data.hasMore,
      isFetching: this.props.data.isFetching,
      showNavToTop: false,
      searchTerms: null
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
        this.onScrolledToBottom();
      }
    };

    pageYOffset = window.pageYOffset;
    innerHeight = window.innerHeight;
    docOffsetHeight = document.body.offsetHeight;
    requestTick();
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
    // try {
    //   const { data } = await this.doAsync();
    //   this.updateState(data);
    // } catch (e) {
    //   if (axios.isCancel(e)) {
    //     return console.log(e.message);
    //   }
    //   console.log(e);
    // }
  }

  // onScrolledToBottom = () => {
  //   if (this.state.isFetching || !this.state.hasMore) {
  //     return;
  //   }
  //   console.log("BOTTOM!");

  //   this.setState({ isFetching: true }, async () => {
  //     try {
  //       const { data } = await fetchScrollViewData(
  //         this.signal.token,
  //         this.state.context,
  //         this.state.page,
  //         this.state.searchTerms
  //       );

  //       console.log(
  //         this.signal.token,
  //         this.state.context,
  //         this.state.page,
  //         this.state.searchTerms
  //       );
  //       if (!data.length) {
  //         return this.setState({ hasMore: false, isFetching: false }, () => {});
  //       }

  //       this.setState(
  //         {
  //           isFetching: false,
  //           page: this.state.page + 1
  //         },
  //         () => {
  //           if (this.state.context === "posts") {
  //             return this.props.setPosts(data);
  //           }
  //           return this.props.setAlbums(data);
  //         }
  //       );
  //     } catch (e) {
  //       if (axios.isCancel()) {
  //         return console.log(e.message);
  //       }
  //       console.log(e);
  //     }
  //   });
  // };

  // componentDidUpdate(prevProps) {
  //   // Case: context switching
  //   if (this.props.context !== prevProps.context) {
  //     return this.setState(
  //       {
  //         currentPage: 0,
  //         isFetching: false,
  //         pages: [],
  //         morePagesAvailable: true
  //       },
  //       () => {
  //         this.loadData();
  //       }
  //     );
  //   }

  //   // Case: search terms change
  //   if (this.props.searchTerms !== prevProps.searchTerms) {
  //     return this.setState(
  //       {
  //         currentPage: 0,
  //         morePagesAvailable: true,
  //         isFetching: false,
  //         pages: [],
  //         albums: [],
  //         profilePages: [],
  //         showNavToTop: false
  //       },
  //       () => {
  //         this.loadData();
  //       }
  //     );
  //   }
  // }

  componentWillUnmount() {
    // Prevent memory leak
    window.removeEventListener("scroll", this.onScroll, false);
    // this.signal.cancel("Async call cancelled.");
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

  // loadData = () => {
  //   if (this.state.isFetching || !this.state.morePagesAvailable) {
  //     return;
  //   }

  //   this.setState({ isFetching: true }, async () => {
  //     try {
  //       const { data } = await this.doAsync();
  //       this.updateState(data);
  //     } catch (e) {
  //       if (axios.isCancel(e)) {
  //         return console.log(e.message);
  //       }
  //       console.log(e);
  //       this.setState({ isFetching: false }, () => {});
  //     }
  //   });
  // };

  // doAsync = async () => {
  //   try {
  //     const { context, user, userId, albumId, searchTerms } = this.props;
  //     const { currentPage: page } = this.state;
  //     const { token: cancelToken } = this.signal;

  //     return await async.fetchScrollViewData(
  //       cancelToken,
  //       context,
  //       user,
  //       userId,
  //       albumId,
  //       searchTerms,
  //       page
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  // updateState = data => {
  //   const { context } = this.props;
  //   const gridContext = this.setGridContext(context);
  //   if (!data.length) {
  //     return this.setState(
  //       { morePagesAvailable: false, isFetching: false },
  //       () => {}
  //     );
  //   }
  //   return this.setState(
  //     {
  //       currentPage: this.state.currentPage + 1,
  //       pages: [...this.state.pages, data],
  //       gridContext,
  //       isFetching: false
  //     },
  //     () => {
  //       this.props.setPosts(data);
  //     }
  //   );
  // };

  goTop = () => {
    window.scrollTo(0, 0);
  };

  renderGridTiles = data => {
    const { context } = this.state;
    let tiles;
    let gridContext = this.setGridContext(context);
    console.log("GRIDCONTEXT", gridContext);
    switch (gridContext) {
      case "albums":
        tiles = data.map(album => <Album key={album._id} album={album} />);
        break;
      case "posts":
        tiles = data.map(post => (
          <PostCard post={post} key={post._id} cardContext="post" />
        ));
        break;
      // case "albumPosts":
      //   tiles = data.map(post => (
      //     <PostCard post={post} key={post._id} cardContext="album" />
      //   ));
      //   break;
      case "profiles":
        tiles = data.map(profile => (
          <ProfileHeader
            key={profile._id}
            profilePhoto={profile.profilePhoto}
            displayName={profile.displayName}
            joined={profile.joined}
          />
        ));
        break;
      default:
        tiles = [];
    }
    return tiles;
  };

  const;

  render() {
    const { classes } = this.props;
    const { isFetching, context, pages } = this.props;
    console.log("ScrollView Rendered", this.props);
    // console.log("pages:", pages);
    // debugger;
    return (
      <div className={classes.root}>
        {this.state.showNavToTop && (
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
        )}

        {this.state.pages.length > 0 && (
          <div className={classes.root}>
            {this.state.pages.map(page => (
              <GridList className={classes.gridList} cols={3}>
                {this.renderGridTiles(page).map((tile, i) => {
                  return (
                    <GridListTile
                      key={i}
                      cols={1}
                      classes={{
                        root: classes.gridTileRoot,
                        tile: classes.tile
                      }}
                    >
                      {tile}
                    </GridListTile>
                  );
                })}
              </GridList>
            ))}
          </div>
        )}

        {isFetching && (
          <CircularProgress className={classes.circularProgress} size={50} />
        )}
      </div>
    );
  }
}

// const mapStateToProps = ({ data, albums, posts }) => ({
//   data,
//   albums,
//   posts
// });

// user, userId, albumId
ScrollView.propTypes = {
  gridContext: PropTypes.string.isRequired,
  pages: PropTypes.array,
  isFetching: PropTypes.bool.isRequired
};

export default compose(
  withStyles(styles)
  // connect(
  //   mapStateToProps,
  //   { setPosts }
  // )
)(ScrollView);
