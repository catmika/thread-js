const getWhereUserIdQuery = (userId, isLike) => builder => {
  if (userId && !isLike) {
    builder.where('posts.userId', userId);
  }
};

export { getWhereUserIdQuery };
