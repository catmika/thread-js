import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '~/libs/components/button/button.jsx';
import { Modal } from '~/libs/components/modal/modal.jsx';
import { ButtonColor } from '~/libs/enums/enums.js';
import { actions as threadActionCreator } from '~/slices/thread/thread.js';

import styles from './delete-post.module.css';

const DeletePost = ({
  isDeletePost,
  setIsDeletePost,
  id,
  userId,
  onExpandedPostToggle
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = useCallback(() => {
    setIsDeletePost(false);
  }, [setIsDeletePost]);

  const handleIsDeletePost = useCallback(() => {
    dispatch(threadActionCreator.deletePost({ id, userId })).then(() => {
      setIsDeletePost(false);
      onExpandedPostToggle();
    });
  }, [dispatch, setIsDeletePost, id, userId, onExpandedPostToggle]);

  return (
    <Modal isOpen={isDeletePost} isCentered onClose={handleCloseModal}>
      <div className={styles.deleteContainer}>
        <h2>Do you want to delete this post?</h2>
        <Button color={ButtonColor.RED} onClick={handleIsDeletePost}>
          Delete post
        </Button>
        <Button color={ButtonColor.BLUE} onClick={handleCloseModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

DeletePost.propTypes = {
  isDeletePost: PropTypes.bool.isRequired,
  setIsDeletePost: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired
};

export { DeletePost };
