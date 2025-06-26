import React from "react";
import axiosInstance from "../services/axiosInstance";
import toastService from "../services/toastifyMessage";

const DeleteBlogModal = ({ closeModal, blog }) => {
  const handleDelete = async() => {
    // Call API to delete the blog
    try {
      const response = await axiosInstance.delete(`/blog/deleteBlog/${blog._id}`);
      if (response && response.data?.message) {
        toastService.showMessage(response.data.message, "success");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toastService.showMessage(
        error.response?.data?.error || "Error deleting blog",
        "error"
      );
    }
    console.log("Deleting blog", blog);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-semibold mb-4">Delete Blog</h3>
        <p>Are you sure you want to delete this blog?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBlogModal;
