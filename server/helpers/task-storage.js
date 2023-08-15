const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "task-documents");
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split("/");
    const fileType = mimeType[1];
    const fileName = file.originalname + "." + fileType;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "text/plain",
    "application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip",
    "application/vnd.rar, application/x-rar-compressed, application/octet-stream",
  ];
  allowedMimetypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};
const upload = multer({ storage: diskStorage, fileFilter: fileFilter });
module.exports = upload;
