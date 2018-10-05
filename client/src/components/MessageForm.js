import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import axios from 'axios';

const styles = theme => ({
  root: {
    width: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: `${theme.palette.background.paper}`,
    display: 'flex',
    flexDirection: 'column',
    transform: 'translate(-50%, -50%)'
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  }
});

export class MessageForm extends React.Component {
  constructor() {
    super();

    this.state = {
      title: '',
      body: ''
    };
  }

  onTitleChange = e => {
    this.setState({ title: e.target.value }, () => {});
  };

  onBodyChange = e => {
    this.setState({ body: e.target.value }, () => {});
  };

  onSubmit = async e => {
    try {
      e.preventDefault();
      await axios.post(`/api/message/new/${this.props.userId}`, {
        title: this.state.title,
        body: this.state.body
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={classes.root}>
        <OutlinedInput
          placeholder="Title"
          type="text"
          onChange={this.onTitleChange}
        />
        <OutlinedInput multiline rows={3} onChange={this.onBodyChange} />
        <Button type="submit" variant="contained">
          <SendOutlinedIcon className={classes.leftIcon} />
          Send
        </Button>
      </form>
    );
  }
}

MessageForm.propTypes = {
  displayName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

export default withStyles(styles)(MessageForm);
