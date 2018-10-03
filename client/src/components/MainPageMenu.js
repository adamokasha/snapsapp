import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FiberNew from '@material-ui/icons/FiberNew';
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined';
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined';

const styles = theme => ({
  root: {
    backgroundColor: '#fff'
  },
  popper: {
    zIndex: 1000
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  }
});

export class MainPageMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      context: 'homepage',
      popperOpen: false
    };
  }

  togglePopper = e => {
    console.log('toggle');
    this.setState({ popperOpen: !this.state.popperOpen }, () => {});
  };

  popperOpen = e => {
    this.setState({ popperOpen: true });
  };

  popperClose = event => {
    this.setState({ popperOpen: false });
  };

  onFollowing = () => {
    this.setState({context: 'following'});
    this.props.setContext('following');
  }

  onNew = () => {
    this.setState({context: 'new'});
    this.props.setContext('new');
  }

  onPopular = () => {
    this.setState({context: 'popular'});
    this.props.setContext('popular');
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <ClickAwayListener onClickAway={this.popperClose}>
            <Button
              buttonRef={node => {
                this.anchorEl = node;
              }}
              aria-owns={this.state.popperOpen ? 'menu-list-grow' : null}
              aria-haspopup="true"
              onClick={this.togglePopper}
            >
              <ArrowDropDownCircleOutlinedIcon />
            </Button>
          </ClickAwayListener>

          <Popper
            className={classes.popper}
            open={this.state.popperOpen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            placement="bottom-start"
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: 'center top' }}
              >
                <Paper className={classes.paper}>
                  <MenuList className={classes.menuList}>
                    <MenuItem onClick={this.onFollowing}>
                      <PeopleOutlinedIcon className={classes.leftIcon} />
                      Following
                    </MenuItem>
                    <MenuItem onClick={this.onNew}>
                      <FiberNew className={classes.leftIcon} />
                      New
                    </MenuItem>
                    <MenuItem onClick={this.onPopular}>
                      <WhatshotOutlinedIcon className={classes.leftIcon} />
                      Popular
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(MainPageMenu);
