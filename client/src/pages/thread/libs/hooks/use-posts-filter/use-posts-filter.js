import { createReducer } from '@reduxjs/toolkit';
import { useCallback, useReducer } from 'react';

import { PostsFilterAction } from '~/libs/enums/enums.js';

const postsFilterInitialState = {
  userId: undefined,
  isLike: false
};

const postsFilterReducer = createReducer(postsFilterInitialState, builder => {
  builder.addCase(PostsFilterAction.TOGGLE_SHOW_OWN_POSTS, (state, action) => {
    state.userId = action.payload.userId;
  });
  builder.addCase(
    PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POSTS,
    (state, action) => {
      state.isLike = action.payload.isLike;
    }
  );
});

const usePostsFilter = () => {
  const [postsFilter, dispatchPostsFilter] = useReducer(
    postsFilterReducer,
    postsFilterInitialState
  );

  const handleShowOwnPosts = useCallback(userId => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_OWN_POSTS,
      payload: {
        userId
      }
    });
  }, []);

  const handleShowLikedByOwnPosts = useCallback(isLike => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POSTS,
      payload: {
        isLike
      }
    });
  }, []);

  return { postsFilter, handleShowOwnPosts, handleShowLikedByOwnPosts };
};

export { usePostsFilter };
