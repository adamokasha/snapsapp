import axios from "axios";

export const fetchUserPosts = async cancelToken => {
  const res = await axios.get("/api/posts/myposts/all", { cancelToken });
  return res;
};
