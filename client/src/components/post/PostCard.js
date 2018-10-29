import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import Divider from "@material-ui/core/Divider";

import ModalView from "../modal/ModalView";
import ShareButton from "../buttons/ShareButton";
import PostLightbox from "../post/PostLightbox";

class PostCard extends React.Component {
  state = {
    isFaving: false
  };

  onFavePost = () => {
    const favePost = () =>
      new Promise((resolve, reject) => {
        this.setState({ isFaving: true }, async () => {
          try {
            await this.props.onFavePost(this.props.post._id);
            this.setState({ isFaving: false }, () => resolve());
          } catch (e) {
            reject();
          }
        });
      });
    favePost();
  };

  // Will select view based on width: Modal(m+) or redirect to full page view(s-)
  selectView = () => {
    const { classes, title, cardContext } = this.props;
    const { imgUrl, _id } = this.props.post;
    // Don't open modal on small screens
    if (
      cardContext === "album" ||
      window.screen.width < 600 ||
      window.innerWidth < 600
    ) {
      return (
        <Link
          to={{
            pathname: `/post/${_id}/`,
            state: { post: this.props.post }
          }}
        >
          <CardMedia
            className={classes.media}
            image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}`}
            title={title || "Image Title"}
          />
        </Link>
      );
    }

    const currentSlideIndex = this.props.slideData.indexOf(this.props.post);
    const isFirstSlide = currentSlideIndex === 0 ? true : false;
    const isLastSlide = this.props.slideData.length - 1 === currentSlideIndex;

    return (
      <ModalView
        togglerComponent={
          <CardMedia
            onClick={() => this.props.toggleShowNavToTopButton(false)}
            className={classes.media}
            image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}`}
            title={title || "Untitled"}
          />
        }
        modalComponent={
          <PostLightbox
            onFavePost={this.props.onFavePost}
            slideData={this.props.slideData}
            slideIndex={currentSlideIndex}
            post={this.props.post}
            isFirstSlide={isFirstSlide}
            isLastSlide={isLastSlide}
          />
        }
      />
    );
  };

  render() {
    const { classes, cardContext } = this.props;
    const {
      _owner,
      title,
      description,
      faveCount,
      createdAt
    } = this.props.post;

    return (
      <div>
        <Card className={classes.card} raised>
          <CardHeader
            avatar={
              <Avatar
                to={`/profile/${_owner.displayName}`}
                component={Link}
                aria-label="Recipe"
                className={classes.avatar}
              >
                <img src={_owner.profilePhoto} alt="avatar" />
              </Avatar>
            }
            title={title || "Aerial Photo"}
            subheader={_owner.displayName || "September 14, 2016"}
            className={cardContext === "album" ? classes.albumHidden : null}
          />
          {this.selectView()}
          <CardContent>
            {cardContext === "album" ? (
              <div>
                <Typography variant="body2">{title}</Typography>
                <Typography variant="caption">Posted {createdAt}</Typography>
              </div>
            ) : null}
            <Typography>
              {cardContext === "album" ? null : description}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions className={classes.actions} disableActionSpacing>
            <div className={classes.actionsLeft}>
              <Typography variant="caption">{faveCount} Faves</Typography>
              &nbsp;
              <Typography variant="caption">15 Comments</Typography>
            </div>
            <div className={classes.actionsRight}>
              {this.props.isAuth ? (
                <React.Fragment>
                  <IconButton
                    aria-label="Add to favorites"
                    onClick={this.onFavePost}
                    color={this.props.post.isFave ? "secondary" : "default"}
                    classes={{
                      root: classes.iconButtonRoot
                    }}
                    disabled={this.state.isFaving}
                  >
                    <FavoriteTwoToneIcon />
                  </IconButton>
                  <ShareButton
                    button={
                      <IconButton
                        aria-label="Share"
                        color="default"
                        classes={{
                          root: classes.iconButtonRoot
                        }}
                      />
                    }
                  />
                </React.Fragment>
              ) : null}
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

PostCard.propTypes = {
  classes: PropTypes.object.isRequired,
  slideData: PropTypes.array.isRequired,
  post: PropTypes.object.isRequired,
  cardContext: PropTypes.oneOf(["post", "album"]),
  onFavePost: PropTypes.func.isRequired,
  toggleShowNavToTopButton: PropTypes.func.isRequired
};

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: `${theme.spacing.unit * 3}px auto`
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer"
  },
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
  },
  iconButtonRoot: {
    width: "32px",
    height: "32px"
  },
  modalRoot: {
    top: "3%",
    width: "100%",
    height: "100%",
    [theme.breakpoints.down("md")]: {
      top: "18%"
    }
  },
  albumHidden: {
    display: "none"
  }
});

const mapStateToProps = auth => ({
  isAuth: auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PostCard);
