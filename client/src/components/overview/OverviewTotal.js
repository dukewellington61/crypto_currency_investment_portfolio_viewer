import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SparkLine from "../charts/SparkLine";
import Twenty4hChangeInvestmentTotal from "./Twenty4hChangeInvestmentTotal";
import CurrencyLogos from "../layout/CurrencyLogos";
import { duration7Days } from "../../auxiliary/auxiliaryDateData";

const OverviewTotal = ({
  user,
  cryptoCurrencies,
  exchangeRates,
  totalPurchase,
  currentValueTotal,
  prevCurrentValueTotal,
  fiat,
  prevFiat,
  fiatSymbol,
  get24hourChangeTotal,
  handleClick,
}) => {
  // both hooks are neccessary to persist change currentValueTotal so it survives re mounting of this component
  const [currentValueTotalChange, setCurrentValueTotalChange] = useState(
    sessionStorage.getItem("change")
  );

  useEffect(() => {
    // makes sure that change current total is not re - calculated when user switches fiat
    if (fiat.current === prevFiat.current) {
      const change = (
        currentValueTotal - prevCurrentValueTotal.current
      ).toFixed(2);
      // makes sure that session storage and state are only updated if it is not a re mount
      if (!isNaN(change) && prevCurrentValueTotal.current !== 0) {
        sessionStorage.setItem("change", change);
        setCurrentValueTotalChange(change);
      }
    }
  }, [currentValueTotal]);

  useEffect(() => {
    calcChange();
  }, [fiat.current]);

  // const [greaterThan7Days, setGreaterThan7Days] = useState(false);

  // useEffect(() => {
  //   setGreaterThan7Days(duration7Days(user));
  // }, []);

  // converts change current total into the selected fiat
  const calcChange = async () => {
    // switch from EUR to USD
    if (fiat.current === "USD" && prevFiat.current === "EUR") {
      if (exchangeRates.data) {
        setCurrentValueTotalChange(
          (currentValueTotalChange * exchangeRates.data.rates.USD).toFixed(2)
        );
      }
    }

    // switch from USD to EUR
    if (fiat.current === "EUR" && prevFiat.current === "USD") {
      if (exchangeRates.data) {
        setCurrentValueTotalChange(
          (
            currentValueTotalChange *
            (1 / exchangeRates.data.rates.USD)
          ).toFixed(2)
        );
      }
    }
  };

  return (
    <tr id="overview_total">
      {/* currencys and logos*/}
      <Link
        to={{
          pathname: "/position",
          // current_price: totalPurchase.toFixed(2),
          state: {
            currency: "all_currencies",
            user: user,
          },
        }}
      >
        {/* <th scope="row"></th> */}
        <td>
          {" "}
          <div style={{ display: "flex", justifyContent: "start" }}>
            <CurrencyLogos
              cryptoCurrencies={cryptoCurrencies}
              currency={"all_currencies"}
              origin={"OverviewTotal"}
            />
          </div>
        </td>
      </Link>

      <td>Total Portfolio</td>

      {/* initial value */}
      <td
        className="clickable"
        onClick={
          duration7Days(user) &&
          (() => handleClick("initial_value", "all_currencies"))
        }
      >
        {totalPurchase.toFixed(2)} {fiatSymbol.current}
      </td>

      {/* current value */}
      <td
        className="clickable"
        onClick={
          duration7Days(user) &&
          (() => handleClick("current_value", "all_currencies"))
        }
      >
        <div className="change_container">
          <div>
            {currentValueTotal.toFixed(2)} {fiatSymbol.current}
          </div>
          <div
            className="change_value"
            style={{
              color: currentValueTotalChange >= 0 ? "green" : "red",
            }}
          >
            {currentValueTotalChange && currentValueTotalChange !== 0
              ? currentValueTotalChange
              : 0}{" "}
            {fiatSymbol.current}
          </div>
        </div>

        <Twenty4hChangeInvestmentTotal
          get24hourChangeTotal={get24hourChangeTotal}
          fiatSymbol={fiatSymbol}
        />
      </td>

      {/* profit */}
      <td
        className="clickable"
        onClick={
          duration7Days(user) &&
          (() => handleClick("balance", "all_currencies"))
        }
      >
        {(currentValueTotal - totalPurchase).toFixed(2)} {fiatSymbol.current}
      </td>

      {/* roi */}
      <td
        className="clickable"
        onClick={
          duration7Days(user) && (() => handleClick("roi", "all_currencies"))
        }
      >
        <div className="x_container">
          <div>
            {((currentValueTotal * 100) / totalPurchase - 100).toFixed(0)}%
          </div>
          <div className="x_value">
            ({(currentValueTotal / totalPurchase).toFixed(1)}
            x)
          </div>
        </div>
      </td>

      {/* sparkline */}
      <td>
        <SparkLine user={user} cryptoCurrencies={cryptoCurrencies} />
      </td>
    </tr>
  );
};

export default OverviewTotal;
