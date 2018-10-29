import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Popper from "@material-ui/core/Popper";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
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
  state = {
    popperOpen: false,
    linkCopied: "Copy Link"
  };

  openPopper = e => {
    this.setState({ popperOpen: true });
  };

  closePopper = e => {
    this.setState({ popperOpen: false, linkCopied: "Copy Link" });
  };

  copyLink = () => {
    this.hiddenTextArea.select();
    document.execCommand("copy");
    this.setState({ linkCopied: "Link Copied!" });
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
          placement="right-end"
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} id="menu-list-grow">
              <ClickAwayListener onClickAway={this.closePopper}>
                <List>
                  <Paper>
                    <MenuItem
                      classes={{ root: classes.menuListItemRoot }}
                      onClick={this.handleClose}
                    >
                      <FacebookShareButton
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <FacebookIcon
                                classes={{ root: classes.facebookIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                      <TwitterShareButton
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <TwitterIcon
                                classes={{ root: classes.twitterIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                      <RedditShareButton
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <RedditIcon
                                classes={{ root: classes.redditIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                    </MenuItem>
                    <MenuItem
                      classes={{ root: classes.menuListItemRoot }}
                      onClick={this.handleClose}
                    >
                      <PinterestShareButton
                        media={imgUrl}
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <PinterestIcon
                                classes={{ root: classes.pinterestIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                      <WhatsappShareButton
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <WhatsappIcon
                                classes={{ root: classes.whatsappIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                      <EmailShareButton
                        children={
                          <IconButton
                            onClick={this.closePopper}
                            children={
                              <MailOutlineIcon
                                classes={{ root: classes.mailIconRoot }}
                              />
                            }
                          />
                        }
                        url={url}
                      />
                    </MenuItem>

                    {document.queryCommandSupported("copy") && (
                      <MenuItem
                        onClick={this.closePopper}
                        color="primary"
                        variant="flat"
                        component={Button}
                        onClick={this.copyLink}
                        fullWidth
                      >
                        <textarea
                          className={classes.hiddenTextArea}
                          ref={textarea => {
                            this.hiddenTextArea = textarea;
                          }}
                          value={url}
                          readOnly
                        />
                        {this.state.linkCopied}
                      </MenuItem>
                    )}
                  </Paper>
                </List>
              </ClickAwayListener>
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
    transform: "translate(-75%, -75%)"
  },
  menuListItemRoot: {
    "&:hover": {
      backgroundColor: "inherit"
    }
  },
  facebookIconRoot: {
    fill: "#3b5998"
  },
  twitterIconRoot: {
    fill: "#1da1f2"
  },
  redditIconRoot: {
    fill: "#ff4500"
  },
  pinterestIconRoot: {
    fill: "#bd081c"
  },
  whatsappIconRoot: {
    fill: "#25d366"
  },
  mailIconRoot: {
    fontSize: "32px",
    color: "#000"
  },
  hiddenTextArea: {
    opacity: 0,
    width: 0,
    height: 0
  }
});

ShareButton.propTypes = {
  button: PropTypes.element.isRequired,
  postId: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired
};

export default withStyles(styles)(ShareButton);
