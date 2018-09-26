import React from 'react';
import Typography from '@material-ui/core/Typography';

import AlbumList from '../components/AlbumList';

export const AlbumsPage = () => {
  return (
    <div>
    <Typography align="center" variant="display2">Albums</Typography>
    <AlbumList />
    </div>
  )
}

export default AlbumsPage;