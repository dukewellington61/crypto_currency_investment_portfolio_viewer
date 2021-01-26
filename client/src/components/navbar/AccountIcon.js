import React, { Fragment } from "react";
import Menu from "./Menu";

const AccountIcon = ({ logout, logedin }) => {
  return (
    <div id="account_nav_item">
      <i className="fa fa-user auth_fa-user"></i>{" "}
      <div id="menu">
        <Menu logout={logout} logedin={logedin} />
      </div>
    </div>
  );
};

export default AccountIcon;
