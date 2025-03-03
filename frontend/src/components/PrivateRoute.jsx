import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/"
        state={{ message: "Please login.", type: "error", from: location }}
        replace
      />
    );
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Clear expired token

      return (
        <Navigate
          to="/"
          state={{
            message: "Session expired. Please login again.",
            type: "error",
            from: location,
          }}
          replace
        />
      );
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");

    return (
      <Navigate
        to="/"
        state={{
          message: "Invalid session. Please login again.",
          type: "error",
          from: location,
        }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
