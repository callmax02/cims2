import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    assigningDepartment: "",
    type: "",
    assetTag: "",
    serial: "",
    model: "",
    status: "",
    defaultLocation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message.map((err) => err).join(" ");
        throw new Error(message || "Failed to add item");
      }

      navigate("/dashboard", {
        state: { message: "Item inserted!", type: "success" },
      });
    } catch (error) {
      navigate(location.pathname, {
        replace: true,
        state: { message: error.message, type: "error" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true); // Show the confirmation modal
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate("/dashboard"); // Navigate if user confirms
  };

  const handleCloseModal = () => {
    setShowCancelModal(false); // Close modal when user clicks "No"
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Item</h2>

        {/* Replace the department input with a select dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium">
            <span className="text-red-500">*</span> Assigning Department
          </label>
          <select
            name="assigningDepartment"
            value={formData.assigningDepartment}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={isSubmitting}
          >
            <option value="">Select Department</option>
            <option value="General Services / Facilities">
              General Services / Facilities
            </option>
            <option value="IT">IT</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            <span className="text-red-500">*</span> Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={isSubmitting}
          >
            <option value="">Select Type</option>
            <option value="Computers / Peripherals">
              Computers / Peripherals
            </option>
            <option value="Furnitures & Fixtures">Furnitures & Fixtures</option>
            <option value="Cabinets / Enclosures">Cabinets / Enclosures</option>
            <option value="Electronic Appliances">Electronic Appliances</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <span className="text-red-500">*</span> Asset Tag
            </label>
            <input
              type="text"
              name="assetTag"
              value={formData.assetTag}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              <span className="text-red-500">*</span> Serial
            </label>
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <span className="text-red-500">*</span> Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              <span className="text-red-500">*</span> Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            <span className="text-red-500">*</span> Default Location
          </label>
          <input
            type="text"
            name="defaultLocation"
            value={formData.defaultLocation}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-1/2 mr-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="w-1/2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-lg font-semibold mb-4">Cancel Adding Item?</p>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItemForm;
