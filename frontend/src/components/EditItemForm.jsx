import React, { useState } from "react";

const EditItemForm = ({ onEdit }) => {
  const [formData, setFormData] = useState({
    department: "IT Department",
    assetTag: "AT-12345",
    serial: "SN-987654",
    model: "Dell Latitude 5400",
    status: "Assigned",
    defaultLocation: "HQ Office",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/40x40"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(formData); // Pass updated data to parent component
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Item</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Asset Tag</label>
            <input
              type="text"
              name="assetTag"
              value={formData.assetTag}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Serial</label>
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Default Location</label>
          <input
            type="text"
            name="defaultLocation"
            value={formData.defaultLocation}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
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
          className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Edit Item
        </button>
      </form>
    </div>
  );
};

export default EditItemForm;
