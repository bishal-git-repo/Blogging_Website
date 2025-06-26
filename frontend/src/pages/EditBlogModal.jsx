import React, { useState } from "react";
import toastService from "../services/toastifyMessage";
import { useDispatch } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { updateBlog } from "../redux/blogSlice";

const EditBlogModal = ({ closeModal, blog }) => {
  const [editFormData, setEditFormData] = useState({
    title: blog.title,
    description: blog.description,
    image: blog.image, // Initial image URL or file
  });

  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(blog.image); // Show initial image

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        image: file, // Store the file object
      }));
      setImagePreview(URL.createObjectURL(file)); // Update preview with selected image
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editFormData.title);
    formData.append("description", editFormData.description);
    formData.append("image", editFormData.image); // Attach the image file

    try {
      const response = await axiosInstance.put(`/blog/editBlog/${blog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response && response.data?.updatedBlog) {
        // Dispatch updated blog to Redux store
        dispatch(updateBlog(response.data.updatedBlog));
        toastService.showMessage(response.data.message, "success");
      }
    } catch (error) {
      console.error("Error editing blog:", error);
      toastService.showMessage(
        error.response?.data?.error || "Error editing blog",
        "error"
      );
    }
    closeModal(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] sm:w-[600px] md:w-[700px] lg:w-[800px] max-h-[90%] overflow-auto">
        {/* Modal Width and Height Adjustment for Larger Screens */}
        <h3 className="text-2xl font-semibold mb-6">Edit Blog</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title Input */}
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Description Input */}
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />

            {/* Image Upload Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg focus:outline-none hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg focus:outline-none hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
