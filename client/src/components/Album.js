import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Bar from "@material-ui/core/GridListTileBar";

import ModalView from "./ModalView";
import AlbumMaker from "./AlbumMaker";

const styles = theme => ({
  root: {
    height: "200px",
    width: "200px",
    position: "relative"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
    visibility: "hidden",
    opacity: "0",
    transition: "visibility 0s, opacity .3s ease"
  }
});

class Album extends React.Component {
  toggleEditIcon = e => {
    const actionIcon = e.currentTarget.querySelectorAll(
      'button[class*="MuiIconButton"]'
    )[0];

    if (actionIcon && e.type === "mouseenter") {
      actionIcon.style.visibility = "visible";
      actionIcon.style.opacity = "1";
      return;
    }
    if (actionIcon && e.type === "mouseleave") {
      actionIcon.style.visibility = "hidden";
      actionIcon.style.opacity = "0";
      return;
    }
  };

  render() {
    const { classes, album, key } = this.props;

    return (
      <div
        onMouseLeave={this.toggleEditIcon}
        onMouseEnter={this.toggleEditIcon}
        className={classes.root}
      >
        <Link
          to={{
            pathname: `/albums/${album._owner.displayName}/${album._id}`,
            state: { albumId: album._id }
          }}
        >
          <img
            src={`https://d14ed1d2q7cc9f.cloudfront.net/200x200/smart/${
              album.coverImg
            }`}
            className={classes.image}
            alt={album.name}
          />
        </Link>
        <Bar
          title={album.name}
          actionIcon={
            <ModalView
              togglerComponent={
                <IconButton
                  albumid={album._id}
                  classes={{ root: classes.icon }}
                >
                  <ion-icon name="settings" />
                </IconButton>
              }
              modalComponent={
                <AlbumMaker
                  albumId={album._id}
                  albumName={album.name}
                  withSnackbar={true}
                  method="patch"
                />
              }
            />
          }
        />
      </div>
    );
  }
}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
  album: PropTypes.object.isRequired
};

export default withStyles(styles)(Album);
