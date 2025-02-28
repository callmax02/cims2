import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === "success") {
        toast.success(location.state.message);
      } else {
        toast.error(location.state.message);
      }

      // Clear the state by navigating to the same route without state
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <div>
      <ToastContainer pauseOnFocusLoss={false} autoClose={3000} />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
