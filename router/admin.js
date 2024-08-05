const adminRouter = require("express").Router();
const transporter = require("../utils/nodemailer.js");
const authSchema = require("../model/authSchema.js");
const bcrypt = require("bcryptjs");
const userAuth = require("../middleware/userauth");

adminRouter.get("/dashboard", userAuth, async (req, res) => {
  res.render("admin/dashboard.ejs");
});

adminRouter.get("/usermanagement", userAuth, async (req, res) => {
  let dataCount = [];
  let users;
  try {
    dataCount.push(await authSchema.countDocuments({}));
    dataCount.push(await authSchema.countDocuments({ status: "active" }));
    dataCount.push(dataCount[0] - dataCount[1]);

    users = await authSchema.find();
  } catch (error) {
    console.log(error);
  }
  console.log(users);
  res.render("admin/usermanagement.ejs", { dataCount, users });
});

module.exports = adminRouter;
