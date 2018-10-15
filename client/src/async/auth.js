import axios from "axios";

export const fetchUser = async () => {
  const res = await axios.get("/api/current_user");
  console.log(res);
  return res;
};

// export const registerUser = async displayName => {
//   try {
//     const res = await axios.post("/auth/register", { displayName });
//     return res;
//   } catch (e) {
//     return e.response.error;
//   }
// };

export const registerUser = async displayName => {
  const res = await axios.post("/auth/register", { displayName });
  return res;
};
