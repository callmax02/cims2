import React, { useState } from "react";
import { FaEdit, FaTrash, FaQrcode, FaPlus } from "react-icons/fa";

const InventoryTable = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      department: "Software Development Team",
      assetTag: "AS-5731",
      serial: "20230715-001-123",
      model: "Lenovo Yoga S730-13IML",
      status: "Assigned",
      defaultLocation: "IT Office",
      image: "Placeholder image",
    },
    {
      id: 2,
      department: "Software Development Team",
      assetTag: "AS-5731",
      serial: "20230715-001-123",
      model: "Lenovo Yoga S730-13IML",
      status: "Assigned",
      defaultLocation: "IT Office",
      image: "Placeholder image",
    },
    {
      id: 3,
      department: "Software Development Team",
      assetTag: "AS-5731",
      serial: "20230715-001-123",
      model: "Lenovo Yoga S730-13IML",
      status: "Assigned",
      defaultLocation: "IT Office",
      image: "Placeholder image",
    },
  ]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const confirmDelete = () => {
    setItems(items.filter((item) => item.id !== selectedItem.id));
    closeDeleteModal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
            <FaPlus className="mr-2" /> Add Item
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Asset Tag</th>
                <th className="border border-gray-300 p-2">Serial</th>
                <th className="border border-gray-300 p-2">Model</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Default Location</th>
                <th className="border border-gray-300 p-2">Image</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    {item.department}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.assetTag}
                  </td>
                  <td className="border border-gray-300 p-2">{item.serial}</td>
                  <td className="border border-gray-300 p-2">{item.model}</td>
                  <td className="border border-gray-300 p-2">{item.status}</td>
                  <td className="border border-gray-300 p-2">
                    {item.defaultLocation}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <img
                      src="https://placehold.co/40x40"
                      alt="Asset"
                      className="w-10 h-10 rounded-md"
                    />
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
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center"
                      >
                        <FaTrash />
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </div>

                    <div className="relative group">
                      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center">
                        <FaQrcode />
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Generate QR
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
