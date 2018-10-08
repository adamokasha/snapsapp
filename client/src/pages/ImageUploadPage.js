import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ImageUploadForm from '../components/ImageUploadForm';

const styles = theme => ({
  root: {
    margin: `${theme.spacing.unit * 3}px 0`
  },
  layout: {
    
  }
});

export class ImageUploadPage extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.layout}>
          <ImageUploadForm />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(ImageUploadPage);
