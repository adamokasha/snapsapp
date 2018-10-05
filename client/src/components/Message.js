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
    <Paper>
      <List>
        <ListItem>
          <Avatar src={props._from.profilePhoto} />
          <ListItemText>{props.body}</ListItemText>
        </ListItem>
      </List>
    </Paper>
  )
}

Message.propTypes = {
  // title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  replies: PropTypes.array
}

export default withStyles(styles)(Message)