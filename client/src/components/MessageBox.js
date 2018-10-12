import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

import MessageList from './MessageList';
import Message from './Message';
import MessageBoxAppBar from './MessageBoxAppBar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { updateMboxNotif } from '../actions/auth';

const styles = theme => ({
  root: {
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      width: '50%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '40%'
    },
    [theme.breakpoints.up('xl')]: {
      width: '35%'
    }
  },
  appBarRoot: {
    boxShadow: 'none'
  },
  toolbarRoot: {
    minHeight: '48px'
  },
  loadingOpacity: {
    opacity: 0.4,
    pointerEvents: 'none'
  },
  linearProgress: {
    position: 'absolute',
    top: -2,
    width: '100%'
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

  async componentDidMount() {
    try {
      this.setList(this.state.listType, this.state.currentListPage);
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.message !== prevState.messages) {
      const res = await axios.get('/api/message/count');
      this.props.updateMboxNotif(res.data.size);
    }
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

  setMessage = messageId => {
    try {
      this.setState({ isLoading: true }, async () => {
        const res = await axios.get(
          `/api/message/get/${messageId}/${this.state.currentMessagePage}`
        );
        this.setState({
          view: 'message',
          isLoading: false,
          currentMessage: res.data,
          currentMessagePage: this.state.currentMessagePage + 1
        });
      });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  setPrevMessageReplies = (messageId, currentPage) => {
    try {
      this.setState({ isLoading: true }, async () => {
        const res = await axios.get(
          `/api/message/get/${messageId}/${currentPage}`
        );
        if (!res.data) {
          return this.setState({ hasMoreReplies: false, isLoading: false });
        }
        this.setState(
          {
            view: 'message',
            isLoading: false,
            currentMessage: {
              ...this.state.currentMessage,
              replies: [
                ...res.data.replies,
                ...this.state.currentMessage.replies
              ]
            },
            currentMessagePage: this.state.currentMessagePage + 1
          },
          () => {}
        );
      });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  // Passed as prop to MessageBoxAppBar to reset state b/w listType switching
  switchListType = listType => {
    this.setState(
      { currentListPage: 0, hasMoreLists: true, isLoading: true, selected: [] },
      () => {
        this.setList(listType);
      }
    );
  };

  setList = async listView => {
    let res;
    switch (listView) {
      case 'unread':
        res = await axios.get(
          `/api/message/unread/${this.state.currentListPage}`
        );
        break;
      case 'all':
        res = await axios.get(`/api/message/all/${this.state.currentListPage}`);
        break;
      case 'sent':
        res = await axios.get(
          `/api/message/sent/${this.state.currentListPage}`
        );
    }

    if (!res.data[`_${listView}`]) {
      return this.setState(
        {
          view: 'list',
          listType: listView,
          hasMoreLists: false,
          isLoading: false,
          messages: []
        },
        () => {}
      );
    }

    const messages = res.data[`_${listView}`];

    return this.setState(
      {
        messages: []
      },
      () => {
        this.setState({
          view: 'list',
          listType: listView,
          messages: [...messages],
          isLoading: false
        });
      }
    );
  };

  goBack = async listType => {
    this.setState(
      {
        hasMoreReplies: true,
        isLoading: true,
        currentListPage: 0,
        currentMessagePage: 0
      },
      () => {
        this.setList(listType);
      }
    );
  };

  onDelete = () => {
    this.setState({ isLoading: true }, async () => {
      try {
        await axios.delete(`/api/message/delete`, {
          data: { deletions: this.state.selected }
        });
        const updatedMessages = this.state.messages.filter(
          message => !this.state.selected.includes(message._id)
        );
        this.setState(
          { messages: updatedMessages, selected: [], isLoading: false },
          () => {}
        );
      } catch (e) {
        this.setState({ isLoading: false });
      }
    });
  };

  onListForward = async () => {
    try {
      if (this.state.currentListPage === 0) {
        return;
      }
      this.setState(
        {
          currentListPage: this.state.currentListPage - 1,
          isLoading: true,
          hasMoreLists: true,
          selected: []
        },
        () => {
          this.setList(this.state.listType);
        }
      );
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  onListBack = () => {
    try {
      this.setState(
        {
          currentListPage: this.state.currentListPage + 1,
          isLoading: true,
          selected: []
        },
        () => {
          this.setList(this.state.listType);
        }
      );
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        {this.state.isLoading && (
          <LinearProgress
            color="secondary"
            className={classes.linearProgress}
          />
        )}
        <div className={classes.header}>
          <MessageBoxAppBar
            switchListType={this.switchListType}
            view={this.state.view}
            listType={this.state.listType}
            goBack={this.goBack}
          />
        </div>
        <div
          className={
            this.state.isLoading
              ? classNames(classes.loadingOpacity, classes.box)
              : classes.box
          }
        >
          {this.state.view === 'list' ? (
            <MessageList
              setList={this.setList}
              refreshList={this.switchListType}
              listType={this.state.listType}
              messages={this.state.messages}
              setMessage={this.setMessage}
              selected={this.state.selected}
              onSelectOne={this.onSelectOne}
              onSelectAll={this.onSelectAll}
              onDelete={this.onDelete}
            />
          ) : null}
          {this.state.view === 'message' ? (
            <Message
              message={this.state.currentMessage}
              setPrevMessageReplies={this.setPrevMessageReplies}
              currentMessagePage={this.state.currentMessagePage}
              hasMoreReplies={this.state.hasMoreReplies}
            />
          ) : null}
        </div>
        <Divider />
        {this.state.view === 'list' && (
          <div className={classes.paginationControls}>
            <IconButton
              onClick={this.onListBack}
              disabled={
                this.state.messages.length < 5 || !this.state.hasMoreLists
              }
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
        )}
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    null,
    { updateMboxNotif }
  )
)(MessageBox);
