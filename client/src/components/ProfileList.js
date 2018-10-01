import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import ProfileHeader from './ProfileHeader';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '100%',
    overflowY: 'unset'
  },
  gridTileRoot: {
    height: 'auto !important',
    width: '100% !important',
    [theme.breakpoints.up('sm')]: {
      width: '45% !important',
      margin: '0 auto'
    },
    [theme.breakpoints.up('lg')]: {
      width: '30% !important',
      margin: '0 auto'
    }
  },
  // Inner div that wraps children
  tile: {
    overflow: 'initial'
  },
  subheader: {
    width: '100%'
  }
});


function ProfileList(props) {
  const { classes, profiles } = props;

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {profiles.map(data => {
          return (
            <GridListTile
              key={data._id} 
              cols={1}
              classes={{
                root: classes.gridTileRoot,
                tile: classes.tile
              }}
            >
              <ProfileHeader
                context="search"
                profilePhoto={data.profilePhoto}
                displayName={data.displayName}
                joined={data.joined}
              />
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
}

ProfileList.propTypes = {
  classes: PropTypes.object.isRequired,
  profiles: PropTypes.array.isRequired
};

export default withStyles(styles)(ProfileList);
