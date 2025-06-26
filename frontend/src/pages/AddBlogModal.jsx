import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import toastService from "../services/toastifyMessage";

function AddBlogModal({ closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview to display
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      toastService.showMessage("All fields are required", "error");
      return;
    }
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
  
    console.log("Logging FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      // Use formData directly in the POST request
      const response = await axiosInstance.post("/blog", formData);
  
      // Display success message
      toastService.showMessage(response.data.message, "success");
    } catch (error) {
      toastService.showMessage(error.response?.data?.error || "Blog upload failed", "error");
    }
  
    // Reset the form after submission
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    closeModal();
  };
  



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Blog</h3>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-2"
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-2"
              required
            ></textarea>
          </div>

          {/* Image Upload Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg mt-2"
              required
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Image Preview" className="w-full h-48 object-cover rounded-lg" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBlogModal;
