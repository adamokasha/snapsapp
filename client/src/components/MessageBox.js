import React from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import axios from 'axios';

export class MessageBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: [],
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
      
      </div>
    )
  }
}