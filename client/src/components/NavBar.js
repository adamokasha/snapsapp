import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import classNames from "classnames";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/Inbox";
import CameraIcon from "@material-ui/icons/Camera";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import axios from "axios";

import ModalView from "./ModalView";
import ImageUploadForm from "./ImageUploadForm";
import { updateMboxNotif } from "../actions/auth";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  logo: {
    display: "flex"
  },
  logoIcon: {
    marginRight: `${theme.spacing.unit}px`
  },
  nav: {
    display: "flex",
    marginLeft: "auto"
  },
  iconButton: {
    color: "#fff !important"
  },
  aTag: {
    padding: 0,
    color: "inherit",
    textDecoration: "none"
  }
});

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      mBoxUnreadCount: null
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get("/api/message/count");
      this.props.updateMboxNotif(res.data.size);
      this.setState({ mBoxUnreadCount: res.data.size }, () => {});
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.auth !== prevProps.auth) {
      try {
        this.setState({ mBoxUnreadCount: this.props.auth.mboxNotif }, () => {});
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  selectPostFormView = () => {
    const { classes } = this.props;
    if (window.screen.width < 600 || window.innerWidth < 600) {
      return (
        <Link to="/upload">
          <IconButton className={classes.iconButton}>
            <CloudUploadIcon />
          </IconButton>
        </Link>
      );
    }

    return (
      <ModalView
        togglerComponent={
          <IconButton className={classes.iconButton}>
            <CloudUploadIcon />
          </IconButton>
        }
        modalComponent={<ImageUploadForm view="modal" />}
      />
    );
  };

  renderNavButtons() {
    const { auth, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return auth ? (
      <div className={classes.nav}>
        {this.selectPostFormView()}

        <Link to="/mbox">
          <IconButton className={classes.iconButton}>
            <Badge badgeContent={auth.mBoxNotif || 0} color="secondary">
              <InboxIcon />
            </Badge>
          </IconButton>
        </Link>

        <IconButton
          aria-owns={open ? "menu-appbar" : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Avatar alt="avatar" src={auth.profilePhoto} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem to="/myalbums" component={Link} onClick={this.handleClose}>
            Albums
          </MenuItem>
          <MenuItem
            to={`/profile/${auth.displayName}`}
            component={Link}
            onClick={this.handleClose}
          >
            Profile
          </MenuItem>
          <MenuItem
            href="/auth/logout"
            component="a"
            onClick={this.handleClose}
          >
            Log Out
          </MenuItem>
        </Menu>
      </div>
    ) : (
      <div className={classes.nav}>
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
            <div>
              <Link to="/" className={classNames(classes.logo, classes.aTag)}>
                <CameraIcon className={classes.logoIcon} />

                <Typography
                  variant="title"
                  color="inherit"
                  className={classes.grow}
                >
                  SnapsApp
                </Typography>
              </Link>
            </div>

            {this.renderNavButtons()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object,
  updateMboxNotif: PropTypes.func
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateMboxNotif }
  )
)(NavBar);
