class PostService {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getPostReaction(userId, postId) {
    return this._postReactionRepository.getPostReaction(userId, postId);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike = true, isDislike = false }) {
    if (isLike && isDislike) {
      throw new Error('Cannot set both isLike and isDislike to true.');
    }

    const existingReaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );

    if (existingReaction) {
      (isLike && existingReaction.isLike) ||
      (isDislike && existingReaction.isDislike)
        ? await this._postReactionRepository.deleteById(existingReaction.id)
        : await this._postReactionRepository.updateById(existingReaction.id, {
            isLike,
            isDislike
          });
    } else {
      await this._postReactionRepository.create({
        userId,
        postId,
        isLike,
        isDislike
      });
    }

    return await this._postReactionRepository.getReactionCount(postId);
  }
}

export { PostService };
