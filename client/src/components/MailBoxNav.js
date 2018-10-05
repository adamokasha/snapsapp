import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import axios from 'axios';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

const styles = theme => ({
  root: {
    borderRight: '1px dotted rgba(0, 0, 0, .4)'
  }
});

const MailBoxNav = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SendOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItem>
      </List>
    </div>
  );
};

export default withStyles(styles)(MailBoxNav);
