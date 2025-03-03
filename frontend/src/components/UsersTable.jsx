import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);

        const initialTypes = data.reduce((acc, user) => {
          const role = user.role ? user.role.toLowerCase() : "user";
          acc[user.id] = role;
          return acc;
        }, {});

        setSelectedType(initialTypes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleTypeChange = (userId, type) => {
    setSelectedType((prev) => ({ ...prev, [userId]: type }));
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== selectedUser.id));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) return <p className="text-center">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
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
                      value={selectedType[user.id]}
                      onChange={(e) =>
                        handleTypeChange(user.id, e.target.value)
                      }
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="inline-flex space-x-2">
                      <button className="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600 flex items-center">
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 flex items-center"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Cancel Deleting User?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
