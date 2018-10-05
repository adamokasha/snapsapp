import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

const styles = theme => ({
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

  render() {
    <form>
      <OutlinedInput placeholder="Title" type="text" />
      <OutlinedInput multiline rows={3} />
      <Button variant="contained">
        <SendOutlinedIcon className={classes.leftIcon} />
        Send
      </Button>
    </form>;
  }
}

MessageForm.propTypes = {
  displayName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

export default withStyles(styles)(MessageForm);
