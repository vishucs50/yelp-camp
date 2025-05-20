const User = require("../models/user");

module.exports.renderRegisterUser = (req, res) => {
  res.render("users/register");
};
module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err)
        {
         return next(err);
        } 
      req.flash("success", "welcome back");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
module.exports.renderLoginUser = (req, res) => {
  res.render("users/login");
};
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};