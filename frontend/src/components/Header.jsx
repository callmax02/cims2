import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUsers,
  FaBox,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          CIMS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Link
              to="/users"
              className="flex items-center hover:text-blue-500 space-x-2"
            >
              <FaUsers /> <span>Users</span>
            </Link>
          )}
          <Link
            to="/dashboard"
            className="flex items-center hover:text-blue-500 space-x-2"
          >
            <FaBox /> <span>Items</span>
          </Link>

          {/* User Dropdown (State-Based) */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:text-blue-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="text-2xl" />
              <span>{user?.name}</span>
              {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 space-x-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUser /> <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 space-x-2"
                >
                  <FaSignOutAlt /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 p-4 mt-2 rounded-lg shadow space-y-3">
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Link to="/users" className="flex items-center py-2 space-x-2">
              <FaUsers /> <span>Users</span>
            </Link>
          )}
          <Link to="/items" className="flex items-center py-2 space-x-2">
            <FaBox /> <span>Items</span>
          </Link>
          <Link to="/profile" className="flex items-center py-2 space-x-2">
            <FaUser /> <span>My Profile</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center py-2 w-full text-left space-x-2"
          >
            <FaSignOutAlt /> <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
