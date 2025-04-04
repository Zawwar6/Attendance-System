import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import MarkAttendance from "./pages/MarkAttendance";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
