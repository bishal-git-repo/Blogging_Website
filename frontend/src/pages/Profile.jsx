import { useSelector } from 'react-redux';
import EditBlogModal from './EditBlogModal'; // Import EditBlogModal
import DeleteBlogModal from './DeleteBlogModal'; // Import DeleteBlogModal
import { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import toastService from '../services/toastifyMessage';
import socketService from '../services/socketService';

const Profile = () => {
  const user = useSelector((state) => state.user.user); // Access user from Redux state
  const [selectedBlog, setSelectedBlog] = useState(null); // Store selected blog for editing/deleting
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state
  const [Blogs, setBlogs] = useState([]); // Store blogs

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== blog._id));
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/blog/blog-list");
      if (response && response.data?.blogs) {
        setBlogs(response.data.blogs.reverse()); // Set blogs state
        // dispatch(setLatestBlogs(response.data.blogs.slice(0, 3))); // Update Redux state
      } else {
        toastService.showMessage("Failed to fetch blog list", "error");
      }
    } catch (error) {
      toastService.showMessage(
        error.response?.data?.error || "Error fetching blog list",
        "error"
      );
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    // Connect to the socket
    socketService.connect();

    // Listen for the "newBlogAdded" event
    socketService.on("editedBlog", (newBlog) => {
      console.log("New blog received:", newBlog);
      setBlogs((prevBlogs) => {
        const index = prevBlogs.findIndex((blog) => blog._id === newBlog._id);
        if (index !== -1) {
          prevBlogs[index] = newBlog;
        }
        return [...prevBlogs];
      });
    });

    // Fetch blogs initially
    fetchBlogs();

    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="bg-white/70 mt-8 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full sm:w-3/4 lg:w-1/2 ">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-pink-400 shadow-lg overflow-hidden">
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            {user?.username || 'Guest'}
          </h1>
          <p className="text-lg text-gray-600 italic">
            {user?.email || 'Email not available'}
          </p>
        </div>

        {/* Blogs Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Blogs</h2>
          <div className="space-y-6">
            {Blogs.length > 0 ? (
              Blogs.filter((blog) => blog.author === user._id).map((blog, index) =>  (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Blog Image */}
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  {/* Blog Title */}
                  <h3 className="text-lg font-semibold text-gray-700">
                    {blog.title}
                  </h3>
                  {/* Blog Description */}
                  <p className="text-gray-600 mt-2">{blog.description}</p>
                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                You have not created any blogs yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && selectedBlog && (
        <EditBlogModal
          closeModal={() => setIsEditModalOpen(false)}
          blog={selectedBlog}
        />
      )}

      {isDeleteModalOpen && selectedBlog && (
        <DeleteBlogModal
          closeModal={() => setIsDeleteModalOpen(false)}
          blog={selectedBlog}
        />
      )}
    </div>
  );
};

export default Profile
