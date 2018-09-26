import React from 'react';
import Typography from '@material-ui/core/Typography';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';


import AlbumList from '../components/AlbumList';
import NavBar from '../components/NavBar';
import FabModal from '../components/FabModal';
import AlbumMaker from '../components/AlbumMaker';

export const AlbumsPage = () => {
  return (
    <div>
    <NavBar/>
    <Typography align="center" variant="display2">Albums</Typography>
    <AlbumList />
    <FabModal modalComponent={<AlbumMaker/>} buttonIcon={<AddPhotoAlternate />} />
    </div>
  )
}

export default AlbumsPage;