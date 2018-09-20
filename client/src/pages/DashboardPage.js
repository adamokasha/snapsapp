import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ImageUploadModal from '../components/ImageUploadModal';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: '80%',
    right: '0%'
  }
});

export const DashboardPage = props => {
  return (
    <div>
      <Typography
        variant="display3"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Dashboard page
      </Typography>
      <ImageUploadModal />
    </div>
  );
};

export default withStyles(styles)(DashboardPage);
