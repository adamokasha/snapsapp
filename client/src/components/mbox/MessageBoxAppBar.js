import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

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
    this.props.switchListType("unread");
  };

  onSetAll = () => {
    this.handleClose();
    this.props.switchListType("all");
  };

  onSetSent = () => {
    this.handleClose();
    this.props.switchListType("sent");
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, view, listType } = this.props;

    return (
      <AppBar
        classes={{ root: classes.appBarRoot }}
        position="static"
        color="primary"
      >
        <Toolbar classes={{ root: classes.toolbarRoot }}>
          <Typography variant="h6" color="inherit">
            Message Box
          </Typography>
          {view === "list" ? null : (
            <IconButton
              onClick={() => {
                this.props.goBack(this.props.listType);
              }}
              className={classes.menu}
            >
              <KeyboardBackspaceIcon className={classes.iconColor} />
            </IconButton>
          )}
          <div className={view === "list" ? classes.menu : null}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              classes={{ root: classes.dropDownButton }}
              aria-owns={anchorEl ? "simple-menu" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              {listType}
              <ArrowDropDownRoundedIcon className={classes.iconColor} />
            </Button>
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

MessageBoxAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  switchListType: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  listType: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

const styles = theme => ({
  root: {
    width: "40%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column"
  },
  appBarRoot: {
    boxShadow: "none"
  },
  toolbarRoot: {
    minHeight: "48px"
  },
  menu: {
    marginLeft: "auto"
  },
  dropDownButton: {
    minWidth: "88px"
  },
  iconColor: {
    color: "#fff"
  }
});

export default withStyles(styles)(MessageBoxAppBar);
