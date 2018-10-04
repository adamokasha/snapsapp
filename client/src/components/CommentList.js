import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import Comment from './Comment';

const styles = theme => ({});

export class CommentList extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      pages: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get(
        `/api/posts/comments/all/${this.props.postId}/${this.state.currentPage}`
      );
      this.setState({
        currentPage: this.state.currentPage + 1,
        pages: [...res.data]
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        {this.state.pages.length > 0 ? (
          this.state.pages.map((comment, i) => <Comment key={i} comment={comment} />)
        ) : (
          <Typography>Be the first to comment!</Typography>
        )}
      </div>
    );
  }
}

CommentList.propTypes = {
  postId: PropTypes.string
};

export default withStyles(styles)(CommentList);
