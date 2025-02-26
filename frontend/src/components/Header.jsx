import React, { useState } from "react";
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

// const Header = ({ user, onSignOut }) => {
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = { name: "John Doe", role: "ADMIN" };

  const handleSignOut = () => {
    console.log("User signed out");
    // Add sign-out logic here (e.g., clear JWT, redirect)
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
          {user?.role === "ADMIN" && (
            <Link
              to="/users"
              className="flex items-center text-gray-700 hover:text-blue-500 space-x-2"
            >
              <FaUsers /> <span>Users</span>
            </Link>
          )}
          <Link
            to="/items"
            className="flex items-center text-gray-700 hover:text-blue-500 space-x-2"
          >
            <FaBox /> <span>Items</span>
          </Link>

          {/* User Dropdown (State-Based) */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="text-2xl" />
              <span className="font-medium">{user?.name}</span>
              {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 space-x-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUser /> <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 space-x-2"
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
          {user?.role === "ADMIN" && (
            <Link
              to="/users"
              className="flex items-center text-gray-700 py-2 space-x-2"
            >
              <FaUsers /> <span>Users</span>
            </Link>
          )}
          <Link
            to="/items"
            className="flex items-center text-gray-700 py-2 space-x-2"
          >
            <FaBox /> <span>Items</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center text-gray-700 py-2 space-x-2"
          >
            <FaUser /> <span>My Profile</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-700 py-2 w-full text-left space-x-2"
          >
            <FaSignOutAlt /> <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
