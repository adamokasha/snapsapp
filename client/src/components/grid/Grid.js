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

function Grid(props) {
  const { classes, gridContext, gridData, isFetching, showNavToTop } = props;

  const renderGridTiles = data => {
    let tiles;
    switch (gridContext) {
      case "albums":
        tiles = data.map(album => <Album key={album._id} album={album} />);
        break;
      case "posts":
        tiles = data.map(post => (
          <PostCard
            slideData={gridData}
            post={post}
            key={post._id}
            cardContext="post"
          />
        ));
        break;
      case "albumPosts":
        tiles = data.map(post => (
          <PostCard post={post} key={post._id} cardContext="album" />
        ));
        break;
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
      {gridData &&
        gridData.map((page, i) => (
          <GridList key={i} className={classes.gridList} cols={3}>
            {renderGridTiles(page).map((tile, i) => {
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

      {isFetching && (
        <CircularProgress className={classes.circularProgress} size={50} />
      )}
    </div>
  );
}

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
  gridData: PropTypes.array.isRequired
};

export default withStyles(styles)(Grid);
