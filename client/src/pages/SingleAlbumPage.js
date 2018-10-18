import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import NavBar from "../components/NavBar";
import ImageGrid from "../components/ImageGrid";
import ScrollView from "../components/ScrollView";

export class SingleAlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albumPosts: []
    };
  }
  // async componentDidMount() {
  //   const albumId = this.props.location.state.albumId;
  //   const res = await axios.get(`/api/albums/full/${albumId}`);
  //   this.setState({ albumPosts: res.data });
  // }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <div>
          <ScrollView
            context="albumPosts"
            albumId={this.props.match.params.albumid}
          />
        </div>
      </React.Fragment>
    );
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
};

export default withRouter(SingleAlbumPage);
