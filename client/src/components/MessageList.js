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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '100%'
  },
  messageListRoot: {
    width: '100%',
    height: '250px',
    overflowY: 'scroll',
    paddingTop: 0
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: `${theme.spacing.unit * 3}px`,
    paddingRight: `${theme.spacing.unit * 3}px`
  },
  selectAllContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  listItem: {
    cursor: 'pointer'
  },
  listItemTextContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

export const MessageList = props => {
  const { classes, messages, selected } = props;
  return (
    <div className={classes.root}>
      <div className={classes.menuContainer}>
        <div className={classes.selectAllContainer}>
          <Checkbox
            onClick={() => props.onSelectAll()}
            checked={
              props.messages.length > 1 &&
              props.messages.length === props.selected.length
            }
            disabled={messages.length ? false : true}
          />
          <Typography variant="body2">Select All</Typography>
        </div>
        <div>
          {selected.length > 0 && (
            <IconButton onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={() => props.refreshList(props.listType)}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
      <Divider />
      <List classes={{ root: classes.messageListRoot }}>
        {messages ? (
          messages.map(message => (
            <ListItem
              className={classes.listItem}
              divider={true}
              selected={props.selected.includes(message._id)}
              key={message._id}
            >
              <Checkbox
                onClick={() => props.onSelectOne(message._id)}
                checked={props.selected.includes(message._id)}
              />
              <div
                onClick={() => props.setMessage(message._id)}
                className={classes.listItemTextContainer}
              >
                <Avatar src={message._from.profilePhoto} />
                <ListItemText primary={message._from.displayName} />
                <ListItemText primary={message.title} />
                <ListItemText
                  secondary={moment(message.lastReplied).fromNow()}
                />
              </div>
            </ListItem>
          ))
        ) : (
          <Typography align="center" variant="body2">
            No Messages to Show
          </Typography>
        )}
      </List>
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  setMessage: PropTypes.func
};

export default withStyles(styles)(MessageList);
