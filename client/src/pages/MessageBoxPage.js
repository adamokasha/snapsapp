import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import MessageList from "../components/mbox/MessageList";
import MessageReplies from "../components/mbox/MessageReplies";
import MessageBoxAppBar from "../components/mbox/MessageBoxAppBar";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";
import { updateMboxNotif } from "../actions/auth";
import * as async from "../async/messages";

export class MessageBoxPage extends React.Component {
  constructor() {
    super();

    this.state = {
      initialFetch: true,
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
    this.setList(this.state.listType);
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  setList = async listView => {
    try {
      let res;
      const { token: cancelToken } = this.signal;
      const { currentListPage } = this.state;
      switch (listView) {
        case "unread":
          res = await async.fetchUnread(cancelToken, currentListPage);
          break;
        case "all":
          res = await async.fetchAll(cancelToken, currentListPage);
          break;
        case "sent":
          res = await async.fetchSent(cancelToken, currentListPage);
          break;
        default:
          return;
      }

      !res.data[`_${listView}`]
        ? this.setState(
            {
              initialFetch: false,
              view: "list",
              listType: listView,
              hasMoreLists: false,
              isLoading: false,
              messages: []
            },
            () => {}
          )
        : (() => {
            const messages = res.data[`_${listView}`];

            if (
              listView === "unread" &&
              messages.length !== this.props.mBoxNotif
            ) {
              this.props.updateMboxNotif(messages.length);
            }

            this.setState({
              initialFetch: false,
              view: "list",
              listType: listView,
              messages: [...messages],
              isLoading: false
            });
          })();
    } catch (e) {
      axios.isCancel()
        ? console.log(e.message)
        : this.setState({ isLoading: false, snackbarOpen: true });
    }
  };

  onListForward = async () => {
    if (!this.state.currentListPage === 0) {
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
    }
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

  onSelectOne = messageId => {
    const { selected } = this.state;
    !selected.includes(messageId)
      ? // Add
        this.setState({ selected: [...this.state.selected, messageId] })
      : //Remove
        (() => {
          const filtered = selected.filter(id => id !== messageId);
          this.setState({ selected: [...filtered] });
        })();
  };

  onSelectAll = () => {
    const { selected, messages } = this.state;
    // Remove all
    selected.length === messages.length
      ? this.setState({ selected: [] })
      : (() => {
          const allMessageIds = messages.map(message => message._id);
          this.setState({ selected: [...allMessageIds] });
        })();
  };

  setMessage = messageId => {
    try {
      this.setState({ isLoading: true }, async () => {
        const { data } = await async.fetchMessage(
          this.signal.token,
          messageId,
          this.state.currentMessagePage
        );

        // Update mBoxNotif
        if (this.state.listType === "unread") {
          this.props.updateMboxNotif(this.props.mBoxNotif - 1);
        }

        this.setState({
          view: "message",
          isLoading: false,
          currentMessage: data,
          currentMessagePage: this.state.currentMessagePage + 1
        });
      });
    } catch (e) {
      axios.isCancel()
        ? console.log(e.message)
        : this.setState({ isLoading: false, snackbarOpen: true });
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
      axios.isCancel()
        ? console.log(e.message)
        : this.setState({ isSending: false, snackbarOpen: true });
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

        !data
          ? this.setState({ hasMoreReplies: false, isLoading: false })
          : this.setState(
              {
                view: "message",
                isLoading: false,
                currentMessage: {
                  ...this.state.currentMessage,
                  replies: [
                    ...data.replies,
                    ...this.state.currentMessage.replies
                  ]
                },
                currentMessagePage: this.state.currentMessagePage + 1
              },
              () => {}
            );
      });
    } catch (e) {
      axios.isCancel()
        ? console.log(e.message)
        : this.setState({ isLoading: false, snackbarOpen: true });
    }
  };

  // Passed as prop to MessageBoxPageAppBar to reset state b/w listType switching
  switchListType = listType => {
    this.setState(
      { currentListPage: 0, hasMoreLists: true, isLoading: true, selected: [] },
      () => {
        this.setList(listType);
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
        await async.deleteMessage(this.signal.token, this.state.selected);
        const updatedMessages = this.state.messages.filter(
          message => !this.state.selected.includes(message._id)
        );
        this.setState(
          { messages: updatedMessages, selected: [], isLoading: false },
          () => {}
        );
      } catch (e) {
        axios.isCancel()
          ? console.log(e.message)
          : this.setState({ isLoading: false, snackbarOpen: true });
      }
    });
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
        {this.state.initialFetch && (
          <div className={classes.circularProgressContainer}>
            <CircularProgress color="primary" size={50} />
          </div>
        )}
        {!this.state.initialFetch && (
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
              {this.state.view === "list" && (
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
              )}
              {this.state.view === "message" && (
                <MessageReplies
                  message={this.state.currentMessage}
                  onSubmitMessageReply={this.onSubmitMessageReply}
                  isSending={this.state.isSending}
                  setPrevMessageReplies={this.setPrevMessageReplies}
                  currentMessagePage={this.state.currentMessagePage}
                  hasMoreReplies={this.state.hasMoreReplies}
                />
              )}
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
        )}
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

MessageBoxPage.propTypes = {
  auth: PropTypes.object.isRequired
};

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
  circularProgressContainer: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    marginTop: `${theme.spacing.unit * 4}px`
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

const mapStateToProps = auth => ({
  auth,
  mBoxNotif: auth.mBoxNotif
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateMboxNotif }
  )
)(MessageBoxPage);
