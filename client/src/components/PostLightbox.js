import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import Chip from "@material-ui/core/Chip";
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
  postInfo: {
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px 0`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: `${theme.spacing.unit}px`
    }
  },
  // headerElement: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   height: "10%",
  //   padding: `${theme.spacing.unit * 2}px`
  // },
  // headerLeft: {
  //   display: "flex"
  // },
  // headerLeftText: {
  //   display: "flex",
  //   flexDirection: "column"
  // },
  // headerRight: {
  //   display: "flex"
  // },
  // headerRightButtons: {},
  // leftIcon: {
  //   marginRight: `${theme.spacing.unit}px`,
  //   color: "rgba(0, 0, 0, 0.70)"
  // },
  // buttonMargin: {
  //   marginLeft: `${theme.spacing.unit}px`
  // },
  // ionicon: {
  //   fontSize: "24px",
  //   color: "rgba(0, 0, 0, 0.70)"
  // },
  // avatar: {
  //   width: "50px",
  //   height: "50px",
  //   marginRight: `${theme.spacing.unit * 2}px`
  // },

  // imgContainer: {
  //   width: "100%",
  //   height: "80%",
  //   margin: "0",
  //   position: "relative",
  //   display: "inline-block",
  //   overflow: "hidden"
  // },
  // navIcons: {
  //   position: "absolute",
  //   top: "50%",
  //   transform: "translateY(-50%)",
  //   fontSize: "48px",
  //   cursor: "pointer",
  //   color: "rgba(0, 0, 0, 0.80)"
  // },
  // navLeft: {
  //   left: "2%"
  // },
  // navRight: {
  //   right: "2%"
  // },
  // disabledNav: {
  //   display: "none"
  // },
  // loader: {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transformOrigin: "-50%, -50%"
  // },
  // img: {
  //   // maintain aspect ratio
  //   maxWidth: "100%",
  //   maxHeight: "100%",
  //   width: "auto",
  //   height: "auto",
  //   display: "block",
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   opacity: 1
  // },
  // imgHidden: {
  //   opacity: 0
  // },
  bottom: {
    display: "flex",
    justifyContent: "space-around",
    height: "10%",
    padding: `${theme.spacing.unit * 2}px`
  },
  bottomLeft: {
    overflow: "hidden",
    width: "35%"
  },
  bottomRight: {
    display: "flex",
    justifyContent: "flex-start",
    overflow: "hidden",
    width: "65%",
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end"
    }
  },
  chip: {
    marginLeft: `${theme.spacing.unit}px`
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
      imgUrl,
      title,
      faveCount,
      isFave,
      description
    } = this.state.currentSlide;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.postInfo}>
            {this.state.currentSlide && (
              <React.Fragment>
                <div className={classes.postInfo}>
                  <PostHeading
                    profilePhoto={_owner.profilePhoto}
                    displayName={_owner.displayName}
                    title={title}
                  />
                  <PostActions faveCount={faveCount} />
                </div>
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
          <div className={classes.bottom}>
            <div className={classes.bottomLeft}>
              <Typography variant="body2">{description}</Typography>
            </div>
            <div className={classes.bottomRight}>
              <Typography variant="body2">Tags: </Typography>
              <Chip label="Nature" className={classes.chip} />
              <Chip label="Forest" className={classes.chip} />
              <Chip label="Plants" className={classes.chip} />
              <Chip label="Mountains" className={classes.chip} />
              <Chip label="Hiking" className={classes.chip} />
              <Chip label="Trail" className={classes.chip} />
            </div>
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
