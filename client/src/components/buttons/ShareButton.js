import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  EmailShareButton
} from "react-share";

import FacebookIcon from "../icons/Facebook";
import TwitterIcon from "../icons/Twitter";
import RedditIcon from "../icons/Reddit";
import PinterestIcon from "../icons/Pinterest";
import WhatsappIcon from "../icons/Whatsapp";

export class ShareButton extends React.Component {
  constructor() {
    super();
    this.state = {
      popperOpen: false
    };
  }

  openPopper = e => {
    this.setState({ popperOpen: true });
  };

  popperClose = e => {
    this.setState({ popperOpen: false });
  };

  render() {
    const url = `https://snapsapp.herokuapp.com/post/${this.props.postId}`;
    const imgUrl = `https://s3.amazonaws.com/img-share-kasho/${
      this.props.imgUrl
    }`;
    const { classes } = this.props;
    return (
      <div>
        {React.cloneElement(this.props.button, {
          ref: (node => (this.anchorEl = node))(),
          "aria-owns": this.state.popperOpen ? "menu-list-grow" : undefined,
          "aria-haspopup": true,
          onClick: this.openPopper
        })}
        <Popper
          className={classes.popper}
          anchorEl={this.anchorEl}
          open={this.state.popperOpen}
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
              <Paper>
                <ClickAwayListener onClickAway={this.popperClose}>
                  <MenuItem
                    classes={{ root: classes.menuListItemRoot }}
                    onClick={this.handleClose}
                  >
                    <FacebookShareButton
                      children={<IconButton children={<FacebookIcon />} />}
                      url={url}
                    />
                    <TwitterShareButton
                      children={<IconButton children={<TwitterIcon />} />}
                      url={url}
                    />
                    <RedditShareButton
                      children={<IconButton children={<RedditIcon />} />}
                      url={url}
                    />
                  </MenuItem>
                  <MenuItem
                    classes={{ root: classes.menuListItemRoot }}
                    onClick={this.handleClose}
                  >
                    <PinterestShareButton
                      media={imgUrl}
                      children={<IconButton children={<PinterestIcon />} />}
                      url={url}
                    />
                    <WhatsappShareButton
                      children={<IconButton children={<WhatsappIcon />} />}
                      url={url}
                    />
                  </MenuItem>

                  <MenuItem onClick={this.handleClose}>Copy Link</MenuItem>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

const styles = theme => ({
  popper: {
    zIndex: "1000",
    transform: "translateX(-50%)"
  },
  menuListItemRoot: {
    "&:hover": {
      backgroundColor: "inherit"
    }
  }
});

ShareButton.propTypes = {
  button: PropTypes.element.isRequired
};

export default withStyles(styles)(ShareButton);
