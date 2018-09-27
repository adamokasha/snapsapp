import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PhotoAlbumTwoToneIcon from '@material-ui/icons/PhotoAlbumTwoTone';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';

import Modal from './Modal';
import AlbumMaker from './AlbumMaker';

const styles = theme => ({
  paper: {
    width: '50%',
    margin: `${theme.spacing.unit * 3}px auto`,
    minHeight: '500px',
  },
  gridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    margin: `${theme.spacing.unit}px auto`,
    backgroundColor: theme.palette.secondary.main
  },
  gridList: {
    width: '50%',
    justifyContent: 'center'
  },
  listTile: {
    height: '200px !important',
    width: '200px !important'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    visibility: 'hidden',
    opacity: '0',
    transition: 'visibility 0s, opacity .3s ease'
  }
});

class AlbumList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: []
    };
  }

  async componentDidMount() {
    const albums = await axios.get('/api/albums/myalbums');
    this.setState({ albums: [...albums.data] });
  }

  toggleEditIcon = e => {
    const actionIcon = e.currentTarget.querySelectorAll(
      'button[class*="MuiIconButton"]'
    )[0];
    // if mouse over titleBar
    // e.target.parentNode.parentNode.parentNode.querySelectorAll('button[class*="MuiIconButton"]')[0];

    if (actionIcon && e.type === 'mouseenter') {
      actionIcon.style.visibility = 'visible';
      actionIcon.style.opacity = '1';
      return;
    }
    if (actionIcon && e.type === 'mouseleave') {
      actionIcon.style.visibility = 'hidden';
      actionIcon.style.opacity = '0';
      return;
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PhotoAlbumTwoToneIcon />
        </Avatar>
        <Typography align="center" variant="headline">
          Albums
        </Typography>
        <div className={classes.gridListRoot}>
        <GridList cellHeight="auto" cols={8} className={classes.gridList}>
          {this.state.albums.map((album, i) => (
            <GridListTile
              onMouseLeave={this.toggleEditIcon}
              onMouseEnter={this.toggleEditIcon}
              albumid={`img-album-${i}`}
              className={classes.listTile}
              key={album._id}
            >
            <Link to={{pathname:`/albums/${album._owner.displayNameLowerC}/${album.name.replace(/\s/g,'')}`, state:{albumId: album._id}}}>
              <img
                src={`https://d14ed1d2q7cc9f.cloudfront.net/200x200/smart/${
                  album.coverImg
                }`}
                className={classes.image}
                alt={album.name}
              />
              </Link>
              <GridListTileBar
                title={album.name}
                actionIcon={
                  <Modal
                    togglerComponent={
                      <IconButton
                        albumid={album._id}
                        classes={{ root: classes.icon }}
                      >
                        <ion-icon name="settings" />
                      </IconButton>
                    }
                    modalComponent={
                      <AlbumMaker
                        albumId={album._id}
                        albumName={album.name}
                        method="patch"
                      />
                    }
                  />
                }
              />
            </GridListTile>
          ))}
        </GridList>
        </div>
      </Paper>
    );
  }
}

AlbumList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AlbumList);
