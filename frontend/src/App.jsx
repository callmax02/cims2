import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/addItem"
            element={
              <PrivateRoute>
                <AddItemPage />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/editItem/:id"
            element={
              <PrivateRoute>
                <EditItemPage />
              </PrivateRoute>
            }
          />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/" element={<LoginPage />} />
          <Route
            exact
            path="/users"
            element={
              <PrivateRoute roles={["admin", "superadmin"]}>
                <UsersPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
