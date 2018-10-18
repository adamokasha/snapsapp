import React from "react";
import { withStyles } from "@material-ui/core/styles";

import AddPostForm from "../components/AddPostForm";

const styles = theme => ({
  root: {
    margin: `${theme.spacing.unit * 3}px 0`
  },
  layout: {}
});

export class AddPostPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.layout}>
          <AddPostForm view="page" />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(AddPostPage);
