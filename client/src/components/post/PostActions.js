import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";

import PostShare from "./PostShare";

export const PostActions = props => {
  const { classes, faveCount, canFave, onFavePost, isFave, isFaving } = props;
  return (
    <div className={classes.root}>
      {canFave && (
        <Button
          onClick={onFavePost}
          size="small"
          className={classes.buttons}
          disabled={isFaving}
        >
          <FavoriteTwoToneIcon
            className={
              isFave
                ? classNames(classes.favedIcon, classes.leftIcon)
                : classNames(classes.iconColor, classes.leftIcon)
            }
          />
          {faveCount}
        </Button>
      )}
      {!canFave && (
        <Tooltip title={"You need to signup or login to fave this post."}>
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
        </Tooltip>
      )}

      <Button size="small" className={classes.buttons}>
        <CommentOutlinedIcon className={classes.leftIcon} color="inherit" />
        15
      </Button>
      <PostShare
        classes={{ popper: classes.popper }}
        button={
          <Button size="small" className={classes.buttons}>
            <ShareTwoToneIcon />
          </Button>
        }
      />
    </div>
  );
};

PostActions.propTypes = {
  classes: PropTypes.object.isRequired,
  faveCount: PropTypes.number.isRequired,
  isFave: PropTypes.bool.isRequired,
  canFave: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onFavePost: PropTypes.func.isRequired,
  isFaving: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  },
  popper: {
    transform: "translate(-65%, -30%)"
  }
});

export default withStyles(styles)(PostActions);
