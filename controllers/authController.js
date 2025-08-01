const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const jwt = require("jsonwebtoken");


const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "user is already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new userModel(req.body);
    console.log(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "user registered successfully ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in regester API",
      error,
    });
  }
};


const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "role dosent match",
      });
    }

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "invalid Credintials",
      });
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .send({ success: true, message: "login successfully", token, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error In Login API", error });
  }
};


const currentUserController = async (req, res) => {
  try {

    const user = await userModel.findOne({ _id: req.body.userId });
    console.log("Logged in as -> " + user.role);
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };
