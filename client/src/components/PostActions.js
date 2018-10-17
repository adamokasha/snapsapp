import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row"
    }
  },
  iconColor: {
    color: "rgba(0, 0, 0, 0.70)"
  },
  favedIcon: {
    color: `${theme.palette.secondary.main}`
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  },
  buttons: {
    marginLeft: `${theme.spacing.unit}px`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  }
});

export const PostActions = props => {
  const { classes, faveCount, isFave } = props;
  return (
    <div className={classes.root}>
      <Button size="small" className={classes.buttons}>
        <FavoriteTwoToneIcon
          className={
            isFave
              ? classNames(classes.favedIcon, classes.leftIcon)
              : classNames(classes.iconColor, classes.leftIcon)
          }
        />
        {faveCount}
      </Button>
      <Button size="small" className={classes.buttons}>
        <CommentOutlinedIcon className={classes.leftIcon} color="inherit" />
        15
      </Button>
      <Button size="small" className={classes.buttons}>
        <ShareTwoToneIcon />
      </Button>
    </div>
  );
};

PostActions.propTypes = {
  classes: PropTypes.object.isRequired,
  faveCount: PropTypes.number.isRequired,
  isFave: PropTypes.bool.isRequired
};

export default withStyles(styles)(PostActions);
