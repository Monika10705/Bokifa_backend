import { useState } from "react";
import Button from "./Button";
import api from "../services/api";
import { X } from "lucide-react";

function ProductForm({ initial, onSubmit, onClose, categories = [], lockedCategory = null }) {
  const [form, setForm] = useState(() => ({
    ...initial,
    // If a category is locked (adding from category panel), pre-select it
    category: lockedCategory ? lockedCategory : initial.category || "",
  }));
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [existingImages, setExistingImages] = useState(() => {
    if (Array.isArray(initial.images) && initial.images.length > 0) {
      return initial.images;
    }

    // Support products that only have the old single image field
    if (initial.image) {
      return [
        {
          url: initial.image,
          fileId: initial.imageFileId || null,
        },
      ];
    }

    return [];
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      alert(
        `"${invalidFile.name}" is invalid. Only JPG, PNG, WEBP and GIF files up to 5MB are allowed.`
      );

      e.target.value = "";
      return;
    }

    setSelectedFiles((currentFiles) => {
      const newFiles = files.filter(
        (newFile) =>
          !currentFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size &&
              existingFile.lastModified === newFile.lastModified
          )
      );

      return [...currentFiles, ...newFiles];
    });

    // Clear the input so the admin can select the same
    // file again later if they remove it.
    e.target.value = "";
  };

  const uploadImageToImageKit = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    const response = await api.post("/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Image upload failed"
      );
    }

    return response.data;
  };

  const handleCancelImage = () => {
    setSelectedFiles([]);

    setForm((prev) => ({
      ...prev,
      image: "",
      imageFileId: null,
      images: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require at least one image for a new product
    if (existingImages.length === 0 && selectedFiles.length === 0) {
      alert("Please select at least one product image.");
      return;
    }

    try {
      setUploading(true);

      // Start with images that are already uploaded to ImageKit
      const finalImages = [...existingImages];

      // Upload only NEW images when Save is clicked
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const uploadResponse = await uploadImageToImageKit(file);

          finalImages.push({
            url: uploadResponse.imageUrl,
            fileId: uploadResponse.fileId,
          });
        }
      }

      // First image becomes the main product image
      const productData = {
        ...form,

        image: finalImages[0]?.url || "",

        imageFileId: finalImages[0]?.fileId || null,

        images: finalImages,
      };

      await onSubmit(productData);

      // Clear newly selected files after successful save
      setSelectedFiles([]);

    } catch (error) {
      console.error("Product save error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to save product"
      );
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className={inputClass}
      />

      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
          type="number"
          min="0"
          step="0.01"
          className={inputClass}
        />
        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          type="number"
          min="0"
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500 font-medium">Rating (0 – 5)</label>
        <div className="flex items-center gap-3">
          <input
            name="rating"
            type="range"
            min="0"
            max="5"
            step="1"
            value={form.rating ?? 0}
            onChange={handleChange}
            className="flex-1 accent-green-600"
          />
          <span className="text-sm font-semibold text-green-700 w-5 text-center">
            {form.rating ?? 0}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Product Images
        </label>

        {existingImages.length === 0 && selectedFiles.length === 0 ? (
          /* ─────────────────────────────────────────────
             No images selected
          ───────────────────────────────────────────── */
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-[#0d3b2e] hover:bg-green-50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#0d3b2e] transition group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L8 8m4-4l4 4M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5"
                />
              </svg>
            </div>

            <span className="text-sm font-semibold text-gray-800">
              Upload Product Images
            </span>

            <span className="mt-1 text-xs text-gray-500">
              JPG, PNG, WEBP or GIF • Max 5MB each
            </span>

            <span className="mt-4 rounded-lg bg-[#0d3b2e] px-5 py-2 text-sm font-medium text-white transition group-hover:bg-[#0a2f24]">
              Choose Images
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        ) : (
          /* ─────────────────────────────────────────────
             Existing + New Images
          ───────────────────────────────────────────── */
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {existingImages.length + selectedFiles.length} image
                  {existingImages.length + selectedFiles.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Existing images are already uploaded. New images will upload
                  when you click Save.
                </p>
              </div>

              {/* Remove all */}
              <button
                type="button"
                onClick={() => {
                  setExistingImages([]);
                  setSelectedFiles([]);

                  setForm((prev) => ({
                    ...prev,
                    image: "",
                    imageFileId: null,
                    images: [],
                  }));
                }}
                disabled={uploading}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove all
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              {/* ─────────────────────────────────────────
            EXISTING IMAGES
        ───────────────────────────────────────── */}
              {existingImages.map((image, index) => (
                <div
                  key={`existing-${image.fileId || image.url}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />

                  {/* Uploaded badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-[#0d3b2e] px-2 py-1 text-[10px] font-medium text-white shadow">
                    Uploaded
                  </div>

                  {/* Remove existing image */}
                  <button
                    type="button"
                    onClick={() => {
                      setExistingImages((currentImages) =>
                        currentImages.filter((_, i) => i !== index)
                      );
                    }}
                    disabled={uploading}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove image"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}

              {/* ─────────────────────────────────────────
            NEW LOCAL IMAGES
        ───────────────────────────────────────── */}
              {selectedFiles.map((file, index) => (
                <div
                  key={`new-${file.name}-${file.size}-${file.lastModified}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Local preview */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${file.name}`}
                    className="h-32 w-full object-cover"
                  />

                  {/* New badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-medium text-white shadow">
                    New
                  </div>

                  {/* Remove new image */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles((currentFiles) =>
                        currentFiles.filter((_, i) => i !== index)
                      );
                    }}
                    disabled={uploading}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove image"
                  >
                    <X size={15} />
                  </button>

                  {/* File info */}
                  <div className="p-2">
                    <p
                      className="truncate text-xs font-medium text-gray-700"
                      title={file.name}
                    >
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add more images */}
            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#0d3b2e] transition hover:border-[#0d3b2e] hover:bg-green-50">
              + Add More Images

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Upload status */}
            {uploading && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-[#0d3b2e]" />
                Uploading images...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category — dropdown if categories list provided, locked if lockedCategory set */}
      {lockedCategory ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-xs text-green-700 font-medium">Category:</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
            {lockedCategory}
          </span>
        </div>
      ) : categories.length > 0 ? (
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          name="category"
          placeholder="Category (comma separated)"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        />
      )}

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className={inputClass}
      />

      <div className="flex flex-col gap-2 pt-1">
        <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={Boolean(form.isActive ?? true)}
            onChange={handleChange}
          />
          <span>Active product</span>
        </label>

        <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={Boolean(form.isFeatured)}
            onChange={handleChange}
          />
          <span>Featured product</span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={uploading}
          className="flex-1 !py-2 text-sm font-medium"
        >
          {uploading ? "Uploading..." : "Save"}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 !py-2 !bg-white border border-gray-300 !text-gray-700 text-sm hover:!bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
