import { ApiPath, ContentType } from '~/libs/enums/enums.js';
import { HttpMethod } from '~/packages/http/libs/enums/enums.js';

import { PostsApiPath } from './libs/enums/enums.js';

class Post {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getAllPosts(filter) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.GET,
      query: filter
    });
  }

  getPost(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${id}`,
      {
        method: HttpMethod.GET
      }
    );
  }

  addPost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  reactPost(postId, isLike, isDislike) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          postId,
          isLike,
          isDislike
        })
      }
    );
  }
  dislikePost(postId) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          postId,
          isLike: false,
          isDislike: true
        })
      }
    );
  }
}

export { Post };
