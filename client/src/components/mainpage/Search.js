import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import GroupIcon from "@material-ui/icons/Group";

const styles = theme => ({
  root: {
    backgroundColor: `${theme.palette.background.paper}`,
    display: "flex",
    justifyContent: "center"
  },
  input: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  popper: {
    zIndex: "1000",
    left: "-67px !important"
  },
  paper: {
    width: "262px",
    background: "#fafafa"
  },
  searchIcons: {
    paddingRight: `${theme.spacing.unit}px`
  }
});

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerms: "",
      popperOpen: false
    };
  }

  popperOpen = e => {
    if (!e.target.value) {
      return this.setState({ popperOpen: false });
    }
    this.setState({ popperOpen: true });
  };

  popperClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ popperOpen: false });
  };

  onSearchChange = e => {
    this.setState({ searchTerms: e.target.value }, () => {});
  };

  scrubSearchTerms(searchTerms) {
    return searchTerms
      .replace(/[^\w\s]/gi, "")
      .trim()
      .replace(/\s\s+/g, " ")
      .toLowerCase()
      .split(" ");
  }

  onSearchPosts = async e => {
    const searchTermsArr = this.scrubSearchTerms(this.state.searchTerms);
    this.setState({ popperOpen: false, searchTerms: "" }, () => {});
    // this.props.setSearch('searchPosts', searchTermsArr);
    this.props.onSwitchContext("searchPosts", searchTermsArr);
  };

  onSearchPeople = e => {
    const searchTermsArr = this.scrubSearchTerms(this.state.searchTerms);
    this.setState({ popperOpen: false, searchTerms: "" }, () => {});
    // this.props.setSearch('searchUsers', searchTermsArr);
    this.props.onSwitchContext("searchUsers", searchTermsArr);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <OutlinedInput
          inputRef={node => {
            this.anchorEl = node;
          }}
          className={classes.input}
          placeholder="#tags, posts, user..."
          aria-owns={this.state.popperOpen ? "menu-list-grow" : null}
          aria-haspopup="true"
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon className={classes.searchIcon} />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={-25}
          label="Search"
          onKeyUp={this.popperOpen}
          onFocus={this.popperOpen}
          onBlur={this.popperClose}
          onChange={this.onSearchChange}
          value={this.state.searchTerms}
        />
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
              style={{ transformOrigin: "center top" }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={this.popperClose}>
                  <MenuList className={classes.menuList}>
                    <MenuItem onClick={this.onSearchPosts}>
                      <ImageSearchIcon className={classes.searchIcons} />
                      Search posts
                    </MenuItem>
                    <MenuItem onClick={this.onSearchPeople}>
                      <GroupIcon className={classes.searchIcons} />
                      Search people
                    </MenuItem>
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

export default compose(
  withStyles(styles),
  connect(null)
)(Search);
