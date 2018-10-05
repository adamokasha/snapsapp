import React from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import axios from 'axios';

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      viewing: 'unread',
      isLoading: false
    }
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/api/message/box');
    this.setState({messages: [...res.data._message]}, () => {});
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <div>
        <List>
          {this.state.messages.length > 1 ? this.state.messages.map(message => <ListItem>{message.title}</ListItem>): null }
        </List>
      </div>
    )
  }
}

export default MessageBox;