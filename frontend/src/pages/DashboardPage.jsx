import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InventoryTable from "../components/InventoryTable";
import Header from "../components/Header";

const DashboardPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === "success") {
        toast.success(location.state.message);
      } else {
        toast.error(location.state.message);
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer pauseOnFocusLoss={false} autoClose={3000} />
      <Header />
      <InventoryTable />
    </div>
  );
};

export default DashboardPage;
