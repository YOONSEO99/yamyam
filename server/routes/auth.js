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
        nickname:user.nickname,
        birthDate: user.birthDate,
        bio: user.bio,
        role: user.role || "user",
        isInstructor: user.isInstructor,
        isAdmin: user.isAdmin
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

router.put("/update/:id", async(req,res)=>{
  try{
    const userId = req.params.id;

    const {firstName, lastName, nickname, birthDate, bio, isInstructor} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {firstName, lastName, nickname, birthDate, bio, isInstructor},
      {new:true}
    );

    if(!updatedUser){
      return res.status(404).json({message:"User not found"});
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user:{
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        nickname: updatedUser.nickname,
        birthDate: updatedUser.birthDate,
        bio:updatedUser.bio,
        role:updatedUser.role,
        isInstructor: updatedUser.isInstructor
      }
    });

  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"});
  }
});

module.exports = router;
