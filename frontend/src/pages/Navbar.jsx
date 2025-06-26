import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { clearUser } from '../redux/userSlice';
import axiosInstance from '../services/axiosInstance';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Access user data from Redux
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(clearUser()); // Clear Redux state and localStorage
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-30 backdrop-blur-md py-4 z-50 shadow-md">
      <ul className="flex justify-center items-center px-6 text-white font-semibold">
        <div className="flex space-x-6">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')} end>
              Home
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')}>
              Profile
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')}>
              Blogs
            </NavLink>
          </li>
          <li>
            <NavLink to="/social" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')}>
              Social
            </NavLink>
          </li>
        </div>

        <li ref={dropdownRef} className="relative pl-4">
          {user ? (
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-600 text-xl">👤</span>
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md text-black w-40">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={logout}>
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-black text-lg' : 'hover:text-blue-400 text-base')}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
