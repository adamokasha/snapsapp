import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

export const PostCardHeader = props => {
  const { _owner, title } = props;
  return (
    <CardHeader
      avatar={
        <Avatar
          to={`/profile/${_owner.displayName}`}
          component={Link}
          aria-label="Recipe"
        >
          <img src={_owner.profilePhoto} alt="avatar" />
        </Avatar>
      }
      title={title || "Untitled"}
      subheader={_owner.displayName}
    />
  );
};

PostCardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  _owner: PropTypes.object.isRequired
};

export default PostCardHeader;
