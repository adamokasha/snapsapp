import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const styles = theme => ({
  root: {
    marginTop: `${theme.spacing.unit}px`,
    marginLeft: `${theme.spacing.unit}px`
  }
});

export const PostDescription = props => {
  const { classes, description, createdAt } = props;
  return (
    <div className={classes.root}>
      <Typography variant="caption">{moment(createdAt).fromNow()}</Typography>
      <Typography variant="body1">{description}</Typography>
    </div>
  );
};

PostDescription.propTypes = {
  classes: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
};

export default withStyles(styles)(PostDescription);
