import axios from "axios";

export const setPostContext = context => ({
  type: "SET_CONTEXT",
  payload: context
});

export const setPosts = posts => ({ type: "SET_POSTS", payload: posts });

export const clearPosts = () => ({ type: "CLEAR_POSTS" });
