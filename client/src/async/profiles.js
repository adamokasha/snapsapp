import axios from "axios";

// Fetch a user profile in Profile
export const fetchProfile = async (cancelToken, user) => {
  const res = await axios.get(`/api/profile/get/${user}`, { cancelToken });
  return res;
};

// Update profile in Profile
export const setProfile = async (cancelToken, profile) => {
  await axios.post(
    "/api/profile/update",
    {
      profile: { ...profile }
    },
    { cancelToken }
  );
};

// Fetch a user's following/followers for ProfileNetwork
export const fetchFollows = async (cancelToken, user) => {
  const res = await axios.get(`/api/profile/count/${user}`, {
    cancelToken
  });
  return res;
};

// Follow a user
export const onFollow = async (cancelToken, userId) => {
  try {
    await axios.post(`/api/profile/follows/add/${userId}`, { cancelToken });
  } catch (e) {
    throw e;
  }
};

// Unfollow a user
export const onUnfollow = async (cancelToken, userId) => {
  await axios.delete(`/api/profile/follows/unf/${userId}`, { cancelToken });
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

export const searchUsers = async (cancelToken, searchTerms, page) => {
  const res = await axios.post(
    `/api/profile/search/${page}`,
    { searchTerms },
    { cancelToken }
  );
  return res;
};
