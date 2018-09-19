const AWS = require('aws-sdk');
const uuid = require('uuid');

const keys = require('../config/keys');
const requireAuth = require('../middlewares/requireAuth');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  endpoint: 's3.amazonaws.com',
  signatureVersion: 'v4',
  region: 'us-east-1'
});

module.exports = app => {
  app.get('/api/upload', requireAuth, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: keys.bucketName,
        ContentType: 'image/jpeg',
        Key: key
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });
};
