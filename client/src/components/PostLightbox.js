import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import PostHeading from "../components/PostHeading";
import PostActions from "../components/PostActions";
import PostLighboxImage from "./PostLightboxImage";
import PostDescription from "../components/PostDescription";
import PostTags from "../components/PostTags";

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

class PostLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slides: [],
      currentSlide: this.props.post,
      currentIndex: null,
      isLoading: true,
      start: false,
      end: false
    };
  }

  componentDidMount() {
    // Prevent goTopButton from getting in way of modal
    const goTopButton = document.getElementById("goTopButton");
    if (goTopButton) {
      document.getElementById("goTopButton").style.display = "none";
    }

    // If ScrollView, slides will be array of arrays (due to pagination)
    const slides = [];
    this.props.slides.forEach(posts =>
      posts.forEach(post => slides.push(post))
    );
    const currentIndex = slides.indexOf(this.props.post);
    this.setState({ slides, currentIndex }, () => {
      this.checkIfLastSlide();
      this.checkIfFirstSlide();
    });
  }

  componentWillUnmount() {
    // Restore goTopButton
    const goTopButton = document.getElementById("goTopButton");
    if (goTopButton) {
      document.getElementById("goTopButton").style.display = "inline-flex";
    }
  }

  checkIfFirstSlide() {
    const { currentIndex } = this.state;
    if (currentIndex === 0) {
      this.setState({ start: true }, () => {});
    }
  }

  checkIfLastSlide = () => {
    const { currentIndex } = this.state;
    // If current slide is last, return, don't increment
    if (currentIndex + 1 > this.state.slides.length - 1) {
      return this.setState({ isLoading: false, end: true }, () => {});
    }
  };

  onPrevSlide = () => {
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
    this.setState({ isLoading: true, start: false });

    // Check if next slide last, dont include next icon
    if (currentIndex + 1 === this.state.slides.length - 1) {
      this.setState({ end: true });
    }
    this.checkIfLastSlide();
    const nextSlide = this.state.slides[currentIndex + 1];
    return this.setState(
      { currentSlide: nextSlide, currentIndex: this.state.currentIndex + 1 },
      () => {}
    );
  };

  onImgLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { classes } = this.props;
    const {
      _id,
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
                <PostActions faveCount={faveCount} isFave={isFave} />
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

const mapStateToProps = state => ({
  slides: state.posts.postData
});

PostLightbox.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PostLightbox);
