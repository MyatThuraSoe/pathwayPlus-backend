const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { sendResetCode } = require("../utils/sendmail/resetPassword");

// const cors = require("cors");
const jwt = require("jsonwebtoken");
// const cookies = require("cookie-parser");

// user ----------------------------
// user create  -----------
router.post("/register", async (req, res) => {
  let result;
  let emailExist = await User.exists({ email: req.body.email });
  if (emailExist) {
    result = {
      error: "email already exists",
    };
  } else {
    try {
      let createdUser = await User.create(req.body);
      console.log(createdUser.id);
      const access_token = jwt.sign(
        { id: createdUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "30 days" }
      );

      //for production
      res.cookie("jwt_access", access_token, {
        domain: ".vercel.app",
        httpOnly: false,
      });

      //for testing purpose
      res.cookie("jwt_access", access_token, {
        domain: "localhost",
        httpOnly: false,
      });
      result = { ...createdUser.toObject(), access_token };
    } catch (err) {
      result = {
        error: err.message,
      };
    }
  }
  res.json(result);
});

router.post("/login", async (req, res) => {
  let result;
  let user = await User.findOne({ email: req.body["email"] });
  if (user) {
    let psw_correct = await user.checkPassword(req.body["password"]);
    console.log(psw_correct);
    if (psw_correct) {
      const access_token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      //for product
      res.cookie("jwt_access", access_token, {
        domain: ".vercel.app",
        httpOnly: false,
      });

      //for testing purpose
      res.cookie("jwt_access", access_token, {
        domain: "localhost",
        httpOnly: false,
      });
      result = { ...user.toObject(), access_token };
    } else {
      result = {
        error: "password incorrect",
      };
    }
  } else {
    result = {
      error: "user not found",
    };
  }
  res.json(result);
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt_access");
  res.json({
    message: "user logged out",
  });
});

router.post("/forget-password", async (req, res) => {
  const email = req.body.email;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found in the database",
      });
    }

    // Generate a 6-digit random code
    const resetcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the user document with the code
    await User.findOneAndUpdate({ email: email }, { resetcode: resetcode });

    sendResetCode(email, resetcode);
    return res.status(200).json({
      message: "6-digit code sent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while generating the code",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    // Find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check the reset code against the code stored in the database
    if (req.body.resetCode !== user.resetCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }
    // Generate a new salt and hash the new password
    const salt = await bcrypt.genSalt();
    const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    // Update the user's password
    user.password = newHashedPassword;
    // Clear the reset code
    user.resetCode = "";
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
