const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      default: "Ap Bokifa",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    image: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
      default: null,
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    category: {
      type: [String],
      default: ["General"],
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false, // use this to control "This week's highlights"
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
