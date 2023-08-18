import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '~/libs/components/button/button.jsx';
import { Image } from '~/libs/components/image/image.jsx';
import { Input } from '~/libs/components/input/input.jsx';
import { Modal } from '~/libs/components/modal/modal.jsx';
import { ButtonColor, ButtonType, IconName } from '~/libs/enums/enums.js';
import { useAppForm } from '~/libs/hooks/hooks.js';
import { image as imageService } from '~/packages/image/image.js';

import { PostPayloadKey } from '../../../../../../shared/src/packages/post/post.js';
import styles from './styles.module.scss';

const handleUploadImage = file => imageService.uploadImage(file);

const UpdatePost = ({
  isUpdatePost,
  setIsUpdatePost,
  currentBody,
  currentImage
}) => {
  const { control, handleSubmit } = useAppForm({
    defaultValues: { [PostPayloadKey.BODY]: currentBody }
  });

  const [image, setImage] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentImage) {
      const { id: imageId, link: imageLink } = currentImage;
      setImage({ imageId, imageLink });
    } else {
      setImage({});
    }
  }, [currentImage]);

  const handleIsUpdatePost = useCallback(() => {
    setIsUpdatePost(false);
  }, [setIsUpdatePost]);

  const handleUpdatePost = useCallback(() => {});

  const handleUploadFile = useCallback(
    ({ target }) => {
      setIsUploading(true);
      const [file] = target.files;

      handleUploadImage(file)
        .then(({ id: imageId, link: imageLink }) => {
          setImage({ imageId, imageLink });
        })
        .catch(() => {
          // TODO: show error
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [setIsUploading]
  );

  return (
    <Modal isOpen={isUpdatePost} isCentered onClose={handleIsUpdatePost}>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <Input
          name={PostPayloadKey.BODY}
          placeholder="What is the news?"
          rows={5}
          control={control}
        />
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image
              className={styles.image}
              src={image?.imageLink}
              alt="post image"
            />
          </div>
        )}
        <div className={styles.btnWrapper}>
          <div className={styles.imgBtnWrapper}>
            <Button
              color="teal"
              isLoading={isUploading}
              isDisabled={isUploading}
              iconName={IconName.IMAGE}
            >
              <label className={styles.btnImgLabel}>
                Attach image
                <input
                  name="image"
                  type="file"
                  onChange={handleUploadFile}
                  hidden
                />
              </label>
            </Button>
            <Button
              color={ButtonColor.RED}
              isLoading={isUploading}
              isDisabled={isUploading}
            >
              Delete image
            </Button>
          </div>
          <Button
            color={ButtonColor.BLUE}
            type={ButtonType.SUBMIT}
            isLoading={isUploading}
            isDisabled={isUploading}
          >
            Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};

UpdatePost.propTypes = {
  isUpdatePost: PropTypes.bool.isRequired,
  setIsUpdatePost: PropTypes.func.isRequired,
  currentBody: PropTypes.string.isRequired,
  currentImage: PropTypes.object
};

export { UpdatePost };
