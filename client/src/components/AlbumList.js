import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";

import Album from "./Album";
import { GridListTile } from "@material-ui/core";

const styles = theme => ({
  root: {},
  gridListRoot: {
    width: "100%",
    margin: `${theme.spacing.unit * 3}px auto`,
    minHeight: "500px"
  },
  gridList: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  listTile: {
    height: "200px !important",
    width: "200px !important"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
    visibility: "hidden",
    opacity: "0",
    transition: "visibility 0s, opacity .3s ease"
  }
});

class AlbumList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: []
    };
  }

  async componentDidMount() {
    // const albums = await axios.get('/api/albums/myalbums');
    // this.setState({ albums: [...albums.data] });
  }

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
    const { classes } = this.props;

    return (
      <div className={classes.gridListRoot}>
        <GridList cellHeight="auto" cols={8} className={classes.gridList}>
          {this.props.albums.map((album, i) => (
            <GridListTile>
              <Album album={album} key={i} />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

AlbumList.propTypes = {
  classes: PropTypes.object.isRequired,
  albums: PropTypes.array.isRequired
};

export default withStyles(styles)(AlbumList);
