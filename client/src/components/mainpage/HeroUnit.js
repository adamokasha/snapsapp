import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export const HeroUnit = props => {
  const { classes } = props;

  const scrollToContent = () => {
    console.log("called");
    props.contentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };

  return (
    <React.Fragment>
      <div className={classes.bgOverlay}>
        <main className={classes.main}>
          <div className={classes.slides}>
            <figure />
            <figure />
            <figure />
            <figure />
            <figure />
          </div>
          <div className={classes.heroContent}>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              className={classes.heroMainTxt}
              gutterBottom
            >
              Snaps App
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              className={classes.heroSecText}
              paragraph
            >
              SnapsApp is an image-sharing app built with the MERN stack and
              styled with the Material-UI library.
            </Typography>
            <div>
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button
                    to={{
                      pathname: "/register",
                      state: { registerOrLogin: "register" }
                    }}
                    component={Link}
                    variant="outlined"
                    className={classes.heroButtons}
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    href="https://github.com/samokasha/snapsapp"
                    target="_blank"
                    component={"a"}
                    variant="outlined"
                    className={classes.heroButtons}
                  >
                    GitHub
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
          <ArrowBackIosIcon
            onClick={scrollToContent}
            className={classes.scrollDownIcon}
          />
        </main>
      </div>
    </React.Fragment>
  );
};

HeroUnit.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  main: {
    backgroundColor: "rgb(0,0,0)",
    position: "relative",
    height: "100vh"
  },
  slides: {
    height: "100%",
    "& > figure": {
      margin: 0,
      animation: "bg-animation 30s linear infinite 0s",
      backfaceVisibility: "hidden",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      color: "transparent",
      height: "100%",
      left: "0px",
      opacity: "0",
      position: "absolute",
      top: "0px",
      width: "100%",
      zIndex: "0"
    },
    "& figure:nth-child(1)": {
      [theme.breakpoints.down("sm")]: {
        background:
          "url(https://s3.amazonaws.com/img-share-kasho/static/mobile/001_900.jpg)",
        backgroundSize: "cover"
      },
      background:
        "url(https://s3.amazonaws.com/img-share-kasho/static/landscape/001_1920.jpg)",
      backgroundSize: "cover"
    },
    "& figure:nth-child(2)": {
      [theme.breakpoints.down("sm")]: {
        background:
          "url(https://s3.amazonaws.com/img-share-kasho/static/mobile/002_900.jpg)",
        backgroundSize: "cover"
      },
      background:
        "url(https://s3.amazonaws.com/img-share-kasho/static/landscape/002_1920.jpg)",

      animationDelay: "6s",
      backgroundSize: "cover"
    },
    "& figure:nth-child(3)": {
      [theme.breakpoints.down("sm")]: {
        background:
          "url(https://s3.amazonaws.com/img-share-kasho/static/mobile/003_900.jpg)",
        backgroundSize: "cover"
      },
      background:
        "url(https://s3.amazonaws.com/img-share-kasho/static/landscape/003_1920.jpg)",
      animationDelay: "12s",
      backgroundSize: "cover"
    },
    "& figure:nth-child(4)": {
      [theme.breakpoints.down("sm")]: {
        background:
          "url(https://s3.amazonaws.com/img-share-kasho/static/mobile/004_900.jpg)",
        backgroundSize: "cover"
      },
      background:
        "url(https://s3.amazonaws.com/img-share-kasho/static/landscape/004_1920.jpg)",
      animationDelay: "18s",
      backgroundSize: "cover"
    },
    "& figure:nth-child(5)": {
      [theme.breakpoints.down("sm")]: {
        background:
          "url(https://s3.amazonaws.com/img-share-kasho/static/mobile/005_900.jpg)",
        backgroundSize: "cover"
      },
      background:
        "url(https://s3.amazonaws.com/img-share-kasho/static/landscape/005_1920.jpg)",
      animationDelay: "24s",
      backgroundSize: "cover"
    }
  },
  "@keyframes bg-animation": {
    "0%": {
      animationTimingFunction: "ease-in",
      opacity: 0
    },
    "10%": {
      animationTimingFunction: "ease-out",
      opacity: 1
    },
    "20%": {
      opacity: 1
    },
    "25%": {
      opacity: 0
    },
    "100%": {
      opacity: 0
    }
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroContent: {
    width: "90%",
    maxWidth: 600,
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -8px)",
    margin: "0 auto",
    "& > *": {
      color: "#fff"
    },
    [theme.breakpoints.up("sm")]: {
      width: "90%",
      top: "75%",
      transform: "translate(-50%, -6px)"
    }
  },
  heroMainTxt: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.75rem",
      marginBottom: "8px"
    }
  },
  heroSecText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem"
    }
  },
  heroButtons: {
    color: "#fff",
    border: "1px solid #fff"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  scrollDownIcon: {
    fontSize: "48px",
    position: "absolute",
    bottom: "24px",
    left: "50%",
    color: "#fff",
    cursor: "pointer",
    // transform: "translateX(-50%) rotateZ(-90deg)",
    animation: `sd-animation 2500ms ${
      theme.transitions.easing.easeInOut
    } 200ms infinite`
  },
  "@keyframes sd-animation": {
    "0%": {
      transform: "translateX(-50%) rotateZ(-90deg)",
      opacity: 0
    },
    "50%": {
      opacity: 1
    },
    "100%": {
      transform: "translate(-50%, 20px) rotateZ(-90deg)",
      opacity: 0
    }
  }
});

export default withStyles(styles)(HeroUnit);
