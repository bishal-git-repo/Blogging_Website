import { useEffect, useState } from "react";
import BlogCard from "./BlogCard"; // Assuming your BlogCard component is already created
import AddBlogModal from "./AddBlogModal"; // Modal component for adding new blog
import Banner from "./Banner";
import axiosInstance from "../services/axiosInstance";
import toastService from "../services/toastifyMessage";
import socketService from "../services/socketService";
import { useDispatch } from "react-redux";
import { setLatestBlogs } from "../redux/blogSlice";

function BlogList() {
  const [blogs, setBlogs] = useState([]); // Store blogs
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const dispatch = useDispatch();

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    setIsLoading(true); // Set loading to true
    try {
      const response = await axiosInstance.get("/blog/blog-list");
      if (response && response.data?.blogs) {
        setBlogs(response.data.blogs.reverse()); // Set blogs state
        dispatch(setLatestBlogs(response.data.blogs.slice(0, 3))); // Update Redux state
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

  // Initialize WebSocket and fetch blogs on mount
  useEffect(() => {
    // Connect to the socket
    socketService.connect();

    // Listen for the "newBlogAdded" event
    socketService.on("newBlogAdded", (newBlog) => {
      // console.log("New blog received:", newBlog);
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    });
    socketService.on("deletedBlog", (deleteBlog) => {
      console.log("Deleted blog received:", deleteBlog);
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== deleteBlog._id));
    });

    // Fetch blogs initially
    fetchBlogs();

    // Clean up on unmount
    return () => {
    socketService.disconnect();
    };
  }, []);

  return (
    <>
      <Banner />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        {/* Add Blog Modal */}
        {isModalOpen && (
          <AddBlogModal closeModal={() => setIsModalOpen(false)} />
        )}

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
          Latest Blog Posts
        </h2>
        <p className="text-center text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay up-to-date with the latest trends in technology, development, and
          more. Dive deep into our articles to enhance your knowledge.
        </p>
        <div className="text-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Add New Blog
          </button>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {isLoading ? (
            <p>Loading blogs...</p>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard key={blog._id} post={blog} />
            ))
          ) : (
            <p>No Blogs Found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogList;
