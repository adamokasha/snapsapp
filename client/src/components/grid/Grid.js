import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import CircularProgress from "@material-ui/core/CircularProgress";

import Album from "../album/Album";
import PostCard from "../post/PostCard";
import ProfileHeader from "../profile/ProfileHeader";

function Grid(props) {
  const { classes, gridContext, gridData, isFetching, showNavToTop } = props;

  const renderGridTiles = data => {
    let tiles;
    switch (gridContext) {
      case "albums":
        tiles = data.map(album => (
          <GridListTile
            key={album._id}
            cols={1}
            classes={{
              root: classes.gridTileRoot,
              tile: classes.tile
            }}
          >
            <Album album={album} />
          </GridListTile>
        ));
        break;
      case "posts":
        tiles = data.map(post => (
          <GridListTile
            key={post._id}
            cols={1}
            classes={{
              root: classes.gridTileRoot,
              tile: classes.tile
            }}
          >
            <PostCard slideData={gridData} post={post} cardContext="post" />
          </GridListTile>
        ));
        break;
      case "albumPosts":
        tiles = data.map(post => (
          <GridListTile
            key={post._id}
            cols={1}
            classes={{
              root: classes.gridTileRoot,
              tile: classes.tile
            }}
          >
            <PostCard post={post} cardContext="album" />
          </GridListTile>
        ));
        break;
      case "profiles":
        tiles = data.map(profile => (
          <GridListTile
            key={profile._id}
            cols={1}
            classes={{
              root: classes.gridTileRoot,
              tile: classes.tile
            }}
          >
            <ProfileHeader
              profilePhoto={profile.profilePhoto}
              displayName={profile.displayName}
              joined={profile.joined}
            />
          </GridListTile>
        ));
        break;
      default:
        tiles = [];
    }
    return tiles;
  };

  const goTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={classes.root}>
      {showNavToTop && (
        <Button
          id="goTopButton"
          variant="extendedFab"
          aria-label="go-top"
          className={classes.toTopButton}
          onClick={goTop}
        >
          <NavigationIcon className={classes.navIcon} />
          Go to Top
        </Button>
      )}
      {gridData && (
        <GridList className={classes.gridList} cols={3}>
          {renderGridTiles(gridData)}
        </GridList>
      )}

      {isFetching && (
        <CircularProgress className={classes.circularProgress} size={50} />
      )}
    </div>
  );
}

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
  gridData: PropTypes.array.isRequired,
  gridContext: PropTypes.oneOf(["albums", "posts", "albumPosts", "profiles"])
};

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

export default withStyles(styles)(Grid);
