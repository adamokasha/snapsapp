import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import axios from 'axios';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    height: '348px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  listRoot: {
    height: '252px',
    overflowY: 'scroll'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  },
  dateText: {
    textAlign: 'right'
  },
  loadMoreButton: {
    margin: '0 auto'
  }
});

export class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
      message: this.props.message,
      currentPage: this.props.currentMessagePage,
      hasMoreReplies: this.props.hasMoreReplies,
      isSending: false
    };

    this.bottomRef = React.createRef();
  }

  componentDidMount() {
    this.bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" });
  }

  componentDidUpdate(prevProps) {
    if (this.props.message.replies !== prevProps.message.replies) {
      this.setState(
        {
          message: this.props.message,
          currentPage: this.props.currentMessagePage
        },
        () => {}
      );
    }
  }

  onSubmit = e => {
    try {
      e.preventDefault();
      this.setState({ isSending: true }, async () => {
        const res = await axios.post(
          `/api/message/reply/${this.props.message._id}`,
          {
            body: this.state.body
          }
        );
        const { body, createdAt } = res.data;
        const reply = {
          createdAt,
          body,
          _owner: {
            profilePhoto: this.props.auth.profilePhoto
          }
        };
        const updatedReplies = this.state.message.replies.push(reply);
        this.setState(
          {
            ...this.state,
            message: {
              ...this.state.message,
              replies: [...this.state.message.replies, ...updatedReplies]
            },
            body: '',
            isSending: false
          },
          () => {
            this.bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" });
          }
        );
      });
    } catch (e) {
      console.log(e);
      this.setState({ isSending: false });
    }
  };

  onBodyChange = e => {
    this.setState({ body: e.target.value }, () => {});
  };

  loadPrevious = async () => {
    try {
      await this.props.setPrevMessageReplies(
        this.props.message._id,
        this.props.currentMessagePage
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <List classes={{ root: classes.listRoot }}>
          <ListItem>
            <Button
              className={classes.loadMoreButton}
              variant="outlined"
              size="small"
              onClick={this.loadPrevious}
              disabled={
                this.state.message.replies.length < 5 ||
                !this.props.hasMoreReplies
              }
            >
              Load Previous
            </Button>
          </ListItem>
          {this.state.message &&
            this.state.message.replies.map(reply => (
              <ListItem key={reply._id}>
                <Link to={`/profile/${reply._owner.displayName}`}>
                  <Avatar src={reply._owner.profilePhoto} />
                </Link>
                <ListItemText primary={reply.body} />
                <ListItemText
                  classes={{ root: classes.dateText }}
                  secondary={moment(reply.createdAt).fromNow()}
                />
              </ListItem>
            ))}
          <div ref={this.bottomRef} />
        </List>
        <form onSubmit={this.onSubmit} className={classes.form}>
          <OutlinedInput
            multiline
            rows={1}
            onChange={this.onBodyChange}
            value={this.state.body}
            disabled={this.state.isSending}
            inputProps={{ maxLength: 120 }}
            endAdornment={
                <InputAdornment position="end">
                  {this.state.body.length}
                  /120
                </InputAdornment>
              }
          />
          <Button
            type="submit"
            variant="contained"
            disabled={this.state.isSending || this.state.body.length < 1}
          >
            <SendOutlinedIcon className={classes.leftIcon} />
            Reply
          </Button>
        </form>
      </Paper>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  setPrevMessageReplies: PropTypes.func.isRequired,
  currentMessagePage: PropTypes.number.isRequired,
  hasMoreReplies: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Message);
