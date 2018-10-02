import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import NavBar from '../components/NavBar';
import ImageGrid from '../components/ImageGrid'

export class SingleAlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albumPosts: []
    }
  }
  async componentDidMount() {
    const albumId = this.props.location.state.albumId;
    const res = await axios.get(`/api/albums/full/${albumId}`);
    this.setState({albumPosts: res.data})
  }

  render() {
    return (
      <React.Fragment>
      <NavBar />
      <div>
        <ImageGrid context='album' posts={this.state.albumPosts} />
      </div>
      </React.Fragment>
    )
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
}

export default SingleAlbumPage;