import Banner from './Banner';
import BlogCard from './BlogCard';
import BlogImage1 from '../assets/blog1.gif';
import BlogImage2 from '../assets/blog2.jpg';
import BlogImage3 from '../assets/nature.jpg';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function Home() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding React Hooks',
      description: 'A deep dive into React hooks, useState, useEffect, and more!',
      image: BlogImage1,
    },
    {
      id: 2,
      title: 'JavaScript ES6 Features',
      description: 'Exploring the latest features in ES6 and beyond.',
      image: BlogImage2,
    },
    {
      id: 3,
      title: 'Frontend vs Backend',
      description: 'What’s the difference between frontend and backend development?',
      image: BlogImage3,
    },
  ];

  
  const [blogs, setBlogs] = useState([]);
  const data = useSelector((state) => state.blog.blogs);
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    setBlogs(data);
  }, [data]);

  return (
    <>
      <Banner />
      <div className="p-8 bg-gradient-to-r from-slate-100 via-sky-100 to-sky-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center mb-6 transform hover:scale-105 transition-transform duration-300">
          Latest Blog Posts
        </h2>
        <p className="text-center text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay up-to-date with the latest trends in technology, development, and more. Dive deep into our articles to enhance your knowledge and skillset.
        </p>
        {
          user? <div className="flex flex-wrap justify-around space-x-1 space-y-4">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
          :
        <div className="flex flex-wrap justify-around space-x-1 space-y-4">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
        }
      </div>
    </>
  );
}

export default Home;