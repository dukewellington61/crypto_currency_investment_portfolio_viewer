import React from "react";

const Fiat = ({ setFiatCurrency }) => {
  return (
    <div className="input-group-append" onChange={(e) => setFiatCurrency(e)}>
      <select className="btn btn-outline-secondary">
        <option value="EUR">€</option>
        <option value="USD">$</option>
      </select>
    </div>
  );
};

export default Fiat;
