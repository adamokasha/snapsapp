import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

export const PostCardHeader = props => {
  const { owner, title } = props;
  return (
    <CardHeader
      avatar={
        <Avatar
          to={`/profile/${owner.displayName}`}
          component={Link}
          aria-label="Recipe"
        >
          <img src={owner.profilePhoto} alt="avatar" />
        </Avatar>
      }
      title={title || "Untitled"}
      subheader={owner.displayName}
    />
  );
};

PostCardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  owner: PropTypes.object.isRequired
};

export default PostCardHeader;
