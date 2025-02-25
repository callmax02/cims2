import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/dashboard" element={<DashboardPage />} />
          <Route exact path="/addItem" element={<AddItemPage />} />
          <Route exact path="/editItem/:id" element={<EditItemPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="/users" element={<UsersPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
