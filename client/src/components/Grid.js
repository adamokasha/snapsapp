import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Album from "./Album";
import PostCard from "./PostCard";
import ProfileHeader from "./ProfileHeader";

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
  }
});

function Grid(props) {
  const { classes, posts, gridContext, gridData } = props;

  const renderGridTiles = data => {
    let tiles;
    switch (gridContext) {
      case "albums":
        tiles = data.map(album => <Album key={album._id} album={album} />);
        break;
      case "posts":
        tiles = data.map(post => (
          <PostCard post={post} key={post._id} cardContext="post" />
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

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {renderGridTiles(gridData).map((tile, i) => {
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
    </div>
  );
}

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
  gridData: PropTypes.array.isRequired
};

export default withStyles(styles)(Grid);
