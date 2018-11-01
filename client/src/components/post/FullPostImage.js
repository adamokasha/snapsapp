import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

export const FullPostImage = props => {
  const { classes, imgUrl } = props;
  return (
    <div className={classes.imgContainer}>
      <img
        className={classes.img}
        src={`https://s3.amazonaws.com/img-share-kasho/${imgUrl}`}
        alt={props.title}
      />
    </div>
  );
};

FullPostImage.propTypes = {
  classes: PropTypes.object.isRequired,
  imgUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

const styles = theme => ({
  imgContainer: {
    width: "100%",
    height: "80vh",
    margin: "0",
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    backgroundColor: "#212124"
  },
  img: {
    // maintain aspect ratio
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
});

export default withStyles(styles)(FullPostImage);
