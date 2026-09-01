const imagekit = require("../config/imagekit");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/bokifa",
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = {
  uploadImage,
};