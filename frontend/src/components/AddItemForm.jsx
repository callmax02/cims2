import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    department: "",
    assetTag: "",
    serial: "",
    model: "",
    status: "",
    defaultLocation: "",
    image: "", // Stores Base64-encoded image
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove prefix
        setFormData((prev) => ({ ...prev, image: base64String }));
        setImagePreview(reader.result); // Keep full Base64 for preview
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Failed to load image");
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item");
      }

      navigate("/dashboard", {
        state: { message: "Item inserted!", type: "success" },
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer pauseOnFocusLoss={false} />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Item</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            <span className="text-red-500">*</span> Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={isSubmitting}
          />
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

        <div className="mb-4">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            disabled={isSubmitting}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
