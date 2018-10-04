import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'

import Comment from './Comment';

const styles = theme => ({

})

export class CommentList extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      pages: [],
      isLoading: false
    }
  }

  componentDidMount() {
    // fetch post comments...
  }

  render() {
    return (
      <div>
      {this.props.comments ? (this.props.comments.map((comment, i) => {
        <Comment key={i} comment={comment} />
      })) : <Typography>Be the first to comment!</Typography> }
      </div>
    )
  }
}

export default withStyles(styles)(CommentList);