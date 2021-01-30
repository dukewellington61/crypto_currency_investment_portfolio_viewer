import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Fiat from "./Fiat";

const Navbar = ({ logout, logedin, setFiatCurrency }) => {
  return (
    <nav id="navbar" className="navbar navbar-dark bg-dark navbar-expand-sm">
      <Link
        id="brand"
        className="navbar-brand"
        to="/"
        style={{ fontWeight: "bold" }}
      >
        Crypto Portfolio Viewer
      </Link>

      {/* <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button> */}

      <div
        className="collapse navbar-collapse"
        id="navbarNav"
        style={{ display: "flex" }}
      >
        <ul className="navbar-nav ml-auto justify-content-center">
          {" "}
          <div style={{ display: "flex" }}>
            <li id="add_crypto" className="nav-item active ">
              {logedin && (
                <Link className="nav-link add_deduct" to="/add_crypto">
                  <button type="button" class="btn btn-secondary">
                    <div id="deduct_crypto">+</div>
                  </button>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {logedin && (
                <Link className="nav-link add_deduct" to="/deduct_crypto">
                  <button type="button" class="btn btn-secondary">
                    <div id="deduct_crypto">−</div>
                  </button>
                </Link>
              )}
            </li>

            <li className="nav-item">
              <div className="nav-link">
                <Fiat setFiatCurrency={setFiatCurrency} />
              </div>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle navbar_link_items"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-user auth_fa-user"></i>{" "}
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {logedin ? (
                  <Link
                    className="dropdown-item"
                    to="/"
                    onClick={() => logout()}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Link>
                ) : (
                  <Fragment>
                    <Link className="dropdown-item" to="/register">
                      Sign Up
                    </Link>
                    <Link className="dropdown-item" to="/login">
                      Login
                    </Link>
                  </Fragment>
                )}
              </div>
            </li>
          </div>
        </ul>
        {/* <ul className="navbar-nav ml-auto">
          <div style={{ display: "flex" }}>
            <li className="nav-item">
              <div className="nav-link">
                <Fiat setFiatCurrency={setFiatCurrency} />
              </div>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle navbar_link_items"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-user auth_fa-user"></i>{" "}
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {logedin ? (
                  <Link
                    className="dropdown-item"
                    to="/"
                    onClick={() => logout()}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Link>
                ) : (
                  <Fragment>
                    <Link className="dropdown-item" to="/register">
                      Sign Up
                    </Link>
                    <Link className="dropdown-item" to="/login">
                      Login
                    </Link>
                  </Fragment>
                )}
              </div>
            </li>
          </div>
        </ul> */}
      </div>
    </nav>
  );
};

export default Navbar;
