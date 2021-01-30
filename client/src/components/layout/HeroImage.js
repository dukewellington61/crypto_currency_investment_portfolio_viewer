import React from "react";
import crypto from "../../img/crypto.svg";

const HeroImage = () => {
  return (
    <img
      src={crypto}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
      }}
      alt="image"
    />
  );
};

export default HeroImage;
