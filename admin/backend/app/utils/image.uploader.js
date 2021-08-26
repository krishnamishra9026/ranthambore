import multer from 'multer';
import utils from './index';

class ImageUploader {
  storage = multer.diskStorage({
    filename(req, file, cb) {
      const filename = `${file.fieldname}-${Date.now()}${utils.getFileExtension(
        file.originalname,
      )}`;
      cb(null, filename);
    },
  });

  fileFilter = function (req, file, cb) {
    // supported image file mimetypes
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (allowedMimes.indexOf(file.mimetype) !== -1) {
      // allow supported image files
      cb(null, true);
    } else {
      // throw error for invalid files
      const error = new Error('Invalid file type. Only jpg, png and gif image files are allowed.');
      error.code = 400;
      cb(error);
    }
  };

  upload = () => multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
  });
}
export default new ImageUploader();
