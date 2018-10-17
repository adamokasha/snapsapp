import axios from "axios";

export const fetchUserPosts = async cancelToken => {
  const res = await axios.get("/api/posts/myposts/all", { cancelToken });
  return res;
};

// Fetches a single post w/o comments (in FullPostPage)
export const fetchSinglePost = async (cancelToken, postId) => {
  const res = await axios.get(`/api/posts/single/${postId}`, { cancelToken });
  return res;
};

export const fetchPostComments = async (cancelToken, postId, page) => {
  const res = await axios.get(`/api/posts/comments/all/${postId}/${page}`, {
    cancelToken
  });
  return res;
};

export const addComment = async (cancelToken, postId, commentBody) => {
  await axios.post(
    `/api/posts/comments/add/${postId}`,
    {
      commentBody
    },
    { cancelToken }
  );
};
