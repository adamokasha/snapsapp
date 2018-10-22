import {
  fetchPopular,
  fetchNew,
  fetchFollowing,
  fetchUserPosts,
  fetchUserFaves,
  searchPosts
} from "./posts";
import { fetchAlbumPostsPaginated, fetchUserAlbums } from "./albums";
import { fetchUserFollows, fetchUserFollowers, searchUsers } from "./profiles";

import store from "../store/configureStore";
import { setPosts } from "../actions/posts";
import { setAlbums } from "../actions/albums";

// Interfaces by passing down props to ScrollGrid
export const fetchForMainPage = async (
  cancelToken,
  context,
  page,
  searchTerms
) => {
  let res;
  switch (context) {
    case "popular":
      res = await fetchPopular(cancelToken, page);
      break;
    case "new":
      res = await fetchNew(cancelToken, page);
      break;
    case "following":
      res = await fetchFollowing(cancelToken, page);
      break;
    case "searchPosts":
      res = await searchPosts(cancelToken, searchTerms, page);
      break;
    case "searchUsers":
      res = await searchUsers(cancelToken, searchTerms, page);
      break;
    default:
      return (res = []);
  }

  return res;
};

// Interfaces with redux store
// ProfilePage connects to store and uses relevant state slice
export const fetchForProfilePage = async (
  cancelToken,
  context,
  page,
  user,
  albumId
) => {
  let res;

  switch (context) {
    case "userPosts":
      res = await fetchUserPosts(cancelToken, user, page);
      store.dispatch(setPosts(res.data));
      break;
    case "albumPosts":
      res = await fetchAlbumPostsPaginated(cancelToken, albumId, page);
      store.dispatch(setPosts(res.data));
      break;
    case "userFaves":
      res = await fetchUserFaves(cancelToken, user, page);
      store.dispatch(setPosts(res.data));
      break;
    case "userAlbums":
      res = await fetchUserAlbums(cancelToken, user, page);
      store.dispatch(setAlbums(res.data));
      break;
  }
};

export const fetchFollows = async (cancelToken, context, page, userId) => {
  let res;

  switch (context) {
    case "userFollows":
      res = await fetchUserFollows(cancelToken, userId, page);
      break;
    case "userFollowers":
      res = await fetchUserFollowers(cancelToken, userId, page);
      break;
  }
  return res;
};
