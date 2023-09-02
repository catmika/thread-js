import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { POSTS_PER_PAGE } from '../../pages/thread/libs/common/constants.js';
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

const initialState = {
  posts: [],
  expandedPost: null,
  hasMorePosts: true,
  count: POSTS_PER_PAGE,
  from: 0
};

const { reducer, actions, name } = createSlice({
  initialState,
  name: 'thread',
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadPosts.fulfilled, (state, action) => {
      const { posts } = action.payload;

      state.posts = posts;
      state.hasMorePosts = posts.length > 0;
      state.from = initialState.count;
    });
    builder.addCase(loadMorePosts.pending, state => {
      state.hasMorePosts = null;
    });
    builder.addCase(loadMorePosts.fulfilled, (state, action) => {
      const { posts } = action.payload;

      state.posts = [...state.posts, ...posts];
      state.hasMorePosts = posts.length > 0;
      state.from += posts.length;
    });
    builder.addCase(toggleExpandedPost.fulfilled, (state, action) => {
      const { post } = action.payload;

      state.expandedPost = post;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const { deletedPost } = action.payload;
      state.posts = state.posts.filter(post => post.id !== deletedPost.id);
    });
    builder.addMatcher(
      isAnyOf(reactPost.fulfilled, addComment.fulfilled),
      (state, action) => {
        const { posts, expandedPost } = action.payload;
        state.posts = posts;
        state.expandedPost = expandedPost;
      }
    );
    builder.addMatcher(
      isAnyOf(applyPost.fulfilled, createPost.fulfilled, updatePost.fulfilled),
      (state, action) => {
        const { post } = action.payload;

        if (post) {
          const existingIndex = state.posts.findIndex(p => p.id === post.id);
          existingIndex === -1
            ? (state.posts = [post, ...state.posts])
            : (state.posts[existingIndex] = post);
        }
      }
    );
  }
});

export { actions, name, reducer };
