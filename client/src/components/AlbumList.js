import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '50%',
    justifyContent: 'center'
  },
  listTile:{
    height: '200px !important',
    width: '200px !important',
  },
  image: {
    pointerEvents: 'none',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    visibility: 'hidden',
    opacity: '0',
    transition: 'visibility 0s, opacity .3s ease'
  },
});

const tileData = [
  {
    id: '1',
    img:
      'https://imgur.com/4DEqqiw.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '2',
    img:
      'https://imgur.com/KAXz5AG.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '3',
    img:
      'https://imgur.com/fzik2O4.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '4',
    img:
      'https://imgur.com/cMiFx4g.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '5',
    img:
      'https://imgur.com/BAWzwTh.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '6',
    img:
      'https://imgur.com/yX3oVzF.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '7',
    img:
      'https://imgur.com/mAI9ReC.jpeg',
    title: 'Test',
    author: 'kasho'
  },
  {
    id: '8',
    img:
      'https://imgur.com/GODoQZn.jpeg',
    title: 'Test',
    author: 'kasho'
  }
];

// MuiGridListTileBar-title-049
// MuiGridListTileBar-root-042 MuiGridListTileBar-titlePositionBottom-043


function AlbumList(props) {
  const { classes } = props;

  function toggleEditIcon(e) {
    const actionIcon = e.target.querySelectorAll('button[class*="MuiIconButton"]')[0] ||
    // if mouse over titleBar
    e.target.parentNode.parentNode.parentNode.querySelectorAll('button[class*="MuiIconButton"]')[0];

    if(actionIcon && e.type === 'mouseenter') {
      actionIcon.style.visibility = 'visible';
      actionIcon.style.opacity = '1';
      return;
    }
    if(actionIcon && e.type === 'mouseleave') {
      actionIcon.style.visibility = 'hidden';
      actionIcon.style.opacity = '0';
      return;
    }
  }

  return (
    <div className={classes.root}>
      <GridList cellHeight="auto" cols={4} className={classes.gridList}>
        <GridListTile onMouseOverCapture={(e) => {e.preventPropagation; console.log(e.target.tagName)}} key="Subheader" cols={4}>
          <ListSubheader component="div">Albums</ListSubheader>
        </GridListTile>
        {tileData.map((tile, i) => (
          <GridListTile onMouseLeave={toggleEditIcon} onMouseEnter={toggleEditIcon} tileid={`img-tile-${i}`} className={classes.listTile} key={tile.img}>
            <img src={tile.img}  className={classes.image} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              actionIcon={
                <IconButton classes={{root: classes.icon}}>
                <ion-icon name="settings"></ion-icon>
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

AlbumList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlbumList);
