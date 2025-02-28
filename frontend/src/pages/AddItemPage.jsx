import React from "react";
import AddItemForm from "../components/AddItemForm";
import Header from "../components/Header";

const AddItemPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-100 p-4 flex justify-center">
        <AddItemForm />
      </div>
    </div>
  );
};

export default AddItemPage;
