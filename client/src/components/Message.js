import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';


const styles = theme => ({

})

export const Message = (props) => {
  return (
    <div>
      <List>
        <ListItem>
          <Avatar src={props.message._from.profilePhoto} />
          <ListItemText>{props.message.body}</ListItemText>
          {props.message.replies.map(reply => (
            <ListItem>
            <Avatar src={reply._owner.profilePhoto} />
            <ListItemText
              primary={reply.body}
            />
            </ListItem>
          ))}
        </ListItem>
      </List>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.object
}

export default withStyles(styles)(Message)