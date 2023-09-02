import {
  addComment,
  applyPost,
  createPost,
  deletePost,
  loadMorePosts,
  loadPosts,
  reactPost,
  toggleExpandedPost,
  updatePost
} from './actions.js';
import { actions } from './thread.slice.js';

const allActions = {
  ...actions,
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  updatePost,
  deletePost,
  toggleExpandedPost,
  reactPost,
  addComment
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
