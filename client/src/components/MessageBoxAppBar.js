import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const styles = theme => ({
  root: {
    width: '40%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  appBarRoot: {
    boxShadow: 'none'
  },
  toolbarRoot: {
    minHeight: '48px'
  },
  menu: {
    marginLeft: 'auto'
  }
});

class MessageBoxAppBar extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onSetUnread = () => {
    this.handleClose();
    this.props.setList('unread');
  };

  onSetAll = () => {
    this.handleClose();
    this.props.setList('all');
  };

  onSetSent = () => {
    this.handleClose();
    this.props.setList('sent');
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <AppBar
        classes={{ root: classes.appBarRoot }}
        position="static"
        color="primary"
      >
        <Toolbar classes={{ root: classes.toolbarRoot }}>
          <Typography variant="title" color="inherit">
            Message Box
          </Typography>
          {this.props.view === 'list' ? null : (
            <IconButton
              onClick={() => {
                this.props.goBack(this.props.listType);
              }}
              className={classes.menu}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          )}
          <div className={this.props.view === 'list' ? classes.menu : null}>
            <IconButton
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <ArrowDropDownCircleOutlinedIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.onSetUnread}>Unread</MenuItem>
              <MenuItem onClick={this.onSetAll}>All</MenuItem>
              <MenuItem onClick={this.onSetSent}>Sent</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(MessageBoxAppBar);
