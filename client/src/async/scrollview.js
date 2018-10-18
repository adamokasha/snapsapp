import axios from "axios";

export const fetchPopular = async (cancelToken, page) => {
  const res = await axios.get(`/api/posts/popular/${page}`, { cancelToken });
  return res;
};

export const fetchNew = async (cancelToken, page) => {
  const res = axios.get(`/api/posts/new/${page}`, { cancelToken });
  return res;
};

export const fetchFollowing = async (cancelToken, page) => {
  const res = await axios.get(`/api/posts/follows/${page}`, { cancelToken });
  return res;
};

export const fetchUserPosts = async (cancelToken, user, page) => {
  const res = await axios.get(`/api/posts/user/all/${user}/${page}`, {
    cancelToken
  });

  return res;
};

export const fetchAlbumPosts = async (cancelToken, albumId, page) => {
  const res = await axios.get(`/api/albums/full/${albumId}/${page}`, {
    cancelToken
  });
  return res;
};

export const fetchUserFaves = async (cancelToken, user, page) => {
  const res = await axios.get(`/api/posts/user/faves/${user}/${page}`, {
    cancelToken
  });
  return res;
};

export const fetchUserAlbums = async (cancelToken, user, page) => {
  const res = await axios.get(`/api/albums/all/${user}/${page}`, {
    cancelToken
  });
  return res;
};

export const fetchUserFollows = async (cancelToken, userId, page) => {
  const res = await axios.get(`/api/profile/follows/${userId}/${page}`, {
    cancelToken
  });
  return res;
};

export const fetchUserFollowers = async (cancelToken, userId, page) => {
  const res = await axios.get(`/api/profile/followers/${userId}/${page}`, {
    cancelToken
  });
  return res;
};

export const searchPosts = async (cancelToken, searchTerms, page) => {
  const res = await axios.post(
    `/api/posts/search/${page}`,
    {
      searchTerms
    },
    { cancelToken }
  );
  return res;
};

export const searchUsers = async (cancelToken, searchTerms, page) => {
  const res = await axios.post(
    `/api/profile/search/${page}`,
    { searchTerms },
    { cancelToken }
  );
  return res;
};
