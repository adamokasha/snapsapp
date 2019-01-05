import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const LaunchScreen = ({ classes }) => (
  <div className={classes.root}>
    <LinearProgress color="secondary" />
    <Typography
      className={classes.brandText}
      align="center"
      variant="h2"
      color="inherit"
    >
      Snaps App
    </Typography>
  </div>
);

LaunchScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    background: `linear-gradient(336deg, #2c387e,#3f51b5 , #6573c3)`,
    height: "100vh",
    position: "relative"
  },
  brandText: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff"
  },
  linearProgress: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0
  }
});

export default withStyles(styles)(LaunchScreen);
