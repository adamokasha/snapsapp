import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "baseline"
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
    color: "rgba(0, 0, 0, 0.70)"
  },
  buttonMargin: {
    marginLeft: `${theme.spacing.unit}px`
  }
});

export const PostActions = props => {
  const { classes, faveCount } = props;
  return (
    <div className={classes.root}>
      <Button size="small">
        <FavoriteTwoToneIcon color="inherit" className={classes.leftIcon} />
        {faveCount}
      </Button>
      <Button className={classes.buttonMargin}>
        <CommentOutlinedIcon color="inherit" className={classes.leftIcon} />
        15
      </Button>
      <Button size="small" className={classes.buttonMargin}>
        <ShareTwoToneIcon />
      </Button>
    </div>
  );
};

PostActions.propTypes = {
  classes: PropTypes.object.isRequired,
  faveCount: PropTypes.number.isRequired
};

export default withStyles(styles)(PostActions);
