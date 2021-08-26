const Promise = require('bluebird');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const httpStatus = require('http-status');
const config = require('../config');

const s3Client = new S3(config.s3.credentials);

const methods = {};

methods.saveFile = function (file, fileName) {
  return new Promise((resolve, reject) => {
    s3Client.upload(
      {
        Bucket: config.s3.bucket,
        Key: fileName,
        Body: fs.createReadStream(file.path),
        ContentType: file.type,
        ContentLength: file.size,
        ACL: 'public-read',
      },
      (error, result) => {
        if (error) {
          error.code = httpStatus.PRECONDITION_FAILED;
          reject(error);
        } else {
          fs.unlink(file.path, () => { });
          resolve(result);
        }
      },
    );
  });
};

methods.deleteObject = function (fileName) {
  return new Promise((resolve, reject) => {
    s3Client.deleteObject(
      {
        Bucket: config.s3.bucket,
        Key: fileName,
      },
      error => {
        if (error) {
          error.code = httpStatus.PRECONDITION_FAILED;
          reject(error);
        } else {
          resolve(true);
        }
      },
    );
  });
};

module.exports = methods;
