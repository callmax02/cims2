import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/dashboard" element={<DashboardPage />} />
          <Route exact path="/addItem" element={<AddItemPage />} />
          <Route exact path="/editItem/:id" element={<EditItemPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
