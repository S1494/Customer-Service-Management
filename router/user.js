const userAuth = require("../middleware/userauth");
const authSchema = require("../model/authSchema.js");
const bcrypt = require("bcryptjs");

const userRouter = require("express").Router();

userRouter.route("/").get(userAuth, (req, res, next) => {
  res.render("user/userhome.ejs");
});

userRouter.route("/logout").get((req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

userRouter.get("/changePassword", userAuth, (req, res, next) => {
  let message;
  res.render("user/changepassword.ejs", { message });
});

userRouter.post("/changePassword", userAuth, async (req, res, next) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  const email = req.session.Email;
  let message;

  try {
    // checking if inputfields are not empty
    if (!oldpassword || !newpassword || !confirmpassword) {
      throw new Error("All Fields are required");
    }

    // checking if new & confirm password is matched
    if (newpassword !== confirmpassword) {
      throw new Error("New and confimr password do not match");
    }

    // Accessing data from mongoose
    const userData = await authSchema.findOne({ email: email });
    const comparePassword = await bcrypt.compare(
      oldpassword,
      userData.password
    );

    // checking if old password is matched with DB
    if (!comparePassword) {
      throw new Error("Your current passwor is incorrect");
    }

    const encPass = await bcrypt.hash(newpassword, 10);
    await authSchema.findByIdAndUpdate(userData.id, { password: encPass });

    req.session.destroy();
    throw new Error("Password changed Successfully ");
  } catch (error) {
    message = error.message;
  }
  res.render("user/changepassword.ejs", { message });
});

userRouter.get("/profileupdate/:message", userAuth, async (req, res, next) => {
  const message = req.params.message;
  const sessEmail = req.session.Email;
  const userData = await authSchema.findOne({ email: sessEmail });
  res.render("user/profileupdate.ejs", { message, userData });
});

userRouter.post("/profileupdate/:message", userAuth, async (req, res, next) => {
  let message;
  const { fname, lname, gender } = req.body;
  const id = req.session.userId;
  const email = req.session.Email;
  console.log(id, email, fname, lname, gender);

  try {
    await authSchema.findByIdAndUpdate(id, {
      firstname: fname,
      lastname: lname,
      gender: gender,
    });
    throw new Error("Profile updated successfully");
  } catch (error) {
    console.log(error);
    message = error.message;
  }

  res.redirect(`/profileupdate/${message}`);
});

module.exports = userRouter;
