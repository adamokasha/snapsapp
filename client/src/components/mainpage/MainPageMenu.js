import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FiberNew from "@material-ui/icons/FiberNew";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";
import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";

export class MainPageMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      context: "popular",
      popperOpen: false
    };
  }

  togglePopper = e => {
    console.log("toggle");
    this.setState({ popperOpen: !this.state.popperOpen }, () => {});
  };

  popperOpen = e => {
    this.setState({ popperOpen: true });
  };

  popperClose = event => {
    this.setState({ popperOpen: false });
  };

  onFollowing = () => {
    this.setState({ context: "following" });
    this.props.onSwitchContext("following");
  };

  onNew = () => {
    this.setState({ context: "new" });
    this.props.onSwitchContext("new");
  };

  onPopular = () => {
    this.setState({ context: "popular" });
    this.props.onSwitchContext("popular");
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <ClickAwayListener onClickAway={this.popperClose}>
            <IconButton
              buttonRef={node => {
                this.anchorEl = node;
              }}
              aria-owns={this.state.popperOpen ? "menu-list-grow" : null}
              aria-haspopup="true"
              variant="contained"
              size="small"
              className={classes.button}
              onClick={this.togglePopper}
            >
              <MoreVertIcon />
            </IconButton>
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
                style={{ transformOrigin: "center top" }}
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

const styles = theme => ({
  root: {},
  button: {
    marginLeft: "2%",
    textTransform: "capitalize"
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  },
  popper: {
    zIndex: 2000
  }
});

export default withStyles(styles)(MainPageMenu);
