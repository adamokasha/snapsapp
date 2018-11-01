import axios from "axios";

export const fetchUser = async () => {
  const res = await axios.get("/api/current_user");
  return res;
};

export const registerUser = async displayName => {
  const res = await axios.post("/auth/register", { displayName });
  return res;
};
