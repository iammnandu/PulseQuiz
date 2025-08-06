import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar"; 

const Userlayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Userlayout;