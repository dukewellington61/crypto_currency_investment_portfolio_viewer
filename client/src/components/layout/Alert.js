import React from "react";

const Alert = ({ alert, removeAlert }) => {
  return (
    <div id="alert" className={`alert alert-${alert.type}`} role="alert">
      {/* <div id="remove_alert" onClick={removeAlert}>
        x
      </div> */}
      {alert.message}
    </div>
  );
};

export default Alert;
