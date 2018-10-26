import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import axios from "axios";

import PostHeading from "./PostHeading";
import PostActions from "./PostActions";
import PostLighboxImage from "./PostLightboxImage";
import PostDescription from "./PostDescription";
import PostTags from "./PostTags";
import { favePost } from "../../async/posts";

class PostLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slides: this.props.slideData,
      currentSlide: this.props.post,
      currentIndex: this.props.slideIndex,
      isLoading: true,
      start: this.props.isFirstSlide,
      end: this.props.isLastSlide,
      isFaving: false
    };

    this.signal = axios.CancelToken.source();
  }

  checkIfFirstSlide() {
    const { currentIndex } = this.state;
    if (currentIndex === 0) {
      return this.setState({ start: true }, () => {});
    }
  }

  checkIfNextSlideLast = () => {
    if (this.state.currentIndex + 1 === this.state.slides.length - 1) {
      return true;
    }
    return false;
  };

  onPrevSlide = () => {
    this.checkIfFirstSlide();
    this.setState({ isLoading: true, end: false });
    const { currentIndex } = this.state;
    if (currentIndex - 1 < 0) {
      return;
    }
    const prevSlide = this.state.slides[currentIndex - 1];
    return this.setState(
      { currentSlide: prevSlide, currentIndex: this.state.currentIndex - 1 },
      () => {}
    );
  };

  onNextSlide = () => {
    const { currentIndex } = this.state;
    this.setState({ isLoading: true, start: false }, () => {
      const nextSlideIsLast = this.checkIfNextSlideLast();
      const nextSlide = this.state.slides[currentIndex + 1];
      if (nextSlideIsLast) {
        return this.setState(
          {
            end: true,
            currentSlide: nextSlide,
            currentIndex: this.state.currentIndex + 1
          },
          () => {}
        );
      }

      this.setState({
        currentSlide: nextSlide,
        currentIndex: this.state.currentIndex + 1
      });
    });
  };

  onImgLoad = () => {
    this.setState({ isLoading: false });
  };

  onFavePost = () => {
    this.setState({ isFaving: true }, async () => {
      try {
        await favePost(this.signal.token, this.state.currentSlide._id);
        this.setState({
          currentSlide: {
            ...this.state.currentSlide,
            isFave: !this.state.currentSlide.isFave,
            faveCount: this.state.currentSlide.faveCount
              ? this.state.currentSlide.faveCount - 1
              : this.state.currentSlide.faveCount + 1
          },
          isFaving: false
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        console.log(e);
        this.setState({ isFaving: false }, () => {});
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      _owner,
      title,
      createdAt,
      imgUrl,
      description,
      tags,
      faveCount,
      isFave
    } = this.state.currentSlide;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.postHeader}>
            {this.state.currentSlide && (
              <React.Fragment>
                <PostHeading
                  profilePhoto={_owner.profilePhoto}
                  displayName={_owner.displayName}
                  title={title}
                />
                <PostActions
                  faveCount={faveCount}
                  isFave={isFave}
                  canFave={this.props.auth}
                  onFavePost={this.onFavePost}
                  isFaving={this.state.isFaving}
                />
              </React.Fragment>
            )}
          </div>
          <PostLighboxImage
            imgUrl={imgUrl}
            isLoading={this.state.isLoading}
            onPrevSlide={this.onPrevSlide}
            onNextSlide={this.onNextSlide}
            onImgLoad={this.onImgLoad}
            start={this.state.start}
            end={this.state.end}
          />
          <div className={classes.postFooter}>
            <PostDescription
              createdAt={createdAt}
              description={description}
              substring={true}
            />
            <PostTags tags={tags} />
          </div>
        </div>
      </div>
    );
  }
}

PostLightbox.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    width: "90%",
    height: "97%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    margin: "0 auto",
    overflowY: "auto",
    borderRadius: "8px",
    [theme.breakpoints.down("md")]: {
      height: "60%"
    }
  },
  content: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    margin: "0 auto",
    overflow: "hidden"
  },
  postHeader: {
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px 0`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: `${theme.spacing.unit}px`
    }
  },
  postFooter: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "space-around",
      height: "20%",
      padding: `${theme.spacing.unit * 2}px`
    },
    [theme.breakpoints.up("lg")]: {
      display: "flex",
      justifyContent: "space-around",
      height: "10%",
      padding: `${theme.spacing.unit * 2}px`
    }
  }
});

const mapStateToProps = auth => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PostLightbox);
