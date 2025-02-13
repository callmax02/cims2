import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: "",
    assetTag: "",
    serial: "",
    model: "",
    status: "",
    defaultLocation: "",
    image: null,
  });

  const [isDisabled, setIsDisabled] = useState(true);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/40x40"
  );
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
        const data = await response.json();

        setFormData({
          department: data.department || "",
          assetTag: data.assetTag || "",
          serial: data.serial || "",
          model: data.model || "",
          status: data.status || "",
          defaultLocation: data.defaultLocation || "",
          image: data.image || "",
        });

        setIsDisabled(false);

        if (data.image) {
          setImagePreview(`data:image/jpeg;base64,${data.image}`);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsDisabled(false);
      }
    };

    fetchItem();
  }, [id]);

  // Handle input changes
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

  // Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      navigate("/dashboard", {
        state: { message: "Item edited!", type: "success" },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer pauseOnFocusLoss={false} autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        encType="multipart/form-data"
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
            disabled={isDisabled}
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
              disabled={isDisabled}
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
              disabled={isDisabled}
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
              disabled={isDisabled}
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
              disabled={isDisabled}
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
            disabled={isDisabled}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            disabled={isDisabled}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded shadow"
            />
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-1/2 mr-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            disabled={isDisabled}
          >
            Edit Item
          </button>
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="w-1/2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Cancel Editing Item?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
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

export default EditItemForm;
