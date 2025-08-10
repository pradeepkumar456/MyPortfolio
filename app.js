 if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
};
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const Admin = require("./models/admin.js");
const passport = require("passport");
const adminRoutes = require("./routes/admin.js");
const userRoutes = require("./routes/user.js");
const blogRoutes = require("./routes/blog.js");
const ExpressError = require("./utils/ExpressError.js");


// const  = "mongodb://127.0.0.1:27017/Pradeep"; // or use Atlas URI
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

require("./config/passport.js")(passport);

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret : process.env.SECRET ,
  },
  touchAfter : 24 * 60 * 60, // Update session every 24 hours
});

store.on("error", (e) => {
  console.log("Session Store Error", e);
}); 

app.use(
  session({
    store: store,
    secret: process.env.SECRET, // use a long, random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 7 * 60 * 60 * 1000,
      expires : Date.now()+ 24 * 7 * 60 * 60 * 1000,
      httpOnly: true,
     }, // Session valid for 10 minutes (in ms)
  })
);





// Setup flash middleware
app.use(flash());
// Global middleware to access flash in templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});



app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use("/pradeepkumar/admin", adminRoutes);
app.use("/pradeepkumar", userRoutes);
app.use("/pradeepkumar/blog", blogRoutes);


app.get("/", (req, res) => {
  req.flash("success", "Welcome to our website");
  res.render("routes/index.ejs");
});



// This should be AFTER all your route handlers
app.use((req, res, next) => {
  res.status(404).render('error/404.ejs');  // Render a 404.ejs or any view you want
});


app.listen(8080, () => {
  console.log("App is listening at the port 8080");
});
