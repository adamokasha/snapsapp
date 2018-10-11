import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import axios from 'axios';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  listRoot: {
    height: '200px',
    overflowY: 'scroll'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0
  },
  dateText: {
    textAlign: 'right'
  }
});

export class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
      message: this.props.message,
      currentPage: 0,
      hasMoreReplies: this.props.hasMoreReplies
    };

    this.bottomRef = React.createRef();
  }

  componentDidMount() {
    this.bottomRef.current.scrollIntoView();
  }

  componentDidUpdate(prevProps) {
    if (this.props.message.replies !== prevProps.message.replies) {
      this.setState({ message: this.props.message }, () =>
        this.bottomRef.current.scrollIntoView()
      );
    }
    this.bottomRef.current.scrollIntoView();
  }

  onSubmit = async e => {
    try {
      e.preventDefault();
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
          body: ''
        },
        () => {}
      );
    } catch (e) {
      console.log(e);
    }
  };

  onBodyChange = e => {
    this.setState({ body: e.target.value }, () => {});
  };

  loadPrevious = async () => {
    try {
      await this.props.setMessage(
        this.props.message._id,
        this.state.currentPage
      );
      this.setState({ currentPage: this.state.currentPage + 1 });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { message, classes } = this.props;
    return (
      <div className={classes.root}>
        <List classes={{ root: classes.listRoot }}>
          <ListItem>
            {this.props.hasMoreReplies && (
              <Button onClick={this.loadPrevious}>Load Previous</Button>
            )}
          </ListItem>
          {this.state.message.replies.map(reply => (
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
          />
          <Button type="submit" variant="contained">
            <SendOutlinedIcon className={classes.leftIcon} />
            Reply
          </Button>
        </form>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Message);
