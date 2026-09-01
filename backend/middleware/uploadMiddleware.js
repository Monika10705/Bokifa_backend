const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    console.log("FILE RECEIVED:");
    console.log("Name:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const extension = file.originalname.toLowerCase().split(".").pop();

    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

    if (
      allowedTypes.includes(file.mimetype) ||
      allowedExtensions.includes(extension)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = upload;