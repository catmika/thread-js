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
    const { from: offset, count: limit, userId, isLike, activeBoth } = filter;

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
        .join('postReactions as pr1', 'posts.id', 'pr1.postId') // Alias as pr1
        .where('pr1.userId', userId)
        .where('pr1.isLike', isLike);
    }

    if (activeBoth) {
      query
        .where('posts.userId', userId)
        .join('postReactions as pr2', 'posts.id', 'pr2.postId') // Alias as pr2
        .where('pr2.userId', userId)
        .where('pr2.isLike', isLike);
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
