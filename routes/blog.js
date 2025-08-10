 const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const { isLoggedIn, redirectIfLoggedIn ,isAdmin} = require("../middleware.js");
const  flash = require("connect-flash");

// Show all blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("blog/blog.ejs", { blogs });
});

// Show form to create a blog
router.get("/new",isLoggedIn, (req, res) => {
  res.render("blog/blogForm");
});



// Create new blog
router.post("/new", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  await Blog.create({ title, content });
  req.flash("success", "Blog created successfully");
  res.redirect("/pradeepkumar/blog/new");
});

// View single blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("blog/blogDetails", { blog, isAdmin: req.session.isAdmin || false });
});

// DELETE blog
router.post("/:id/delete",isLoggedIn, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.flash("error", "Blog deleted successfully");
    res.redirect("/pradeepkumar/blog");
  } catch (err) {
    req.flash("error", "Something went wrong while deleting the blog.");
    res.status(500).send("Something went wrong while deleting the blog.");
  }
});



module.exports = router;
