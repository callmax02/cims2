import React, { useEffect } from "react";
import UsersTable from "../components/UsersTable";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const UsersPage = () => {
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
      <UsersTable />
    </div>
  );
};

export default UsersPage;
