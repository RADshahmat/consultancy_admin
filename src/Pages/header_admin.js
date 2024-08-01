import "../Styles/header.css";

import React from "react";
import axiosInstance from "../Auth/AxiosInstance";

const Header = () => {
  const handleLogout = async () => {
    localStorage.removeItem("token1");
    localStorage.removeItem("dashboardPermission");
    localStorage.removeItem("dashboardPermission1");

    try {
      await axiosInstance.post("/logout");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}/logo2.png`} alt="Logo" />
      </div>
      <div className="logout-container">
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
