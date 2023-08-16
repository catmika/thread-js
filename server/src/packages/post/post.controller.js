import {
  Controller,
  ControllerHook
} from '#libs/packages/controller/controller.js';
import { HttpCode, HttpMethod } from '#libs/packages/http/http.js';
import {
  NotificationSocketEvent,
  SocketNamespace
} from '#libs/packages/socket/socket.js';

import { PostsApiPath } from './libs/enums/enums.js';

class PostController extends Controller {
  #postService;

  constructor({ apiPath, postService }) {
    super({ apiPath });
    this.#postService = postService;

    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.getOnes
    });
    this.addRoute({
      method: HttpMethod.GET,
      url: PostsApiPath.$ID,
      [ControllerHook.HANDLER]: this.getById
    });
    this.addRoute({
      method: HttpMethod.POST,
      url: PostsApiPath.ROOT,
      [ControllerHook.HANDLER]: this.create
    });
    this.addRoute({
      method: HttpMethod.PUT,
      url: PostsApiPath.REACT,
      [ControllerHook.HANDLER]: this.react
    });
  }

  getOnes = request => this.#postService.getPosts(request.query);

  getById = request => this.#postService.getById(request.params.id);

  create = async (request, reply) => {
    const post = await this.#postService.create(request.user.id, request.body);

    request.io
      .of(SocketNamespace.NOTIFICATION)
      .emit(NotificationSocketEvent.NEW_POST, post); // notify all users that a new post was created
    return reply.status(HttpCode.CREATED).send(post);
  };

  react = async request => {
    const userId = request.user.id;
    const { postId, isLike, isDislike } = request.body;
    const post = await this.#postService.getById(postId);
    const existingReaction = await this.#postService.getPostReaction(
      userId,
      postId
    );

    const reactionResult = await this.#postService.setReaction(userId, {
      postId,
      isLike,
      isDislike
    });

    if (
      ((isLike && !existingReaction?.isLike) ||
        (isDislike && !existingReaction?.isDislike)) &&
      post.userId !== userId
    ) {
      const eventType = isLike
        ? NotificationSocketEvent.LIKE_POST
        : NotificationSocketEvent.DISLIKE_POST;

      request.io
        .of(SocketNamespace.NOTIFICATION)
        .to(`${post.userId}`)
        .emit(eventType, {
          postId: post.id,
          likeCount: reactionResult.likeCount,
          dislikeCount: reactionResult.dislikeCount
        });
    }
    return reactionResult;
  };
}

export { PostController };
