import axios from "axios";

export const sendMessage = async (cancelToken, userId, title, body) => {
  const res = await axios.post(
    `/api/message/new/${userId}`,
    {
      title: title,
      body: body
    },
    { cancelToken }
  );
  return res;
};

export const fetchMessageCount = async cancelToken => {
  const res = await axios.get("/api/message/count", { cancelToken });
  return res;
};

export const fetchMessage = async (cancelToken, messageId, messagePage) => {
  const res = await axios.get(`/api/message/get/${messageId}/${messagePage}`, {
    cancelToken
  });
  return res;
};

export const submitMessageReply = async (cancelToken, id, body) => {
  const res = await axios.post(
    `/api/message/reply/${id}`,
    {
      body
    },
    { cancelToken }
  );
  return res;
};

export const fetchUnread = async (cancelToken, page) => {
  const res = await axios.get(`/api/message/unread/${page}`, { cancelToken });
  return res;
};

export const fetchAll = async (cancelToken, page) => {
  const res = await axios.get(`/api/message/all/${page}`, { cancelToken });
  return res;
};

export const fetchSent = async (cancelToken, page) => {
  const res = await axios.get(`/api/message/sent/${page}`, { cancelToken });
  return res;
};

export const deleteMessage = async (cancelToken, selected) => {
  await axios.delete(`/api/message/delete`, {
    data: { deletions: selected }
  });
};
