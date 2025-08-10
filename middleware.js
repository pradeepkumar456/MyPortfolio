  module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Admin login required');
  res.redirect('/pradeepkumar/admin');
};


module.exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/pradeepkumar/admin/dashboard');
  }
  next();
};

// module.exports.isAdmin = (req, res, next) => {
//   if (req.session.isAdmin) {
//     return next();
//   }
//   req.flash("error", "Unauthorized access");
//   res.redirect("/");
// }
