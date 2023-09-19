import { AbstractRepository } from '#libs/packages/database/database.js';

import {
  getCommentsCountQuery,
  getReactionsQuery,
  getWhereUserIdQuery
} from './libs/helpers/helpers.js';

class PostRepository extends AbstractRepository {
  constructor({ postModel }) {
    super(postModel);
  }

  getPosts(filter) {
    const { from: offset, count: limit, userId, isLike } = filter;

    const query = this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .where(getWhereUserIdQuery(userId, isLike))
      .whereNull('deletedAt')
      .withGraphFetched('[image, user.image]')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);

    if (isLike && userId) {
      query
        .join('postReactions', 'posts.id', 'postReactions.postId')
        .where('postReactions.userId', userId)
        .where('postReactions.isLike', isLike);
    }

    return query;
  }

  getPostById(id) {
    return this.model
      .query()
      .select(
        'posts.*',
        getCommentsCountQuery(this.model),
        getReactionsQuery(this.model)(true),
        getReactionsQuery(this.model)(false)
      )
      .where({ id })
      .withGraphFetched('[comments.user.image, user.image, image]')
      .first();
  }
}

export { PostRepository };
