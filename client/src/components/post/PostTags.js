import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";

export const PostTags = props => {
  const { classes, tags } = props;
  return (
    <div className={classes.root}>
      {tags.length > 0 &&
        tags.map(tag => <Chip label={tag} className={classes.chip} />)}
    </div>
  );
};

PostTags.propTypes = {
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array
};

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: `8px 8px 8px 0`
  },
  chip: {
    margin: `4px`
  }
});

export default withStyles(styles)(PostTags);
