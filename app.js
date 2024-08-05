const express = require("express");
const authRouter = require("./router/auth");
const app = express();
const session = require("express-session");
const userRouter = require("./router/user");
const adminRouter = require("./router/admin");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "shubham",
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use(express.static("public"));

module.exports = app;
