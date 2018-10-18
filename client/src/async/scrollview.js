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

export const fetchScrollViewData = async (
  cancelToken,
  context,
  user,
  userId,
  albumId,
  searchTerms,
  page
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
    case "userPosts":
      res = await fetchUserPosts(cancelToken, user, page);
      break;
    case "albumPosts":
      res = await fetchAlbumPostsPaginated(cancelToken, albumId, page);
      break;
    case "userFaves":
      res = await fetchUserFaves(cancelToken, user, page);
      break;
    case "userAlbums":
      res = await fetchUserAlbums(cancelToken, user, page);
      break;
    case "userFollows":
      res = await fetchUserFollows(cancelToken, userId, page);
      break;
    case "userFollowers":
      res = await fetchUserFollowers(cancelToken, userId, page);
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
