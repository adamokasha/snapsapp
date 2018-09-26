import React from 'react';
import Typography from '@material-ui/core/Typography';

import AlbumList from '../components/AlbumList';
import NavBar from '../components/NavBar';

export const AlbumsPage = () => {
  return (
    <div>
    <NavBar/>
    <Typography align="center" variant="display2">Albums</Typography>
    <AlbumList />
    </div>
  )
}

export default AlbumsPage;