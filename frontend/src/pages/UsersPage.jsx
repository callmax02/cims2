import React, { useEffect } from "react";
import UsersTable from "../components/UsersTable";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { toast, ToastContainer } from "react-toastify";

const UsersPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === "success") {
        toast.success(location.state.message);
      } else {
        toast.error(location.state.message);
      }
      // Clear the state after showing the toast
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]); // Add dependencies

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer pauseOnFocusLoss={false} autoClose={3000} />
      <Header />
      <UsersTable />
    </div>
  );
};

export default UsersPage;
