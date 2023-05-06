import React from "react";
import { Link } from "react-router-dom";
import { navLink } from "../styles";

const Navbar = () => {
  const handleClick = () => {
    //TO HANDLE JQUERY CONFLICT OF ROUTER & DATATABLE
    window.location.replace("/");
  };
  return (
    <div className="flex justify-end">
      <button
        style={navLink}
        className="mr-2"
        onClick={handleClick}
      >
        HomePage
      </button>
      <Link style={navLink} to="/saved">
        OPD List
      </Link>
    </div>
  );
};

export default Navbar;
