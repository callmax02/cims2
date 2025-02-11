import React from "react";

export default function SaveQR({ itemId, qrSrc }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center w-80">
        <h2 className="text-lg font-semibold mb-4">QR for Item: {itemId}</h2>
        <img src={qrSrc} alt={`QR code for item ${itemId}`} className="w-96" />
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600">
          Save Image
        </button>
      </div>
    </div>
  );
}
