import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, roles }) => {
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
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");

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

    // Check if role-based access is required
    if (roles) {
      const userRole = decodedToken.role;
      if (!roles.includes(userRole)) {
        return (
          <Navigate
            to="/dashboard"
            state={{
              message: "Unauthorized access.",
              type: "error",
              from: location,
            }}
            replace
          />
        );
      }
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
