import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import HeroUnit from '../components/HeroUnit';
import ImageGrid from '../components/ImageGrid';
import Feed from '../components/Feed';
import { fetchPosts } from '../actions/posts';

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      morePagesAvailable: true,
      isFetching: false,
      pages: this.props.posts || []
    };

    // Prevent loadImages 'this' context being window
    const loadImages = this.loadImages.bind(this);
    window.onscroll = function() {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        loadImages();
      }
    };
  }

  loadImages = async () => {
    const { posts } = this.props;
    if (!this.state.morePagesAvailable || this.state.isFetching) {
      return;
    }
    // If last array in posts has length < 12 return
    if (posts[posts.length - 1].length < 12) {
      return this.setState({ morePagesAvailable: false });
    }

    this.setState({ isFetching: true });
    await this.props.fetchPosts(this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage + 1,
      pages: [posts],
      isFetching: false
    });
  };

  async componentDidMount() {
    this.setState({ isFetching: true });
    await this.props.fetchPosts(this.state.currentPage);
    this.setState({
      pages: [this.props.posts],
      currentPage: this.state.currentPage + 1,
      isFetching: false
    });
    this.state;
  }

  
  render() {
    const loaderStyles = {
      margin: '16px auto',
      display: 'block'
    }
    return (
      <React.Fragment>
        <HeroUnit />
        <Feed>
          {this.state.pages.map((page) => {
            return page.map(post => <ImageGrid imageData={post} />);
          })}
          {this.state.isFetching ? (
            <CircularProgress style={loaderStyles} size={50} />
          ) : null}
        </Feed>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

export default connect(
  mapStateToProps,
  { fetchPosts }
)(LandingPage);
