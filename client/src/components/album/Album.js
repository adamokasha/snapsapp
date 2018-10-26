import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Bar from "@material-ui/core/GridListTileBar";

import SettingsIcon from "../icons/Settings";
import ModalView from "../modal/ModalView";
import AlbumMaker from "./AlbumMaker";

class Album extends React.Component {
  state = {
    albumName: this.props.album.name
  };
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

  onAlbumNameSet = albumName => {
    this.setState({ albumName }, () => {});
  };

  render() {
    const { classes, album } = this.props;

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
            alt={this.state.albumName}
          />
        </Link>
        <Bar
          title={this.state.albumName}
          actionIcon={
            <ModalView
              togglerComponent={
                <IconButton
                  albumid={album._id}
                  classes={{ root: classes.icon }}
                >
                  <SettingsIcon classes={{ root: classes.settingsIcon }} />
                </IconButton>
              }
              modalComponent={
                <AlbumMaker
                  albumId={album._id}
                  albumName={album.name}
                  withSnackbar={true}
                  method="patch"
                  onAlbumNameSet={this.onAlbumNameSet}
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
  },
  settingsIcon: {
    height: "24px",
    width: "24px"
  }
});

export default withStyles(styles)(Album);
