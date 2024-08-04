const userAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

module.exports = userAuth;
