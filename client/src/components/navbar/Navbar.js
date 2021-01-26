import React from "react";
import { Link } from "react-router-dom";
import AccountIcon from "./AccountIcon";
import Fiat from "./Fiat";

const Navbar = ({ logout, logedin, setFiatCurrency }) => {
  return (
    <nav id="navbar" className="navbar navbar-expand-lg">
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
          <Link className="nav_items" to="/add_crypto">
            <div id="add_crypto">+</div>
          </Link>
        )}

        {logedin && (
          <Link className="nav_items" to="/deduct_crypto">
            <div id="deduct_crypto">−</div>
          </Link>
        )}

        <Link className="nav_items" to="#">
          <AccountIcon logout={logout} logedin={logedin} />
        </Link>

        <div>
          <Fiat setFiatCurrency={setFiatCurrency} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
