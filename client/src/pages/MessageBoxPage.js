import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import MessageList from "../components/MessageList";
import MessageReplies from "../components/MessageReplies";
import MessageBoxAppBar from "../components/MessageBoxAppBar";
import CustomSnackbar from "../components/CustomSnackbar";
import { updateMboxNotif } from "../actions/auth";
import * as async from "../async/messages";

const styles = theme => ({
  root: {
    width: "90%",
    margin: `${theme.spacing.unit * 4}px auto`,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    [theme.breakpoints.up("md")]: {
      width: "50%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "35%"
    }
  },
  appBarRoot: {
    boxShadow: "none"
  },
  toolbarRoot: {
    minHeight: "48px"
  },
  loadingOpacity: {
    opacity: 0.4,
    pointerEvents: "none"
  },
  linearProgress: {
    position: "absolute",
    top: -2,
    width: "100%"
  },
  box: {
    display: "flex",
    height: "300px"
  },
  paginationControls: {
    display: "flex",
    justifyContent: "flex-end"
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
      view: "list",
      listType: "unread",
      currentMessage: null,
      currentMessagePage: 0,
      isSending: false,
      hasMoreReplies: true,
      isLoading: false,
      snackbarOpen: false
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      this.setList(this.state.listType, this.state.currentListPage);
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.messages !== prevState.messages) {
      try {
        const { data } = await async.fetchMessageCount(this.signal.token);
        this.props.updateMboxNotif(data.size);
      } catch (e) {
        if (axios.isCancel()) {
          console.log(e.message);
        }
        console.log(e);
      }
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
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
        const { data } = await async.fetchMessage(
          this.signal.token,
          messageId,
          this.state.currentMessagePage
        );
        this.setState({
          view: "message",
          isLoading: false,
          currentMessage: data,
          currentMessagePage: this.state.currentMessagePage + 1
        });
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      this.setState({ isLoading: false, snackbarOpen: true });
    }
  };

  onSubmitMessageReply = async replyBody => {
    try {
      const { data } = await async.submitMessageReply(
        this.signal.token,
        this.state.currentMessage._id,
        replyBody
      );
      const { body, createdAt } = data;
      const reply = {
        _id: Math.random() * 10,
        createdAt,
        body,
        _owner: {
          profilePhoto: this.props.auth.profilePhoto,
          displayName: this.props.auth.displayName
        }
      };
      this.setState({
        ...this.state,
        currentMessage: {
          ...this.state.currentMessage,
          replies: [...this.state.currentMessage.replies, reply]
        },
        isSending: false
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
      this.setState({ isSending: false, snackbarOpen: true });
    }
  };

  setPrevMessageReplies = () => {
    try {
      this.setState({ isLoading: true }, async () => {
        const { data } = await async.fetchMessage(
          this.signal.token,
          this.state.currentMessage._id,
          this.state.currentMessagePage
        );
        if (!data) {
          return this.setState({ hasMoreReplies: false, isLoading: false });
        }
        this.setState(
          {
            view: "message",
            isLoading: false,
            currentMessage: {
              ...this.state.currentMessage,
              replies: [...data.replies, ...this.state.currentMessage.replies]
            },
            currentMessagePage: this.state.currentMessagePage + 1
          },
          () => {}
        );
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      this.setState({ isLoading: false, snackbarOpen: true });
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
    try {
      let res;
      switch (listView) {
        case "unread":
          res = await async.fetchUnread(
            this.signal.token,
            this.state.currentListPage
          );
          break;
        case "all":
          res = await async.fetchAll(
            this.signal.token,
            this.state.currentListPage
          );
          break;
        case "sent":
          res = await async.fetchSent(
            this.signal.token,
            this.state.currentListPage
          );
      }

      if (!res.data[`_${listView}`]) {
        return this.setState(
          {
            view: "list",
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
            view: "list",
            listType: listView,
            messages: [...messages],
            isLoading: false
          });
        }
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      this.setState({ isLoading: false, snackbarOpen: true });
    }
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
        await async.deleteMessage(this.signal.token, this.state.selected);
        const updatedMessages = this.state.messages.filter(
          message => !this.state.selected.includes(message._id)
        );
        this.setState(
          { messages: updatedMessages, selected: [], isLoading: false },
          () => {}
        );
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
        this.setState({ isLoading: false, snackbarOpen: true });
      }
    });
  };

  onListForward = async () => {
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
  };

  onListBack = () => {
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
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
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
            {this.state.view === "list" ? (
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
            {this.state.view === "message" ? (
              <MessageReplies
                message={this.state.currentMessage}
                onSubmitMessageReply={this.onSubmitMessageReply}
                isSending={this.state.isSending}
                setPrevMessageReplies={this.setPrevMessageReplies}
                currentMessagePage={this.state.currentMessagePage}
                hasMoreReplies={this.state.hasMoreReplies}
              />
            ) : null}
          </div>
          <Divider />
          {this.state.view === "list" && (
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
        <CustomSnackbar
          variant="error"
          message="Something went wrong! Try again..."
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
          snackbarOpen={this.state.snackbarOpen}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateMboxNotif }
  )
)(MessageBox);
