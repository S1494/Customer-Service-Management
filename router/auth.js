const authRouter = require("express").Router();
const transporter = require("../utils/nodemailer.js");
const authSchema = require("../model/authSchema.js");
const bcrypt = require("bcryptjs");

authRouter.get("/login", (req, res) => {
  let message;
  res.render("auth/login.ejs", { message });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let message;

  try {
    if (!email && !password) {
      throw new Error("All fields are mandatory");
    }

    const userData = await authSchema.findOne({ email: email });

    if (userData == null) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    req.session.isAuth = true;
    req.session.Email = email;
    req.session.userId = userData.id;
    if (userData.role == "admin") {
      res.redirect(`http://localhost:8080/admin/dashboard`);
    } else {
      res.redirect(`http://localhost:8080/`);
    }
  } catch (error) {
    message = error.message;
    console.log(message);
  }
  res.render("auth/login.ejs", { message });
});

authRouter.get("/forgetpassword", (req, res) => {
  let message;
  res.render("auth/forgot.ejs", { message });
});

authRouter.post("/forgetpassword", async (req, res) => {
  let email = req.body.email;
  isEmailExist = await authSchema.findOne({ email: email });
  const id = isEmailExist.id;
  console.log(id);

  try {
    if (!isEmailExist) {
      throw new Error("Email not found");
    }
    console.log("smtp connected Sending Email to: ", email);

    await transporter.sendMail({
      from: "loxigems@gmail.com",
      to: email,
      subject: "Forgot Password mail my website",
      text: "click link to reset password",
      html: `http://localhost:8080/auth/changepassword/${id}`,
    });

    console.log("mailsent");
    message = "Forget password email sent";
  } catch (error) {
    message = error.message;
  }

  res.render("auth/forgot.ejs", { message });
});

authRouter.get("/changepassword/:id", (req, res) => {
  const message = null;
  res.render("auth/changepassword.ejs", { message });
});

authRouter.post("/changepassword/:id", async (req, res) => {
  const { newpassword, confirmpassword } = req.body;
  const id = req.params.id;
  let message;
  try {
    if (!newpassword || newpassword !== confirmpassword) {
      throw new Error("Confirm password doesn't match");
    } else {
      let encpassword = await bcrypt.hash(newpassword, 10);
      await authSchema.findByIdAndUpdate(id, { password: encpassword });
      message = "Password successfully Updated";
      res.render("auth/changepassowrdmessage.ejs", { message });
    }
  } catch (error) {
    message = error.message;
  }

  res.render("auth/changepassword.ejs", { message });
});

authRouter.get("/createaccount", async (req, res) => {
  let message;
  res.render("auth/createaccountform.ejs", { message });
});

authRouter.post("/createaccount", async (req, res) => {
  let message;
  const { fname, lname, email, password, dob, gender } = req.body;

  const isEmailExistawait = authSchema.findOne({ email: email });

  try {
    if (!fname && !lname && !email && !password && !dob && !gender) {
      throw new Error(" All fields are compulsory");
    }

    const newpassword = await bcrypt.hash(password, 10);
    console.log(newpassword);

    const newaccount = await new authSchema({
      firstname: fname,
      lastname: lname,
      email: email,
      password: newpassword,
      dob: dob,
      gender: gender,
    });
    newaccount.save();

    message = " Account successfully Created";
    const id = newaccount.id;

    console.log("smtp connected Sending Email to: ", email);

    await transporter.sendMail({
      from: "loxigems@gmail.com",
      to: email,
      subject: "new account varify link",
      text: "click link to Varify account",
      html: `<b>http://localhost:8080/auth/verifylink/${id}<b>`,
    });
    console.log("mailsent");
  } catch (error) {
    message = error.message;
    console.log(error);
  }
  res.render("auth/createaccountform.ejs", { message });
});

authRouter.get("/verifylink/:id", async (req, res) => {
  const id = req.params.id;
  let message;

  try {
    await authSchema.findByIdAndUpdate(id, { status: "active" });
    message = "Account has been verifyed";
  } catch (error) {
    message = error.message;
  }
  res.render("auth/activemessage.ejs", { message });
});

module.exports = authRouter;
