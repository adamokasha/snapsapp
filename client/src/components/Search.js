import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDownCircleTwoToneIcon from '@material-ui/icons/ArrowDropDownCircle';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import GroupIcon from '@material-ui/icons/Group';


const styles = theme => ({
  root: {
    backgroundColor: `${theme.palette.background.paper}`,
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    margin: `${theme.spacing.unit*2}px 0`
  },
  popper: {
    'zIndex': '1000',
    left: '-67px !important'
  },
  paper: {
    width: '262px',
    background: "#fafafa"
  },
  searchIcons: {
    paddingRight: `${theme.spacing.unit}px`
  }
})

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      open: false
    }
  }

  onSearchChange = (e) => {
    this.setState({searchTerm: e.target.event}, () => {})
  }

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <OutlinedInput
          inputRef={node => {
            this.anchorEl = node
          }}
          className={classes.input}
          placeholder="Search #tag, user..."
          aria-owns={this.state.open ? 'menu-list-grow' : null}
          aria-haspopup="true"
          startAdornment={
            <InputAdornment position="start">
              <IconButton><SearchIcon className={classes.searchIcon} /></IconButton>
            </InputAdornment>
          }
          onFocus={this.handleToggle}
          onBlur={this.handleClose}
        />
        <Popper className={classes.popper} open={this.state.open} anchorEl={this.anchorEl} transition disablePortal placement="bottom-start">
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{ transformOrigin: 'center top' }}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={this.handleClose}>
                <MenuList className={classes.menuList}>
                  <MenuItem onClick={this.handleClose}><ImageSearchIcon className={classes.searchIcons} />Search posts</MenuItem>
                  <MenuItem onClick={this.handleClose}><GroupIcon className={classes.searchIcons} />Search People</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
        </Popper>
      </div>
    );
  }
}

export default withStyles(styles)(Search);