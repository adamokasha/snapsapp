import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

import MailBoxNav from './MailBoxNav';
import MessageList from './MessageList';
import Message from './Message';

const styles = theme => ({
  root: {
    width: '40%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: `${theme.spacing.unit}px`,
    borderBottom: '1px dotted rgba(0, 0, 0, .4)'
  },
  box: {
    display: 'flex'
  }
});

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      selected: [],
      viewing: 'unread',
      isLoading: false
    };
  }

  onSelectOne = messageId => {
    const { selected } = this.state;
    // Add
    if (!selected.includes(messageId)) {
      return this.setState({ selected: [...this.state.selected, messageId] });
    }
    //Remove
    const filtered = selected.filter(id => id !== messageId);
    this.setState({ selected: [...filtered] });
  };

  onSelectAll = () => {
    const { selected, messages } = this.state;
    // Remove all
    if (selected.length === messages.length) {
      return this.setState({ selected: [] });
    }

    const allMessageIds = messages.map(message => message._id);
    this.setState({ selected: [...allMessageIds] });
  };

  async componentDidMount() {
    try {
      const res = await axios.get('/api/message/unread');
      this.setState({ messages: [...res.data._unread] }, () => {});
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.header}>Messages</div>
        <div className={classes.box}>
          <MailBoxNav />
          {this.state.viewing === 'unread' ? (
            <MessageList
              selected={this.state.selected}
              onSelectOne={this.onSelectOne}
              onSelectAll={this.onSelectAll}
              messages={this.state.messages}
            />
          ) : null}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(MessageBox);
