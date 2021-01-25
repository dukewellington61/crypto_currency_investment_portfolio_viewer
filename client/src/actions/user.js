import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

// Load user
export const getUser = async () => {
  // if there is a token in local storage it is beeing set to the header of the axios - request
  if (localStorage.crypto_token) {
    setAuthToken(localStorage.crypto_token);
  }

  try {
    const res = await axios.get("/api/users");

    return res.data;
  } catch (err) {
    console.log(err);
  }
};
