import axios from "axios";

export const fetchAlbumPosts = async albumId => {
  const res = await axios.get(`/api/albums/get/${albumId}`);
  return res;
};

export const createAlbum = async (albumPosts, albumName) => {
  await axios.post("/api/albums", { albumPosts, albumName });
};

export const updateAlbum = async (albumId, albumName, albumPosts) => {
  await axios.patch(`/api/albums/update/${albumId}`, {
    albumName,
    albumPosts
  });
};
