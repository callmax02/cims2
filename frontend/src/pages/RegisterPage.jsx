import React, { useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { toast, ToastContainer } from "react-toastify";

const RegisterPage = () => {
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
    <div>
      <ToastContainer pauseOnFocusLoss={false} autoClose={3000} />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
