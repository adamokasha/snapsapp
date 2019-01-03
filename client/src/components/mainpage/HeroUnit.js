import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export const HeroUnit = props => {
  const { classes } = props;

  return (
    <React.Fragment>
      <main>
        <div className={classes.heroContent}>
          <Typography
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            SnapsApp Demo
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph
          >
            SnapsApp is an image-sharing app built with the MERN stack and
            styled with the Material-UI library. SnapsApp includes a gamut of
            features typical of a social app: A follower system, direct
            messaging, profile pages, albums, faves, infinite scroll, sharing
            and more. This is an on-going project with improvements added on a
            semi-regular basis.
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={16} justify="center">
              <Grid item>
                <Button
                  to={{
                    pathname: "/register",
                    state: { registerOrLogin: "register" }
                  }}
                  component={Link}
                  variant="contained"
                  color="primary"
                >
                  Sign Up To Get Started
                </Button>
              </Grid>
              <Grid item>
                <Button
                  href="https://github.com/samokasha/snapsapp"
                  target="_blank"
                  component={"a"}
                  variant="outlined"
                  color="primary"
                >
                  GitHub Repository
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

HeroUnit.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
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
  }
});

export default withStyles(styles)(HeroUnit);
