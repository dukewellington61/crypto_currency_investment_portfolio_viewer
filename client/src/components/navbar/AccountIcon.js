import React, { Fragment } from "react";
import Menu from "./Menu";

const AccountIcon = ({ logout, logedin }) => {
  return (
    <div id="account_nav_item">
      account
      <div id="menu">
        <Menu logout={logout} logedin={logedin} />
      </div>
    </div>
  );
};

export default AccountIcon;
