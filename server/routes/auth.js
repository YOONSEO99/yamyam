/**
 * Auth Route: Handles user login and authentication logic.
 * Connects to the User model and validates credentials.
 */

const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token: "success-temp-token",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || "user",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, lastName, firstName, birthDate, nickname, role } =
      req.body;

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({
      email,
      password,
      lastName,
      firstName,
      birthDate,
      nickname,
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
