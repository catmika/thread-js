import { createReducer } from '@reduxjs/toolkit';
import { useCallback, useReducer } from 'react';

import { PostsFilterAction } from '~/libs/enums/enums.js';

const postsFilterInitialState = {
  userId: undefined,
  isLike: undefined,
  activeBoth: undefined
};

const postsFilterReducer = createReducer(postsFilterInitialState, builder => {
  builder.addCase(PostsFilterAction.TOGGLE, (state, action) => {
    state.isLike = action.payload.isLike;
    state.userId = action.payload.userId;
    state.activeBoth = action.payload.activeBoth;
  });
});

const usePostsFilter = () => {
  const [postsFilter, dispatchPostsFilter] = useReducer(
    postsFilterReducer,
    postsFilterInitialState
  );

  const handleToggleFilter = useCallback((isLike, userId, activeBoth) => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE,
      payload: {
        isLike,
        userId,
        activeBoth
      }
    });
  }, []);

  return { postsFilter, handleToggleFilter };
};

export { usePostsFilter };
