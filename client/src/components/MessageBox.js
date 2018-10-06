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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MailBoxNav from './MailBoxNav';
import MessageList from './MessageList';
import Message from './Message';
import MessageBoxAppBar from './MessageBoxAppBar';

const styles = theme => ({
  root: {
    width: '40%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  appBarRoot: {
    boxShadow: 'none'
  },
  toolbarRoot: {
    minHeight: '48px'
  },
  box: {
    display: 'flex',
    height: '300px'
  }
});

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      selected: [],
      viewing: 'list',
      currentMessage: null,
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

  setMessageView = async messageId => {
    try {
      const res = await axios.get(`/api/message/get/${messageId}`);
      this.setState({ viewing: 'message', currentMessage: res.data });
    } catch (e) {
      console.log(e);
    }
  };

  setList = async listView => {
    if (listView === 'unread') {
      const res = await axios.get(`/api/message/unread`);
      if (!res.data._unread) {
        return this.setState({ viewing: 'list', messages: [] }, () => {});
      }
      return this.setState(
        { viewing: 'list', messages: [...res.data._unread] },
        () => {}
      );
    }
    if (listView === 'all') {
      const res = await axios.get(`/api/message/all`);
      if (!res.data._all) {
        return this.setState({ viewing: 'list', messages: [] }, () => {});
      }
      return this.setState(
        { viewing: 'list', messages: [...res.data._all] },
        () => {}
      );
    }
    if (listView === 'sent') {
      const res = await axios.get(`/api/message/sent`);
      if (!res.data._sent) {
        return this.setState({ viewing: 'list', messages: [] }, () => {});
      }
      return this.setState(
        { viewing: 'list', messages: [...res.data._sent] },
        () => {}
      );
    }
  };

  async componentDidMount() {
    try {
      const res = await axios.get('/api/message/unread');
      this.setState({ messages: [...res.data._unread] }, () => {});
    } catch (e) {
      console.log(e);
    }
  }

  onDelete = async () => {
    try {
      await axios.delete(`/api/message/delete`, {
        data: { deletions: this.state.selected }
      });
      this.setState({ selected: [] });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <MessageBoxAppBar setList={this.setList} />
        </div>
        <div className={classes.box}>
          {this.state.viewing === 'list' ? (
            <MessageList
              selected={this.state.selected}
              onSelectOne={this.onSelectOne}
              onSelectAll={this.onSelectAll}
              messages={this.state.messages}
              setMessageView={this.setMessageView}
              onDelete={this.onDelete}
            />
          ) : null}
          {this.state.viewing === 'message' ? (
            <Message message={this.state.currentMessage} />
          ) : null}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(MessageBox);
