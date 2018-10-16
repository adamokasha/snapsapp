import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";

import NavBar from "../components/NavBar";
import FullPost from "../components/FullPost";

export class FullPostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.location.state ? this.props.location.state.post : null
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.location.state) {
      try {
        const res = await axios.get(
          `/api/posts/single/${this.props.match.params.id}`
        );
        return this.setState({ post: res.data }, () => {});
      } catch (e) {
        console.log(e);
      }
    }
    this.setState({ post: this.props.location.state.post });
  }

  componentDidUpdate(prevProps) {
    // Case of uploading new post in modal while FullPost is mounted
    if (
      this.props.location.state &&
      this.props.location.state.post !== prevProps.location.state.post
    ) {
      this.setState({ post: this.props.location.state.post }, () => {});
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.post && <FullPost post={this.state.post} />}
      </div>
    );
  }
}

FullPostPage.propTypes = {
  location: PropTypes.object
};

export default withRouter(FullPostPage);
