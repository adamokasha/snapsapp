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
    flexDirection: "column",
    alignItems: "baseline",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row"
    }
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
    color: "rgba(0, 0, 0, 0.70)"
  },
  buttons: {
    marginLeft: `${theme.spacing.unit}px`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  }
});

export const PostActions = props => {
  const { classes, faveCount } = props;
  return (
    <div className={classes.root}>
      <Button size="small" className={classes.buttons}>
        <FavoriteTwoToneIcon color="inherit" className={classes.leftIcon} />
        {faveCount || 0}
      </Button>
      <Button size="small" className={classes.buttons}>
        <CommentOutlinedIcon color="inherit" className={classes.leftIcon} />
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
  faveCount: PropTypes.number.isRequired
};

export default withStyles(styles)(PostActions);
