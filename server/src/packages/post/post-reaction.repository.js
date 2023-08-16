import { AbstractRepository } from '#libs/packages/database/database.js';

class PostReactionRepository extends AbstractRepository {
  constructor({ postReactionModel }) {
    super(postReactionModel);
  }

  async getPostReaction(userId, postId) {
    return await this.model
      .query()
      .select()
      .where({ userId })
      .andWhere({ postId })
      .withGraphFetched('[post]')
      .first();
  }

  async getReactionCount(postId) {
    const likeCount = await this.model
      .query()
      .count()
      .where({ postId, isLike: true })
      .first();

    const dislikeCount = await this.model
      .query()
      .count()
      .where({ postId, isDislike: true })
      .first();

    return {
      likeCount: likeCount.count,
      dislikeCount: dislikeCount.count
    };
  }
}

export { PostReactionRepository };
