import axios from "axios";

export const fetchAlbumPosts = async (cancelToken, albumId) => {
  const res = await axios.get(`/api/albums/get/${albumId}`, { cancelToken });
  return res;
};

export const createAlbum = async (cancelToken, albumPosts, albumName) => {
  const res = await axios.post(
    "/api/albums",
    { albumPosts, albumName },
    { cancelToken }
  );
  return res;
};

export const updateAlbum = async (
  cancelToken,
  albumId,
  albumName,
  albumPosts
) => {
  await axios.patch(
    `/api/albums/update/${albumId}`,
    {
      albumName,
      albumPosts
    },
    { cancelToken }
  );
};

export const fetchAlbumPostsPaginated = async (cancelToken, albumId, page) => {
  const res = await axios.get(`/api/albums/full/${albumId}/${page}`, {
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
