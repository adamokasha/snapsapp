const path = require("path");
const AWS = require("aws-sdk");
const uuid = require("uuid");
const multer = require("multer");
const multerS3 = require("multer-s3");
const mongoose = require("mongoose");

const Post = mongoose.model("Post");
const keys = require("../config/keys");
const requireRegistration = require("../middlewares/requireRegistration");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  endpoint: "s3.amazonaws.com",
  signatureVersion: "v4",
  region: "us-east-1"
});

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  storage: multerS3({
    s3,
    bucket: "img-share-kasho",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, `${req.user.id}/${uuid()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});

module.exports = app => {
  app.post(
    "/api/upload",
    requireRegistration,
    upload.single("image"),
    async (req, res) => {
      try {
        let data = JSON.parse(req.body.data);
        const { title, tags, description } = data;
        const post = await new Post({
          _owner: req.user.id,
          title,
          title_lower: title,
          description,
          createdAt: Date.now(),
          // ! key and other file props available on req.file/files
          imgUrl: req.file.key,
          tags
        });
        await post.save();
        res
          .status(200)
          .send({ success: "Post has been added!", postData: post });
      } catch (e) {
        res.status(200).send({
          error:
            "Could not add post. Please check html form input and upload file."
        });
      }
    }
  );

  app.delete("/api/delete", async (req, res) => {
    try {
      const { img: imgUrl, id: postId } = req.query;
      const userId = imgUrl.split("/")[0];
      console.log("postId: ", postId);
      console.log("imgUrl: ", imgUrl);

      // Check if user owns post
      if (req.user.id === userId) {
        await Post.findByIdAndDelete(postId);
        const params = {
          Bucket: "img-share-kasho",
          Key: `${imgUrl}`
        };
        await s3.deleteObject(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send({ success: "Post deleted" });
          }
        });
      } else {
        return res
          .status(401)
          .send({ error: "You are not authorized to delete this post." });
      }
    } catch (e) {
      console.log(e);
    }
  });
};
