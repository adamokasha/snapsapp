import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AlbumMakerImageView from './AlbumMakerImageView';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  imgView: {
    maxWidth: '100%',
    minHeight: '100%',
    margin: `${theme.spacing.unit * 2}px`,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  }
});

const dummyData = [
  {
    id: '1',
    imgUrl:
      'https://imgur.com/4DEqqiw.jpeg'
  },
  {
    id: '2',
    imgUrl:
      'https://imgur.com/KAXz5AG.jpeg'
  },
  {
    id: '3',
    imgUrl:
      'https://imgur.com/fzik2O4.jpeg'
  },
  {
    id: '4',
    imgUrl:
      'https://imgur.com/cMiFx4g.jpeg'
  },
  {
    id: '5',
    imgUrl:
      'https://imgur.com/BAWzwTh.jpeg'
  },
  {
    id: '6',
    imgUrl:
      'https://imgur.com/yX3oVzF.jpeg'
  },
  {
    id: '7',
    imgUrl:
      'https://imgur.com/mAI9ReC.jpeg'
  },
  {
    id: '8',
    imgUrl:
      'https://imgur.com/GODoQZn.jpeg'
  }
];

const currentAlbumPhotos = [dummyData[1], dummyData[4], dummyData[5]];

class AlbumMaker extends React.Component {
  state = {
    value: 1,
    currentAlbumPosts: currentAlbumPhotos,
    posts: dummyData,
    selected: []
  };

  componentDidMount() {
    // retrieve current album from db
      // set album as state.currentAlbumPosts and state.selected
      // do sync
      const currentAlbumPhotoIds = currentAlbumPhotos.map(img => img.id)
      this.setState({selected: [...currentAlbumPhotoIds]}, () => {
        return;
      });
  }

  filterAlbumPhotos = () => {
    const currentAlbumPhotoIds = currentAlbumPhotos.map(img => img.id)
    return this.state.posts.filter(img => !currentAlbumPhotoIds.includes(img.id))
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  onImageSelect = (imgId) => {
    if (this.state.selected.includes(imgId)) {
      const filtered = this.state.selected.filter(img => img !== imgId);
      return this.setState({ selected: filtered });
    }
    this.setState({ selected: [...this.state.selected, imgId] });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} centered>
            <Tab label="All Photos" />
            <Tab label="Non-Album Photos" />
            <Tab label="This Album's Photos" href="#basic-tabs" />
          </Tabs>
        </AppBar>
        <div className={classes.imgView}>
          {this.state.value === 0 ? (
            <AlbumMakerImageView selected={this.state.selected} onImageSelect={this.onImageSelect} imgData={this.state.posts}/>
          ) : null }
          {this.state.value === 1 ? (
            <AlbumMakerImageView selected={this.state.selected} onImageSelect={this.onImageSelect} imgData={
              
              this.filterAlbumPhotos()

            }/>
          ) : null }
          {this.state.value === 2 ? (
            <AlbumMakerImageView selected={this.state.selected} onImageSelect={this.onImageSelect} imgData={this.state.currentAlbumPosts}/>
          ) : null }
        </div>
      </div>
    );
  }
}

AlbumMaker.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AlbumMaker);
