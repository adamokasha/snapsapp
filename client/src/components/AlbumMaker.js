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
import axios from 'axios';

import AlbumMakerImageView from './AlbumMakerImageView';
import {fetchUserPosts} from '../actions/posts';

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
  // selected should always be only a list of post _id's
  // posts and album posts are objs with _id and imgUrl keys
  state = {
    value: 1,
    currentAlbumPosts: [],
    posts: [],
    selected: [],
    albumName: this.props.albumName || ''
  };

  async componentDidMount() {
    try {
    // fetch all posts
    const res = await this.props.fetchUserPosts();
    this.setState({posts: [...res]})

    // retrieve current album from db
    // set album as state.currentAlbumPosts and state.selected
    // do sync
    if(this.props.albumId) {
 
      const res = await axios.get(`/api/albums/get/${this.props.albumId}`);
      console.log(res);
      const currentAlbumPostIds = res.data.map(imgData => imgData._id);
      await this.setState({selected: [...currentAlbumPostIds]}, () => {});
      await this.setState({currentAlbumPosts: [...res.data]},  () => {});
    }
      
    } catch(e) { console.log(e)}
    
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
    // Already in selected, so filter out;
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
    if(this.props.method === "patch") {
      return await axios.patch(`/api/albums/update/${this.props.albumId}`, {albumPosts:this.state.selected, albumName: this.state.albumName});
    }
    const {selected, albumName } = this.state;
    await axios.post('/api/albums', {albumPosts: selected, albumName});
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
  classes: PropTypes.object.isRequired,
  method: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles),
  connect(null, {fetchUserPosts})
)(AlbumMaker)
