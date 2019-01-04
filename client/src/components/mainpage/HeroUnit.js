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
      <main className={classes.main}>
        <div className={classes.heroContent}>
          <Typography
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Snaps App
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
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
    </React.Fragment>
  );
};

HeroUnit.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  main: {
    position: "relative",
    background:
      "url(https://s3.amazonaws.com/img-share-kasho/static/sid-zhao-297176-unsplash.jpg)",
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroContent: {
    maxWidth: 600,
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    margin: "0 auto",
    "& > *": {
      color: "#fff"
    }
    // padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    // marginTop: theme.spacing.unit * 4
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
