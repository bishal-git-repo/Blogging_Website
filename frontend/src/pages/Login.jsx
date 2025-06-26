import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import toastService from "../services/toastifyMessage";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Initialize navigate from React Router
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async(e) => {
    e.preventDefault();

    // Login logic goes here, such as authentication via API
    try {
      const response = await axiosInstance.post('/user/login', {
        email,
        password,
      });
      console.log("res-user", response.data.user);
      
      
      dispatch(setUser(response.data.user))
      
      

      // Display success message
      toastService.showMessage(response.data.message, "success"); 
      
      //redirect to the home page
      navigate('/blogs');

    } catch (error) {
      toastService.showMessage(error.response?.data?.error || 'Login failed', "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-lg text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Login;
