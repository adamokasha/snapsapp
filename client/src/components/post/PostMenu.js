import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";

import ModalView from "../modal/ModalView";
import AddPostForm from "./AddPostForm";

class PostMenu extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onDeletePost = () => {
    const { imgUrl, _id } = this.props.post;
    this.props.onDeletePost(imgUrl, _id);
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
          aria-owns={open ? "edit-menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="edit-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          <ModalView
            togglerComponent={<MenuItem>Edit</MenuItem>}
            modalComponent={
              <AddPostForm
                view="modal"
                editMode={true}
                post={this.props.post}
                closeMenu={this.handleClose}
                onEditPost={this.props.onEditPost}
              />
            }
          />
          <MenuItem onClick={this.onDeletePost}>Delete</MenuItem>
        </Menu>
      </div>
    );
  }
}

PostMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  imgUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default PostMenu;
