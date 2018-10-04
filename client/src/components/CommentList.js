import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Comment from './Comment';

const styles = theme => ({

})

export class Comment extends React.Component {
  componentDidMount() {
    // fetch post comments...
  }

  render() {
    return (
      <div>
      {this.props.comments.map((comment, i) => {
        <Comment key={i} comment={comment} />
      })}
      </div>
    )
  }
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired
}

export default withStyles(styles)(CommentList);