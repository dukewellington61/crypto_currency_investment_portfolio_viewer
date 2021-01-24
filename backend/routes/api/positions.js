const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   POST api/positions
// @desc    Create a position
// @access  Private
router.post("/", auth, async (req, res) => {
  console.log("post");
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Denormalization
    // stores positions objects in users collection
    const position = {
      crypto_currency: req.body.crypto_currency,
      amount: req.body.amount,
      price_EUR: req.body.price_EUR,
      price_USD: req.body.price_USD,
      price_GBP: req.body.price_GBP,
      date_of_purchase: req.body.date_of_purchase,
    };

    user.positions.unshift(position);

    await user.save();

    res.json(position);
  } catch (err) {
    res.status(500).json({ errors: { msg: err.message } });
  }
});

// @route   POST api/delete/:currency
// @desc    Remove all positions of a specified currency
// @access  Private
router.delete("/:currency", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    user.positions = user.positions.filter(
      (position) => position.crypto_currency !== req.params.currency
    );

    await user.save();
    res.json(user.positions);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errors: { msg: err.message } });
  }
});

module.exports = router;
