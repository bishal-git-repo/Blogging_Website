import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import toastService from '../services/toastifyMessage';
import Banner from './Banner';

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL parameter
  const [blog, setBlog] = useState(null); // Set initial blog state as null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch blog detail from the backend
  const fetchBlog = async () => {
    setIsLoading(true); // Set loading to true
    try {
      const response = await axiosInstance.get(`/blog/blogList/${id}`);
      if (response && response.data?.blog) {
        setBlog(response.data.blog); // Set blog state with fetched blog
      } else {
        toastService.showMessage("Failed to fetch blog details", "error");
      }
    } catch (error) {
      toastService.showMessage(
        error.response?.data?.error || "Error fetching blog details",
        "error"
      );
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchBlog(); // Fetch blog data on component mount
  }, [id]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>; // Show loading state while fetching
  }

  if (!blog) {
    return <div className="text-center">Blog not found!</div>; // Handle case when blog is not found
  }
  const formatDate = (date) => {
    const options = {
      weekday: 'long', // "Wednesday"
      day: 'numeric', // "5"
      month: 'short', // "Sep"
      year: 'numeric', // "2024"
    };
  
    return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' for UK-style date format
  };
  
  // const formattedDate = formatDate('2024-12-21T12:41:26.046Z');
  

  return (
    <>
    <Banner/>
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{blog.title}</h1>
        <p className="text-lg text-gray-500">
          By <span className="font-semibold text-gray-700">{blog.author.username}</span> | {formatDate(blog.createdAt)}
        </p>
      </div>

      {/* Blog Image */}
      <div className="mb-6">
        <img src={blog.image} alt="Blog Thumbnail" className="w-full h-80 object-cover rounded-lg shadow-lg" />
      </div>

      {/* Blog Content */}
      <div className="prose max-w-none mb-8">
        <p>{blog.description}</p>
      </div>

      {/* Read More Section (Optional) */}
      <div className="text-center">
        <a href="#comments" className="text-blue-500 hover:text-blue-700 font-semibold">
          Read Comments <span className="ml-2">→</span>
        </a>
      </div>
    </div>
    </>
  );
};

export default BlogDetail;
