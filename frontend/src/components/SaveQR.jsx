import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SaveQR = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch QR code");
        }
        let data = await response.json();
        data.qrCode = data.qrCode
          ? `data:image/jpeg;base64,${data.qrCode}`
          : null;

        setItem(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Function to download QR code image
  const saveImage = () => {
    if (!item?.qrCode) {
      toast.error("No QR code available to save.");
      return;
    }

    const link = document.createElement("a");
    link.href = item.qrCode;
    link.download = `QR_Item_${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR Code saved successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer pauseOnFocusLoss={false} />
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center w-80">
        <h2 className="text-lg font-semibold mb-4">QR for Item: {item?.id}</h2>
        <img
          src={item?.qrCode || "https://placehold.co/100x100"}
          alt={`QR code for item ${item?.id}`}
          className="w-96"
        />
        <button
          onClick={saveImage}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Save Image
        </button>
      </div>
    </div>
  );
};

export default SaveQR;
