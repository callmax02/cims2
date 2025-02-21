// QRScannerModal.js
import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
import { FaTimes } from "react-icons/fa";

const QRScannerModal = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          onClose();
        },
        {
          onDecodeError: (error) => {
            console.log(error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      qrScannerRef.current.start();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, [isOpen, onClose, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-4">
          <video ref={videoRef} className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
