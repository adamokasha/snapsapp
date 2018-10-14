import axios from "axios";

// Fetch a user's following/followers for ProfileNetwork
export const fetchFollows = async (cancelToken, userId) => {
  try {
    const { data } = await await axios.get(`/api/profile/count/${userId}`, {
      cancelToken
    });

    return data[0];
  } catch (e) {
    throw e;
  }
};
