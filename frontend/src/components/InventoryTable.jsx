import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaQrcode,
  FaPlus,
  FaDownload,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import QRScannerModal from "./QRScannerModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryTable = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewQRModalOpen, setIsViewQRModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScan = (data) => {
    setFilterText(data);
  };

  // 1. Fetch items on component load
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items`);
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();

        // Convert Base64 strings to proper image URLs
        const itemsWithImages = data.map((item) => ({
          ...item,
          imageUrl: item.image ? `data:image/jpeg;base64,${item.image}` : null,
          qrCode: item.qrCode && `data:image/jpeg;base64,${item.qrCode}`,
        }));

        setItems(itemsWithImages);
        setFilteredItems(itemsWithImages);
      } catch (error) {
        console.log("1");
        navigate("/dashboard", {
          state: { message: error.message, type: "error" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 2. Helper functions for modals
  const openViewQRModal = (item) => {
    setSelectedItem(item);
    setIsViewQRModalOpen(true);
  };

  const closeViewQRModal = () => {
    setIsViewQRModalOpen(false);
    setSelectedItem(null);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  // 3. Helper function for saving QR code
  const saveQRImage = () => {
    if (!selectedItem?.qrCode) {
      navigate("/dashboard", {
        state: { message: "No QR code available to save", type: "error" },
      });

      return;
    }

    const link = document.createElement("a");
    link.href = selectedItem.qrCode;
    link.download = `QR_Item_${selectedItem.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Helper function to delete item from db
  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/items/${selectedItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        let message = errorData.message.map((e) => e).join(" ");
        throw new Error(message || "Failed to delete item");
      }

      // Remove the deleted item from the state
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setFilteredItems(
        filteredItems.filter((item) => item.id !== selectedItem.id)
      );
      navigate("/dashboard", {
        state: { message: "Item deleted successfully!", type: "success" },
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      navigate("/dashboard", {
        state: { message: error.message, type: "error" },
      });
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    const filterItems = async () => {
      setFilteredItems(
        items.filter((item) =>
          item.assetTag.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    };
    filterItems();
  }, [filterText]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          {/* Header Section */}
          <h2 className="text-xl font-semibold">Inventory Items</h2>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 ml-6 rounded hover:bg-blue-600 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              Scan QR
            </button>
            <input
              type="text"
              placeholder="Filter by Asset Tag..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border p-2 rounded-md text-sm flex-1 mx-4"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={() => {
                navigate("/addItem");
              }}
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 p-2"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 bg-gray-100 p-4 rounded shadow mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Scan QR
            </button>
            <input
              type="text"
              placeholder="Filter by Asset Tag..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border p-2 rounded-md text-sm flex-1"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center w-full"
              onClick={() => {
                navigate("/addItem");
              }}
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>
        )}
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
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">
                      {item.department}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.assetTag}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.serial}
                    </td>
                    <td className="border border-gray-300 p-2">{item.model}</td>
                    <td className="border border-gray-300 p-2">
                      {item.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.defaultLocation}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <img
                        src={
                          item.imageUrl
                            ? item.imageUrl
                            : "https://placehold.co/40x40"
                        }
                        alt="Asset"
                        className="w-10 h-10 rounded-md"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center space-x-2">
                      <div className="relative group">
                        <button
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 flex items-center"
                          onClick={() => {
                            navigate(`/editItem/${item.id}`);
                          }}
                        >
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
                        <button
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
                          onClick={() => {
                            openViewQRModal(item);
                          }}
                        >
                          <FaQrcode />
                        </button>
                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Generate QR
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scan QR Modal */}
      <QRScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScan={handleScan}
      />

      {/* View QR Code Modal */}
      {isViewQRModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button
              onClick={closeViewQRModal}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-center mb-4 font-semibold">
              QR for Item: {selectedItem.id}
            </h2>
            <img
              src={selectedItem.qrCode}
              alt={`QR Code for Item ${selectedItem.id}`}
              className="mx-auto mb-4"
            />
            <button
              className=" mx-auto bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
              onClick={() => {
                saveQRImage();
              }}
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Cancel Deleting Item?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this item?
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

export default InventoryTable;
