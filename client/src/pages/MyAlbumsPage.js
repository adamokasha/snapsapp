import React from "react";
import Typography from "@material-ui/core/Typography";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import ScrollView from "../components/ScrollView";
import ModalView from "../components/ModalView";
import AlbumMaker from "../components/AlbumMaker";
import axios from "axios";

const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: "10%",
    right: "5%"
  }
});

export class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: []
    };
  }

  // async componentDidMount() {
  //   const albums = await axios.get("/api/albums/myalbums");
  //   this.setState({ albums: [...albums.data] });
  // }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ScrollView
          context="userAlbums"
          user={this.props.location.state.user}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AlbumsPage);
