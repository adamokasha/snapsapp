import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import CardMedia from "@material-ui/core/CardMedia";

export const PostCardMedia = props => {
  const { classes, toggleShowNavToTopButton } = props;
  return (
    <CardMedia
      onClick={() => toggleShowNavToTopButton(false)}
      className={classes.media}
      image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}`}
      title={title || "Untitled"}
    />
  );
};

PostCardMedia.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleShowNavToTopButton: PropTypes.func
};

const styles = theme => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer"
  }
});

export default withStyles(styles)(PostCardMedia);
