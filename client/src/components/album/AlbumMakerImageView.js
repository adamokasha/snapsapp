import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@material-ui/core/Button";

export const AlbumMakerImageView = props => {
  const onImageSelect = e => {
    const imgId = e.target.attributes["imgid"].nodeValue;
    props.onImageSelect(imgId);
  };

  const { classes, imgData, selected } = props;

  return (
    <div className={classes.root}>
      <div className={classes.imgView}>
        {imgData.map(img => (
          <div className={classes.imgContainer} key={img._id}>
            <div
              className={
                selected.includes(img._id)
                  ? classes.checkIconContainer
                  : classes.hiddenIconContainer
              }
            >
              <CheckIcon className={classes.checkIcon} />
            </div>
            <img
              key={img._id}
              imgid={img._id}
              className={
                selected.includes(img._id) ? classes.imgSelected : classes.img
              }
              alt="albumimage"
              onClick={onImageSelect}
              src={`https://d14ed1d2q7cc9f.cloudfront.net/75x75/smart/${
                img.imgUrl
              }`}
            />
          </div>
        ))}
      </div>
      <Button onClick={props.onFetchNextPage}>Load More</Button>
    </div>
  );
};

AlbumMakerImageView.propTypes = {
  classes: PropTypes.object.isRequired,
  imgData: PropTypes.array.isRequired,
  onFetchNextPage: PropTypes.func.isRequired
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper
  },
  imgView: {
    width: "100%",
    height: "500px",
    padding: `${theme.spacing.unit * 2}px`,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "start",
    overflowY: "scroll"
  },
  imgContainer: {
    position: "relative",
    width: "75px",
    height: "75px",
    margin: "2px"
  },
  checkIconContainer: {
    position: "absolute",
    top: "2%",
    right: "2%",
    width: "16px",
    height: "16px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    opacity: "0.8",
    display: "inline-block"
  },
  hiddenIconContainer: {
    display: "none",
    position: "absolute",
    top: "2%",
    right: "2%",
    width: "16px",
    height: "16px"
  },
  checkIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "16px"
  },
  imgSelected: {
    width: "75px",
    height: "75px",
    border: "2px solid #000"
  }
});

export default withStyles(styles)(AlbumMakerImageView);
