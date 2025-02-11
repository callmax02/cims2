import React from "react";
import SaveQR from "../components/SaveQR";
import qrImage from "../assets/sampleQR.png";

const SaveQRPage = () => {
  return <SaveQR itemId={1} qrSrc={qrImage} />;
};

export default SaveQRPage;
