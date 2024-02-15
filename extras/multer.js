const multer = require('multer');

const profileStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/profileImages")
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const postStorage = multer.diskStorage({
  destination: function(req, file, cb){
    if(file && file.mimetype.startsWith('image/')){
      cb(null, "public/posts/images")
    }else{

      cb(null, "public/posts/videos")
    }

  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const storyStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/storyFiles")
  },
  filename: function(req, file, cb){
    cb(null, req.user.userId + '-' + Date.now() + '-' + file.originalname);
  }
});

const highlightCoverStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/highlishtsCoverImages")
  },
  filename: function(req, file, cb){
    cb(null, req.user.userId + '-' + Date.now() + '-' + file.originalname);
  }
});

const profileUpload = multer({ storage: profileStorage });
const postUpload = multer({ storage: postStorage });
const storyUpload = multer({ storage: storyStorage });
const highlightCoverUpload = multer({ storage: highlightCoverStorage });



module.exports = {profileUpload, postUpload, storyUpload, highlightCoverUpload};