import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { logout } from "../../../../../MERN webshop/client/src/actions/auth";
// import { connect } from "react-redux";

const Menu = ({ logedin, logout }) => {
  // console.log(logedin);
  return logedin ? (
    <div id="navbar_menu">
      <Link className="navbar_menu_text" to="/" onClick={() => logout()}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </Link>
    </div>
  ) : (
    <div id="navbar_menu">
      <Link className="navbar_menu_text" to="/register">
        Sign Up
      </Link>
      <Link className="navbar_menu_text" to="/login">
        Login
      </Link>
    </div>
  );
};

export default Menu;
