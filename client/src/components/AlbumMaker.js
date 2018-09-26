import React from 'react';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import AlbumMakerImageView from './AlbumMakerImageView';
import {fetchUserPosts} from '../actions/posts';
import {createAlbum} from '../actions/albums';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '80%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingBottom: `${theme.spacing.unit}px`,
    borderRadius: '3px'
  },
  imgContainer: {
    position: 'relative'
  },
  dummyImg: {
    height: '200px',
    width: 'auto',
    marginLeft: '8px'
  },
  checkIconContainer: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    backgroundColor: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '5px',
    opacity: '0.8'
  },
  hiddenIconContainer: {
    display: 'none'
  },
  checkIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  imgSelected: {
    height: '200px',
    width: 'auto',
    marginLeft: '8px',
    border: '2px solid #000'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
});


class AlbumMaker extends React.Component {
  state = {
    value: 1,
    currentAlbumPosts: this.props.currentAlbumPhotos || [],
    posts: [],
    selected: [],
    albumName: ''
  };

  async componentDidMount() {
    // fetch all posts
    const res = await this.props.fetchUserPosts();
    this.setState({posts: [...res]})

    // retrieve current album from db
    // set album as state.currentAlbumPosts and state.selected
    // do sync
    // const currentAlbumPhotoIds = currentAlbumPhotos.map(img => img.id);
    // this.setState({ selected: [...currentAlbumPhotoIds] }, () => {
    //   return;
    // });
  }

  filterAlbumPhotos = () => {
    if(this.state.currentAlbumPosts.length > 0) {
      const currentAlbumPhotoIds = this.state.currentAlbumPosts.map(img => img._id);
      return this.state.posts.filter(
        img => !currentAlbumPhotoIds.includes(img._id)
      );
    }

    return this.state.currentAlbumPosts;
  };

  onTabChange = (event, value) => {
    this.setState({ value });
  };

  onImageSelect = imgId => {
    if (this.state.selected.includes(imgId)) {
      const filtered = this.state.selected.filter(img => img !== imgId);
      return this.setState({ selected: filtered });
    }
    this.setState({ selected: [...this.state.selected, imgId] });
  };

  onAlbumNameChange = (e) => {
    this.setState({albumName: e.target.value})
  }

  onSaveAlbum = async (e) => {
    e.preventDefault();
    await this.props.createAlbum(this.state.selected, this.state.albumName)
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.onTabChange} centered>
            <Tab label="All Photos" />
            <Tab label="Non-Album Photos" />
            <Tab label="This Album's Photos" href="#basic-tabs" />
          </Tabs>
        </AppBar>
          {this.state.value === 0 ? (
            <AlbumMakerImageView
              selected={this.state.selected}
              onImageSelect={this.onImageSelect}
              imgData={this.state.posts}
            />
          ) : null}
          {this.state.value === 1 ? (
            <AlbumMakerImageView
              selected={this.state.selected}
              onImageSelect={this.onImageSelect}
              imgData={this.filterAlbumPhotos()}
            />
          ) : null}
          {this.state.value === 2 ? (
            <AlbumMakerImageView
              selected={this.state.selected}
              onImageSelect={this.onImageSelect}
              imgData={this.state.currentAlbumPosts}
            />
          ) : null}
        
        <div className={classes.formContainer}>
        <form onSubmit={this.onSaveAlbum}>
          <TextField
            id="outlined-name-input"
            label="Album Name"
            className={classes.textField}
            type="text"
            name="name"
            margin="normal"
            variant="filled"
            onChange={this.onAlbumNameChange}
            value={this.state.albumName}
          />
          <Button variant="contained" type="submit" className={classes.button}>
            <SaveIcon
              className={classes.leftIcon}
            />
            Save
          </Button>
        </form>
        </div>
      </div>
    );
  }
}

AlbumMaker.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(null, {fetchUserPosts, createAlbum})
)(AlbumMaker)
