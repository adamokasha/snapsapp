import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames';
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';

import PostCardLoader from './PostCardLoader'

export const MainPageLoader = (props) => {
  const { classes } = props
  return (
    <Grid justify="center" alignItems="center" className={classes.root} container spacing={24}  >
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item  sm={6}  md={6} lg={4}>
        <PostCardLoader className={classNames(classes.gridItem)} />
      </Grid>
      <Grid item sm={6} md={6}  md={6} lg={4}>
        <PostCardLoader className={classNames(classes.gridItem)} />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader className={classNames(classes.gridItem)} />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader className={classNames(classes.gridItem)} />
      </Grid>
    </Grid>
  )
}

const styles = theme => ({
  root: {
    width: '80%',
    margin: '0 auto'
  },

  hideSmall: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  hideMedium: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
})

MainPageLoader.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MainPageLoader);