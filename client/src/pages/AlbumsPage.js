import React from 'react';
import Typography from '@material-ui/core/Typography';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import AlbumList from '../components/AlbumList';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import AlbumMaker from '../components/AlbumMaker';

//     <FabModal modalComponent={<AlbumMaker/>} buttonIcon={<AddPhotoAlternate />} />

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: '10%',
    right: '5%'
  }
});

export const AlbumsPage = props => {
  const { classes } = props;

  return (
    <div>
      <Typography
      variant="display3"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      Albums
    </Typography>
      <Modal
        togglerComponent={
          <Button
            onClick={this.handleOpen}
            variant="fab"
            color="secondary"
            aria-label="Add"
            className={classes.fab}
          >
            <AddPhotoAlternate />
          </Button>
        }
        modalComponent={<AlbumMaker method="post" />}
      />
      <AlbumList />
    </div>
  );
};

export default withStyles(styles)(AlbumsPage);
