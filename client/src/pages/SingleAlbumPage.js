import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import axios from "axios";

import Grid from "../components/Grid";
import { fetchAlbumPostsPaginated } from "../async/albums";

export class SingleAlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialFetch: true,
      posts: null
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    const { albumid } = this.props.match.params;
    try {
      const { data: albumPosts } = await fetchAlbumPostsPaginated(
        this.signal.token,
        albumid,
        0
      );
      this.setState({ initialFetch: false, posts: [albumPosts] });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e);
      }
      console.log(e);
    }
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.initialFetch &&
          this.state.posts && (
            <Grid gridContext="albumPosts" gridData={this.state.posts} />
          )}
        {this.state.initialFetch && <div>Loading</div>}
      </React.Fragment>
    );
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
};

export default withRouter(SingleAlbumPage);
