import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";

export class ShareButton extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <div>
        {React.cloneElement(
          this.props.button,
          {
            "aria-owns": anchorEl ? "share-menu" : undefined,
            "aria-haspopup": true,
            onClick: this.handleClick
          },
          [<ShareTwoToneIcon />]
        )}
        <Menu
          id="share-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>Facebook</MenuItem>
          <MenuItem onClick={this.handleClose}>Twitter</MenuItem>
          <MenuItem onClick={this.handleClose}>Copy Link</MenuItem>
        </Menu>
      </div>
    );
  }
}

ShareButton.propTypes = {
  button: PropTypes.element.isRequired
};

export default ShareButton;
