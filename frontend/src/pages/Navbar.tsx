import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-lg font-bold hover:text-blue-200 transition-colors"
        >
          Hi
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;