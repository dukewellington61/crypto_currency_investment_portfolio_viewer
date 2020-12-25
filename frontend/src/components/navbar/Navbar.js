import React from "react";
import { Link } from "react-router-dom";
import AccountIcon from "./AccountIcon";

const Navbar = ({ logout, logedin }) => {
  return (
    <nav id="navbar">
      <div id="brand_container">
        <Link
          id="brand"
          className="nav-link active"
          to="/"
          style={{ fontWeight: "bold" }}
        >
          Crypto Portfolio Viewer
        </Link>
      </div>

      <div id="nav_item_container">
        {logedin && (
          <Link className="nav_items" to="/input">
            positions
          </Link>
        )}

        <Link className="nav_items" to="#">
          <AccountIcon logout={logout} logedin={logedin} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
