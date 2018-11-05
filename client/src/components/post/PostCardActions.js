import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";

import ShareButton from "../buttons/ShareButton";

class PostCardActions extends React.Component {
  state = {
    isFaving: false
  };

  onFavePost = () => {
    const favePost = () =>
      new Promise((resolve, reject) => {
        this.setState({ isFaving: true }, async () => {
          try {
            await this.props.onFavePost(this.props._id);
            this.setState({ isFaving: false }, () => resolve());
          } catch (e) {
            reject();
          }
        });
      });
    favePost();
  };

  render() {
    const {
      classes,
      _id,
      imgUrl,
      faveCount,
      commentCount,
      isFave,
      auth
    } = this.props;

    return (
      <React.Fragment>
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
              onClick={this.onFavePost}
              color={isFave ? "secondary" : "default"}
              disabled={this.state.isFaving || !auth || !auth.registered}
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
      </React.Fragment>
    );
  }
}

PostCardActions.propTypes = {
  classes: PropTypes.object.isRequired,
  commentCount: PropTypes.number.isRequired,
  faveCount: PropTypes.number.isRequired,
  _id: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  onFavePost: PropTypes.func.isRequired,
  isFave: PropTypes.bool.isRequired,
  auth: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
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
