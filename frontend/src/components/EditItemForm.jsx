import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assigningDepartment: "",
    type: "",
    subType: "",
    serial: "",
    model: "",
    status: "",
    defaultLocation: "",
    qrCode: null,
  });

  const [isDisabled, setIsDisabled] = useState(true);
  const [qrPreview, setQrPreview] = useState("https://placehold.co/40x40");
  const [qrCodeText, setQrCodeText] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const generateAssetTag = (assigningDepartment, type, subType, itemId) => {
    const departmentCodes = {
      "General Services / Facilities": "GS",
      IT: "IT",
    };
    const typeCodes = {
      "Computers / Peripherals": "CO",
      "Furnitures & Fixtures": "FU",
      "Cabinets / Enclosures": "CA",
      "Electronic Appliances": "EL",
    };

    const departmentCode = assigningDepartment
      ? departmentCodes[assigningDepartment] || "<Assigning Department Code>"
      : "<Assigning Department Code>";

    const typeCode = type ? typeCodes[type] || "<Type Code>" : "<Type Code>";

    const subTypePart = subType ? subType.toUpperCase() : "<SubType>";

    const currentDate = new Date();
    const yy = currentDate.getFullYear().toString().slice(-2);
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const datePart = yy + mm;

    const itemIdPart = String(itemId).padStart(4, "0");

    return `CMX-${departmentCode}-${datePart}-${typeCode}-${subTypePart}-${itemIdPart}`;
  };

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          let message = errorData.message.map((e) => e).join(" ");
          throw new Error(message || "Failed to fetch item details");
        }
        const data = await response.json();

        setFormData({
          assigningDepartment: data.assigningDepartment || "",
          type: data.type || "",
          subType: data.subType || "",
          serial: data.serial || "",
          model: data.model || "",
          status: data.status || "",
          defaultLocation: data.defaultLocation || "",
          qrCode: data.qrCode || "",
        });

        setQrCodeText(data.assetTag);

        setIsDisabled(false);

        if (data.qrCode) {
          setQrPreview(`data:image/jpeg;base64,${data.qrCode}`);
        }
      } catch (err) {
        navigate(location.pathname, {
          replace: true,
          state: { message: err.message, type: "error" },
        });
      } finally {
        setIsDisabled(false);
      }
    };

    fetchItem();
  }, [id]);

  // Set QR code & text
  useEffect(() => {
    const newAssetTag = generateAssetTag(
      formData.assigningDepartment,
      formData.type,
      formData.subType,
      id
    );
    setQrCodeText(newAssetTag);
  }, [formData.assigningDepartment, formData.type, formData.subType, id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let message = errorData.message.map((e) => e).join(" ");
        throw new Error(message || "Failed to update item");
      }

      navigate("/dashboard", {
        state: { message: "Item edited!", type: "success" },
      });
    } catch (err) {
      navigate(location.pathname, {
        replace: true,
        state: { message: err.message, type: "error" },
      });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold mb-4 text-center"> Edit Item</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Asset Tag</label>
          <input
            type="text"
            name="assetTag"
            value={qrCodeText}
            className="w-full border rounded p-2"
            disabled
          />
        </div>

        {/* // Replace the department input with a select dropdown */}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
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
        <div className="mb-4">
          <label className="block text-sm font-medium">
            <span className="text-red-500">*</span> Subtype
          </label>
          <input
            type="text"
            name="subType"
            value={formData.subType}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={isDisabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Serial</label>
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled={isDisabled}
            />
          </div>
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
              disabled={isDisabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
              disabled={isDisabled}
            />
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
              disabled={isDisabled}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">QR Code</label>
          {qrCodeText ? (
            <div className="flex justify-center mt-5">
              <QRCodeCanvas value={qrCodeText} size={120} />
            </div>
          ) : (
            <div className="flex justify-center mt-5">
              <img
                src={qrPreview}
                alt="QR Code Preview"
                className="w-40 h-40 rounded shadow object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-1/2 mr-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            disabled={isDisabled}
          >
            Update
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
