import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";

export const PostCardActions = props => {
  const { isFave, isFaving, auth } = props;

  return (
    <CardActions className={classes.actions} disableActionSpacing>
      <div className={classes.actionsLeft}>
        <Typography variant="caption">
          {(faveCount === 1 && `${faveCount} Fave`) ||
            ((faveCount === 0 || faveCount > 1) && `${faveCount} Faves`)}
        </Typography>
        &nbsp;
        <Typography variant="caption">
          {(commentCount === 1 && `${commentCount} Comment`) ||
            ((commentCount === 0 || commentCount > 1) &&
              `${commentCount} Comments`)}{" "}
        </Typography>
      </div>
      <div className={classes.actionsRight}>
        <React.Fragment>
          <IconButton
            aria-label="Add to favorites"
            onClick={onFavePost}
            color={isFave ? "secondary" : "default"}
            disabled={isFaving || !auth || !auth.registered}
          >
            <FavoriteTwoToneIcon />
          </IconButton>
          <ShareButton
            context="post"
            postId={_id}
            imgUrl={imgUrl}
            button={
              <IconButton aria-label="Share" color="default">
                <ShareTwoToneIcon />
              </IconButton>
            }
          />
        </React.Fragment>
      </div>
    </CardActions>
  );
};

PostCardActions.propTypes = {
  classes: PropTypes.object.isRequired,
  isFaving: PropTypes.bool.isRequired,
  isFaving: PropTypes.bool.isRequired,
  auth: PropTypes.oneOf([PropTypes.bool, PropTypes.object])
};

const styles = theme => ({
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionsLeft: {
    display: "flex"
  },
  actionsRight: {
    display: "flex"
  }
});

const mapStateToProps = auth => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PostCardActions);
