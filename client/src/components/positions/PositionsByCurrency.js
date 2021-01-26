import React, { Fragment } from "react";
import CurrencyLogos from "../layout/CurrencyLogos";
import { Link } from "react-router-dom";
// import { removePosition } from "../../actions/positions";
import { getCurrencyPositions } from "../../auxiliary/auxiliaryCryptoData";
import { useLocation } from "react-router-dom";
import { getAbbrevation } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValue } from "../../auxiliary/auxiliaryCryptoData";
import { getAmount } from "../../auxiliary/auxiliaryCryptoData";
import { getInitialValuePurchase } from "../../auxiliary/auxiliaryCryptoData";
import { getImage } from "../../auxiliary/auxiliaryCryptoData";

function PositionsByCurrency({ cryptoCurrencies, fiat, fiatSymbol }) {
  const data = useLocation();

  const transformDate = (val) => {
    const date = new Date(val);
    const day =
      date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const dateString = `${day}. ${month} ${year}`;
    return dateString;
  };

  const sortPosition = (positionsArray) =>
    positionsArray.sort(
      (a, b) => Date.parse(b.date_of_purchase) - Date.parse(a.date_of_purchase)
    );

  const getSortedPositions = () => {
    if (data.state.currency === "all_currencies") {
      return sortPosition(data.state.user.positions);
    } else {
      return sortPosition(
        getCurrencyPositions(data.state.user, data.state.currency)
      );
    }
  };

  // const deletePosition = (id) => {
  //   removePosition(id);
  // };

  return (
    <Fragment>
      <div id="toggle_view_ledger">
        <Link to="/">
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-angle-double-left"></i> back to overview
          </button>
        </Link>
      </div>
      <div style={{ display: "flex" }}>
        <CurrencyLogos
          cryptoCurrencies={cryptoCurrencies}
          currency={data.state.currency}
          origin={"OverviewTotal"}
        />
        <div style={{ marginLeft: "1rem" }}>transaction record</div>
      </div>

      <table className="table table-striped">
        <tr>
          <th></th>
          <th>transaction date</th>
          <th>amount</th>
          <th>value</th>
        </tr>
        <tbody>
          {getSortedPositions().map((position) => {
            return (
              <tr
                className="clickable"
                style={{ color: position.amount < 0 ? "red" : "green" }}
              >
                <th></th>
                <td>{transformDate(position.date_of_purchase)}</td>
                <td>
                  <img
                    className="crypto_image"
                    src={getImage(cryptoCurrencies, position.crypto_currency)}
                    alt={position.crypto_currency}
                  />
                  {position.amount}{" "}
                  {getAbbrevation(cryptoCurrencies, position.crypto_currency)}
                </td>
                <td>
                  {position[`price_${fiat.current}`].toFixed(2)}{" "}
                  {fiatSymbol.current}
                </td>
                <td>
                  {/* <div
                    className="delete_ledger_entry"
                    // onClick={() => deletePosition(position._id)}
                  >
                    <i class="fas fa-trash-alt"></i>
                  </div> */}
                </td>
              </tr>
            );
          })}
          <tr id="overview_total">
            <td>Total</td>
            <th></th>
            {data.state.currency === "all_currencies" ? (
              <td></td>
            ) : (
              <td>
                {getAmount(data.state.user, data.state.currency).toFixed(3)}{" "}
                {getAbbrevation(cryptoCurrencies, data.state.currency)}
              </td>
            )}
            {data.state.currency === "all_currencies" ? (
              <td>
                {getInitialValuePurchase(data.state.user, fiat).toFixed(2)}{" "}
                {fiatSymbol.current}
              </td>
            ) : (
              <td>
                {getInitialValue(
                  data.state.user,
                  data.state.currency,
                  fiat
                ).toFixed(2)}{" "}
                {fiatSymbol.current}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
}

export default PositionsByCurrency;
