import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import ModalView from "../modal/ModalView";
import PostLightbox from "../post/PostLightbox";

import { flattenPages } from "../../utils/utils";

class PostCard extends React.Component {
  state = {
    imgId: this.props.post._id,
    faved: this.props.post.isFave,
    faveColor: "default",
    open: false,
    slideData: this.props.slideData
  };

  handleOpen = () => {
    let goTopButton = document.getElementById("goTopButton");
    if (goTopButton) {
      goTopButton.style.display = "none";
    }
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    let goTopButton = document.getElementById("goTopButton");
    if (goTopButton) {
      goTopButton.style.display = "inline-flex";
    }
  };

  onFave = async () => {
    try {
      this.setState({ faved: !this.state.faved });
      await axios.post(`/api/posts/fave/${this.state.imgId}`);
      return;
    } catch (e) {
      console.log(e);
    }
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

    const flattenedPages = flattenPages(this.props.slideData);
    const currentSlideIndex = flattenedPages.indexOf(this.props.post);
    const isFirstSlide = currentSlideIndex === 0 ? true : false;
    const isLastSlide = flattenedPages.length - 1 === currentSlideIndex;

    return (
      <ModalView
        togglerComponent={
          <CardMedia
            className={classes.media}
            image={`https://d14ed1d2q7cc9f.cloudfront.net/400x300/smart/${imgUrl}`}
            title={title || "Untitled"}
          />
        }
        modalComponent={
          <PostLightbox
            slideData={flattenedPages}
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
                    onClick={this.onFave}
                    color={this.state.faved ? "secondary" : "default"}
                    classes={{
                      root: classes.iconButtonRoot
                    }}
                  >
                    <FavoriteTwoToneIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Share"
                    color="default"
                    classes={{
                      root: classes.iconButtonRoot
                    }}
                  >
                    <ion-icon name="share-alt" />
                  </IconButton>
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
  post: PropTypes.object.isRequired,
  cardContext: PropTypes.oneOf(["post", "album"])
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
