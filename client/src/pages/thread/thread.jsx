import InfiniteScroll from 'react-infinite-scroll-component';

import { Checkbox } from '~/libs/components/checkbox/checkbox.jsx';
import { Post } from '~/libs/components/post/post.jsx';
import { Spinner } from '~/libs/components/spinner/spinner.jsx';
import { ThreadToolbarKey, UseFormMode } from '~/libs/enums/enums.js';
import {
  useAppForm,
  useCallback,
  useDispatch,
  useEffect,
  useSelector,
  useState
} from '~/libs/hooks/hooks.js';
import { image as imageService } from '~/packages/image/image.js';
import { actions as threadActionCreator } from '~/slices/thread/thread.js';

import {
  AddPost,
  ExpandedPost,
  SharedPostLink
} from './components/components.js';
import { DEFAULT_THREAD_TOOLBAR } from './libs/common/constants.js';
import { usePostsFilter } from './libs/hooks/use-posts-filter/use-posts-filter.js';
import styles from './styles.module.scss';

const handleUploadImage = file => imageService.uploadImage(file);

const Thread = () => {
  const dispatch = useDispatch();
  const { posts, hasMorePosts, expandedPost, userId } = useSelector(state => ({
    posts: state.posts.posts,
    hasMorePosts: state.posts.hasMorePosts,
    expandedPost: state.posts.expandedPost,
    userId: state.profile.user.id
  }));

  const { postsFilter, handleToggleFilter } = usePostsFilter();

  const [sharedPostId, setSharedPostId] = useState();

  const { control, watch } = useAppForm({
    defaultValues: DEFAULT_THREAD_TOOLBAR,
    mode: UseFormMode.ON_CHANGE
  });

  const showOwnPosts = watch(ThreadToolbarKey.SHOW_OWN_POSTS);
  const showLikedByOwnPosts = watch(ThreadToolbarKey.SHOW_LIKED_BY_OWN_POSTS);

  const handlePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadPosts(filtersPayload));
    },
    [dispatch]
  );

  const handleToggle = useCallback(() => {
    let currentUserId;
    let isLike;
    let activeBoth;

    if (showOwnPosts) {
      currentUserId = userId;
    }

    if (showLikedByOwnPosts) {
      isLike = true;
      currentUserId = userId;
    }

    if (showOwnPosts && showLikedByOwnPosts) {
      activeBoth = true;
    }

    handleToggleFilter(isLike, currentUserId, activeBoth);
  }, [handleToggleFilter, showLikedByOwnPosts, showOwnPosts, userId]);

  useEffect(() => {
    handleToggle();
  }, [showOwnPosts, showLikedByOwnPosts, handleToggle]);

  useEffect(() => {
    handlePostsLoad(postsFilter);
  }, [handlePostsLoad, postsFilter]);

  const handlePostReact = useCallback(
    (postId, isLike, isDislike) =>
      dispatch(threadActionCreator.reactPost({ postId, isLike, isDislike })),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(
    id => dispatch(threadActionCreator.toggleExpandedPost(id)),
    [dispatch]
  );

  const handlePostAdd = useCallback(
    postPayload => dispatch(threadActionCreator.createPost(postPayload)),
    [dispatch]
  );

  const handleMorePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadMorePosts(filtersPayload));
    },
    [dispatch]
  );

  const handleGetMorePosts = useCallback(() => {
    handleMorePostsLoad(postsFilter);
  }, [handleMorePostsLoad, postsFilter]);

  const handleSharePost = useCallback(id => setSharedPostId(id), []);

  const handleCloseSharedPostLink = useCallback(() => setSharedPostId(), []);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost onPostAdd={handlePostAdd} onUploadImage={handleUploadImage} />
      </div>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox
            name={ThreadToolbarKey.SHOW_OWN_POSTS}
            control={control}
            label="Show only my posts"
          />
          <Checkbox
            name={ThreadToolbarKey.SHOW_LIKED_BY_OWN_POSTS}
            control={control}
            label="Show posts liked by me"
          />
        </div>
      </form>
      <div className={styles.posts}>
        <InfiniteScroll
          dataLength={posts.length}
          next={handleGetMorePosts}
          scrollThreshold={0.8}
          hasMore={hasMorePosts}
          loader={<Spinner key="0" />}
        >
          {posts.map(post => (
            <Post
              post={post}
              userId={userId}
              onPostReact={handlePostReact}
              onExpandedPostToggle={handleExpandedPostToggle}
              onSharePost={handleSharePost}
              key={post.id}
            />
          ))}
        </InfiniteScroll>
      </div>
      {expandedPost && (
        <ExpandedPost onSharePost={handleSharePost} userId={userId} />
      )}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          onClose={handleCloseSharedPostLink}
        />
      )}
    </div>
  );
};

export { Thread };
