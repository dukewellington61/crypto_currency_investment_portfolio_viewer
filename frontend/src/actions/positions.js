import axios from "axios";

export const createPosition = async (formData) => {
  console.log("formData");
  console.log(formData);
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
