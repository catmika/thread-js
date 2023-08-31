import FormData from 'form-data';

import { HttpMethod } from '#libs/packages/http/http.js';

class ImageService {
  constructor({ config, httpService, imageRepository }) {
    this._config = config;
    this._imageRepository = imageRepository;
    this._httpService = httpService;
  }

  async upload(file) {
    const formData = new FormData();

    formData.append('imagedata', file.buffer, {
      filename: file.originalname,
      knownLength: file.size
    });
    formData.append('access_token', this._config.ENV.GYAZO.ACCESS_KEY);

    const response = await this._httpService.load(
      this._config.ENV.GYAZO.UPLOAD_API_URL,
      {
        method: HttpMethod.POST,
        data: formData,
        headers: formData.getHeaders()
      }
    );

    return this._imageRepository.create({ link: response.url });
  }

  async delete(imageId) {
    const formData = new FormData();
    formData.append('access_token', this._config.ENV.GYAZO.ACCESS_KEY);

    const image = await this._imageRepository.getById(imageId);
    const parts = image.link.split('/');
    const imageUrlId = parts.at(-1).split('.')[0];

    if (!image) {
      throw new Error(`Image with id ${imageId} not found.`);
    }

    const response = await this._httpService.load(
      `${this._config.ENV.GYAZO.DELETE_API_URL}/${imageUrlId}`,
      {
        method: HttpMethod.DELETE,
        data: formData,
        headers: formData.getHeaders()
      }
    );
    await this._imageRepository.deleteById(imageId);

    return response;
  }
}

export { ImageService };
