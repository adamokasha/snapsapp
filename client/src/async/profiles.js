import axios from "axios";

// Fetch a user profile in Profile
export const fetchProfile = async (cancelToken, user) => {
  try {
    const res = await axios.get(`/api/profile/get/${user}`, { cancelToken });
    console.log(res);
    return res;
  } catch (e) {
    throw e;
  }
};

// Update profile in Profile
export const setProfile = async (cancelToken, profile) => {
  try {
    await axios.post(
      "/api/profile/update",
      {
        profile: { ...profile }
      },
      { cancelToken }
    );
  } catch (e) {
    throw e;
  }
};

// Fetch a user's following/followers for ProfileNetwork
export const fetchFollows = async (cancelToken, userId) => {
  try {
    const { data } = await axios.get(`/api/profile/count/${userId}`, {
      cancelToken
    });

    return data[0];
  } catch (e) {
    throw e;
  }
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
  try {
    await axios.delete(`/api/profile/follows/unf/${userId}`, { cancelToken });
  } catch (e) {
    throw e;
  }
};
