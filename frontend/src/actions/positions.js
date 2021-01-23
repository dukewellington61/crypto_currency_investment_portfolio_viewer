import axios from "axios";

export const createPosition = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/positions", formData, config);

    return res;
  } catch (err) {
    return err;
  }
};

export const removePositions = async (crypto_currency) => {
  try {
    const res = await axios.delete(`/api/positions/${crypto_currency}`);
    return res;
  } catch (err) {
    return err;
  }
};

// export const removePosition = async (id) => {
//   try {
//     const res = await axios.delete(`/api/position/${id}`);
//   } catch (err) {
//     return err;
//   }
// };
