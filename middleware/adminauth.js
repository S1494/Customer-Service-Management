const adminAuth = (req, res, next) => {
  if () {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

module.exports = adminAuth;
