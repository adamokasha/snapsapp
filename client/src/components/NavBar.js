import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  leftIcon: {
    fontSize: '18px',
    marginRight: theme.spacing.unit / 2
  },
  aTag: {
    color: 'inherit',
    textDecoration: 'none'
  }
});

class NavBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderNavButtons() {
    const { auth, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return auth ? (
      <div>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem to="upload" component={Link} onClick={this.handleClose}>
            Add Image
          </MenuItem>
          <MenuItem onClick={this.handleClose}>My Profile</MenuItem>
          <MenuItem onClick={this.handleClose}>
            <a href="/auth/logout" className={classes.aTag}>
              Log Out
            </a>
          </MenuItem>
        </Menu>
      </div>
    ) : (
      <div>
        <Button to="/login" component={Link} variant="text" color="inherit">
          &nbsp;Sign In
        </Button>
        <Button
          to="/register"
          component={Link}
          variant="contained"
          color="secondary"
        >
          &nbsp;Sign Up
        </Button>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.grow}
            >
              <Link to="/" className={classes.aTag}>
                <ion-icon size="large" name="aperture" />
              </Link>
            </Typography>
            {this.renderNavButtons()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(NavBar);