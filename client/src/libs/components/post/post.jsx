/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { useState } from 'react';

import { IconName } from '~/libs/enums/enums.js';
import { getFromNowTime } from '~/libs/helpers/helpers.js';
import { useCallback } from '~/libs/hooks/hooks.js';
import { postType } from '~/libs/prop-types/property-types.js';
import { UpdatePost } from '~/pages/thread/components/update-post/update-post.jsx';

import { IconButton } from '../icon-button/icon-button.jsx';
import { Image } from '../image/image.jsx';
import styles from './styles.module.scss';

const Post = ({
  post,
  onPostReact,
  onExpandedPostToggle,
  onSharePost,
  userId
}) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = getFromNowTime(createdAt);

  const handlePostReact = useCallback(
    (isLike, isDislike) => onPostReact(id, isLike, isDislike),
    [id, onPostReact]
  );

  const handleExpandedPostToggle = useCallback(
    () => onExpandedPostToggle(id),
    [id, onExpandedPostToggle]
  );
  const handleSharePost = useCallback(() => onSharePost(id), [id, onSharePost]);

  const [isUpdatePost, setIsUpdatePost] = useState(false);

  return (
    <div className={styles.card}>
      {image && <Image src={image.link} alt="post image" />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        <p className={styles.description}>{body}</p>
      </div>
      <div className={styles.extra}>
        <IconButton
          iconName={IconName.THUMBS_UP}
          label={likeCount}
          onClick={() => handlePostReact(true, false)}
        />
        <IconButton
          iconName={IconName.THUMBS_DOWN}
          label={dislikeCount}
          onClick={() => handlePostReact(false, true)}
        />
        <IconButton
          iconName={IconName.COMMENT}
          label={commentCount}
          onClick={handleExpandedPostToggle}
        />
        <IconButton
          iconName={IconName.SHARE_ALTERNATE}
          onClick={handleSharePost}
        />
        {user.id === userId && (
          <div
            className={
              image
                ? styles.buttonWrapperWithImage
                : styles.buttonTopRightWrapper
            }
          >
            <IconButton
              iconName={IconName.PEN_TO_SQUARE}
              onClick={() => setIsUpdatePost(true)}
            />
          </div>
        )}
      </div>
      <UpdatePost
        isUpdatePost={isUpdatePost}
        setIsUpdatePost={setIsUpdatePost}
        currentBody={body}
        currentImage={image}
        id={id}
        userId={userId}
      />
    </div>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  onPostReact: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  onSharePost: PropTypes.func.isRequired,
  userId: PropTypes.number
};

export { Post };
