const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split("/");
    const fileType = mimeType[1];
    const fileName = file.originalname + "." + fileType;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ["image/png", "image/jpeg", "image/jpg"];
  allowedMimetypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};
const upload = multer({ storage: diskStorage, fileFilter: fileFilter });
module.exports = upload;
