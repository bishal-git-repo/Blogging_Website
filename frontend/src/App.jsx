import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blogs from './pages/BlogList';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './services/PrivateRoute';
import BlogDetail from './pages/blogDetail';
import Profile from './pages/Profile';
import Chat from './pages/social/Chat';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "New Title"; // Change the title
  }, []); 
  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      <Routes>
        //public route
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login/>} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/profile' element={<Profile/>}/>

        //private route
        <Route path='/blog-detail/:id' element={<PrivateRoute element={<BlogDetail />}/>}/>
        <Route path="/blogs" element={<PrivateRoute element={<Blogs />}/>} />
        <Route path='/social' element={<PrivateRoute element={<Chat />}/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;