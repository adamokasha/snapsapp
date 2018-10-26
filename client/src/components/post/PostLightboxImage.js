import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

export const PostLightboxImage = props => {
  const {
    classes,
    imgUrl,
    isLoading,
    onPrevSlide,
    onNextSlide,
    onImgLoad,
    start,
    end
  } = props;
  return (
    <div className={classes.root}>
      <NavigateBeforeIcon
        onClick={onPrevSlide}
        className={
          start
            ? classes.disabledNav
            : classNames(classes.navIcons, classes.navLeft)
        }
      />
      <img
        onLoad={onImgLoad}
        className={isLoading ? classes.imgHidden : classes.img}
        src={`https://s3.amazonaws.com/img-share-kasho/${imgUrl}`}
        alt="testing"
      />
      {isLoading ? <CircularProgress className={classes.loader} /> : null}
      <NavigateNextIcon
        onClick={onNextSlide}
        className={
          end
            ? classes.disabledNav
            : classNames(classes.navIcons, classes.navRight)
        }
      />
    </div>
  );
};

PostLightboxImage.propTypes = {
  classes: PropTypes.object.isRequired,
  imgUrl: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onImgLoad: PropTypes.func.isRequired,
  onPrevSlide: PropTypes.func.isRequired,
  onNextSlide: PropTypes.func.isRequired,
  start: PropTypes.bool.isRequired,
  end: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
    width: "100%",
    height: "80%",
    margin: "0",
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    backgroundColor: "#000"
  },
  navIcons: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "48px",
    cursor: "pointer",
    color: "rgba(0, 0, 0, 0.80)",
    zIndex: 1000
  },
  navLeft: {
    left: "2%",
    color: "#fff"
  },
  navRight: {
    right: "2%",
    color: "#fff"
  },
  disabledNav: {
    display: "none"
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "-50%, -50%"
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
    transform: "translate(-50%, -50%)",
    opacity: 1
  },
  imgHidden: {
    opacity: 0
  }
});

export default withStyles(styles)(PostLightboxImage);
