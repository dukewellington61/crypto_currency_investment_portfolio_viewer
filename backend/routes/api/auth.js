const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   POST api/user/signup
// @desc    Register user and update current shopping cart with user_id
// @access  Public
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // See if the user exists
    let user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({ errors: { msg: "User already exists" } });
    }

    // Create new user
    user = new User({
      email,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return json web token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ errors: { msg: "Server error" } });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({ errors: { msg: "Invalid credentials" } });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: { msg: "Invalid credentials" } });
    }

    // Return json web token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ errors: { msg: "Server error" } });
  }
});

module.exports = router;
