import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState({});

  useEffect(() => {
    // Mock data for users
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", type: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", type: "User" },
    ];
    setUsers(mockUsers);

    const initialTypes = {};
    mockUsers.forEach((user) => {
      initialTypes[user.id] = user.type;
    });
    setSelectedType(initialTypes);
  }, []);

  const handleTypeChange = (userId, type) => {
    setSelectedType((prev) => ({ ...prev, [userId]: type }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name={`type-${user.id}`}
                      value={selectedType[user.id] || "User"}
                      onChange={(e) =>
                        handleTypeChange(user.id, e.target.value)
                      }
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">Super Admin</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2 flex justify-center space-x-2">
                    <div className="relative group">
                      <button className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 flex items-center">
                        <FaEdit />
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </div>

                    <div className="relative group">
                      <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center">
                        <FaTrash />
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
