import React from "react";
import EditItemForm from "../components/EditItemForm";
import Header from "../components/Header";

const EditItemPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-100 p-4 flex justify-center">
        <EditItemForm />
      </div>
    </div>
  );
};

export default EditItemPage;
