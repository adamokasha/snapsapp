import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    width: '100%'
  },
  selectAllContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  selectAllCheckbox: {
    right: '4px'
  }
});

export const MessageList = props => {
  const { classes, messages } = props;
  return (
    <div className={classes.root}>
      <div className={classes.selectAllContainer}>
        <Typography variant="body2">
          Select All
          <Checkbox
            onClick={() => props.onSelectAll()}
            className={classes.selectAllCheckbox}
            checked={props.messages.length === props.selected.length}
          />
        </Typography>
      </div>
      <List classes={{ root: classes.root }}>
        {messages.length > 1 ? (
          messages.map(message => (
            <ListItem>
              <Avatar src={message._from.profilePhoto} />
              <ListItemText primary={message._from.displayName} />
              <ListItemText primary={message.title} />
              <ListItemSecondaryAction>
                <Checkbox
                  onClick={() => props.onSelectOne(message._id)}
                  checked={props.selected.includes(message._id)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <div>No New Messages</div>
        )}
      </List>
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func
};

export default withStyles(styles)(MessageList);
