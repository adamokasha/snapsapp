import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import NavBar from '../components/NavBar';
import AlbumImageCard from '../components/AlbumImageCard';

export class SingleAlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }
  async componentDidMount() {
    const albumId = this.props.location.state.albumId;
    const res = await axios.get(`/api/albums/full/${albumId}`);
    this.setState({posts: res.data})
  }

  render() {
    return (
      <React.Fragment>
      <NavBar />
      <div>
        {this.state.posts.map(post => <AlbumImageCard post={post} />) }
      </div>
      </React.Fragment>
    )
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
}

export default SingleAlbumPage;