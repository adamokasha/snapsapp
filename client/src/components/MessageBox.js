import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import axios from 'axios';


import MessageList from './MessageList';
import Message from './Message';
import MessageBoxAppBar from './MessageBoxAppBar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

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
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      selected: [],
      currentListPage: 0,
      hasMoreLists: true,
      view: 'list',
      listType: 'unread',
      currentMessage: null,
      currentMessagePage: 0,
      hasMoreReplies: true,
      isLoading: false
    };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(prevState.listType !== this.state.listType) {
  //     this.setState({currentListPage: 0}, () => {})
  //   }
  // }

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

  setMessage = async (messageId, currentPage) => {
    try {
      const res = await axios.get(
        `/api/message/get/${messageId}/${currentPage + 1 || 0}`
      );
      if (!res.data) {
        return this.setState({ hasMoreReplies: false });
      }
      this.setState({ view: 'message', currentMessage: res.data });
    } catch (e) {
      console.log(e);
    }
  };

  // Passed as prop to MessageBoxAppBar to reset currentListPage to 0 when switching b/w listType
  switchListType = (listType) => {
    this.setState({currentListPage: 0}, () => {this.setList(listType)})
  }

  setList = async listView => {
    if (listView === 'unread') {
      const res = await axios.get(
        `/api/message/unread/${this.state.currentListPage}`
      );
      if (!res.data._unread) {
        return this.setState(
          {
            view: 'list',
            listType: 'unread',
            hasMoreLists: false,
            currentListPage: this.state.currentListPage - 1
          },
          () => {}
        );
      }
      return this.setState(
        { view: 'list', listType: 'unread', messages: [...res.data._unread] },
        () => {}
      );
    }
    if (listView === 'all') {
      const res = await axios.get(
        `/api/message/all/${this.state.currentListPage}`
      );
      if (!res.data._all) {
        return this.setState(
          { view: 'list', listType: 'all', hasMoreLists: false },
          () => {}
        );
      }
      return this.setState(
        { view: 'list', listType: 'all', messages: [...res.data._all] },
        () => {}
      );
    }
    if (listView === 'sent') {
      const res = await axios.get(
        `/api/message/sent/${this.state.currentListPage}`
      );
      if (!res.data._sent) {
        return this.setState(
          { view: 'list', listType: 'sent', hasMoreLists: false },
          () => {}
        );
      }
      return this.setState(
        { view: 'list', listType: 'sent', messages: [...res.data._sent] },
        () => {}
      );
    }
  };

  goBack = async listType => {
    this.setState({ hasMoreReplies: true }, () => {
      this.setList(listType);
    });
  };

  async componentDidMount() {
    try {
      this.setList(this.state.listType, this.state.currentListPage);
    } catch (e) {
      console.log(e);
    }
  }

  onDelete = async () => {
    try {
      await axios.delete(`/api/message/delete`, {
        data: { deletions: this.state.selected }
      });
      const updatedMessages = this.state.messages.filter(
        message => !this.state.selected.includes(message._id)
      );
      this.setState({ messages: updatedMessages, selected: [] }, () => {});
    } catch (e) {
      console.log(e);
    }
  };

  onListForward = async () => {
    try {
      if (this.state.currentListPage === 0) {
        return;
      }
      this.setState({ currentListPage: this.state.currentListPage - 1, hasMoreLists: true }, () => {
        this.setList(this.state.listType);
      });
    } catch (e) {
      console.log(e);
    }
  };

  onListBack = () => {
    try {
      this.setState({ currentListPage: this.state.currentListPage + 1 }, () => {
        this.setList(this.state.listType);
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <MessageBoxAppBar
            switchListType={this.switchListType}
            view={this.state.view}
            listType={this.state.listType}
            goBack={this.goBack}
          />
        </div>
        <div className={classes.box}>
          {this.state.view === 'list' ? (
            <MessageList
              setList={this.setList}
              listType={this.state.listType}
              selected={this.state.selected}
              onSelectOne={this.onSelectOne}
              onSelectAll={this.onSelectAll}
              messages={this.state.messages}
              setMessage={this.setMessage}
              onDelete={this.onDelete}
            />
          ) : null}
          {this.state.view === 'message' ? (
            <Message
              setMessage={this.setMessage}
              message={this.state.currentMessage}
              hasMoreReplies={this.state.hasMoreReplies}
            />
          ) : null}
        </div>
        <Divider />
        <div className={classes.paginationControls}>
          <IconButton
            onClick={this.onListBack}
            disabled={this.state.messages.length < 5 || !this.state.hasMoreLists}
          >
            <ArrowLeftIcon />
          </IconButton>
          <IconButton
            onClick={this.onListForward}
            disabled={this.state.currentListPage > 0 ? false : true}
          >
            <ArrowRightIcon />
          </IconButton>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(MessageBox);
