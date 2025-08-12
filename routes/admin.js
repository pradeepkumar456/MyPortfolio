const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require("../models/admin.js");
const { isLoggedIn, redirectIfLoggedIn } = require("../middleware.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");

// 👉 GET: Change Password Form
router.get('/change-password', isLoggedIn, (req, res) => {
  res.render('admin/changePassword', {
    error: req.flash('error'),
    success: req.flash('success')
  });
});


// 👉 POST: Change Password
router.post('/change-password', isLoggedIn, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate new and confirm password match
  if (newPassword !== confirmPassword) {
    req.flash('error', 'New passwords do not match');
    return res.redirect('/pradeepkumar/admin/change-password');
  }

  try {
    const admin = await Admin.findById(req.session.adminId); // or use req.user

    if (!admin) {
      req.flash('error', 'Admin not found');
      return res.redirect('/pradeepkumar/admin/login');
    }

    // passport-local-mongoose method
    admin.changePassword(oldPassword, newPassword, (err) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Old password incorrect or update failed');
        return res.redirect('/pradeepkumar/admin/change-password');
      }

      req.flash('success', 'Password changed successfully');
      res.redirect('/pradeepkumar/admin/dashboard');
    });

  } catch (err) {
    console.error('Error during password change:', err);
    req.flash('error', 'Something went wrong');
    res.redirect('/pradeepkumar/admin/change-password');
  }
});


// 👉 GET: Login page
router.get('/', redirectIfLoggedIn, (req, res) => {
  res.render('admin/login.ejs');
});

// 👉 POST: Login
router.post('/login',redirectIfLoggedIn,(req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/pradeepkumar/admin');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // ✅ Store adminId manually in session
      req.session.adminId = user._id;
       

      req.flash('success', 'Logged in successfully');
      return res.redirect('/pradeepkumar/admin/dashboard');
    });
  })(req, res, next);
});

// 👉 GET: Dashboard
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('routes/dashboard.ejs', {
    admin: req.user,
    success: req.flash('success')
  });
});

// 👉 GET: Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/pradeepkumar/admin');
  });
});

// Get User Messages
router.get("/message",isLoggedIn, async (req, res) => {
   let allusers = await User.find({});
//    console.log(allusers);
    res.render("routes/messages.ejs", {allusers});
});


// Post User Messages
//  router.post("/message", async (req, res) => {
//   const { name, email, mobileNo, city, message } = req.body;

//   try {
//     const user = new User({
//       name:name,
//       email: email,
//       mobileNo: mobileNo,
//       city: city,
//       message: message,
//     });

//     const newUser = await user.save();

//     req.flash("success", "Thank You , Message send successfully!");
//     // console.log(newUser);
//     res.redirect("/");
//   } catch (error) {
//     req.flash("error", "Error occurred while sending message.");
//     console.log(error);
//     res.redirect("/");
//   }
// });


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.log('❌ Mailer Error:', error);
//   } else {
//     console.log('✅ Mailer Ready to Send');
//   }
// });

router.post("/message", async (req, res) => {
  const { name, email, mobileNo, city, message } = req.body;

  try {
    // Save user message in DB
    const user = new User({ name, email, mobileNo, city, message });
    await user.save();

    // Send email to admin
    await transporter.sendMail({
      from: `"Pradeep Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMobile No: ${mobileNo}\nCity: ${city}\nMessage: ${message}`,
    });

    // Send confirmation email to user (if different from admin)
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      await transporter.sendMail({
        from: `"Pradeep Kumar" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thanks for contacting me',
        text: `Hi ${name},\nThanks for reaching out. I will reply soon.\n Regards,\nPradeep Kumar`,
      });
    }

    req.flash("success", "Thank You, message sent successfully!");
    res.redirect("/");
  } catch (error) {
    console.error('❌ Error:', error);
    req.flash("error", "Error occurred while sending message.");
    res.redirect("/");
  }
});


// Delete User Message
router.post("/message/:id",isLoggedIn, async (req, res) =>{
    const {id} = req.params;
   let deletedUser =  await User.findByIdAndDelete(id);
    if (!deletedUser) {
         return res.status(404).send("User not found");
    }
    req.flash('success', 'Message deleted successfully!');
    res.redirect("/pradeepkumar/admin/message");
});


module.exports = router;
