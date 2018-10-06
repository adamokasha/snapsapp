import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import axios from 'axios';

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
  }
});

export class Message extends React.Component {
  constructor() {
    super();

    this.state = {
      body: ''
    };
  }
  onSubmit = async e => {
    try {
      e.preventDefault();
      const { body } = this.state;
      await axios.post(`/api/message/reply/${this.props.message._id}`, {
        body
      });
    } catch (e) {
      console.log(e);
    }
  };

  onBodyChange = e => {
    this.setState({ body: e.target.value }, () => {});
  };

  render() {
    const { message, classes } = this.props;
    return (
      <div className={classes.root}>
        <List classes={{ root: classes.listRoot }}>
          <ListItem>
            <Avatar src={message._from.profilePhoto} />
            <ListItemText>{message.body}</ListItemText>
          </ListItem>
          {message.replies.map(reply => (
            <ListItem>
              <Avatar src={reply._owner.profilePhoto} />
              <ListItemText primary={reply.body} />
            </ListItem>
          ))}
        </List>
        <form onSubmit={this.onSubmit} className={classes.form}>
          <OutlinedInput multiline rows={1} onChange={this.onBodyChange} />
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

export default withStyles(styles)(Message);
